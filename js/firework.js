// 初始化变量
var pi, ctx, canvas, cx, cy, playerX, playerY, playerZ, playerVX, playerVY, playerVZ;
var pitch, yaw, pitchV, yawV, scale, seedTimer, seedInterval, seedLife, gravity;
var seeds, sparkPics, sparks, frames;

function initVars() {
  pi = Math.PI;
  canvas = document.getElementById('fireworkCanvas');
  if (!canvas) {
    console.error('Canvas not found!');
    return;
  }
  ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  cx = canvas.width / 2;
  cy = canvas.height / 2;
  playerZ = -25;
  playerX = playerY = playerVX = playerVY = playerVZ = pitch = yaw = pitchV = yawV = 0;
  scale = 600;
  seedTimer = 0;
  seedInterval = 5;
  seedLife = 100;
  gravity = .02;
  seeds = new Array();
  sparkPics = new Array();
  sparks = new Array();
  frames = 0;
}

function rasterizePoint(x, y, z) {
  var p, d;
  x -= playerX;
  y -= playerY;
  z -= playerZ;
  p = Math.atan2(x, z);
  d = Math.sqrt(x * x + z * z);
  x = Math.sin(p - yaw) * d;
  z = Math.cos(p - yaw) * d;
  p = Math.atan2(y, z);
  d = Math.sqrt(y * y + z * z);
  y = Math.sin(p - pitch) * d;
  z = Math.cos(p - pitch) * d;
  var rx1 = -1000, ry1 = 1, rx2 = 1000, ry2 = 1, rx3 = 0, ry3 = 0, rx4 = x, ry4 = z, uc = (ry4 - ry3) * (rx2 - rx1) - (rx4 - rx3) * (ry2 - ry1);
  if (!uc) return { x: 0, y: 0, d: -1 };
  var ua = ((rx4 - rx3) * (ry1 - ry3) - (ry4 - ry3) * (rx1 - rx3)) / uc;
  var ub = ((rx2 - rx1) * (ry1 - ry3) - (ry2 - ry1) * (rx1 - rx3)) / uc;
  if (!z) z = .000000001;
  if (ua > 0 && ua < 1 && ub > 0 && ub < 1) {
    return {
      x: cx + (rx1 + ua * (rx2 - rx1)) * scale,
      y: cy + y / z * scale,
      d: Math.sqrt(x * x + y * y + z * z)
    };
  } else {
    return {
      x: cx + (rx1 + ua * (rx2 - rx1)) * scale,
      y: cy + y / z * scale,
      d: -1
    };
  }
}

function spawnSeed() {
  var seed = {
    x: -50 + Math.random() * 100,
    y: 25,
    z: -50 + Math.random() * 100,
    vx: .1 - Math.random() * .2,
    vy: -1.5,
    vz: .1 - Math.random() * .2,
    draw: function () {
      var point = rasterizePoint(this.x, this.y, this.z);
      if (point.d != -1) {
        var size = 200 / (1 + point.d);
        ctx.fillRect(point.x - size / 2, point.y - size / 2, size, size);
      }
    }
  };
  seed.born = frames;
  seeds.push(seed);
}

function splode(x, y, z) {
  var t = 5 + parseInt(Math.random() * 150);
  var sparkV = 1 + Math.random() * 2.5;
  for (var i = 0; i < t; i++) {
    var spark = new Spark(x, y, z);
    spark.vx = (Math.random() - 0.5) * sparkV;
    spark.vy = (Math.random() - 0.5) * sparkV;
    spark.vz = (Math.random() - 0.5) * sparkV;
    sparks.push(spark);
  }
}

function Spark(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.alpha = 1;
  this.radius = 2;

  this.draw = function () {
    var point = rasterizePoint(this.x, this.y, this.z);
    if (point.d != -1) {
      var size = this.radius * 200 / (1 + point.d);
      ctx.beginPath();
      ctx.arc(point.x, point.y, size, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(255, 200, 0, ${this.alpha})`;
      ctx.fill();
    }
  };

  this.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    this.z += this.vz;
    this.vy += gravity;
    this.alpha -= 0.01;
    this.radius *= 0.99;
  };
}

function doLogic() {
  if (seedTimer < frames) {
    seedTimer = frames + seedInterval * Math.random() * 10;
    spawnSeed();
  }

  for (var i = 0; i < seeds.length; ++i) {
    seeds[i].vy += gravity;
    seeds[i].x += seeds[i].vx;
    seeds[i].y += seeds[i].vy;
    seeds[i].z += seeds[i].vz;
    if (frames - seeds[i].born > seedLife) {
      splode(seeds[i].x, seeds[i].y, seeds[i].z);
      seeds.splice(i, 1);
    }
  }

  for (var i = sparks.length - 1; i >= 0; i--) {
    sparks[i].update();
    if (sparks[i].alpha <= 0 || sparks[i].radius <= 0) {
      sparks.splice(i, 1);
    }
  }

  p = Math.atan2(playerX, playerZ);
  d = Math.sqrt(playerX * playerX + playerZ * playerZ);
  d += Math.sin(frames / 80) / 1.25;
  t = Math.sin(frames / 200) / 40;
  playerX = Math.sin(p + t) * d;
  playerZ = Math.cos(p + t) * d;
  yaw = pi + p + t;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ff8";
  for (var i = -100; i < 100; i += 3) {
    for (var j = -100; j < 100; j += 4) {
      var point = rasterizePoint(i, 25, j);
      if (point.d != -1) {
        var size = 250 / (1 + point.d);
        var d = Math.sqrt(i * i + j * j);
        var a = 0.75 - Math.pow(d / 100, 6) * 0.75;
        if (a > 0) {
          ctx.globalAlpha = a;
          ctx.fillRect(point.x - size / 2, point.y - size / 2, size, size);
        }
      }
    }
  }
  ctx.globalAlpha = 1;

  for (var i = 0; i < seeds.length; ++i) {
    seeds[i].draw();
  }

  for (var i = 0; i < sparks.length; ++i) {
    if (sparks[i].alpha > 0 && sparks[i].radius > 0) {
      sparks[i].draw();
    }
  }
}

function frame() {
  if (frames > 100000) {
    seedTimer = 0;
    frames = 0;
  }
  frames++;
  draw();
  doLogic();
  requestAnimationFrame(frame);
}

window.addEventListener("resize", () => {
  if (canvas) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    cx = canvas.width / 2;
    cy = canvas.height / 2;
  }
});