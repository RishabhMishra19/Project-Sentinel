import { useCallback, useState } from "react";

/**
 * Modal open state keyed by an item (`null` = closed).
 * Use for view / edit / confirm dialogs that bind to a selected entity.
 */
export const useModalState = <T,>() => {
  const [item, setItem] = useState<T | null>(null);

  const open = item != null;
  const show = useCallback((value: T) => {
    setItem(value);
  }, []);
  const close = useCallback(() => {
    setItem(null);
  }, []);

  return { item, open, show, close, setItem };
};
