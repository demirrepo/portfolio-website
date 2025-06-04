import React, { useEffect, useRef, useState } from "react";
import "../styles/Contact.css";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";

const TELEGRAM_BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
const TELEGRAM_USER_ID = process.env.REACT_APP_TELEGRAM_USER_ID;

const Contact = ({ profileData }) => {
  const sectionRef = useRef(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', text: string }
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "-50px",
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      setNotification({ type: "error", text: "Please fill in all fields." });
      return;
    }
    setSending(true);
    setNotification(null);
    // Format message for Telegram
    const text = `📩 <b>New Portfolio Message</b>\n\n<b>Name:</b> ${name}\n<b>Phone:</b> ${phone}\n<b>Message:</b> ${message}`;
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_USER_ID,
            text,
            parse_mode: "HTML",
          }),
        }
      );
      const data = await res.json();
      if (data.ok) {
        setNotification({
          type: "success",
          text: "Message sent successfully!",
        });
        setName("");
        setPhone("");
        setMessage("");
      } else {
        setNotification({
          type: "error",
          text: "Failed to send message. Please try again.",
        });
      }
    } catch (err) {
      setNotification({
        type: "error",
        text: "Failed to send message. Please try again.",
      });
    } finally {
      setSending(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  return (
    <div className="contact-section" id="contact" ref={sectionRef}>
      <div className="contact-content">
        <div className="contact-left">
          <span className="tag">&lt;Get in Touch/&gt;</span>
          <h2>Let's Build Something</h2>
          <p>
            Together<span className="accent">.</span>
          </p>
          <div className="contact-info">
            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <span>{profileData.email}</span>
            </div>
            <div className="info-item">
              <FaPhone className="info-icon" />
              <span>{profileData.phone}</span>
            </div>
            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <span>{profileData.location}</span>
            </div>
          </div>
          <div className="social-links">
            <a
              href={profileData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <FaGithub />
            </a>
            <a
              href={profileData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <FaLinkedin />
            </a>
          </div>
        </div>
        <div className="contact-right">
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="form-row">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={sending}
              />
              <input
                type="tel"
                placeholder="Your Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={sending}
              />
            </div>
            <textarea
              placeholder="Your Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={sending}
            ></textarea>
            <button
              type="submit"
              className="send-message-btn"
              disabled={sending}
            >
              {sending ? "Sending..." : "Send Message →"}
            </button>
          </form>
          {notification && (
            <div className={`verified-animation ${notification.type}`}>
              <span className="icon">
                {notification.type === "success" ? (
                  // SVG Tick Icon
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="32"
                      cy="32"
                      r="30"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      d="M20 34L29 43L44 24"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  // SVG X Icon
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="32"
                      cy="32"
                      r="30"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      d="M24 24L40 40"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M40 24L24 40"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </span>
              <span
                className="notif-text"
                style={{
                  marginTop: "1rem",
                  color: "#fff",
                  fontSize: "1.1rem",
                  textAlign: "center",
                }}
              >
                {notification.text}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
