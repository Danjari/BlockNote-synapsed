import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "BlockNoteAISlash",
      fileName: "ai-slash",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["react", "@blocknote/core"],
      output: {
        globals: {
          react: "React",
          "@blocknote/core": "BlockNoteCore",
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
}); 