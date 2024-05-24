import React, { useRef, useEffect, useState } from 'react';
import DataFetching from './DataFetching.js';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';
const BACK_SERVER = `http://localhost:3001/api`; // change DataFetching too, todo put in config file

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [inputValue, setInputValue] = useState({label:'',x:0,y:0});
  const lng=2.33333;
  const lat=48.866669;
  const zoom=8;

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: BACK_SERVER,
      center: [lng, lat],
      zoom: zoom,
    });
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
  }, []);

  useEffect(() => {
    console.log('in', inputValue)

    if (map.current && inputValue.label && inputValue.label !== "") {
      new maplibregl.Marker({color: "#FF0000"})
        .setLngLat([inputValue.x,inputValue.y])
        .addTo(map.current);
    }

  }, [inputValue]);

  return (
    <div className="map-wrap">
      <div className="heading">
        <DataFetching inputValue={inputValue} setInputValue={setInputValue} />
      </div>
      <div ref={mapContainer} className="map" />
    </div>
  );
}
