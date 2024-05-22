import React, { useEffect, useState } from 'react';

function DataFetching() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setsearchQuery] = useState(null);

  useEffect(() => {
    fetch('https://api.example.com/data')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  
  const handleSub = (e) => {
    e.preventDefault();
    // Vous pouvez ajouter ici la logique pour rechercher l'emplacement spécifié
    console.log('Search for:', e);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
        <form onSubmit={handleSub}>
          <input
            className="search-bar"
            type="text"
            placeholder="tapez votre adresse"
            value={searchQuery}
            onChange={(e) => setsearchQuery(e.target.value)}
          />
          <button className="search-bar" type="submit">cherchez</button>
        </form>
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
  );
}

export default DataFetching;