import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="not-found-page">
            <div className="not-found-wrapper">
                <div className="drunk">
                    <h1>
                        Go Home , <br />
                        <span className="block">You're Drunk!</span>
                    </h1>

                    <button
                        onClick={() => navigate("/")}
                        className="bg-[#92E3A9] text-white px-6 py-3 rounded-full mt-8 cursor-pointer"
                        type="button"
                    >
                        Back To Home
                    </button>
                </div>

                <div className="img-div">
                    <img src="/NotFoundImg.png" alt="404" />
                </div>
            </div>
        </div>
    );
};

export default NotFound;
