
class Heart {
  constructor({ x, y, size = { x: 16, y: 16 } }) {
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
    this.img.src = 'utilsAssets/vida.png'
    this.curretFrame = 0
    this.elapsedTime = 0
    this.numberOfFrames = 2

  }


  draw(c) {
    if (!this.loaded) return
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
}   // 


