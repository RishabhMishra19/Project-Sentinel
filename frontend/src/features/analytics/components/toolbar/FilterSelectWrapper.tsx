type FilterSelectWrapperProps = {
  children: React.ReactNode;
  label?: string;
  width?: string;
};

export const FilterSelectWrapper = ({
  children,
  label,
  width = "140px",
}: FilterSelectWrapperProps) => {
  return (
    <div className="flex flex-row gap-1 items-center h-6" style={{ width }}>
      {!label ? null : <div className="text-xs text-gray-400">{label}:</div>}
      {children}
    </div>
  );
};
