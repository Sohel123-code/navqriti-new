import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), {
    name: "detail-page-entries",
    enforce: "post",
    generateBundle(_, bundle) {
      // A real HTML entry keeps /ai/ refreshes working on static hosts too.
      const home = bundle["index.html"];
      if (home) this.emitFile({ type: "asset", fileName: "contact/index.html", source: String(home.source).replace(/<title>.*?<\/title>/, "<title>NavQriti - Partnerships</title>").replace('content="#f7f7f5"', 'content="#050505"') });
      if (home) this.emitFile({ type: "asset", fileName: "ai/index.html", source: String(home.source).replace("NavQriti — Creating What Comes Next.", "NavQriti AI — From Access to Understanding").replace('content="#f7f7f5"', 'content="#000000"') });
      if (home) this.emitFile({ type: "asset", fileName: "quantum/index.html", source: String(home.source).replace("NavQriti — Creating What Comes Next.", "NavQriti Quantum — A new field of possibility").replace('content="#f7f7f5"', 'content="#050505"') });
    },
  }],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          motion: ["gsap", "framer-motion", "lenis"],
        },
      },
    },
  },
});
