import React, { FC } from "react";
import { BoxView, Button, Text, useEventHandler } from "@nodegui/react-nodegui";
import { Direction, QPushButtonSignals } from "@nodegui/nodegui";
import { useHistory } from "react-router";
import { kHost } from "../conf";
import { useFetch } from "../hooks/useFetch";

export interface PlaylistShortRes {
  _id: string;
  name: string;
}

function Home() {
  const [playlists, fetchError] = useFetch<PlaylistShortRes[]>(`${kHost}/`, { initState: [], setter: (newer, prev) => [...prev, ...newer] });

  return (
    <BoxView direction={Direction.TopToBottom}>
      <Text>{`<center><h2>Playlists</h2></center>`}</Text>
      <BoxView>{!fetchError && playlists.length !== 0 && playlists.map((playlist, index) => <PlaylistCard key={index} name={playlist.name} playlistId={playlist._id} />)}</BoxView>
    </BoxView>
  );
}

export interface PlaylistCardProps {
  name: string;
  playlistId: string;
}

const PlaylistCard: FC<PlaylistCardProps> = ({ name, playlistId }) => {
  const history = useHistory();

  const events = useEventHandler<QPushButtonSignals>(
    {
      clicked: () => {
        history.push(`/playlist/${playlistId}`, { name });
      },
    },
    []
  );

  return <Button style={playlistButtonStyle} on={events} text={name} />;
};

const playlistButtonStyle = `
  padding: 30px;
`;

export default Home;
