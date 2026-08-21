import { SelectFilter } from "../../../shared/ui/filters/controls";
import { useProductsQuery } from "../../products/hooks/useProducts";
import { useAnalyticsSearchParams } from "../hooks/useAnalyticsSearchParams";
import { FilterSelectWrapper } from "./FilterSelectWrapper";

export const ProductSelecField = () => {
  const { productId, mergeParams } = useAnalyticsSearchParams();
  const { data, isFetching } = useProductsQuery({ pageable: { page: 0, size: 100 } });

  const productOptions = (data?.content ?? []).map((product) => ({
    label: product.name,
    value: product.id,
  }));

  console.log("rishabh", { productId });

  return (
    <FilterSelectWrapper label="Product">
      <SelectFilter
        value={productId}
        options={productOptions}
        onChange={(val) => mergeParams({ productId: val })}
        disabled={isFetching}
      />
    </FilterSelectWrapper>
  );
};
