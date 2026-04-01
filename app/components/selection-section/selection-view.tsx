import { itemAssets } from "@/stores/ui-slice"
import { useBoundStore } from "@/stores/use-bound-store"
import type {
  EdgeData,
  NodeData,
  Nullable,
  PropertyType,
  Schema,
} from "@/types/graph"
import { Trash } from "lucide-react"
import { useMemo } from "react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import ItemSelect from "./item-select"

interface SelectionViewProps {
  type: "node" | "edge"
  data: NodeData[] | EdgeData[]
  schema: Schema
}

export function SelectionView({ type, data, schema }: SelectionViewProps) {
  const updateEntities = useBoundStore((e) => e.updateEntities)
  const commonData = useMemo(() => {
    if (data.length === 0) return null
    if (data.length === 1) return data[0]

    const first = data[0]
    const result: Nullable<NodeData | EdgeData> = {} as Nullable<
      NodeData | EdgeData
    >

    // 스키마에 정의된 모든 키를 전수 조사
    ;(Object.keys(schema) as Array<keyof (NodeData | EdgeData)>).forEach(
      (key) => {
        const firstValue = first[key]
        // 모든 아이템의 해당 속성이 첫 번째와 같은지 확인
        const isAllSame = data.every(
          (item) =>
            (item as Record<string, unknown>)[key as string] === firstValue
        )

        // 같으면 해당 값, 다르면 Mixed 상태인 "" 반환
        result[key as string] = isAllSame
          ? (firstValue as string | number | boolean)
          : null
      }
    )

    return result
  }, [data, schema])

  const handleUpdate = (key: string, rawValue: string) => {
    const propType = schema[key]
    let parsedValue: string | number | boolean = rawValue

    // 1. 타입별 형변환
    if (propType === "number") {
      parsedValue = rawValue === "" ? 0 : Number(rawValue)
      if (isNaN(parsedValue)) return // 숫자가 아니면 중단
    }

    // 2. 스토어 액션 호출
    updateEntities(
      type,
      data.map((item) => item._id),
      { [key]: parsedValue }
    )
  }

  const selectedCount = data.length

  return (
    <div className="no-scrollbar h-full space-y-6 overflow-y-scroll p-4">
      <Header type={type} data={data} />
      <div className="space-y-4">
        {(
          Object.entries(schema) as Array<
            [keyof (NodeData | EdgeData), PropertyType]
          >
        )
          .filter(([key]) => key !== "_id") // ID는 수정 불가
          .map(([key, propType]) => {
            const value = (commonData as Record<string, unknown>)[key as string]

            // 여러 개 선택되었을 때 값이 다르면 Mixed 상태로 판정
            const isMixed = value === null && selectedCount > 1

            return (
              <div key={key as string} className="flex flex-col gap-1.5">
                <Label className="flex flex-col gap-2">
                  <LabelHeader labelKey={key as string} propType={propType} />
                  {propType === "color" ||
                  propType === "text" ||
                  propType === "number" ? (
                    <Input
                      type={propType}
                      value={
                        value === null
                          ? ""
                          : propType === "number"
                            ? Math.floor(value as number)
                            : String(value)
                      }
                      placeholder={isMixed ? "Mixed" : ""}
                      className="w-full"
                      onChange={(e) =>
                        handleUpdate(key as string, e.target.value)
                      }
                    />
                  ) : propType === "node" ? (
                    <ItemSelect
                      type={propType}
                      id={value as string}
                      onValueChange={(newId: string | null) =>
                        newId && handleUpdate(key as string, newId)
                      }
                    />
                  ) : null}
                </Label>
              </div>
            )
          })}
      </div>
    </div>
  )
}

function Header({
  type,
  data,
}: {
  type: "node" | "edge"
  data: NodeData[] | EdgeData[]
}) {
  const Icon = itemAssets[type].icon
  const deleteEntities = useBoundStore((state) => state.deleteEntities)

  const handleDelete = () => {
    const ids = data.map((item) => item._id)
    deleteEntities(type, ids)
  }
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Icon className="size-4 shrink-0" />
        <div className="h-6 truncate text-base font-medium">
          {data.length === 1 ? (
            (data[0]._label as string)
          ) : (
            <span className="italic">
              {data.length} {type}s selected
            </span>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        className="shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        onClick={handleDelete}
        title={`Delete selected ${type}s`}
      >
        <Trash className="size-4" />
      </Button>
    </div>
  )
}

function LabelHeader({
  labelKey,
  propType,
}: {
  labelKey: string
  propType: PropertyType
}) {
  return (
    <div className="flex w-full items-center justify-between">
      <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
        {labelKey.replace("_", "")}
      </span>
      <Badge variant="secondary" className="text-muted-foreground">
        {propType}
      </Badge>
    </div>
  )
}
