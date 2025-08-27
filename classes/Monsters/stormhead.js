class stormhead {
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
    this.img.src =`MonstersAssetes/stormhead/idle.png`
    this.curretFrame = 0
    this.elapsedTime = 0
    this.animationframes = {
      idle: 9,
      run: 10,
      attack: 21,
      hit: 2,
      death: 8,
    }
    this.curretAnimation = this.animationframes.idle
    this.elapsedMovmentTime = 0
    this.sprites = {
      idle: `MonstersAssetes/stormhead/idle.png`,
      run: `MonstersAssetes/stormhead/run.png`,
      attack: `MonstersAssetes/stormhead/attack.png`,
      hit: `MonstersAssetes/stormhead/hit.png`,
      death: `MonstersAssetes/stormhead/death.png`,
    }
    this.lastDirection = 'down' 
    this.HitBox = false

  }
  draw(c) {
    if (!this.loaded) return
    // Red square debug code

    if (this.HitBox) {
      c.fillStyle = 'rgba(255, 0, 0, 0.5)'
      c.fillRect(this.x, this.y, this.width, this.height)
    }
    // Draw player image
    const cropbox = {
      x: 0, 
      y: 0,
      width: 119, // img_width/8
      height: 124,
    }
    c.drawImage(this.img,
      cropbox.x,
      cropbox.height * this.curretFrame,
      cropbox.width,
      cropbox.height,
      this.x - 38,
      this.y- 69, 
      this.width + 87,
      this.height + 70
      //No se pero esto es lo que funciona para que se vea bien el personaje
    )
  }

  update(deltaTime, collisionBlocks) {
    if (!deltaTime) return

    const intervalTime = 0.1
    this.elapsedTime += deltaTime
    if (this.elapsedTime > intervalTime){ // Control frame rate, adjust
    // 0 - 7
    this.curretFrame = (this.curretFrame + 1) % this.curretAnimation // si divideixes per el modul un nombre més petit et torna el mateix nombre
    this.elapsedTime -= intervalTime
    
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
  hitboxVisible(){
    this.HitBox = !this.HitBox;
  }

  setVelocity(deltaTime){
    // Change direction every 3 seconds and attack
    if(this.elapsedMovmentTime > 1 || this.elapsedMovmentTime === 0){
      // move in random direction
      this.elapsedMovmentTime -= 1
      const angle = Math.random() * Math.PI * 2
      const radius = 60 // Distance from the center
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