import { defineConfig } from 'vite';

export default defineConfig({
  root: process.argv[2] ? undefined : 'demo',
  build: {
    sourcemap: true,
    lib: {
      entry: 'src/index.ts',
      name: 'SuperPlayer',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
