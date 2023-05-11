import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/BLogsRepo/",
});

// deploying react app with vite and React-Router-Dom
// first: in vite.config.js, after plugins we should write this command: base: "/RepositoryName/"

// second: We use hashRouter for our app.
// third: we install gh-pages --save-dev
