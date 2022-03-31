const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const fondo = new Image();
fondo.src = "../img/fondo.png";

let torresDisponibles = [
    {
        // Normal (azul)
        clase: "torre",
        src: "../img/tanque_azul.png",
        alcance: 150,
        velBala: 10,
        dano: 5,
        tiempoAtaque: 60 / 1.5,
        precio: 100
    },
    {
        // Metralleta (rojo)
        clase: "torre",
        src: "../img/tanque_rojo.png",
        alcance: 225,
        velBala: 20,
        dano: 1,
        tiempoAtaque: 60 / 10,
        precio: 1500
    },
    {
        // Francotirador (verde)
        clase: "torre",
        src: "../img/tanque_verde.png",
        alcance: 1000,
        velBala: 30,
        dano: 30,
        tiempoAtaque: 60 * 2,
        precio: 1000
    },
    {
        // Hielo
        clase: "hielo",
        src: "../img/hielo.png",
        alcance: 150,
        velBala: 10,
        tiempoAtaque: 60,
        factorDisminucion: 0.7,
        tiempoCongelado: 60,
        radioEfecto: 50,
        precio: 200
    },
    {
        // Canon
        clase: "canon",
        src: "../img/canon.png",
        alcance: 80,
        velBala: 10,
        dano: 1,
        tiempoAtaque: 60 * 3,
        radioEfecto: 15,
        precio: 5000
    }
];
let torreSeleccionada = 0;

let juegoTerminado = false;
let dinero = 100;

// Config particulas
const limiteParticulas = 250;
const cantParticulas = 3;

// Config creacion enemigos
let tiempoAumentarDificultad = 60 * 10; // 10 segundos
let i = 0;
let limiteTiempoEnemigos = 1; // Tiene que ser minimo 1 o no funciona el modulo
let tiempoEnemigos = 60;

let nivelMinimo = 1;
let nivelMaximo = 5;
const limiteNivel = 200;

// Arreglos de objetos
let torres = [];
let enemigos = [];
let particulas = [];
let mensajes = [];

function crearBotones(){
    let html = "";
    torresDisponibles.forEach((torre, indice) => {
        html += `
            <div class="controles__boton ${indice == 0 && "activo"}" data-torre="${indice}">
                <p>$${torre.precio}</p>
                <img src="${torre.src.slice(1)}" draggable="false">
            </div>
        `;
    })
    document.querySelector('.controles').innerHTML = html;
    
    // Evento click para seleccionar ua torre
    let botones = document.querySelectorAll('.controles__boton');
    botones.forEach((boton) => {
        boton.addEventListener('click', e => {
            botones.forEach(btn => {
                btn.classList.remove("activo");
                boton.classList.add("activo");
    
                torreSeleccionada = boton.dataset.torre;
            })
        })
    })
}

function crearEnemigos(){
    i++;
    // Crea un enemigo
    if(i % tiempoEnemigos == 0){
        let nivel = nivelMinimo + Math.floor(Math.random() * (nivelMaximo - nivelMinimo + 1));

        enemigos.push(new Enemigo({ nivel }));
    }

    // Los enemigos salen más rapido y el nivel máximo aumenta
    if(i % tiempoAumentarDificultad == 0){
        if(nivelMaximo < limiteNivel) nivelMaximo++;
        if(tiempoEnemigos > limiteTiempoEnemigos) tiempoEnemigos--;
    }
}

function comprobarEstadoJuego(){
    // Si ya se terminó el juego, muestra un mensaje
    if(!juegoTerminado) return;

    ctx.save();
    ctx.fillStyle = "#000";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Juego terminado", canvas.width/2, canvas.height/2);
    ctx.restore();
}

let timeout;
function ponerTorre(x, y){
    // Si no se tiene dinero, sale de la funcion
    if(dinero < torresDisponibles[torreSeleccionada].precio){
        mensajes.push(new Mensaje({x, y, msg: `No tienes suficiente dinero ($${torresDisponibles[torreSeleccionada].precio})`}));
        return;
    }

    // Si la posicion es valida, pone la torre redondeando para que no se encimen
    if(y < 10 * 20 || y > 14 * 20){
        x = Math.floor(x / 40) * 40 + 20;
        y = Math.floor(y / 40) * 40 + 20;

        let lugarDisponible = true;

        // Se verifica si está disponible el espacio para poner la torre
        torres.forEach(torre => {
            if(torre.x == x && torre.y == y){
                lugarDisponible = false;
            }
        })

        // Si el lugar esta disponible, se crea la torre y se descuenta el dinero
        if(lugarDisponible){
            let config = {
                x,
                y,
                r: 20,
                ...torresDisponibles[torreSeleccionada]
            };
            dinero -= config.precio;

            // Crear torre
            switch(config.clase){
                case "torre":
                    torres.push(new Torre(config));
                    break;
                case "hielo":
                    torres.push(new Hielo(config));
                    break;
                case "canon":
                    torres.push(new Canon(config));
                    break;
            }
        } else mensajes.push(new Mensaje({x, y, msg: `Lugar no disponible`}));
    }
}

function loop(){
    if(juegoTerminado) return;

    // Dibujar fondo
    ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);

    // Particulas
    // Optimizacion, no permite que haya más de 500 particulas
    if(particulas.length > limiteParticulas) particulas.splice(0, particulas.length - 1000);
    particulas.forEach((particula, indiceParticula) => {
        particula.mover();

        if(particula.r <= 0) particulas.splice(indiceParticula, 1);
    })
    
    // Torres
    torres.forEach(torre => torre.mover())

    // Enemigos
    crearEnemigos();
    enemigos.forEach(enemigo => {
        enemigo.mover();

        if(enemigo.x - enemigo.r >= canvas.width) juegoTerminado = true;
    })

    // Estado de juego
    comprobarEstadoJuego();

    // Informacion
    ctx.save();
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText("Dinero: " + dinero, 10, 30);
    ctx.restore();

    // Mensajes
    mensajes.forEach(mensaje => {
        mensaje.mover();

        mensajes = mensajes.filter(mensaje => mensaje.estado);
    })

    requestAnimationFrame(loop);
}

window.addEventListener('load', () => {
    crearBotones();

    loop();
})

// Crear torres
canvas.addEventListener('click', e => {
    let x = e.clientX - canvas.getBoundingClientRect().left;
    let y = e.clientY - canvas.getBoundingClientRect().top;

    ponerTorre(x, y);
})

canvas.addEventListener('mousemove', e => {
    let x = e.clientX - canvas.getBoundingClientRect().left;
    let y = e.clientY - canvas.getBoundingClientRect().top;

    x = Math.floor(x / 40) * 40 + 20;
    y = Math.floor(y / 40) * 40 + 20;

    let torre = torres.find(torre => torre.x == x && torre.y == y);

    torres.forEach(torre => torre.alcanceVisible = false);
    if(torre) torre.alcanceVisible = true;
})