import "./App.css";
import React from "react";
import MapComponent from "./components/Map";

function App() {

  const [type, setType] = React.useState("Point");

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Hello")
    setType(event.target.value);
    console.log(event.target.value);
  }

  return (
    <div>
      <MapComponent type={type}/>
      <div className="row">
        <div className="col-auto">
          <span className="input-group">
            <label className="input-group-text" htmlFor="type">
              Chọn kiểu:
            </label>
            <select onChange={handleSelect} className="form-select" id="type">
              <option value="Point">Point</option>
              <option value="LineString" selected>LineString</option>
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
