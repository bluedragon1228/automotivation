import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";
import { motion } from "framer-motion";

const InventoryReport = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [totalStock, setTotalStock] = useState(0);
  const [isStockExcellent, setIsStockExcellent] = useState(false);
  const [downloadType, setDownloadType] = useState("pdf");
  const [loading, setLoading] = useState(true);

  // Fallback in case the environment variable isn't available
  const companyLogoBase64 =
    "data:image/png;base64,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";

  useEffect(() => {
    // Fetch inventory data from API
    const fetchInventoryData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/spareparts");
        const data = await response.json();
        setInventoryData(data);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryData();
  }, []);

  useEffect(() => {
    if (inventoryData.length > 0) {
      // Calculate total stock and low stock items
      const total = inventoryData.reduce((sum, item) => sum + item.quantity, 0);
      const lowStock = inventoryData.filter((item) => item.quantity < 20);
      setLowStockItems(lowStock);
      setTotalStock(total);
      setIsStockExcellent(total / inventoryData.length > 50); // Example stock level check
    }
  }, [inventoryData]);

  const generatePDF = () => {
    const doc = new jsPDF();

    // Check if the logo exists before trying to add it
    if (companyLogoBase64) {
      // Ensure the Base64 string starts with the correct data prefix
      const imgBase64 = companyLogoBase64.startsWith("data:image/png;base64,")
        ? companyLogoBase64
        : `data:image/png;base64,${companyLogoBase64}`;

      // Add the image at the top of the PDF (x, y, width, height)
      doc.addImage(imgBase64, "PNG", 50, 10, 120, 30); // Adjust x, y, width, height as needed
    } else {
      console.warn("Company logo not found.");
    }

    doc.setFontSize(18);
    doc.text("Inventory Report", 75, 50);

    // Add report details
    doc.setFontSize(12);
    doc.text(`Total Items: ${inventoryData.length}`, 10, 70); // Adjust position because of the logo
    doc.text(`Low Stock Items: ${lowStockItems.length}`, 10, 80);
    doc.text(
      `Stock Level: ${isStockExcellent ? "Excellent" : "Needs Attention"}`,
      10,
      90
    );

    // Add table
    doc.autoTable({
      head: [
        ["Name", "Supplier", "Price", "Quantity", "Category", "Type", "Total"],
      ],
      body: inventoryData.map((item) => [
        item.partName,
        item.supplier,
        `$${item.price.toFixed(2)}`,
        item.quantity,
        item.category,
        item.type,
        `$${(item.price * item.quantity).toFixed(2)}`,
      ]),
      startY: 100, // Adjust startY to ensure it is below the logo
    });

    // Add signature at the bottom
    doc.text(
      "Stock Manager Signature: ____________________",
      10,
      doc.internal.pageSize.height - 20
    );

    // Save the PDF
    doc.save("inventory_report.pdf");
  };

  const generateCSV = () => {
    const csvData = [
      ["Name", "Supplier", "Price", "Quantity", "Category", "Type", "Total"],
      ...inventoryData.map((item) => [
        item.partName,
        item.supplier,
        item.price.toFixed(2),
        item.quantity,
        item.category,
        item.type,
        (item.price * item.quantity).toFixed(2),
      ]),
    ];
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "inventory_report.csv");
    link.click();
  };

  const handleDownload = () => {
    if (downloadType === "pdf") {
      generatePDF();
    } else {
      generateCSV();
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-PrimaryColor rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-dark mb-4">Inventory Report</h2>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        {/* Summary info as cards */}
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-2">Total Items</h3>
          <p className="text-2xl">{inventoryData.length}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-2">Low Stock Items</h3>
          <p className="text-2xl">{lowStockItems.length}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-2">Stock Level</h3>
          <p
            className={`text-2xl ${
              isStockExcellent ? "text-green-600" : "text-red-600"
            }`}
          >
            {isStockExcellent ? "Excellent" : "Needs Attention"}
          </p>
        </div>
      </motion.div>

      {/* Download options */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <label className="block mb-2">Download Report As:</label>
        <select
          value={downloadType}
          onChange={(e) => setDownloadType(e.target.value)}
          className="p-2 border border-dark rounded"
        >
          <option value="pdf">PDF</option>
          <option value="csv">CSV</option>
        </select>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="p-3 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-800"
        onClick={handleDownload}
      >
        Download Report
      </motion.button>

      {/* Inventory Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6"
      >
        <h3 className="text-xl font-semibold mb-4">Inventory Items</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Supplier</th>
                <th className="py-2 px-4">Price</th>
                <th className="py-2 px-4">Quantity</th>
                <th className="py-2 px-4">Category</th>
                <th className="py-2 px-4">Type</th>
                <th className="py-2 px-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((item) => (
                <tr key={item._id} className="text-center">
                  <td className="py-2 px-4">{item.partName}</td>
                  <td className="py-2 px-4">{item.supplier}</td>
                  <td className="py-2 px-4">${item.price.toFixed(2)}</td>
                  <td className="py-2 px-4">{item.quantity}</td>
                  <td className="py-2 px-4">{item.category}</td>
                  <td className="py-2 px-4">{item.type}</td>
                  <td className="py-2 px-4">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default InventoryReport;
