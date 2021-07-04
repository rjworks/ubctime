import Home from "./components/Home/Home";
import React from 'react';
import './styles.css';
const App = () => (
    window.innerWidth <= 760 ? <div>Sorry, this website is currently only supported on larger screens.
        Check back later for updates!</div> :
        <Home/>
);

export default App;