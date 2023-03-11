const canvas = document.querySelector('canvas') //storing the index.html canvas in a constant

const c = canvas.getContext('2d') //responsible for shapes and sprites

canvas.width = 1400
canvas.height = 680

c.fillRect(0,0,canvas.width, canvas.height) // x position, y position, draw width, draw height

const gravity = 0.6

const background = new Sprite({position:{x: 0, y: 0}, imageSrc:'./assets/background.png'})

const player = new Fighter( {
    position:{  //x and y values because the sprite is in 2d
    x: 0,
    y: 0
    },
    velocity:{
        x: 0, 
        y:10
    
    },
    offset: {
        x:0,
        y:0
    },
    imageSrc: './assets/character1/Idle.png',
    frames: 10,
    scale: 2.5,
    offset: {x:300, y:160},
    sprites: {
        idle: {
            imageSrc: './assets/character1/Idle.png',
            frames: 8
        },
        run: {
            imageSrc: './assets/character1/Run.png',
            frames: 8,  
        },
        jump: {
            imageSrc: './assets/character1/Jump.png',
            frames: 2,
        },
        fall: {
            imageSrc: './assets/character1/Fall.png',
            frames: 2,
        },
        attack1: {
            imageSrc: './assets/character1/Attack1.png',
            frames: 6,
        },
        takeHit: {
            imageSrc: './assets/character1/Takehit.png',
            frames: 6,
        },
        death: {
            imageSrc: './assets/character1/Death.png',
            frames: 6,
        }
        
    },
    attackBox: {
        offset: {
            x: 0,
            y: 0
        },
        width: 140,
        height: 50
    }
})

//call draw method
player.draw()

const enemy = new Fighter( {
    position:{  
    x: 400,
    y: 0
    },
    velocity:{
        x: 0,
        y:0
    
    },
    color: 'blue',
    offset: {
        x:-50,
        y:0
    },
    imageSrc: './assets/character2/Idle.png',
    frames: 10,
    scale: 2.5,
    offset: {x:200, y:170},
    sprites: {
        idle: {
            imageSrc: './assets/character2/Idle.png',
            frames: 4
        },
        run: {
            imageSrc: './assets/character2/Run.png',
            frames: 8  
        },
        jump: {
            imageSrc: './assets/character2/Jump.png',
            frames: 2,
        },
        fall: {
            imageSrc: './assets/character2/Fall.png',
            frames: 2,
        },
        attack1: {
            imageSrc: './assets/character2/Attack1.png',
            frames: 4,
        },
        takeHit: {
            imageSrc: './assets/character2/Takehit.png',
            frames: 2,
        },
        death: {
            imageSrc: './assets/character2/Death.png',
            frames: 6,
        }
        
    },
    attackBox: {
        offset: {
            x: -120,
            y: 0
        },
        width: 140,
        height: 50
    }
    
})

//
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}


decreaseTimer()

//movement
function animate() {
    c.fillStyle = 'black' //need to instantiate because it will just reference the first fillstyle
    window.requestAnimationFrame(animate)
    c.fillRect(0,0, canvas.width, canvas.height)
    background.update()
    player.update()
    enemy.update()

    player.velocity.x = 0  //stops for every frame not holding down on a key
    enemy.velocity.x = 0

    //player movment

    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    }
    else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    }
    else {
        player.switchSprite('idle')
    }

    if(player.velocity.y < 0) {
        player.switchSprite('jump')
    }
    else if(player.velocity.y > 0) {
        player.switchSprite('fall')
    }



    


    //enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    }
    else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    }
    else {
        enemy.switchSprite('idle')
    }
    if(enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    }
    else if(enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    //collisions
    if(rectangularCollision({rectangle1: player, rectangle2: enemy})&& player.isAttacking) 
        {
            player.isAttacking = false 
            enemy.health -= 10
            
            document.querySelector('#enemyHealth').style.width =enemy.health + '%'
    }
    if(rectangularCollision({rectangle1: enemy, rectangle2: player})&& enemy.isAttacking) 
    {
        enemy.isAttacking = false 
        player.health -= 10
        document.querySelector('#playerHealth').style.width =player.health + '%'
    }
    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy})
    }
}

animate()

//listens to key presses
window.addEventListener('keydown', (event) => {
    console.log(event.key)
    switch(event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            //added by me, to make jumps not be infinite
            if(player.velocity.y === 0) {
                player.velocity.y = -10
                break
            }
            else {
                player.velocity.y = -5
                break
            }
            break
        case ' ':
            player.attack()
            break   
        
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            //added by me, to make jumps not be infinite
            if(enemy.velocity.y === 0) {
                enemy.velocity.y = -10
                break
            }
            else {
                enemy.velocity.y = -5
                break
            }
            break
        case 'ArrowDown':
            enemy.attack();
            break
    }
    console.log(event.key);
})

//listens to key unpress
window.addEventListener('keyup', (event) => {
    switch(event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            break
    }
    switch(event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            break
    }
    console.log(event.key);
})