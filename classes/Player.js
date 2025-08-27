const X_VELOCITY = 170
const Y_VELOCITY = 170

class Player {
  constructor({ x, y, size, velocity = { x: 0, y: 0 } }) {
    this.x = x
    this.y = y
    this.width = size.x
    this.height = size.y
    this.velocity = velocity
    this.center = {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
  }
    this.loaded = false
    this.img = new Image()
    this.img.onload = () => {
      // Image loaded, you can perform any additional setup here if needed
      this.loaded = true
    }
    this.img.src = 'playerAssets/IDLE/idle_down.png'
    this.curretFrame = 0
    this.elapsedTime = 0
    this.sprites = {
      idle: {
        down: 'playerAssets/IDLE/idle_down.png',
        left: 'playerAssets/IDLE/idle_left.png',
        right: 'playerAssets/IDLE/idle_right.png',
        up: 'playerAssets/IDLE/idle_up.png',
      },
      run: {
        down: 'playerAssets/RUN/run_down.png',
        left: 'playerAssets/RUN/run_left.png',
        right: 'playerAssets/RUN/run_right.png',
        up: 'playerAssets/RUN/run_up.png',
      },
      attack: {
        down: 'playerAssets/ATTACK 1/attack1_down.png',
        left: 'playerAssets/ATTACK 1/attack1_left.png',
        right: 'playerAssets/ATTACK 1/attack1_right.png',
        up: 'playerAssets/ATTACK 1/attack1_up.png',
      }  
    }
    this.lastDirection = 'down' 
    this.isAttacking = false
    this.HitBox = false

  }


  draw(c) {
    if (!this.loaded) return

    // Personaje
    const cropbox = {
      x: 0, 
      y: 0,
      width: 96,
      height: 80,
    }
    c.fillStyle = 'rgba(0, 174, 255, 0.5)'
    if (this.HitBox) c.fillRect(this.x, this.y, this.width, this.height)

    c.drawImage(
      this.img,
      cropbox.width * this.curretFrame,
      cropbox.y,
      cropbox.width,
      cropbox.height,
      this.x - 40,
      this.y - 23,
      this.width + 80,
      this.height + 45
    )

    // Debug de la hitbox de ataque
    if (this.isAttacking && this.attackHitBox && this.HitBox) {
      c.fillStyle = 'rgba(115, 255, 218, 0.5)'
      c.fillRect(
        this.attackHitBox.x,
        this.attackHitBox.y,
        this.attackHitBox.width,
        this.attackHitBox.height
      )
    }
  }

  // ⇩ 3) PRIORIDAD EN UPDATE + FINALIZAR ATAQUE
  update(deltaTime, collisionBlocks) {
    if (!deltaTime) return

    const intervalTime = 0.1
    this.elapsedTime += deltaTime

    if (this.isAttacking) {
      // Avanza frames de ataque y termina cuando llegue al último
      // Ajusta ATTACK_FRAMES al nº real de frames de tu spritesheet de ataque
      const ATTACK_FRAMES = 3

      if (this.elapsedTime > intervalTime) {
        this.curretFrame += 1
        this.elapsedTime -= intervalTime

        if (this.curretFrame >= ATTACK_FRAMES) {
          this.isAttacking = false
          this.curretFrame = 0
          this.img.src = this.sprites.idle[this.lastDirection]
        }
      }

      // No mover ni procesar colisiones durante ataque
      return
    }

    // --- Animación normal (idle/run) ---
    if (this.elapsedTime > intervalTime){ 
      this.curretFrame = (this.curretFrame + 1) % 8
      this.elapsedTime -= intervalTime
    }

    // Movimiento + colisiones
    this.updateHorizontalPosition(deltaTime)
    this.checkForHorizontalCollisions(collisionBlocks)

    this.updateVerticalPosition(deltaTime)
    this.checkForVerticalCollisions(collisionBlocks)

    this.center = {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
    }
  }


  updateHorizontalPosition(deltaTime) {
    this.x += this.velocity.x * deltaTime
  }

  updateVerticalPosition(deltaTime) {
    this.y += this.velocity.y * deltaTime
  }

// ⇩ 1) IGNORAR INPUT SI ESTÁ ATACANDO
  handleInput(keys) {
    if (this.isAttacking) {
      this.velocity.x = 0
      this.velocity.y = 0
      return
    }

    this.velocity.x = 0
    this.velocity.y = 0

    if (keys.d.pressed) {
      this.velocity.x = X_VELOCITY
      if (this.img.src !== this.sprites.run.right) this.img.src = this.sprites.run.right
      this.lastDirection = 'right'
    } else if (keys.a.pressed) {
      this.velocity.x = -X_VELOCITY
      if (this.img.src !== this.sprites.run.left) this.img.src = this.sprites.run.left
      this.lastDirection = 'left'
    } else if (keys.w.pressed) {
      this.velocity.y = -Y_VELOCITY
      if (this.img.src !== this.sprites.run.up) this.img.src = this.sprites.run.up
      this.lastDirection = 'up'
    } else if (keys.s.pressed) {
      this.velocity.y = Y_VELOCITY
      if (this.img.src !== this.sprites.run.down) this.img.src = this.sprites.run.down
      this.lastDirection = 'down'
    } else {
      switch (this.lastDirection) {
        case 'right': if (this.img.src !== this.sprites.idle.right) this.img.src = this.sprites.idle.right; break
        case 'left':  if (this.img.src !== this.sprites.idle.left)  this.img.src = this.sprites.idle.left;  break
        case 'up':    if (this.img.src !== this.sprites.idle.up)    this.img.src = this.sprites.idle.up;    break
        case 'down':
        default:      if (this.img.src !== this.sprites.idle.down)  this.img.src = this.sprites.idle.down;  break
      }
    }
  }


  attack() {
    if (this.isAttacking) return
    this.isAttacking = true
    this.velocity.x = 0
    this.velocity.y = 0
    this.curretFrame = 0
    this.elapsedTime = 0

    this.img.src = this.sprites.attack[this.lastDirection]

    // Crear hitbox de ataque
    this.attackHitBox = {
      width: 40,
      height: 40,
      x: this.x,
      y: this.y,
    }

    switch (this.lastDirection) {
      case 'right':
        this.attackHitBox.x += this.width
        this.attackHitBox.y += this.height / 2 - this.attackHitBox.height / 2
        this.attackHitBox.width -= 8
        break
      case 'left':
        this.attackHitBox.width -= 8
        this.attackHitBox.x -= this.attackHitBox.width
        this.attackHitBox.y += this.height / 2 - this.attackHitBox.height / 2
        break
      case 'up':
        this.attackHitBox.width += 20
        this.attackHitBox.x += this.width / 2 - this.attackHitBox.width / 2
        this.attackHitBox.y -= this.attackHitBox.height - 30
        break
      case 'down':
      default:
        this.attackHitBox.width += 20
        this.attackHitBox.x += this.width / 2 - this.attackHitBox.width / 2
        this.attackHitBox.y += this.height - 20
        break
    }

    console.log("Attack!")
    console.log(this.attackHitBox)
  }

  hitboxVisible() {
    this.HitBox = !this.HitBox;
  }

 
  checkForHorizontalCollisions(collisionBlocks) {
    const buffer = 0.0001
    for (let i = 0; i < collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i]

      // Check if a collision exists on all axes
      if (
        this.x <= collisionBlock.x + collisionBlock.width &&
        this.x + this.width >= collisionBlock.x &&
        this.y + this.height >= collisionBlock.y &&
        this.y <= collisionBlock.y + collisionBlock.height
      ) {
        // Check collision while player is going left
        if (this.velocity.x < -0) {
          this.x = collisionBlock.x + collisionBlock.width + buffer
          break
        }

        // Check collision while player is going right
        if (this.velocity.x > 0) {
          this.x = collisionBlock.x - this.width - buffer

          break
        }
      }
    }
  }

  checkForVerticalCollisions(collisionBlocks) {
    const buffer = 0.0001
    for (let i = 0; i < collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i]

      // If a collision exists
      if (
        this.x <= collisionBlock.x + collisionBlock.width &&
        this.x + this.width >= collisionBlock.x &&
        this.y + this.height >= collisionBlock.y &&
        this.y <= collisionBlock.y + collisionBlock.height
      ) {
        // Check collision while player is going up
        if (this.velocity.y < 0) {
          this.velocity.y = 0
          this.y = collisionBlock.y + collisionBlock.height + buffer
          break
        }

        // Check collision while player is going down
        if (this.velocity.y > 0) {
          this.velocity.y = 0
          this.y = collisionBlock.y - this.height - buffer
          break
        }
      }
    }
  }
}