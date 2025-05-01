import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import process from "process";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return {
    plugins: [react(), tsconfigPaths()],
    resolve: { alias: { "~": "/src" } },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
        },
      },
      allowedHosts: [env.VITE_PUBLIC_URL],
    },
  };
});
