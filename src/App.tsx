import "./App.css";
import MapWrapper from "./components/MapWrapper";
import { Statistics } from "./components/Statistics";
import { ToolBar } from "./components/ToolBar";

function App() {
  return (
    <div id="main-div" className="flex flex-row w-full h-full">
      <ToolBar />
      <div className="flex flex-col w-full h-full">
        <Statistics />
        <MapWrapper />
      </div>
    </div>
  );
}

export default App;
