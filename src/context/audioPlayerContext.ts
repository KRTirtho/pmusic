import React from "react";

export interface TrackContext {
  playlistId: string;
  currentTrack: string;
  totalDuration: number;
  tracks: { name: string; url: string; artists: string }[];
  setPlaylistId(id:string): void;
  setCurrentTrack(track: string): void;
  setTotalDuration(duration: number): void;
  setTracks(tracks: TrackContext["tracks"]):void;
}

export const AudioPlayerContext = React.createContext<TrackContext>({
  playlistId: "",
  currentTrack: "",
  totalDuration: 0,
  tracks: [],
  setPlaylistId: ()=>{},
  setCurrentTrack: ()=>{},
  setTracks: ()=>{},
  setTotalDuration: ()=>{},
});
