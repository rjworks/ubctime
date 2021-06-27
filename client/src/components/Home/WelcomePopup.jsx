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
        if(!show) {
            handleShow();
        }
    }, [])

    return (
        <MyModal
            show={show}
            body={["Ello there, my friend! This website was made as a personal project by a fellow student. " +
            "Keep in mind that bugs/issues are bound to happen. Thanks for stopping by!!"]}
            button="Okie :-)"
            handleClose={handleClose}
            hasFooter
        />
    );
}
