import {
  Direction,
  Orientation,
  QAbstractSliderSignals,
} from "@nodegui/nodegui";
import {
  BoxView,
  Button,
  Slider,
  Text,
  useEventHandler,
} from "@nodegui/react-nodegui";
import React, { ReactElement, useContext, useEffect, useState } from "react";
import {
  AudioPlayerContext,
  TrackContext,
} from "../context/audioPlayerContext";
import { shuffleArray } from "../helpers/shuffleArray";
import NodeMpv from "node-mpv";

const audioPlayer = new NodeMpv(
  {
    audio_only: true,
    auto_restart: true,
    time_update: 1,
    binary: process.env.MPV_EXECUTABLE ?? "/usr/bin/mpv",
    debug: true,
    verbose: true,
  },
  ["--ytdl-raw-options-set=format=140,http-chunk-size=300000"]
);

function Player(): ReactElement {
  const {
    currentTrack,
    totalDuration,
    tracks,
    setCurrentTrack,
    setTracks,
    setTotalDuration,
  } = useContext(AudioPlayerContext);
  const [volume, setVolume] = useState(55);
  const [trackTime, setTrackTime] = useState(0);
  const [shuffle, setShuffle] = useState<boolean>(false);
  const [realPlaylist, setRealPlaylist] = useState<TrackContext["tracks"]>([]);
  const [isStopped, setIsStopped] = useState<boolean>(false);
  const playlistTracksUrl = tracks.map((t) => t.url);
  const trackSliderEvents = useEventHandler<QAbstractSliderSignals>(
    {
      sliderMoved: (value) => {
        if (playerRunning && currentTrack) {
          const newPosition = (totalDuration * value) / 100;
          setTrackTime(parseInt(newPosition.toString()));
        }
      },
      sliderReleased: () => {
        (async () => {
          try {
            await audioPlayer.goToPosition(trackTime);
          } catch (error) {
            console.error(error);
          }
        })();
      },
    },
    [currentTrack, totalDuration, trackTime]
  );
  const volumeHandler = useEventHandler<QAbstractSliderSignals>(
    {
      sliderMoved: (value) => {
        setVolume(value);
      },
    },
    []
  );
  const playerRunning = audioPlayer.isRunning();

  // initial Effect
  useEffect(() => {
    (async () => {
      try {
        if (!playerRunning) {
          await audioPlayer.start();
        }
        await audioPlayer.clearPlaylist();
        await audioPlayer.volume(55);
      } catch (error) {
        console.error("Failed to start audio player");
        console.error(error);
      }
    })();

    return () => {
      if (playerRunning) {
        audioPlayer.quit().catch((e: any) => console.log(e));
      }
    };
  }, []);

  // track change effect
  useEffect(() => {
    (async () => {
      try {
        if (currentTrack && playerRunning) {
          await audioPlayer.load(currentTrack, "replace");
          setTrackTime(0);
          await audioPlayer.play();
        }
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
    if (playerRunning) {
      audioPlayer.volume(volume);
    }
  }, [volume]);

  // for monitoring shuffle playlist
  useEffect(() => {
    if (shuffle && realPlaylist.length === 0) {
      const shuffledTracks = shuffleArray(tracks);
      setRealPlaylist(tracks);
      setTracks(shuffledTracks);
    } else if (!shuffle && realPlaylist.length > 0) {
      setTracks(realPlaylist);
    }
  }, [shuffle]);

  // live Effect
  useEffect(() => {
    if (playerRunning) {
      const statusListener = (status: { property: string; value: any }) => {
        if (status?.property === "duration") {
          setTotalDuration(status.value);
        }
      };
      const stopListener = () => {
        setIsStopped(true);
        // go to next track
        if (currentTrack && playlistTracksUrl && tracks.length !== 0) {
          const index = playlistTracksUrl?.indexOf(currentTrack) + 1;
          setCurrentTrack(
            playlistTracksUrl[index > playlistTracksUrl.length - 1 ? 0 : index]
          );
        }
      };
      const progressListener = (seconds: number) => {
        console.log("seconds", seconds);
        setTrackTime(seconds);
      };
      audioPlayer.on("status", statusListener);
      audioPlayer.on("stopped", stopListener);
      audioPlayer.on("timeposition", progressListener);
      return () => {
        audioPlayer.off("timeposition", progressListener);
        audioPlayer.off("status", statusListener);
        audioPlayer.off("stopped", stopListener);
      };
    }
  });

  const handlePlayPause = async () => {
    try {
      if ((await audioPlayer.isPaused()) && playerRunning) {
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

  const prevOrNext = (constant: number) => {
    if (currentTrack && playlistTracksUrl) {
      const index = playlistTracksUrl.indexOf(currentTrack) + constant;
      setCurrentTrack(
        playlistTracksUrl[
          index > playlistTracksUrl?.length - 1
            ? 0
            : index < 0
            ? playlistTracksUrl.length - 1
            : index
        ]
      );
    }
  };

  const trackName = tracks.find((track) => track.url === currentTrack);
  const playbackPercentage =
    totalDuration > 0 ? (trackTime * 100) / totalDuration : 0;
  return (
    <BoxView style={`max-height: 120px;`} direction={Direction.TopToBottom}>
      <BoxView direction={Direction.LeftToRight} style={`padding: 20px 0px`}>
        <Slider
          enabled={!!currentTrack || trackTime > 0}
          on={trackSliderEvents}
          sliderPosition={playbackPercentage}
          hasTracking
          orientation={Orientation.Horizontal}
        />
        <Text>
          {new Date(trackTime * 1000).toISOString().substr(14, 5) +
            "/" +
            new Date(totalDuration * 1000).toISOString().substr(14, 5)}
        </Text>
      </BoxView>

      <BoxView>
        <Text>
          {currentTrack &&
            `
            <p>
            <h4>${trackName?.name}</h4>
            ${trackName?.artists}
            </p>
            `}
        </Text>

        <Button
          style={`background-color: ${shuffle ? "orange" : "native"}`}
          on={{ clicked: () => setShuffle(!shuffle) }}
          maxSize={{ height: 30, width: 100 }}
          text="🔀"
        />
        <Button
          maxSize={{ height: 30, width: 100 }}
          on={{ clicked: () => prevOrNext(-1) }}
          text="⏪"
        />
        <Button
          maxSize={{ height: 30, width: 100 }}
          on={{ clicked: handlePlayPause }}
          text={isStopped ? "▶" : "⏸"}
        />
        <Button
          maxSize={{ height: 30, width: 100 }}
          on={{ clicked: () => prevOrNext(1) }}
          text="⏩"
        />
        <Button maxSize={{ height: 30, width: 100 }} text="➿" />
        <Slider
          minSize={{ height: 20, width: 80 }}
          maxSize={{ height: 20, width: 100 }}
          hasTracking
          sliderPosition={volume}
          on={volumeHandler}
          orientation={Orientation.Horizontal}
        />
      </BoxView>
    </BoxView>
  );
}

export default Player;
