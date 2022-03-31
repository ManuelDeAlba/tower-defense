class Enemigo{
    constructor({ nivel = 1 }){
        this.r = 10;
        this.x = -this.r;
        this.y = canvas.width / 2;
        this.color;
        
        this.nivel = nivel;
        this.limiteVel = 2.5;
        this.vel;

        // Efecto congelacion
        this.congelado = false;
        this.tiempoCongelado;
        this.factorDisminucion;
    }
    dibujar(){
        this.color = `hsl(${(this.nivel - 1) * (360/11)}, 100%, 50%)`;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fill();

        // Escribir el nivel en el centro
        ctx.save();
        ctx.fillStyle = "#000";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.nivel, this.x, this.y);
        ctx.restore();
    }
    mover(){
        this.dibujar();

        // La velocidad va cambiando dependiendo del nivel actual del enemigo
        this.vel = 1 + (this.nivel) / 100;
        if(this.vel > this.limiteVel) this.vel = this.limiteVel;

        // Si esta congelado, la velocidad disminuye
        if(this.tiempoCongelado > 0){
            this.vel *= this.factorDisminucion;
            this.tiempoCongelado--;
        }

        this.x += this.vel;
    }
    congelar(factorDisminucion, tiempoCongelado){
        this.factorDisminucion = factorDisminucion;
        this.tiempoCongelado = tiempoCongelado;
    }
}