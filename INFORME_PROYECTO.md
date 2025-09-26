# Informe Detallado del Proyecto: Emotion Express

## Índice
1. [Descripción General](#descripción-general)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Estructura de Archivos](#estructura-de-archivos)
5. [Sistema de Juego](#sistema-de-juego)
6. [Sistema de IA y Reconocimiento Facial](#sistema-de-ia-y-reconocimiento-facial)
7. [Clases y Componentes](#clases-y-componentes)
8. [Niveles y Mapas](#niveles-y-mapas)
9. [Mecánicas de Juego](#mecánicas-de-juego)
10. [Interfaz de Usuario](#interfaz-de-usuario)
11. [Estado del Desarrollo](#estado-del-desarrollo)
12. [Problemas Identificados](#problemas-identificados)
13. [Conclusiones y Recomendaciones](#conclusiones-y-recomendaciones)

---

## Descripción General

**Emotion Express** es un videojuego 2D desarrollado en JavaScript que combina mecánicas de acción tradicionales con inteligencia artificial para reconocimiento facial y análisis de emociones. El juego utiliza TensorFlow.js para procesar emociones del jugador en tiempo real y adaptar la experiencia de juego según el estado emocional detectado.

### Concepto Principal
- **Género**: Acción/Aventura 2D
- **Plataforma**: Web Browser
- **Característica Única**: Integración de IA para reconocimiento facial y adaptación emocional
- **Estado**: Beta 1.0

---

## Arquitectura del Proyecto

### Estructura Técnica
```
Emotion Express/
├── Frontend Web (HTML5 Canvas)
├── Motor de Juego Custom (JavaScript)
├── Sistema de IA (TensorFlow.js)
└── Gestión de Assets y Niveles
```

### Flujo de Datos
1. **Input del Usuario** → Controles de teclado + Cámara web
2. **Procesamiento** → Motor de juego + Análisis de emociones
3. **Renderizado** → Canvas 2D + UI dinámico
4. **Adaptación** → Selección de niveles basada en emociones

---

## Tecnologías Utilizadas

### Frontend y Motor de Juego
- **HTML5 Canvas**: Renderizado gráfico principal
- **JavaScript ES6+**: Lógica del juego y sistema de clases
- **CSS3**: Interfaz de usuario y estilos
- **GSAP (GreenSock)**: Animaciones y transiciones

### Inteligencia Artificial
- **TensorFlow.js 2.0.0**: Framework de IA para el navegador
- **WebRTC getUserMedia**: Acceso a la cámara web
- **Modelo personalizado**: Clasificación de emociones facial

### Gestión de Assets
- **Sistema de precarga**: Optimización de imágenes
- **Tilesets**: Mapas modulares con diferentes capas
- **Sprites animados**: Personajes y enemigos

---

## Estructura de Archivos

```
Emotion Express/
│
├── index.html                 # Página principal
├── TODO.todo                  # Lista de tareas del desarrollo
├── tailwind.config.js         # Configuración de Tailwind CSS
│
├── js/                        # Scripts principales
│   ├── index.js              # Motor principal del juego
│   ├── eventListeners.js     # Gestión de eventos
│   ├── utils.js              # Utilidades generales
│   └── emotionNet.js         # Sistema de IA y cámara
│
├── classes/                   # Clases del juego
│   ├── Player.js             # Clase del jugador
│   ├── CollisionBlock.js     # Sistema de colisiones
│   ├── door.js               # Puertas entre niveles
│   ├── heart.js              # Sistema de vida
│   └── Monsters/             # Enemigos
│       ├── bot.js
│       ├── skeleton.js
│       └── stormhead.js
│
├── data/                      # Datos de niveles
│   ├── l_floor_lvl*.js       # Capas de suelo
│   ├── l_walls_lvl*.js       # Capas de paredes
│   └── l_deco_lvl*.js        # Capas decorativas
│
├── images/                    # Tilesets del juego
├── playerAssets/              # Sprites del jugador
├── MonstersAssetes/           # Sprites de enemigos
├── utilsAssets/               # Assets adicionales
└── modelo/                    # Modelo de IA entrenado
```

---

## Sistema de Juego

### Motor Principal (`js/index.js`)

#### Configuración del Canvas
```javascript
const canvas = document.getElementById('gameCanvas')
const c = canvas.getContext('2d')
const dpr = 1
let zoom = 2.5
const MAPA_SCALE = dpr + zoom

canvas.width = 1024 * dpr
canvas.height = 576 * dpr
```

#### Sistema de Viewport
- **Dimensiones**: 1024x576 píxeles
- **Zoom**: Factor 2.5x para estética pixel art
- **Scroll**: Cámara que sigue al jugador
- **Límites**: Restricciones para evitar mostrar áreas vacías

#### Game Loop
1. **Update**: Actualización de entidades (jugador, enemigos, colisiones)
2. **Render**: Dibujado de capas (tiles → enemigos → jugador → UI)
3. **Input**: Procesamiento de controles en tiempo real

### Sistema de Niveles

#### Estructura de Niveles
```javascript
let levels = {
  1: { init: () => { /* Inicialización nivel 1 */ } },
  2: { init: () => { /* Inicialización nivel 2 */ } },
  // ... hasta 5 niveles
}
```

#### Componentes por Nivel
- **Tilesets**: Imágenes base para construir el mapa
- **Layers**: Múltiples capas (suelo, paredes, decoración)
- **Collisions**: Matriz de colisiones para navegación
- **Entities**: Posicionamiento de jugador, enemigos, puertas, corazones

---

## Sistema de IA y Reconocimiento Facial

### Arquitectura de IA (`js/emotionNet.js`)

#### Inicialización
```javascript
let modelo = null;
let IAmodeActive = false;
let emotionCounter = [0, 0, 0, 0, 0, 0]; // Contador por emoción

// Carga del modelo
modelo = await tf.loadGraphModel("modelo/model.json");
```

#### Procesamiento en Tiempo Real
1. **Captura**: WebRTC obtiene frames de la cámara
2. **Preprocessing**: Redimensionado y normalización
3. **Inferencia**: El modelo clasifica la emoción
4. **Acumulación**: Contador de emociones detectadas
5. **Decisión**: Selección de siguiente nivel basada en emociones

#### Emociones Detectadas
- Neutral
- Felicidad
- Tristeza
- Enfado
- Sorpresa
- Miedo

### Integración con el Juego
- **Modo IA**: Activable/desactivable con tecla 'M'
- **Cámara**: Previsualización con tecla 'C'
- **Adaptación**: El siguiente nivel se determina por la emoción predominante

---

## Clases y Componentes

### Clase Player (`classes/Player.js`)

#### Propiedades Principales
```javascript
class Player {
  constructor({ x, y, size, velocity }) {
    this.x = x
    this.y = y
    this.width = size.x
    this.height = size.y
    this.velocity = velocity
    // Sistema de sprites por dirección
    this.sprites = {
      idle: { down, left, right, up },
      run: { down, left, right, up },
      attack: { down, left, right, up }
    }
    this.isAttacking = false
    this.isInvulnerable = false
  }
}
```

#### Mecánicas Implementadas
- **Movimiento**: WASD con velocidad constante
- **Animación**: 8 frames por acción, cambio automático de dirección
- **Ataque**: Sistema de hitbox temporal
- **Invulnerabilidad**: Periodo de gracia tras recibir daño
- **Colisiones**: Detección horizontal y vertical separada

### Clases de Enemigos

#### Estructura Base
Todos los enemigos heredan mecánicas similares:
- **Sprites**: idle, run, attack, hit, death
- **IA básica**: Persecución del jugador
- **Hitbox**: Detección de colisiones con ataques
- **Animación**: Ciclos automáticos de sprites

#### Tipos de Enemigos
1. **Bot**: Enemigo básico, movimiento directo
2. **Skeleton**: Enemigo intermedio con más vida
3. **Stormhead**: Enemigo avanzado con ataques especiales

### Sistema de Colisiones (`classes/CollisionBlock.js`)

#### Implementación
```javascript
class CollisionBlock {
  constructor({ x, y, width, height }) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }
}
```

#### Detección
- **Método**: AABB (Axis-Aligned Bounding Box)
- **Precisión**: Píxel perfect para mejor jugabilidad
- **Separación**: Eje X e Y procesados independientemente

---

## Niveles y Mapas

### Sistema de Tilesets

#### Estructura de Datos
```javascript
layersData = {
  l_floor_lvl3: [[1,0,1], [0,0,0], ...],    // Capa de suelo
  l_walls_lvl3: [[0,1,0], [1,1,1], ...],    // Capa de paredes
  l_deco_lvl3: [[0,0,2], [0,3,0], ...]      // Capa decorativa
}

tilesets = {
  l_floor_lvl3: { 
    imageUrl: './images/tileset.png', 
    tileSize: 16 
  }
}
```

#### Renderizado por Capas
1. **Floor**: Suelo base
2. **Floor2**: Detalles del suelo
3. **Walls**: Paredes y obstáculos
4. **Decoration**: Elementos decorativos

### Dimensiones
- **Tile Size**: 16x16 píxeles
- **Map Size**: 25x35 tiles (400x560 píxeles)
- **Total Levels**: 5 niveles implementados

---

## Mecánicas de Juego

### Sistema de Combate
- **Ataque**: Barra espaciadora
- **Hitbox**: Área temporal frente al jugador
- **Daño**: Sistema de HP para enemigos
- **Knockback**: Retroceso al recibir daño

### Sistema de Vida
- **Hearts**: 3 corazones por defecto
- **Invulnerabilidad**: 1 segundo tras recibir daño
- **Game Over**: Reinicio del nivel al perder toda la vida

### Progresión
- **Objective**: Eliminar todos los enemigos del nivel
- **Door**: Interacción con 'E' para avanzar
- **IA Mode**: Si está activo, la emoción determina el siguiente nivel

### Controles
- **WASD**: Movimiento
- **Space**: Ataque
- **E**: Abrir puertas
- **M**: Activar/desactivar modo IA
- **C**: Mostrar/ocultar cámara

---

## Interfaz de Usuario

### Elementos Principales
1. **Canvas de Juego**: Área principal 1024x576
2. **Tutorial**: Instrucciones desplegables
3. **Controls**: Lista de controles
4. **Cámara**: Previsualización facial (activable)
5. **Feedback**: Enlace a formulario de Google

### Estilos CSS
- **Tema**: Oscuro (#1d1c2b)
- **Tipografía**: Sans-serif, blanco
- **Efectos**: Hover animations con GSAP
- **Responsive**: Adaptable a diferentes tamaños

### Funcionalidades Dinámicas
- **Toggle Controls**: Mostrar/ocultar tutorial
- **Cámara Preview**: Activación dinámica
- **Estado del Juego**: Indicadores visuales

---

## Estado del Desarrollo

### Completado ✅
- ✅ **Sistema básico de juego**: Movimiento, colisiones, animaciones
- ✅ **5 niveles jugables**: Con diferentes diseños y dificultades
- ✅ **3 tipos de enemigos**: Con IA básica y sprites animados
- ✅ **Sistema de combate**: Ataques, daño, invulnerabilidad
- ✅ **Integración de IA**: Modelo de emociones funcional
- ✅ **Interfaz web**: Controles, tutorial, cámara
- ✅ **Sistema de assets**: Precarga optimizada

### En Desarrollo 🚧
- 🚧 **Más niveles**: Objetivo de 20 niveles total
- 🚧 **Sistema de objetos**: Power-ups y mejoras
- 🚧 **Balanceo de dificultad**: Ajuste de enemigos por nivel
- 🚧 **Optimización**: Rendimiento y carga de assets

### Pendiente ⏳
- ⏳ **Múltiples finales**: Basados en emociones predominantes
- ⏳ **Sistema de puntuación**: Score y leaderboards
- ⏳ **Efectos sonoros**: Música y SFX
- ⏳ **Niveles procedurales**: Generación automática
- ⏳ **Multijugador**: Funcionalidad cooperativa

---

## Problemas Identificados

### Técnicos

#### 1. **Carga de Assets**
**Problema**: Las imágenes no se cargan correctamente en algunos casos
```javascript
// Error frecuente:
Player sprite image is not a valid HTMLImageElement: undefined
```
**Causa**: Desincronización entre precarga y uso de imágenes
**Impacto**: Sprites invisibles, crashes del juego

#### 2. **Rendimiento de IA**
**Problema**: El procesamiento de emociones puede causar lag
**Causa**: Inferencia en tiempo real sin optimización
**Impacto**: FPS inconsistente cuando la IA está activa

#### 3. **Colisiones**
**Problema**: Ocasionalmente el jugador puede atravesar paredes
**Causa**: Velocidad alta vs precisión de detección
**Impacto**: Explotación de bugs, experiencia rota

### De Diseño

#### 1. **Balanceo**
**Problema**: Algunos niveles son demasiado fáciles/difíciles
**Causa**: Falta de playtesting extensivo
**Impacto**: Curva de aprendizaje irregular

#### 2. **Feedback Visual**
**Problema**: No está claro cuándo se puede atacar o cuánta vida queda
**Causa**: UI minimalista sin indicadores suficientes
**Impacto**: Confusión del jugador

---

## Conclusiones y Recomendaciones

### Fortalezas del Proyecto

#### Innovación Técnica
- **Integración de IA**: La combinación de juego tradicional con reconocimiento facial es única
- **Tecnología Web**: Uso avanzado de APIs modernas del navegador
- **Arquitectura Modular**: Código bien estructurado y mantenible

#### Experiencia de Usuario
- **Concepto Original**: La adaptación emocional crea una experiencia personalizada
- **Controles Intuitivos**: Fácil de aprender, difícil de dominar
- **Presentación Visual**: Estética pixel art atractiva

### Áreas de Mejora Prioritarias

#### 1. **Estabilidad Técnica**
```javascript
// Implementar sistema robusto de carga
const preloadImages = async () => {
  return Promise.all(imagePaths.map(path => loadImage(path)))
}
```

#### 2. **Optimización de Rendimiento**
- Implementar object pooling para enemigos
- Optimizar renderizado con culling
- Reducir frecuencia de inferencia de IA

#### 3. **Experiencia de Usuario**
- Añadir indicadores de vida visual
- Mejorar feedback de combate
- Implementar sistema de tutorial interactivo

### Recomendaciones de Desarrollo

#### Corto Plazo (1-2 meses)
1. **Resolver bugs críticos**: Carga de assets, colisiones
2. **Añadir más contenido**: 5-10 niveles adicionales
3. **Mejorar UI**: Indicadores de vida, progreso

#### Medio Plazo (3-6 meses)
1. **Sistema de objetos**: Power-ups, mejoras temporales
2. **Múltiples finales**: Narrativa adaptativa
3. **Optimización**: Rendimiento y compatibilidad

#### Largo Plazo (6+ meses)
1. **Modo multijugador**: Cooperativo local/online
2. **Editor de niveles**: Contenido generado por usuarios
3. **Monetización**: Modelo freemium o premium

### Potencial Comercial

#### Mercado Objetivo
- **Primario**: Jugadores casuales interesados en IA
- **Secundario**: Investigadores en emociones y juegos
- **Terciario**: Educadores en tecnología

#### Propuesta de Valor Única
- **Adaptación Emocional**: Primera experiencia de juego que se adapta a emociones reales
- **Educativo**: Demostración práctica de IA en entretenimiento
- **Accesible**: Navegador web, sin instalación requerida

---

## Documentación Técnica Adicional

### APIs y Dependencias
```javascript
// TensorFlow.js
https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@2.0.0/dist/tf.min.js

// GSAP
https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js

// WebRTC
navigator.mediaDevices.getUserMedia()
```

### Configuración del Entorno
1. **Servidor Web**: Requerido para cámara y modelo de IA
2. **HTTPS**: Necesario para acceso a cámara
3. **Navegadores Compatibles**: Chrome 80+, Firefox 75+, Safari 13+

### Estructura de Datos del Modelo
```javascript
// Input: 48x48 píxeles, escala de grises
// Output: [neutral, happy, sad, angry, surprise, fear]
// Formato: Probabilidades normalizadas (suma = 1.0)
```

---

**Emotion Express** representa un proyecto ambicioso que combina desarrollo de juegos tradicional con tecnologías de vanguardia en IA. Con las mejoras sugeridas, tiene potencial para convertirse en una experiencia de entretenimiento única y comercialmente viable.

---

*Informe generado el 26 de septiembre de 2025*
*Versión del proyecto: Beta 1.0*