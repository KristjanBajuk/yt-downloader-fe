import React, {useEffect, useState} from 'react';
import './App.css';
import logo from "./assets/logo.png";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import socketIOClient from "socket.io-client";
import SendIcon from '@material-ui/icons/Send';
import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';

const socket = socketIOClient("http://localhost:9999");

const App = (props) => {
    const [progress, setProgress] = useState(0);
    const [validUrl, setValidUrl] = useState(null);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    
    useEffect( () => {
        //Very simply connect to the socket
   
        console.log("Waiting for emit ");
        
        //Listen for data
        socket.on("progress", data => {
            setProgress(completed => {
                console.log("progress: ", completed);
                if (completed === 100) {
                    console.log("reset bar");
                    return 0;
                }
                
                return data.progress;
            });
           
        });

        socket.on("downloaded", data => {
            if (data.done) {
                setTimeout(() => {
                    setProgress(0);
                }, 500)
            }
        });

        socket.on("validateUrl", data => {
            setErrorMsg("");
            setSuccessMsg("");
            if (data.valid) {
                setValidUrl(data.url);
                setSuccessMsg("URL is valid");
                
            } else {
                setValidUrl(data.url);
                setErrorMsg("URL is invalid!");
            }
        });
        
    }, []);
    
    const sendRequest = (event) => {
        event.preventDefault();
        setProgress(0);
        socket.emit("video_url", {url: event.target.url.value});
    };
    
    const validateUrl = (event) => {
        console.log("validate url");
       
        socket.emit("video_url", {url: event.target.value});
    };


    let progressBar = null;
    if (progress !== 0) {
        progressBar = <LinearProgress variant="determinate" value={progress} />; 
    }

    let message = null;
    if (successMsg.length > 0) {
        message = <Alert severity="success">{successMsg}</Alert>;
    }
    if (errorMsg.length > 0) {
        message = <Alert severity="error">{errorMsg}</Alert>;
    }

        
   
    
  return (
      <div className="container">
          <div className="mainContent">
            <img alt="logo" className="logo" src={logo}/>
            <form noValidate autoComplete="off" onSubmit={sendRequest}>
                  <TextField className="urlInput" name="url" onBlur={validateUrl} id="standard-basic" label="URL" />
                  <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={!validUrl}
                      startIcon={<SendIcon />}
                  >
                      Convert
                  </Button>
            </form>
          </div>
          <div className="message">
              {message}    
          </div>
          <div className="progressBar">
              {progressBar}
          </div>
        
      </div>
  );
};

export default App;
