import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: ".",
  publicDir: "public",
  server: {
    port: 3001,
    open: true,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "test.html"),
      },
    },
  },
  optimizeDeps: {
    include: ["@blocknote/core", "@blocknote/mantine"],
  },
});
