import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash, FaEdit, FaEye } from "react-icons/fa";
import UpdateItemPopup from "./UpdateItemPopup";

const ManageParts = () => {
  const [parts, setParts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/spareparts");
      setParts(response.data);
    } catch (error) {
      console.error("Error fetching parts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/spareparts/search?q=${e.target.value}`
      );
      setParts(response.data);
    } catch (error) {
      console.error("Error searching parts:", error);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `http://localhost:3000/api/spareparts/delete/${id}`
          );
          Swal.fire("Deleted!", "Spare part has been deleted.", "success");
          fetchParts();
        } catch (error) {
          Swal.fire("Error!", "Failed to delete spare part.", "error");
        }
      }
    });
  };

  const handleUpdate = (part) => {
    setSelectedPart(part);
    setShowUpdatePopup(true);
  };

  const handleOverview = (part) => {
    setSelectedPart(part);
  };

  const renderFeatures = (features) => {
    return features.map((feature, index) => (
      <li key={index} className="text-sm text-dark">
        {`${feature.key}: ${feature.value}`}
      </li>
    ));
  };

  return (
    <div className="bg-PrimaryColor min-h-screen p-8">
      <h1 className="text-extra-dark text-3xl mb-8 font-bold">
        Manage Spare Parts
      </h1>
      <input
        type="text"
        placeholder="Search parts..."
        className="w-full mb-6 p-3 border border-dark rounded-md focus:outline-none focus:ring-2 focus:ring-dark transition"
        value={searchQuery}
        onChange={handleSearch}
      />

      {loading ? (
        <div className="text-center text-dark">Loading...</div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="overflow-x-auto"
        >
          <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-teal-400 text-white">
                <th className="p-4 text-left font-semibold border-b border-gray-300">
                  Part
                </th>
                <th className="p-4 text-left font-semibold border-b border-gray-300">
                  Supplier
                </th>
                <th className="p-4 text-left font-semibold border-b border-gray-300">
                  Price
                </th>
                <th className="p-4 text-left font-semibold border-b border-gray-300">
                  Quantity
                </th>
                <th className="p-4 text-left font-semibold border-b border-gray-300">
                  Category
                </th>
                <th className="p-4 text-left font-semibold border-b border-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {parts.map((part) => (
                <motion.tr
                  key={part._id}
                  className="border-b border-secondary transition duration-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <td className="p-4 flex items-center space-x-4">
                    <img
                      src={part.imageUrl}
                      alt={part.partName}
                      className="w-16 object-cover rounded shadow-md transform transition duration-300 hover:scale-105"
                    />
                    <span className="text-dark font-medium">
                      {part.partName}
                    </span>
                  </td>
                  <td className="p-4 text-dark">{part.supplier}</td>
                  <td className="p-4 text-dark">${part.price}</td>
                  <td className="p-4 text-dark">{part.quantity}</td>
                  <td className="p-4 text-dark">{part.category}</td>
                  <td className="p-4 flex space-x-2">
                    <button
                      className="flex items-center bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-300 shadow-md"
                      onClick={() => handleUpdate(part)}
                    >
                      <FaEdit className="mr-2" /> Update
                    </button>
                    <button
                      className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300 shadow-md"
                      onClick={() => handleDelete(part._id)}
                    >
                      <FaTrash className="mr-2" /> Delete
                    </button>
                    <button
                      className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 shadow-md"
                      onClick={() => handleOverview(part)}
                    >
                      <FaEye className="mr-2" /> Overview
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Item Overview Popup */}
      <AnimatePresence>
        {selectedPart && !showUpdatePopup && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPart(null)}
          >
            <motion.div
              className="bg-white rounded-lg p-8 max-w-3xl w-full shadow-2xl relative"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl text-gray-800 mb-6 font-bold border-b border-gray-300 pb-2">
                {selectedPart.partName}
              </h2>
              <div className="flex space-x-6">
                <div className="w-1/3">
                  <img
                    src={selectedPart.imageUrl}
                    alt={selectedPart.partName}
                    className="w-full h-auto object-cover rounded shadow-lg"
                  />
                </div>
                <div className="w-2/3 pl-4 space-y-4">
                  <p>
                    <strong>Supplier:</strong> {selectedPart.supplier}
                  </p>
                  <p>
                    <strong>Price:</strong> ${selectedPart.price}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {selectedPart.quantity}
                  </p>
                  <p>
                    <strong>Category:</strong> {selectedPart.category}
                  </p>
                  <div>
                    <h3 className="text-lg mb-2 font-semibold">Features:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {renderFeatures(selectedPart.features)}
                    </ul>
                  </div>
                </div>
              </div>
              <button
                className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-gray-800"
                onClick={() => setSelectedPart(null)}
              >
                &times;
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Update Item Popup */}
      <AnimatePresence>
        {showUpdatePopup && (
          <UpdateItemPopup
            isOpen={showUpdatePopup}
            onClose={() => setShowUpdatePopup(false)}
            partData={selectedPart}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageParts;
