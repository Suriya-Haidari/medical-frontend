
import React, { useEffect, useState } from "react";
import axios from "axios";
import CreatingNewNotification from "./CreatingNewNotification";
import Cookies from "js-cookie"; // Import the cookies package
import { useRouter } from "next/navigation";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [role, setRole] = useState<string | null>(null); // State for storing the user role
  const router = useRouter();

  useEffect(() => {
    const fetchUserRole = async () => {
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
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRole(response.data.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
        Cookies.remove("token"); // Remove expired token
        router.push("/signin"); // Redirect to sign-in page
        setRole("user"); // Set role to 'user' if fetch fails
      }
    };

    fetchUserRole();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found in cookies.");
        return;
      }
      const response = await axios.get(
        "https://medical-backend-project.onrender.com/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const unreadNotifications = response.data.filter(
        (notification) => !notification.is_read
      );
      setNotifications(unreadNotifications);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications");
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found in cookies.");
        return;
      }
      await axios.patch(
        `https://medical-backend-project.onrender.com/api/notifications/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setNotifications(
        notifications.filter((notification) => notification.id !== id)
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
      setError("Failed to mark notification as read");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="z-60 notifications dark:bg-black p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      {/* Conditionally render CreatingNewNotification for admin role */}
      {role === "manager" && (
        <CreatingNewNotification setNotifications={setNotifications} />
      )}

      {error && <p className="text-red-500 mb-4">{error}</p>}
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-600">No unread notifications.</p>
      ) : (
        <ul className="space-y-4 z-60">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="unread dark:text-gray-200 bg-gray-200 dark:bg-neutral-800 p-4 bg-gray-100 rounded-md border border-gray-300 flex justify-between items-center"
            >
              <p>{notification.message}</p>

              {role === "manager" && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="ml-4 bg-teal-500 text-white rounded-lg px-1 py-1 hover:bg-teal-600 transition-colors"
                >
                  Mark as Read
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
