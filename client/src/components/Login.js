import React from 'react';
import GoogleLogin from "react-google-login";
import { GoogleLogout } from 'react-google-login';

require('dotenv').config()

function Login(props) {
    return (
        <div>
            <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                isSignedIn={true}
                cookiePolicy={'single_host_origin'}
            />
            <GoogleLogout
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                buttonText="Logout"
                onLogoutSuccess={responseGoogle}
            >
            </GoogleLogout>
        </div>
    );
}

const responseGoogle = (res) => {
    console.log(res);
    console.log(res.data)
}

export default Login;