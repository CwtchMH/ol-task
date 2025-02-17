import "./App.css";
import MapWrapper from "./components/MapWrapper";
import { ToolBar } from "./components/ToolBar";
import { useCombinedContext } from "./hooks/useCombinedContext";

function App() {
  const {
    enableDraw,
    enableSelect,
    typeGeometry,
    map,
    vectorLayer,
    mapRef,
    typeInteraction,
    isSelected,
    setIsSelected,
    tempFeature,
    setTempFeature,
    setEnableSelect,
    setEnableModify,
    setEnableTranslate,
  } = useCombinedContext();
  return (
    <div id="main-div" className="flex flex-row w-full h-full">
      <ToolBar />
      <div className="flex flex-col w-full h-full">
        <MapWrapper
          enableDraw={enableDraw}
          enableSelect={enableSelect}
          typeGeometry={typeGeometry}
          map={map!}
          vectorLayer={vectorLayer}
          mapRef={mapRef}
          typeInteraction={typeInteraction}
          isSelected={isSelected}
          setIsSelected={setIsSelected}
          tempFeature={tempFeature}
          setTempFeature={setTempFeature}
          setEnableSelect={setEnableSelect}
          setEnableModify={setEnableModify}
          setEnableTranslate={setEnableTranslate}
        />
      </div>
    </div>
  );
}

export default App;
