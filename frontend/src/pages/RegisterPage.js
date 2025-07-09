import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../styles/RegisterPage.css'; // Adjust path if needed

const RegisterPage = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/register`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', data.token);
            navigate('/login');
        } else {
            alert(data.message || "Registration failed");
        }
    };

    return (
        <div className="register-container">
            <form onSubmit={handleSubmit} className="register-form">
                <h2>Register</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Sign Up</button>
                <p className="login-text">
                    Already have an account? <Link to="/">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;


