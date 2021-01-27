import React from "react";
import { Route } from "react-router";
import Home from "./components/Home";
import PlaylistView from "./components/PlaylistView";

function AppRoutes() {

	return (
		<>
			<Route exact path="/" component={Home}/>
			<Route path="/playlist/:id"><PlaylistView /></Route>
		</>
	);
}

export default AppRoutes;
