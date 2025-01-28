class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 3 + 0.5;
    this.angle = Math.random() * Math.PI * 2;
    this.distance = Math.random() * 30 + 20;
    this.color = `hsl(${Math.random() * 60 + 180}, 70%, 60%)`;
    this.rotationSpeed = -(Math.random() * 0.02 + 0.01);
    this.oscillationRange = Math.random() * 5;
  }

  update() {
    this.angle += this.rotationSpeed;
    let baseX = mouse.lastClientX + Math.cos(this.angle) * this.distance;
    let baseY = mouse.lastClientY + Math.sin(this.angle) * this.distance;

    this.x = baseX + Math.sin(Date.now() * 0.001 * this.rotationSpeed) * this.oscillationRange;
    this.y = baseY + Math.cos(Date.now() * 0.001 * this.rotationSpeed) * this.oscillationRange;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}

// 初始化 Canvas
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

// 粒子数组
let particles = [];
const numberOfParticles = 150;

// 初始化粒子
function initParticles() {
  particles = [];
  for (let i = 0; i < numberOfParticles; i++) {
    particles.push(new Particle(mouse.lastClientX, mouse.lastClientY));
  }
}

// 动画循环
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });
  requestAnimationFrame(animateParticles);
}

// 初始化
initParticles();
animateParticles();

// 窗口大小改变时重新初始化粒子
window.addEventListener('resize', initParticles);