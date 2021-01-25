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


const localizer = momentLocalizer(moment);
export default function Home() {

  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState({
      name:undefined,
      song:undefined,
      email:undefined,
      location:'school',
      date:undefined,
      start_time:undefined,
      end_time:undefined,
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
          date:data.date,
          start_time:data.start_time,
          end_time:data.end_time,
      });
  }

  const handleEmailChange = (e) => {
      setData({
          name:data.name,
          song:data.song,
          email:e.target.value,
          location:data.location,
          date:data.date,
          start_time:data.start_time,
          end_time:data.end_time,
      });
  }

  const handleSongChange = (e) => {
      setData({
          name:data.name,
          song:e.target.value,
          email:data.email,
          location:data.location,
          date:data.date,
          start_time:data.start_time,
          end_time:data.end_time,
      });
  }

  const handleLocationChange = (e,value) => {
      setData({
          name:data.name,
          song:data.song,
          email:data.email,
          location:value,
          date:data.date,
          start_time:data.start_time,
          end_time:data.end_time,
      });
  }

  const handleSubmit = (e) => {
      alert("request deets: " + data.name + " " + data.song + " " + data.email +" " +data.location+ " "+data.date+data.start_time+data.end_time);
      // TODO: submit data to database
      setOpen(false);
  }

  const handleSelectSlot = ({start,end}) => {
      var [date, start_time] = parseDate(start);
      var [end_date, end_time] = parseDate(end);
      setData({
          name:data.name,
          song:data.song,
          email:data.email,
          location:data.location,
          date:date,
          start_time:start_time,
          end_time:end_time,
      });
      setOpen(true);
  };

  const parseDate = (date) => {
      var hour = date.getHours();
      var min = date.getMinutes();
      var meridiem = 'am';
      if(hour==0) hour=12;
      else if(hour>12) {
          hour -= 12;
          meridiem = 'pm';
      }
      var date_str = date.toDateString();
      var time_str = hour+":"+("0"+min).slice(-2)+meridiem;
      return [date_str, time_str];
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
            You selected: {data.date+" "+data.start_time+" to "+data.end_time}<br />
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
