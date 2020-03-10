import React, {useEffect, useState} from 'react';
import './App.css';
import logo from "./assets/logo.png";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import socketIOClient from "socket.io-client";
import SendIcon from '@material-ui/icons/Send';
import LinearProgress from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Snackbar from '@material-ui/core/Snackbar';

const socket = socketIOClient("http://localhost:9999");

const App = (props) => {
    const [progress, setProgress] = useState(0);
    const [validUrl, setValidUrl] = useState(null);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [videoInformation, setVideoInformation] = useState([]);
    
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
            clearMessages();
            if (data.valid) {
                setValidUrl(data.url);
                setSuccessMsg("URL is valid");
                
            } else {
                setValidUrl(data.url);
                setErrorMsg("URL is invalid!");
            }
        });

        socket.on("videoInfo", data => {
            console.log("info: ", data);
            setVideoInformation(data);
        });

        socket.on("onmessage", video => {
            console.log("VIDEO DATA: ", video);
        });
        
    }, []);
    
    const downloadVideo = (options) => {

        socket.emit("download", {url: validUrl, options});
    };
    
    const clearMessages = () => {
        setErrorMsg("");
        setSuccessMsg("");
    };
    
    const convert = (event) => {
        event.preventDefault();
        clearMessages();
        setProgress(0);
        socket.emit("convert", {url: event.target.url.value});
    };
    
    const validateUrl = (event) => {
        if (event.target.value.length > 0) {
            socket.emit("video_url", {url: event.target.value});    
        } else {
            clearMessages();
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSuccessMsg("");
        setErrorMsg("");
    };


    let progressBar = null;
    if (progress !== 0) {
        progressBar = [<span>Downloading...</span>, <LinearProgress variant="determinate" value={progress} />]; 
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
            <form noValidate autoComplete="off" onSubmit={convert}>
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
              <Grid className="formats" container spacing={1}>
                  <Grid container item xs={12} spacing={3}>
                      {
                          videoInformation.map(item => (
                              <Grid item xs={4}>
                                  <Link href={item.url}  variant="body2" >{item.container + ": " + item.qualityLabel }</Link>
                              </Grid>
                          ))
                      }
                  </Grid>
              </Grid>
          </div>
          <Snackbar open={successMsg.length > 0} autoHideDuration={4000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="success">
                  {successMsg}
              </Alert>
          </Snackbar>
          <Snackbar open={errorMsg.length > 0} autoHideDuration={4000} onClose={handleClose} >
              <Alert onClose={handleClose} severity="error">
                  {errorMsg}
              </Alert>
          </Snackbar>
          <div className="progressBar">
              {progressBar}
          </div>
     
      </div>
  );
};

export default App;
