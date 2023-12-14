// Código principal de JavaScript para el juego
import Player from './player.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let highScore = 0;
let gameRunning = true;

// Carga imágenes del patinador
const skaterImage = new Image();
const skaterJumpingImage = new Image();

// Asegúrate de que ambas imágenes se carguen antes de iniciar el juego
let imagesLoaded = 0;
function onImageLoad() {
    imagesLoaded++;
    if (imagesLoaded === 2) {
        // Todas las imágenes están cargadas, por lo que se puede iniciar el juego
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const player = new Player(ctx, canvas.height, skaterImage, skaterJumpingImage);
        const obstacles = [];

        function addObstacle() {
            const obstacle = {
                x: canvas.width,
                y: canvas.height / 2,
                width: 20,
                height: 20
            };
            obstacles.push(obstacle);
            scheduleNextObstacle(); // Programar el próximo obstáculo
        }

        function scheduleNextObstacle() {
            const minInterval = 1000; // Mínimo tiempo en milisegundos
            const maxInterval = 2000; // Máximo tiempo en milisegundos
            const interval = Math.random() * (maxInterval - minInterval) + minInterval;

            setTimeout(addObstacle, interval);
        }

        function drawObstacles() {
            obstacles.forEach(obstacle => {
                ctx.fillStyle = 'red';
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            });
        }

        function updateObstacles() {
            for (let i = obstacles.length - 1; i >= 0; i--) {
                obstacles[i].x -= 8;

                // Comprobar si el obstáculo ha sido superado
                if (!obstacles[i].passed && obstacles[i].x + obstacles[i].width < player.x) {
                    score++;
                    obstacles[i].passed = true; // Marcar el obstáculo como superado
                }

                if (obstacles[i].x + obstacles[i].width < 0) {
                    obstacles.splice(i, 1);
                }
            }
        }

        function checkCollision(player, obstacle) {
            return player.x < obstacle.x + obstacle.width &&
                player.x + player.width > obstacle.x &&
                player.y < obstacle.y + obstacle.height &&
                player.y + player.height > obstacle.y;
        }

        //Pinta el score(record)
        function drawScore() {
            ctx.fillStyle = 'black';
            ctx.font = '20px Arial';
            ctx.fillText('Score: ' + score, 10, 30);
            ctx.fillText('High Score: ' + highScore, 10, 60);
        }

        function gameOver() {
            ctx.fillStyle = 'black';
            ctx.font = '40px Arial';
            ctx.fillText('Game Over', canvas.width / 2 - 130, canvas.height / 2 -40);
        }

        document.addEventListener('keydown', (event) => {
            if (event.code === "Space") {
                player.jump();
            }
        });

        function gameLoop() {
            if (!gameRunning) {
                if (score > highScore) {
                    highScore = score;
                }
                gameOver();
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            player.update();
            updateObstacles();
            drawObstacles();

            for (let obstacle of obstacles) {
                if (checkCollision(player, obstacle)) {
                    gameRunning = false;
                    break;
                }
            }


            drawScore();

            requestAnimationFrame(gameLoop);
        }


        scheduleNextObstacle(); // Inicia la programación de obstáculos
        gameLoop();
    }
}

skaterImage.onload = onImageLoad;
skaterJumpingImage.onload = onImageLoad;
skaterImage.src = '../assets/images/patinando.png';
skaterJumpingImage.src = '../assets/images/salto.png';
