
import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Cookies from "js-cookie";

interface Notification {
  id: number;
  message: string;
}

interface DisplayEmailsProps {
  notifications: Notification[];
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const DisplayEmails: React.FC<DisplayEmailsProps> = ({
  notifications: initialNotifications,
  setError,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setErrorState] = useState<string | null>(null);

  const handleDelete = async (notificationId: number) => {
    const token = Cookies.get("token");
    if (!token) {
      console.error("No token found in cookies.");
      return;
    }

    try {
      const response = await fetch(
        `https://medical-backend-project.onrender.com/api/formNotifications/${notificationId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          console.error("No token found in cookies.");
          return;
        }
        const response = await fetch("https://medical-backend-project.onrender.com/api/user/role", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setRole(data.role);
        setLoading(false);
      } catch (error) {
        setErrorState(error.message);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const client = new WebSocket("wss://medical-backend-project.onrender.com");

    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };

    client.onmessage = (event) => {
      console.log("Received WebSocket Message:", event.data); // Log the message for debugging

      try {
        const data = JSON.parse(event.data);
        if (data.type === "new_notification" && data.notification?.id) {
          setNotifications((prev) => [...prev, data.notification]);
        } else {
          console.error("Invalid notification format:", data);
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    client.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    client.onclose = () => {
      console.log("WebSocket Connection Closed");
    };

    return () => {
      client.close();
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          "https://medical-backend-project.onrender.com/api/formNotifications"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }
        const data: Notification[] = await response.json();
        setNotifications(data);
      } catch (error) {
        setErrorState(error.message);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="max-w-md notifications mx-auto bg-white mt-10 dark:bg-neutral-800 text-black dark:text-white shadow-md rounded-lg p-4">
      <h2 className="text-2xl text-gray-400 text-center mb-4">
        Sent Appointments
      </h2>
      <ul className="divide-y divide-gray-200">
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className="flex justify-between items-center p-2 hover:bg-gray-100 transition-colors duration-200"
          >
            <span>{notification.message}</span>
            <div className="flex items-center">
              <button
                onClick={() => handleDelete(notification.id)}
                className="ml-4 text-red-500 hover:text-red-700"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayEmails;
