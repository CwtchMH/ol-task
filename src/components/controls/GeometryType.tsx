import { useCombinedContext } from "../../hooks/useCombinedContext";

export default function GeometryType() {
  const { typeGeometry, setTypeGeometry } = useCombinedContext();

  const handleTypeGeometry = (type: string) => () => {
    setTypeGeometry(type);
  };

  return (
    <div className={`flex flex-col gap-2`}>
      <div
        className={`text-center rounded-sm hover:bg-blue-400 cursor-pointer ${typeGeometry === "Point" ? "bg-blue-400" : ""}`}
        onClick={handleTypeGeometry("Point")}
      >
        Point
      </div>
      <div
        className={`text-center rounded-sm hover:bg-blue-400 cursor-pointer ${typeGeometry === "LineString" ? "bg-blue-400" : ""}`}
        onClick={handleTypeGeometry("LineString")}
      >
        LineString
      </div>
      <div
        className={`text-center rounded-sm hover:bg-blue-400 cursor-pointer ${typeGeometry === "Polygon" ? "bg-blue-400" : ""}`}
        onClick={handleTypeGeometry("Polygon")}
      >
        Polygon
      </div>
    </div>
  );
}
