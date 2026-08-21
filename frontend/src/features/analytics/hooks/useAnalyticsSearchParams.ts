import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks";

export const useAnalyticsSearchParams = () => {
  const activeTenant = useAppSelector((state) => state.session.activeTenant!);
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

  console.log({ scope, tenantId, productId, serviceId, endpointId });

  useEffect(() => {
    if (params.size === 0) {
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      mergeParams({
        scope: "TENANT",
        tenantId: activeTenant.id,
        from: twentyFourHoursAgo.toISOString(),
        to: now.toISOString(),
        bucket: "MINUTE",
      });
    }
  }, []);

  const entityId = !scope
    ? null
    : {
        TENANT: tenantId,
        PRODUCT: productId,
        SERVICE: serviceId,
        ENDPOINT: endpointId,
      }[scope];

  return {
    scope,
    entityId,
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
