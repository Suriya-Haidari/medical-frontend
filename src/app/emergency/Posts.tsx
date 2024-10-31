"use client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { fetchItems, deleteItem } from "../store/slices/itemsSlice";
import { setEditItem } from "../store/slices/editSlice";
import { setFilter } from "../store/slices/filterSlice";
import { setExpandedItemId } from "../store/slices/expandedItemState";
import ItemCard from "./ItemCard";
import EditForm from "./EditForm";
import FilterButtons from "./FilterButtons";
import { RootState } from "../store/store";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Notif from "./Notif";
import { BellIcon } from "@heroicons/react/24/outline";

export default function Posts() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.items.items);
  const filter = useSelector((state: RootState) => state.filter.filter);
  const editItem = useSelector((state: RootState) => state.edit.item);
  const expandedItemId = useSelector(
    (state: RootState) => state.expandedItem.expandedItemId
  );

  const router = useRouter();
  const [role, setRole] = useState<string | null>(null); // State for storing the user role
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [showNotifications, setShowNotifications] = useState(false);

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
        router.push("/signin"); // Redirect to sign-in pag
        setRole("user");
      }
    };

    fetchUserRole();
  }, []);

  // Fetch posts when component mounts

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("token");
        if (!token) {
          console.error("No token found.");
          router.push("/signin"); // Redirect if no token found
          return;
        }

        const postsResponse = await fetch(
          `https://medical-backend-project.onrender.com/api/items/${filter}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            // @ts-ignore
            withCredentials: true,
          }
        );

        if (postsResponse.status === 403) {
          alert("You don't have permission to access this content.");
          router.push("/signin"); // Redirect to restricted page
        } else if (postsResponse.status === 401) {
          alert("Your session has expired. Please log in again.");
          router.push("/signin"); // Redirect to login on session expiry
        }
        // @ts-ignore
        dispatch(fetchItems(filter));
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [dispatch, filter, router]);
  // Handle navigation based on role
  const handleAdminPanelNavigation = () => {
    router.push("/adminPage");
  };

  const handleProfileNavigation = () => {
    router.push("/profile");
  };

  const handleCreateNewPost = () => {
    router.push("/new-post");
  };

  const handleEdit = (item) => {
    dispatch(setEditItem(item));
  };

  const handleDelete = async (id, option) => {
    try {
      await axios.delete(
        `https://medical-backend-project.onrender.com/api/items/${option}/${id}`
      );
      dispatch(deleteItem(id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true;
    return item.option === filter;
  });

  const toggleExpand = (id) => {
    dispatch(setExpandedItemId(expandedItemId === id ? null : id));
  };

  return (
  <div className="bg-white dark:bg-neutral-900">
      <div className="relative flex items-center mt-4 sm:mt-1">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="text-gray-900 dark:text-gray-200 ml-auto mr-4 mt-10 sm:mt-1 lg:mt-12 lg:mr-6" // Adjusted margin for larger screens
        >
          <span className="sr-only">View notifications</span>
          <BellIcon className="h-6 w-6" />
        </button>

        {/* Notification dropdown/modal positioned directly under the notification icon */}
        {showNotifications && (
          <div className="mr-7 absolute z-50 dark:bg-black border-white border top-full mt-2 right-0 w-64 bg-white shadow-lg rounded-md">
            <Notif />
          </div>
        )}
      </div>

      {/* User Role Buttons */}
      <div className="ml-10 lg:-mt-10 mt-2 sm:ml-0 sm:mt-4 lg:mt-2">
        {/* Reduced margin top for large devices */}
        {role === "manager" ? (
          <>
            <button
              onClick={handleAdminPanelNavigation}
              className="w-10/12 sm:w-2/12 bg-teal-500 text-white py-2 rounded my-4 lg:my-2 dark:bg-gray-200 dark:text-black"
            >
              Open Admin Panel
            </button>
            &nbsp;
            <button
              onClick={handleCreateNewPost}
              className="w-10/12 sm:w-2/12 bg-teal-500 text-white py-2 rounded my-4 lg:my-2 dark:bg-gray-200 dark:text-black"
            >
              Create New Post
            </button>
          </>
        ) : role === "admin" ? (
          <>
            <button
              onClick={handleCreateNewPost}
              className="w-10/12 sm:w-2/12 bg-teal-500 text-white py-2 rounded my-4 lg:my-2 dark:bg-gray-200 dark:text-black"
            >
              Create New Post
            </button>
            &nbsp;
            <button
              onClick={handleProfileNavigation}
              className="w-10/12 sm:w-2/12 bg-teal-500 text-white py-2 rounded my-4 lg:my-2 dark:bg-gray-200 dark:text-black"
            >
              Open Profile Page
            </button>
          </>
        ) : (
          <button
            onClick={handleProfileNavigation}
            className="w-10/12 sm:w-2/12 bg-green-500 text-white py-2 rounded my-4 lg:my-2"
          >
            Open Profile Page
          </button>
        )}
      </div>

      {/* Content Section */}
      <div className="w-12/12 mx-auto py-8 text-black bg-white dark:bg-neutral-900 dark:text-white">
        <FilterButtons
          filter={filter}
          setFilter={(filter) => dispatch(setFilter(filter))}
        />

        {editItem ? (
          <EditForm />
        ) : (
          <div>
            {loading ? (
              <p className="text-center text-lg">
                Please wait, the posts are fetching...
              </p>
            ) : (
              <div>
                {filteredItems.length > 0 ? (
                  <div className="flex flex-wrap justify-center p-4 gap-4">
                    {filteredItems.map((item) => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        handleEdit={handleEdit}
                        handleDelete={() => handleDelete(item.id, item.option)}
                        isExpanded={expandedItemId === item.id}
                        toggleExpand={() => toggleExpand(item.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-lg">
                    Keep waiting; the posts are fetching or no posts available!
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
