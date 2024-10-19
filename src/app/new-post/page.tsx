"use client";

import React, { useState } from "react";
import axios from "axios";
import Notification from "../components/notification";
// import Notif from "../emergency/Notif";
import Cookies from "js-cookie";
import Image from "next/image";

export default function CreateForm() {
  const [title, setTitle] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [option, setOption] = useState("");
  const [image, setImage] = useState(null);
  const [notification, setNotification] = useState(null);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");
    if (!token) {
      console.error("No token found in cookies.");
      return;
    }

    // Paragraph and title validation
    if (paragraph.length < 60 || paragraph.length > 100) {
      setError("Paragraph must be between 60 and 100 characters.");
      return;
    }
    if (title.length > 25) {
      setError("Title must be 25 characters or fewer.");
      return;
    }

    // Image validation: Check if image is uploaded
    if (!image) {
      setError("Please upload an image.");
      return;
    }

    // Image size validation
    if (image.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }


    setError(""); // Clear any previous error

    const formData = new FormData();
    formData.append("title", title);
    formData.append("paragraph", paragraph);
    formData.append("option", option);
    formData.append("image", image);

    try {
      const res = await axios.post(
        "https://medical-backend-project.onrender.com/api/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status >= 200 && res.status < 300) {
        setNotification({
          message: "Item uploaded successfully!",
          type: "success",
        });
        setTitle("");
        setParagraph("");
        setOption("");
        setImage(null);
      } else {
        setNotification({
          message: `Upload failed with status ${res.status}`,
          type: "error",
        });
      }
    } catch (error) {
      setNotification({
        message: `Error uploading item: ${error.message}`,
        type: "error",
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <div className="bg-white dark:bg-black">
      <br />
      <br />
      <br />
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="max-w-md mx-auto p-4 bg-white dark:bg-neutral-800 text-black dark:text-white text-black shadow-md rounded-lg space-y-4"
      >
        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Title:
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setFocusedField("title")}
            onBlur={() => setFocusedField("")}
            required
            className={`mt-1 block w-full px-3 py-2 dark:text-black border border-gray-300 rounded-md shadow-sm focus:outline-none ${
              title.length > 25 ? "border-red-500" : ""
            }`}
          />
          {focusedField === "title" && title.length > 25 && (
            <p className="text-red-500 text-sm mt-1">
              Title must be 25 characters or fewer.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="paragraph" className="block text-sm font-medium ">
            Paragraph:
          </label>
          <textarea
            id="paragraph"
            name="paragraph"
            value={paragraph}
            onChange={(e) => setParagraph(e.target.value)}
            onFocus={() => setFocusedField("paragraph")}
            onBlur={() => setFocusedField("")}
            required
            className={`mt-1 block w-full px-3 py-2 dark:text-black border border-gray-300 rounded-md shadow-sm focus:outline-none ${
              paragraph.length < 60 || paragraph.length > 100
                ? "border-red-500"
                : ""
            }`}
          />
          {focusedField === "paragraph" && (
            <p className="text-red-500 text-sm mt-1">
              {paragraph.length < 60
                ? "Paragraph must be at least 60 characters."
                : paragraph.length > 100
                ? "Paragraph must not exceed 100 characters."
                : ""}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="option" className="block text-sm font-medium ">
            Section
          </label>
          <select
            id="option"
            name="option"
            value={option}
            onChange={(e) => setOption(e.target.value)}
            required
            className="mt-1 block dark:text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
          >
            <option value="">Select Section:</option>
            <option value="hospital">Hospital</option>
            <option value="doctors">Doctors News</option>
            <option value="sick">Sick People News</option>
          </select>
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium ">
            Image:
          </label>
          <input
            id="image"
            type="file"
            name="image"
            accept="image/png"
            onChange={(e) => {
              const file = e.target.files[0];
              const allowedTypes = ["image/png"];

              if (file && !allowedTypes.includes(file.type)) {
                setError("Only PNG images are allowed.");
                setImage(null); // Reset image if validation fails
              } else {
                setError(""); // Clear error if valid
                setImage(file);
              }
            }}
            required
            className="mt-1 dark:text-black block w-full text-sm text-gray-500 file:border file:border-gray-300 file:bg-gray-50 file:px-3 file:py-2 file:rounded-md hover:file:bg-gray-100"
          />

          {image && image.size > 5 * 1024 * 1024 && (
            <p className="text-red-500 text-sm mt-1">
              Image must be smaller than 5MB.
            </p>
          )}
        </div>

        <div className="mt-2">
          <label className="block text-sm font-medium ">Image Preview:</label>
          <div className="w-full h-48 border border-gray-300 rounded-md overflow-hidden">
            {image ? (
              <Image
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="object-cover w-full h-full"
                layout="responsive"
                width={500}
                height={300}
              />
            ) : (
              <img
                src="./placeholder.png"
                alt="Placeholder"
                className="object-cover w-full h-full"
              />
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={
            paragraph.length < 60 || paragraph.length > 100 || title.length > 25
          }
          className={`w-full px-4 py-2 ${
            paragraph.length < 60 || paragraph.length > 100 || title.length > 25
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white font-semibold rounded-md shadow-sm`}
        >
          Upload
        </button>
      </form>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
        />
      )}
      <br />
      <br />
      <br />
    </div>
  );
}
