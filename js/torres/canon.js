class Canon extends Torre{
    constructor({
        src,
        x,
        y,
        alcance = 150,
        precio = 50,
        // Atributos para las balas
        velBala = 10,
        dano = 5,
        tiempoAtaque = 60,

        radioEfecto = 50
    }){
        super({src, x, y, alcance, precio, velBala, dano, tiempoAtaque});
        this.radioEfecto = radioEfecto;
    }
    mover(){
        // Funcionamiento de las balas
        this.balas.forEach((bala, indiceBala) => {
            bala.mover();
    
            // Choque de bala con enemigo
            enemigos.forEach((enemigo, indiceEnemigo) => {
                if(bala.colision(enemigo)){
                    // Al chocar, toma en cuenta el radio del efecto
                    bala.velX = bala.velY = 0;
                    bala.r = this.radioEfecto;
                    
                    enemigos.forEach((e, iE) => {
                        // Ahora compara con el radio del efecto
                        if(bala.colision(e)){
                            // Sumar el dinero de acuerdo al daño de la bala y de la vida restante
                            if(e.nivel >= bala.dano) dinero += bala.dano;
                            else dinero += e.nivel;

                            e.nivel -= bala.dano;

                            // Se crean las particulas
                            for(let i = 0; i < cantParticulas; i++){
                                particulas.push(new Particula({x: e.x, y: e.y, color: e.color}));
                            }
        
                            // Se borra el enemigo y la bala
                            if(e.nivel <= 0) enemigos.splice(iE, 1);
                            this.balas.splice(indiceBala, 1);
                        }
                    })
                }
            })
    
            // Borrar las balas que salen del canvas
            if( bala.x - bala.r < 0 || bala.x + bala.r > canvas.width || bala.y - bala.r < 0 || bala.y + bala.r > canvas.height){
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