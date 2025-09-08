class bot {
  constructor({ x, y, size, velocity = { x: 0, y: 0 }, health }) {
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
    this.img.src =`MonstersAssetes/bot/idle.png`
    this.curretFrame = 0
    this.elapsedTime = 0
    this.animationframes = {
      idle: 5,
      run: 8,
      attack: 11,
      hit: 2,
      death: 5,
    }
    this.curretAnimation = this.animationframes.idle
    this.elapsedMovmentTime = 0
    this.sprites = {
      idle: `MonstersAssetes/bot/idle.png`,
      run: `MonstersAssetes/bot/run.png`,
      attack: `MonstersAssetes/bot/attack.png`,
      hit: `MonstersAssetes/bot/hit.png`,
      death: `MonstersAssetes/bot/death.png`,
    }
    this.lastDirection = 'down' 
    this.HitBox = false
    this.health = health

  this.isTakingHit = false

  this.isInvrulnerable = false
  this.elapsedInvulnerabilityTime = 0
  this.invulnerabilityDuration = 0.5

  }
  
  hitboxVisible() {
    this.HitBox = !this.HitBox;
  }

  reciveHit(){
    this.health--
    this.isInvrulnerable = true
    Mbox.innerHTML = `<h3>Bot Health: ${this.health}</h3>`
    console.log('bot health:', this.health)

    // Empuje según la dirección del jugador
    if (player && player.lastDirection) {
      const knockback = 50 // píxeles de empuje
      switch(player.lastDirection) {
        case 'right':
          if(this.velocity.x > 100) break; // no empujar si ya se mueve rapido en esa dirección
          this.velocity.x += knockback;
          break;
        case 'left':
          if(this.velocity.x < -100) break; // no empujar si ya se mueve rapido en esa dirección
          this.velocity.x -= knockback;
          break;
        case 'up':
          if(this.velocity.y < -100) break; // no empujar si ya se mueve rapido en esa dirección
          this.velocity.y -= knockback;
          break;
        case 'down':
        default:
          if(this.velocity.y > 100) break; // no empujar si ya se mueve rapido en esa dirección
          this.velocity.y += knockback;
          break;
      }
    }
  }
  draw(c) {
    if (!this.loaded) return
    // Red square debug code
    c.fillStyle = 'rgba(0, 255, 128, 0.5)'
    if (this.HitBox) {
      c.fillRect(this.x, this.y, this.width, this.height)
    }
    // Draw player image
    const cropbox = {
      x: 0, 
      y: 0,
      width: 106, // img_width/8
      height: 22,
    }
    c.drawImage(this.img,
      cropbox.width * this.curretFrame,
      cropbox.y,
      cropbox.width,
      cropbox.height,
      this.x - 12,
      this.y, 
      this.width * 7, // scale
      this.height
      //No se pero esto es lo que funciona para que se vea bien el personaje
    )
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


    if (this.elapsedTime > intervalTime){ // Control frame rate, adjust
    this.elapsedTime -= intervalTime

    if (this.img.src.includes(this.sprites.hit)) {
      if (this.curretFrame < this.animationframes.hit - 1) {
        this.curretFrame++
      } else {
        // al acabar la animación de hit, volver a idle
        this.curretFrame = 0
        this.curretAnimation = this.animationframes.run
        this.img.src = this.sprites.run
        this.isTakingHit = false
      }
    } else {
      // animaciones normales (idle/run...) se repiten en bucle
      this.curretFrame = (this.curretFrame + 1) % this.curretAnimation
      this.isTakingHit = false
    } // si divideixes per el modul un nombre més petit et torna el mateix nombre

    
  }
    this.setVelocity(deltaTime)

    // Update horizontal position and check collisions
    this.updateHorizontalPosition(deltaTime)
    this.checkForHorizontalCollisions(collisionBlocks)

    // Update vertical position and check collisions
    this.updateVerticalPosition(deltaTime)
    this.checkForVerticalCollisions(collisionBlocks)

    this.center = {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
  }
  }

  setVelocity(deltaTime){
    // Change direction every 3 seconds and attack
    if(this.elapsedMovmentTime > 3 || this.elapsedMovmentTime === 0){
      // move in random direction
      this.elapsedMovmentTime -= 3
      const angle = Math.random() * Math.PI * 2
      const radius = 10 // Distance from the center
      const targetLocation = {
        x: this.center.x + Math.cos(angle) * radius, 
        y: this.center.y + Math.sin(angle) * radius,
      }

      const deltaX = targetLocation.x - this.center.x
      const deltaY = targetLocation.y - this.center.y

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      const normalizedX = deltaX / distance
      const normalizedY = deltaY / distance

      this.velocity.x = normalizedX * radius // Speed factor
      this.velocity.y = normalizedY * radius // Speed factor

      this.curretAnimation = this.animationframes.run
      this.img.src = this.sprites.run

    }
    this.elapsedMovmentTime += deltaTime
  }



  updateHorizontalPosition(deltaTime) {
    this.x += this.velocity.x * deltaTime
  }

  updateVerticalPosition(deltaTime) {
    this.y += this.velocity.y * deltaTime
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
          this.velocity.x = -this.velocity.x 
          break
        }

        // Check collision while player is going right
        if (this.velocity.x > 0) {
          this.x = collisionBlock.x - this.width - buffer
          this.velocity.x = -this.velocity.x

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
          this.y = collisionBlock.y + collisionBlock.height + buffer
          this.velocity.y = -this.velocity.y
          break
        }

        // Check collision while player is going down
        if (this.velocity.y > 0) {
          this.y = collisionBlock.y - this.height - buffer
          this.velocity.y = -this.velocity.y
          break
        }
      }
    }
  }
}