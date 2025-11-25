/* ============================================================================================
   CONFIGURACIÓ GENERAL DEL JOC
   ============================================================================================ */

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

/* Possibles estats del joc */
let estat = "start"; // "start", "playing", "paused", "gameover"

/* Variables principals del joc */
let punts, vides, santa, regals, cases, ocells, efectes;

/* Constants per a xemeneies */
const xemeneiaWBase = 25;
const xemeneiaHBase = 25;

/* Número de cases simultànies */
const numCases = 5;

/* Velocitat del mapa */
let velocitatCasesBase = 3;
let velocitatCases;

/* Comptadors */
let encerts;
let combo = 0;
let millorCombo = 0;

/* Elements de decoració */
let estrelles = [];
let flocsNeu = [];
let skyline = [];

/* ============================================================================================
   FUNCIÓ PER REINICIAR TOT EL JOC
   ============================================================================================ */
function resetGame() {
    punts = 0;
    vides = 5;                 // Vides del jugador
    santa = {                 // Posició i mida del Pare Noel
        x: 200,
        y: 110,
        w: 60,
        h: 32,
        speed: 5,
        angle: 0
    };
    regals = [];              // Llista de regals
    cases = [];               // Llista de cases
    ocells = [];              // Llista d'ocells enemics
    efectes = [];             // Efectes visuals d'encerts
    velocitatCases = velocitatCasesBase;
    encerts = 0;
    combo = 0;
    millorCombo = 0;

    generaCasesInicials();    // Genera les primeres cases
    generaEstrelles();        // Genera el cel
    generaNeu();              // Genera els flocs de neu
    generaSkyline();          // Genera els edificis del fons

    document.getElementById("score").innerText = "Punts: " + punts;
}
resetGame();

/* Actualitza el text del botó de pausa segons l’estat del joc */
function actualitzaTextBoto() {
    if (estat === "playing") pauseBtn.textContent = "Pausa";
    else if (estat === "paused") pauseBtn.textContent = "Reprendre";
    else pauseBtn.textContent = "Pausa";
}

/* ============================================================================================
   GENERACIÓ DE DECORACIÓ: ESTRELLES, NEU I SKYLINE
   ============================================================================================ */

function generaEstrelles() {
    estrelles = [];
    for (let i = 0; i < 120; i++) {
        estrelles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.5 + 0.5
        });
    }
}

/* Crear flocs de neu en posicions aleatòries */
function generaNeu() {
    flocsNeu = [];
    for (let i = 0; i < 150; i++) {
        flocsNeu.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 1,
            speed: 0.5 + Math.random() * 1.5
        });
    }
}

/* Crea edificis per al fons ("skyline") */
function generaSkyline() {
    skyline = [];
    let x = 0;
    while (x < canvas.width + 60) {
        const w = 40 + Math.random() * 40;
        const h = 40 + Math.random() * 80;
        skyline.push({ x, w, h });
        x += w + 10;
    }
}

/* ============================================================================================
   FUNCIÓ PER DIBUIXAR EL CEL, ESTRELLES, LLUNA I EDIFICIS DE FONS
   ============================================================================================ */

function dibuixaNit() {
    /* Gradient del cel */
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, "#000814");
    grad.addColorStop(1, "#001d3d");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    /* Estrelles */
    ctx.fillStyle = "white";
    for (let s of estrelles) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
    }

    /* LLUNA PLENA */
    ctx.beginPath();
    ctx.arc(canvas.width - 120, 100, 40, 0, Math.PI * 2);
    ctx.fillStyle = "#f5f3c1";
    ctx.fill();
}

/* Edificis del fons */
function dibuixaSkyline() {
    ctx.fillStyle = "#000918";
    for (let b of skyline) {
        ctx.fillRect(b.x, canvas.height - b.h, b.w, b.h);
    }
}

/* Actualitzar moviment de neu */
function updateNeu() {
    for (let f of flocsNeu) {
        f.y += f.speed;
        if (f.y > canvas.height) {
            f.y = -f.r;
            f.x = Math.random() * canvas.width;
        }
    }
}

/* Dibuxiar neu */
function dibuixaNeu() {
    ctx.fillStyle = "#ffffff";
    for (let f of flocsNeu) {
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
    }
}

/* ============================================================================================
   GENERACIÓ DE CASES I ELEMENTS DE JOC
   ============================================================================================ */

function creaCasa(posX) {
    /* Amplada i alçada aleatòries */
    const w = 80 + Math.random() * 60;
    const h = 60 + Math.random() * 60;

    /* Posició vertical */
    const baseY = canvas.height - h;

    /* Colors de paret */
    const colorsCasa = ["#8b4513", "#a0522d", "#6b3e26", "#9c6644"];
    const color = colorsCasa[Math.floor(Math.random() * colorsCasa.length)];

    /* Dimensions de xemeneia */
    const chimW = xemeneiaWBase + Math.random() * 10;
    const chimH = xemeneiaHBase + Math.random() * 10;
    const chimX = posX + 20 + Math.random() * (w - 40 - chimW);
    const chimY = baseY - chimH;

    /* Finestres aleatòries */
    let finestres = [];
    for (let f = 0; f < 2; f++) {
        const numW = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < numW; i++) {
            const fw = 20;
            const fh = 22;
            const marginX = 10;
            const marginY = 15;
            const espai = (w - marginX * 2 - fw) / Math.max(1, numW - 1);
            const fx = posX + marginX + i * espai;
            const fy = baseY + marginY + f * (fh + 10);
            const lit = Math.random() < 0.7;
            finestres.push({ x: fx, y: fy, w: fw, h: fh, lit });
        }
    }

    /* Retorna un objecte casa */
    return {
        x: posX,
        y: baseY,
        w,
        h,
        chimX,
        chimY,
        chimW,
        chimH,
        color,
        finestres,
        completada: false   // Per marcar si ja ha donat punts
    };
}

/* Generar les primeres cases */
function generaCasesInicials() {
    cases = [];
    let posX = 50;
    for (let i = 0; i < numCases; i++) {
        cases.push(creaCasa(posX));
        posX += 170 + Math.random() * 80;
    }
}

/* ============================================================================================
   CONTROLS DEL JUGADOR
   ====================
