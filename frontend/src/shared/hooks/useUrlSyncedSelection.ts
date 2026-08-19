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

  const isValidId = (id: string) => items.some((v) => v.id === id);

  const onChange = (nextId: string | null) => {
    if (nextId === null) {
      setSelectedId(null);
    } else if (isValidId(nextId)) {
      setSelectedId(nextId);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set(paramKey, nextId);
          return next;
        },
        { replace: true },
      );
    }
  };

  useEffect(() => {
    if (items.length !== 0) {
      const nextId = idFromUrl && isValidId(idFromUrl) ? idFromUrl : items[0].id;
      onChange(nextId);
      return;
    }
  }, [items, idFromUrl]);

  return { selectedId, onChange };
};
