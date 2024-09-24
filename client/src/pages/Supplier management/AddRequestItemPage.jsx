import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const AddRequestItemPage = () => {
  const [requestID, setRequestID] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [requestDate, setRequestDate] = useState("");
  const [itemName, setItemName] = useState("");
  const [brand, setBrand] = useState("");
  const [quantity, setQuantity] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/suppliers');
        setSuppliers(response.data.data.filter(supplier => supplier.status === 'approved'));
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    const fetchParts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/api/spareparts");
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching parts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
    fetchParts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send request item data to backend API
      await axios.post("http://localhost:3000/requestItems/", {
        requestID,
        supplierName,
        requestDate,
        itemName,
        brand,
        quantity,
      });

      Swal.fire({
        title: "Success!",
        text: "Request item added successfully.",
        icon: "success",
      });

      // Clear the form fields after successful submission
      setRequestID("");
      setSupplierName("");
      setRequestDate("");
      setItemName("");
      setBrand("");
      setQuantity("");
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to add request item.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-PrimaryColor min-h-screen flex justify-center items-center p-4">
      <div className="bg-SecondaryColor p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-dark text-3xl font-bold mb-6 bg-gray-800 text-white">
          Add Request Item
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-dark block mb-2">Request ID</label>
            <input
              type="text"
              className="w-full p-2 border border-dark rounded"
              value={requestID}
              onChange={(e) => setRequestID(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-dark block mb-2">Supplier Name</label>
            <select
              className="w-full p-2 border border-dark rounded"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
              required
            >
              <option value="" disabled>Select Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier._id} value={supplier.SupplierName}>
                  {supplier.SupplierName}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="text-dark block mb-2">Request Date</label>
            <input
              type="date"
              className="w-full p-2 border border-dark rounded"
              value={requestDate}
              onChange={(e) => setRequestDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]} // Setting the min date to today
              required
            />
          </div>

          <div className="mb-4">
            <label className="text-dark block mb-2">Item Name</label>
            <select
              className="w-full p-2 border border-dark rounded"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            >
              <option value="" disabled>Select Item</option>
              {items.map((item) => (
                <option key={item._id} value={item.itemName}>
                  {item.partName}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="text-dark block mb-2">Brand</label>
            <input
              type="text"
              className="w-full p-2 border border-dark rounded"
              value={brand}
              onChange={(e) => {
                const value = e.target.value;
                // Allow only letters and spaces
                const regex = /^[A-Za-z\s]*$/;
                if (regex.test(value)) {
                  setBrand(value);
                }
              }}
            />
          </div>

          <div className="mb-4">
            <label className="text-dark block mb-2">Quantity</label>
            <input
              type="number"
              className="w-full p-2 border border-dark rounded"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min={1}
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full p-2 border border-dark rounded ${loading ? "bg-gray-500" : "bg-blue-500 text-white"
              }`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Request Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRequestItemPage;
