import { Component, input } from '@angular/core';

/**
 * Iconos SVG propios de la sección Aprender.
 * Usan currentColor, así que toman el color del texto del contenedor.
 */
@Component({
  selector: 'app-icono',
  template: `
    <svg
      [attr.width]="tamano()"
      [attr.height]="tamano()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      @switch (nombre()) {
        @case ('play') {
          <svg:path fill="currentColor" stroke-width="1.5" d="M8 5.6v12.8a1.2 1.2 0 0 0 1.8 1l10-6.4a1.2 1.2 0 0 0 0-2L9.8 4.6A1.2 1.2 0 0 0 8 5.6z" />
        }
        @case ('check') {
          <svg:path stroke-width="3.5" d="M5 12.5l4.5 4.5L19 7.5" />
        }
        @case ('candado') {
          <svg:path stroke-width="3" d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
          <svg:rect fill="currentColor" stroke="none" x="5" y="10" width="14" height="11" rx="3" />
        }
        @case ('cerrar') {
          <svg:path stroke-width="3" d="M6 6l12 12M18 6L6 18" />
        }
        @case ('cuchillo') {
          <svg:path fill="currentColor" stroke-width="1.5" d="M20.5 3.5c-3.6.5-7.6 3.5-11 8l3 3c4-3.5 7.5-7.4 8-11z" />
          <svg:path stroke-width="3.6" d="M10.8 13.2L4.5 19.5" />
        }
        @case ('chaira') {
          <svg:path stroke-width="2.6" d="M9 15L20 4" />
          <svg:path stroke-width="2.6" d="M5.8 12.8l5.4 5.4" />
          <svg:path stroke-width="4" d="M8 16l-3.6 3.6" />
        }
        @case ('puesto') {
          <svg:rect fill="currentColor" stroke="none" x="2.5" y="8" width="5.5" height="11" rx="1.6" />
          <svg:rect fill="currentColor" stroke="none" x="9.25" y="8" width="5.5" height="11" rx="1.6" opacity="0.6" />
          <svg:rect fill="currentColor" stroke="none" x="16" y="8" width="5.5" height="11" rx="1.6" />
          <svg:path stroke-width="2.4" d="M2.5 5h19" />
        }
        @case ('zanahoria') {
          <svg:path fill="currentColor" stroke="none" d="M15.8 8.2a4.1 4.1 0 0 0-5.8 0L3.7 18.6c-.7 1.1.6 2.4 1.7 1.7L15.8 14a4.1 4.1 0 0 0 0-5.8z" />
          <svg:path stroke-width="2.4" d="M16.5 7.5L20 4M15.3 5.6V2.8M18.4 8.7h2.8" />
        }
        @case ('gorro') {
          <svg:path fill="currentColor" stroke="none" d="M7 15a4 4 0 0 1-.7-7.9A5.6 5.6 0 0 1 12 3a5.6 5.6 0 0 1 5.7 4.1A4 4 0 0 1 17 15v1.5H7z" />
          <svg:rect fill="currentColor" stroke="none" x="7" y="17.8" width="10" height="3.2" rx="1.2" />
        }
        @case ('trofeo') {
          <svg:path fill="currentColor" stroke="none" d="M7 3.5h10V9a5 5 0 0 1-10 0z" />
          <svg:path stroke-width="2.2" d="M7 5.5H5.2a2.2 2.2 0 0 0 0 4.4H7.4M17 5.5h1.8a2.2 2.2 0 0 1 0 4.4h-2.2" />
          <svg:rect fill="currentColor" stroke="none" x="10.8" y="13" width="2.4" height="4" />
          <svg:rect fill="currentColor" stroke="none" x="7.5" y="17" width="9" height="3.5" rx="1.2" />
        }
        @case ('estrella') {
          <svg:path fill="currentColor" stroke-width="2" d="M12 3.4l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.7l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" />
        }
        @case ('reintentar') {
          <svg:path stroke-width="2.8" d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
          <svg:path stroke-width="2.8" d="M4.5 3.8v4.5H9" />
        }
        @case ('olla') {
          <svg:path stroke-width="2.2" d="M9 6c0-1.2 1.2-1.2 1.2-2.6M14 6c0-1.2 1.2-1.2 1.2-2.6" />
          <svg:path stroke-width="2.6" d="M3 9.5h18M2 12.5h2M20 12.5h2" />
          <svg:path fill="currentColor" stroke="none" d="M4.5 10.5h15V17a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3z" />
        }
        @case ('hueso') {
          <svg:path stroke-width="3.4" d="M8 16l8-8" />
          <svg:circle fill="currentColor" stroke="none" cx="5.8" cy="15.6" r="2.5" />
          <svg:circle fill="currentColor" stroke="none" cx="8.4" cy="18.2" r="2.5" />
          <svg:circle fill="currentColor" stroke="none" cx="15.6" cy="5.8" r="2.5" />
          <svg:circle fill="currentColor" stroke="none" cx="18.2" cy="8.4" r="2.5" />
        }
        @case ('muslo') {
          <svg:path fill="currentColor" stroke="none" d="M14.8 3a6.2 6.2 0 0 1 4.4 10.6c-1.9 1.9-4.6 2.3-6.8 1.4L10 17.4l-2.2-1.6-1.6-2.2L8.6 11c-.9-2.2-.5-4.9 1.4-6.8A6.2 6.2 0 0 1 14.8 3z" />
          <svg:path stroke-width="2.6" d="M9.5 14.5L6 18" />
          <svg:circle fill="currentColor" stroke="none" cx="4.6" cy="17.6" r="1.9" />
          <svg:circle fill="currentColor" stroke="none" cx="6.4" cy="19.4" r="1.9" />
        }
        @case ('tazon') {
          <svg:path stroke-width="2.2" d="M9.5 7.5c0-1.4 1.4-1.4 1.4-3M13.5 7.5c0-1.4 1.4-1.4 1.4-3" />
          <svg:path fill="currentColor" stroke="none" d="M3 10.5h18c0 4.5-3.6 8.2-8.1 8.2h-1.8C6.6 18.7 3 15 3 10.5z" />
          <svg:rect fill="currentColor" stroke="none" x="8" y="19" width="8" height="2.2" rx="1.1" />
        }
        @case ('diana') {
          <svg:circle stroke-width="2.4" cx="12" cy="12" r="8.5" />
          <svg:circle stroke-width="2.4" cx="12" cy="12" r="4.5" />
          <svg:circle fill="currentColor" stroke="none" cx="12" cy="12" r="1.6" />
        }
      }
    </svg>
  `,
  styles: `
    :host { display: inline-flex; line-height: 0; }
  `,
})
export class Icono {
  nombre = input.required<string>();
  tamano = input(24);
}
