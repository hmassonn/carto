import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

function DataFetching() {
  const [options, setOptions] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const loading = open && options.length === 0;

  function handleSubmit () {};

  function fetching (query) {
    if (query.trim().length >= 3) {
      console.log('ici', query)
      fetch('http://localhost:3001/search?q='+query)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(local_data => {
        let input_options = []
        console.log('local_data', local_data)
        local_data.features.forEach(element => {
          input_options.push({'label': element.properties.label})
          // input_options.push({'label': element.properties.city+" "+element.properties.context})
        });
        setOptions(input_options);
      })
      .catch(error => {
        setError(error);
      });
    }
  };

  function changeInput (input) {
    console.log('opt', options)
    fetching(input);
  };

  if (error) return <div>Error: {error.message}</div>;
  // if (error) return <div>Error: problème inconnu, veuillez recharger la page</div>;

  return (
    <div className="search-bar">
        {/* <form onSubmit={handleSubmit}>
          <input
            className="search-bar"
            type="text"
            placeholder="tapez votre adresse"
            value={searchQuery}
            onChange={(e) => changeInput(e?.target?.value)}
          />
          <button className="search-bar" type="submit">cherchez</button>
        </form> */}
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        open={open}
        onOpen={() => { setOpen(true); }}
        onClose={() => { setOpen(false); }}
        options={options}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
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
      {inputValue && (
        <div>
          <h3>Vous avez sélectionné :</h3>
          <p>{inputValue}</p>
        </div>
      )}
  </div>
  );
}

export default DataFetching;