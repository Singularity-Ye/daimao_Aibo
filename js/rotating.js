// 旋转图片相关变量
let imageAngle = 0;
const imageRadius = 65;
let img = document.getElementById('rotating-image');
let isRotating = true;
const rotationSpeed = 0.015;

// 更新图片位置
function updateImagePosition() {
  if (isRotating && img) {
    imageAngle -= rotationSpeed;
    const imgX = mouse.lastClientX + imageRadius * Math.cos(imageAngle);
    const imgY = mouse.lastClientY + imageRadius * Math.sin(imageAngle);
    const directionAngle = imageAngle + Math.PI / 2;

    img.style.left = imgX - img.offsetWidth / 2 + 'px';
    img.style.top = imgY - img.offsetHeight / 2 + 'px';
    img.style.transform = `rotate(${directionAngle * 180 / Math.PI}deg)`;
  }
}

// 切换旋转状态
function toggleRotation() {
  isRotating = !isRotating;
  document.getElementById('status-bar').textContent =
    `旋转状态：${isRotating ? '启用' : '停用'}`;

  if (!isRotating && img) {
    // 停止时移除图片
    document.body.removeChild(img);
    img = null;
  } else if (isRotating && !img) {
    // 重新启用时创建新图片
    img = document.createElement('img');
    img.id = 'rotating-image';
    img.src = 'images/daimao2.png';
    img.alt = 'Rotating Image';
    img.style.pointerEvents = 'none';
    document.body.appendChild(img);
    imageAngle = 0;
    updateImagePosition();
  }
}

// 动画循环
function animate() {
  updateImagePosition();
  requestAnimationFrame(animate);
}

// 开始动画
animate();