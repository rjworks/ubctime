/* This example requires Tailwind CSS v2.0+ */
import React, {useEffect, useState} from 'react';
// import '../../index.css';
import MyModal from "../Modal/MyModal";

// let showed = false;
export default function WelcomePopup() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    useEffect(() => {
        handleShow();
    }, [])

    return (
        <MyModal
            show={show}
            body={["NEWS: This project is now archieved. Thanks for stopping by!!"]}
            // body={["Hi der my name jeff and i dab 10 times a day and the night is kind of dark it's almost like the sun" +
            // " is down and freezing cold but we already know that"]}
            button="Okie :-)"
            handleClose={handleClose}
            hasFooter
        />
    );
}
