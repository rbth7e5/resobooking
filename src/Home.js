import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Container } from "@material-ui/core";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";

import firebase from "firebase";
import { FirestoreCollection } from "@react-firebase/firestore";
import { Link } from "react-router-dom";

const localizer = momentLocalizer(moment);
export default function Home() {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState({
    name: "",
    song: "",
    email: "",
    location: "",
    start: new Date(),
    end: new Date(),
    recur: false,
    num_weeks: "",
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleNameChange = (e) => {
    setData({
      name: e.target.value,
      song: data.song,
      email: data.email,
      location: data.location,
      start: data.start,
      end: data.end,
      recur: data.recur,
      num_weeks: data.num_weeks,
    });
  };

  const handleEmailChange = (e) => {
    setData({
      name: data.name,
      song: data.song,
      email: e.target.value,
      location: data.location,
      start: data.start,
      end: data.end,
      recur: data.recur,
      num_weeks: data.num_weeks,
    });
  };

  const handleSongChange = (e) => {
    setData({
      name: data.name,
      song: e.target.value,
      email: data.email,
      location: data.location,
      start: data.start,
      end: data.end,
      recur: data.recur,
      num_weeks: data.num_weeks,
    });
  };

  const handleLocationChange = (e, value) => {
    setData({
      name: data.name,
      song: data.song,
      email: data.email,
      location: value,
      start: data.start,
      end: data.end,
      recur: data.recur,
      num_weeks: data.num_weeks,
    });
  };

  const handleRecurChange = (e) => {
    setData({
      name: data.name,
      song: data.song,
      email: data.email,
      location: data.location,
      start: data.start,
      end: data.end,
      recur: !data.recur,
      num_weeks: data.num_weeks,
    });
  };

  const handleWeekChange = (e) => {
    setData({
      name: data.name,
      song: data.song,
      email: data.email,
      location: data.location,
      start: data.start,
      end: data.end,
      recur: data.recur,
      num_weeks: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (
      data.name === "" ||
      data.song === "" ||
      data.email === "" ||
      data.location === ""
    ) {
      alert("please fill in all fields");
      return;
    }
    if (!data.email.includes("@")) {
      alert("please enter valid email");
      return;
    }
    if (data.recur) {
      if (data.num_weeks === "") {
        alert("please enter number of weeks or uncheck recurring");
        return;
      } else if (isNaN(parseInt(data.num_weeks))) {
        alert("please enter a number for number of weeks");
        return;
      }
    }

    writeToFirebase();
    setOpen(false);
    alert("request submitted!");
  };

  const writeToFirebase = () => {
    const num_weeks = data.recur ? parseInt(data.num_weeks) : 1;
    const db = firebase.firestore();
    for (var i = 0; i < num_weeks; i++) {
      db.collection("events")
        .doc()
        .set({
          name: data.name,
          email: data.email,
          start: {
            dateTime: moment(data.start)
              .add(7 * i, "days")
              .toDate(),
          },
          end: {
            dateTime: moment(data.end)
              .add(7 * i, "days")
              .toDate(),
          },
          location: parseLocation(),
          summary: data.song,
          recur: data.recur,
          num_weeks: data.recur ? parseInt(data.num_weeks) : null,
        });
    }
  };

  const parseLocation = () => {
    if (data.location === "school") return "In School";
    return "At Home";
  };

  const handleSelectSlot = ({ start, end }) => {
    setData({
      name: data.name,
      song: data.song,
      email: data.email,
      location: data.location,
      start: start,
      end: end,
      recur: data.recur,
      num_weeks: data.num_weeks,
    });
    setOpen(true);
  };

  const parseDateTime = (date) => {
    let hour = date.getHours();
    let min = date.getMinutes();
    let meridian = "am";
    if (hour === 0) hour = 12;
    else if (hour === 12) meridian = "pm";
    else if (hour > 12) {
      hour -= 12;
      meridian = "pm";
    }
    return hour + ":" + ("0" + min).slice(-2) + meridian;
  };

  const parseDateDate = (date) => {
    const date_str = date.toDateString();
    const day = date_str.substring(0, 3);
    const mmddyyyy = date_str.substring(4);
    return mmddyyyy + " (" + day + ")";
  };

  const recur_field = data.recur ? (
    <TextField
      required
      margin="dense"
      id="num_weeks"
      label="How many weeks (including current selection)?"
      type="text"
      value={data.num_weeks}
      fullWidth
      onChange={handleWeekChange}
    />
  ) : null;

  const view = window.innerWidth < 800 ? "day" : "week";
  return (
    <Container>
      <p>
        Please select your desired timeslot by dragging on the calendar (On
        mobile, tap and hold before dragging). If you are planning to practise
        in school, make sure your slot doesn't clash with other slots that are
        also in school! Max 2 hours pls don't be greedy.
      </p>
      <Button component={Link} to="/admin">
        Admin Access
      </Button>
      <FirestoreCollection path="/events/">
        {(d) => {
          return d.isLoading ? (
            "Loading"
          ) : (
            <Calendar
              localizer={localizer}
              events={d.value
                .filter((e) => e.status !== "rejected")
                .map((e) => ({
                  title: `${e.summary} (${e.location}) ${
                    e.status ? "(Approved)" : "(Pending)"
                  }`,
                  start: e.start.dateTime.toDate(),
                  end: e.end.dateTime.toDate(),
                }))}
              startAccessor="start"
              endAccessor="end"
              style={{ marginBottom: 32 }}
              selectable={true}
              defaultView={view}
              views={[view]}
              onSelectSlot={handleSelectSlot}
            />
          );
        }}
      </FirestoreCollection>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Request for timeslot</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You selected:{" "}
            {parseDateDate(data.start) +
              " " +
              parseDateTime(data.start) +
              " to " +
              parseDateTime(data.end)}
            <br />
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
            <RadioGroup
              row
              aria-label="position"
              name="position"
              defaultValue={data.location}
              onChange={handleLocationChange}
            >
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
            <FormControlLabel
              value="recur"
              checked={data.recur}
              control={<Checkbox color="primary" />}
              label="Recurring Practices?"
              labelPlacement="end"
              onChange={handleRecurChange}
            />
          </FormControl>
          {recur_field}
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
