import { DependencyList, Dispatch, SetStateAction, useEffect, useState } from "react";
import fetch, { RequestInit, Response, FetchError } from "node-fetch";

export interface UseFetchOptions<ResultType> {
  setter?: (newer: ResultType, prev: ResultType) => ResultType;
  reqOpts?: RequestInit;
  initState: ResultType;
  deps?: DependencyList;
  stateType?: "arrayBuffer"|"buffer"|"blob"|"text"|"json";
}

export type UseFetchReturn<ResultType> = [ResultType, FetchError | null, Response | null, Dispatch<SetStateAction<ResultType>>, Dispatch<SetStateAction<FetchError | null>>];

export type UseFetch = <ResultType>(url: string, options: UseFetchOptions<ResultType>) => UseFetchReturn<ResultType>;

export const useFetch: UseFetch = (url: string, { reqOpts, setter, initState, deps, stateType = "json" }) => {
  const [state, setState] = useState(initState);
  const [response, setResponse] = useState<Response | null>(null);
  const [error, setError] = useState<FetchError | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(url, reqOpts);
        setResponse(res);
          const playlistRes = await res[stateType]();
          setState(setter ? setter(playlistRes, state) : playlistRes);
      } catch (error) {
        setError(error);
        console.log(error);
      }
    })();
  }, deps ?? []);
  return [state, error, response, setState, setError];
};
