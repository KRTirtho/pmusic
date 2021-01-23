import React, { FC } from "react";
import { Button, Text, useEventHandler, View } from "@nodegui/react-nodegui";
import { QPushButtonSignals } from "@nodegui/nodegui";
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
    <View style={`flex: 2; flex-direction: column;`}>
      <Text>{`<center><h2>Playlists</h2></center>`}</Text>
      {!fetchError && playlists.length !== 0 && playlists.map((playlist, index) => <PlaylistCard key={index} name={playlist.name} playlistId={playlist._id} />)}
    </View>
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
        history.push(`/playlist/${playlistId}`, {name});
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
