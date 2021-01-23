import React, { ReactElement, useEffect, useState } from "react";
import { Button, ProgressBar, View } from "@nodegui/react-nodegui";
import { useFetch } from "../hooks/useFetch";
import { kHost } from "../conf";
import { useParams } from "react-router";
import { HeadersInit } from "node-fetch";

interface PlayerProps {
  ctrack?: string;
}

interface Range {
  start: number;
  end: number;
}

function Player({ ctrack }: PlayerProps): ReactElement {
  // const trackId = ctrack?.split("=")[1];
  // const params = useParams<{ id: string }>();
  // const [progress, setProgress] = useState<number>(0);
  // const [range, setRange] = useState<Range | null>(null);
  // const [headers, setHeaders] = useState<HeadersInit>({
  //   connection: "keep-alive",
  // });
  // const [trackStream, error, response] = useFetch<Blob|string>(`${kHost}/playlist/${params.id}/track/${trackId}`, {
  //   deps: [ctrack, range, headers],
  //   initState: "",
  //   reqOpts: { headers },
  //   stateType: !range ? "json" : "buffer",
  // });
  // useEffect(() => {
  //   const contentLength = response?.headers.get("content-length");
  //   if (contentLength && !range) {
  //     const start = 0;
  //     const end = parseInt(((parseInt(contentLength) * 20) / 100).toString());
  //     setRange({ start, end });
  //     setHeaders({ ...headers, range: `bytes=${start}-${end}` });
  //   }
  //   const contentRange = response?.headers
  //     .get("content-range")
  //     ?.split(/bytes ([0-9]*)-([0-9]*)\/([0-9]*)/)
  //     .filter(Boolean);
  //   if (contentRange && range) {
  //     const contentEndPoint = parseInt(contentRange[1]);
  //     const totalLength = parseInt(contentRange[2]);
  //     const tenOfTotal = parseInt(((totalLength * 10) / 100).toString()); //10%
  //     const start = contentEndPoint + 1;
  //     const remainingContent = totalLength - contentEndPoint;
  //     const newerProgress = progress + tenOfTotal;
  //     const endLength = newerProgress + contentEndPoint;
  //     const end = remainingContent < newerProgress ? totalLength - 1 : endLength;
  //     setProgress(newerProgress);
  //     setRange({ start, end });
  //     setHeaders({ ...headers, range: `bytes=${start}-${end}` });
  //   }
  //   else if (error && error.code === 'HPE_INVALID_CONTENT_LENGTH') {
      
  //   }
  // }, [response]);
  return (
    
  );
}

export default Player;


