import React, { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Cookies from "js-cookie";
import axios from "axios"; // Import Axios

interface Notification {
  id: number;
  message: string;
  appointment_count: number; // Include appointment_count
}

interface DisplayEmailsProps {
  notifications: Notification[]; // Define a specific type
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const DisplayEmails: React.FC<DisplayEmailsProps> = ({
  notifications: initialNotifications,
  setError,
}) => {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setErrorState] = useState<string | null>(null); // Avoid shadowing setError

  const handleDelete = async (notificationId: number) => {
    const token = Cookies.get("token");
    if (!token) {
      console.error("No token found in cookies.");
      return;
    }

    try {
      const response = await axios.delete(
        `https://medical-backend-project.onrender.com/api/formNotifications/${notificationId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to delete notification");
      }

      setNotifications(notifications.filter((n) => n.id !== notificationId));
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
        const response = await axios.get(
          "https://medical-backend-project.onrender.com/api/user/role",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status !== 200) {
          throw new Error("Failed to fetch user data");
        }

        const data = response.data;
        setRole(data.role);
        setLoading(false);
      } catch (error) {
        setErrorState(error.message); // Use setErrorState for consistency
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
      const data = JSON.parse(event.data);
      if (data.type === "new_notification" && data.notification.id) {
        setNotifications((prev) => [...prev, data.notification]);
      } else {
        console.error("Notification is missing an id:", data.notification);
      }
    };

    return () => {
      client.close(); // Close the connection when the component unmounts
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          "https://medical-backend-project.onrender.com/api/formNotifications"
        );
        if (response.status !== 200) {
          throw new Error("Failed to fetch notifications");
        }

        const data: Notification[] = response.data; // Specify the type
        setNotifications(data); // Set notifications with the appointment_count included
      } catch (error) {
        setErrorState(error.message); // Set the error message
      }
    };

    fetchNotifications();
  }, []);

  // Handle loading and error states in your render
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
            className="flex justify-between items-center p-2 hover:text-black hover:bg-gray-100 transition-colors duration-200"
          >
            <span>
              {notification.appointment_count}/20 &nbsp; {notification.message}
            </span>

            {/* Display appointment count */}
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
      <br />
      <br />
    </div>
  );
};

export default DisplayEmails;
