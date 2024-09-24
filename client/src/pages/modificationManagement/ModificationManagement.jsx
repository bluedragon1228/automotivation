import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaEdit } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ModificationReport from "./ModificationReport";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";

const ModificationManagement = () => {
  const navigate = useNavigate();
  const [modifications, setModifications] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredMods, setFilteredMods] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleUpdateClick = (id) => {
    navigate(`/modification-management/update/${id}`);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    const fetchModifications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/mod/getMod"
        );
        setModifications(response.data);
      } catch (error) {
        console.error("Error fetching modifications:", error);
      }
    };
    fetchModifications();
  }, []);

  useEffect(() => {
    const filtered = modifications.filter((item) => {
      const modificationDate = dayjs(item.date);
      const matchesDateRange =
        (!startDate || modificationDate.isAfter(startDate, "day")) &&
        (!endDate || modificationDate.isBefore(endDate, "day"));
      return (
        item.customerName.toLowerCase().includes(searchValue.toLowerCase()) &&
        matchesDateRange
      );
    });
    setFilteredMods(filtered);
  }, [searchValue, modifications, startDate, endDate]);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You will not be able to recover this modification",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:3000/api/mod/delMod/${id}`);
        setModifications(modifications.filter((mod) => mod._id !== id));
        Swal.fire("Deleted!", "The modification has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting modification:", error);
      Swal.fire(
        "Error",
        "An error occurred while deleting the modification.",
        "error"
      );
    }
  };

  return (
    <div className="p-8">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-ExtraDarkColor">
          Modification Management
        </h1>
        <input
          type="text"
          placeholder="Search..."
          className="bg-SecondaryColor rounded-md p-2 w-64 outline-none"
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <div className="flex items-center space-x-4">
          <PDFDownloadLink
            document={<ModificationReport packages={filteredMods} />}
            fileName="filtered-modifications.pdf"
          >
            {({ loading }) => (
              <button
                className="bg-DarkColor text-white px-4 py-2 rounded-md shadow hover:bg-ExtraDarkColor transition-colors duration-300"
                disabled={loading}
              >
                {loading ? "Generating PDF..." : "Generate Report"}
              </button>
            )}
          </PDFDownloadLink>
        </div>
      </div>

      {/* Date Filter */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-ExtraDarkColor mb-4">
          Filter by Date
        </h2>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="flex space-x-4">
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>
        </LocalizationProvider>
      </div>

      {/* Modification Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <motion.div
          className="bg-SecondaryColor p-6 rounded-lg shadow-lg flex items-center space-x-4"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <FaEdit className="text-3xl text-DarkColor" />
          <div>
            <h2 className="text-lg font-bold text-ExtraDarkColor">
              Total Modifications
            </h2>
            <p className="text-2xl font-semibold text-DarkColor">
              {modifications.length}
            </p>
          </div>
        </motion.div>

        <motion.div
          className="bg-SecondaryColor p-6 rounded-lg shadow-lg flex items-center space-x-4"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <FaCalendarAlt className="text-3xl text-DarkColor" />
          <div>
            <h2 className="text-lg font-bold text-ExtraDarkColor">
              Recent Modifications
            </h2>
            <p className="text-2xl font-semibold text-DarkColor">15</p>
          </div>
        </motion.div>
      </div>

      {/* Modification Table */}
      <div className="mt-12 bg-SecondaryColor p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-ExtraDarkColor mb-6">
          Modification Details
        </h2>
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-DarkColor text-white">
            <tr>
              <th className="py-3 px-2 text-left">CusName</th>
              <th className="py-3 px-2 text-left">Email</th>
              <th className="py-3 px-2 text-left">Model</th>
              <th className="py-3 px-2 text-left">Vehical No</th>
              <th className="py-3 px-2 text-left">Mod Type</th>
              <th className="py-3 px-2 text-left">Date</th>
              <th className="py-3 px-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredMods.map((item) => (
              <tr
                key={item._id}
                className="border-b hover:bg-PrimaryColor transition-colors duration-300"
              >
                <td className="py-3 px-2 text-ExtraDarkColor">
                  {item.customerName}
                </td>

                <td className="py-3 px-2 text-ExtraDarkColor">
                  {item.customerEmail}
                </td>
                <td className="py-3 px-2 text-ExtraDarkColor">
                  {item.vehicleModel}
                </td>
                <td className="py-3 px-2 text-ExtraDarkColor">
                  {item.vehicleNumber}
                </td>
                <td className="py-3 px-2 text-ExtraDarkColor">
                  {item.modificationType}
                </td>
                <td className="py-3 px-2 text-ExtraDarkColor">{item.date}</td>
                <td className="py-3 px-2 text-ExtraDarkColor">
                  <button
                    className="bg-pink-600 text-white mt-1 ml-2 inline-block px-8 py-2.5 text-sm uppercase rounded-full shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg active:translate-y-px active:shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item._id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModificationManagement;
