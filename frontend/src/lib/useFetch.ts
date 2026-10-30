import { useCallback, useEffect, useState } from "react";
import { getApiError } from "./api";

// `fn` harus stabil (fungsi modul atau useCallback). Data lama dipertahankan saat reload.
export function useFetch<T>(fn: () => Promise<T>) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let stale = false;

    fn()
      .then((result) => {
        if (stale) return;
        setData(result);
        setError("");
      })
      .catch((err) => {
        if (!stale) setError(getApiError(err));
      });

    return () => {
      stale = true;
    };
  }, [fn, tick]);

  return { data, error, reload };
}
