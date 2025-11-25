const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Variables de control
let santa = {
    x: 200,
    y: 110,
    w: 60,
    h: 32,
    speed: 5
};

let keys = {};

// Funciones de control
function moveSanta() {
    // Teclado para mover (para desktop)
    if (keys["ArrowUp"] || keys["KeyW"]) santa.y -= santa.speed;
    if (keys["ArrowDown"] || keys["KeyS"]) santa.y += santa.speed;
    if (keys["ArrowLeft"] || keys["KeyA"]) santa.x -= santa.speed;
    if (keys["ArrowRight"] || keys["KeyD"]) santa.x += santa.speed;

    // Limitar el movimiento a los bordes del canvas
    santa.x = Math.max(0, Math.min(canvas.width - santa.w, santa.x));
    santa.y = Math.max(0, Math.min(canvas.height - santa.h, santa.y));
}

// Función para dibujar el fondo y a Santa
function draw() {
    ctx.fillStyle = "#000814"; // Fondo oscuro
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red"; // Santa es un rectángulo rojo
    ctx.fillRect(santa.x, santa.y, santa.w, santa.h);

    requestAnimationFrame(draw);
}

// Actualizar juego
function update() {
    moveSanta(); // Mover a Santa
}

// Eventos de teclado (para escritorio)
document.addEventListener("keydown", (e) => {
    keys[e.code] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.code] = false;
});

// Eventos de los botones para móviles
document.getElementById("up").addEventListener("click", () => { santa.y -= santa.speed; });
document.getElementById("down").addEventListener("click", () => { santa.y += santa.speed; });
document.getElementById("left").addEventListener("click", () => { santa.x -= santa.speed; });
document.getElementById("right").addEventListener("click", () => { santa.x += santa.speed; });

// Lanzar regalo (falta lógica de los regalos, solo se mueve la "lógica")
document.getElementById("launchGift").addEventListener("click", () => {
    console.log("Regalo lanzado");
    // Aquí iría la lógica de lanzar el regalo
});

// 🎁 INICIO: LÓGICA DE PANTALLA COMPLETA 🎁

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        // Solicita pantalla completa para todo el documento
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error al intentar habilitar pantalla completa: ${err.message} (${err.name})`);
        });
    } else {
        // Sale de pantalla completa
        document.exitFullscreen();
    }
}

// Asegúrate de tener un botón con id="fullscreenButton" en tu HTML
document.getElementById("fullscreenButton").addEventListener("click", toggleFullScreen);

// 🎁 FIN: LÓGICA DE PANTALLA COMPLETA 🎁

// Iniciar los bucles del juego
setInterval(update, 1000 / 60); // 60 FPS para la lógica de actualización
requestAnimationFrame(draw); // Lanza el bucle de dibujo
