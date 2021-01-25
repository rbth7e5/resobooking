import React, { useState } from "react";
import {
  Button,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import Auth from "./Auth";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import CancelIcon from "@material-ui/icons/Cancel";
import moment from "moment";
import { approveEvent } from "./api";
import { FirestoreCollection } from "@react-firebase/firestore";
import firebase from "firebase";

export default function Admin() {
  const [accessToken, setAccessToken] = useState(null);

  const updateStore = (id, data) => {
    const db = firebase.firestore();
    db.collection("events").doc(id).update(data);
  };

  if (accessToken) {
    return (
      <Container>
        <p>
          You have been vested the power of the Reso Admin to approve bookings!
        </p>
        <Button component={Link} to="/">
          Booking Page
        </Button>
        <Auth accessToken={accessToken} setAccessToken={setAccessToken} />
        <FirestoreCollection path="/events/">
          {(doc) => {
            return doc.isLoading ? (
              "Loading"
            ) : (
              <List>
                {doc.value.map((e, i) => (
                  <ListItem key={i}>
                    <ListItemText
                      primary={`Song: ${e.summary} Name: ${e.name} Email: ${e.email}`}
                      secondary={` ${moment(e.start.dateTime.toDate()).format(
                        "D MMM YY HH:mm"
                      )} to ${moment(e.end.dateTime.toDate()).format(
                        "D MMM YY HH:mm"
                      )} ${e.location}`}
                    />
                    {e.status ? (
                      e.status
                    ) : (
                      <ListItemIcon>
                        <IconButton
                          onClick={() => {
                            updateStore(doc.ids[i], {
                              status: "rejected",
                            });
                          }}
                        >
                          <CancelIcon />
                        </IconButton>
                      </ListItemIcon>
                    )}
                    {e.status ? null : (
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={async () => {
                            await approveEvent(accessToken, e);
                            updateStore(doc.ids[i], {
                              status: "approved",
                            });
                          }}
                        >
                          <ThumbUpIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                ))}
              </List>
            );
          }}
        </FirestoreCollection>
      </Container>
    );
  }
  return (
    <Container>
      <p>Please Login with a Resonance Admin Account!</p>
      <p>
        Please also enable third party cookies in your browser if not the login
        will fail :(
      </p>
      <Auth accessToken={accessToken} setAccessToken={setAccessToken} />
    </Container>
  );
}
