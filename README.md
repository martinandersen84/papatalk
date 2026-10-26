# PapaTalk

Tablero de comunicación aumentativa y alternativa (CAA) para pacientes intubados en UCI, con pictogramas ARASAAC, síntesis de voz y navegación por pulsador único (barrido/scanning).

Proyecto personal creado para facilitar la comunicación de un familiar intubado, funciona como **PWA** (instalable, offline-first) pensada para usarse desde un móvil o tablet junto a la cama del hospital.

## Cómo se usa

El paciente se comunica de dos formas, según su capacidad motora:

- **Táctil / ratón** — tocando o haciendo clic directamente en las tarjetas.
- **Pulsador único** — con un solo botón físico o tecla de teclado (por ejemplo un pulsador adaptado conectado como teclado USB), usando barrido automático: el sistema resalta tarjetas una a una y el paciente selecciona con una pulsación larga.

Cada tarjeta seleccionada se lee en voz alta automáticamente (síntesis de voz del sistema, con selector de voz configurable).

## Estructura del tablero

- **General** — frases y necesidades comunes.
- **Dónde duele** — localización del dolor sobre el cuerpo.
- **Qué quiero** — deseos y necesidades (beber, dormir, compañía, etc.).
- **Letras y números** — escritura letra a letra para mensajes libres.
- **Juegos** — mini-juegos para entretenimiento y descanso mental.
- **Curiosidades** — frases curiosas y datos breves organizados por categoría, para distraer o iniciar conversación.

### Sistema de urgencia

El paciente puede activar una alerta visual y sonora de dos formas:

- 5 pulsaciones rápidas en una ventana de tiempo configurable (en el tablero).
- Mantener pulsado 3 segundos o más (en cualquier pantalla, incluida la configuración).

Muestra una pantalla roja con alarma sonora continua hasta que se pulsa cualquier tecla o el botón "Volver".

## Mini-apps / juegos

Cada juego es un archivo HTML autocontenido (sin dependencias externas), navegable desde el tablero principal:

| Archivo | Juego |
|---|---|
| `vuela.html` | Flappy Bird — esquivar tuberías volando |
| `salta.html` | Juego de salto/plataformas |
| `ladrillos.html` | Arkanoid/breakout — romper ladrillos con una pelota |
| `curiosidades.html` | Explorador de curiosidades por categoría, con lectura en voz alta |

Todos los juegos comparten la configuración de teclas del pulsador (leída de `localStorage`), tienen selector de dificultad (fácil/normal/difícil) y música/efectos generados proceduralmente con Web Audio API (sin archivos de audio).

## Arquitectura técnica

- **Sin build ni dependencias**: HTML + CSS + JS vanilla, cada página es autocontenida.
- **PWA**: `manifest.json` + `sw.js` (service worker) para instalación y uso offline.
  - `sw.js` tiene un modo desarrollo (`DEV_MODE = true`, network-only, sin caché) y un modo producción (cache-first). En el repo se queda siempre en desarrollo; el despliegue automático lo pasa a producción y cambia `CACHE_NAME` (ver «Despliegue»).
- **Tipografía**: Atkinson Hyperlegible (Braille Institute, licencia SIL OFL, en `fonts/`), pensada para baja visión.
- **Configuración persistente**: teclas del pulsador, duración de pulsación larga, voz TTS y ventana de urgencia se guardan en `localStorage` (`papatalk-config`).
- **Pictogramas**: `img/pictograms/`, de [ARASAAC](https://arasaac.org) (autor Sergio Palao, © Gobierno de Aragón), licencia CC BY-NC-SA.
- **Guía de estilos**: [`STYLEGUIDE.md`](STYLEGUIDE.md) — paleta de colores, tipografía, componentes, patrones de interacción del pulsador y checklist para crear nuevas mini-apps. Se mantiene actualizada a medida que evoluciona el proyecto.

## Base de datos de curiosidades

En `data/facts/` vive el contenido de la sección "Curiosidades":

- `facts.json` / `facts.jsonl` — 90 frases curadas en 6 categorías (historia, naturaleza, espacio, ciencia, humor, inventos), 15 por categoría.
- `report.md` — informe de validación (totales, duplicados, avisos).
- `batches/` — carpeta para añadir nuevos lotes de frases.

### Scripts de gestión (`scripts/`)

Scripts Python (sin extensión `.py`, ejecutables directamente) para mantener la base de curiosidades:

- `build_curated_facts` — genera el set inicial curado de frases con fuentes verificables.
- `merge_facts_batch` — integra un lote nuevo (`data/facts/batches/*.json`) en `facts.json`/`facts.jsonl`, generando IDs nuevos.
- `validate_facts` — valida el contenido (longitud, duplicados casi-idénticos, mínimo por categoría) y regenera `report.md`.

Flujo para añadir un lote nuevo:

```powershell
python scripts\merge_facts_batch data\facts\batches\nuevo_lote.json
python scripts\validate_facts --strict-minimum
```

## Desarrollo local

El proyecto se sirve como archivos estáticos. Configuración de arranque en `.claude/launch.json`:

```powershell
python -m http.server 8080
```

Durante el desarrollo, el service worker está en modo `DEV_MODE = true` (sin caché) para evitar servir versiones antiguas de los archivos mientras se itera.

## Despliegue

La app se publica en GitHub Pages: **https://martinandersen84.github.io/papatalk/**. Cada push a `master` la publica sola con GitHub Actions (`.github/workflows/deploy.yml`):

1. Pasa `sw.js` e `index.html` a modo producción y pone `CACHE_NAME = 'papatalk-<commit>'`, para que los dispositivos instalados reciban la versión nueva.
2. Copia a `_site/` solo los ficheros de la web (sin `.github/`, `.claude/`, `scripts/`, `data/facts/batches/` ni los `.md`).
3. Lo publica en Pages.

No necesita secretos. También se puede lanzar a mano desde Actions → Deploy → Run workflow.

## Créditos

- Pictogramas: Sergio Palao. Origen: [ARASAAC](https://arasaac.org). Licencia: CC (BY-NC-SA). Propiedad: Gobierno de Aragón.
- Tipografía: Atkinson Hyperlegible, © Braille Institute of America, licencia SIL Open Font License 1.1 (`fonts/OFL.txt`).
- Basado en sistemas CAA (Comunicación Aumentativa y Alternativa) con barrido por pulsador.
