class Torre{
    constructor({
        src,
        x,
        y,
        alcance = 150,
        precio = 50,
        
        // Atributos para las balas
        velBala = 10,
        dano = 5,
        tiempoAtaque = 60 / 2
    }){
        this.x = x;
        this.y = y;
        this.r = 20;
        this.alcanceVisible = false;
        this.alcance = alcance;
        this.velBala = velBala;
        this.dano = dano;
        
        this.precio = precio;
        this.balas = [];

        this.img = new Image();
        this.img.src = src;
        
        // Hace que al principio apunte a donde salen los enemigos
        this.angulo = Math.atan2(canvas.height/2 - this.y, 0 - this.x);

        // En este caso, la bala es mas larga que ancha
        // Para la bala de cañon, se redefinen estos atributos
        // Y para cada clase diferente, se redefine la imagen
        this.wBala = 5;
        this.hBala = 10;
        this.srcBala = "../../img/bala.png";
        
        this.tiempoAtaque = tiempoAtaque;
        this.contadorAtaque = 0;
    }
    dibujar(){
        // Alcance
        if(this.alcanceVisible){
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.alcance, 0, 2 * Math.PI);
            ctx.fill();
        }

        // Torre
        ctx.save();
        ctx.translate(this.x, this.y);
        // El Math.PI/2 es para corregir el angulo
        ctx.rotate(this.angulo + Math.PI/2);

        ctx.drawImage(this.img, -this.r, -this.r, this.r * 2, this.r * 2);

        ctx.restore();
    }
    distancia(enemigo){
        return Math.hypot(this.x - enemigo.x, this.y - enemigo.y);
    }
    atacar(enemigo){
        //? Solo crea la bala, no detecta colisiones
        this.contadorAtaque++;
        if(this.contadorAtaque % this.tiempoAtaque == 0){
            // Obtener el angulo para crear la bala
            this.angulo = Math.atan2(enemigo.y - this.y, enemigo.x - this.x);
            
            let velX = Math.cos(this.angulo) * this.velBala;
            let velY = Math.sin(this.angulo) * this.velBala;
            
            this.balas.push(new Bala({x: this.x, y: this.y, w: this.wBala, h: this.hBala, velX, velY, dano: this.dano, srcBala: this.srcBala}));
            this.contadorAtaque = 0;
        }
    }
    mover(){
        // Funcionamiento de las balas
        this.balas.forEach((bala, indiceBala) => {
            bala.mover();
    
            // Choque de bala con enemigo
            enemigos.forEach((enemigo, indiceEnemigo) => {
                if(bala.colision(enemigo)){
                    // Sumar el dinero de acuerdo al daño de la bala y de la vida restante
                    if(enemigo.nivel >= bala.dano) dinero += bala.dano;
                    else dinero += enemigo.nivel;
    
                    enemigo.nivel -= bala.dano;
    
                    // Se crean las particulas
                    for(let i = 0; i < cantParticulas; i++){
                        particulas.push(new Particula({x: enemigo.x, y: enemigo.y, color: enemigo.color}));
                    }
    
                    // Se borra el enemigo y la bala
                    if(enemigo.nivel <= 0) enemigos.splice(indiceEnemigo, 1);
                    this.balas.splice(indiceBala, 1);
                }
            })
    
            // Borrar las balas que salen del canvas
            if( bala.x - bala.r < 0 || bala.x + bala.r > canvas.width || bala.y - bala.r < 0 || bala.y + bala.r > canvas.height){
                this.balas.splice(indiceBala, 1);
            }
        })

        this.dibujar();

        // Ataca al enemigo que este en primer lugar
        for(let i = 0; i < enemigos.length; i++){
            let enemigo = enemigos[i];
            
            if(this.distancia(enemigo) <= this.alcance + enemigo.r){
                this.atacar(enemigo);
                break;
            }
        }
    }
}