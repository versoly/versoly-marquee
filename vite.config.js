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
    target: [
      "chrome" + "109",
      "firefox" + "135",
      "safari" + "17",
      "edge" + "135",
    ],
    lib: {
      entry: resolve(__dirname, "src/index.js"),
      name: "Marquee",
      formats: ["cjs", "esm", "iife"],
      minify: "oxc",
      fileName: (format) => {
        let jsExtension = ".cjs";

        if (format === "esm") {
          jsExtension = ".mjs";
        }

        if (format === "iife") {
          jsExtension = ".iife.js";
        }
        return `versoly-marquee${jsExtension}`;
      },
    },
  },
};

export default config;
