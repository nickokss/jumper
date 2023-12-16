// Código principal de JavaScript para el juego
import Player from './player.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const minObstacleSeparation = 400;

let score = 0;
let highScore = 0;
let gameRunning = true;

//+10 points
let showPlusTen = false;
let plusTenTimer = 0;
let plusTenPosition = { x: 0, y: 0 };

// Carga imágenes del patinador
const skaterImage = new Image();
const skaterJumpingImage = new Image();
//Carga imagenes de obstaculos
const coneImage = new Image();
const barrelImage = new Image();
const bushImage = new Image();
const birdImage = new Image();

// Asegurarnos de que ambas imágenes se carguen antes de iniciar el juego
let imagesLoaded = 0;
let lastObstacleX = -minObstacleSeparation;
function onImageLoad() {
    imagesLoaded++;
    if (imagesLoaded === 6) {
        // Todas las imágenes están cargadas, por lo que se puede iniciar el juego
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let player = new Player(ctx, canvas.height, skaterImage, skaterJumpingImage);
        const obstacles = [];

        function addObstacle() {
            const nextObstacleX = Math.max(
                canvas.width,
                lastObstacleX + minObstacleSeparation + Math.random() * minObstacleSeparation
            );
        
            // Decide aleatoriamente si el próximo obstáculo será un pájaro
            const isBird = Math.random() < 0.15; // 15% de posibilidades de que sea un pájaro
        
            const obstacleImages = isBird ? [birdImage] : [coneImage, barrelImage, bushImage];
            const image = obstacleImages[Math.floor(Math.random() * obstacleImages.length)];
            
            // Si es un pájaro, ajusta la posición Y para que vuele más alto
            const obstacleY = isBird ? (canvas.height / 2) : (canvas.height / 2 + 96); // Ajusta a 1/4 de la altura para los pájaros
            
            const obstacle = {
                x: nextObstacleX,
                y: obstacleY,
                width: 50,
                height: 50,
                image: image
            };
            obstacles.push(obstacle);
            scheduleNextObstacle(); // Programar el próximo obstáculo
        }
        

        //Dibuja el suelo
        function drawRoad() {
            const roadY = canvas.height / 2 +145;
            const roadHeight = 1000; // El grosor de la carretera
        
            ctx.fillStyle = 'black';
            ctx.fillRect(0, roadY, canvas.width, roadHeight);
        }
        
        function scheduleNextObstacle() {
            const minInterval = 1000; // Mínimo tiempo en milisegundos
            const maxInterval = 2000; // Máximo tiempo en milisegundos
            const interval = Math.random() * (maxInterval - minInterval) + minInterval;

            setTimeout(addObstacle, interval);
        }

        function drawObstacles() {
            obstacles.forEach(obstacle => {
                ctx.drawImage(obstacle.image, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            });
        }

        function updateObstacles() {
            for (let i = obstacles.length - 1; i >= 0; i--) {
                obstacles[i].x -= 6;
        
                if (!obstacles[i].passed && obstacles[i].x + obstacles[i].width < player.x) {
                    updateScore(1); // Incrementa la puntuación por 1
                    obstacles[i].passed = true;
                }
        
                if (obstacles[i].x + obstacles[i].width < 0) {
                    obstacles.splice(i, 1);
                }
            }
        }
        

        function checkCollision(player, obstacle) {
            // Ajusta estos valores para hacer la hitbox más pequeña
            const hitboxPadding = 15; // Reduce la hitbox en 5 píxeles por cada lado, por ejemplo
        
            return (
                player.x < obstacle.x + obstacle.width - hitboxPadding &&
                player.x + player.width > obstacle.x + hitboxPadding &&
                player.y < obstacle.y + obstacle.height - hitboxPadding &&
                player.y + player.height > obstacle.y + hitboxPadding
            );
        }

        //Pinta el score(record)
        function drawScore() {
            ctx.fillStyle = 'black';
            ctx.font = '24px Arial';
            ctx.fillText('Score: ' + score, canvas.width / 2 -140 , 60);
            ctx.fillText('High Score: ' + highScore, canvas.width / 2  , 60);
        }

        function updateScore(newPoints) {
            score += newPoints;
        
            // Verifica si la puntuación aumentó en 10 puntos
            if (score % 10 === 0) {
                pointsSound.currentTime = 0; 
                pointsSound.play();
                showPlusTen = true;
                plusTenTimer = 120; // 2 segundos en frames (suponiendo 60fps)
                plusTenPosition.x = canvas.width / 2 - 45; // Ajusta según donde quieras mostrar el mensaje
                plusTenPosition.y = 120;
            }
        }

        function drawPlusTen() {
            if (showPlusTen) {
                ctx.fillStyle = '#505F32'; // Elige el color del texto
                ctx.font = '40px Arial'; // Elige el tamaño y estilo de la fuente
                ctx.fillText('+10', plusTenPosition.x, plusTenPosition.y);
                plusTenTimer--;
                if (plusTenTimer <= 0) {
                    showPlusTen = false;
                }
            }
        }

        function gameOver() {
            ctx.fillStyle = 'black';
            ctx.font = '40px Arial';
            ctx.fillText('Game Over', canvas.width / 2 -100, canvas.height / 2 -100);

            // Muestra el botón de reinicio
            const restartButton = document.getElementById('restartButton');
            restartButton.style.display = 'block';
        }

        function restartGame() {
            score = 0;
            gameRunning = true;
            obstacles.length = 0; // Limpia los obstáculos existentes
            player = new Player(ctx, canvas.height, skaterImage, skaterJumpingImage); // Crea una nueva instancia del jugador
        
            // Oculta el botón de reinicio
            const restartButton = document.getElementById('restartButton');
            restartButton.style.display = 'none';
        
            // Inicia nuevamente el bucle del juego
            requestAnimationFrame(gameLoop);
        }

        //Instrucciones del juego
        function drawTapToJumpText() {
            const text = "Tap the screen to jump";
            ctx.fillStyle = 'white'; // Elige el color del texto
            ctx.font = '20px Arial'; // Elige el tamaño de la fuente y el estilo
            const textWidth = ctx.measureText(text).width;
            const xPosition = (canvas.width - textWidth) / 2; // Centrar el texto en el eje X
            const yPosition = canvas.height - 100; // Coloca el texto 30px arriba del fondo del canvas
        
            ctx.fillText(text, xPosition, yPosition);
        }

        document.getElementById('restartButton').addEventListener('click', function() {
            restartGame(); // Llama a la función que reinicia el juego
        });

        document.addEventListener('click', function() {
            player.jump();
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
            drawRoad();
            drawObstacles();
            drawPlusTen();
            player.update();
            updateObstacles();
            drawTapToJumpText();

            for (let obstacle of obstacles) {
                if (checkCollision(player, obstacle)) {
                    looseSound.currentTime = 0; 
                    looseSound.play();
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
coneImage.onload = onImageLoad;
barrelImage.onload = onImageLoad;
bushImage.onload = onImageLoad;
birdImage.onload = onImageLoad;
skaterImage.src = '../assets/images/patinando-sb.png';
skaterJumpingImage.src = '../assets/images/salto-sb.png';
coneImage.src = '../assets/images/barrel-gg.png';
barrelImage.src = '../assets/images/cono-gg.png';
bushImage.src = '../assets/images/bush-gg.png';
birdImage.src = '../assets/images/pajaro-gg.png';