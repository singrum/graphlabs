/**
 * 인접 리스트(succ 또는 pred)에서 특정 엣지 ID를 제거하는 함수
 */
export const removeFromAdjacency = (
  map: Map<string, Map<string, string[]>>,
  fromId: string,
  toId: string,
  edgeId: string,
) => {
  const targetMap = map.get(fromId);
  if (!targetMap) return;

  const list = targetMap.get(toId);
  if (!list) return;

  const filtered = list.filter((id) => id !== edgeId);

  if (filtered.length === 0) {
    targetMap.delete(toId);
    if (targetMap.size === 0) {
      map.delete(fromId);
    }
  } else {
    targetMap.set(toId, filtered);
  }
};

/**
 * 인접 리스트(succ 또는 pred)에 특정 엣지 ID를 추가하는 함수
 */
export const addToAdjacency = (
  map: Map<string, Map<string, string[]>>,
  fromId: string,
  toId: string,
  edgeId: string,
) => {
  if (!map.has(fromId)) {
    map.set(fromId, new Map());
  }
  const targetMap = map.get(fromId)!;

  const list = targetMap.get(toId) || [];
  if (!list.includes(edgeId)) {
    targetMap.set(toId, [...list, edgeId]);
  }
};
