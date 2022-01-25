import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | null = null;

export function getPrisma(): PrismaClient {
  return prisma as PrismaClient;
}

export function initPrisma() {
  prisma = new PrismaClient();
}