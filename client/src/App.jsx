import Home from "./components/Home/Home";
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './styles.css';

const App = () => (
    <div>
            {window.innerWidth <= 760 ? <div>Sorry, this website is currently only supported on larger screens.
                    Check back later for updates!</div> : <Home/>}
            <Router>
                    <Switch>
                            <Route exact
                                   path="/api"
                                   render={() =>
                                       (window.location = "https://github.com/cupof2/ubctime-api")}
                            />
                    </Switch>
            </Router>
    </div>
);

export default App;