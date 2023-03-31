const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const player = new Player()
const projectiles = []
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    space: {
        pressed: false
    }
}

// player.draw();

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height,)

    player.update()

    projectiles.forEach((projectile, index) => {
        if (projectile.position.y + projectile.radius <= 0) {
            setTimeout(() => {//this is so no flashy light bugs happen when deleting shots
                projectiles.splice(index, 1)
            }, 0)

        } else {
            projectile.update()
        }

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

    }
})


