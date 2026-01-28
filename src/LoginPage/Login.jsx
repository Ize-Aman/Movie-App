import React, { useState, useEffect } from "react"
import LightRays from "@/components/LightRays";
import './Login.css'
import { ThreeDot } from "react-loading-indicators";
import { motion } from "motion/react";
import { Link, Navigate, replace, useNavigate } from "react-router-dom";
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "@/firebase/auth";
import { useAuth } from "@/contexts/authContext";

const Login = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { userLoggedIn } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!isSigningIn) {
            setIsSigningIn(true);
            try {
                await doSignInWithEmailAndPassword(email, password);
            }
            catch (e) {
                setErrorMessage(e.message);
                setIsSigningIn(false)
            }
        }
    }

    const onGoogleSignIn = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            try {
                await doSignInWithGoogle();
                navigate('/home');
            } catch (err) {
                setIsSigningIn(false);
                setErrorMessage(err.message || 'Sign in failed');
            }
        }
    }

    return (
        <div className="login-page">
            {userLoggedIn && (<Navigate to={'/home'} replace={true} />)}
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

                    <p className={`m-0 mt-2 p-0 text-[12px] text-red-500 
                        ${errorMessage === 'Firebase: Error (auth/invalid-credential).' ? 'block' : 'hidden'}`}>
                        An error occured, please check your email and password
                    </p>


                    <div className="email-auth">
                        <form onSubmit={onSubmit}>
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <motion.button type="submit"
                                whileHover={{ boxShadow: "0 2px 20px rgba(255,255,255,0.25)" }}>
                                {isSigningIn && !errorMessage ? <ThreeDot variant="pulsate" color="#9abee1dd" size="small" text="" textColor="" /> : 'Login'}
                            </motion.button>
                            <h3 className="self-start font-semibold text-[11px]">Don't have an account? <Link to={"/register"} className="text-[#9163E2]">Register.</Link></h3>
                            <hr />
                        </form>
                    </div>

                    <div className="other-auth">
                        <h3 className="self-start font-extralight">or continue with</h3>
                        <div className="auths">
                            <motion.button type="submit"
                                whileHover={{ boxShadow: "0 2px 20px rgba(255,255,255,0.25)" }} onClick={onGoogleSignIn}>
                                <img src="./google.svg" />
                                Google
                            </motion.button>
                            <motion.button type="button"
                                whileHover={{ boxShadow: "0 2px 20px rgba(255,255,255,0.25)" }}>
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
