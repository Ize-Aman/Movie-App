import React, { useState, useEffect } from "react"
import './Register.css';
import { ThreeDot } from "react-loading-indicators";
import { motion } from "motion/react";
import LightRays from "@/components/LightRays";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { doCreateUserWithEmailAndPassword, doSignInWithEmailAndPassword, doSignInWithGoogle } from "@/firebase/auth";
import { useAuth } from "@/contexts/authContext";

const Register = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { userLoggedIn } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();

        if (isRegistering) return;
        setIsRegistering(true);
        setErrorMessage('');
        try {
            await doCreateUserWithEmailAndPassword(email, password);
            navigate('/home');
        } catch (err) {
            setErrorMessage(err.message || 'Registration failed');
            setIsRegistering(false);
        }
    }

    return (
        <div className="register-page">
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
                    <h1>SIGN UP</h1>
                    <h3>Hello there! Register to use our site.</h3>

                    <div className="email-auth">
                        <form onSubmit={onSubmit}>
                            <input type="text" placeholder="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                            <input type="email" placeholder="Email *" required value={email} onChange={(e) => setEmail(e.target.value)} />
                            <input type="password" placeholder="Password *" required value={password} onChange={(e) => setPassword(e.target.value)} />
                            <motion.button type="submit"
                                whileHover={{ boxShadow: "0 2px 20px rgba(255,255,255,0.19)" }}>
                                {isRegistering ? <ThreeDot variant="pulsate" color="#9abee1dd" size="small" text="" textColor="" /> : 'Sign up'}
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
