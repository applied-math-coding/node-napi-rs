export function findIncreasingSequences() {
  return fetch('increasing-sequences', { method: 'GET' })
    .then(r => r.json());
}

export function findIncreasingSequenceById(id) {
  return fetch(`increasing-sequences/${encodeURIComponent(id)}`, { method: 'GET' })
    .then(r => r.json());
}