import { resolve } from "path";

const config = {
  server: {
    port: 3002,
    hmr: true,
    watch: {
      usePolling: true,
    },
  },
  build: {
    target: ["chrome58", "firefox57", "safari11", "edge79"],
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "Marquee",
      formats: ["cjs", "esm", "iife"],
      fileName: (format) => {
        let jsExtension = ".cjs";

        if (format === "esm") {
          jsExtension = ".mjs";
        }

        if (format === "iife") {
          jsExtension = ".global.min.js";
        }
        return `index${jsExtension}`;
      },
    },
  },
};

export default config;
