"use client";
import React, { useEffect, useState } from "react";
import styles from "@/css/home/Sidebar.module.css";
import Image from "next/image";
import logoImage from "@/assets/logo.png";
import { FaSun, FaMoon } from "react-icons/fa";
import { useUser } from "@/helpers/UserContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import OtpPopup from '@/helpers/OtpPopup';

const Sidebar = () => {
  const [theme, setTheme] = useState("dark");
  const [isOpen, setIsOpen] = useState(false);
  const { user, conversations, logout, setSelectedConversation, selectedConversation } = useUser();
  const router = useRouter();
  const [otpDisplay, setOtpDisplay] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) setTheme(stored);
    else localStorage.setItem("theme", "dark");
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const toggleOpen = () => setIsOpen((s) => !s);


  const onOtpSuccess = async () => {
    setOtpDisplay(false);
  }

  const onOtpError = async (message) => {
  }

  const onResendSuccess = async () => {
  }


  return (
    <>
      <header className={styles.nav}>
        <div
          className={`${styles.hamburgertopen}`}
          onClick={toggleOpen}
        >
          <span className={styles.Openline}></span>
          <span className={styles.Openline}></span>
          <span className={styles.Openline}></span>
        </div>

        <Image className={styles.logoImg} src={logoImage} alt="Baatchit logo" />

        <button onClick={toggleTheme} className={styles.mode} aria-label="Toggle theme">
          {theme === "dark" ? <FaSun /> : <FaMoon />}
        </button>
      </header>

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""}`} role="navigation" aria-label="Sidebar">
        <div className={styles.sidebarInner}>
          <div className={styles.topBar}>
            <div className={styles.closeDiv} onClick={toggleOpen} role="button" tabIndex={0} aria-label="Close">
              <div className={`${styles.close} ${isOpen ? styles.closeActive : ""}`}>
                <span className={styles.closeLine}></span>
                <span className={styles.closeLine}></span>
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.newChat}>
            <button onClick={()=>{ selectedConversation == null ? {} : setSelectedConversation(null) }} className={styles.newChatButton}>+ New chat</button>
          </div>

          <div className={styles.divider} />

          <div className={styles.chats}>
            {
              conversations.map((ele) => {
                return <div className={styles.chatItem} key={ele._id} onClick={()=>{
                  selectedConversation == ele._id ? {} : setSelectedConversation(ele._id)
                }}> {ele.title} </div>
              })
            }
          </div>

          <div className={styles.userArea}>
            <p className={styles.userDetails}>Hi {user == null ? "user" : user.name} 👋🏻</p>
            <button onClick={() => {
              if (user == null) {
                router.push('/loginsignup');
              } else {
                if (user.isVerified) {
                  logout();
                } else {
                  axios
                    .post(
                      `/api/auth/send-verification`,
                      {},
                      { withCredentials: true }
                    )
                    .then((res) => {
                      if (res.data.success) {
                        setOtpDisplay(true);
                      }
                    })
                    .catch((err) => {
                    });
                }
              }
            }} className={styles.userFunctions}>
              {user == null ? "Login / signup" : user.isVerified ? "Logout" : "Verify Email"}
            </button>
          </div>
        </div>
      </aside>

      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ""}`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      />
      <OtpPopup display={otpDisplay} onResendSuccess={onResendSuccess} onClose={onOtpSuccess} onOtpError={onOtpError}></OtpPopup>
    </>
  );
};

export default Sidebar;
