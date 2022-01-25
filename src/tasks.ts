import { SSE } from './sse';

let nextId = 0;
const tasks = new Map<number, Status>();
const sseConnections = new Map<number, SSE>();

export enum Status {
  FINISHED = 'FINISHED',
  ERROR = 'ERROR',
  PENDING = 'PENDING'
}

export function addTask(): number {
  const id = nextId;
  tasks.set(id, Status.PENDING);
  nextId += 1;
  return id;
}

export function finishTask(id: number) {
  tasks.set(id, Status.FINISHED);
  const sse = sseConnections.get(id);
  sse?.send(Status.FINISHED);
  sseConnections.delete(id);
}

export function failTask(id: number) {
  tasks.set(id, Status.ERROR);
  const sse = sseConnections.get(id);
  sse?.send(Status.ERROR);
  sseConnections.delete(id);
}

export function subscribeToTask(taskId: number, sse: SSE) {
  if (!tasks.has(taskId)) {
    throw new Error(`Task with id ${taskId} does not exist!`);
  }
  const task = tasks.get(taskId);
  if (task === Status.FINISHED) {
    sse.send(Status.FINISHED);
  } else {
    sseConnections.set(taskId, sse);
    sse.send(`${task}`);
  }
}