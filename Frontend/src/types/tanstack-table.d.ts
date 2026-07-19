import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    search?: {
      enabled: boolean;
      placeholder?: string;
    };
    sort?: {
      enabled: boolean;
    };
    filter?: {
      type: "text" | "select";
      placeholder?: string;
      options?: {
        label: string;
        value: string;
      }[];
    };
  }
}
