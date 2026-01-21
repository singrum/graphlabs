import { cn } from "@/lib/utils";
import { itemAssets } from "@/stores/ui-slice";
import type {
  EdgeData,
  NodeData,
  Nullable,
  PropertyType,
  Schema,
} from "@/types/graph";
import { useMemo } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import ItemSelect from "./item-select";

interface SelectionViewProps {
  type: "node" | "edge";
  data: NodeData[] | EdgeData[];
  schema: Schema;
}

export function SelectionView({ type, data, schema }: SelectionViewProps) {
  const Icon = itemAssets[type].icon;

  // 1. 공통 값 계산 로직 (Strict Typing)
  // 모든 데이터 객체를 순회하며 스키마에 정의된 키들의 값이 일치하는지 확인
  const commonData = useMemo(() => {
    if (data.length === 0) return null;
    if (data.length === 1) return data[0];

    const first = data[0];
    const result: Nullable<NodeData | EdgeData> = {} as Nullable<
      NodeData | EdgeData
    >;

    // 스키마에 정의된 모든 키를 전수 조사
    (Object.keys(schema) as Array<keyof (NodeData | EdgeData)>).forEach(
      (key) => {
        const firstValue = first[key];
        // 모든 아이템의 해당 속성이 첫 번째와 같은지 확인
        const isAllSame = data.every(
          (item) =>
            (item as Record<string, unknown>)[key as string] === firstValue,
        );

        // 같으면 해당 값, 다르면 Mixed 상태인 "" 반환
        result[key as string] = isAllSame
          ? (firstValue as string | number | boolean)
          : null;
      },
    );

    return result;
  }, [data, schema]);

  const selectedCount = data.length;

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-4 h-full">
        {/* 헤더: 아이콘 및 라벨/선택 개수 */}
        <div className="flex items-center gap-2">
          <Icon
            className={cn("size-4", {
              "text-muted-foreground": selectedCount > 1,
            })}
          />
          <div className="font-medium text-base truncate">
            {data.length === 1 ? (
              ((commonData as Record<string, unknown>)._label as string)
            ) : (
              <span className="italic font-normal text-muted-foreground">
                {selectedCount} {type}s selected
              </span>
            )}
          </div>
        </div>

        {/* 속성 리스트: 스키마 기반 렌더링 */}
        <div className="space-y-4">
          {(
            Object.entries(schema) as Array<
              [keyof (NodeData | EdgeData), PropertyType]
            >
          )
            .filter(([key]) => key !== "_id") // ID는 수정 불가
            .map(([key, propType]) => {
              const value = (commonData as Record<string, unknown>)[
                key as string
              ];

              // 여러 개 선택되었을 때 값이 다르면 Mixed 상태로 판정
              const isMixed = value === null && selectedCount > 1;

              return (
                <div key={key as string} className="flex flex-col gap-1.5">
                  {/* 속성 이름 및 타입 레이블 */}

                  <Label className="flex flex-col gap-2">
                    <div className="flex justify-between items-center w-full">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        {(key as string).replace("_", "")}
                      </span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground font-mono">
                        {propType}
                      </span>
                    </div>
                    {propType == "color" ||
                    propType == "text" ||
                    propType == "number" ? (
                      <Input
                        // 스키마 타입에 따른 Input 속성 제어
                        type={propType}
                        value={
                          // 1. 우선 value가 null(Mixed)인지 체크
                          value === null
                            ? ""
                            : propType === "number"
                              ? Math.floor(value as number)
                              : String(value)
                        }
                        placeholder={isMixed ? "Mixed" : ""}
                        className={
                          isMixed
                            ? "placeholder:italic placeholder:text-muted-foreground"
                            : ""
                        }
                        onChange={(e) => {
                          // 일괄 업데이트 로직 연결 (예정)
                          console.log(
                            `Update ${type} [${key as string}] to:`,
                            e.target.value,
                          );
                        }}
                      />
                    ) : propType === "node" ? (
                      <ItemSelect type={propType} id={value as string} />
                    ) : null}
                  </Label>
                </div>
              );
            })}
        </div>
      </div>
    </ScrollArea>
  );
}
