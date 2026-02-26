import "dotenv/config";
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
