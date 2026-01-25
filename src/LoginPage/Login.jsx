import React from "react"
import LightRays from "@/components/LightRays";
import './Login.css'

const Login = (props) => {
    return (
        <div>
            <div className="login-wrapper" style={{ width: '100%', height: '600px', position: 'relative' }}>
                <LightRays
                    className="rays"
                    raysOrigin="top-center"
                    raysColor="#ffffff"
                    raysSpeed={1}
                    lightSpread={0.7}
                    rayLength={1.6}
                    followMouse={true}
                    mouseInfluence={0.2}
                    noiseAmount={0}
                    distortion={0}
                    pulsating={false}
                    fadeDistance={0.8}
                    saturation={1}
                />

                <div className="overlay">
                    <h1>SIGN IN</h1>
                    <h3>It’s nice to have you here! Login now to access <span className="second-line block">your account.</span></h3>

                    <div className="email-auth">
                        <form action="">
                            <input type="email" placeholder="Email" />
                            <input type="password" placeholder="Password" name="" id="" />
                            <button type="button">Sign up</button>
                            <hr />
                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
};

export default Login;
