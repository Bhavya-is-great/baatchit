"use client";
import React, { useRef, useState, useEffect } from "react";
import styles from "@/css/home/Textarea.module.css";
import { FiArrowUp } from "react-icons/fi";
import { useUser } from "@/helpers/UserContext";
import DEFAULT_MODELS from "@/utils/modelsList.util";

export default function Textarea({
  onSend,
  onModelSelect,
  selectedModel,
  placeholder = "Type your message..."
}) {
  const taRef = useRef(null);
  const popupRef = useRef(null);
  const popupInnerRef = useRef(null);
  const [value, setValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showChooser, setShowChooser] = useState(false);
  const maxHeight = 220; // px

  const user = useUser();

  function autosize() {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const newHeight = Math.min(ta.scrollHeight, maxHeight);
    ta.style.height = newHeight + "px";
    ta.style.overflowY = ta.scrollHeight > maxHeight ? "auto" : "hidden";
  }

  useEffect(() => {
    autosize();
  }, [value]);

  useEffect(() => {
    function handleGlobalKey(e) {
      const tag = e.target.tagName.toLowerCase();
      const isTyping =
        tag === "input" ||
        tag === "textarea" ||
        e.target.isContentEditable;

      if (e.key === "/" && !isTyping) {
        e.preventDefault();
        taRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, []);

  // ensure popup scrolls to top and focus first element whenever opened
  useEffect(() => {
    if (showChooser && popupInnerRef.current) {
      popupInnerRef.current.scrollTop = 0;
      const firstBtn = popupInnerRef.current.querySelector("button");
      if (firstBtn) firstBtn.focus({ preventScroll: true });
    }
  }, [showChooser]);

  async function doSend() {
    if (!value.trim() || isSending) return;
    setIsSending(true);
    try {
      await onSend(value.trim());
      setValue("");
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      user.settriger(true);
    }
  }

  function chooseModel(m) {
    if (onModelSelect) {
      onModelSelect(m);
    } else if (user && typeof user.setModel === "function") {
      user.setModel(m);
    }
    setShowChooser(false);
  }

  const currentModel = selectedModel ?? (user && user.model) ?? "chatgpt";

  return (
    <div className={styles.wrapper}>
      <div className={styles.topRow}>
        <div className={styles.modelChooser}>
          <button
            className={styles.chooseBtn}
            onClick={() => setShowChooser((s) => !s)}
            aria-haspopup="true"
            aria-expanded={showChooser}
          >
            {currentModel}
            <span className={styles.chev}>▾</span>
          </button>

          <div
            ref={popupRef}
            className={`${styles.chooserPopup} ${
              showChooser ? styles.open : ""
            }`}
            role="menu"
            aria-hidden={!showChooser}
          >
            <div ref={popupInnerRef} className={styles.popupInner}>
              {DEFAULT_MODELS.map((m) => (
                <button
                  key={m}
                  onClick={() => chooseModel(m)}
                  className={styles.choice}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.hint}>
          <small>Press ⌘/Ctrl+Enter to send</small>
        </div>
      </div>

      <div className={styles.textareaRow}>
        <textarea
          ref={taRef}
          className={styles.textarea}
          placeholder={placeholder}
          value={user.Message}
          onChange={(e) => user.setMessage(e.target.value)}
          onInput={autosize}
          onKeyDown={handleKeyDown}
          rows={1}
        />

        <button
          className={`${styles.sendBtn} ${
            user.triger ? styles.disabled : ""
          }`}
          onClick={()=>{
            user.settriger(true);
          }}
          disabled={user.triger}
          aria-disabled={user.triger}
          aria-label="Send message"
          title={isSending ? "Sending..." : "Send"}
        >
          <FiArrowUp
            className={isSending ? styles.sendingIcon : ""}
            size={18}
          />
        </button>
      </div>
    </div>
  );
}
