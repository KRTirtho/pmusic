import React, { FC, useEffect, useState } from "react";
import { Button, ScrollArea, Slider, Text, useEventHandler, View } from "@nodegui/react-nodegui";
import BackButton from "./BackButton";
import { useLocation, useParams } from "react-router";
import { useFetch } from "../hooks/useFetch";
import { kHost } from "../conf";
import { PlaylistShortRes } from "./Home";
import { Orientation, QAbstractButtonSignals, QAbstractSliderSignals } from "@nodegui/nodegui";
import { WidgetEventListeners } from "@nodegui/react-nodegui/dist/components/View/RNView";
import { useInterval } from "../hooks/useInterval";

export interface PlaylistTrackRes {
  name: string;
  artists: string;
  url: string;
}
export interface PlaylistExtendedRes extends PlaylistShortRes {
  tracks: PlaylistTrackRes[];
}

interface PlaylistViewProps {
  audioPlayer: any;
}

const PlaylistView: FC<PlaylistViewProps> = ({ audioPlayer }) => {
  const params = useParams<{ id: string }>();
  const location = useLocation<{ name: string }>();
  const [volume, setVolume] = useState(55);
  const [currentTrack, setCurrentTrack] = useState<string>();
  const [trackTime, setTrackTime] = useState(0);
  const [isStopped, setIsStopped] = useState<boolean>(false);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const trackSliderEvents = useEventHandler<QAbstractSliderSignals>(
    {
      sliderMoved: (value) => {
        if (audioPlayer.isRunning() && currentTrack) {
          const newPosition = (totalDuration * value) / 100;
          audioPlayer
            .goToPosition(newPosition)
            .then(() => {
              setTrackTime(parseInt(newPosition.toString()));
            })
            .catch((e: any) => console.error(e));
        }
      },
    },
    [currentTrack, totalDuration]
  );
  const volumeHandler = useEventHandler<QAbstractSliderSignals>(
    {
      sliderMoved: (value) => {
        setVolume(value);
      },
    },
    []
  );
  const [playlist, fetchError] = useFetch<PlaylistExtendedRes | null>(`${kHost}/playlist/${params.id}`, { initState: null });
  const playlistTracksUrl = playlist?.tracks.map((t) => t.url);
  // updating track time hook
  useInterval(() => {
    if (!isStopped && currentTrack && trackTime <= totalDuration) {
      setTrackTime(trackTime + 1);
    }
  }, 1000);

  // initial Effect
  useEffect(() => {
    (async () => {
      try {
        if (!audioPlayer.isRunning()) {
          await audioPlayer.start();
        }
        await audioPlayer.clearPlaylist();
        await audioPlayer.volume(55);
      } catch (error) {
        console.error(error);
      }
    })();

    return () => {
      if (audioPlayer.isRunning()) {
        audioPlayer.quit().catch((e: any) => console.log(e));
      }
    };
  }, []);

  // track change effect
  useEffect(() => {
    (async () => {
      try {
        if (!audioPlayer.isRunning()) return null;
        await audioPlayer.load(currentTrack, "replace");
        setTrackTime(0);
        await audioPlayer.play();
        setIsStopped(false);
      } catch (error) {
        if (error.errcode !== 5) {
          setIsStopped(true);
        }
        console.error(error);
      }
    })();
  }, [currentTrack]);

  useEffect(() => {
    if (audioPlayer.isRunning()) {
      audioPlayer.volume(volume);
    }
  }, [volume]);

  // live Effect
  useEffect(() => {
    if (audioPlayer.isRunning()) {
      const statusListener = (status: { property: string; value: any }) => {
        if (status?.property === "duration") {
          setTotalDuration(status.value);
        }
      };
      const stopListener = () => {
        setIsStopped(true);
        // go to next track
        if (currentTrack && playlistTracksUrl && playlist) {
          const index = playlistTracksUrl?.indexOf(currentTrack) + 1;
          setCurrentTrack(playlistTracksUrl[index > playlistTracksUrl.length - 1 ? 0 : index]);
        }
      };
      audioPlayer.on("status", statusListener);
      audioPlayer.on("stopped", stopListener);
      return () => {
        audioPlayer.off("status", statusListener);
        audioPlayer.off("stopped", stopListener);
      };
    }
  });

  const handlePlayPause = async () => {
    try {
      if ((await audioPlayer.isPaused()) && audioPlayer.isRunning()) {
        await audioPlayer.play();
        setIsStopped(false);
      } else {
        await audioPlayer.pause();
        setIsStopped(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const trackClickHandler = (url: string) => {
    setCurrentTrack(url);
  };
  const prevOrNext = (constant: number) => {
    if (currentTrack && playlistTracksUrl) {
      const index = playlistTracksUrl.indexOf(currentTrack) + constant;
      setCurrentTrack(playlistTracksUrl[index > playlistTracksUrl?.length - 1 ? 0 : index < 0 ? playlistTracksUrl.length - 1 : index]);
    }
  };
  const trackName = playlist?.tracks.find((track) => track.url === currentTrack);
  const playbackPercentage = totalDuration > 0 ? (trackTime * 100) / totalDuration : 0;
  return (
    <View style={playlistViewStyle}>
      <BackButton />
      <Text>{`<center><h2>${location.state.name[0].toUpperCase()}${location.state.name.slice(1)}</h2></center>`}</Text>
      <ScrollArea style={`flex-grow:1`}>
        <View style={`flex-direction:column; height: '100%'`}>
          {!fetchError &&
            playlist?.tracks.length !== 0 &&
            playlist?.tracks.map((track, index) => <TrackButton key={index} name={track.name} on={{ clicked: () => trackClickHandler(track.url) }} artist={track.artists} />)}
        </View>
      </ScrollArea>
      {playlist && (
        <View style={`flex-direction: column;`}>
          <View style={`flex-direction: row; padding: 20px 0px`}>
            <Slider on={trackSliderEvents} sliderPosition={playbackPercentage} style={`flex-grow: 1;`} hasTracking orientation={Orientation.Horizontal} />
            <Text>{new Date(trackTime * 1000).toISOString().substr(14, 5) + "/" + new Date(totalDuration * 1000).toISOString().substr(14, 5)}</Text>
          </View>
          <View style={playerLayoutStyle}>
            {currentTrack && (
              <Text>{`
            <p>
            <h4>${trackName?.name}</h4>
            ${trackName?.artists}
            </p>
            `}</Text>
            )}
            <Button text="🔀" />
            <Button on={{ clicked: () => prevOrNext(-1) }} text="⏪" />
            <Button on={{ clicked: handlePlayPause }} text={isStopped ? "▶" : "⏸"} />
            <Button on={{ clicked: () => prevOrNext(1) }} text="⏩" />
            <Button text="➿" />
            <Slider hasTracking sliderPosition={volume} on={volumeHandler} orientation={Orientation.Horizontal} />
          </View>
        </View>
      )}
    </View>
  );
};

const playlistViewStyle = `
  flex-direction: column;
  flex: 1;
  align-items:stretch;
  min-height: '100%';
`;

const playerLayoutStyle = `
  flex-direction: row;
  justify-content: 'center';
`;

interface TrackButtonProps {
  name: string;
  artist: string;
  on: Partial<QAbstractButtonSignals | WidgetEventListeners>;
}

const TrackButton: FC<TrackButtonProps> = ({ name, artist, on }) => {
  return <Button on={on} text={`${name} -- ${artist}`} />;
};

export default PlaylistView;
