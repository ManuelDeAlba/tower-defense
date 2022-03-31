class Mensaje{
    constructor({
        x,
        y,
        msg,
        color = "#fff",
        tiempo = 60
    }){
        this.x = x;
        this.y = y;
        this.velY = -0.5;

        this.msg = msg;
        this.tiempo = tiempo;
        this.contador = 0;

        this.color = color;
        this.estado = 1;
    }
    dibujar(){
        ctx.save();

        ctx.fillStyle = this.color;
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.msg, this.x, this.y);

        ctx.restore();
    }
    mover(){
        this.dibujar();

        this.y += this.velY;

        this.contador++;
        if(this.contador >= this.tiempo){
            this.estado = 0;
        }
    }
}