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

        this.wBala = 20;
        this.hBala = 20;
        this.srcBala = "../../img/bala_canon.png";
    }
    mover(){
        // Funcionamiento de las balas
        this.balas.forEach(bala => {
            bala.mover();
    
            // Choque de bala con enemigo
            for(let i = 0; i < enemigos.length; i++){
                let enemigo = enemigos[i];

                // Si choca con cualquiera, hace el daño y sale del for
                // para evitar daño extra
                if(bala.colision(enemigo)){
                    bala.velX = bala.velY = 0;
                    // El ancho debe ser menor o igual que el alto
                    bala.w = this.radioEfecto * (bala.w/bala.h);
                    bala.h = this.radioEfecto;
                    
                    enemigos.forEach(e => {
                        // Ahora compara con el nuevo tamaño
                        if(bala.colision(e)){
                            // Sumar el dinero de acuerdo al daño de la bala y de la vida restante
                            if(e.nivel >= bala.dano) dinero += bala.dano;
                            else dinero += e.nivel;

                            e.nivel -= bala.dano;

                            // Se crean las particulas
                            for(let i = 0; i < cantParticulas; i++){
                                particulas.push(new Particula({x: e.x, y: e.y, color: e.color}));
                            }
        
                            // Se borra la bala
                            bala.estado = 0;
                        }
                    })
                    break;
                }
            }
    
            // Borrar las balas que salen del canvas
            if(bala.x < 0 || bala.x + bala.w > canvas.width || bala.y < 0 || bala.y + bala.h > canvas.height){
                bala.estado = 0;
            }
        })

        // Se borran todos los enemigos y balas necesarios
        this.balas = this.balas.filter(b => b.estado);

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