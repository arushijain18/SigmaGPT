import { useState, useContext } from "react";
import { MyContext } from "./MyContext";
import "./Login.css";

const API_URL = import.meta.env.VITE_API_URL; // NEW

function Auth() {
  const { setToken } = useContext(MyContext);
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    try {
      const url = `${API_URL}/api/auth/${isLogin ? "login" : "signup"}`; // CHANGED
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      }).then(r => r.json());

      if (res.token) {
        localStorage.setItem("token", res.token);
        setToken(res.token);
      } else {
        setError(res.message || "Something went wrong");
      }
    } catch (err) {
      console.log(err);
      setError("Server error, try again");
    }
  };

  return (
    <div className="loginPage">
      <div className="loginBox">
        <svg className="loginLogo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.28 9.82a5.99 5.99 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.51-2.9A6 6 0 0 0 4.98 4.18a5.99 5.99 0 0 0-4 2.9 6.05 6.05 0 0 0 .75 7.09 5.99 5.99 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.52 2.9A6 6 0 0 0 19.02 19.8a5.99 5.99 0 0 0 4-2.9 6.05 6.05 0 0 0-.74-7.08ZM13.5 21.1a4.48 4.48 0 0 1-2.87-1.04l.14-.08 4.77-2.75a.78.78 0 0 0 .39-.68v-6.72l2.02 1.17a.07.07 0 0 1 .04.06v5.55a4.5 4.5 0 0 1-4.49 4.49ZM4.35 17.24a4.47 4.47 0 0 1-.53-3.01l.14.08 4.77 2.75a.78.78 0 0 0 .78 0l5.83-3.36v2.33a.08.08 0 0 1-.03.07l-4.82 2.78a4.5 4.5 0 0 1-6.14-1.64ZM3.1 7.87A4.48 4.48 0 0 1 5.45 5.9v5.66a.77.77 0 0 0 .39.67l5.83 3.36-2.02 1.17a.08.08 0 0 1-.07 0L4.76 14a4.5 4.5 0 0 1-1.66-6.13ZM18.7 11.67l-5.83-3.37 2.02-1.16a.08.08 0 0 1 .07 0l4.82 2.79a4.5 4.5 0 0 1-.68 8.11v-5.67a.77.77 0 0 0-.4-.7ZM20.74 8.7l-.14-.09-4.77-2.75a.78.78 0 0 0-.78 0l-5.83 3.37V6.9a.07.07 0 0 1 .03-.07l4.82-2.78a4.5 4.5 0 0 1 6.67 4.66ZM8.52 12.87l-2.02-1.17a.07.07 0 0 1-.04-.06V6.1a4.5 4.5 0 0 1 7.36-3.46l-.14.08-4.77 2.75a.78.78 0 0 0-.39.68v6.72ZM9.6 10.5l2.6-1.5 2.6 1.5v3l-2.6 1.5-2.6-1.5v-3Z" fill="#fff"/>
        </svg>

        <h1>SIGMAGPT</h1>
        <p className="subtitle">{isLogin ? "Welcome back" : "Create account"}</p>
        <p className="subtext">{isLogin ? "Sign in to continue" : "Sign up to get started"}</p>

        {!isLogin && (
          <div className="inputGroup">
            <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
        )}

        <div className="inputGroup">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 5h18v14H3V5Zm0 0 9 7 9-7" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>

        <div className="inputGroup">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="9" rx="2" stroke="#888" strokeWidth="1.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#888" strokeWidth="1.5"/></svg>
          <input type={showPass ? "text" : "password"} placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
          <svg onClick={() => setShowPass(!showPass)} className="eyeIcon" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="#888" strokeWidth="1.5"/><circle cx="12" cy="12" r="3" stroke="#888" strokeWidth="1.5"/></svg>
        </div>

        {error && <p className="errorText">{error}</p>}

        <button onClick={submit}>
          {isLogin ? "Log in" : "Sign up"}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        <div className="divider"><span>OR</span></div>

        <p className="switchText" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <b>{isLogin ? "Sign up instead" : "Log in instead"}</b>
        </p>
      </div>
    </div>
  );
}

export default Auth;