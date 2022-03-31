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
        this.balas.forEach((bala, indiceBala) => {
            bala.mover();
    
            // Choque de bala con enemigo
            enemigos.forEach(enemigo => {
                if(bala.colision(enemigo)){
                    // Al chocar, toma en cuenta el radio del efecto
                    bala.velX = bala.velY = 0;
                    // El ancho debe ser menor o igual que el alto
                    bala.w = this.radioEfecto * (bala.w/bala.h);
                    bala.h = this.radioEfecto;

                    // Ahora compara con el radio del efecto
                    if(bala.colision(enemigo)){
                        // Hace más lento al enemigo
                        enemigo.congelar(this.factorDisminucion, this.tiempoCongelado);

                        // Partículas hielo
                        for(let i  = 0; i < cantParticulas; i++){
                            particulas.push(new Particula({x: enemigo.x, y:enemigo.y, color: "lightblue"}));
                        }
    
                        // Se borra la bala
                        this.balas.splice(indiceBala, 1);
                    }
                }
            })
    
            // Borrar las balas que salen del canvas
            if(bala.x < 0 || bala.x + bala.w > canvas.width || bala.y < 0 || bala.y + bala.h > canvas.height){
                this.balas.splice(indiceBala, 1);
            }
        })

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