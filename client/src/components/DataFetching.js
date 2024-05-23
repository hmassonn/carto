import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

function DataFetching({inputValue, setInputValue}) {
  const [options, setOptions] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const loading = open && options.length === 0;

  function fetching (query) {
    if (query.trim().length >= 3) {
      fetch('http://localhost:3001/search?q='+query)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(local_data => {
        let input_options = []
        local_data.features.forEach(element => {
          input_options.push({'label': element.properties.label, 'x': element.geometry.coordinates[0], 'y': element.geometry.coordinates[1]})
        });
        setOptions(input_options);
      })
      .catch(error => {
        setError(error);
      });
    }
  };

  function changeInput (input) {
    fetching(input);
  };

  if (error) return <div>Error: {error.message}</div>;
  // if (error) return <div>Error: problème inconnu, veuillez recharger la page</div>;

  console.log('data', inputValue)

  return (
    <div className="search-bar">
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        open={open}
        onOpen={() => { setOpen(true); }}
        onClose={() => { setOpen(false); }}
        options={options}
        onInputChange={(event, newInputValue) => {
          options.forEach((opt)=>{
            if (opt.label.localeCompare(newInputValue) === 0){
              setInputValue({label: newInputValue, x: opt.x, y: opt.y});
              console.log('for', inputValue, newInputValue, opt)
            }
          })
        }}
        sx={{ width: 300 }}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Tapez votre adresse"
            onChange={(e) => changeInput(e?.target?.value)} 
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      {inputValue.label && (
        <div>
          <h3>Vous avez sélectionné :</h3>
          <p>{inputValue.label}</p>
        </div>
      )}
  </div>
  );
}

export default DataFetching;