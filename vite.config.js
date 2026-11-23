import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/Rick-y-Morty-Total-Mania/",    

  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        avisoLegal: resolve(import.meta.dirname, 'pages/aviso-legal.html'),
        episodios: resolve(import.meta.dirname, 'pages/episodios.html'),
        favoritos: resolve(import.meta.dirname, 'pages/favoritos.html'),
        localizaciones: resolve(import.meta.dirname, 'pages/localizaciones.html'),
        personajes: resolve(import.meta.dirname, 'pages/personajes.html'),
      },
    },
  },
});
