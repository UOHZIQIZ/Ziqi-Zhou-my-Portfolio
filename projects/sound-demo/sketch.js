let on = false;
let startButton;
let mic, fft, amp, barFFT;

let particles = [];
let flowers = [];
let sakura = [];
let convergeParticles = [];
let petals = [];

let posX, posY;
let moveSpeed = 7;
let radius, number, baseAngle;

const macaronColors = [
  { h: 340, s: 30, b: 100 },
  { h: 160, s: 35, b: 95 },
  { h: 270, s: 30, b: 95 },
  { h: 50,  s: 40, b: 100 }
];

function setup() {
    let canvas;
    if (windowWidth > 1200) {
        canvas = createCanvas(1920, 630);
    } else if (windowWidth > 900) {
        canvas = createCanvas(1200, 394);
    } else {
        canvas = createCanvas(700, 230);
    }

    canvas.parent('header');

    colorMode(HSB, 360, 100, 100, 100);
    noFill();
    strokeCap(ROUND);

    posX = width / 2;
    posY = height / 2;

    radius = height * 0.35;
    number = 100;
    baseAngle = 0;

     startButton = createButton('Click to allow microphone access and start the sound visualization')
	
        .size(400, 60)
        .style('font-size', '20px')
        .style('color', '#988a6b')
        .style('background', "linear-gradient(135deg, #FFC1CC, #B5EAD7)")
        .style('border-radius', '30px')
        .style('border', 'none')
        .style('cursor', 'pointer')
        .position((windowWidth / 2) - 200, windowHeight / 3)
        .mousePressed(turnOn);
}

function turnOn() {
    userStartAudio().then(() => {
        on = true;

        mic = new p5.AudioIn();
        mic.start();

        fft = new p5.FFT(0.5, 1024);
        fft.setInput(mic);

        barFFT = new p5.FFT(0.8, 128);
        barFFT.setInput(mic);

        amp = new p5.Amplitude();
        amp.setInput(mic);

        startButton.hide();

        for (let i = 0; i < 200; i++) {
            particles.push(new RingParticle(i / 200));
        }

        for (let i = 0; i < 60; i++) {
            flowers.push(new RingFlower(i / 60));
        }
    });
}

function draw() {
    background(340, 10, 100, 15);

    if (!on) return;

    let spectrum = fft.analyze();
    let level = amp.getLevel();
    let energy = fft.getEnergy(20, 15000);
    let active = energy > 40 ? 1 : 0;

    handleInput();

    if (frameCount % 2 === 0) spawnConvergeParticles();
    updateConvergeParticles();

    if (level > 0.15 && frameCount % 5 === 0) explodePetals();
    updatePetals();

    push();
    translate(posX, posY);
    rotate(frameCount * 0.02);
    drawCoreFlower(60 + level * 100);
    pop();

    push();
    translate(width / 2, height / 2);

    drawCircularSpectrum(spectrum, level);

    let baseR = min(width, height) * 0.35;
    let waveAmp = map(energy, 40, 255, 10, 150, true) * active;

    for (let p of particles) {
        let idx = floor(map(particles.indexOf(p), 0, particles.length, 0, spectrum.length/4));
        p.update(spectrum[idx], baseR, waveAmp, active);
        p.display();
    }

    for (let f of flowers) {
        f.update(baseR, waveAmp, active);
        f.display();
    }

    pop();

    updateSakura(active);
    drawBottomBars();
}

function drawCoreFlower(size) {
    let col = macaronColors[0];
    noStroke();

    for (let i = 0; i < 5; i++) {
        push();
        rotate(TWO_PI * i / 5);
        fill(col.h, col.s, col.b, 80);
        ellipse(size * 0.3, 0, size * 0.7, size * 0.4);
        pop();
    }

    fill(50, 40, 100);
    ellipse(0, 0, size * 0.3);
}

function handleInput() {
    if (keyIsDown(87) || keyIsDown(UP_ARROW)) posY -= moveSpeed;
    if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) posY += moveSpeed;
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) posX -= moveSpeed;
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) posX += moveSpeed;

    posX = constrain(posX, 50, width - 50);
    posY = constrain(posY, 50, height - 50);
}

function spawnConvergeParticles() {
    let x = random(width);
    let y = random(height);
    let c = random(macaronColors);

    convergeParticles.push({
        x, y,
        h: c.h,
        s: c.s,
        b: c.b,
        size: random(4, 8),
        alpha: 100
    });
}

function updateConvergeParticles() {
    for (let i = convergeParticles.length - 1; i >= 0; i--) {
        let p = convergeParticles[i];

        p.x += (posX - p.x) * 0.03;
        p.y += (posY - p.y) * 0.03;

        fill(p.h, p.s, p.b, p.alpha);
        noStroke();
        ellipse(p.x, p.y, p.size);

        if (dist(p.x, p.y, posX, posY) < 30) p.alpha -= 5;
        if (p.alpha <= 0) convergeParticles.splice(i, 1);
    }
}

function explodePetals() {
    for (let i = 0; i < 5; i++) {
        let angle = TWO_PI * i / 5;

        petals.push({
            x: posX,
            y: posY,
            vx: cos(angle) * random(4, 8),
            vy: sin(angle) * random(4, 8),
            size: random(15, 30),
            life: 100,
            c: random(macaronColors)
        });
    }
}

function updatePetals() {
    for (let i = petals.length - 1; i >= 0; i--) {
        let p = petals[i];

        p.x += p.vx;
        p.y += p.vy;

        p.vx *= 0.96;
        p.vy *= 0.96;

        p.life -= 2;

        if (p.life < 40) {
            p.x += (posX - p.x) * 0.08;
            p.y += (posY - p.y) * 0.08;
        }

        fill(p.c.h, p.c.s, p.c.b, p.life);
        ellipse(p.x, p.y, p.size, p.size * 0.6);

        if (p.life <= 0) petals.splice(i, 1);
    }
}

function drawCircularSpectrum(spectrum, level) {
    let angle = baseAngle;

    for (let i = 0; i < number; i++) {
        let spec = spectrum[i * 2];
        let s = map(spec, 0, 255, 0, radius * 0.4);

        let x1 = sin(angle) * radius;
        let y1 = cos(angle) * radius;

        let x2 = sin(angle) * (radius + s * (1 + level));
        let y2 = cos(angle) * (radius + s * (1 + level));

        strokeWeight(2 + level * 10);
        stroke(i * (360 / number), 30, 100, 70);

        line(x1, y1, x2, y2);
        angle += TWO_PI / number;
    }
}

class RingParticle {
    constructor(t) {
        this.t = t;
        this.angle = t * TWO_PI;
        this.noiseSeed = random(1000);
        this.size = random(2, 5);
    }

    update(energy, baseR, waveAmp, active) {
        this.angle += active ? 0.01 : 0.002;

        let n = noise(this.noiseSeed, frameCount * 0.02);
        this.r = baseR + map(n, 0, 1, -20, 20) + (energy / 255 * waveAmp);

        this.noiseSeed += 0.01;
    }

    display() {
        fill(this.t * 360, 30, 100, 80);
        noStroke();
        ellipse(cos(this.angle) * this.r, sin(this.angle) * this.r, this.size);
    }
}

class RingFlower {
    constructor(t) {
        this.t = t;
        this.angle = t * TWO_PI;
        this.size = random(8, 15);
        this.open = 0;
    }

    update(baseR, waveAmp, active) {
        this.angle += active ? 0.005 : 0.001;
        this.r = baseR + 60 + waveAmp * 0.2;
        this.open = lerp(this.open, active ? 1 : 0, 0.1);
    }

    display() {
        push();
        translate(cos(this.angle) * this.r, sin(this.angle) * this.r);
        rotate(this.angle);

        fill(this.t * 360, 35, 100, 90);

        for (let i = 0; i < 5; i++) {
            rotate(TWO_PI / 5);
            ellipse(this.size * (0.3 + this.open), 0, this.size, this.size * 0.5);
        }

        pop();
    }
}

function updateSakura(active) {
    if (active && random() < 0.15) sakura.push(new SakuraLeaf());

    for (let i = sakura.length - 1; i >= 0; i--) {
        sakura[i].update();
        sakura[i].display();

        if (sakura[i].y > height) sakura.splice(i, 1);
    }
}

class SakuraLeaf {
    constructor() {
        this.x = random(width);
        this.y = -20;
        this.vy = random(1, 3);
        this.rot = random(TWO_PI);
    }

    update() {
        this.y += this.vy;
        this.rot += 0.02;
    }

    display() {
        push();
        translate(this.x, this.y);
        rotate(this.rot);

        fill(340, 30, 100, 80);
        noStroke();
        ellipse(0, 0, 10, 6);

        pop();
    }
}

function drawBottomBars() {
    let spec = barFFT.analyze();
    let w = width / spec.length;

    noStroke();

    for (let i = 0; i < spec.length; i++) {
        let h = map(spec[i], 0, 255, 0, height / 4);

        fill(i * (360 / spec.length), 30, 100, 60);
        rect(i * w, height - h, w - 1, h);
    }
}

// clicking the canvas creates a gesture for chrome
mouseClicked = () => {
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
        if (getAudioContext().state !== 'running') {
            getAudioContext().resume();
        }

    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}