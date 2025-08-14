import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import logo from '../logo.svg'

// Helper function to generate random captcha
const generateCaptcha = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#';
  let captcha = '';
  for (let i = 0; i < 8; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [userFocus, setUserFocus] = useState(false);
  const [passFocus, setPassFocus] = useState(false);
  const [captchaFocus, setCaptchaFocus] = useState(false);

  const [userId, setUserId] = useState('');
const [password, setPassword] = useState('');
const [loginError, setLoginError] = useState('');

  const handleCaptchaRefresh = (e) => {
    e.preventDefault();
    setCaptcha(generateCaptcha());
    setCaptchaInput('');
    setCaptchaError('');
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoginError('');
  setCaptchaError('');

  // Field validation
  if (!userId) {
    setLoginError('User ID is required.');
    return;
  }
  if (!password) {
    setLoginError('Password is required.');
    return;
  }
  if (!captchaInput) {
    setCaptchaError('Captcha is required.');
    return;
  }
  if (captchaInput !== captcha) {
    setCaptchaError('Captcha is incorrect.');
    return;
  }

  try {
    const response = await fetch('https://lampserver.uppolice.co.in/auth/portal-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        password: password
      })
    });
    const data = await response.json();
    if (data.status) {
      localStorage.setItem('ps_token', data.token);
      localStorage.setItem('ps_user_id', data.data.user_id); // Store user_id
      window.location.href = '/Dashboard';
    } else {
      setLoginError(data.message || 'Login failed.');
    }
  } catch (err) {
    setLoginError('Network error. Please try again.');
  }
};

  return (
    <div>
      <div className='container'>
        <div className='row vh-100 d-flex align-items-center justify-content-center'>
          <div className='col-lg-6 col-md-8 col-12 my-3'>
            <div className="signin-page">
              <img src={logo} />
              <h2>Welcome to Arms Licence Portal (LIU)</h2>
              <p>Please Login to your account and start the adventure</p>
              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-4">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingInput"
                    value={userId}
                    required
                    onChange={e => setUserId(e.target.value)}
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}
                    placeholder={userFocus ? "ENTER USER ID OR MOBILE NUMBER" : ""}
                  />
                  <label htmlFor="floatingInput">{userFocus ? "User Id " : "ENTER USER ID OR MOBILE NUMBER"}</label>
                </div>
                <div className="form-floating position-relative mb-4">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="floatingPassword"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setPassFocus(true)}
                    onBlur={() => setPassFocus(false)}
                    placeholder={passFocus ? "Password" : ""}
                  />
                  <label htmlFor="floatingPassword">{passFocus ? "Password" : "Password"}</label>
                  <span className='password-toggle'
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      zIndex: 2
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <i className="fa fa-eye"></i>
                    ) : (
                      <i className="fa fa-eye-slash"></i>
                    )}
                  </span>
                </div>
                <div className='captch-text d-flex align-items-center mb-2'>
                  <h3 style={{marginBottom: 0, marginRight: '10px'}}>{captcha}</h3>
                  <button className='btn-captcha-refresh' onClick={handleCaptchaRefresh} type="button" style={{border: 'none', background: 'none', padding: 0}}>
                    <i className="fa-solid fa-arrows-rotate"></i>
                  </button>
                </div>
                <div className="form-floating mb-4">
                  <input
                    type="text"
                    className="form-control"
                    id="captchaInput"
                    required
                    value={captchaInput}
                    onChange={e => setCaptchaInput(e.target.value)}
                    onFocus={() => setCaptchaFocus(true)}
                    onBlur={() => setCaptchaFocus(false)}
                    placeholder={captchaFocus ? "Enter above shown captcha" : ""}
                  />
                  <label htmlFor="captchaInput">{captchaFocus ? "Captcha" : "Enter above shown captcha"}</label>
                  {captchaError && (
                    <div style={{ color: 'red', fontSize: '0.9em', marginTop: '5px' }}>
                      {captchaError}
                    </div>
                  )}
                </div>
                {/* <div className='d-flex justify-content-between align-content-center my-3'>
                  <div className="form-check remember-me"></div>
                  <Link to={"#"} className="forgot-pass">Forgot Password?</Link>
                </div> */}
                <Link
                  to={captchaInput === captcha ? "/Dashboard" : "#"}
                  type="submit"
                  className="btn btn-login"
                  onClick={handleSubmit}
                >
                  Login
                </Link>
              </form>
              {/* <div className="create-acc">
                <p>Don't Have an Account? <Link to={"/"}> Register Here</Link></p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login