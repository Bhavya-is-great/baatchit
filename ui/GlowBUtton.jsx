"use client";
import React from 'react';
import style from '@/css/ui/GlowButton.module.css';

const GlowBUtton = ({children, clickFunc}) => {
  const handleClick = () => {
    if (!clickFunc) return;
    clickFunc()
  }
  return (
    <button className={style.glowBtn} onClick={handleClick}>
      {children}
    </button>
  )
}

export default GlowBUtton
