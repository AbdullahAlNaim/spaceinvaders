const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const player = new Player()
const projectiles = []
const grids = []
const InvaderProjectiles = []

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    },
    shift: {
        pressed: false
    }
}

// player.draw();
let frame = 0
let randomInterval = Math.floor((Math.random() * 500) + 500)


function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height,)

    player.update()

    InvaderProjectiles.forEach(InvaderProjectile => {
        InvaderProjectile.update()
    })

    projectiles.forEach((projectile, index) => {
        if (projectile.position.y + projectile.radius <= 0) {
            setTimeout(() => {//this is so no flashy light bugs happen when deleting shots
                projectiles.splice(index, 1)
            }, 0)
        } else {
            projectile.update()
        }
    })

    grids.forEach((grid, gridIndex) => {
        grid.update()

        //spawn projectiles
        if (frames % 100 === 0 && grid.invaders.length > 0) {
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(InvaderProjectiles)
        }

        grid.invaders.forEach((invader, i) => {
            invader.update({ velocity: grid.velocity })

            projectiles.forEach((projectile, j) => {
                if (projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
                    projectile.position.x + projectile.radius >= invader.position.x &&
                    projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
                    projectile.position.y + projectile.radius >= invader.position.y) {
                    setTimeout(() => {
                        const invaderFound = grid.invaders.find((invader2) => {
                            return invader2 === invader
                        })

                        const projectileFound = projectiles.find(projectile2 => {
                            return projectile2 === projectile
                        })
                        //remove invader and projectile
                        if (invaderFound && projectileFound) {
                            grid.invaders.splice(i, 1)
                            projectiles.splice(j, 1)

                            if (grid.invaders.length > 0) {
                                const firstInvader = grid.invaders[0]
                                const lastInvader = grid.invaders[grid.invaders.length - 1]

                                grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width
                                grid.position.x = firstInvader.position.x
                            } else {
                                grids.splice(gridIndex, 1)
                            }
                        }

                    }, 0)
                }

            })
        })
    })

    if (keys.a.pressed && player.position.x >= 0) {
        player.velocity.x = -8
        player.rotation = -.15
    }
    else if (keys.d.pressed &&
        player.position.x + player.width <= canvas.width) {
        player.velocity.x = 8
        player.rotation = .15
    }
    else {
        player.velocity.x = 0
        player.rotation = 0
    }


    //spawingin enemies
    if (frame % randomInterval === 0) {
        grids.push(new Grid())
        randomInterval = Math.floor((Math.random() * 500) + 500)
    }



    frame++
}

animate()

addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'a':
            keys.a.pressed = true
            break;
        case 'd':
            keys.d.pressed = true
            break;
        case ' ':
            keys.space.pressed = true
            projectiles.push(
                new Projectile({
                    position: {
                        x: player.position.x + player.width / 2,
                        y: player.position.y
                    },
                    velocity: {
                        x: 0,
                        y: -10
                    }
                })

            )
            console.log(projectiles)
            break;

        case 'shiftKey':
            keys.shiftKey.pressed = true
            console.log('pressed shift')
            break;
    }
})

addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'a':
            player.velocity.x = -5
            keys.a.pressed = false
            break;
        case 'd':
            player.velocity.x = 5
            keys.d.pressed = false
            break;
        case ' ':
            keys.space.pressed = true
            break;
        case 'shiftKey':
            keys.shiftKey.pressed = true
            console.log('pressed shift')
            break;

    }
})


