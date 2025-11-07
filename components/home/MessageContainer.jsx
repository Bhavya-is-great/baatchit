"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/css/home/MessageContainer.module.css";
import UserMessage from "./UserMessage";
import BotMessage from "./Botmessage";
import { useUser } from "@/helpers/UserContext";
import axios from "axios";

function extractText(res) {

    console.log(res)

    if (typeof res == "string") {
        return res
    } else {
        return res.message?.content
    }
}

async function chatgpt(history = []) {
    const response = await window.puter.ai.chat(history, { model: "gpt-5" });
    const text = extractText(response);
    return text
}

async function gemini(history = []) {
    const response = await window.puter.ai.chat(history, { model: "google/gemini-1.5" });
    const text = extractText(response);
    return text
}

async function claude(history = []) {
    const response = await window.puter.ai.chat(history, { model: "anthropic/claude-3.5-sonnet" });
    const text = extractText(response);
    return text
}

async function grok(history = []) {
    const response = await window.puter.ai.chat(history, { model: "xai/grok-1" });
    const text = extractText(response);
    return text
}

async function giveResponse(history, aiModel) {
    try {
        const response = await window.puter.ai.chat(history, { model: aiModel });
        const text = extractText(response);
        return text
    } catch (err) {
        console.error("AI route error:", err);
    }
}


const MessageContainer = () => {
    const router = useRouter();
    const {
        user,
        triger,
        Message,
        model,
        settriger,
        setMessage,
        selectedConversation,
        setSelectedConversation,
        setConversations,
    } = useUser();
    const historyRef = useRef([]);
    const [renderTick, setRenderTick] = useState(0);
    const boxRef = useRef(null);
    var LoadMessages = true;

    useEffect(() => {
        if (LoadMessages) {
            if (selectedConversation != null) {
                axios.get(`/api/data/messages`, { params: { conversation_id: selectedConversation } }, { withCredentials: true })
                    .then(res => {
                        historyRef.current = res.data.data;
                        setRenderTick((t) => t + 1);
                    })
                    .catch(err => { console.log(err) })
            } else {
                historyRef.current = []
                setRenderTick((t) => t + 1);
            }
        }else {
            LoadMessages = true;
        }
    }, [selectedConversation])

    useEffect(() => {
        let mounted = true;

        async function run() {
            if (!triger) return;
            const finalize = () => {
                if (!mounted) return;
                settriger?.(false);
            };

            if (user == null) {
                router.push("/loginsignup");
                finalize();
                return;
            }

            let conversation_id = selectedConversation;
            let content = Message;
            setMessage("");

            if (content.length === 0) {
                finalize();
                return;
            }

            async function setMessages(role, content) {
                console.log(content)
                if (!mounted) return;
                let messageData = {
                    role: role,
                    content: content,
                    IndexNum: historyRef.current.length,
                    conversation_id: conversation_id,
                };

                historyRef.current.push(messageData);

                try {
                    const res = await axios.post("/api/data/messages", messageData, {
                        withCredentials: true,
                    });
                    if (res.data?.success) {
                        setRenderTick((t) => t + 1);
                    }
                } catch (err) {
                    console.error(err);
                }
            }

            if (selectedConversation == null) {
                
                LoadMessages = false;

                try {
                    const title = content.split(/\s+/).slice(0, 4).join(" ");
                    const user_id = user._id;
                    const aiModel = model;
                    const res = await axios.post(
                        "/api/data/conversation",
                        { title, user_id, aiModel },
                        { withCredentials: true }
                    );
                    if (res.data?.success) {
                        if (!mounted) return;
                        setConversations((prev) => [...prev, res.data.data]);
                        setSelectedConversation(res.data.data._id);
                        conversation_id = res.data.data._id;
                    }
                } catch (err) {
                    console.error("create conversation error", err);
                    return
                }
            }

            console.log(content)
            await setMessages("user", content);

            content = await giveResponse(historyRef.current, model);
            console.log(content)
            await setMessages("assistant", content);

            finalize();

        }

        run();

        return () => {
            mounted = false;
        };

    }, [triger]); // keep dependency on triger to run only when triggered

    useEffect(() => {
        if (!boxRef.current) return;
        boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }, [renderTick]);

    return (
        <div ref={boxRef} className={styles.ChatBox}>
            {historyRef.current.map((msg, idx) =>
                msg.role === "user" ? (
                    <UserMessage key={msg.ts ?? idx} text={msg.content}></UserMessage>
                ) : (
                    <BotMessage key={msg.ts ?? idx} text={msg.content}></BotMessage>
                )
            )}
        </div>
    );
};

export default MessageContainer;
