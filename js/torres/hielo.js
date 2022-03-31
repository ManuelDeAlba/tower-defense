class Hielo extends Torre{
    constructor({
        src,
        x,
        y,
        alcance = 150,
        precio = 50,
        
        // Atributos para las balas
        velBala = 10,
        tiempoAtaque = 60,

        factorDisminucion = 0.7,
        tiempoCongelado = 60,
        radioEfecto = 50
    }){
        super({src, x, y, alcance, precio, velBala, tiempoAtaque});
        this.factorDisminucion = factorDisminucion;
        this.tiempoCongelado = tiempoCongelado;
        this.radioEfecto = radioEfecto;

        this.srcBala = "../../img/bala_hielo.png";
    }
    mover(){
        // Funcionamiento de las balas
        this.balas.forEach(bala => {
            bala.mover();
    
            // Choque de bala con enemigo
            for(let i = 0; i < enemigos.length; i++){
                let enemigo = enemigos[i];

                if(bala.colision(enemigo)){
                    bala.velX = bala.velY = 0;
                    // El ancho debe ser menor o igual que el alto
                    bala.w = this.radioEfecto * (bala.w/bala.h);
                    bala.h = this.radioEfecto;

                    // Ahora compara con el nuevo tamaño
                    if(bala.colision(enemigo)){
                        // Hace más lento al enemigo
                        enemigo.congelar(this.factorDisminucion, this.tiempoCongelado);

                        // Partículas hielo
                        for(let i  = 0; i < cantParticulas; i++){
                            particulas.push(new Particula({x: enemigo.x, y:enemigo.y, color: "lightblue"}));
                        }

                        bala.estado = 0;
                    }
                }
            }
            
            // Borrar las balas que salen del canvas
            if(bala.x < 0 || bala.x + bala.w > canvas.width || bala.y < 0 || bala.y + bala.h > canvas.height){
                bala.estado = 0;
            }
        })

        // Se borran todas las balas necesarios
        this.balas = this.balas.filter(bala => bala.estado);

        // Dibuja la torre
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