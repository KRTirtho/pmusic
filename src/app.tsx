import { Window, hot } from "@nodegui/react-nodegui";
import React from "react";
import { QIcon } from "@nodegui/nodegui";
import nodeguiIcon from "../assets/nodegui.jpg";
import { MemoryRouter } from "react-router";
import AppRoutes from "./AppRoutes";

const minSize = { width: 500, height: 520 };
const winIcon = new QIcon(nodeguiIcon);
function App() {
  return (
    <MemoryRouter>
      <Window windowIcon={winIcon} windowTitle="P Music" minSize={minSize}>
          <AppRoutes />
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
