// dotenv niet importeren: in Docker komt DATABASE_URL uit ENV; lokaal uit .env (Next.js laadt die)
import path from "node:path";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: path.join(process.cwd(), "prisma", "schema.prisma"),
  migrations: {
    path: path.join(process.cwd(), "prisma", "migrations"),
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
