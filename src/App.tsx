import "./App.css";
import React, { useEffect } from "react";
import MapComponent from "./components/Map";
import { useTypeContext } from "./context/TypeContext";
import { set } from "ol/transform";

function App() {
  const { type, setType } = useTypeContext()
  const [value, setValue] = React.useState("Polygon");

  const [typeFeature, setTypeFeature] = React.useState("Polygon");

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFeature(event.target.value);
    setValue(event.target.value);
    setType(event.target.value);
  };

  useEffect(() => {
    setTypeFeature(type);
    setValue(type);
  }, [type]);

  return (
    <div>
      <MapComponent type={typeFeature} />
      <div className="row">
        <div className="col-auto">
          <span className="input-group">
            <label className="input-group-text" htmlFor="type">
              Chọn kiểu:
            </label>
            <select
              value={value}
              onChange={handleSelect}
              className="form-select"
              id="type"
            >
              <option value="Point">Point</option>
              <option value="LineString">LineString</option>
              <option value="Polygon">Polygon</option>
              <option value="Circle">Circle</option>
              <option value="None">None</option>
            </select>
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
