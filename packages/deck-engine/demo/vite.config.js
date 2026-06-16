import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { deckPlugin, tailwindPlugin } from "@deckio/deck-engine/vite";

export default defineConfig({
  plugins: [
    react({
      include: [/\.[jt]sx?$/, /node_modules\/@deckio\/deck-engine\/.+\.jsx$/],
    }),
    deckPlugin({ inlineEditing: true }),
    tailwindPlugin(),
  ],
  server: {
    fs: {
      allow: ["..", "../..", "../../.."],
    },
  },
});
