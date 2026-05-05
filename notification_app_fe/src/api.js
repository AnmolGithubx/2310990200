const BASE = import.meta.env.VITE_API || 'http://localhost:4000';
export async function fetchAll() { const r = await fetch(`${BASE}/notifications`); return r.json(); }
export async function fetchPriority(limit=10){ const r = await fetch(`${BASE}/notifications/priority?limit=${limit}`); return r.json(); }
export async function markViewed(id){ const r = await fetch(`${BASE}/notifications/${id}/viewed`, { method: 'PATCH' }); return r.json(); }
