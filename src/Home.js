import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Container } from "@material-ui/core";

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

import firebase from "firebase"


const localizer = momentLocalizer(moment);
export default function Home() {

  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState({
      name:'',
      song:'',
      email:'',
      location:'',
      start:new Date(),
      end:new Date(),
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleNameChange = (e) => {
      setData({
          name:e.target.value,
          song:data.song,
          email:data.email,
          location:data.location,
          start:data.start,
          end:data.end,
      });
  }

  const handleEmailChange = (e) => {
      setData({
          name:data.name,
          song:data.song,
          email:e.target.value,
          location:data.location,
          start:data.start,
          end:data.end,
      });
  }

  const handleSongChange = (e) => {
      setData({
          name:data.name,
          song:e.target.value,
          email:data.email,
          location:data.location,
          start:data.start,
          end:data.end,
      });
  }

  const handleLocationChange = (e,value) => {
      setData({
          name:data.name,
          song:data.song,
          email:data.email,
          location:value,
          start:data.start,
          end:data.end,
      });
  }

  const handleSubmit = (e) => {
      writeToFirebase();
      setOpen(false);
      alert("request submitted!");
  }

  const writeToFirebase = () => {
        const db = firebase.firestore();
        db
            .collection("events")
            .doc()
            .set({
                email: data.email,
                end: {dateTime: data.start},
                location: parseLocation(),
                start: {dateTime: data.end},
                summary: data.song,
            });
  }

  const parseLocation = () => {
      if(data.location=="school") return "In School";
      return "At Home";
  }

  const handleSelectSlot = ({start,end}) => {
      setData({
          name:data.name,
          song:data.song,
          email:data.email,
          location:data.location,
          start:start,
          end:end,
      });
      setOpen(true);
  };

  const parseDateTime = (date) => {
      var hour = date.getHours();
      var min = date.getMinutes();
      var meridiem = 'am';
      if(hour==0) hour=12;
      else if(hour==12) meridiem = 'pm';
      else if(hour>12) {
          hour -= 12;
          meridiem = 'pm';
      }
      var time_str = hour+":"+("0"+min).slice(-2)+meridiem;
      return time_str;
  }

  const parseDateDate = (date) => {
      var date_str = date.toDateString();
      var day = date_str.substring(0,3);
      var mmddyyyy = date_str.substring(4);
      return mmddyyyy+" ("+day+")";
  }

  return (
    <Container>
      <p>
        Please select a date and key in your desired time. Make sure it doesn't
        clash!
      </p>
      <Calendar
        localizer={localizer}
        events={[]}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 800 }}
        selectable={true}
        defaultView={'week'}
        views={['week']}
        onSelectSlot={handleSelectSlot}
      />

      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Request for timeslot</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You selected: {parseDateDate(data.start)+" "+parseDateTime(data.start)+" to "+parseDateTime(data.end)}<br />
            Please fill in your details below to submit your request
          </DialogContentText>
          <TextField
            required
            autoFocus
            margin="dense"
            id="name"
            label="Your Name"
            type="text"
            value={data.name}
            fullWidth
            onChange={handleNameChange}
          />
          <TextField
            required
            margin="dense"
            id="song"
            label="Your Group's Song"
            type="text"
            value={data.song}
            fullWidth
            onChange={handleSongChange}
          />
          <TextField
            required
            margin="dense"
            id="email"
            label="Your Email Address"
            type="email"
            value={data.email}
            fullWidth
            onChange={handleEmailChange}
          />
          <FormControl component="fieldset">
            <FormHelperText>Location</FormHelperText>
            <RadioGroup row aria-label="position" name="position" defaultValue={data.location} onChange={handleLocationChange}>
                <FormControlLabel
                  value="school"
                  control={<Radio color="primary" />}
                  label="In School"
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="home"
                  control={<Radio color="primary" />}
                  label="At Home"
                  labelPlacement="end"
                />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
