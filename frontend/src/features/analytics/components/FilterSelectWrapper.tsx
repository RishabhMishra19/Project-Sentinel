type FilterSelectWrapperProps = {
  children: React.ReactNode;
  label: string;
  width?: string;
};

export const FilterSelectWrapper = ({
  children,
  label,
  width = "100px",
}: FilterSelectWrapperProps) => {
  return (
    <div style={{ width }}>
      <div className="text-xs text-gray-400">{label}</div>
      {children}
    </div>
  );
};
