import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// El navegador restaura por su cuenta el scroll (history.scrollRestoration
// = 'auto') al recargar o reactivar la pestaña, antes de que Angular
// termine de inicializar. Eso hace que la página cargue ya desplazada en
// vez de arriba. El Router maneja el scroll en sus propias navegaciones,
// así que desactivamos la restauración nativa del navegador.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
