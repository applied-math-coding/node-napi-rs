import { Worker } from 'worker_threads';
import { createLongestIncreasingSubSequences } from '../../algorithms';
import { failTask, finishTask } from '../tasks';
import { IncreasingSequence } from '@prisma/client';
import { getPrisma } from '../prisma-client';

export async function computeLongestIncreasing(data: Buffer, taskId: number) {
  try {
    const sequences = await new Promise<number[][]>(resolve => {
      const worker = new Worker(`${__dirname}/transform-data.js`);
      worker.postMessage(data, [data.buffer]);
      worker.on('message', seqs => resolve(seqs));
    });
    const longestIncreasing = await createLongestIncreasingSubSequences(sequences);
    await getPrisma().increasingSequence.create({
      data: {
        created_at: new Date(),
        sequences: JSON.stringify(longestIncreasing)
      }
    });
    finishTask(taskId);
  } catch (e) {
    failTask(taskId);
    throw e;
  }
}

export function findIncreasingSequences(): Promise<Partial<IncreasingSequence>[]> {
  return getPrisma().increasingSequence.findMany({
    select: {
      id: true,
      created_at: true
    },
    orderBy: {
      created_at: 'desc'
    }
  });
}

export function findIncreasingSequenceById(id: number): Promise<IncreasingSequence | null> {
  return getPrisma().increasingSequence.findUnique({
    where: { id }
  });
}