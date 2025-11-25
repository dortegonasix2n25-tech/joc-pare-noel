const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Configuración básica del juego
let santa = {
    x: 200,
    y: 110,
    w: 60,
    h: 32,
    speed: 5
};

// Función para dibujar el juego
function draw() {
    // Dibujar fondo azul
    ctx.fillStyle = "#000814";  // Color de fondo
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar a Santa (representado por un rectángulo rojo)
    ctx.fillStyle = "red";
    ctx.fillRect(santa.x, santa.y, santa.w, santa.h);
}

// Actualizar el juego
function update() {
    draw();  // Llamar a la función de dibujo
    requestAnimationFrame(update);  // Llamar a la función de actualización
}

// Llamar a la función para comenzar el juego
update();
