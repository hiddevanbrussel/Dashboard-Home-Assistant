import path from "node:path";

const SAFE_NAME = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

export function resolveUploadFile(uploadDir: string, name: string): string | null {
  if (!name || name.includes("/") || name.includes("\\") || name.includes("\0")) return null;
  if (!SAFE_NAME.test(name) || name.includes("..")) return null;
  const root = path.resolve(uploadDir);
  const full = path.resolve(root, name);
  if (full !== path.join(root, name)) return null;
  if (!full.startsWith(root + path.sep)) return null;
  return full;
}
