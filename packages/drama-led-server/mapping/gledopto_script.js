function fx(num) {
  return num.toFixed(4);
}

function generateForGledopto(
  xPosition,
  width,
  height
) {
  const lights = [];

  for (let i = 0; i < 100; i++) {
    const xPos = Math.random() * width + xPosition;
    const yPos = Math.random() * height;
    // lights.push({
    //   light_id: `gledopto-${i}`,
    //   x_coordinate: fx(xPos),
    //   y_coordinate: fx(yPos),
    // });
    console.log(`gledopto-${i},${fx(xPos)},${fx(yPos)}`);
  }

  return lights;
}

generateForGledopto(
  370,
  30,
  40
);