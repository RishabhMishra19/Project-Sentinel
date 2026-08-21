import { SelectField } from "../../../shared/forms/SelectField";
import { useProductsQuery } from "../../products/hooks/useProducts";
import { useAnalyticsSearchParams } from "../hooks/useAnalyticsSearchParams";

export const ProductSelecField = () => {
  const { productId, mergeParams } = useAnalyticsSearchParams();
  const { data, isFetching } = useProductsQuery({ pageable: { page: 0, size: 100 } });

  const productOptions = (data?.content ?? []).map((product) => ({
    label: product.name,
    value: product.id,
  }));

  return (
    <SelectField
      value={productId ?? undefined}
      onChange={(event) => mergeParams({ productId: event.target.value })}
      aria-label="Filter by product"
      placeholder="Select Product"
      emptyPlaceholder="No Products"
      disabled={isFetching}
      options={productOptions}
    />
  );
};
