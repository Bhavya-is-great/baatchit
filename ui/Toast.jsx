import React from 'react';
import style from '@/css/ui/Toast.module.css';
import { VscError } from "react-icons/vsc";
import { SiTicktick } from "react-icons/si";
import { IoWarning } from "react-icons/io5";
import { BsFillInfoCircleFill } from "react-icons/bs";

const Toast = ({ display, type, Message }) => {

    const icon = () => {
        if (type == "Error") {
            return <VscError style={{ color: "red", fontSize: "20px" }} />
        } else if (type == "Success") {
            return <SiTicktick style={{ color: "lime", fontSize: "20px" }} />
        } else if (type == "Warning") {
            return <IoWarning style={{ color: "#FFD54F", fontSize: "20xp" }} />
        } else if (type == "Info") {
            return <BsFillInfoCircleFill style={{ color: "#42A5F5", fontSize: "20xp" }} />
        }
    }

    return (
        <>

            {display && (
                <div className={style.toast}>
                    <div className={style.toastIcon}>
                        {icon()}
                    </div>
                    <div className={style.toastMessage}>
                        {Message}
                    </div>
                </div>
            )}

        </>
    )
}

export default Toast
