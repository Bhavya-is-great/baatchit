"use client";
import React, { useEffect, useState } from 'react';
import style from '@/css/loginsignup/BoxComponent.module.css';
import LoginComponent from './LoginComponent';
import SignupComponent from './SignupComponent';
import { useUser } from '@/helpers/UserContext';
import { useRouter } from 'next/navigation';

const BoxComponent = () => {
  const { user } = useUser();   // ✅ access the current user from context
  const router = useRouter();

  // redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/"); // ✅ navigate to homepage
    }
  }, [user, router]);

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const [formType, setFormType] = useState("login");
  const [changeType, setChangeType] = useState(false);

  const ChangeForm = async (type) => {
    setChangeType(true);
    await sleep(500);
    setFormType(type);
    await sleep(1000);
    setChangeType(false);
  };

  return (
    <div className={`${style.box} ${changeType ? style.close : ""}`}>
      {formType === "login" ? (
        <LoginComponent ChangeForm={ChangeForm} />
      ) : (
        <SignupComponent ChangeForm={ChangeForm} />
      )}
    </div>
  );
};

export default BoxComponent;
