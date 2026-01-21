import { itemAssets } from "@/stores/ui-slice";
import { useBoundStore } from "@/stores/use-bound-store";
import type { EdgeData, NodeData } from "@/types/graph";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { ScrollArea } from "../ui/scroll-area";

export function SelectionView({
  type,
  data,
}: {
  type: "node" | "edge";
  data: Map<string, boolean>;
}) {
  const Icon = itemAssets[type].icon;
  const ids = Array.from(data.keys());

  // 1. 선택된 아이템들의 실제 데이터를 스토어에서 가져옴
  const itemData = useBoundStore(
    useShallow((store) => {
      const collection = store.graph[`${type}s` as const];
      return ids
        .map((id) => collection.get(id))
        .filter((item): item is NodeData | EdgeData => !!item);
    }),
  );

  // 2. 공통 값 계산 로직
  const commonData = useMemo(() => {
    if (itemData.length === 1) return itemData[0]; // 하나만 선택됐을 땐 그대로 반환

    const first = itemData[0];
    const result: NodeData | EdgeData = {} as NodeData | EdgeData;

    // 첫 번째 아이템의 모든 키를 기준으로 비교
    Object.keys(first).forEach((key) => {
      // 모든 아이템의 해당 키 값이 첫 번째 아이템과 같은지 확인
      const isAllSame = itemData.every((item) => item[key] === first[key]);

      // 모두 같으면 그 값, 다르면 빈 문자열("")
      result[key] = isAllSame ? first[key] : "";
    });

    return result;
  }, [itemData]);

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-4 h-full">
        {/* 헤더: 공통 라벨 표시 */}
        <div className="flex items-center gap-2 border-b pb-4">
          <Icon className="size-4 text-muted-foreground" />
          <div className="font-bold text-lg">
            {/* 라벨이 다르면 빈 칸, 같으면 라벨 출력 */}
            {commonData._label || (
              <span className="text-muted-foreground italic text-sm font-normal">
                Multiple Values
              </span>
            )}
          </div>
        </div>

        {/* 속성 리스트 */}
        <div className="space-y-4">
          {Object.entries(commonData)
            .filter(([key]) => key !== "_id") // ID는 고유값이므로 제외
            .map(([key, value]) => (
              <div key={key} className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {key.replace("_", "")} {/* 시각적으로 보기 좋게 _ 제거 */}
                </span>
                <div className="flex items-center justify-between h-9 px-3 rounded-md border bg-muted/30">
                  <span className="text-sm">
                    {/* 값이 비어있으면(서로 다르면) 빈 칸, 같으면 value 출력 */}
                    {value !== undefined && value !== null && value !== "" ? (
                      value.toString()
                    ) : (
                      <span className="text-muted-foreground/30">—</span>
                    )}
                  </span>
                </div>
              </div>
            ))}
        </div>

        {/* 하단 요약 정보 */}
        <div className="mt-8 pt-4 border-t text-[10px] text-muted-foreground/60 flex justify-between">
          <span>SELECTED COUNT</span>
          <span className="font-mono">{itemData.length}</span>
        </div>
      </div>
    </ScrollArea>
  );
}
