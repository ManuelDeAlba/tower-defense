class Bala{
    constructor({x, y, velX, velY, dano}){
        this.x = x;
        this.y = y;
        this.r = 5;
        this.velX = velX;
        this.velY = velY;
        this.dano = dano;

        this.img = new Image();
        this.img.src = "../img/bala.png";
    }
    dibujar(){
        ctx.save();
        ctx.translate(this.x, this.y);
        // Math.PI/2 para arreglar el angulo de la bala
        ctx.rotate(Math.atan2(this.velY, this.velX) + Math.PI/2);
        ctx.drawImage(this.img, -this.r/2, -this.r, this.r, this.r * 2);
        ctx.restore();
    }
    colision(enemigo){
        return Math.hypot(enemigo.x - this.x, enemigo.y - this.y) <= enemigo.r + this.r;
    }
    mover(){
        this.dibujar();

        this.x += this.velX;
        this.y += this.velY;
    }
}