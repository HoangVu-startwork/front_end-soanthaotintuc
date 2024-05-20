import React, { Component, useState } from "react";
import { Modal, Form, Input, Select, Upload, message } from 'antd';
import axios from "axios";
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import Auth from '../../service/auth'
import '../../assets/css/login.css'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => { setShowPassword(!showPassword) };
  const passwordInputType = showPassword ? 'text' : 'password';
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const token = localStorage.getItem('token');
  const headers = {
    Authorization: token,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;

    if (!email) {
      setErrorEmail('Please enter your email');
      hasError = true;
    } else {
      // Validate email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        setErrorEmail('Invalid email. Email must have @ and .com or .vn');
        hasError = true;
      } else {
        setErrorEmail('');
      }
    }

    if (!password) {
      setErrorPassword('Password is required.');
      hasError = true;
    } else {
      const hasLowercase = /[a-z]/.test(password);
      const hasUppercase = /[A-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialCharacter = /[!@#$%^&*(),-.?":{}|<>~ ]/.test(password);
      const hasValidLength = password.length >= 10;

      const errors = [];
      if (!hasLowercase) errors.push('- At least one lowercase letter');
      if (!hasUppercase) errors.push('- At least one uppercase letter');
      if (!hasNumber) errors.push('- At least one number');
      if (!hasValidLength) errors.push('- Be at least 10 characters long');
      if (hasSpecialCharacter) errors.push('- No special characters allowed');

      if (errors.length > 0) {
        const firstTwoErrors = errors.slice(0, 1);
        setErrorPassword('Password must contain:\n' + firstTwoErrors.join('\n'));
        hasError = true;
      } else {
        setErrorPassword('');
      }
    }
    if (hasError) {
      return;
    }
    try {
      const response = await Auth.login(email, password);
      if (response.error) {
        setErrorMessage(response.error);
      } else if (response.status === "ok") {
        window.localStorage.setItem("token", response.data);
        window.localStorage.setItem("loggedIn", true);
        setIsLoggedIn(true);
        if (response.role === 'admin') {
          window.location.href = "/blog";
        } else {
          window.location.href = "/blog-edit";
        }
      }
    } catch (error) {}
  };

  const emailChange = (e) => {
    setEmail(e.target.value);
    if (e.target.value) {
      setErrorEmail('')
    }
  };

  const passwordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value) {
      setErrorPassword('')
    }
  };

  return (
    <>
      <form className="from-login">
        <h3 id="logo">Login</h3>
        <h5 className="display-8 text-primary log_in_text">{errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}</h5>
        <div className="mb-3">
          <label className='test'>Email</label>
          <input onChange={emailChange} type="email" value={email} placeholder="Email address" className={`${errorEmail && !email ? 'input-error' : ''}`} /><br />
          {errorEmail && errorEmail.includes('email') && <p className="validation">{errorEmail}</p>}
        </div>
        <div className="mb-3">
          <label className='test'>Password</label><br/>
          <input type={passwordInputType} name="password" value={password} className={`form-control-pass ${errorPassword && !password ? 'input-error' : ''}`} placeholder="Password address" onChange={passwordChange} /><br />
          <p className='password-toggle-icon' onClick={togglePasswordVisibility}>
            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          </p>
          <p className="validation-password">
            {errorPassword.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
        </div>
        <div className="mb-3">
          <input onClick={handleSubmit} className="submit-login" type="submit" value="Log In" />
        </div>
      </form>
    </>
  );
}