import { Window, hot, BoxView } from "@nodegui/react-nodegui";
import React, { useState } from "react";
import { Direction, QIcon } from "@nodegui/nodegui";
import nodeguiIcon from "../assets/nodegui.jpg";
import { MemoryRouter } from "react-router";
import AppRoutes from "./AppRoutes";
import { AudioPlayerContext, TrackContext } from "./context/audioPlayerContext";
import Player from "./components/Player";

const minSize = { width: 500, height: 520 };
const winIcon = new QIcon(nodeguiIcon);
function App() {
  const [tracks, setTracks] = useState<TrackContext["tracks"]>([]);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [currentTrack, setCurrentTrack] = useState<string>("");
  const [playlistId, setPlaylistId] = useState<string>("");

  return (
    <MemoryRouter>
      <Window windowIcon={winIcon} windowTitle="P Music" minSize={minSize}>
        <AudioPlayerContext.Provider
          value={{
            playlistId,
            currentTrack,
            totalDuration,
            tracks,
            setPlaylistId,
            setCurrentTrack,
            setTotalDuration,
            setTracks,
          }}
        >
          <BoxView direction={Direction.TopToBottom}>
            <AppRoutes />
            <Player />
          </BoxView>
        </AudioPlayerContext.Provider>
      </Window>
    </MemoryRouter>
  );
}

class RootApp extends React.Component {
  render() {
    return <App />;
  }
}

export default hot(RootApp);
