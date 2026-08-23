import { SelectFilter } from "../../../../shared/ui/filters/controls";
import { useProductsQuery } from "../../../products/hooks/useProducts";
import { FilterSelectWrapper } from "./FilterSelectWrapper";

type ProductSelecFieldProps = {
  val: string;
  onChange: (newVal: string) => void;
};

export const ProductSelecField = ({ val, onChange }: ProductSelecFieldProps) => {
  const { data, isFetching } = useProductsQuery({ pageable: { page: 0, size: 100 } });

  const productOptions = (data?.content ?? []).map((product) => ({
    label: product.name,
    value: product.id,
  }));

  return (
    <FilterSelectWrapper label="Product">
      <SelectFilter
        value={val}
        options={productOptions}
        onChange={(newVal) => newVal && onChange(newVal)}
        disabled={isFetching}
        classname="text-xs h-6"
        hideAnyOption={true}
      />
    </FilterSelectWrapper>
  );
};
