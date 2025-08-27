class Door {
  constructor({ x, y, size,}) {
    this.x = x
    this.y = y
    this.width = size.x
    this.height = size.y
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
    this.img.src = 'utilsAssets/door.png'
    this.curretFrame = 0
    this.elapsedTime = 0

    this.lvlfinished = false


  }


  draw(c) {
    if (!this.loaded) return
    // Personaje
    const cropbox = {
      x: 0, 
      y: 0,
      width: 16,
      height: 16,
    }



    c.drawImage(
      this.img,
      cropbox.width * this.curretFrame,
      cropbox.y,
      cropbox.width,
      cropbox.height,
      this.x,
      this.y,
      this.width,
      this.height   
    )

  }

    // Llama a esta función cuando el nivel se complete
    finishLevel() {
      this.lvlfinished = true
      this.curretFrame = 0 // Reinicia la animación
      this.elapsedTime = 0 // Reinicia el tiempo transcurrido
    }
  // ⇩ 3) PRIORIDAD EN UPDATE + FINALIZAR ATAQUE
  update(deltaTime,) {
    if (!deltaTime) return
    const intervalTime = 0.2
    this.elapsedTime += deltaTime

    // --- Animación normal (door open & close) ---
    if (this.lvlfinished && this.elapsedTime > intervalTime) { 
    this.curretFrame++ 
    if (this.curretFrame >= 3) {
        this.curretFrame = 3 // o 0, depende si quieres que se quede abierta o que repita
        this.lvlfinished = false // si quieres que solo se ejecute una vez

        
    }
    this.elapsedTime -= intervalTime
}
  }
}
// --- FIN DE LA ANIMACIÓN NORMAL ---