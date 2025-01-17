import "../../styles/GeometryType.css";

export default function GeometryType({
  setGeometryType,
}: {
  setGeometryType: (type: string) => void;
}) {
  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGeometryType(e.target.value);
  };

  return (
    <div className="" id="control">
      <div className="" id="select-type">
        <label htmlFor="type">Geometry type &nbsp;</label>
        <select onChange={handleSelect} id="type">
          <option value="Point">Point</option>
          <option value="LineString">LineString</option>
          <option value="Polygon">Polygon</option>
          <option value="Circle">Circle</option>
          <option value="None">None</option>
        </select>
      </div>
      <div className="" id="coordinates"></div>
    </div>
  );
}
