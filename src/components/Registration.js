import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import logo from '../logo.svg';

// Helper function to generate random captcha
const generateCaptcha = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#';
    let captcha = '';
    for (let i = 0; i < 8; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captcha;
};

const Registration = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [captcha, setCaptcha] = useState(generateCaptcha());
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaError, setCaptchaError] = useState('');
    const [categoryFocus, setCategoryFocus] = useState(false);
    const [nameFocus, setNameFocus] = useState(false);
    const [dobFocus, setDobFocus] = useState(false);
    const [mobileFocus, setMobileFocus] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);
    const [captchaFocus, setCaptchaFocus] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [emailOtp, setEmailOtp] = useState('');
    const [mobileOtp, setMobileOtp] = useState('');
    const [otpError, setOtpError] = useState('');
    const [emailOtpFocus, setEmailOtpFocus] = useState(false);
    const [mobileOtpFocus, setMobileOtpFocus] = useState(false);

    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleCaptchaRefresh = (e) => {
        e.preventDefault();
        setCaptcha(generateCaptcha());
        setCaptchaInput('');
        setCaptchaError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (captchaInput !== captcha) {
            setCaptchaError('Captcha is incorrect.');
        } else {
            setCaptchaError('');
            setShowModal(true);
        }
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        if (emailOtp.length !== 6 || mobileOtp.length !== 6) {
            setOtpError('Please enter valid 6-digit OTPs for both Email and Mobile.');
        } else {
            setOtpError('');
            setShowModal(false);
            setShowSuccessModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEmailOtp('');
        setMobileOtp('');
        setOtpError('');
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        setEmailOtp('');
        setMobileOtp('');
        navigate('/'); // Redirect to home page
    };

    return (
        <div>
            <div className="container">
                <div className="row vh-100 d-flex align-items-center justify-content-center">
                    <div className="col-lg-6 col-md-8 col-12 my-3">
                        <div className="signin-page">
                            <img src={logo} alt="Logo" />
                            <h2>Welcome to Arms Licence Portal</h2>
                            <p>Please Register to your account and start the adventure</p>
                            <form onSubmit={handleSubmit}>
                                <div className="form-floating mb-4">
                                    <select
                                        className="form-control"
                                        id="floatingCategory"
                                        onFocus={() => setCategoryFocus(true)}
                                        onBlur={() => setCategoryFocus(false)}
                                    >
                                        <option value="">Select Category</option>
                                        <option value="individual">Individual</option>
                                        <option value="Institute">Institute</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Manufacturer">Manufacturer</option>
                                        <option value="Dealer">Dealer</option>
                                    </select>
                                    <label htmlFor="floatingCategory">
                                        {categoryFocus ? 'SELECT CATEGORY' : 'Category'}
                                    </label>
                                </div>
                                <div className="form-floating mb-4">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="floatingName"
                                        onFocus={() => setNameFocus(true)}
                                        onBlur={() => setNameFocus(false)}
                                        placeholder={nameFocus ? 'ENTER YOUR NAME' : ''}
                                    />
                                    <label htmlFor="floatingName">
                                        {nameFocus ? 'ENTER YOUR NAME' : 'Name'}
                                    </label>
                                </div>
                                <div className="form-floating mb-4">
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="floatingDob"
                                        onFocus={() => setDobFocus(true)}
                                        onBlur={() => setDobFocus(false)}
                                        placeholder={dobFocus ? 'ENTER DATE OF BIRTH' : ''}
                                    />
                                    <label htmlFor="floatingDob">
                                        {dobFocus ? 'ENTER DATE OF BIRTH' : 'Date of Birth'}
                                    </label>
                                </div>
                                <div className="form-floating mb-4">
                                    <input
                                        type="tel"
                                        className="form-control"
                                        id="floatingMobile"
                                        onFocus={() => setMobileFocus(true)}
                                        onBlur={() => setMobileFocus(false)}
                                        placeholder={mobileFocus ? 'ENTER MOBILE NUMBER' : ''}
                                    />
                                    <label htmlFor="floatingMobile">
                                        {mobileFocus ? 'ENTER MOBILE NUMBER' : 'Mobile Number'}
                                    </label>
                                </div>
                                <div className="form-floating mb-4">
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="floatingEmail"
                                        onFocus={() => setEmailFocus(true)}
                                        onBlur={() => setEmailFocus(false)}
                                        placeholder={emailFocus ? 'ENTER EMAIL ID' : ''}
                                    />
                                    <label htmlFor="floatingEmail">
                                        {emailFocus ? 'ENTER EMAIL ID' : 'Email Id'}
                                    </label>
                                </div>
                                <div className="note-shared">
                                    <h3>
                                        <span>NOTE :</span> User Id or Password will be shared on your
                                        registered email id.
                                    </h3>
                                </div>
                                <div className="captch-text d-flex align-items-center mb-2">
                                    <h3 style={{ marginBottom: 0, marginRight: '10px' }}>
                                        {captcha}
                                    </h3>
                                    <button
                                        className="btn-captcha-refresh"
                                        onClick={handleCaptchaRefresh}
                                        type="button"
                                        style={{ border: 'none', background: 'none', padding: 0 }}
                                    >
                                        <i className="fa-solid fa-arrows-rotate"></i>
                                    </button>
                                </div>
                                <div className="form-floating mb-4">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="captchaInput"
                                        value={captchaInput}
                                        onChange={(e) => setCaptchaInput(e.target.value)}
                                        onFocus={() => setCaptchaFocus(true)}
                                        onBlur={() => setCaptchaFocus(false)}
                                        placeholder={captchaFocus ? 'Enter above shown captcha' : ''}
                                    />
                                    <label htmlFor="captchaInput">Captcha</label>
                                    {captchaError && (
                                        <div style={{ color: 'red', fontSize: '0.9em', marginTop: '5px' }}>
                                            {captchaError}
                                        </div>
                                    )}
                                </div>
                                <div className="d-flex justify-content-between align-content-center my-3">
                                    <div className="form-check remember-me"></div>
                                    <Link to="#" className="forgot-pass">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <button type="submit" className="btn btn-login">
                                    Register Now
                                </button>
                            </form>
                            <div className="create-acc">
                                <p>
                                    Don't Have an Account? <Link to="/">Login</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* OTP Input Modal */}
            <div
                className={`modal fade ${showModal ? 'show' : ''}`}
                style={{ display: showModal ? 'block' : 'none' }}
                tabIndex="-1"
                role="dialog"
            >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Verify OTP</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={handleCloseModal}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleOtpSubmit}>
                                <div className="form-floating mb-4">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="emailOtp"
                                        value={emailOtp}
                                        onChange={(e) => setEmailOtp(e.target.value)}
                                        onFocus={() => setEmailOtpFocus(true)}
                                        onBlur={() => setEmailOtpFocus(false)}
                                        placeholder={emailOtpFocus ? 'ENTER EMAIL OTP' : ''}
                                        maxLength="6"
                                    />
                                    <label htmlFor="emailOtp">
                                        {emailOtpFocus ? 'ENTER EMAIL OTP' : 'Email OTP'}
                                    </label>
                                </div>
                                <div className="form-floating mb-4">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="mobileOtp"
                                        value={mobileOtp}
                                        onChange={(e) => setMobileOtp(e.target.value)}
                                        onFocus={() => setMobileOtpFocus(true)}
                                        onBlur={() => setMobileOtpFocus(false)}
                                        placeholder={mobileOtpFocus ? 'ENTER MOBILE OTP' : ''}
                                        maxLength="6"
                                    />
                                    <label htmlFor="mobileOtp">
                                        {mobileOtpFocus ? 'ENTER MOBILE OTP' : 'Mobile OTP'}
                                    </label>
                                </div>
                                {otpError && (
                                    <div style={{ color: 'red', fontSize: '0.9em', marginBottom: '10px' }}>
                                        {otpError}
                                    </div>
                                )}
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleCloseModal}
                                    >
                                        Close
                                    </button>
                                    <button type="submit" className="btn btn-verify">
                                        Verify OTPs
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {showModal && <div className="modal-backdrop fade show"></div>}

            {/* Success Modal */}
            <div
                className={`modal fade ${showSuccessModal ? 'show' : ''}`}
                style={{ display: showSuccessModal ? 'block' : 'none' }}
                tabIndex="-1"
                role="dialog"
            >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Registration Completed Successfully</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={handleCloseSuccessModal}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="note-shared-id mt-3">
                                <h3>
                                    Your user id is <span>RA123Aasz</span>
                                </h3>
                            </div>
                            <div className="note-shared-id">
                                <h3>
                                    Your Password is <span>WSEDA123</span>
                                </h3>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-verify"
                                onClick={handleCloseSuccessModal}
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showSuccessModal && <div className="modal-backdrop fade show"></div>}
        </div>
    );
};

export default Registration;