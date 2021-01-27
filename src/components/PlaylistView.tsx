import React, { FC, useContext, useEffect, useState } from "react";
import { BoxView, Button, ScrollArea, Slider, Text, useEventHandler, View } from "@nodegui/react-nodegui";
import BackButton from "./BackButton";
import { useLocation, useParams } from "react-router";
import { useFetch } from "../hooks/useFetch";
import { kHost } from "../conf";
import { PlaylistShortRes } from "./Home";
import { Direction, Orientation, QAbstractButtonSignals, QAbstractSliderSignals, WidgetAttribute } from "@nodegui/nodegui";
import { WidgetEventListeners } from "@nodegui/react-nodegui/dist/components/View/RNView";
import { useInterval } from "../hooks/useInterval";
import { AudioPlayerContext } from "../context/audioPlayerContext";

export interface PlaylistTrackRes {
  name: string;
  artists: string;
  url: string;
}
export interface PlaylistExtendedRes extends PlaylistShortRes {
  tracks: PlaylistTrackRes[];
}

interface PlaylistViewProps {
  // audioPlayer: any;
}

const PlaylistView: FC<PlaylistViewProps> = () => {
  const params = useParams<{ id: string }>();
  const location = useLocation<{ name: string }>();
  const { playlistId, currentTrack, setCurrentTrack, setTracks, setPlaylistId } = useContext(AudioPlayerContext);
  const [playlist, fetchError] = useFetch<PlaylistExtendedRes | null>(`${kHost}/playlist/${params.id}`, { initState: null });


  const trackClickHandler = (url: string) => {
    if (playlist) {
      setPlaylistId(playlist._id);
      setTracks(playlist.tracks);
      setCurrentTrack(url);
    }
  };

  return (
    <BoxView direction={Direction.TopToBottom}>
      <BackButton />
      <Text>{`<center><h2>${location.state.name[0].toUpperCase()}${location.state.name.slice(1)}</h2></center>`}</Text>
      <ScrollArea>
        <View style={`flex-direction:column; height: '100%'`}>
          {!fetchError &&
            playlist?.tracks.length !== 0 &&
            playlist?.tracks.map((track, index) => (
              <TrackButton active={playlist._id===playlistId && track.url === currentTrack} key={index} name={track.name} on={{ clicked: () => trackClickHandler(track.url) }} artist={track.artists} />
            ))}
        </View>
      </ScrollArea>
    </BoxView>
  );
};

interface TrackButtonProps {
  name: string;
  artist: string;
  active: boolean;
  on: Partial<QAbstractButtonSignals | WidgetEventListeners>;
}

const TrackButton: FC<TrackButtonProps> = ({ name, artist, on, active }) => {
  return <Button id={`${active ? "active" : ""}`} on={on} text={`${name} -- ${artist}`} styleSheet={trackButtonStyle} />;
};

const trackButtonStyle = `
  #active{
    background-color: orange;
    color: #333;
  }
`;

export default PlaylistView;
