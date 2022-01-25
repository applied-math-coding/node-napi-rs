import express from 'express';
import multer from 'multer';
import { addTask, subscribeToTask } from './tasks';
import { computeLongestIncreasing, findIncreasingSequenceById, findIncreasingSequences } from './longest-increasing';
import { SSE } from './sse';
const SSEFactory = require('express-sse');
import { execSync } from 'child_process';
import { initPrisma } from './prisma-client';
import waitPort from 'wait-port';

const app = express();
const port = 3000;

app.use(express.static('public'));

app.post('/sequences', multer().single('sequences'), (req, resp, next) => {
  const taskId = addTask();
  computeLongestIncreasing(req.file?.buffer as Buffer, taskId).catch(next);
  resp.status(200).json({ taskId });
});

app.get('/tasks/:id/subscribe', (req, resp) => {
  const sse: SSE = new SSEFactory();
  (resp as any).flush = () => { }; // fixing bug in express-sse
  sse.init(req, resp);
  subscribeToTask(parseInt(req.params.id, 10), sse);
});

app.get('/increasing-sequences', async (_, resp, next) => {
  resp.json(await findIncreasingSequences().catch(next));
});

app.get('/increasing-sequences/:id', async (req, resp, next) => {
  resp.json(await findIncreasingSequenceById(parseInt(req.params.id, 10)).catch(next));
});

waitPort({
  host: 'db',
  port: 5432
}).then(() => {
  console.log(execSync('npx prisma db push').toString());
  initPrisma();
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  });
});







