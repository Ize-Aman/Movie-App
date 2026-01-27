import React from "react"
import LightRays from "@/components/LightRays";
import './Login.css'
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";

const Login = (props) => {
    const navigate = useNavigate();
    return (
        <div className="login-page">
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
                            <motion.button type="button"
                                whileHover={{ boxShadow: "0 2px 20px rgba(255,255,255,0.19)" }} onClick={() => navigate("/")}>
                                Login
                            </motion.button>
                            <h3 className="self-start font-semibold text-[11px]">Don't have an account? <Link to={"/register"} className="text-[#9163E2]">Register.</Link></h3>
                            <hr />
                        </form>
                    </div>

                    <div className="other-auth">
                        <h3 className="self-start font-extralight">or continue with</h3>
                        <div className="auths">
                            <motion.button type="button"
                                whileHover={{ boxShadow: "0 2px 20px rgba(255,255,255,0.19)" }}>
                                <img src="./google.svg" />
                                Google
                            </motion.button>
                            <motion.button type="button"
                                whileHover={{ boxShadow: "0 2px 20px rgba(255,255,255,0.19)" }}>
                                <img src="./facebook.svg" alt="" srcset="" />
                                Facebook
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Login;
