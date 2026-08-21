type TooltipWrapperProps = {
  children: React.ReactNode;
  value: React.ReactNode;
};

export const TooltipWrapper = ({ children, value }: TooltipWrapperProps) => {
  return (
    <div className="group relative w-full">
      {children}
      <div
        className="
        pointer-events-none
        absolute
        left-1/2
        top-full
        mt-2
        z-50
        -translate-x-1/2
        whitespace-nowrap
        rounded
        bg-gray-100
        px-2
        py-1
        text-xs
        text-black
        opacity-0
        transition-opacity
        duration-200
        group-hover:opacity-100
      "
      >
        {value}
      </div>
    </div>
  );
};
