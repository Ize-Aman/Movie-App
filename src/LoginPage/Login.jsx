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
                    fadeDistance={1}
                    saturation={1}
                />

                <div className="overlay">
                    <h1>Sup ma friend</h1>
                </div>
            </div>
        </div>
    )
};

export default Login;
