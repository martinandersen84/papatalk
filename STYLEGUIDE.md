# PapaTalk — Guía de Estilos

Referencia de diseño para mantener coherencia visual y funcional en todas las pantallas y mini-apps del proyecto.

---

## 1. Identidad

| Propiedad | Valor |
|---|---|
| Nombre | PapaTalk |
| Idioma | Español (`lang="es"`) |
| Tipografía (tablero) | **Atkinson Hyperlegible** 400/700, servida desde `fonts/` (sin Google Fonts, funciona offline), con fallback `-apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif`. Variable `--font` |
| Tipografía (mini-apps) | `system-ui, -apple-system, sans-serif` |
| Fondo general | `#f2f4f1` (`--page`) |
| Texto principal | `#1d2420` (`--ink`) |
| Color primario (marca) | `#2E7D32` (verde oscuro) |
| theme-color | `#2E7D32` |

---

## 2. Paleta de colores

### Colores del sistema (CSS custom properties en `index.html`)

```css
:root {
  --green:  #43A047;   /* General, confirmación */
  --red:    #E53935;   /* Cuerpo/dolor, negación, borrar */
  --blue:   #1E88E5;   /* "Quiero" */
  --orange: #FF8F00;   /* Letras y números */
}
```

### Colores por grupo/categoría

Cada grupo define tres variables en sus tarjetas (`.card[data-group="…"]` y `[data-color="…"] .card`):
`--c` (texto del nombre del grupo), `--line` (borde de la tarjeta) y `--tint` (franja del nombre).

| Grupo | `--c` | `--line` | `--tint` | Uso |
|---|---|---|---|---|
| `general` | `#2E7D32` | `#9CCB9E` | `#E6F2E6` | Tarjetas de comunicación general |
| `cuerpo` | `#C62828` | `#EBA3A0` | `#FBE8E7` | "Dónde duele" |
| `quiero` | `#1565C0` | `#9DBDE6` | `#E4EEFA` | "Qué quiero" |
| `letras_numeros` | `#E65100` | `#F3B98A` | `#FFF0DF` | Letras y números |
| `juegos` | `#6A1B9A` | `#C7A2DA` | `#F2E7F7` | Mini-juegos |
| `curiosidades` | `#00838F` | `#8FCBD0` | `#DFF3F4` | Curiosidades |

`DATA[].color` (color del overlay de selección y del título) usa el mismo `--c` del grupo. No usar `color-mix()`: algunas tablets antiguas no lo soportan.

### Colores semánticos

| Uso | Color | Contexto |
|---|---|---|
| Sí | fondo `#E6F4E7`, franja `#CDEBCF`, borde `#2E7D32` | Tarjeta de afirmación |
| No | fondo `#FCEBEA`, franja `#F8D3D1`, borde `#C62828` | Tarjeta de negación |
| Letras | fondo `--tint` de `letras_numeros` | Tarjetas de escritura |
| Writer bar | fondo `#FFF8E1`, borde `#FF8F00` | Barra de texto escrito |
| Urgencia | fondo `#D32F2F` ↔ `#B71C1C` | Alarma pulsante |
| Urgencia info | fondo `#FFF5F5`, borde `#FFCDD2` | Recuadro informativo setup |
| Scan highlight | `#FFD600` ↔ `#FF6F00` | Resaltado del barrido |

---

## 3. Tipografía

| Elemento | Tamaño | Peso | Color |
|---|---|---|---|
| Logo setup | 36px | 900 | `#2E7D32` |
| Subtítulo setup | 15px | normal | `#666` |
| Sección h2 | 16px | 700 | `#333` |
| Sección párrafo | 14px | normal | `#555` |
| Labels | 15px | 600 | `#444` |
| Botón principal | 22px | 700 | `#fff` |
| Botón secundario | 17px | 700 | `#555` |
| Nombre de tarjeta | `clamp(13px, 2.2vw, 20px)` | 700 | `--ink` |
| Nombre de grupo | `clamp(18px, 3vw, 28px)` | 700 | `--c` del grupo |
| Ayuda de tecla (setup) | 13px | normal | `#777` |
| Título header | `clamp(20px, 3.5vw, 30px)` | 700 | `#333` |
| Overlay selección | `clamp(28px, 5vw, 48px)` | 700 | `#fff` |
| Overlay urgencia | `clamp(52px, 12vw, 96px)` | 900 | `#fff` |
| Slider value | 16px | 700 | `#2E7D32` |

---

## 4. Componentes

### 4.1 Tarjetas (`.card`)

Una sola forma de tarjeta en todo el tablero:

```css
background: #fff;
border-radius: 24px;
border: 2px solid var(--line);          /* color suave del grupo */
box-shadow: var(--card-shadow);         /* 0 1px 2px …06, 0 6px 18px …07 */
padding: 12px 12px 0;
gap: 8px;
```

- El nombre (`span`) es una franja a todo el ancho al pie de la tarjeta: `background: var(--tint)`, texto `--ink` (o `--c` en las tarjetas de grupo).
- Feedback táctil: `:active { transform: scale(.94); }`
- Contienen `<img>` + `<span>` centrados en columna
- Tarjetas de letra (`.card--letter`): sin franja, `padding-bottom: 12px`; en la rejilla de letras, fondo `--tint`.
- Tarjetas en fila (`.grid--few` y `.card--ocio` en horizontal): el nombre va al lado del pictograma, sin franja, en color `--c`.
- Pictogramas siempre de ARASAAC (también los de grupo: `group_juegos.png` = 37464, `group_curiosidades.png` = 6019, a 300 px). Los emoji quedan solo para las tarjetas de cada juego.
- Animación de entrada: `fadeIn .2s ease` con delays escalonados (`.03s` por tarjeta)

### 4.2 Pantalla de configuración

Estructura: `.setup-top` (marca `.setup-brand` + `.setup-go` con «Comenzar») y `.setup-cols` con las secciones en este orden: **Pulsador**, **Llamada de urgencia**, **Síntesis de voz**, **Cómo funciona**.

| Ancho | `.setup-cols` | Cabecera |
|---|---|---|
| < 700px | 1 columna, máx. 500px | apilada y centrada |
| ≥ 700px | `column-count: 2`, máx. 1040px | marca a la izquierda, «Comenzar» (340px) a la derecha |
| ≥ 1100px | `column-count: 3`, máx. 1240px | igual |

- Cada sección lleva `break-inside: avoid` para no partirse entre columnas.
- En «Pulsador», cada tecla es una `.key-row` con `.key-info` (`.key-label` + `.key-hint`, qué hace la pulsación corta y la larga) y el botón `.key-btn`; la fila hace `flex-wrap` para que en 320px el botón baje de línea en vez de desbordar.
- En la configuración el pulsador solo sirve para «Comenzar» (tecla avanzar) y para la urgencia mantenida; no recorre los controles.

### 4.2b Secciones de setup (`.setup-section`)

```css
width: 100%;
background: #fff;
border-radius: 20px;
padding: 20px;
margin-bottom: 16px;
box-shadow: var(--card-shadow);
break-inside: avoid;
```

- Variante urgencia: `background: #FFF5F5; border: 2px solid #FFCDD2;`
- Título con icono emoji + texto, `display: flex; gap: 8px;`

### 4.3 Botón principal (`.btn-start`)

```css
padding: 18px;
font-size: 22px;
font-weight: 700;
border: none;
border-radius: 999px;
background: #2E7D32;
color: #fff;
```

- `:active { background: #1B5E20; transform: scale(.97); }`

### 4.4 Botón secundario (`.btn-test`)

```css
padding: 14px;
font-size: 17px;
font-weight: 700;
border: 2px solid #ddd;
border-radius: 999px;
background: #fff;
color: #555;
```

- Los botones del setup y el «◀ Volver» del tablero son píldoras (`border-radius: 999px`) y heredan la fuente (`font: inherit`).

### 4.5 Sliders (`.duration-row` + `.slider-wrap`)

```css
/* Track */
height: 6px;
background: #ddd;
border-radius: 3px;

/* Thumb */
width: 24px; height: 24px;
border-radius: 50%;
background: #2E7D32;
```

- Label arriba, slider + valor a la derecha en flex row
- Valor mostrado en `font-weight: 700; color: #2E7D32;`

### 4.6 Scan highlight (`.scan-highlight`)

```css
outline: 6px solid #FFD600;
outline-offset: 4px;
box-shadow: 0 0 0 4px var(--ink), 0 0 18px 6px rgba(255, 214, 0, .55);
animation: scanPulse 1s ease-in-out infinite;
```

- Pulsa entre amarillo (`#FFD600`) y naranja oscuro (`#FF6F00`)
- El anillo oscuro (`0 0 0 4px var(--ink)`) separa el amarillo de la tarjeta para que destaque sobre los tintes; mantenerlo también en los fotogramas de `scanPulse`.

---

## 5. Layout y responsive

### Viewport y seguridad

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
```

```css
:root {
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
}
```

- Altura: `100vh` con fallback `100dvh`
- `overflow: hidden` en html/body
- Padding top/bottom respeta safe areas

### Grids del tablero

| Grid | Vertical | Horizontal (≥ 700px) |
|---|---|---|
| Grupos (`.grid--groups`) | 2 columnas, filas `1fr 1fr .5fr`: los 4 de comunicación grandes y Juegos/Curiosidades en una franja baja | 4 columnas, filas `1fr .42fr`: los 4 de comunicación en fila y el ocio (`.card--ocio`, `span 2`) debajo, con el nombre al lado |
| Items (`.grid--items`) | 3 × 3 | 3 × 3 |
| Pocas tarjetas (`.grid--few`, ≤ 3 items, p. ej. Juegos) | 1 columna × 3 filas, tarjetas en fila | 3 columnas × 1 fila |
| Subgrupos | 2 × 2 | 2 × 2 |
| Letras | 3 × auto (última centrada) | igual |

- Los grupos de ocio se marcan con `ocio: true` en `DATA`; `showGroups()` les pone la clase `.card--ocio`.
- El orden del barrido es siempre el del DOM (lectura), así que cualquier rejilla nueva debe seguir el orden de izquierda a derecha y de arriba abajo.

### Media queries

- `orientation: landscape`: `.grid--few` en fila
- `orientation: landscape` + `min-width: 700px`: rejilla de grupos de 4 columnas
- `min-width: 700px` / `1100px`: configuración en 2 / 3 columnas
- `min-width: 900px` + `landscape`: imágenes más grandes
- `min-width: 1200px`: overlay e imágenes aún más grandes
- Comprobar siempre a 320, 390, 768 y 1280px que no hay scroll lateral

---

## 6. Mini-apps (juegos)

### Estructura HTML obligatoria

Cada mini-app es un **archivo HTML autocontenido**. Plantilla mínima:

```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate, max-age=0">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<title>NombreJuego — PapaTalk</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100vh;height:100dvh;overflow:hidden;background:#___}
body{touch-action:none;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent}
canvas{display:block}

/* Botones HUD — copiar de aquí */
#btn-back{ ... }
#btn-diff{ ... }
#btn-mute{ ... }
</style>
</head>
<body>
<a id="btn-back" href="index.html">◀ Volver</a>
<button id="btn-diff" onclick="window._cycleDiff()">⭐ Fácil</button>
<button id="btn-mute" onclick="window._toggleMute()">🔊</button>
<canvas id="game"></canvas>
<script>
(function(){
'use strict';
// ... todo el código del juego
})();
</script>
</body>
</html>
```

### Botones HUD de mini-apps

Todos los botones flotantes usan este estilo base:

```css
position: fixed;
top: 10px;
z-index: 10;
display: inline-flex;
align-items: center;
gap: 4px;
background: rgba(0,0,0,0.4);
color: #fff;
border: none;
border-radius: 24px;
padding: 8px 18px;
font: bold 15px/1 system-ui,-apple-system,sans-serif;
cursor: pointer;
backdrop-filter: blur(6px);
-webkit-backdrop-filter: blur(6px);
transition: background .2s;
```

| Botón | Posición | Forma | Función |
|---|---|---|---|
| `#btn-back` | `left: 10px` | Pill 24px radius | `<a href="index.html">◀ Volver</a>` |
| `#btn-diff` | `right: 64px` (o `right: 10px` si no hay mute) | Pill, color según dificultad | `onclick="window._cycleDiff()"` |
| `#btn-mute` | `right: 10px` | Circular 44px | `onclick="window._toggleMute()"` |

- `:active { background: rgba(0,0,0,0.6) }` o `transform: scale(0.93)`
- El botón "Volver" es un `<a>`, no un `<button>`, para navegación directa
- Si hay btn-mute a la derecha, btn-diff se desplaza a `right: 64px`

### Leer configuración de PapaTalk

Todas las mini-apps leen la config compartida desde localStorage:

```javascript
var ptCfg = {};
try { ptCfg = JSON.parse(localStorage.getItem('papatalk-config')) || {}; } catch(e){}
var scanCode = ptCfg.scanCode || 'ArrowRight';
var backCode = ptCfg.backCode || 'ArrowLeft';
var longPressMs = ptCfg.longPress || 600;
```

### Sistema de dificultad

Patrón estándar con 3 niveles:

```javascript
var DIFFS = [
  { name:'Fácil',   icon:'⭐',    color:'#4CAF50', /* params */ },
  { name:'Normal',  icon:'⭐⭐',   color:'#FF9800', /* params */ },
  { name:'Difícil', icon:'⭐⭐⭐',  color:'#F44336', /* params */ }
];
```

- Colores de dificultad: verde → naranja → rojo
- Persistencia en localStorage con clave propia del juego (ej. `vuela-data`)
- El botón de dificultad muestra `icon + ' ' + name` y se colorea con `btn.style.background`

### Sistema de audio

- Crear AudioContext lazily al primer input del usuario
- Función helper `tone(freq, dur, type, vol)` para efectos de sonido
- Música procedural con Web Audio (osciladores, no archivos de audio)
- Mute con localStorage (ej. `vuela-muted`), icono `🔊`/`🔇`

### Canvas

```javascript
var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');
var dpr = Math.min(window.devicePixelRatio || 1, 2);

function resize(){
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
```

- DPR limitado a 2 para rendimiento
- Resize listener con `window.addEventListener('resize', resize)`
- Game loop con `requestAnimationFrame`

### Controles en mini-apps

- **Touch**: `touchstart` en canvas (excluir botones HUD con check de `e.target`)
- **Teclado**: escuchar `scanCode` y `backCode` de la config
- **Repetición**: comprobar `e.repeat` para evitar múltiples disparos
- **No incluir detector de urgencia** — los juegos están naturalmente aislados

### Excluir botones HUD del touch

```javascript
canvas.addEventListener('touchstart', function(e){
  if(e.target.id === 'btn-back' || e.target.id === 'btn-diff' || e.target.id === 'btn-mute') return;
  e.preventDefault();
  // ... game action
}, {passive:false});
```

---

## 7. Interacción con pulsador (tablero principal)

### Config almacenada

```javascript
const DEFAULTS = {
  scanCode: 'ArrowRight',
  backCode: 'ArrowLeft',
  longPress: 600,          // ms para pulsación larga
  voiceURI: '',            // voz TTS seleccionada
  urgencyWindow: 3000      // ms ventana para 5 pulsaciones de urgencia
};
```

- Se guarda en `localStorage` como `papatalk-config`

### Comportamiento de teclas

| Acción | Tecla | Resultado |
|---|---|---|
| Avanzar | scan (corta) | Mueve highlight a siguiente tarjeta + TTS |
| Seleccionar | scan (larga) | Activa la tarjeta resaltada |
| Retroceder | back (corta) | Mueve highlight a tarjeta anterior |
| Borrar letra | back (larga) | Solo en pantalla de letras |
| Urgencia (taps) | 5× cualquiera en ventana configurable | Pantalla roja + alarma |
| Urgencia (hold) | Mantener cualquiera 3s | Pantalla roja + alarma |

### Protección anti-repetición

```javascript
if (e.repeat) return;  // SIEMPRE como primera línea del keydown
```

Esto es crítico — se ha roto 3 veces. Mantener siempre como primer guard en el handler.

### Debounce de scan

```javascript
scanDebounce = true;
setTimeout(() => { scanDebounce = false; }, 80);
```

---

## 8. Audio

### TTS (Síntesis de voz)

- API: `window.speechSynthesis`
- Voz configurable con `config.voiceURI`, fallback a primera voz española
- Evento `voiceschanged` para carga asíncrona
- Las voces cloud se marcan con ☁ en el selector

### Tonos de feedback

```javascript
function playTone(freq, duration) {
  // Web Audio API oscillator, tipo sine, gain exponential ramp
}
```

- Avanzar: `392 Hz, 0.15s`
- Retroceder: `262 Hz, 0.15s`

### Alarma de urgencia

- Dos osciladores: `880 Hz` y `660 Hz` (square wave)
- Modulados con LFO para efecto de sirena
- Se detienen al cerrar el overlay

---

## 9. PWA

### Manifest

```json
{
  "name": "PapaTalk - Comunicación UCI",
  "short_name": "PapaTalk",
  "display": "standalone",
  "orientation": "any",
  "background_color": "#f5f5f5",
  "theme_color": "#2E7D32"
}
```

### Service Worker (`sw.js`)

- `DEV_MODE = true` → network-only, borra caches
- `DEV_MODE = false` → cache-first con fallback; al instalar descarga todo con `cache: 'reload'`
- Array `CORE` con todos los HTML + manifest + iconos + fuentes
- Array `PICTOS` con todos los pictogramas
- **Al crear una nueva mini-app**: añadirla a `CORE` en `sw.js`
- **Al añadir un pictograma o una fuente**: añadirlo a `PICTOS` o `CORE`
- En el repo `sw.js` y `PAPATALK_DEV_MODE` (index.html) se quedan **siempre en modo desarrollo**; el despliegue los pasa a producción (ver §9b).

### 9b. Despliegue

`.github/workflows/deploy.yml` publica en GitHub Pages (https://martinandersen84.github.io/papatalk/) en cada push a `master` (o a mano desde Actions → Deploy → Run workflow):

1. Pone `DEV_MODE = false` y `CACHE_NAME = 'papatalk-<8 primeros caracteres del commit>'` en `sw.js`, y `PAPATALK_DEV_MODE = false` en `index.html`.
2. Copia a `_site/` los ficheros de la web, sin `.github/`, `.claude/`, `scripts/`, `data/facts/batches/` ni los `.md`.
3. Lo sube con `actions/upload-pages-artifact` y `actions/deploy-pages`.

- La web vive en la subcarpeta `/papatalk/`: todas las rutas (HTML, `sw.js`, `manifest.json`, imágenes) deben ser **relativas**, nunca empezar por `/`.
- Pages no lee `.htaccess` ni permite cabeceras propias (sirve todo con caché de 10 min); la actualización la garantizan el `CACHE_NAME` por commit y `updateViaCache: 'none'` al registrar el service worker.

### Recursos (pictogramas)

- Ubicación: `img/pictograms/`
- Formato: PNG
- Fuente: ARASAAC (Sergio Palao, Gobierno de Aragón)
- Licencia: CC BY-NC-SA
- Nomenclatura: `snake_case.png` (ej. `group_general.png`, `no_item.png`)

---

## 10. Checklist para nuevas mini-apps

1. [ ] Crear `nombre.html` en la raíz del proyecto
2. [ ] Título: `"NombreJuego — PapaTalk"`
3. [ ] Incluir metas PWA (viewport, apple-mobile-web-app, cache-control dev)
4. [ ] CSS reset + `overflow:hidden` + `user-select:none`
5. [ ] Botón `#btn-back` como `<a href="index.html">`
6. [ ] Botón `#btn-diff` si tiene dificultad (3 niveles: verde/naranja/rojo)
7. [ ] Botón `#btn-mute` si tiene música/audio
8. [ ] Leer config PapaTalk de localStorage para teclas
9. [ ] Canvas con DPR capping a 2
10. [ ] Audio con Web Audio API (procedural, sin archivos)
11. [ ] Persistencia de datos del juego en localStorage con clave propia
12. [ ] Excluir botones HUD del handler de touch
13. [ ] Comprobar `e.repeat` en keydown
14. [ ] **No** incluir detector de urgencia
15. [ ] Añadir el `.html` al array `CORE` en `sw.js`
16. [ ] Añadir entrada en el tablero principal (`index.html`) si corresponde

---

## 11. Convenciones de código

- Todo el JS y CSS está inline en cada HTML (archivos autocontenidos)
- JS envuelto en IIFE: `(function(){ 'use strict'; ... })();`
- Funciones públicas expuestas en `window` solo para onclick: `window._cycleDiff`, `window._toggleMute`
- Variables con `var` en mini-apps (compatibilidad), `let`/`const` en index.html
- Comentarios de sección con `/* ── Título ── */` o `/* ══ Título ══ */`
- localStorage keys: `papatalk-config`, `vuela-data`, `salta-data`, `ladrillos-data`, `vuela-muted`, etc.

---

*Última actualización: 2026-10-22*
