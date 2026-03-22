import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const env = loadEnv("development", process.cwd(), "");

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  server: {
    host: true,
    port: 3000,
  },
  define: {
    API_URL: JSON.stringify(env.API_URL),
  },
});
