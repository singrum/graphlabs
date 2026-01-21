/**
 * 두 점 사이의 중점에서 수직 방향으로 offset만큼 떨어진 조절점(Control Point)을 계산합니다.
 */
export const getControlPoint = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  offset: number,
  isReversed: boolean,
) => {
  const actualOffset = isReversed ? -offset : offset;

  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const angle = Math.atan2(dy, dx);
  const normalAngle = angle + Math.PI / 2;

  return {
    x: midX + Math.cos(normalAngle) * actualOffset,
    y: midY + Math.sin(normalAngle) * actualOffset,
  };
};
