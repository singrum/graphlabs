// --- 기본 데이터 모델 ---
export interface NodeData {
  id: string;
  config: { x: number; y: number; color: string; label: string };
}

export interface EdgeData {
  id: string;
  source: string; // 시작 노드 ID
  target: string; // 끝 노드 ID
}
