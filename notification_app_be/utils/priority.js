// Priority utilities for backend
// computeScore: (typeWeight * 1e9) + timestampSeconds
const TYPE_WEIGHT = { Placement: 3, Result: 2, Event: 1 };
const WEIGHT_MULT = 1000000000;

function computeScore(type, tsSec) {
  const w = TYPE_WEIGHT[type] || 0;
  return w * WEIGHT_MULT + Number(tsSec || 0);
}

// Minimal binary min-heap for objects with .score
class MinHeap {
  constructor() { this.a = []; }
  size() { return this.a.length; }
  peek() { return this.a[0]; }
  push(x) { this.a.push(x); this._up(this.a.length - 1); }
  pop() {
    if (!this.a.length) return undefined;
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length) { this.a[0] = last; this._down(0); }
    return top;
  }
  _up(i) { while (i > 0) { const p = (i - 1) >> 1; if (this.a[p].score <= this.a[i].score) break; [this.a[p], this.a[i]] = [this.a[i], this.a[p]]; i = p; } }
  _down(i) { const n = this.a.length; while (true) { let l = 2 * i + 1, r = l + 1, s = i; if (l < n && this.a[l].score < this.a[s].score) s = l; if (r < n && this.a[r].score < this.a[s].score) s = r; if (s === i) break; [this.a[i], this.a[s]] = [this.a[s], this.a[i]]; i = s; } }
}

// Select top N unread notifications efficiently
// list: [{ID,Type,Message,Timestamp, viewed?}]
// timestampToSec: fn converting Timestamp->seconds
function topNFromUnread(list, N = 10, timestampToSec = (t) => Math.floor(new Date((t || '').replace(' ', 'T') + 'Z').getTime() / 1000)) {
  const heap = new MinHeap();
  for (const n of list) {
    if (n.viewed) continue;
    const ts = timestampToSec(n.Timestamp);
    const score = computeScore(n.Type, ts);
    const item = { score, n };
    if (heap.size() < N) heap.push(item);
    else if (score > heap.peek().score) { heap.pop(); heap.push(item); }
  }
  const out = [];
  while (heap.size()) out.push(heap.pop());
  return out.reverse().map(x => ({ ...x.n, _priorityScore: x.score }));
}

module.exports = { computeScore, topNFromUnread };
