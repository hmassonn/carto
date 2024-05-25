import React, { useRef, useEffect, useState, useCallback } from 'react';
import DataFetching from './DataFetching.js';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {BACK_SERVER, startLongitude, startLatitude, startZoom} from '../Config';

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [inputValue, setInputValue] = useState({label:'',x:0,y:0});
  const [stationTarget, setStationTarget] = useState(null);

  const getTargetStation = useCallback(async () => {

    const response = await fetch(BACK_SERVER + '/find?x='+inputValue.x+'&y='+inputValue.y)
    if (!response.ok) throw Error('Network response was not ok');
    const station =  await response.json();

    if (station && station.$) {
      setStationTarget(station);
      new maplibregl.Marker({color: "yellow"})
        .setLngLat([station.$.longitude/100000,station.$.latitude/100000])
        .addTo(map.current);
    }
  }, [inputValue.x, inputValue.y])

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `${BACK_SERVER}/api`,
      center: [startLongitude, startLatitude],
      zoom: startZoom,
    });
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
  }, []);

  useEffect(() => {
    if (map.current && inputValue.label && inputValue.label !== "") {
      new maplibregl.Marker({color: "green"})
        .setLngLat([inputValue.x,inputValue.y])
        .addTo(map.current);

      getTargetStation();
    }

  }, [inputValue, getTargetStation]);

  return (
    <div className="map-wrap">
      <div className="heading">
        <DataFetching stationTarget={stationTarget} inputValue={inputValue} setInputValue={setInputValue} />
      </div>
      <div ref={mapContainer} className="map" />
    </div>
  );
}
