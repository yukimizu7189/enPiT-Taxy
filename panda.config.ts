import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  preflight: true,
  include: ["./app/**/*.{js,jsx,ts,tsx}"],
  exclude: [],
  jsxFramework: "react",
  outdir: "styled-system",
  conditions: {
    phone: "@media (max-width: 480px)",
  },
  globalCss: {
    "html, body": {
      margin: 0,
      minHeight: "100%",
      fontFamily: "sans",
      background: "taxy.ink",
      color: "taxy.cream",
    },
  },
  theme: {
    extend: {
      tokens: {
        colors: {
          taxy: {
            ink: { value: "#12141a" },
            panel: { value: "#1a1d26" },
            amber: { value: "#f0b429" },
            cream: { value: "#f7f4ef" },
            muted: { value: "#8b909c" },
            body: { value: "#5c616c" },
          },
        },
        fonts: {
          sans: {
            value:
              '"Noto Sans JP", ui-sans-serif, system-ui, sans-serif',
          },
          display: {
            value:
              '"Outfit", "Noto Sans JP", ui-sans-serif, system-ui, sans-serif',
          },
        },
      },
    },
  },
});
