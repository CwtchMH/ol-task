// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck aaaa
import { useEffect, useMemo, useRef, useState } from "react";
import VectorLayer from "ol/layer/Vector";
import { Map, View } from "ol";
import "../styles/MapWrapper.css";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import feature from "./data.json";
import { Circle, Fill, RegularShape, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";
import { Coordinate } from "ol/coordinate";
import { Color } from "ol/color";
import { MultiPoint, MultiPolygon, Point } from "ol/geom";
import { isEqual } from "lodash";
import { FeatureLike } from "ol/Feature";
import Modify, { Options } from 'ol/interaction/Modify';
import Translate from 'ol/interaction/Translate';
import { DragZoom, Snap, defaults } from 'ol/interaction';
console.log("🚀 ~ feature:", feature);

const distance = (
  targetCoordinate: Coordinate,
  originCoordinate: Coordinate
): { x: number; y: number } => {
  const distanceX = targetCoordinate[0] - originCoordinate[0];
  const distanceY = targetCoordinate[1] - originCoordinate[1];
  return { x: distanceX, y: distanceY };
};

const calcAngleRad = (
  targetCoordinate: Coordinate,
  originCoordinate: Coordinate
): number => {
  if (isEqual(targetCoordinate, originCoordinate))
    throw new Error("targetCoordinateとoriginCoordinateが同じ座標です。");

  const { x, y } = distance(targetCoordinate, originCoordinate);
  const angle = Math.atan2(y, x);
  const NINETY_DEG_IN_RAD = 1.5707963267948966;
  // Math.atan2は東(+x座標)を始点とするため、Math.atan2の結果に90°（NINETY_DEG_IN_RAD）加算する。
  // 注：Math.atan2の計算結果はx座標を起点に正の数が反時計回り、負の数が時計回り。
  // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2
  return NINETY_DEG_IN_RAD - angle;
};

const getVertexStyles = (
  currentCoordinate: Coordinate,
  prevCoordinate: Coordinate
): Style[] => {
  // currentCoordinateとprevCoordinateが同座標の時、calcAngleRadでエラーになる。
  // その場合styleは追加しない。
  try {
    const rotation = calcAngleRad(currentCoordinate, prevCoordinate);
    // console.log("🚀 ~ prevCoordinate:", prevCoordinate)
    // console.log("🚀 ~ currentCoordinate:", currentCoordinate)
    const vertex = new RegularShape({
      points: 4,
      radius: Math.sqrt(2) * 4,
      radius2: 0,
      stroke: new Stroke({ color: "#007bff", width: 1 }),
      fill: new Fill({ color: "#007bff" }),
      angle: Math.PI / 4,
      rotation,
      rotateWithView: true,
    });
    const style = new Style({
      geometry: new Point(currentCoordinate),
      image: vertex,
    });
    return [style];
  } catch (e) {
    return [];
  }
};

const vectorLayerStyle = new Style({
  fill: new Fill({
    color: "rgba(0, 123, 255, 0.5)", // Màu fill trong suốt
  }),
  stroke: new Stroke({
    color: "red", // Màu viền
    width: 2, // Độ rộng viền
  }),
  image: new CircleStyle({
    radius: 6, // Kích thước điểm
    fill: new Fill({ color: '#007bff' }),
    stroke: new Stroke({ color: '#ffffff', width: 1 }),
  }),
});

export const MapWrapper = () => {
  const vectorSource = useMemo(() => {
    const features = new GeoJSON().readFeatures({
      type: "FeatureCollection",
      features: [feature],
    });
    // console.log("🚀 ~ useEffect ~ features:", features);
    const source = new VectorSource();
    source.addFeatures(features);

    return source;
  }, []);

  useEffect(() => {}, [vectorSource]);

  const style = useMemo(() => {
    return (feature: FeatureLike) => {
      const DD= 100
            const CC  = Math.PI / 2
      const styles: Style[] = [vectorLayerStyle];
      const geometry = feature.getGeometry();
      if (geometry instanceof MultiPolygon) {
        const coordinatesArray = geometry.getCoordinates() as Coordinate[][][];
        const b = coordinatesArray[0].reduce((x, y) => {
          return y.reduce((m,n, index )=> {
            if (index === 0) return m;

            const prevCoordinate = y[index - 1];
            const rotation = calcAngleRad(n, prevCoordinate);
            
            const fixedRotation = Math.round(((rotation % CC ) ) / (CC) * DD ) / DD
            return {
              ...m,
              [fixedRotation]: [...(m[fixedRotation] ?? []), n]
            }
          }, x)
        },{})
        // console.log("b", b);
        const a = Object.keys(b).map(k => {
          // console.log('(Math.PI / 2) * Number(k)', (CC) * Number(k), k);
          const  vertex = new RegularShape({
            points: 4,
            radius: Math.sqrt(2) * 4,
            radius2: 0,
            stroke: new Stroke({ color: "#007bff", width: 1 }),
            fill: new Fill({ color: "#007bff" }),
            angle: Math.PI / 4,
            rotation: CC * (k),
            rotateWithView: true,
          });
          const style = new Style({
            geometry: new MultiPoint(b[k]),
            image: vertex,
          });
          return style
        })
        
        // const a = coordinatesArray[0].map((coordinates: Coordinate[]) => {
        //   // 頂点のスタイル群。最初の座標以外を抽出するためにflatMapを使用
        //   const vertexStyles = coordinates.flatMap(
        //     (currentCoordinate: Coordinate, index: number) => {
        //       // console.log("🚀 ~ coordinatesArray.forEach ~ currentCoordinate:", currentCoordinate)
        //       if (index === 0) return [];

        //       const prevCoordinate = coordinates[index - 1];
        //       const rotation = calcAngleRad(currentCoordinate, prevCoordinate);
        //       return getVertexStyles(currentCoordinate, prevCoordinate);
        //     }
        //   );

        //   // const vertexAndStrokeStyle = [...vertexStyles];
        //   // styles.push(...vertexAndStrokeStyle);
        //   return vertexStyles;
        // });
        // console.log("🚀 ~ coordinatesArray.forEach ~ styles:", styles)
        // console.log(a.flat(1).length);
        
        return [...styles, ...a];
      }
      return styles;
    };
  }, []);

  const vectorLayer = useMemo(() => {
    return new VectorLayer({ source: vectorSource, zIndex: 10, style: style });
  }, [vectorSource, style]);


  const mapElement = useRef<HTMLDivElement | null>(null);
  const map = useMemo(
    () =>
      new Map({
        // view: new View({
        //   extent: [122, 19, 155, 50],
        //   constrainOnlyCenter: true,
        //   smoothExtentConstraint: false,
        //   minZoom: 5.5,
        // }),
        view: new View({
          // extent: [122, 19, 155, 50],
          constrainOnlyCenter: true,
          smoothExtentConstraint: false,
          minZoom: 2,
          projection: "EPSG:4326",
          center: [127.69544124603271, 26.183493293701172],
          zoom: 20,
        }),
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          vectorLayer,
        ],
        // overlays: [],
        // controls: [],
        interactions: [
          ...defaults({
            altShiftDragRotate: false,
            keyboard: false,
            doubleClickZoom: false,
            shiftDragZoom: false,
          }).getArray(),
          // new Snap(),
          // new Snap(),
        ],
      }),
    [vectorLayer]
  );

  useEffect(() => {
    if (!mapElement.current) return;

    console.log(map.getInteractions().getArray());
    
    map.setTarget(mapElement.current);
    return () => map.setTarget(undefined);
  });

  const modify = useMemo(() => {
    return new Modify({source: vectorSource ?? undefined, style})
  },[style, vectorSource])

  useEffect(() => {
    map.addInteraction(modify)
    return () => {
      map.removeInteraction(modify)
    }
  },[map, modify])

  return (
    <div>
      <div ref={mapElement} id="map"></div>
    </div>
  );
};

export default MapWrapper;
