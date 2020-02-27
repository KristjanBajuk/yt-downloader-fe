import React from 'react';
import './App.css';
import logo from "./assets/logo.png";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';


function App() {
  return (
      <div className="container">
          <div className="mainContent">
            <img className="logo" src={logo}/>
            <form noValidate autoComplete="off">
                  <TextField className="urlInput" id="standard-basic" label="URL" />
                  <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<SendIcon />}
                  >
                      Send
                  </Button>
            </form>
          </div>
      </div>
  );
}

export default App;
