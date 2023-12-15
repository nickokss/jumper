// Manejo del personaje del jugador
class Player {
    constructor(ctx, canvasHeight, skaterImage, skaterJumpingImage) {
        this.ctx = ctx;
        this.canvasHeight = canvasHeight;
        this.x = 20; // La posición X
        this.y = (this.canvasHeight / 2 + 48); 
        this.width = 100; // El ancho del patinador
        this.height = 100; // El alto del patinador
        
        this.velocityY = 0; // La velocidad vertical inicial
        this.gravity = 1; // La gravedad
        this.lift = -20; // La fuerza de salto
        this.isJumping = false; // Estado del salto
        this.image = skaterImage; // Imagen del patinador normal
        this.jumpingImage = skaterJumpingImage; // Imagen del patinador saltando
    }

    draw() {
        let currentImage = this.isJumping ? this.jumpingImage : this.image;
        this.ctx.drawImage(currentImage, this.x, this.y, this.width, this.height);
    }

    jump() {
        if (!this.isJumping) {
            this.velocityY = this.lift;
            this.isJumping = true;
        }
    }

    update() {
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        // Asegurarse de que el patinador no caiga por debajo del suelo
        if (this.y >= this.canvasHeight / 2 +48) {
            this.y = this.canvasHeight / 2 +48;
            this.velocityY = 0;
            this.isJumping = false;
        }

        this.draw();
    }
}

export default Player;




