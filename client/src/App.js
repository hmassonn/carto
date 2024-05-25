import React from "react";
import Map from './components/map.js';
import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="heading">
        <h1>trouver le carburant le moins cher</h1>
      </div>
      <Map/>
    </div>
  );
}

export default App;