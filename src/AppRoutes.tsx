import React from "react";
import { Route } from "react-router";
import Home from "./components/Home";
import NodeMpv from "node-mpv";
import PlaylistView from "./components/PlaylistView";
import { View } from "@nodegui/react-nodegui";

function AppRoutes() {
    const audioPlayer = new NodeMpv({audio_only:true, auto_restart: true, time_update: 1}, ["--ytdl-raw-options-set=format=140,http-chunk-size=300000"])
  return (
    <View style={`flex:1; min-height: '100%';`}>
      <Route exact path="/" component={Home} />
      <Route path="/playlist/:id"><PlaylistView audioPlayer={audioPlayer}/></Route>
    </View>
  );
}

export default AppRoutes;
