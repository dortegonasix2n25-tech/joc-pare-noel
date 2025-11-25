/* ============================================================================================
   CONFIGURACIÓ GENERAL DEL JOC
   ============================================================================================ */

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const pauseBtn = document.getElementById("pauseBtn");

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
   ============================================================================================ */

let teclas = {};

/* Pausa */
function togglePause() {
    if (estat === "playing") estat = "paused";
    else if (estat === "paused") estat = "playing";
    actualitzaTextBoto();
}

/* Tecles pressionades */
document.addEventListener("keydown", e => {

    /* ENTER: iniciar o reiniciar */
    if (e.code === "Enter") {
        if (estat === "start" || estat === "gameover") {
            resetGame();
            estat = "playing";
            actualitzaTextBoto();
        }
        return;
    }

    /* P o ESC: pausa */
    if (e.code === "KeyP" || e.code === "Escape") {
        if (estat === "playing" || estat === "paused") togglePause();
        return;
    }

    teclas[e.code] = true;

    /* Espai: llençar regal 1 vegada per polsada (sense auto-repeat) */
    if (e.code === "Space" && !e.repeat && estat === "playing") {
        regals.push({
            x: santa.x + santa.w / 2 - 5,
            y: santa.y + santa.h,
            w: 10,
            h: 10
        });
    }
});

/* Alliberament de tecla */
document.addEventListener("keyup", e => {
    teclas[e.code] = false;
});

/* Pausa pel botó */
pauseBtn.addEventListener("click", () => {
    if (estat === "playing" || estat === "paused") togglePause();
});

/* ============================================================================================
   VIDA I COL·LISIONS
   ============================================================================================ */

/* Redueix vida i reinicia combo */
function perdVida(amount = 1) {
    vides -= amount;
    combo = 0;  // Perds racha
    if (vides <= 0) {
        vides = 0;
        estat = "gameover";
        actualitzaTextBoto();
    }
}

/* Detecció bàsica de col·lisió de rectangles */
function intersectaRect(r, x, y, w, h) {
    return (
        r.x < x + w &&
        r.x + r.w > x &&
        r.y < y + h &&
        r.y + r.h > y
    );
}

/* ============================================================================================
   UPDATE DEL JOC (moviment, col·lisions, punts...)
   ============================================================================================ */

function update() {
    if (estat !== "playing") return;

    /* Actualitzar moviment de neu */
    updateNeu();

    /* Moviment del Pare Noel: WASD + Fletxes */
    if (teclas["KeyA"] || teclas["ArrowLeft"])  santa.x -= santa.speed;
    if (teclas["KeyD"] || teclas["ArrowRight"]) santa.x += santa.speed;
    if (teclas["KeyW"] || teclas["ArrowUp"])    santa.y -= santa.speed;
    if (teclas["KeyS"] || teclas["ArrowDown"])  santa.y += santa.speed;

    /* Límits de moviment */
    santa.x = Math.max(0, Math.min(canvas.width - santa.w, santa.x));
    santa.y = Math.max(10, Math.min(canvas.height - santa.h - 10, santa.y));

    /* Petita animació vertical (bobbing) */
    santa.angle += 0.03;
    santa.y += Math.sin(santa.angle) * 0.3;

    /* Moviment dels regals */
    for (let r of regals) r.y += 5;

    /* Moviment de cases */
    for (let c of cases) {
        c.x -= velocitatCases;
        c.chimX -= velocitatCases;
        for (let f of c.finestres) f.x -= velocitatCases;
    }

    /* Eliminar cases que surten i generar-ne de noves */
    cases = cases.filter(c => c.x + c.w > -50);
    let visible = cases.length;
    let maxX = visible ? Math.max(...cases.map(c => c.x + c.w)) : 50;
    while (visible < numCases) {
        maxX += 170 + Math.random() * 80;
        cases.push(creaCasa(maxX));
        visible++;
    }

    /* Col·lisió santa-cases (si toca casa → game over) */
    for (let c of cases) {
        const casaRect = { x: c.x, y: c.y, w: c.w, h: c.h };
        const teuladaRect = { x: c.x, y: c.y - 20, w: c.w, h: 20 };
        const santaRect = { x: santa.x, y: santa.y, w: santa.w, h: santa.h };

        if (intersectaRect(santaRect, casaRect.x, casaRect.y, casaRect.w, casaRect.h) ||
            intersectaRect(santaRect, teuladaRect.x, teuladaRect.y, teuladaRect.w, teuladaRect.h)) {
            perdVida(vides);
            break;
        }
    }

    /* PROCESSAR REGALS */
    regals = regals.filter(r => {
        let encert = false;
        let puntsGuanyats = 0;

        for (let c of cases) {
            if (c.completada) continue;

            /* XEMENEIA → 2 punts */
            if (intersectaRect(r, c.chimX, c.chimY, c.chimW, c.chimH)) {
                encert = true;
                puntsGuanyats = 2;
                c.completada = true;
                efectes.push({ x: r.x + r.w / 2, y: r.y + r.h / 2, life: 20 });
                break;
            }

            /* TEULADA → 1 punt (ha d’estar per sobre del mur) */
            const roofX = c.x;
            const roofY = c.y - 20;
            const roofW = c.w;
            const roofH = 20;

            if (
                intersectaRect(r, roofX, roofY, roofW, roofH) &&
                r.y + r.h <= c.y
            ) {
                encert = true;
                puntsGuanyats = 1;
                c.completada = true;
                efectes.push({ x: r.x + r.w / 2, y: r.y + r.h / 2, life: 20 });
                break;
            }
        }

        if (encert) {
            punts += puntsGuanyats;
            encerts++;
            combo++;
            if (combo > millorCombo) millorCombo = combo;
            document.getElementById("score").innerText = "Punts: " + punts;

            /* Augmenta velocitat cada 5 encerts */
            if (encerts % 5 === 0) velocitatCases += 0.5;

            return false;
        }

        /* Regal cau → mig cor i combo 0 */
        if (r.y >= canvas.height) {
            perdVida(0.5);
            return false;
        }

        return true;
    });

    /* GENERAR OCELLS (enemics) */
    if (Math.random() < 0.01 && ocells.length < 4) {
        ocells.push({
            x: canvas.width + 40,
            y: 40 + Math.random() * 250,
            w: 40,
            h: 22
        });
    }

    /* Moviment d’ocells i col·lisió */
    ocells = ocells.filter(o => {
        o.x -= velocitatCases;
        const santaRect = { x: santa.x, y: santa.y, w: santa.w, h: santa.h };
        if (intersectaRect(santaRect, o.x, o.y, o.w, o.h)) {
            perdVida(1);
            return false;
        }
        return o.x + o.w > -50;
    });

    /* Actualitzar efectes visuals */
    efectes.forEach(e => e.life--);
    efectes = efectes.filter(e => e.life > 0);
}

/* ============================================================================================
   DIBUIX DE HUD I ELEMENTS DEL JOC
   ============================================================================================ */

function dibuixaVides() {
    ctx.font = "24px Arial";
    for (let i = 0; i < 5; i++) {
        const posX = canvas.width - 30 - i * 30;
        const posY = 35;

        if (vides >= i + 1) {
            ctx.fillStyle = "red";       // Cor ple
            ctx.fillText("❤", posX, posY);
        } else if (vides >= i + 0.5) {
            ctx.fillStyle = "pink";      // Mig cor
            ctx.fillText("♡", posX, posY);
        } else {
            ctx.fillStyle = "rgba(255,255,255,0.2)";
            ctx.fillText("♡", posX, posY); // Buit
        }
    }

    /* Racha al centre superior */
    ctx.font = "18px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = combo >= 3 ? "#ffeb3b" : "white";
    ctx.fillText("Racha: " + combo, canvas.width / 2, 28);
    ctx.textAlign = "left";
}

/* ============================================================================================
   DIBUIX DE CASES
   ============================================================================================ */

function dibuixaCases() {
    for (let c of cases) {

        /* Cos de la casa */
        ctx.fillStyle = c.color;
        ctx.fillRect(c.x, c.y, c.w, c.h);

        /* Teulada triangular */
        ctx.fillStyle = "#4a2f19";
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(c.x + c.w / 2, c.y - 20);
        ctx.lineTo(c.x + c.w, c.y);
        ctx.closePath();
        ctx.fill();

        /* Xemeneia */
        ctx.fillStyle = "#333";
        ctx.fillRect(c.chimX, c.chimY, c.chimW, c.chimH);

        /* Porta */
        ctx.fillStyle = "#5c3a21";
        const pw = 24, ph = 36;
        ctx.fillRect(c.x + c.w / 2 - pw / 2, c.y + c.h - ph, pw, ph);

        /* Finestres */
        for (let f of c.finestres) {
            ctx.fillStyle = f.lit ? "#ffd966" : "#1f2933";
            ctx.fillRect(f.x, f.y, f.w, f.h);
            ctx.strokeStyle = "#000";
            ctx.strokeRect(f.x, f.y, f.w, f.h);

            /* Creu de la finestra */
            ctx.beginPath();
            ctx.moveTo(f.x + f.w/2, f.y);
            ctx.lineTo(f.x + f.w/2, f.y + f.h);
            ctx.moveTo(f.x, f.y + f.h/2);
            ctx.lineTo(f.x + f.w, f.y + f.h/2);
            ctx.stroke();
        }

        /* Garlanda de llums */
        const cols = ["#ff4d4d", "#4dff4d", "#4dc3ff", "#ffff4d"];
        for (let x = c.x + 5; x < c.x + c.w - 5; x += 10) {
            ctx.fillStyle = cols[Math.floor(Math.random() * cols.length)];
            ctx.beginPath();
            ctx.arc(x, c.y - 5, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

/* ============================================================================================
   DIBUIX D’OCELLS
   ============================================================================================ */
function dibuixaOcells() {
    for (let o of ocells) {

        /* Cos */
        ctx.fillStyle = "#c0c0c0";
        ctx.fillRect(o.x, o.y + 6, 28, 10);

        /* Cap */
        ctx.fillStyle = "#e0e0e0";
        ctx.fillRect(o.x + 25, o.y + 4, 10, 10);

        /* Bec */
        ctx.fillStyle = "#ffcc33";
        ctx.fillRect(o.x + 35, o.y + 7, 6, 4);

        /* Ala */
        ctx.fillStyle = "#a0a0a0";
        ctx.beginPath();
        ctx.moveTo(o.x + 10, o.y + 6);
        ctx.lineTo(o.x, o.y);
        ctx.lineTo(o.x + 18, o.y + 6);
        ctx.closePath();
        ctx.fill();
    }
}

/* ============================================================================================
   DIBUIX DEL PARE NOEL I EL REN
   ============================================================================================ */

function dibuixaSantaIRen() {

    /* TRINEU */
    ctx.fillStyle = "#b30000";
    ctx.fillRect(santa.x - 8, santa.y + 10, 48, 22);

    ctx.fillStyle = "#ffcc00";
    ctx.beginPath();
    ctx.moveTo(santa.x - 10, santa.y + 32);
    ctx.lineTo(santa.x + 44, santa.y + 32);
    ctx.lineTo(santa.x + 40, santa.y + 36);
    ctx.lineTo(santa.x - 14, santa.y + 36);
    ctx.closePath();
    ctx.fill();

    /* PARE NOEL */
    ctx.fillStyle = "red";
    ctx.fillRect(santa.x + 10, santa.y - 5, 18, 26);

    /* Cap */
    ctx.fillStyle = "#ffe0bd";
    ctx.fillRect(santa.x + 12, santa.y - 17, 14, 14);

    /* Barba */
    ctx.fillStyle = "white";
    ctx.fillRect(santa.x + 10, santa.y - 5, 18, 8);

    /* Barret */
    ctx.fillStyle = "red";
    ctx.fillRect(santa.x + 12, santa.y - 23, 16, 8);

    /* Franja del barret */
    ctx.fillStyle = "white";
    ctx.fillRect(santa.x + 12, santa.y - 25, 16, 3);

    /* Borla del barret */
    ctx.beginPath();
    ctx.arc(santa.x + 28, santa.y - 24, 3, 0, Math.PI * 2);
    ctx.fill();

    /* Sac de regals */
    ctx.fillStyle = "#3b2a1a";
    ctx.fillRect(santa.x + 28, santa.y, 12, 18);

    /* REN */
    const renX = santa.x + santa.w + 30;
    const renY = santa.y + 4;

    ctx.fillStyle = "#c87f4f";
    ctx.fillRect(renX, renY + 6, 40, 14);  // cos
    ctx.fillRect(renX + 30, renY - 2, 12, 12); // cap

    /* Potes */
    ctx.fillRect(renX + 6, renY + 20, 4, 10);
    ctx.fillRect(renX + 24, renY + 20, 4, 10);

    /* Nas */
    ctx.fillStyle = "#ff6666";
    ctx.fillRect(renX + 40, renY + 4, 4, 4);

    /* Banyes */
    ctx.fillStyle = "#e0c9a6";
    ctx.fillRect(renX + 34, renY - 12, 3, 10);
    ctx.fillRect(renX + 30, renY - 12, 3, 8);

    /* Corretja */
    ctx.strokeStyle = "#cc3300";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(santa.x + santa.w + 5, santa.y + 18);
    ctx.lineTo(renX, renY + 12);
    ctx.stroke();
}

/* ============================================================================================
   REGALS I EFECTES
   ============================================================================================ */

function dibuixaRegals() {
    ctx.fillStyle = "#ffd54f";
    for (let r of regals) {
        ctx.fillRect(r.x, r.y, r.w, r.h);

        ctx.strokeStyle = "#d50000";
        ctx.strokeRect(r.x, r.y, r.w, r.h);

        ctx.beginPath();
        ctx.moveTo(r.x + r.w/2, r.y);
        ctx.lineTo(r.x + r.w/2, r.y + r.h);
        ctx.moveTo(r.x, r.y + r.h/2);
        ctx.lineTo(r.x + r.w, r.y + r.h/2);
        ctx.stroke();
    }
}

function dibuixaEfectes() {
    for (let e of efectes) {
        const alpha = e.life / 20;
        const radius = 8 + (20 - e.life);

        ctx.fillStyle = `rgba(255, 255, 0, ${alpha})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

/* ============================================================================================
   MENÚS (INICI, PAUSA, GAME OVER)
   ============================================================================================ */

function dibuixaPanell(textLines, subTextLines = []) {
    /* Pantalla fosca */
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    /* Panell central */
    const panelW = 520;
    const panelH = 260;
    const x = (canvas.width - panelW) / 2;
    const y = (canvas.height - panelH) / 2;

    ctx.fillStyle = "rgba(10,20,40,0.95)";
    ctx.strokeStyle = "#ffcc00";
    ctx.lineWidth = 3;

    if (ctx.roundRect) ctx.roundRect(x, y, panelW, panelH, 18);
    else ctx.rect(x, y, panelW, panelH);

    ctx.fill();
    ctx.stroke();

    /* Text principal */
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffdd55";
    ctx.font = "36px Arial";
    ctx.fillText(textLines[0], canvas.width / 2, y + 55);

    /* Text addicional */
    ctx.fillStyle = "white";
    ctx.font = "18px Arial";
    let offset = 95;
    for (let t of textLines.slice(1)) {
        ctx.fillText(t, canvas.width / 2, y + offset);
        offset += 24;
    }

    /* Subtext */
    ctx.fillStyle = "#a8e6ff";
    for (let t of sub

