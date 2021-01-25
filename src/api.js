import emailjs from "emailjs-com";
import moment from "moment";
const RESO_CAL_ID = "c_5tokio7mfc7jmv4qivgv5fdlr0@group.calendar.google.com";
emailjs.init("user_K1PTj6uuUPamMKv16fNbp");
export async function approveEvent(accessToken, event) {
  event.start.dateTime = event.start.dateTime.toDate();
  event.end.dateTime = event.end.dateTime.toDate();
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${RESO_CAL_ID}/events`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    }
  );
  if (response.ok) {
    emailjs.send("service_pjlhoib", "template_ng0dn7k", {
      from_name: "NUS Resonance Practice Booking System",
      to_name: event.name,
      message: `Your booking request has been approved for ${
        event.summary
      } from ${moment(event.start.dateTime).format(
        "Do MMM YYYY HH:mm"
      )} to ${moment(event.end.dateTime).format("Do MMM YYYY HH:mm")}`,
      to_email: "caijie96@gmail.com",
    });
  }
}
