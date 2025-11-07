import React from "react";
import styles from "@/css/home/UserMessage.module.css";

export default function UserMessage({ text }) {
  return (
    <div className={styles.messageRow}>
      <div className={styles.userMessage}>
        {text}
      </div>
    </div>
  );
}
