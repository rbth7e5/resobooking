import React from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";

const CLIENT_ID =
  "19685379278-cvd5n3j2j70a0ktptnnb4ug6n7kul9lj.apps.googleusercontent.com";

export default function Auth(props) {
  const { accessToken, setAccessToken } = props;
  if (accessToken) {
    return (
      <GoogleLogout
        clientId={CLIENT_ID}
        buttonText="Logout"
        onLogoutSuccess={() => setAccessToken(null)}
        onFailure={() => alert("Failed to Log out!")}
      />
    );
  } else {
    return (
      <GoogleLogin
        clientId={CLIENT_ID}
        buttonText="Login"
        onSuccess={(response) => {
          if (response.accessToken) {
            setAccessToken(response.accessToken);
          }
        }}
        isSignedIn={true}
        scope="https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events"
        onFailure={() => alert("Failed to Log in!")}
        cookiePolicy={"single_host_origin"}
        responseType="code,token"
      />
    );
  }
}
