import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import {BACK_SERVER} from '../Config';

function DataFetching({stationTarget, inputValue, setInputValue}) {
  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const loading = open && options.length === 0;

  const getAddress = async (query) => {
    if (query.trim().length >= 3) {
        const response = await fetch(BACK_SERVER + '/search?q=' + query)

        if (!response.ok) throw Error('Network response was not ok');

        const local_data =  await response.json();

        if (local_data && local_data.features) {
          let input_options = []
          local_data.features.map(element => {
             input_options.push({
                  'label': element.properties.label,
                  'x': element.geometry.coordinates[0],
                  'y': element.geometry.coordinates[1]
              })
            }
          );
          setOptions(input_options);
        }
    }
  }

  return (
    <div className="search-bar">
        <div className="left_card">
          <h3>Votre adresse est le marqueur vert </h3>
          {inputValue.label && (
            <p>{inputValue.label}</p>
          )}
        </div>
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
            }
          })
        }}
        sx={{ width: 300 }}
        loading={loading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Tapez votre adresse"
            onChange={(e) => getAddress(e?.target?.value)} 
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
        <div className="right_card">
            <h3>la station est le marqueur jaune </h3>
            {!stationTarget && inputValue.label && (<CircularProgress color="inherit" size={20} />)}
            {stationTarget && (
              <p>{stationTarget.adresse[0]}</p>
            )}
        </div>

  </div>
  );
}

export default DataFetching;