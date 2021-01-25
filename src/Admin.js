import React, { useState } from "react";
import {
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemIcon,
} from "@material-ui/core";
import Auth from "./Auth";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import CancelIcon from "@material-ui/icons/Cancel";
import moment from "moment";
import { approveEvent } from "./api";
import {
  FirestoreCollection,
  FirestoreMutation,
} from "@react-firebase/firestore";

export default function Admin() {
  const [accessToken, setAccessToken] = useState(null);
  if (accessToken) {
    return (
      <Container>
        <p>
          You have been vested the power of the Reso Admin to approve bookings!
        </p>
        <p>Your access token is {accessToken}</p>
        <Auth accessToken={accessToken} setAccessToken={setAccessToken} />
        <FirestoreCollection path="/events/">
          {(doc) => {
            return doc.isLoading ? (
              "Loading"
            ) : (
              <List>
                {doc.value.map((e, i) => (
                  <FirestoreMutation
                    key={i}
                    type="set"
                    path={`/events/${doc.ids[i]}`}
                  >
                    {({ runMutation }) => {
                      return (
                        <ListItem key={e.summary}>
                          <ListItemText
                            primary={`${e.summary}`}
                            secondary={` ${moment(
                              e.start.dateTime.toDate()
                            ).format("D MMM YY HH:mm")} to ${moment(
                              e.end.dateTime.toDate()
                            ).format("D MMM YY HH:mm")} ${e.location}`}
                          />
                          {e.status ? (
                            e.status
                          ) : (
                            <ListItemIcon>
                              <IconButton
                                onClick={async () => {
                                  await runMutation({
                                    status: "rejected",
                                  });
                                  alert("Rejected booking.");
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
                                  await runMutation({
                                    status: "approved",
                                  });
                                  alert("Approved booking.");
                                }}
                              >
                                <ThumbUpIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          )}
                        </ListItem>
                      );
                    }}
                  </FirestoreMutation>
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
      <Auth accessToken={accessToken} setAccessToken={setAccessToken} />
    </Container>
  );
}
