
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
        },

    },
})
