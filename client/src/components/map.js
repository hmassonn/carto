import React, { useRef, useEffect, useState } from 'react';
import DataFetching from './DataFetching.js';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(2.33333);
  const [lat, setLat] = useState(48.866669);
  const [zoom, setZoom] = useState(8);

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once


    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `http://localhost:3001/api`,
      center: [lng, lat],
      zoom: zoom,
    });
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    
    new maplibregl.Marker({color: "#FF0000"})
      .setLngLat([2.33333,48.866669])
      .addTo(map.current);

  }, [lng, lat, zoom]);


  return (
    <div className="map-wrap">
    <div className="heading">
    <DataFetching/>
      </div>
      <div ref={mapContainer} className="map" />
    </div>
  );
}
