import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from "./Home";

function App() {
  return (
    <Router>
      <div className="App">
        <h1>NUS Resonance Practice Booking System</h1>
        <Switch>
          <Route path="/admin">

          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
