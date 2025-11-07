"use client";
import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUser } from "@/helpers/UserContext";
import style from '@/css/globals/OtpPopup.module.css';

const OtpPopup = ({ display, onClose, onOtpError, onResendSuccess }) => {
    const inputsRef = useRef([]);
    const [timer, setTimer] = useState(60);
    const [resendEnabled, setResendEnabled] = useState(false);

    const { setUser } = useUser();

    useEffect(() => {
        let countdown;
        if (display) {
            document.body.classList.add("blurred");
            setTimer(60);
            setResendEnabled(false);

            countdown = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdown);
                        setResendEnabled(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            document.body.classList.remove("blurred");
        }

        return () => {
            document.body.classList.remove("blurred");
            clearInterval(countdown);
        };
    }, [display]);

    const handleInput = (e, index) => {
        const value = e.target.value.replace(/[^0-9]/g, ""); // only digits
        e.target.value = value;

        if (value && index < 5) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !e.target.value && index > 0) {
            inputsRef.current[index - 1].value = "";
            inputsRef.current[index - 1].focus();
        }
    };

    const handleSubmit = () => {
        const otp = inputsRef.current.map((input) => input.value).join("");
        // console.log("Entered OTP:", otp);
        axios
            .post(
                `/api/auth/verify-email`,
                { code: otp },
                { withCredentials: true }
            )
            .then((res) => {
                if (res.data.success) {
                    setUser(res.data.data.user);
                    onClose();
                }
            })
            .catch((err) => {
                if (err.status == 400) {
                    onOtpError("Invalid or Expired Token");
                }else {
                    onOtpError(err.response.data.message);
                }
            });
    };

    const handleResend = () => {
        if (!resendEnabled) return;
        // console.log("Resend OTP triggered");

        axios
            .post(
                `/api/auth/send-verification`,
                {},
                { withCredentials: true }
            )
            .then((res) => {
                if (res.data.success) {
                    onResendSuccess(res.data.message);
                }
            })
            .catch((err) => {
                onOtpError(err.response.data.message);
            });

        setTimer(60);
        setResendEnabled(false);

        let countdown = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    setResendEnabled(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    if (!display) return null;

    return (
        <div className={style.popupOverlay}>
            <div className={`${style.popupBox} bounce-in`}>
                <h2 className={style.popupTitle}>Enter OTP</h2>
                <div className={style.otpInputs}>
                    {Array(6)
                        .fill(0)
                        .map((_, i) => (
                            <input
                                key={i}
                                type="text"
                                maxLength="1"
                                className={style.otpBox}
                                ref={(el) => (inputsRef.current[i] = el)}
                                onInput={(e) => handleInput(e, i)}
                                onKeyDown={(e) => handleKeyDown(e, i)}
                            />
                        ))}
                </div>
                <button className={style.otpSubmit} onClick={handleSubmit}>
                    Verify
                </button>

                <div className={style.resendSection}>
                    <span>Didn&apos;t receive OTP?</span>
                    <button
                        className={`${style.resendBtn} ${
                            resendEnabled ? style.active : style.disabled
                        }`}
                        disabled={!resendEnabled}
                        onClick={handleResend}
                    >
                        Resend
                    </button>
                    {!resendEnabled && (
                        <span className={style.timer}>
                            {`00:${timer < 10 ? `0${timer}` : timer}`}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OtpPopup;
