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
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import PersonalVideoIcon from '@material-ui/icons/PersonalVideo';
import MusicVideoIcon from '@material-ui/icons/MusicVideo';
import AudiotrackIcon from '@material-ui/icons/Audiotrack';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';

import DownloadLink from "react-download-link";

const socket = socketIOClient("http://localhost:9999");

const App = (props) => {
    const [isConverting, setIsConverting] = useState(false);
    const [validUrl, setValidUrl] = useState(null);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [audioFormats, setAudioFormats] = useState([]);
    const [videoFormats, setVideoFormats] = useState([]);
    const [videoAudioFormats, setVideoAudioFormats] = useState([]);
    
    useEffect( () => {
        //Very simply connect to the socket
   
        console.log("Waiting for emit ");
        
        //Listen for data
        socket.on("progress", data => {
            // setProgress(completed => {
            //     console.log("progress: ", completed);
            //     if (completed === 100) {
            //         console.log("reset bar");
            //         return 0;
            //     }
            //    
            //     return data.progress;
            // });
           
        });

        socket.on("downloaded", data => {
            if (data.done) {
                setTimeout(() => {
                   // setProgress(0);
                 
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
            setIsConverting(false);
            console.log(data);
            setAudioFormats(data.audioOnlyFormats);
            setVideoFormats(data.videoOnlyFormats);
            setVideoAudioFormats(data.videoAudioFormats);
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
        setIsConverting(true);
       // setProgress(0);
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

    
    let audioLink = null;
    if (audioFormats.length > 0) {
        audioLink =
            <Card>
                <Link href={audioFormats[0].url} variant="body2">
                    <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                            <AudiotrackIcon/>
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {audioFormats[0].container}
                        </Typography>
                        <Typography variant="body2" component="p">
                            Audio only
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Download</Button>
                    </CardActions>
                </Link>
            </Card>
          
       
    }

    let videoLink = null;
    if (videoFormats.length > 0) {
        videoLink = <Card>
            <Link href={videoFormats[0].url} variant="body2" download>
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        <PersonalVideoIcon/>
                    </Typography>
                    <Typography variant="h5" component="h2">
                        {videoFormats[0].container}
                    </Typography>
                    <Typography variant="body2" component="p">
                        Video only
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">Download</Button>
                </CardActions>
            </Link>
        </Card>
    }
    let videoAudioLink = null;
    if (videoAudioFormats.length > 0) {
        videoAudioLink = <Card>
            <Link href={videoAudioFormats[0].url} variant="body2">
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        <MusicVideoIcon/>
                    </Typography>
                    <Typography variant="h5" component="h2">
                        {videoAudioFormats[0].container}
                    </Typography>
                    <Typography variant="body2" component="p">
                        Video/Audio
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small">Download</Button>
                </CardActions>
            </Link>
        </Card>
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
              <Grid className="formats" container spacing={6}>
                  <Grid container item xs={12} spacing={3}>
                      <Grid className="item" item xs={12}>
                          {audioLink}
                      </Grid>
                      <Grid className="item" item xs={12}>
                          {videoLink}
                      </Grid>
                      <Grid className="item" item xs={12}>
                          {videoAudioLink}
                      </Grid>

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
          <Backdrop open={isConverting} onClick={handleClose}>
              <CircularProgress color="inherit" />
          </Backdrop>
          {/*<div className="progressBar">*/}
          {/*    {progressBar}*/}
          {/*</div>*/}
     
      </div>
  );
};

export default App;
