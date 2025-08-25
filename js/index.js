const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const dpr = window.devicePixelRatio || 1

const MAPA_SCALE= dpr + 2.5 // Adjust this value to zoom in/out;
const MAP_WIDTH = 25 * 16; // 25 COLUMNS AND 16 PX
const MAP_HEIGHT = 35 * 16; // 16 ROWS AND 16 PX


canvas.width = 1024 * dpr
canvas.height = 576 * dpr

const VIEWPORT_WIDTH = canvas.width / MAPA_SCALE;
const VIEWPORT_CENTER_X = VIEWPORT_WIDTH / 2;
const VIEWPORT_HEIGHT = canvas.height / MAPA_SCALE;
const VIEWPORT_CENTER_Y = VIEWPORT_HEIGHT / 2;

const MAX_SCROLL_X = MAP_WIDTH - VIEWPORT_WIDTH;
const MAX_SCROLL_Y = MAP_HEIGHT - VIEWPORT_HEIGHT;


const layersData = {
   l_MAPA: l_MAPA,
   l_DECOR: l_DECOR,
};
const tilesets = {
  l_MAPA: { imageUrl: './images/a6ab1f5b-7aaa-4319-9925-3632c1dc9a00.png', tileSize: 16 },
  l_DECOR: { imageUrl: './images/a6ab1f5b-7aaa-4319-9925-3632c1dc9a00.png', tileSize: 16 },
};
// Tile setup
const collisionBlocks = []
const blockSize = 16 // Assuming each tile is 16x16 pixels
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
  // Calculate the number of tiles per row in the tileset
  // We use Math.ceil to ensure we get a whole number of tiles
  const tilesPerRow = Math.ceil(tilesetImage.width / tileSize)

  tilesData.forEach((row, y) => {
    row.forEach((symbol, x) => {
      if (symbol !== 0) {
        // Adjust index to be 0-based for calculations
        const tileIndex = symbol - 1

        // Calculate source coordinates
        const srcX = (tileIndex % tilesPerRow) * tileSize
        const srcY = Math.floor(tileIndex / tilesPerRow) * tileSize

        context.drawImage(
          tilesetImage, // source image
          srcX,
          srcY, // source x, y
          tileSize,
          tileSize, // source width, height
          x * 16,
          y * 16, // destination x, y
          16,
          16, // destination width, height
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
      try {
        const tilesetImage = await loadImage(tilesetInfo.imageUrl)
        renderLayer(
          tilesData,
          tilesetImage,
          tilesetInfo.tileSize,
          offscreenContext,
        )
      } catch (error) {
        console.error(`Failed to load image for layer ${layerName}:`, error)
      }
    }
  }

  // Optionally draw collision blocks and platforms for debugging
  // collisionBlocks.forEach(block => block.draw(offscreenContext));

  return offscreenCanvas
}
// END - Tile setup


// Change xy coordinates to move playerd's default position
const player = new Player({
  x: 150,
  y: 500,
  size: {
    x: 15,
    y: 31,
  },
})

const monsters 
= [
  new Monster({
    x: 200,
    y: 500,
    size: {
      x: 15,
      y: 31,
    },
    imgSrc: 'MonstersAssetes/stormhead/',
  }),
]

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
}

let lastTime = performance.now()

function animate(backgroundCanvas) {
  // Calculate delta time
  const currentTime = performance.now()
  const deltaTime = (currentTime - lastTime) / 1000
  lastTime = currentTime

  // Update player position
  player.handleInput(keys)
  player.update(deltaTime, collisionBlocks)


  const horizontalScrollDistance = Math.min(Math.max(0, player.center.x - VIEWPORT_CENTER_X), MAX_SCROLL_X)
  const verticalScrollDistance = Math.min(Math.max(0, player.center.y - VIEWPORT_CENTER_Y), MAX_SCROLL_Y)
  
  // Render scene
  c.save()
  c.scale(MAPA_SCALE, MAPA_SCALE)
  c.translate(-horizontalScrollDistance, -verticalScrollDistance)
  c.fillStyle = 'rgba(99, 0, 0, 0.5)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  c.drawImage(backgroundCanvas, 0, 0)
  player.draw(c)
  for (let i = monsters.length - 1; i >= 0; i--) {
    const monster = monsters[i]
    monster.update(deltaTime, collisionBlocks)
    monster.draw(c)

  }
  c.restore()

  requestAnimationFrame(() => animate(backgroundCanvas))
}

const startRendering = async () => {
  try {
    const backgroundCanvas = await renderStaticLayers()
    if (!backgroundCanvas) {
      console.error('Failed to create the background canvas')
      return
    }

    animate(backgroundCanvas)
  } catch (error) {
    console.error('Error during rendering:', error)
  }
}

startRendering()

