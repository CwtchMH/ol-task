import "../styles/CoordinatesDisplay.css";
import { ICoordinates } from "../@types/type";

export default function CoordinatesDisplay({
  coordinates,
}: {
  coordinates: ICoordinates;
}) {
  const coordString = coordinates.toString();
  const coordArray = coordString.split(",").map((coord) => parseFloat(coord));
  const pairs = [];
  for (let i = 0; i < coordArray.length; i += 2) {
    pairs.push([coordArray[i], coordArray[i + 1]]);
  }
  return (
    <div id="coordinates-display">
      {pairs.map((coord, index) => (
        <div id="coordinate" key={index}>
          {coord[0]} {coord[1]}
        </div>
      ))}
    </div>
  );
}
