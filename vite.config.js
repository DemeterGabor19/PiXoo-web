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

function getHtmlInputs() {
  const srcDir = path.resolve(process.cwd(), "src");

  return fs
    .readdirSync(srcDir)
    .filter((fileName) => fileName.endsWith(".html"))
    .reduce((inputs, fileName) => {
      const name = fileName.replace(/\.html$/, "");
      inputs[name] = path.resolve(srcDir, fileName);
      return inputs;
    }, {});
}

function copyStaticAssets() {
  const assetDirs = ["images", "icons"];
  let resolvedOutDir = path.resolve(process.cwd(), "dist");

  return {
    name: "copy-static-assets",
    configResolved(config) {
      resolvedOutDir = path.resolve(config.root, config.build.outDir);
    },
    writeBundle() {
      const srcAssetsDir = path.resolve(process.cwd(), "src/assets");
      const distAssetsDir = path.resolve(resolvedOutDir, "assets");

      for (const dirName of assetDirs) {
        const from = path.join(srcAssetsDir, dirName);
        const to = path.join(distAssetsDir, dirName);

        if (!fs.existsSync(from)) {
          continue;
        }

        fs.cpSync(from, to, {
          recursive: true,
          force: true,
        });
      }
    },
  };
}

export default defineConfig({
  root: "src",
  base: "./",
  plugins: [htmlIncludes(), copyStaticAssets()],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: getHtmlInputs(),
    },
  },
});
