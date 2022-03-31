class Bala{
    constructor({x, y, w, h, velX, velY, dano, srcBala}){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.velX = velX;
        this.velY = velY;
        this.dano = dano;

        this.img = new Image();
        this.img.src = srcBala;
    }
    dibujar(){
        // Area de colision
        // ctx.fillStyle = "orange";
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, Math.max(this.w, this.h)/2, 0, 2 * Math.PI);
        // ctx.fill();

        ctx.save();
        
        ctx.translate(this.x, this.y);
        // Math.PI/2 para arreglar el angulo de la bala
        ctx.rotate(Math.atan2(this.velY, this.velX) + Math.PI/2);
        ctx.drawImage(this.img, -this.w/2, -this.h/2, this.w, this.h);
        
        ctx.restore();

    }
    colision(enemigo){
        return Math.hypot(enemigo.x - this.x, enemigo.y - this.y) <= enemigo.r + Math.max(this.w, this.h) / 2;
    }
    mover(){
        this.dibujar();

        this.x += this.velX;
        this.y += this.velY;
    }
}