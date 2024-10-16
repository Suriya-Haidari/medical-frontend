

import axios from "axios";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setAuthenticated } from "../store/slices/authSlice";
import Cookies from "js-cookie"; // Import js-cookie

const LogoutButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Send POST request to log out
      await axios.post(
        "https://medical-backend-project.onrender.com/api/logout",
        {},
        { withCredentials: true }
      );

      // Clear the authentication cookie manually
      Cookies.remove("token"); // Forcefully remove cookie

      // Update the global auth state
      dispatch(setAuthenticated(false));

      // Redirect to sign in page after logout
      router.push("/signin");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
