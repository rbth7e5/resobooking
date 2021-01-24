import React from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {Container} from "@material-ui/core";

const localizer = momentLocalizer(moment);
export default function Home() {
  return (
    <Container>
      <p>
        Please select a date and key in your desired time. Make sure it doesn't clash!
      </p>
      <Calendar
        localizer={localizer}
        events={[]}
        startAccessor="start"
        endAccessor="end"
        style={{height: 800}}
        selectable={true}
        defaultView={'week'}
        views={['week']}
      />
    </Container>
  )
}