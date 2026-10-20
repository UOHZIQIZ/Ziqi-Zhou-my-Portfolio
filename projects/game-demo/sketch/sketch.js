const GAME_STATE = { TITLE: 'TITLE', ANIMATING: 'ANIMATING', PLAYING: 'PLAYING', PAUSED: 'PAUSED' };
let currentState = GAME_STATE.TITLE;

let bgm, hitSfx;

let doorOffset = 0, doorSpeed = 12, gameGraphics; 
let ambientPetals = [], floatingTexts = []; 
let permanentGroundPetals = []; 
let decayingBurstPetals = [];    
let sparkles = [], ripples = []; 

let lanes = [], keys = [], notes = [], judgeY;
let noteSpeed = 5; 
let spawnRate = 50; 
let combo = 0;
let shakeAmount = 0; 
let globalHueShift = 330; 

const MACARON_PALETTE = [
  { h: 340, s: 45, b: 100 }, { h: 25, s: 60, b: 100 }, 
  { h: 160, s: 50, b: 90 }, { h: 270, s: 40, b: 95 }
];

function preload() {
  bgm = loadSound('music.mp3');
  hitSfx = loadSound('sound.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  
  if (hitSfx) hitSfx.playMode('restart');
  
  gameGraphics = createGraphics(windowWidth, windowHeight);
  gameGraphics.colorMode(HSB, 360, 100, 100, 100);
  initializeGameLogic();
}

function draw() {
  globalHueShift = (globalHueShift + 0.05) % 360;
  let tx = random(-shakeAmount, shakeAmount);
  let ty = random(-shakeAmount, shakeAmount);
  
  push();
  translate(tx, ty);
  background(globalHueShift, 10, 98); 

  updateAmbientPetals();
  updateSparkles(); 
  updateDecayingPetals(); 

  if (currentState === GAME_STATE.TITLE) {
    drawTitlePage();
  } else if (currentState === GAME_STATE.ANIMATING) {
    drawAnimatingTransition();
  } else if (currentState === GAME_STATE.PLAYING || currentState === GAME_STATE.PAUSED) {
    drawGamePlay();
    if (currentState === GAME_STATE.PAUSED) drawPauseOverlay();
  }
  
  pop();
  shakeAmount *= 0.7;
}

function handleStartAction() {
  if (currentState === GAME_STATE.TITLE) {
    if (bgm && !bgm.isPlaying()) bgm.loop();
    currentState = GAME_STATE.ANIMATING;
  }
}

function togglePause() {
  if (currentState === GAME_STATE.PLAYING) {
    currentState = GAME_STATE.PAUSED;
    if (bgm) bgm.pause();
  } else if (currentState === GAME_STATE.PAUSED) {
    currentState = GAME_STATE.PLAYING;
    if (bgm) bgm.play();
  }
}

function keyPressed() {
  if (currentState === GAME_STATE.TITLE) {
    handleStartAction();
    return;
  }

  if (keyCode === 32) {
    togglePause();
    return;
  }

  if (currentState === GAME_STATE.PLAYING) {
    let lane = getLaneFromKeyCode(keyCode);
    if (lane !== -1) {
      keys[lane].isPressed = true;
      keys[lane].highlightAlpha = 40;
      processJudgement(lane);
    }
  }
}

function processJudgement(lane) {
  let targetNote = null;
  let minDist = 100;

  for (let n of notes) {
    if (n.laneIndex === lane && !n.isHit) {
      let d = abs(n.y - judgeY);
      if (d < minDist) { minDist = d; targetNote = n; }
    }
  }

  if (targetNote) {
    if (hitSfx) hitSfx.play();
    if (targetNote.isLong) {
      targetNote.isHit = true; targetNote.isHolding = true; shakeAmount = 2;
    } else {
      let isPerfect = minDist < 25;
      floatingTexts.push(new JudgementText(isPerfect ? "Perfect!" : "Great", targetNote.x, judgeY - 40));
      targetNote.isHit = true; targetNote.isDead = true;
      ripples.push(new GrowthRipple(targetNote.x, judgeY));
      shakeAmount = isPerfect ? 4 : 2;
      keys[lane].burst(targetNote.col, 15);
      combo++;
    }
  }
}

function keyReleased() {
  let lane = getLaneFromKeyCode(keyCode);
  if (lane !== -1) {
    keys[lane].isPressed = false;
    for (let n of notes) if (n.laneIndex === lane && n.isLong) n.isHolding = false;
  }
}

function mousePressed() {
  if (currentState === GAME_STATE.TITLE) handleStartAction();
}

function drawGamePlay() {
  for (let p of permanentGroundPetals) p.display(this);
  drawAmbientPetals(this);
  for (let k of keys) k.drawHighlight(this);

  if (currentState === GAME_STATE.PLAYING) {
    if (frameCount % spawnRate === 0) {
      let l = floor(random(4));
      notes.push(new Note(lanes[l], l));
    }
    for (let k of keys) k.update();
  }

  for (let i = notes.length - 1; i >= 0; i--) {
    let n = notes[i];
    if (currentState === GAME_STATE.PLAYING) n.update();
    n.display(this);
    if (n.isLong && n.isHolding && currentState === GAME_STATE.PLAYING) {
      if (frameCount % 5 === 0) {
        keys[n.laneIndex].burst(n.col, 2);
        if (frameCount % 15 === 0) combo++;
      }
    }
    if (n.isDead) notes.splice(i, 1);
  }

  if (currentState === GAME_STATE.PLAYING) {
    for (let i = ripples.length - 1; i >= 0; i--) { ripples[i].update(); if (ripples[i].isDead) ripples.splice(i, 1); }
    for (let i = floatingTexts.length - 1; i >= 0; i--) { floatingTexts[i].update(); if (floatingTexts[i].isDead) floatingTexts.splice(i, 1); }
  }

  for (let k of keys) k.display(this);
  for (let r of ripples) r.display(this);
  for (let t of floatingTexts) t.display(this);
  if (combo >= 2) drawCombo();
  for (let p of decayingBurstPetals) p.display(this);
}

function drawPauseOverlay() {
  push();
  fill(0, 0, 0, 40); 
  rect(0, 0, width, height);
  textAlign(CENTER, CENTER);
  fill(globalHueShift, 20, 100);
  textSize(60); textStyle(BOLD); text("PAUSED", width / 2, height / 2);
  textSize(20); textStyle(NORMAL); fill(0, 0, 100, 80);
  text("Press SPACE to Resume", width / 2, height / 2 + 60);
  pop();
}

class GrowthRipple {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.r1 = 15; this.r2 = 5;       
    this.v1 = 4.2; this.v2 = 2.8;     
    this.alpha1 = 80; this.alpha2 = 60;  
    this.isDead = false;
    this.hue = 48; 
  }
  update() {
    this.v1 *= 0.95; this.v2 *= 0.96;
    this.r1 += this.v1; this.r2 += this.v2;
    this.alpha1 -= 1.6; this.alpha2 -= 1.0;
    if (this.alpha1 <= 0 && this.alpha2 <= 0) this.isDead = true;
  }
  display(target) {
    target.push(); target.noFill(); target.strokeWeight(2);
    if (this.alpha1 > 0) {
      target.stroke(this.hue, 80, 100, this.alpha1); 
      target.ellipse(this.x, this.y, this.r1 * 2, this.r1 * 1.3); 
    }
    if (this.alpha2 > 0) {
      target.stroke(this.hue, 60, 100, this.alpha2);
      target.ellipse(this.x, this.y, this.r2 * 2, this.r2 * 1.3);
    }
    target.pop();
  }
}

class Note {
  constructor(x, laneIndex) {
    this.x = x; this.laneIndex = laneIndex; this.y = -50;
    this.col = MACARON_PALETTE[laneIndex];
    this.isLong = random() > 0.7; 
    this.initialLen = this.isLong ? random(150, 350) : 0;
    this.len = this.initialLen;
    this.isHit = false; this.isHolding = false; this.isDead = false;
    this.rot = random(TWO_PI);
  }
  update() {
    this.y += noteSpeed; this.rot += 0.02;
    if (this.isLong && this.isHolding) {
      this.y = judgeY; this.len -= noteSpeed * 1.2; 
      if (this.len <= 0) {
        floatingTexts.push(new JudgementText("Perfect!", this.x, judgeY - 40));
        ripples.push(new GrowthRipple(this.x, judgeY));
        this.isDead = true;
      }
    }
    if (!this.isHit && this.y > judgeY + 60) this.miss();
    else if (this.isLong && this.isHit && !this.isHolding && this.len > 0) this.miss();
  }
  miss() {
    if (this.isDead) return;
    floatingTexts.push(new JudgementText("Miss", this.x, judgeY));
    combo = 0; this.shatter(); this.isDead = true;
  }
  display(target) {
    target.push();
    if (this.isLong && this.len > 0) {
      target.noStroke();
      target.fill(this.col.h, this.col.s, this.col.b, this.isHolding ? 60 : 30);
      target.rect(this.x - 12, this.y - this.len, 24, this.len, 12);
    }
    target.translate(this.x, this.y); target.rotate(this.rot); target.noStroke();
    target.fill(this.col.h, this.col.s, this.col.b);
    for(let i=0; i<5; i++) { target.rotate(TWO_PI/5); target.ellipse(12, 0, 18, 12); }
    target.fill(50, 40, 100); target.ellipse(0, 0, 8, 8);
    target.pop();
  }
  shatter() {
    for(let i=0; i<6; i++) permanentGroundPetals.push(new GroundPetal(this.x + random(-30, 30), height - random(5, 40), this.col));
  }
}

class MacaronKey {
  constructor(x, y, col) { this.x = x; this.y = y; this.col = col; this.particles = []; this.isPressed = false; this.highlightAlpha = 0; }
  update() {
    if (this.highlightAlpha > 0 && !this.isPressed) this.highlightAlpha -= 3; 
    for (let i = this.particles.length-1; i>=0; i--) {
      let p = this.particles[i]; p.x += p.vx; p.y += p.vy; p.vy += 0.2; p.alpha *= 0.92;
      if (p.alpha < 1) this.particles.splice(i, 1);
    }
  }
  drawHighlight(target) {
    if (this.isPressed || this.highlightAlpha > 0) {
      let alpha = this.isPressed ? 40 : this.highlightAlpha;
      target.push(); target.noStroke();
      for(let i=0; i<6; i++) { let w = 70 + i * 5; target.fill(0, 0, 100, (alpha / (i + 1))); target.rect(this.x - w/2, 0, w, this.y); }
      target.pop();
    }
  }
  display(target) {
    target.noStroke();
    for (let p of this.particles) { target.fill(p.col.h, p.col.s, p.col.b, p.alpha); target.push(); target.translate(p.x, p.y); target.rotate(p.alpha * 0.1); target.ellipse(0, 0, p.size, p.size * 0.5); target.pop(); }
    target.push(); target.translate(this.x, this.y);
    let s = this.isPressed ? 65 : 80;
    target.fill(this.col.h, this.col.s, this.isPressed ? 100 : this.col.b);
    target.ellipse(0, 0, s, s * 0.7);
    target.fill(0, 0, 100, 40); target.ellipse(0, -s*0.1, s * 0.6, s * 0.3);
    target.pop();
  }
  burst(noteColor, count) {
    let burstCol = noteColor || this.col;
    for (let i = 0; i < count; i++) {
      let angle = random(TWO_PI); let spd = random(2, 6);
      this.particles.push({ x: this.x, y: this.y, vx: cos(angle)*spd, vy: sin(angle)*spd, alpha: 100, size: random(8, 15), col: burstCol });
      if (count > 5) decayingBurstPetals.push(new DecayingPetal(this.x + random(-50, 50), height - random(5, 50), burstCol));
    }
  }
}

function drawTitlePage() {
  for (let p of permanentGroundPetals) p.display(this);
  drawAmbientPetals(this); 
  push();
  rectMode(CENTER); translate(width/2, height/2); noStroke();
  fill(globalHueShift, 20, 100, 90); rect(0, 0, 320, 160, 25);
  textAlign(CENTER, CENTER); fill(globalHueShift, 60, 60); textSize(32); text("Monet's Garden", 0, -25);
  fill(globalHueShift, 50, 40, sin(frameCount * 0.1) * 20 + 70); textSize(18); text("Click to Start", 0, 35);
  pop();
}

function drawAnimatingTransition() {
  gameGraphics.background(globalHueShift, 10, 98); 
  for (let p of permanentGroundPetals) p.display(gameGraphics);
  drawGamePlay();
  doorOffset += doorSpeed;
  image(gameGraphics, -doorOffset, 0, width/2, height, 0, 0, width/2, height);
  image(gameGraphics, width/2 + doorOffset, 0, width/2, height, width/2, 0, width/2, height);
  if (doorOffset > width/2) currentState = GAME_STATE.PLAYING;
}

function initializeGameLogic() {
  notes = []; keys = []; permanentGroundPetals = []; decayingBurstPetals = []; floatingTexts = []; sparkles = []; ripples = []; judgeY = height * 0.75; 
  let laneWidth = width / 5; lanes = [width/2 - laneWidth*1.5, width/2 - laneWidth*0.5, width/2 + laneWidth*0.5, width/2 + laneWidth*1.5];
  for (let i = 0; i < 4; i++) keys.push(new MacaronKey(lanes[i], judgeY, MACARON_PALETTE[i]));
  for (let i=0; i<100; i++) permanentGroundPetals.push(new GroundPetal(random(width), random(height-100, height), random(MACARON_PALETTE)));
}

function getLaneFromKeyCode(code) {
  if (code === LEFT_ARROW) return 0; if (code === UP_ARROW) return 1;
  if (code === DOWN_ARROW) return 2; if (code === RIGHT_ARROW) return 3;
  return -1;
}

class GroundPetal { constructor(x, y, col) { this.x = x; this.y = y; this.size = random(10, 20); this.angle = random(TWO_PI); this.col = col; this.alpha = 60; } display(target) { target.push(); target.translate(this.x, this.y); target.rotate(this.angle); target.noStroke(); target.fill(this.col.h, this.col.s - 5, this.col.b, this.alpha); target.ellipse(0, 0, this.size, this.size * 0.7); target.pop(); } }

class DecayingPetal { constructor(x, y, col) { this.x = x; this.y = y; this.size = random(8, 15); this.angle = random(TWO_PI); this.col = col; this.alpha = 100; this.life = 150 + random(50); this.isDead = false; } update() { this.life--; if (this.life < 80) this.alpha -= 2; if (this.alpha <= 0 || this.life <= 0) this.isDead = true; } display(target) { target.push(); target.translate(this.x, this.y); target.rotate(this.angle); target.noStroke(); target.fill(this.col.h, this.col.s - 5, this.col.b, this.alpha); target.ellipse(0, 0, this.size, this.size * 0.7); target.pop(); } }

class Sparkle { constructor() { this.x = random(width); this.y = random(height); this.alpha = 0; this.maxAlpha = random(40, 80); this.fadeStep = random(1, 2); this.growing = true; this.size = random(2, 4); this.isDead = false; this.hue = globalHueShift; } update() { if (this.growing) { this.alpha += 4; if (this.alpha >= this.maxAlpha) this.growing = false; } else { this.alpha -= this.fadeStep; if (this.alpha <= 0) this.isDead = true; } } display(target) { target.push(); target.noStroke(); target.fill(this.hue, 5, 100, this.alpha); target.ellipse(this.x, this.y, this.size); target.rectMode(CENTER); target.rect(this.x, this.y, this.size * 3, 0.5); target.rect(this.x, this.y, 0.5, this.size * 3); target.pop(); } }

class JudgementText { constructor(content, x, y) { this.content = content; this.x = x; this.y = y; this.alpha = 100; this.scale = 0.5; this.upOffset = 0; this.isDead = false; this.col = (this.content === "Miss") ? { h: 0, s: 0, b: 55 } : { h: 48, s: 85, b: 100 }; } update() { this.upOffset -= 1.6; this.alpha -= 2.2; if (this.scale < 1.1) this.scale += 0.1; if (this.alpha <= 0) this.isDead = true; } display(target) { target.push(); target.translate(this.x, this.y + this.upOffset); target.scale(this.scale); target.textAlign(CENTER, CENTER); if (this.content !== "Miss") { target.stroke(0, 0, 100, this.alpha * 0.7); target.strokeWeight(3); } target.fill(this.col.h, this.col.s, this.col.b, this.alpha); target.textSize(28); target.textStyle(BOLD); target.text(this.content, 0, 0); target.pop(); } }

function updateSparkles() { if (frameCount % 8 === 0) sparkles.push(new Sparkle()); for (let i = sparkles.length - 1; i >= 0; i--) { sparkles[i].update(); sparkles[i].display(this); if (sparkles[i].isDead) sparkles.splice(i, 1); } }

function updateDecayingPetals() { for (let i = decayingBurstPetals.length - 1; i >= 0; i--) { decayingBurstPetals[i].update(); if (decayingBurstPetals[i].isDead) decayingBurstPetals.splice(i, 1); } }

function updateAmbientPetals() { if (frameCount % 6 === 0 && ambientPetals.length < 80) ambientPetals.push(new AmbientPetal(random(width), -20)); for (let i = ambientPetals.length - 1; i >= 0; i--) { ambientPetals[i].update(); if (ambientPetals[i].y > height || ambientPetals[i].alpha <= 0) ambientPetals.splice(i, 1); } }

class AmbientPetal { constructor(x, y) { this.x = x; this.y = y; this.size = random(8, 18); this.speed = random(1, 3); this.rot = random(TWO_PI); this.swing = random(0.5, 2); this.col = random(MACARON_PALETTE); this.alpha = 80; } update() { this.y += this.speed; this.x += sin(frameCount * 0.02) * this.swing; if (this.y > height * 0.7) this.alpha -= 1.5; } display(target) { target.push(); target.translate(this.x, this.y); target.rotate(this.rot); target.noStroke(); target.fill(this.col.h, this.col.s - 10, this.col.b, this.alpha); target.ellipse(0, 0, this.size, this.size * 0.6); target.pop(); } }

function drawCombo() { push(); translate(width/2, 100); textAlign(CENTER, CENTER); noStroke(); let comboHue = (globalHueShift + 40) % 360; fill(comboHue, 20, 80, 50); textSize(18); text("COMBO", 0, -35); let s = 1 + sin(frameCount * 0.1) * 0.05; scale(s); fill(0, 0, 100, 30); textSize(64); text(combo, 2, 2); fill(comboHue, 50, 90); textStyle(BOLD); text(combo, 0, 0); pop(); }

function drawAmbientPetals(target) { for (let p of ambientPetals) p.display(target); }

function windowResized() { resizeCanvas(windowWidth, windowHeight); gameGraphics = createGraphics(windowWidth, windowHeight); gameGraphics.colorMode(HSB, 360, 100, 100, 100); initializeGameLogic(); }