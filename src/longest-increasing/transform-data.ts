import { parentPort } from 'worker_threads';

parentPort?.on('message', (data: ArrayBuffer) => {
  const sequences = Buffer.from(data).toString().split('\n')
    .map(s => s.split(','))
    .map(s => s.map(c => parseInt(c, 10)));
  parentPort?.postMessage(sequences);
});

