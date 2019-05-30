const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const backGround = new Image();
backGround.src = './img.jpg';

backGround.onload = () => {
  canvas.width = backGround.width;
  canvas.height = backGround.height;
  context.drawImage(backGround, 0, 0, canvas.width, canvas.height);
};
