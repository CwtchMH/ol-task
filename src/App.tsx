import "./App.css";
import MapWrapper from "./components/MapWrapper";
import { ToolBar } from "./components/toolbar";

function App() {
  return (
    <div id="main-div" className="flex flex-row w-full h-full">
      <ToolBar />
      <MapWrapper />
    </div>
  );
}

export default App;
