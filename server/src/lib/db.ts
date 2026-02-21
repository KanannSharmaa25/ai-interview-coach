import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    'DATABASE_URL is required. Set it in server/.env (see server/.env.example). For a quick local DB: postgresql://localhost:5432/ai_interview_coach'
  );
}

const adapter = new PrismaPg({ connectionString });
export const prisma = globalThis.prisma ?? new PrismaClient({ adapter });
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
