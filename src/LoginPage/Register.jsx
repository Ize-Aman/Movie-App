import React from "react"
import './Register.css'
import { motion } from "motion/react";
import LightRays from "@/components/LightRays";
import { Link, useNavigate } from "react-router-dom";

const Register = (props) => {
    const navigate = useNavigate();
    return (
        <div className="register-page">
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
                    <h1>SIGN UP</h1>
                    <h3>Hello there! Register to use our site.</h3>

                    <div className="email-auth">
                        <form action="">
                            <input type="text" placeholder="Display name" />
                            <input type="email" placeholder="Email" />
                            <input type="password" placeholder="Password" name="" id="" />
                            <motion.button type="button"
                                whileHover={{ boxShadow: "0 2px 20px rgba(255,255,255,0.19)" }} onClick={() => navigate('/home')}>
                                Sign up
                            </motion.button>
                            <h3 className="self-start font-semibold text-[11px]">Already have an account? <Link to={"/"} className="text-[#9163E2]">Login.</Link></h3>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Register;
