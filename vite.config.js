import { defineConfig } from "vite";
import handler from "./api/contact.js";

/**
 * Vite Dev Server Plugin to handle /api/contact requests locally
 * using the exact same serverless handler and Resend SDK.
 */
function resendApiPlugin() {
  return {
    name: "resend-api-dev-middleware",
    configureServer(server) {
      server.middlewares.use("/api/contact", async (req, res) => {
        try {
          await handler(req, res);
        } catch (err) {
          console.error("[Vite Dev Server API Error]:", err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ success: false, error: "Internal server error" }));
          }
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [resendApiPlugin()],
  server: {
    port: 5173
  }
});
