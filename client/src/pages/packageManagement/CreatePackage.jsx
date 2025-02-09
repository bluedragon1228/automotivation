import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import { storage, ref, uploadBytes, getDownloadURL } from "./../../firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const CreatePackage = () => {
  const [pkgID, setPkgId] = useState("");
  const [pkgName, setPkgName] = useState("");
  const [pkgDes, setPkgDes] = useState("");
  const [pkgPrice, setPkgPrice] = useState(""); //add field
  const [pkgImg, setPkgImg] = useState(null);
  const [pkgServ, setPkgServ] = useState([
    {
      id: uuidv4(),
      key: "",
      name: "",
    },
  ]);

  const [imageURL, setImageURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [descriptionWordCount, setDescriptionWordCount] = useState(100); // Initialize word count

  const handleAddService = () => {
    setPkgServ([...pkgServ, { id: uuidv4(), key: "", value: "" }]);
  };

  const handleServiceChange = (id, field, value) => {
    setPkgServ(
      pkgServ.map((feature) =>
        feature.id === id ? { ...feature, [field]: value } : feature
      )
    );
  };

  const handleRemoveFeature = (id) => {
    setPkgServ(pkgServ.filter((feature) => feature.id !== id));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setPkgImg(e.target.files[0]);
    }
  };

  const uploadImage = async (file) => {
    try {
      const imageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const generatePkgId = () => {
    const id = `PKG${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`;
    setPkgId(id);
  };

  useEffect(() => {
    generatePkgId();
  }, []);

  const validateForm = () => {
    const errors = {};
    const textOnlyRegex = /^[A-Za-z\s]+$/;

    pkgServ.forEach((service, index) => {
      if (!service.name) {
        errors[
          `serviceName${index}`
        ] = `Service name is required for service #${index + 1}`;
      } else if (!textOnlyRegex.test(service.name)) {
        errors[
          `serviceName${index}`
        ] = `Service name can only contain letters and spaces for service #${
          index + 1
        }`;
      }
    });

    if (!pkgPrice) {
      errors.pkgPrice = "Package price is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDescriptionChange = (e) => {
    const words = e.target.value.trim().split(/\s+/).length;
    if (words <= 100) {
      setPkgDes(e.target.value);
      setDescriptionWordCount(100 - words);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire({
        title: "Error!",
        text: "Please fill correctly in the required fields.",
        icon: "error",
      });
      return;
    }

    setLoading(true);
    try {
      let imageUrl = "";
      if (pkgImg) {
        imageUrl = await uploadImage(pkgImg);
        setImageURL(imageUrl);
      }

      await axios.post("http://localhost:3000/api/maintance/add", {
        pkgID,
        pkgName, //add field
        pkgDes,
        pkgPrice,
        imageURL: imageUrl,
        pkgServ,
      });
      Swal.fire({
        title: "Success!",
        text: "Package added successfully.",
        icon: "success",
      });

      console.log(imageUrl);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to add Package.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4">
      <div className="p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-dark text-2xl font-bold mb-6">
          Create Maintenance Package
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-dark block mb-2">Package Id</label>
            <input
              type="text"
              className="w-full p-2 border border-dark rounded"
              value={pkgID}
              readOnly
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-dark block mb-2">Package Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={pkgName}
              onChange={(e) => {
                const p = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                {
                  /*add field */
                }
                setPkgName(p);
              }}
              required
            />
            {formErrors.pkgName && (
              <span className="text-red-500 text-sm">{formErrors.pkgName}</span>
            )}
          </div>

          <div className="mb-4">
            <label className="text-dark block mb-2">Description</label>
            <textarea
              className="w-full p-2 border border-dark rounded"
              value={pkgDes}
              onChange={handleDescriptionChange}
              rows="3"
            />
            <p className="text-sm text-red-500">
              {descriptionWordCount} words remaining
            </p>
          </div>
          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label className="text-dark block mb-2">Price</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={pkgPrice}
                onChange={(e) => {
                  const value = e.target.value;

                  // Regular expression to allow only up to 2 decimal places
                  const isValid = /^\d*(\.\d{0,2})?$/.test(value);

                  // Only update if the value is valid and a positive number
                  if (isValid && Number(value) >= 0) {
                    setPkgPrice(value);
                  }
                }}
                min="0" // Prevents negative numbers
                step="0.01" // Ensures input increments/decrements by 0.01
                required
              />
              {formErrors.pkgPrice && (
                <span className="text-red-500 text-sm">
                  {formErrors.pkgPrice}
                </span>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="text-dark block mb-2">Services</label>
            {pkgServ.map((pkg, index) => (
              <div key={pkg.id}>
                <div className="mb-2 flex items-center">
                  {/* Service ID Input (Numbers Only) */}
                  <input
                    type="text"
                    className="w-1/2 p-2 border border-dark rounded"
                    placeholder="Service Id"
                    value={pkg.key}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        handleServiceChange(pkg.id, "key", value); // Only update if the value is a number
                      }
                    }}
                  />

                  {/* Service Name Input (Letters and Spaces Only) */}
                  <input
                    type="text"
                    className="w-1/2 p-2 border border-dark rounded ml-2"
                    placeholder="Service Name"
                    value={pkg.name}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[A-Za-z\s]*$/.test(value)) {
                        handleServiceChange(pkg.id, "name", value); // Only update if the value contains letters and spaces
                      }
                    }}
                  />

                  {/* Remove Button */}
                  <button
                    type="button"
                    className="ml-2 text-red-500"
                    onClick={() => handleRemoveFeature(pkg.id)}
                  >
                    Remove
                  </button>
                </div>

                {/* Service Name Error Handling */}
                {formErrors[`serviceName${index}`] && (
                  <span className="text-red-500 text-sm">
                    {formErrors[`serviceName${index}`]}
                  </span>
                )}
              </div>
            ))}

            {/* Add Service Button */}
            <button
              type="button"
              className="text-blue-500"
              onClick={handleAddService}
            >
              Add Service
            </button>
          </div>

          <div className="mb-4">
            <label className="text-dark block mb-2">Image</label>
            <input
              type="file"
              className="w-full p-2 border border-dark rounded"
              onChange={handleImageChange}
            />
          </div>
          <button
            type="submit"
            className={`w-full p-2 border border-dark rounded ${
              loading ? "bg-gray-500" : "bg-blue-500 text-white"
            }`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Create New Package"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePackage;
