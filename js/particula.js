class Particula{
    constructor({x, y, color, r = 5}){
        this.x = x;
        this.y = y;
        this.r = r;
        this.velX = -2 + Math.random() * 5;
        this.velY = -2 + Math.random() * 5;
        this.color = color;
    }
    dibujar(){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fill();
    }
    mover(){
        this.dibujar();

        this.x += this.velX;
        this.y += this.velY;

        if(this.r >= 0.2) this.r -= 0.2;
        else this.r = 0;
    }
}