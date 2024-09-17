type HandCoordinates = number[][];

export const drawRing = (
  hand: HandCoordinates,
  selectedFinger: string,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  shouldClear = true
) => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (shouldClear) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  const fingerIndexes: Record<string, number> = {
    thumb: 3,
    indexFinger: 6,
    middleFinger: 10,
    ringFinger: 14,
    pinky: 18,
  };

  const index = fingerIndexes[selectedFinger];
  const [x, y] = hand[index];

  const drawRoundedRect = (
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fillStyle = '#FFD700'; // Gold color for the ring
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#FFD700'; // Outline for the ring
    ctx.stroke();
  };

  const rectWidth = 40;
  const rectHeight = 15;
  const rectX = x - rectWidth / 2;
  const rectY = y - rectHeight / 2;
  const borderRadius = 10;

  drawRoundedRect(rectX, rectY, rectWidth, rectHeight, borderRadius);
};
