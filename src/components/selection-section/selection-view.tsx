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
import { Badge } from "../ui/badge";
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
        <Header type={type} data={data} />
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
                  <Label className="flex flex-col gap-2">
                    <LabelHeader labelKey={key as string} propType={propType} />
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

function Header({
  type,
  data,
}: {
  type: "node" | "edge";
  data: NodeData[] | EdgeData[];
}) {
  const Icon = itemAssets[type].icon;
  return (
    <div className="flex items-center gap-2">
      <Icon className={cn("size-4")} />
      <div className="font-medium text-base truncate">
        {data.length === 1 ? (
          (data[0]._label as string)
        ) : (
          <span className="italic ">
            {data.length} {type}s selected
          </span>
        )}
      </div>
    </div>
  );
}

function LabelHeader({
  labelKey,
  propType,
}: {
  labelKey: string;
  propType: PropertyType;
}) {
  return (
    <div className="flex justify-between items-center w-full">
      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
        {labelKey.replace("_", "")}
      </span>
      <Badge variant="secondary" className="text-muted-foreground">
        {propType}
      </Badge>
    </div>
  );
}
