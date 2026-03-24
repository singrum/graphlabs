import { useBoundStore } from "@/stores/use-bound-store";
import { useEffect } from "react";

export const useGraphHotkeys = () => {
  const deleteSelected = useBoundStore((state) => state.deleteSelected);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. 입력창(Input, Textarea)에서 타이핑 중일 때는 기능 차단
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // 2. Delete 또는 Backspace 키 감지
      if (e.key === "Delete" || e.key === "Backspace") {
        // Backspace의 경우 브라우저 '뒤로 가기' 방지
        if (e.key === "Backspace") {
          // 선택된 것이 있을 때만 기본 동작 방지
          e.preventDefault();
        }
        deleteSelected();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deleteSelected]);
};
