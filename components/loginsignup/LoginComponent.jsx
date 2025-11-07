"use client";
import React, { useState } from 'react';
import style from '@/css/loginsignup/LoginComponent.module.css';
import { FaEnvelope } from "react-icons/fa";
import { TbPasswordFingerprint } from "react-icons/tb";
import Input from '@/ui/Input';
// import OptionComponent from './OptionComponent';
import Toast from '@/ui/Toast';
import axios from 'axios';
import { useUser } from '@/helpers/UserContext';
import { useRouter } from 'next/navigation';
import sleep from '@/utils/sleep';

const LoginComponent = ({ ChangeForm }) => {

  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [passwordType, setPasswordType] = useState('password');
  const [emailError, setEmailError] = useState();
  const [passwordError, setPasswordError] = useState();
  const [display, setDisplay] = useState(false);
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const { setUser } = useUser();
  const router = useRouter();

  const validateLogin = () => {
    let isValid = true;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailLogin)) {
      setEmailError("Enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,32}$/;
    if (!passwordRegex.test(passwordLogin)) {
      setPasswordError(
        "Password must be 8–32 chars with 1 uppercase, 1 lowercase, 1 number, and 1 special character"
      );
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!isValid) return;

    axios.post('/api/auth/login', { email: emailLogin, password: passwordLogin }, { withCredentials: true })
      .then(async (res) => {
        if (res.data.success) {
          setType("Success");
          setMessage("User logged in successfully");
          setDisplay(true);
          setUser(res.data.data.user);
          await sleep(1000);
          setDisplay(false);
          setMessage("");
          setType("");
          router.push('/');
        }
      })
      .catch(async (err) => {
        setType("Error");
        setMessage(err.response.data.message);
        setDisplay(true);
        await sleep(1000);
        setDisplay(false);
        setMessage("");
        setType("");
      })
  };

  const handlForgotPassword = async () => {

    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailLogin)) {
      setEmailError("Enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!isValid) {
      setType("Error");
      setDisplay(true);
      setMessage("Please Enter the email and then click forgot password");
      await sleep(1000);
      setType("");
      setDisplay(false);
      setMessage("");
      return;
    }

    axios.post('/api/auth/forgot-password',{email: emailLogin},{withCredentials: true})
    .then(async (res) => {
      if (res.data.success) {
        setType("Success");
        setMessage("Reset Password link Sent to you");
        setDisplay(true);
        await sleep(1000);
        setDisplay(false);
        setType("");
        setMessage("");
        // router.push('/')
      }
    })
    .catch(async (err) => {
      setType("Error");
      setDisplay(true);
      setMessage(err.response.data.message);
      await sleep(1000);
      setType("");
      setDisplay(false);
      setMessage("");
      return;
    })
  }


  const loginInputs = [
    {
      name: "Email", icon: <FaEnvelope />, type: "email", placeHolder: "josbuttler@gmai.com", value: emailLogin, onChange: setEmailLogin, errorMsg: emailError
    },
    {
      name: "Password", icon: <TbPasswordFingerprint />, type: passwordType, placeHolder: "*****", value: passwordLogin, onChange: setPasswordLogin, errorMsg: passwordError
    },
  ];

  return (
    <div className={style.LoginComp}>
      <div className={style.head}>
        <h1 className={style.headContent}>Login Here</h1>
      </div>
      {
        loginInputs.map((ele, i) => {
          return (
            <Input errorMsg={ele.errorMsg} key={i} name={ele.name} icon={ele.icon} type={ele.type} placeHolder={ele.placeHolder} value={ele.value} onChange={ele.onChange} />
          )
        })
      }

      <button onClick={() => validateLogin()} className={style.loginButton}>Login</button>

      <hr className={style.hr} />

      <div className={style.otherButtons}>
        <button onClick={handlForgotPassword} className={style.btn}>Forgot Password?</button>
        <button className={style.btn}> Need Help? </button>
      </div>

      <div className={style.change}>Don't have a account? <button className={style.btn} onClick={() => ChangeForm("signup")}>signup</button></div>

      <hr className={style.hr} />

      {/* <OptionComponent></OptionComponent> */}

      <Toast type={type} Message={message} display={display}></Toast>
    </div>
  )
}

export default LoginComponent
