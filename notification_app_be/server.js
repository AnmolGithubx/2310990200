const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { topNFromUnread } = require('./utils/priority');

const REMOTE = 'http://20.207.122.201/evaluation-service/notifications';
const app = express();
app.use(cors());
app.use(express.json());

// In-memory store
const store = {
  notifications: new Map(), // id -> {ID, Type, Message, Timestamp, viewed}
  loading: false,
  error: null,
  lastFetched: 0,
};

function toSeconds(ts) {
  if (!ts) return Math.floor(Date.now() / 1000);
  try { return Math.floor(new Date(ts.replace(' ', 'T') + 'Z').getTime() / 1000); } catch (e) { return Math.floor(Date.now() / 1000); }
}

// Fetch from remote and merge into store (keep viewed flag)
async function fetchAndMerge() {
  store.loading = true;
  store.error = null;
  try {
    const res = await axios.get(REMOTE, { timeout: 5000 });
    const list = (res.data && res.data.notifications) || [];
    for (const n of list) {
      const ex = store.notifications.get(n.ID);
      store.notifications.set(n.ID, { ID: n.ID, Type: n.Type, Message: n.Message, Timestamp: n.Timestamp, viewed: ex ? ex.viewed : false });
    }
    store.lastFetched = Date.now();
  } catch (err) {
    store.error = err.message || 'fetch_error';
  } finally {
    store.loading = false;
  }
}

// GET all notifications
app.get('/notifications', async (req, res) => {
  await fetchAndMerge();
  if (store.error) return res.status(502).json({ loading: store.loading, error: store.error, notifications: [] });
  const arr = Array.from(store.notifications.values()).sort((a,b) => toSeconds(b.Timestamp) - toSeconds(a.Timestamp));
  res.json({ loading: store.loading, error: null, notifications: arr });
});

// GET top priority unread
app.get('/notifications/priority', async (req, res) => {
  const limit = Math.max(1, parseInt(req.query.limit || '10', 10));
  await fetchAndMerge();
  if (store.error) return res.status(502).json({ loading: store.loading, error: store.error, notifications: [] });
  const all = Array.from(store.notifications.values());
  const top = topNFromUnread(all, limit, (t) => toSeconds(t));
  res.json({ loading: store.loading, error: null, notifications: top });
});

// PATCH mark viewed
app.patch('/notifications/:id/viewed', (req, res) => {
  const id = req.params.id;
  const n = store.notifications.get(id);
  if (!n) return res.status(404).json({ error: 'not_found' });
  n.viewed = true;
  store.notifications.set(id, n);
  res.json({ success: true, notification: n });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server listening on', PORT));
