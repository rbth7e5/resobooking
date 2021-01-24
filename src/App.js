import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";
import Admin from "./Admin";
import firebase from "firebase";
import { FirestoreProvider } from "@react-firebase/firestore";

function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyCQsL6rko8XBsAW4jBKWuvTDsTyZeiKTH4",
    authDomain: "reso-practice-booking.firebaseapp.com",
    projectId: "reso-practice-booking",
    storageBucket: "reso-practice-booking.appspot.com",
    messagingSenderId: "19685379278",
    appId: "1:19685379278:web:4f4b8f1898eecbb134149f",
    measurementId: "G-V6MTETR6N9",
  };
  return (
    <FirestoreProvider {...firebaseConfig} firebase={firebase}>
      <Router>
        <div className="App">
          <h1>NUS Resonance Practice Booking System</h1>
          <Switch>
            <Route path="/admin">
              <Admin />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    </FirestoreProvider>
  );
}

export default App;
