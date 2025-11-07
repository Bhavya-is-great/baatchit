"use client";
import React from 'react';
import style from '@/css/ui/NormalButton.module.css';

const NormalButton = ({ children, clickFunc}) => {
    const handleClick = () => {
        if (!clickFunc) return;
        clickFunc()
    }
    return (
        <button className={style.normalBtn} onClick={handleClick}>
            {children}
        </button>
    )
}

export default NormalButton
