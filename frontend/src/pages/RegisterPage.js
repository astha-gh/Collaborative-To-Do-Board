import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import '../styles/Auth.css';

const RegisterPage = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('https://to-do-backend-1-ihwt.onrender.com/api/auth/register', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', data.token);
            navigate('/kanbanBoard');
        }
        else {
            alert(data.message || "Registration failed");
        }
    }

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Register</h2>
                <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
                <button type="submit">Sign Up</button>
                <p className="auth-link">
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </form>
        </div>
    );
}

export default RegisterPage;