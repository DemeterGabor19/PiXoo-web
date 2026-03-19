import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";

function htmlIncludes() {
  const includePattern = /<!--\s*@include:\s*([^\s]+)\s*-->/g;

  function resolveIncludes(content, fromFile) {
    return content.replace(includePattern, (_, includePath) => {
      const absolutePath = path.resolve(path.dirname(fromFile), includePath);

      if (!fs.existsSync(absolutePath)) {
        throw new Error(`Include file not found: ${absolutePath}`);
      }

      const partialContent = fs.readFileSync(absolutePath, "utf-8");
      return resolveIncludes(partialContent, absolutePath);
    });
  }

  return {
    name: "html-includes",
    transformIndexHtml(html, ctx) {
      if (!ctx.filename) return html;
      return resolveIncludes(html, ctx.filename);
    },
  };
}

export default defineConfig({
  root: "src",
  plugins: [htmlIncludes()],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});
