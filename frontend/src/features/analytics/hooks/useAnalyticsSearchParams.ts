import { useSearchParams } from "react-router-dom";

export const useAnalyticsSearchParams = () => {
  const [params, setParams] = useSearchParams();

  const scope = params.get("scope");
  const tenantId = params.get("tenantId");
  const productId = params.get("productId");
  const serviceId = params.get("serviceId");
  const endpointId = params.get("endpointId");
  const from = params.get("from");
  const to = params.get("to");
  const bucket = params.get("bucket");

  const mergeParams = (newParams: { [key: string]: string | null | undefined }) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(newParams)) {
          if (value == null || value === "" || value === undefined) {
            next.delete(key);
          } else {
            next.set(key, value);
          }
        }
        return next;
      },
      {
        replace: true,
      },
    );
  };

  return {
    scope,
    tenantId,
    productId,
    serviceId,
    endpointId,
    from,
    to,
    bucket,
    mergeParams,
  };
};
