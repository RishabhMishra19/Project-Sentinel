import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

type UseUrlSyncedSelectionOptions<T extends { id: string }> = {
  paramKey: string;
  items: readonly T[];
};

/**
 * Keeps a selected entity id in sync with a search-param and the loaded list:
 * prefer URL when valid, else keep current if still present, else first item.
 */
export const useUrlSyncedSelection = <T extends { id: string }>({
  paramKey,
  items,
}: UseUrlSyncedSelectionOptions<T>) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const idFromUrl = searchParams.get(paramKey);
  const [selectedId, setSelectedId] = useState<string | null>(idFromUrl);

  useEffect(() => {
    if (items.length === 0) {
      setSelectedId(null);
      return;
    }

    setSelectedId((current) => {
      if (idFromUrl && items.some((item) => item.id === idFromUrl)) {
        return idFromUrl;
      }
      if (current && items.some((item) => item.id === current)) {
        return current;
      }
      return items[0]!.id;
    });
  }, [items, idFromUrl]);

  const onChange = (nextId: string) => {
    setSelectedId(nextId);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set(paramKey, nextId);
        return next;
      },
      { replace: true },
    );
  };

  return { selectedId, onChange };
};
