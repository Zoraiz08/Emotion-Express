window.addEventListener('keydown', (event) => {
  if (door.open) {
    keys.w.pressed = false
    keys.a.pressed = false
    keys.s.pressed = false
    keys.d.pressed = false
    if (event.key === ' ') event.preventDefault() // Prevent scrolling
    return
  }
 

  switch (event.key) {
    case 'w':
      keys.w.pressed = true
      break
    case 'a':
      keys.a.pressed = true
      break
    case 's':
      keys.s.pressed = true
      break
    case 'd':
      keys.d.pressed = true
      break
    case ' ':
      event.preventDefault() // Prevent scrolling

      player.attack() 
      break
    case 'h': // debug hitboxes
      player.hitboxVisible();
      door.hitboxVisible()
      monsters.forEach(monster => {
        monster.hitboxVisible();
      });
      console.log('Hitboxes toggled')
      break
    case 'e':
      keys.e.pressed = true
      break
    case 'c':
      mostrarOcultarCamara();
      break
    case 'm':
      IAmode();
      break
    }

})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'w':
      keys.w.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
    case 's':
      keys.s.pressed = false
      break
    case 'd':
      keys.d.pressed = false
      break
    case 'e':
      keys.e.pressed = false
      break
    }
})

// On return to game's tab, ensure delta time is reset
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    lastTime = performance.now()
  }
})