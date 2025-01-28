// 共享的鼠标位置对象
const mouse = {
  clientX: window.innerWidth / 2,
  clientY: window.innerHeight / 2,
  lastClientX: window.innerWidth / 2,
  lastClientY: window.innerHeight / 2
};

// 更新鼠标位置的函数
function updateMousePosition(e) {
  mouse.lastClientX = e.clientX;
  mouse.lastClientY = e.clientY;
  mouse.clientX = e.clientX;
  mouse.clientY = e.clientY;
}

// 窗口大小调整函数
function handleResize() {
  const canvas = document.getElementById('particleCanvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // 更新鼠标位置到窗口中心
  mouse.clientX = window.innerWidth / 2;
  mouse.clientY = window.innerHeight / 2;
  mouse.lastClientX = window.innerWidth / 2;
  mouse.lastClientY = window.innerHeight / 2;
}

// 添加事件监听
window.addEventListener('mousemove', updateMousePosition);
window.addEventListener('scroll', () => {
  // 在滚动时保持使用最后的鼠标位置
  mouse.clientX = mouse.lastClientX;
  mouse.clientY = mouse.lastClientY;
});
window.addEventListener('resize', handleResize);

// 初始化时调用一次
handleResize();