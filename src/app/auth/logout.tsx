import axios from "axios";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setAuthenticated } from "../store/slices/authSlice";
import Cookies from "js-cookie";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Send POST request to logout route
      await axios.post(
        "https://medical-backend-project.onrender.com/api/logout",
        {},
        { withCredentials: true }
      );

      // Forcefully remove the token from cookies on frontend
      Cookies.remove("token");

      // Update the authentication state
      dispatch(setAuthenticated(false));

      // Redirect to the sign-in page
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
