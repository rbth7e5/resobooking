const RESO_CAL_ID = "c_5tokio7mfc7jmv4qivgv5fdlr0@group.calendar.google.com";
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
    sendEmail(event.email);
  }
}

function sendEmail(address) {
  window.location = `mailto:${address}`;
}
