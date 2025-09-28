const X_VELOCITY = 140
const Y_VELOCITY = 140

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

    this.curretFrame = 0
    this.elapsedTime = 0
    this.lastDirection = 'down' 
    this.isAttacking = false
    this.HitBox = false
    this.isInvrulnerable = false
    this.invulnerabilityDuration = 1
    this.elapsedInvulnerabilityTime = 0

    // --- Precarga de sprites ---
    this.sprites = {
      idle: {
        down: new Image(),
        left: new Image(),
        right: new Image(),
        up: new Image(),
      },
      run: {
        down: new Image(),
        left: new Image(),
        right: new Image(),
        up: new Image(),
      },
      attack: {
        down: new Image(),
        left: new Image(),
        right: new Image(),
        up: new Image(),
      }
    }

    // Rutas
    this.sprites.idle.down.src = 'playerAssets/IDLE/idle_down.png'
    this.sprites.idle.left.src = 'playerAssets/IDLE/idle_left.png'
    this.sprites.idle.right.src = 'playerAssets/IDLE/idle_right.png'
    this.sprites.idle.up.src = 'playerAssets/IDLE/idle_up.png'

    this.sprites.run.down.src = 'playerAssets/RUN/run_down.png'
    this.sprites.run.left.src = 'playerAssets/RUN/run_left.png'
    this.sprites.run.right.src = 'playerAssets/RUN/run_right.png'
    this.sprites.run.up.src = 'playerAssets/RUN/run_up.png'

    this.sprites.attack.down.src = 'playerAssets/ATTACK 1/attack1_down.png'
    this.sprites.attack.left.src = 'playerAssets/ATTACK 1/attack1_left.png'
    this.sprites.attack.right.src = 'playerAssets/ATTACK 1/attack1_right.png'
    this.sprites.attack.up.src = 'playerAssets/ATTACK 1/attack1_up.png'

    // Imagen inicial
    this.img = this.sprites.idle.down

    // Hitbox de ataque
    this.attackHitBox = {
      width: 40,
      height: 40,
      x: this.x,
      y: this.y,
    }
  }

  reciveHit(){
    this.isInvrulnerable = true
  }

  draw(c) {
    if (!this.img.complete) return

    const cropbox = { x: 0, y: 0, width: 96, height: 84 }

    if (this.HitBox) {
      c.fillStyle = 'rgba(0, 174, 255, 0.5)'
      c.fillRect(this.x, this.y, this.width, this.height)
    }

    c.save()
    c.globalAlpha = this.isInvrulnerable ? 0.5 : 1
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
    c.restore()

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

  update(deltaTime, collisionBlocks) {
    if (!deltaTime) return

    const intervalTime = 0.1
    this.elapsedTime += deltaTime

    if(this.isInvrulnerable){
      this.elapsedInvulnerabilityTime += deltaTime
      if(this.elapsedInvulnerabilityTime > this.invulnerabilityDuration){
        this.isInvrulnerable = false
        this.elapsedInvulnerabilityTime = 0
      }
    }

    if (this.isAttacking) {
      const ATTACK_FRAMES = 3

      if (this.elapsedTime > intervalTime) {
        this.curretFrame += 1
        this.elapsedTime -= intervalTime

        if (this.curretFrame >= ATTACK_FRAMES) {
          this.isAttacking = false
          this.curretFrame = 0
          this.img = this.sprites.idle[this.lastDirection]
        }
      }
      return
    }

    if (this.elapsedTime > intervalTime){ 
      this.curretFrame = (this.curretFrame + 1) % 8
      this.elapsedTime -= intervalTime
    }

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

  handleInput(keys) {
    if (door.open) return
    if (this.isAttacking) {
      this.velocity.x = 0
      this.velocity.y = 0
      return
    }

    this.velocity.x = 0
    this.velocity.y = 0

    if (keys.d.pressed) {
      this.velocity.x = X_VELOCITY
      if (this.img !== this.sprites.run.right) this.img = this.sprites.run.right
      if(this.isInvrulnerable) this.velocity.x *= 0.5
      this.lastDirection = 'right'
    } else if (keys.a.pressed) {
      this.velocity.x = -X_VELOCITY
      if (this.img !== this.sprites.run.left) this.img = this.sprites.run.left
      if(this.isInvrulnerable) this.velocity.x *= 0.5
      this.lastDirection = 'left'
    } else if (keys.w.pressed) {
      this.velocity.y = -Y_VELOCITY
      if (this.img !== this.sprites.run.up) this.img = this.sprites.run.up
      if(this.isInvrulnerable) this.velocity.y *= 0.5
      this.lastDirection = 'up'
    } else if (keys.s.pressed) {
      this.velocity.y = Y_VELOCITY
      if (this.img !== this.sprites.run.down) this.img = this.sprites.run.down
      if(this.isInvrulnerable) this.velocity.y *= 0.5       
      this.lastDirection = 'down'
    } else {
      switch (this.lastDirection) {
        case 'right': if (this.img !== this.sprites.idle.right) this.img = this.sprites.idle.right; break
        case 'left':  if (this.img !== this.sprites.idle.left)  this.img = this.sprites.idle.left;  break
        case 'up':    if (this.img !== this.sprites.idle.up)    this.img = this.sprites.idle.up;    break
        case 'down':
        default:      if (this.img !== this.sprites.idle.down)  this.img = this.sprites.idle.down;  break
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

    this.attackHitBox.width = 40
    this.attackHitBox.height = 40
    this.attackHitBox.x = this.x
    this.attackHitBox.y = this.y

    this.img = this.sprites.attack[this.lastDirection]

    switch (this.lastDirection) {
      case 'right':
        this.attackHitBox.width -= 8
        this.attackHitBox.height -= 15
        this.attackHitBox.x += this.width 
        this.attackHitBox.y += this.height / 2 - this.attackHitBox.height / 2
        this.attackHitBox.y -= 2
        break
      case 'left':
        this.attackHitBox.width -= 8
        this.attackHitBox.height -= 15
        this.attackHitBox.x -= this.attackHitBox.width
        this.attackHitBox.y += this.height / 2 - this.attackHitBox.height / 2
        this.attackHitBox.y += 4
        break
      case 'up':
        this.attackHitBox.width += 15
        this.attackHitBox.height -= 3
        this.attackHitBox.x += this.width / 2 - this.attackHitBox.width / 2
        this.attackHitBox.x -= 2
        this.attackHitBox.y -= this.attackHitBox.height - 30
        break
      case 'down':
      default:
        this.attackHitBox.width += 15
        this.attackHitBox.height -= 7
        this.attackHitBox.x += this.width / 2 - this.attackHitBox.width / 2
        this.attackHitBox.x -= 2
        this.attackHitBox.y += this.height - 20
        break
    }
  }

  hitboxVisible() {
    this.HitBox = !this.HitBox;
  }

  checkForHorizontalCollisions(collisionBlocks) {
    const buffer = 0.0001
    for (let i = 0; i < collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i]
      if (
        this.x <= collisionBlock.x + collisionBlock.width &&
        this.x + this.width >= collisionBlock.x &&
        this.y + this.height >= collisionBlock.y &&
        this.y <= collisionBlock.y + collisionBlock.height
      ) {
        if (this.velocity.x < 0) {
          this.x = collisionBlock.x + collisionBlock.width + buffer
          break
        }
        if (this.velocity.x > 0) {
          this.x = collisionBlock.x - this.width - buffer
          break
        }
      }
    }
  }

  checkForVerticalCollisions(collisionBlocks) {
    if(door.open) return
    
    const buffer = 0.0001
    for (let i = 0; i < collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i]
      if (
        this.x <= collisionBlock.x + collisionBlock.width &&
        this.x + this.width >= collisionBlock.x &&
        this.y + this.height >= collisionBlock.y &&
        this.y <= collisionBlock.y + collisionBlock.height
      ) {
        if (this.velocity.y < 0) {
          this.velocity.y = 0
          this.y = collisionBlock.y + collisionBlock.height + buffer
          break
        }
        if (this.velocity.y > 0) {
          this.velocity.y = 0
          this.y = collisionBlock.y - this.height - buffer
          break
        }
      }
    }
  }
}
