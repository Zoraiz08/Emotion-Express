const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const dpr = window.devicePixelRatio || 1

let zoom = 2.5

const MAPA_SCALE= dpr + zoom
const MAP_WIDTH = 25 * 16
const MAP_HEIGHT = 35 * 16

canvas.width = 1024 * dpr
canvas.height = 576 * dpr

const VIEWPORT_WIDTH = canvas.width / MAPA_SCALE
const VIEWPORT_CENTER_X = VIEWPORT_WIDTH / 2
const VIEWPORT_HEIGHT = canvas.height / MAPA_SCALE
const VIEWPORT_CENTER_Y = VIEWPORT_HEIGHT / 2

const MAX_SCROLL_X = MAP_WIDTH - VIEWPORT_WIDTH
const MAX_SCROLL_Y = MAP_HEIGHT - VIEWPORT_HEIGHT

// ----------------------
// TILESETS + MAPA
// ----------------------
const layersData = {
  l_MAPA: l_MAPA,
  l_DECOR: l_DECOR,
};

const tilesets = {
  l_MAPA: { imageUrl: './images/a6ab1f5b-7aaa-4319-9925-3632c1dc9a00.png', tileSize: 16 },
  l_DECOR: { imageUrl: './images/a6ab1f5b-7aaa-4319-9925-3632c1dc9a00.png', tileSize: 16 },
};

// ----------------------
// COLLISION BLOCKS
// ----------------------
const collisionBlocks = []
const blockSize = 16
collisions.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 1) {
      collisionBlocks.push(
        new CollisionBlock({
          x: x * blockSize,
          y: y * blockSize,
          size: blockSize,
        }),
      )
    }
  })
})

const renderLayer = (tilesData, tilesetImage, tileSize, context) => {
  const tilesPerRow = Math.ceil(tilesetImage.width / tileSize)
  tilesData.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol !== 0) {
        const tileIndex = symbol - 1
        const srcX = (tileIndex % tilesPerRow) * tileSize
        const srcY = Math.floor(tileIndex / tilesPerRow) * tileSize
        context.drawImage(
          tilesetImage,
          srcX, srcY,
          tileSize, tileSize,
          x * 16, y * 16,
          16, 16
        )
      }
    })
  })
}

const renderStaticLayers = async () => {
  const offscreenCanvas = document.createElement('canvas')
  offscreenCanvas.width = canvas.width
  offscreenCanvas.height = canvas.height
  const offscreenContext = offscreenCanvas.getContext('2d')

  for (const [layerName, tilesData] of Object.entries(layersData)) {
    const tilesetInfo = tilesets[layerName]
    if (tilesetInfo) {
      const tilesetImage = await loadImage(tilesetInfo.imageUrl)
      renderLayer(tilesData, tilesetImage, tilesetInfo.tileSize, offscreenContext)
    }
  }
  return offscreenCanvas
}

// ----------------------
// ENTIDADES
// ----------------------
const door = new Door({ x: 192, y: 0, size: { x: 16, y: 16 } })

const monsters = [
  new stormhead({ x: 200, y: 500, size: { x: 15, y: 31 }, health: 60 }),
  new skeleton({ x: 150, y: 450, size: { x: 20, y: 31 }, health: 3 }),
  new bot({ x: 100, y: 500, size: { x: 20, y: 31 }, health: 3 }),
]

const player = new Player({ x: 150, y: 500, size: { x: 15, y: 31 } })

const keys = { w:{pressed:false}, a:{pressed:false}, s:{pressed:false}, d:{pressed:false} }
let lastTime = performance.now()

const hearts = [
  new Heart({ x: 5, y: 5 }),
  new Heart({ x: 21, y: 5 }),
  new Heart({ x: 37, y: 5 }),
]

// ----------------------
// LOOP
// ----------------------
function animate(backgroundCanvas) {
  const currentTime = performance.now()
  const deltaTime = (currentTime - lastTime) / 1000
  lastTime = currentTime

  player.handleInput(keys)
  player.update(deltaTime, collisionBlocks)

  const horizontalScrollDistance = Math.min(Math.max(0, player.center.x - VIEWPORT_CENTER_X), MAX_SCROLL_X)
  const verticalScrollDistance = Math.min(Math.max(0, player.center.y - VIEWPORT_CENTER_Y), MAX_SCROLL_Y)

  c.save()
  c.scale(MAPA_SCALE, MAPA_SCALE)
  c.translate(-horizontalScrollDistance, -verticalScrollDistance)
  c.fillStyle = 'rgba(99, 0, 0, 0.5)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  c.drawImage(backgroundCanvas, 0, 0)

  door.update(deltaTime)
  door.draw(c)

  for (let i = monsters.length - 1; i >= 0; i--) {
    const monster = monsters[i]
    monster.update(deltaTime, collisionBlocks)
    monster.draw(c)

    // --- hit detection
    if (
      player.attackHitBox.x + player.attackHitBox.width >= monster.x &&
      player.attackHitBox.x <= monster.x + monster.width &&
      player.attackHitBox.y + player.attackHitBox.height >= monster.y &&
      player.attackHitBox.y <= monster.y + monster.height &&
      player.isAttacking && !monster.isTakingHit && !monster.isInvrulnerable
    ) {
      monster.curretAnimation = monster.animationframes.hit
      monster.img.src = monster.sprites.hit
      monster.curretFrame = 0
      monster.elapsedTime = 0
      monster.isTakingHit = true
      monster.reciveHit()

      if (monster.health <= 0) {
        monsters.splice(i, 1)
      }
    }

    // --- player damage
    if (
      player.x + player.width >= monster.x &&
      player.x <= monster.x + monster.width &&
      player.y + player.height >= monster.y &&
      player.y <= monster.y + monster.height &&
      !player.isInvrulnerable
    ) {
      player.reciveHit()
      hearts.pop()
      if (hearts.length === 0) {
        console.log('Game Over')
        return
      }
    }
  }

  player.draw(c)
  c.restore()

  c.save()
  c.scale(MAPA_SCALE, MAPA_SCALE)
  hearts.forEach(heart => heart.draw(c))
  c.restore()

  requestAnimationFrame(() => animate(backgroundCanvas))
}

// ----------------------
// PRELOADER
// ----------------------
function preloadImages(paths) {
  return Promise.all(paths.map(path => new Promise((resolve, reject) => {
    const img = new Image()
    img.src = path
    img.onload = () => resolve(img)
    img.onerror = () => reject(`Error cargando ${path}`)
  })))
}

async function startRendering() {
  try {
    const backgroundCanvas = await renderStaticLayers()
    animate(backgroundCanvas)
  } catch (error) {
    console.error('Error during rendering:', error)
  }
}

// ----------------------
// 🔥 MAIN START
// ----------------------
const allImages = [
  // Tilesets
  tilesets.l_MAPA.imageUrl,
  tilesets.l_DECOR.imageUrl,

  // Player sprites
  "MonstersAssetes/player/idle.png",
  "MonstersAssetes/player/run.png",
  "MonstersAssetes/player/attack.png",
  "MonstersAssetes/player/hit.png",
  "MonstersAssetes/player/death.png",

  // Skeleton sprites
  "MonstersAssetes/skeleton/idle.png",
  "MonstersAssetes/skeleton/run.png",
  "MonstersAssetes/skeleton/attack.png",
  "MonstersAssetes/skeleton/hit.png",
  "MonstersAssetes/skeleton/death.png",

  // Bot sprites
  "MonstersAssetes/bot/idle.png",
  "MonstersAssetes/bot/run.png",
  "MonstersAssetes/bot/hit.png",
  "MonstersAssetes/bot/death.png",

  // Stormhead sprites
  "MonstersAssetes/stormhead/idle.png",
  "MonstersAssetes/stormhead/run.png",
  "MonstersAssetes/stormhead/hit.png",
  "MonstersAssetes/stormhead/death.png",
]

// Mostrar loading
c.fillStyle = "black"
c.fillRect(0, 0, canvas.width, canvas.height)
c.fillStyle = "white"
c.font = "30px Arial"
c.fillText("Loading...", canvas.width/2 - 80, canvas.height/2)

preloadImages(allImages).then(() => {
  console.log("✅ Todas las imágenes cargadas")
  startRendering()
}).catch(err => {
  console.error(err)
})
