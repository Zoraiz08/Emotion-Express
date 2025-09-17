const canvas = document.getElementById('gameCanvas')
const c = canvas.getContext('2d')
const dpr = 1 //window.devicePixelRatio || 1 --> problemes

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
let layersData

let tilesets

let collisions = []

// ----------------------
// ENTIDADES
// ----------------------
let door

let monsters

let player

let hearts

//-----------------------
// LEVELS
//-----------------------
let level = 3
let levels = {
  1:{
    init: () => {
      // ----------------------
      // TILESETS + MAPA
      // ----------------------
      layersData = {
      l_floor_lvl3: l_floor_lvl3,
      l_floor2_lvl3: l_floor2_lvl3,
      l_walls_lvl3: l_walls_lvl3,
      l_deco_lvl3: l_deco_lvl3,
    };


      tilesets = {
      l_floor_lvl3: { imageUrl: './images/73729a4b-852d-4c77-c0b3-25dae1c9db00.png', tileSize: 16 },
      l_floor2_lvl3: { imageUrl: './images/73729a4b-852d-4c77-c0b3-25dae1c9db00.png', tileSize: 16 },
      l_walls_lvl3: { imageUrl: './images/73729a4b-852d-4c77-c0b3-25dae1c9db00.png', tileSize: 16 },
      l_deco_lvl3: { imageUrl: './images/7a6e7ea9-d955-415d-f025-facb2b600200.png', tileSize: 16 },
    };


      collisions = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,0],
      [1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,0,1,1,0,0,0,0,1,1,1],
      [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
      [1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
      [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,0,0,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];


      // ----------------------
      // ENTIDADES3
      // ----------------------
       door = new Door({ x: 320, y: 42.0001, size: { x: 20, y: 20} })

       monsters = [
        new stormhead({x: 192,y: 448,size: {x: 15,y: 31,},health: 5,}),
        new skeleton({x: 272,y: 304,size: {x: 20,y: 31,},health: 5}),   
        new skeleton({x: 64,y: 96,size: {x: 20,y: 31,},health: 5}),   
        new skeleton({x: 192,y: 96,size: {x: 20,y: 31,},health: 5}),   
        new bot({x: 272,y: 400,size: {x: 20,y: 31},health: 5}), 
        new bot({x: 64,y: 304,size: {x: 20,y: 31},health: 5}), 
        ]

       player = new Player({ x: 80, y: 448, size: { x: 15, y: 31 } })

       hearts = [
        new Heart({ x: 5, y: 5 }),
        new Heart({ x: 21, y: 5 }),
        new Heart({ x: 37, y: 5 }),
      ]



    }
  },
  2:{
    init: () => {
      // ----------------------
      // TILESETS + MAPA
      // ----------------------
      layersData = {
        l_floor_lvl2: l_floor_lvl2,
        l_floor2_lvl2: l_floor2_lvl2,
        l_WALLS_LVL2: l_WALLS_LVL2,
        l_deco_lvl2: l_deco_lvl2,
      };

      tilesets = {
        l_floor_lvl2: { imageUrl: './images/73729a4b-852d-4c77-c0b3-25dae1c9db00.png', tileSize: 16 },
        l_floor2_lvl2: { imageUrl: './images/73729a4b-852d-4c77-c0b3-25dae1c9db00.png', tileSize: 16 },
        l_WALLS_LVL2: { imageUrl: './images/73729a4b-852d-4c77-c0b3-25dae1c9db00.png', tileSize: 16 },
        l_deco_lvl2: { imageUrl: './images/7a6e7ea9-d955-415d-f025-facb2b600200.png', tileSize: 16 },
      };

      collisions = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
      [1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0],
      [1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
      [1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
      [1,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,1,0,0,0,0,0],
      [1,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,1,1,1,1,1,0],
      [1,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,1,1,1,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,0,0,0,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0,0,1,0,1,1,1,1],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,0,0,0,1],
      [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,0,0,0,1],
      [0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [0,0,0,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,1,1,0,0,0,1],
      [0,0,0,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,1,1,0,0,0,1],
      [0,0,0,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,0,0,0,1],
      [0,0,0,1,1,1,1,1,0,0,1,1,1,1,0,1,0,0,0,1,0,1,1,1,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0],
      [0,1,1,1,1,0,0,1,1,1,1,1,1,1,0,1,0,0,0,1,1,1,1,1,0],
      [1,0,0,0,0,1,1,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,0],
      [1,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,0],
      [1,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
      [1,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,0],
      [0,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];

      // ----------------------
      // ENTIDADES
      // ----------------------
       door = new Door({ x: 36, y: 26.0001, size: { x: 20, y: 20} })

       monsters = [
        new stormhead({x: 160 ,y: 144,size: {x: 15,y: 31,},health: 5,}),
        new skeleton({x: 32,y: 464,size: {x: 20,y: 31,},health: 3}),   
        new skeleton({x: 304,y: 464,size: {x: 20,y: 31,},health: 3}),   
        new skeleton({x: 352,y: 288,size: {x: 20,y: 31,},health: 3}),   
        new bot({x: 80,y: 320,size: {x: 20,y: 31},health: 3}), 
        new bot({x: 176,y: 320,size: {x: 20,y: 31},health: 3}), 
        new bot({x: 32,y: 112,size: {x: 20,y: 31},health: 3}), 
        ]

       player = new Player({ x: 160, y: 464, size: { x: 15, y: 31 } })

       hearts = [
        new Heart({ x: 5, y: 5 }),
        new Heart({ x: 21, y: 5 }),
        new Heart({ x: 37, y: 5 }),
      ]



    }

  },
  3:{
    init: () => {
      // ----------------------
      // TILESETS + MAPA
      // ----------------------
      layersData = {
        l_floor_lvl1: l_floor_lvl1,
        l_loor2_lvl1: l_loor2_lvl1,
        l_walls_lvl1: l_walls_lvl1,
        l_deco_lvl1: l_deco_lvl1,
      };

      tilesets = {
        l_floor_lvl1: { imageUrl: './images/73729a4b-852d-4c77-c0b3-25dae1c9db00.png', tileSize: 16 },
        l_loor2_lvl1: { imageUrl: './images/73729a4b-852d-4c77-c0b3-25dae1c9db00.png', tileSize: 16 },
        l_walls_lvl1: { imageUrl: './images/73729a4b-852d-4c77-c0b3-25dae1c9db00.png', tileSize: 16 },
        l_deco_lvl1: { imageUrl: './images/7a6e7ea9-d955-415d-f025-facb2b600200.png', tileSize: 16 },
      };
      collisions = [
      [1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [1,1,1,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0],
      [1,1,1,0,0,0,0,1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0],
      [1,1,1,0,0,0,0,1,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,1,0],
      [1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
      [1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,0],
      [1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0],
      [0,1,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0],
      [0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,0,0],
      [0,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0,0,0],
      [0,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0,0,0],
      [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0],
      [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0],
      [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
      [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
      [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,0,0],
      [0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
      [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
      [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
      [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0],
      [0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ];

      // ----------------------
      // ENTIDADES
      // ----------------------
       door = new Door({ x: 67, y: 10.0001, size: { x: 20, y: 20} })

       monsters = [
        // new stormhead({x: 304,y: 176,size: {x: 15,y: 31,},health: 5,}),
        // new skeleton({x: 272,y: 480,size: {x: 20,y: 31,},health: 3}),   
        // new skeleton({x: 80,y: 336,size: {x: 20,y: 31,},health: 5}),   
        // new bot({x: 64,y: 176,size: {x: 20,y: 31},health: 3}), 
        ]

       player = new Player({ x: 64, y: 460, size: { x: 15, y: 32 } })

       hearts = [
        new Heart({ x: 5, y: 5 }),
        new Heart({ x: 21, y: 5 }),
        new Heart({ x: 37, y: 5 }),
      ]



    }

  },

}

// ----------------------
// COLLISION BLOCKS
// ----------------------
function generateCollisionBlocks() {
  collisionBlocks = []
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
}


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

const keys = { w:{pressed:false}, a:{pressed:false}, s:{pressed:false}, d:{pressed:false}, e:{pressed: false} }

const overlay = {
  opacity: 0,
}

// ----------------------
// LOOP
// ----------------------
let lastTime = performance.now()

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
  c.fillStyle = 'rgba(29, 28, 43, 1)'
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
      
      const fillerHeart = hearts.filter(heart => heart.curretFrame === 0)

      if (fillerHeart.length > 0) {
        fillerHeart[fillerHeart.length - 1 ].curretFrame = 2
      }
      
      if (fillerHeart.length <= 1) {

        console.log('Game Over')
        // Show game over screen or restart game
        player.velocity.x = 0
        player.velocity.y = 0
        player.img.src = 'playerAssets/IDLE/idle_down.png'
        door.open = true // Evita que el jugador pueda avanzar o moverse
        gsap.to(overlay, {
          opacity: 1,
          duration: 1.5,
          onComplete: () => {
            // Restart the game or show game over screen
            levels[level].init()


              gsap.to(overlay, {
                opacity: 0,
                duration: 1.5,
              })

          }
        })
      }
    }
  }

  // --- finish level
  if(monsters.length === 0 && 
      player.x + player.width >= door.x &&
      player.x <= door.x + door.width &&
      player.y + player.height >= door.y &&
      player.y <= door.y + door.height && keys.e.pressed && !door.open){

          door.finishLevel()
          player.img.src = 'playerAssets/RUN/run_up.png'
          player.velocity.x = 0
          player.velocity.y = -30
          player.x = (door.x + door.width / 2) - player.width /2

          gsap.to(overlay, {
            opacity: 1,
            duration: 1.5,
            onComplete: async () => {
              level++
              if(!levels[level]) level = 1
              levels[level].init()
              generateCollisionBlocks()

              const backgroundCanvas = await renderStaticLayers() 
              animate(backgroundCanvas)

              gsap.to(overlay, {
                opacity: 0,
                duration: 1.5,
              })
            }
          })

          door.open = true





      }


  player.draw(c)    
  c.restore()

  c.save()
  c.scale(MAPA_SCALE, MAPA_SCALE)
  hearts.forEach(heart => heart.draw(c))
  c.restore()


// --- fade out code for finish lvl
  c.save()
  c.globalAlpha = overlay.opacity
  c.fillStyle = 'black'
  c.fillRect(0,0, canvas.width, canvas.height)
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
// MAIN START
// ----------------------

levels[level].init() 
generateCollisionBlocks()
const allImages = [
  // Tilesets
  // "images/a6ab1f5b-7aaa-4319-9925-3632c1dc9a00.png", 
  "images/69d77279-4a19-4f99-4623-3662432bf900.png",
  "images/73729a4b-852d-4c77-c0b3-25dae1c9db00.png",
  "images/7a6e7ea9-d955-415d-f025-facb2b600200.png",
  // Player sprites
  "playerAssets/IDLE/idle_down.png",
  "playerAssets/IDLE/idle_left.png",
  "playerAssets/IDLE/idle_right.png",
  "playerAssets/IDLE/idle_up.png",
  "playerAssets/RUN/run_down.png",
  "playerAssets/RUN/run_left.png",
  "playerAssets/RUN/run_right.png",
  "playerAssets/RUN/run_up.png",
  "playerAssets/ATTACK 1/attack1_down.png",
  "playerAssets/ATTACK 1/attack1_left.png",
  "playerAssets/ATTACK 1/attack1_right.png",
  "playerAssets/ATTACK 1/attack1_up.png",

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
  "MonstersAssetes/stormhead/damaged.png",
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
