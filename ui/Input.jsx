import React from 'react';
import style from '@/css/ui/Input.module.css';

const Input = ({ type, value, onChange, placeHolder, errorMsg, icon, name }) => {
    return (
        <>
            <div className={style.inputBox}>
                <label className={style.label} htmlFor={name}>{name}: </label>
                <input id={name} className={style.input} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeHolder} />
            </div>
            <div className={style.error}>{errorMsg}</div>
        </>
    )
}

export default Input