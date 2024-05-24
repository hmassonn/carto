import React, { useRef, useEffect, useState } from 'react';
import DataFetching from './DataFetching.js';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';
const BACK_SERVER = "http://localhost:3001"; // change DataFetching too, todo put in config file

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [inputValue, setInputValue] = useState({label:'',x:0,y:0});
  const [stationTarget, setStationTarget] = useState(null);
  const lng=2.33333;
  const lat=48.866669;
  const zoom=8;

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `${BACK_SERVER}/api`,
      center: [lng, lat],
      zoom: zoom,
    });
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
  }, []);

  useEffect(() => {
    if (map.current && inputValue.label && inputValue.label !== "") {
      new maplibregl.Marker({color: "green"})
        .setLngLat([inputValue.x,inputValue.y])
        .addTo(map.current);

      fetch(BACK_SERVER + '/find?x='+inputValue.x+'&y='+inputValue.y)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          response.json().then((station) => {
            if (station && station.$) {
              setStationTarget(station);
              new maplibregl.Marker({color: "yellow"})
              .setLngLat([station.$.longitude/100000,station.$.latitude/100000])
              .addTo(map.current);
            }
          });
        })
    }

  }, [inputValue]);

  return (
    <div className="map-wrap">
      <div className="heading">
        <DataFetching stationTarget={stationTarget} inputValue={inputValue} setInputValue={setInputValue} />
      </div>
      <div ref={mapContainer} className="map" />
    </div>
  );
}
