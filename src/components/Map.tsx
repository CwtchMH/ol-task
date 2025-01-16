import React, { useEffect, useRef } from 'react'
import Draw from 'ol/interaction/Draw'
import Modify from 'ol/interaction/Modify'
import Snap from 'ol/interaction/Snap'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import { Vector as VectorSource } from 'ol/source.js'
import { Style, Stroke, Fill, Circle as CircleStyle } from 'ol/style'
import { Vector as VectorLayer } from 'ol/layer.js'
import { Type } from 'ol/geom/Geometry'
import { get } from 'ol/proj.js'

const MapComponent = ({ type }: { type: string }) => {
  const mapRef = useRef<HTMLDivElement | null>(null) // Reference for the map container
  const mapInstance = useRef<Map | null>(null) // Reference to store the map instance
  const sourceRef = useRef<VectorSource | null>(null) // Reference to store the source instance
  const drawRef = useRef<Draw | null>(null) // Reference to store the draw instance
  const featureLayerRef = useRef<VectorLayer | null>(null) // Reference to store the feature layer instance
  const modifyRef = useRef<Modify | null>(null) // Reference to store the modify instance
  const snapRef = useRef<Snap | null>(null) // Reference to store the snap instance

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      const raster = new TileLayer({
        source: new OSM()
      })

      const source = new VectorSource({ wrapX: false })

      const vector = new VectorLayer({
        source: source
      })

      sourceRef.current = source

      // const projection = get('EPSG:3857')
      // const extent = projection ? projection.getExtent().slice() : [0, 0, 0, 0]
      // extent[0] += extent[0]
      // extent[2] += extent[2]

      mapInstance.current = new Map({
        target: mapRef.current,
        layers: [raster, vector],
        view: new View({
          center: [0, 0],
          zoom: 2,
          //extent
        })
      })

      modifyRef.current = new Modify({ source: source })
      mapInstance.current.addInteraction(modifyRef.current)

      featureLayerRef.current = new VectorLayer({
        source: new VectorSource(),
        map: mapInstance.current,
        style: new Style({
          stroke: new Stroke({
            color: 'blue', // Viền màu xanh
            width: 3 // Độ rộng viền
          }),
          fill: new Fill({
            color: 'rgba(0, 255, 0, 0.3)' // Màu fill xanh lá với độ mờ
          }),
          image: new CircleStyle({
            radius: 5, // Bán kính đỉnh
            fill: new Fill({
              color: 'red' // Màu đỉnh
            }),
            stroke: new Stroke({
              color: 'black', // Viền của đỉnh
              width: 2 // Độ rộng viền của đỉnh
            })
          })
        })
      })

      const draw = new Draw({
        source: source,
        type: type as Type
      })

      draw.on('drawend', (event) => {
        const feature = event.feature
        if (featureLayerRef.current) {
          featureLayerRef.current?.getSource()?.addFeature(feature)
        }
        const geometry = feature.getGeometry()
        const coordinates = geometry?.getCoordinates();
        console.log(coordinates)
        console.log(feature);
      })

      drawRef.current = draw

      mapInstance.current.addInteraction(draw)
      snapRef.current = new Snap({ source: source })
      mapInstance.current.addInteraction(snapRef.current)
    }

    if (mapInstance.current && sourceRef.current) {
      mapInstance.current.removeInteraction(drawRef.current as Draw)
      mapInstance.current.removeInteraction(snapRef.current as Snap)

      if (type !== 'None') {
        const draw = new Draw({
          source: sourceRef.current,
          type: type as Type
        })

        draw.on('drawend', (event) => {
          const feature = event.feature
          if (featureLayerRef.current) {
            featureLayerRef.current?.getSource()?.addFeature(feature)
          }
          const geometry = feature.getGeometry()
          const coordinates = geometry?.getCoordinates();
          console.log(coordinates)
          console.log(feature)
        })

        drawRef.current = draw

        mapInstance.current.addInteraction(draw)
        snapRef.current = new Snap({ source: sourceRef.current })
        mapInstance.current.addInteraction(snapRef.current)
      }
    }
  }, [type])

  return <div id="map" ref={mapRef} />
}

export default MapComponent
