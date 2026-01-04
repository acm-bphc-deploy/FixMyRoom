import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
              if (id.includes('jspdf')) return 'vendor_jspdf';
              if (id.includes('jspdf-autotable')) return 'vendor_jspdf_autotable';
              if (id.includes('html2canvas')) return 'vendor_html2canvas';
              if (id.includes('canvg')) return 'vendor_canvg';
              if (id.includes('dompurify') || id.includes('purify')) return 'vendor_purify';
              if (id.includes('lucide-react')) return 'vendor_icons';
              if (id.includes('react-dom') || id.includes('/react/') || id.includes('react/')) return 'vendor_react';
              if (id.includes('@supabase')) return 'vendor_supabase';
              if (id.includes('tailwind-merge')) return 'vendor_utils';
              return 'vendor';
            }
        },
      },
    },
  },
})
