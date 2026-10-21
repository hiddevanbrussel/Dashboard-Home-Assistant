import { describe, expect, it } from "vitest";
import { resolveUploadFile } from "./upload-path";

describe("resolveUploadFile", () => {
  it("keeps a generated filename inside the upload directory", () => {
    const full = resolveUploadFile("/data/uploads", "171000-abc.jpg");
    expect(full).toBe("/data/uploads/171000-abc.jpg");
  });

  it("rejects traversal, absolute names, and nested paths", () => {
    expect(resolveUploadFile("/data/uploads", "../etc/passwd")).toBeNull();
    expect(resolveUploadFile("/data/uploads", "..")).toBeNull();
    expect(resolveUploadFile("/data/uploads", "/etc/passwd")).toBeNull();
    expect(resolveUploadFile("/data/uploads", "nested/file.jpg")).toBeNull();
  });
});
