/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-props-no-spreading */
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAdminAuthStore from "../../store/adminAuthStore";
import { baseUrl } from "../../utils/base";
import "./Login.scss";

const index = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginLoading, setLoginLoading] = useState(false);
    const [err, setErr] = useState(false);
    const navigate = useNavigate();
    const login = useAdminAuthStore((s) => s.login);
    const isLoading = loginLoading;

    /**
     * The handleSubmit function is used to handle form submission for user login, making an API call to
     * the backend and updating the state accordingly.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const inpVal = {
            email,
            password,
        };
        setLoginLoading(true);

        try {
            const res = await axios.post(`${baseUrl}/login`, inpVal);
            const { token, user } = res.data;

            if (!user || user.role !== "admin") {
                setErr(true);
                setLoginLoading(false);
                return;
            }

            login(token, user);
            navigate("/");
            setLoginLoading(false);
        } catch (error) {
            setErr(true);
            setLoginLoading(false);
        }
    };

    return (
        <div className="login_page">
            <div className="login_page_main">
                <div className="signup_page_form">
                    <h3>Admin LogIn</h3>
                    <form action="" onSubmit={handleSubmit} className="form">
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <input
                            type="submit"
                            value={isLoading ? "Loading.." : "Log In"}
                            className="submit_btn"
                            disabled={isLoading}
                        />
                        {err && (
                            <p style={{ color: 'red', marginBottom: '0px' }}>
                                Authentication failed!
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default index;
