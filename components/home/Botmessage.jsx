import React from "react";
import styles from "@/css/home/BotMessage.module.css";

const BotMessage = ({ text }) => {
  return (
    <div className={styles.messageRow}>
      <div className={styles.botMessage}>
        {text}
      </div>
    </div>
  );
};

export default BotMessage;
