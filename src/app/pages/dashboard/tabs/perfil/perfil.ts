import { Component, HostListener, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { PerfilService, ResumenPerfil } from '../../../../services/perfil.service';
import { Icono } from '../../../aprender/icono';
import { ligaPara, siguienteLiga } from '../../../../shared/ligas';
import { environment } from '../../../../../environments/environment';

interface Logro {
  titulo: string;
  descripcion: string;
  icono: string;
  color: string;
  actual: number;
  meta: number;
}

type FiltroLogros = 'todos' | 'logrados' | 'pendientes';

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

@Component({
  selector: 'app-perfil',
  imports: [Icono, RouterLink],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private perfilService = inject(PerfilService);
  private router = inject(Router);

  readonly metas = this.perfilService.metasDiarias;

  resumen = signal<ResumenPerfil | null>(null);
  cargando = signal(true);
  error = signal(false);

  // Avisos breves (guardado, errores)
  aviso = signal<{ texto: string; tipo: 'ok' | 'error' } | null>(null);
  private avisoTimer: ReturnType<typeof setTimeout> | null = null;

  // Foto
  subiendoFoto = signal(false);

  // Meta diaria
  guardandoMeta = signal<number | null>(null);

  // Gráfica: día seleccionado (índice 0-6)
  diaActivo = signal<number | null>(null);

  // Logros
  filtro = signal<FiltroLogros>('todos');
  logroAbierto = signal<Logro | null>(null);

  // Editor de perfil
  editando = signal(false);
  formNombre = signal('');
  formBio = signal('');
  formFoto = signal<File | null>(null);
  formPreview = signal<string | null>(null);
  guardando = signal(false);
  errorForm = signal('');

  // ════════ DATOS DERIVADOS ════════

  usuario = computed(() => this.resumen()?.usuario ?? null);

  fotoUrl = computed(() => {
    const foto = this.usuario()?.foto ?? this.authService.currentUser()?.foto;
    return foto ? `${environment.apiUrl.replace('/api', '')}${foto}` : null;
  });

  inicial = computed(() => (this.usuario()?.nombre ?? this.authService.currentUser()?.nombre ?? '?').trim().charAt(0).toUpperCase());

  miembroDesde = computed(() => {
    const fecha = this.usuario()?.creadoEn;
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es', { month: 'long', year: 'numeric' });
  });

  xpTotal = computed(() => this.resumen()?.xpTotal ?? 0);
  liga = computed(() => ligaPara(this.xpTotal()));
  ligaSiguiente = computed(() => siguienteLiga(this.xpTotal()));

  actividad = computed(() => {
    const dias = this.resumen()?.actividad ?? [];
    const max = Math.max(...dias.map((d) => d.xp), this.usuario()?.metaDiaria ?? 0, 1);
    return dias.map((d, i) => {
      const [y, m, dd] = d.fecha.split('-').map(Number);
      const fecha = new Date(y, m - 1, dd);
      return {
        ...d,
        etiqueta: i === dias.length - 1 ? 'Hoy' : DIAS[fecha.getDay()],
        nombreLargo: fecha.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' }),
        altura: (d.xp / max) * 100,
        esHoy: i === dias.length - 1,
      };
    });
  });

  /** Altura (en %) de la línea de la meta diaria dentro de la gráfica. */
  lineaMeta = computed(() => {
    const dias = this.resumen()?.actividad ?? [];
    const meta = this.usuario()?.metaDiaria ?? 0;
    const max = Math.max(...dias.map((d) => d.xp), meta, 1);
    return (meta / max) * 100;
  });

  xpSemana = computed(() => (this.resumen()?.actividad ?? []).reduce((s, d) => s + d.xp, 0));
  xpHoy = computed(() => this.resumen()?.actividad.at(-1)?.xp ?? 0);
  metaDiaria = computed(() => this.usuario()?.metaDiaria ?? 20);
  progresoMeta = computed(() => Math.min(this.xpHoy() / this.metaDiaria(), 1));

  /** Longitud del trazo del anillo de la meta (r = 52). */
  readonly circunferencia = 2 * Math.PI * 52;

  logros = computed<Logro[]>(() => {
    const r = this.resumen();
    if (!r) return [];
    return [
      { titulo: 'Primer paso', descripcion: 'Completa tu primera lección', icono: 'gorro', color: 'verde', actual: r.leccionesCompletadas, meta: 1 },
      { titulo: 'Técnicas esenciales', descripcion: 'Completa 4 lecciones', icono: 'cuchillo', color: 'azul', actual: r.leccionesCompletadas, meta: 4 },
      { titulo: 'Maestro de fondos', descripcion: 'Completa las 8 lecciones de Aprender', icono: 'olla', color: 'morado', actual: r.leccionesCompletadas, meta: 8 },
      { titulo: 'Perfeccionista', descripcion: 'Termina 3 lecciones sin errores', icono: 'diana', color: 'rojo', actual: r.leccionesPerfectas, meta: 3 },
      { titulo: 'Retador', descripcion: 'Completa 5 retos', icono: 'rayo', color: 'oro', actual: r.retosCompletados, meta: 5 },
      { titulo: 'Coleccionista', descripcion: 'Acumula 500 XP', icono: 'estrella', color: 'oro', actual: r.xpTotal, meta: 500 },
      { titulo: 'Constancia', descripcion: 'Gana XP en 5 días distintos', icono: 'reloj', color: 'azul', actual: r.diasActivos, meta: 5 },
    ];
  });

  logrosFiltrados = computed(() => {
    const f = this.filtro();
    return this.logros().filter((l) =>
      f === 'todos' ? true : f === 'logrados' ? l.actual >= l.meta : l.actual < l.meta
    );
  });

  logrosConseguidos = computed(() => this.logros().filter((l) => l.actual >= l.meta).length);

  // ════════ CICLO DE VIDA ════════

  ngOnInit(): void {
    this.cargar();
  }

  ngOnDestroy(): void {
    if (this.avisoTimer) clearTimeout(this.avisoTimer);
    this.liberarPreview();
  }

  cargar(): void {
    this.error.set(false);
    this.perfilService.getResumen().subscribe({
      next: (r) => {
        this.resumen.set(r);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.error.set(true);
      },
    });
  }

  // ════════ FOTO RÁPIDA (botón de cámara) ════════

  cambiarFoto(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const archivo = input.files?.[0];
    input.value = '';
    if (!archivo) return;
    if (!this.fotoValida(archivo)) return;

    this.subiendoFoto.set(true);
    this.perfilService.actualizar({ foto: archivo }).subscribe({
      next: (res) => {
        this.actualizarUsuarioLocal({ foto: res.user.foto });
        this.subiendoFoto.set(false);
        this.mostrarAviso('Foto actualizada', 'ok');
      },
      error: (err) => {
        this.subiendoFoto.set(false);
        this.mostrarAviso(err.error?.error ?? 'No se pudo subir la foto', 'error');
      },
    });
  }

  // ════════ META DIARIA ════════

  elegirMeta(meta: number): void {
    if (meta === this.metaDiaria() || this.guardandoMeta() !== null) return;
    const anterior = this.metaDiaria();
    this.guardandoMeta.set(meta);
    this.actualizarUsuarioLocal({ metaDiaria: meta });

    this.perfilService.actualizar({ metaDiaria: meta }).subscribe({
      next: () => {
        this.guardandoMeta.set(null);
        this.mostrarAviso(`Meta diaria: ${meta} XP`, 'ok');
      },
      error: () => {
        this.guardandoMeta.set(null);
        this.actualizarUsuarioLocal({ metaDiaria: anterior });
        this.mostrarAviso('No se pudo guardar la meta', 'error');
      },
    });
  }

  // ════════ GRÁFICA ════════

  elegirDia(i: number): void {
    this.diaActivo.set(this.diaActivo() === i ? null : i);
  }

  // ════════ LOGROS ════════

  abrirLogro(logro: Logro): void {
    this.logroAbierto.set(logro);
  }

  progresoLogro(l: Logro): number {
    return Math.min(l.actual / l.meta, 1) * 100;
  }

  // ════════ EDITOR ════════

  abrirEditor(): void {
    const u = this.usuario();
    this.formNombre.set(u?.nombre ?? '');
    this.formBio.set(u?.bio ?? '');
    this.formFoto.set(null);
    this.liberarPreview();
    this.errorForm.set('');
    this.editando.set(true);
  }

  cerrarEditor(): void {
    if (this.guardando()) return;
    this.editando.set(false);
    this.liberarPreview();
  }

  elegirFotoForm(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const archivo = input.files?.[0];
    input.value = '';
    if (!archivo || !this.fotoValida(archivo, true)) return;
    this.liberarPreview();
    this.formFoto.set(archivo);
    this.formPreview.set(URL.createObjectURL(archivo));
  }

  guardarPerfil(): void {
    const nombre = this.formNombre().trim();
    if (nombre.length < 2) {
      this.errorForm.set('Escribe un nombre de al menos 2 letras');
      return;
    }

    const u = this.usuario();
    const cambios: { nombre?: string; bio?: string; foto?: File } = {};
    if (nombre !== u?.nombre) cambios.nombre = nombre;
    if (this.formBio().trim() !== (u?.bio ?? '')) cambios.bio = this.formBio().trim();
    if (this.formFoto()) cambios.foto = this.formFoto()!;

    if (Object.keys(cambios).length === 0) {
      this.cerrarEditor();
      return;
    }

    this.guardando.set(true);
    this.errorForm.set('');
    this.perfilService.actualizar(cambios).subscribe({
      next: (res) => {
        this.actualizarUsuarioLocal({ nombre: res.user.nombre, foto: res.user.foto, bio: res.bio });
        this.guardando.set(false);
        this.editando.set(false);
        this.liberarPreview();
        this.mostrarAviso('Perfil guardado', 'ok');
      },
      error: (err) => {
        this.guardando.set(false);
        this.errorForm.set(err.error?.error ?? 'No se pudo guardar. Revisa tu conexión.');
      },
    });
  }

  @HostListener('document:keydown.escape')
  alPresionarEscape(): void {
    if (this.logroAbierto()) this.logroAbierto.set(null);
    else if (this.editando()) this.cerrarEditor();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // ════════ AYUDANTES ════════

  private fotoValida(archivo: File, enFormulario = false): boolean {
    const mensaje = !archivo.type.startsWith('image/')
      ? 'Elige una imagen (jpg, png, gif o webp)'
      : archivo.size > 5 * 1024 * 1024
        ? 'La imagen no puede pesar más de 5 MB'
        : '';
    if (!mensaje) return true;
    if (enFormulario) this.errorForm.set(mensaje);
    else this.mostrarAviso(mensaje, 'error');
    return false;
  }

  private actualizarUsuarioLocal(cambios: Partial<ResumenPerfil['usuario']>): void {
    this.resumen.update((r) => (r ? { ...r, usuario: { ...r.usuario, ...cambios } } : r));
  }

  private liberarPreview(): void {
    const url = this.formPreview();
    if (url) URL.revokeObjectURL(url);
    this.formPreview.set(null);
  }

  private mostrarAviso(texto: string, tipo: 'ok' | 'error'): void {
    if (this.avisoTimer) clearTimeout(this.avisoTimer);
    this.aviso.set({ texto, tipo });
    this.avisoTimer = setTimeout(() => this.aviso.set(null), 2600);
  }
}
