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

  const baseAngle = -Math.PI / 4 - index * 1;

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
export function isLineIntersectingRect(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  rect: { minX: number; maxX: number; minY: number; maxY: number },
) {
  // A. 한 점이라도 내부에 있으면 즉시 true (성능 최적화)
  const isInside = (x: number, y: number) =>
    x >= rect.minX && x <= rect.maxX && y >= rect.minY && y <= rect.maxY;
  if (isInside(x1, y1) || isInside(x2, y2)) return true;

  // B. 교차 판정 함수 (경계값 포함하도록 수정)
  const intersect = (
    p1x: number,
    p1y: number,
    p2x: number,
    p2y: number,
    p3x: number,
    p3y: number,
    p4x: number,
    p4y: number,
  ) => {
    const det = (p2x - p1x) * (p4y - p3y) - (p2y - p1y) * (p4x - p3x);
    if (det === 0) return false;

    const lambda =
      ((p4y - p3y) * (p4x - p1x) + (p3x - p4x) * (p4y - p1y)) / det;
    const gamma = ((p1y - p2y) * (p4x - p1x) + (p2x - p1x) * (p4y - p1y)) / det;

    // 0과 1을 포함(>=, <=)하여 선 끝이 변에 닿는 경우도 판정
    return lambda >= 0 && lambda <= 1 && gamma >= 0 && gamma <= 1;
  };

  return (
    intersect(x1, y1, x2, y2, rect.minX, rect.minY, rect.maxX, rect.minY) || // 상
    intersect(x1, y1, x2, y2, rect.minX, rect.maxY, rect.maxX, rect.maxY) || // 하
    intersect(x1, y1, x2, y2, rect.minX, rect.minY, rect.minX, rect.maxY) || // 좌
    intersect(x1, y1, x2, y2, rect.maxX, rect.minY, rect.maxX, rect.maxY) // 우
  );
}

export function isCurveIntersectingRect(
  x1: number,
  y1: number, // 시작점
  cpx: number,
  cpy: number, // 제어점
  x2: number,
  y2: number, // 끝점
  rect: { minX: number; maxX: number; minY: number; maxY: number },
) {
  // 곡선을 10개의 선분으로 나누어 각각 직선 충돌 검사 수행
  const steps = 10;
  let prevX = x1;
  let prevY = y1;

  for (let i = 1; i <= steps; i++) {
    const t = i / steps;

    // 2차 베지어 공식: (1-t)^2*P0 + 2(1-t)t*P1 + t^2*P2
    const cx =
      Math.pow(1 - t, 2) * x1 + 2 * (1 - t) * t * cpx + Math.pow(t, 2) * x2;
    const cy =
      Math.pow(1 - t, 2) * y1 + 2 * (1 - t) * t * cpy + Math.pow(t, 2) * y2;

    // 분할된 작은 직선에 대해 기존 직선 충돌 로직 재활용
    if (isLineIntersectingRect(prevX, prevY, cx, cy, rect)) {
      return true;
    }
    prevX = cx;
    prevY = cy;
  }
  return false;
}
export function isLoopIntersectingRect(
  x: number,
  y: number,
  radius: number,
  index: number,
  rect: { minX: number; maxX: number; minY: number; maxY: number },
) {
  const points = getSelfLoopPoints(x, y, radius, index);
  if (!points || points.length < 8) return false;

  // 루프는 곡률이 크므로 단계를 20으로 높여 촘촘하게 검사합니다.
  const steps = 20;
  let prevX = points[0];
  let prevY = points[1];

  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const mt = 1 - t;

    // 3차 베지어 공식 최적화 계산
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const t2 = t * t;
    const t3 = t2 * t;

    const cx =
      mt3 * points[0] +
      3 * mt2 * t * points[2] +
      3 * mt * t2 * points[4] +
      t3 * points[6];

    const cy =
      mt3 * points[1] +
      3 * mt2 * t * points[3] +
      3 * mt * t2 * points[5] +
      t3 * points[7];

    if (isLineIntersectingRect(prevX, prevY, cx, cy, rect)) return true;
    prevX = cx;
    prevY = cy;
  }
  return false;
}
