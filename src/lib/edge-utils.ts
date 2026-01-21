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

export const getSelfLoopPoints = (
  x: number,
  y: number,
  radius: number,
  index: number,
) => {
  // 1. 인덱스에 따라 기본 각도를 변경 (예: 45도 간격으로 분산)
  // index가 0이면 -45도, 1이면 -90도, 2이면 0도... 이런 식으로 배치됩니다.
  const angleStep = Math.PI / 4;
  const baseAngle = -Math.PI / 4 - index * angleStep;

  // 고리의 크기 (기존 유지)
  const loopHeight = radius * 3.5;

  // 2. 시작점과 끝점 계산 (baseAngle 기준 대칭)
  const spread = 0.2; // 시작/끝점 사이의 간격 각도
  const startAngle = baseAngle - spread;
  const endAngle = baseAngle + spread;

  const startX = x + Math.cos(startAngle) * radius;
  const startY = y + Math.sin(startAngle) * radius;
  const endX = x + Math.cos(endAngle) * radius;
  const endY = y + Math.sin(endAngle) * radius;

  // 3. 조절점 계산 (baseAngle 기준 대칭)
  // cpAngleOffset을 조절하여 루프의 "너비"를 결정합니다.
  const cpAngleOffset = 0.5;
  const cp1x = x + Math.cos(baseAngle - cpAngleOffset) * loopHeight;
  const cp1y = y + Math.sin(baseAngle - cpAngleOffset) * loopHeight;
  const cp2x = x + Math.cos(baseAngle + cpAngleOffset) * loopHeight;
  const cp2y = y + Math.sin(baseAngle + cpAngleOffset) * loopHeight;

  // Arrow의 points 배열로 반환
  return [startX, startY, cp1x, cp1y, cp2x, cp2y, endX, endY];
};
