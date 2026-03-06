import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Editor (heaviest)
          'vendor-editor': [
            '@tiptap/react',
            '@tiptap/starter-kit',
            '@tiptap/extension-code-block-lowlight',
            '@tiptap/extension-image',
            '@tiptap/extension-table',
            '@tiptap/extension-table-row',
            '@tiptap/extension-table-cell',
            '@tiptap/extension-table-header',
            '@tiptap/extension-link',
            '@tiptap/extension-placeholder',
            '@tiptap/extension-highlight',
            '@tiptap/extension-color',
            '@tiptap/extension-text-style',
            '@tiptap/extension-underline',
            '@tiptap/extension-task-list',
            '@tiptap/extension-task-item',
            'lowlight',
          ],
          // Emoji picker
          'vendor-emoji': ['@emoji-mart/data', '@emoji-mart/react', 'emoji-mart'],
          // Supabase + state
          'vendor-data': ['@supabase/supabase-js', 'zustand', 'immer', '@tanstack/react-query'],
        },
      },
    },
  },
})
