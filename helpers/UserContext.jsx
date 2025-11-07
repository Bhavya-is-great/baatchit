"use client";
import React, { createContext, useEffect, useState, useContext } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ url = "", children }) => {
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [Message, setMessage] = useState("");
  const [model, setModel] = useState("gpt-5");
  const [triger, settriger] = useState(false);

  useEffect(() => {
    const endpoint = url ? `${url.replace(/\/$/, "")}/api/auth/status` : "/api/auth/status";

    axios
      .get(endpoint, { withCredentials: true })
      .then((res) => {
        if (res?.data?.data?.user) setUser(res.data.data.user);
        else setUser(null);
      })
      .catch(() => {
        setUser(null);
      });
  }, [url]);

  useEffect(() => {
    if (user == null) {
      setConversations([]);
    } else {
      axios.get(`/api/data/conversation`, {}, { withCredentials: true })
      .then(res => {
        setConversations(res.data.data)
      })
      .catch(err => { console.log(err) })
    }
  }, [user]);

  const logout = async (onSuccess = () => {}) => {
    try {
      const endpoint = url ? `${url.replace(/\/$/, "")}/api/auth/logout` : "/api/auth/logout";
      await axios.post(endpoint, {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      if (onSuccess) onSuccess();
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      url,
      logout,
      conversations,
      setConversations,
      selectedConversation,
      setSelectedConversation,
      Message,
      setMessage,
      triger,
      settriger,
      model,
      setModel
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (ctx === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return ctx;
};
