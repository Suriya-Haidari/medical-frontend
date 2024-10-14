"use client";

import { useState, useEffect } from "react";
import { Metadata } from "next";
import Home from "./home/page";
import Notification from "./components/notification";

export default function Root() {
  const [showNotification, setShowNotification] = useState(true); // Track notification visibility

  const handleCloseNotification = () => {
    setShowNotification(false); // Close the notification when the button is clicked or timer ends
  };

  useEffect(() => {
    // Optional: Simulate a delay or load time if needed.
    const timer = setTimeout(() => setShowNotification(false), 3000); // Auto-close after 3 seconds

    return () => clearTimeout(timer); // Clean up the timer on unmount
  }, []);

  return (
    <main>
      {showNotification && (
        <Notification
          message="Welcome to the Medical Website!"
          type="success"
          onClose={handleCloseNotification}
        />
      )}
      <Home />
    </main>
  );
}
