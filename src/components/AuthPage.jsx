import { useState } from "react";
import "../styles/AuthPage.css";
import { login, requestOtp, verifyOtpAndSignup } from "../api/auth";

export default function AuthPage({ defaultTab = "login" }) {
  const [isLogin, setIsLogin] = useState(defaultTab === "login");
  const [showOtp, setShowOtp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    roll_no: "",
    phone_no: "",
    email: "",
    password: "",
    hostel: "",
    otp: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        // LOGIN FLOW
        const { token } = await login(formData.email, formData.password);
        localStorage.setItem('token', token);
        alert('Logged in successfully!');
        // TODO: redirect user to home page
      } 
      else if (!showOtp) {
        // SIGNUP STEP 1: REQUEST OTP
        await requestOtp(formData.email);
        alert('OTP sent to your email!');
        setShowOtp(true);
      }
      else {
        // SIGNUP STEP 2: VERIFY OTP & CREATE ACCOUNT
        await verifyOtpAndSignup(formData);
        alert('Signup successful! Please login.');
        setIsLogin(true);
        setShowOtp(false);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-image">
          <img src="/assets/im.png" alt="Illustration" />
        </div>
        <div className="auth-form">
          <div className="auth-tabs">
            <button
              className={isLogin ? "active" : ""}
              onClick={() => { setIsLogin(true); setShowOtp(false); }}
            >
              Login
            </button>
            <button
              className={!isLogin ? "active" : ""}
              onClick={() => { setIsLogin(false); setShowOtp(false); }}
            >
              Signup
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <p style={{ color: "red" }}>{error}</p>}

            {isLogin ? (
              <>
                <h2>Welcome Back</h2>
                <input name="email" type="email" placeholder="Email" onChange={handleChange} />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} />
                <button className="submit-btn" type="submit">Login</button>
              </>
            ) : showOtp ? (
              <>
                <h2>Verify OTP</h2>
                <input name="otp" type="text" placeholder="Enter OTP" onChange={handleChange} />
                <button className="submit-btn" type="submit">Verify & Signup</button>
              </>
            ) : (
              <>
                <h2>Join CollegeBazaar</h2>
                <input name="name" type="text" placeholder="Full Name" onChange={handleChange} />
                <input name="roll_no" type="text" placeholder="Roll Number" onChange={handleChange} />
                <input name="phone_no" type="text" placeholder="Phone Number" onChange={handleChange} />
                <input name="email" type="email" placeholder="Email" onChange={handleChange} />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} />
                <input name="hostel" type="text" placeholder="Hostel" onChange={handleChange} />
                <button className="submit-btn" type="submit">Request OTP</button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
