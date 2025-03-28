// import { useDispatch, useSelector } from "react-redux";
// import { useState } from "react";
// import axios from "axios";
// import {
//   clearEditItem,
//   setTitle,
//   setParagraph,
// } from "../store/slices/editSlice";
// import { updateItem } from "../store/slices/itemsSlice";
// // import Notification from "../components/Notification.tsx";

// export default function EditForm() {
//   const dispatch = useDispatch();
//   const editItem = useSelector((state: any) => state.edit.item);
//   const title = useSelector((state: any) => state.edit.title);
//   const paragraph = useSelector((state: any) => state.edit.paragraph);
//   const option = useSelector((state: any) => state.edit.option);

//   const [image, setImage] = useState<File | null>(null);
//   const [notification, setNotification] = useState<{
//     message: string;
//     type: string;
//   } | null>(null);
//   const [error, setError] = useState("");

//   const MIN_CHARACTER_LIMIT = 60;
//   const MAX_CHARACTER_LIMIT = 100; // Define a maximum limit for the paragraph

//   const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     // Validate the paragraph length
//     if (paragraph.length < MIN_CHARACTER_LIMIT) {
//       setError(`Paragraph must be at least ${MIN_CHARACTER_LIMIT} characters.`);
//       return;
//     }
//     if (paragraph.length > MAX_CHARACTER_LIMIT) {
//       setError(`Paragraph cannot exceed ${MAX_CHARACTER_LIMIT} characters.`);
//       return;
//     }

//     setError("");

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("paragraph", paragraph);
//     formData.append("option", option);
//     if (image) formData.append("image", image);

//     try {
//       const response = await axios.put(
//         `https://medical-backend-project.onrender.com/api/items/${option}/${editItem.id}`,
//         formData
//       );

//       dispatch(updateItem({ id: editItem.id, data: response.data }));
//       dispatch(clearEditItem());
//       setNotification({
//         message: "Item updated successfully!",
//         type: "success",
//       });

//       window.location.reload();
//     } catch (error) {
//       console.error("Error updating item:", error);
//       setNotification({
//         message: `Error updating item: ${error.message}`,
//         type: "error",
//       });
//     }
//   };

//   // const handleCloseNotification = () => {
//   //   setNotification(null);
//   // };

//   return (
//     <div className="flex flex-col items-center justify-center w-full p-6">
//       <form
//         onSubmit={handleUpdate}
//         className="w-full max-w-md mx-auto text-black"
//       >
//         <h2 className="text-2xl mb-4 text-center">
//           Update <span className="text-teal-500">Item</span>
//         </h2>

//         <div className="mb-4">
//           <label
//             className="block text-gray-700 dark:text-gray-200"
//             htmlFor="title"
//           >
//             Title
//           </label>
//           <input
//             id="title"
//             type="text"
//             value={title}
//             onChange={(e) => dispatch(setTitle(e.target.value))}
//             placeholder="Title"
//             className="mt-1 block w-full border rounded px-3 py-2"
//           />
//         </div>

//         <div className="mb-4">
//           <label
//             className="block text-gray-700 dark:text-gray-200"
//             htmlFor="paragraph"
//           >
//             Paragraph
//           </label>
//           <textarea
//             id="paragraph"
//             value={paragraph}
//             onChange={(e) => dispatch(setParagraph(e.target.value))}
//             placeholder="Paragraph"
//             className="mt-1 block w-full border rounded px-3 py-2"
//           />
//         </div>

//         {/* Paragraph validation feedback */}
//         <p className="text-sm text-gray-500">
//           {paragraph.length}/{MAX_CHARACTER_LIMIT} characters
//         </p>
//         {paragraph.length < MIN_CHARACTER_LIMIT && (
//           <p className="text-red-500 text-sm">
//             {`Paragraph must be at least ${MIN_CHARACTER_LIMIT} characters.`}
//           </p>
//         )}
//         {paragraph.length > MAX_CHARACTER_LIMIT && (
//           <p className="text-red-500 text-sm">
//             {`Paragraph cannot exceed ${MAX_CHARACTER_LIMIT} characters.`}
//           </p>
//         )}

//         <div className="mb-4">
//           <label
//             className="block text-gray-700 dark:text-gray-200"
//             htmlFor="image"
//           >
//             Upload Image
//           </label>
//           <input
//             id="image"
//             type="file"
//             onChange={(e) =>
//               setImage(e.target.files ? e.target.files[0] : null)
//             }
//             className="mt-1 block w-full border rounded px-3 py-2"
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={
//             paragraph.length < MIN_CHARACTER_LIMIT ||
//             paragraph.length > MAX_CHARACTER_LIMIT
//           }
//           className={`w-full bg-teal-500 text-gray-200 hover:bg-teal-600 py-2 rounded ${
//             paragraph.length < MIN_CHARACTER_LIMIT ||
//             paragraph.length > MAX_CHARACTER_LIMIT
//               ? "bg-gray-400 cursor-not-allowed"
//               : ""
//           }`}
//         >
//           Update Item
//         </button>

//         <button
//           type="button"
//           onClick={() => dispatch(clearEditItem())}
//           className="w-full mt-2 bg-teal-500 text-white hover:bg-teal-600 py-2 rounded"
//         >
//           Cancel
//         </button>
//       </form>

//       {/* Notification component
//       {notification && (
//         <Notification
//           message={notification.message}
//           type={notification.type}
//           onClose={handleCloseNotification}
//         />
//       )} */}
//     </div>
//   );
// }



import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import {
  clearEditItem,
  setTitle,
  setParagraph,
} from "../store/slices/editSlice";
import { updateItem } from "../store/slices/itemsSlice";

export default function EditForm() {
  const dispatch = useDispatch();
  const editItem = useSelector((state: any) => state.edit.item);
  const title = useSelector((state: any) => state.edit.title);
  const paragraph = useSelector((state: any) => state.edit.paragraph);
  const option = useSelector((state: any) => state.edit.option);

  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const MIN_PARAGRAPH_LIMIT = 60; // Updated minimum limit to 6
  const MAX_PARAGRAPH_LIMIT = 100; // Updated maximum limit to 59
  const MIN_TITLE_LENGTH = 5;
  const MAX_TITLE_LENGTH = 25;
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (paragraph.length > MAX_PARAGRAPH_LIMIT) {
      setError(`Paragraph cannot exceed ${MAX_PARAGRAPH_LIMIT} characters.`);
      return;
    }

    if (paragraph.length < MIN_PARAGRAPH_LIMIT) {
      setError(`Paragraph must be at least ${MIN_PARAGRAPH_LIMIT} characters.`);
      return;
    }

    if (title.length < MIN_TITLE_LENGTH) {
      setError(`Title must be at least ${MIN_TITLE_LENGTH} characters.`);
      return;
    }

    if (title.length > MAX_TITLE_LENGTH) {
      setError(`Title cannot exceed ${MAX_TITLE_LENGTH} characters.`);
      return;
    }

    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("paragraph", paragraph);
    formData.append("option", option);
    if (image) formData.append("image", image);

    try {
      const response = await axios.put(
        `https://medical-backend-project.onrender.com/api/items/${option}/${editItem.id}`,
        formData
      );

      dispatch(updateItem({ id: editItem.id, data: response.data }));
      dispatch(clearEditItem());

      // Optionally reload or redirect after a delay to allow the user to see the update
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error updating item:", error);
      setError(
        `Error updating item: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      if (file.type !== "image/png") {
        setError("Image must be a PNG file.");
        setImage(null);
        setImagePreview(null);
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        setError("Image size must not exceed 5 MB.");
        setImage(null);
        setImagePreview(null);
        return;
      }
      setError("");
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-6">
      <form
        onSubmit={handleUpdate}
        className="w-full max-w-md mx-auto text-black"
      >
        <h2 className="text-2xl mb-4 text-center">
          Update <span className="text-teal-500">Item</span>
        </h2>

        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-200"
            htmlFor="title"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => dispatch(setTitle(e.target.value))}
            placeholder="Title"
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>

        {/* Title validation feedback */}
        {title.length < MIN_TITLE_LENGTH && (
          <p className="text-red-500 text-sm">
            {`Title must be at least ${MIN_TITLE_LENGTH} characters.`}
          </p>
        )}
        {title.length > MAX_TITLE_LENGTH && (
          <p className="text-red-500 text-sm">
            {`Title cannot exceed ${MAX_TITLE_LENGTH} characters.`}
          </p>
        )}

        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-200"
            htmlFor="paragraph"
          >
            Paragraph
          </label>
          <textarea
            id="paragraph"
            value={paragraph}
            onChange={(e) => dispatch(setParagraph(e.target.value))}
            placeholder="Paragraph"
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>

        {/* Paragraph validation feedback */}
        <p className="text-sm text-gray-500">
          {paragraph.length}/{MAX_PARAGRAPH_LIMIT} characters
        </p>
        {paragraph.length < MIN_PARAGRAPH_LIMIT && (
          <p className="text-red-500 text-sm">
            {`Paragraph must be at least ${MIN_PARAGRAPH_LIMIT} characters.`}
          </p>
        )}
        {paragraph.length > MAX_PARAGRAPH_LIMIT && (
          <p className="text-red-500 text-sm">
            {`Paragraph cannot exceed ${MAX_PARAGRAPH_LIMIT} characters.`}
          </p>
        )}

        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-200"
            htmlFor="image"
          >
            Upload Image
          </label>
          <input
            id="image"
            type="file"
            accept=".png" // Restrict file type to PNG
            onChange={handleImageChange}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>

        {/* Image preview */}
        {imagePreview && (
          <div className="mb-4 flex justify-center">
            <img
              src={imagePreview}
              alt="Selected Preview"
              className="w-6/12 h-6/12 rounded" // Keep the size as is
            />
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={
            paragraph.length < MIN_PARAGRAPH_LIMIT ||
            paragraph.length > MAX_PARAGRAPH_LIMIT ||
            title.length < MIN_TITLE_LENGTH ||
            title.length > MAX_TITLE_LENGTH
          }
          className={`w-full bg-teal-500 text-gray-200 hover:bg-teal-600 py-2 rounded ${
            paragraph.length < MIN_PARAGRAPH_LIMIT ||
            paragraph.length > MAX_PARAGRAPH_LIMIT ||
            title.length < MIN_TITLE_LENGTH ||
            title.length > MAX_TITLE_LENGTH
              ? "bg-gray-400 cursor-not-allowed"
              : ""
          }`}
        >
          Update Item
        </button>

        <button
          type="button"
          onClick={() => dispatch(clearEditItem())}
          className="w-full mt-2 bg-teal-500 text-white hover:bg-teal-600 py-2 rounded"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
