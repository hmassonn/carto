import React from "react";
import Navbar from './components/navbar.js';
import Map from './components/map.js';
import "./App.css";

function App() {
  // const [data, setData] = React.useState(null);

  // React.useEffect(() => {
  //   fetch("/api")
  //     .then((res) => res.json())
  //     .then((data) => setData(data.message));
  // }, []);

  return (
    <div className="App">
      <Navbar/>
      <Map/>
    </div>
  );
}

export default App;