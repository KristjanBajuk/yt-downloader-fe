import React from 'react';
import './App.css';
import logo from "./assets/logo.png";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';


const App = () => {
    
    const sendRequest = async (event) => {
        event.preventDefault();
      const response = await fetch("http://localhost:9999/youtube-download",{
          method: 'POST', // or 'PUT'
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({url: event.target.url.value}),
      });
     
      console.log("STATUS: ", response);    
      
      
    };
    
  return (
      <div className="container">
          <div className="mainContent">
            <img alt="logo" className="logo" src={logo}/>
            <form noValidate autoComplete="off" onSubmit={sendRequest}>
                  <TextField className="urlInput" name="url" id="standard-basic" label="URL" />
                  <Button
                      type="submit"
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
