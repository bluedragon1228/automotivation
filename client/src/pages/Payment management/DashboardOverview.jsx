import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from "framer-motion";
import { FaMoneyBillWave, FaChartLine } from "react-icons/fa";
import { Link } from 'react-router-dom';

const ShowPayment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:3000/payments')
      .then((response) => {
        setPayments(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error fetching payments");
        setLoading(false);
      });
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Calculate total payments and payment count
  const totalPayments = payments.reduce((sum, payment) => sum + parseFloat(payment.Pamount || 0), 0);
  const paymentCount = payments.length;

  return (
    <div className="p-8">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-ExtraDarkColor">
          Payment Dashboard
        </h1>
        <div className="flex items-center space-x-4">
        <Link to="/payment-management/payment-report">
          <button className="bg-DarkColor text-white px-4 py-2 rounded-md shadow hover:bg-ExtraDarkColor transition-colors duration-300">
            Generate Payment Report
          </button>
        </Link>
        </div>
      </div>

      {/* Payment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <motion.div
          className="bg-SecondaryColor p-6 rounded-lg shadow-lg flex items-center space-x-4"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <FaMoneyBillWave className="text-3xl text-DarkColor" />
          <div>
            <h2 className="text-lg font-bold text-ExtraDarkColor">
              Total Payments
            </h2>
            <p className="text-2xl font-semibold text-DarkColor">
              Rs. {totalPayments.toFixed(2)} 
            </p>
          </div>
        </motion.div>

        <motion.div
          className="bg-SecondaryColor p-6 rounded-lg shadow-lg flex items-center space-x-4"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <FaChartLine className="text-3xl text-DarkColor" />
          <div>
            <h2 className="text-lg font-bold text-ExtraDarkColor">Payment Count</h2>
            <p className="text-2xl font-semibold text-DarkColor">{paymentCount}</p>
          </div>
        </motion.div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center mt-6 text-DarkColor">Loading...</div>
      ) : error ? (
        <div className="text-center mt-6 text-red-500">{error}</div>
      ) : (
        <>
          {/* Payment Details */}
          <div className="mt-12 bg-SecondaryColor p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-ExtraDarkColor mb-6">
              Payment Details
            </h2>
            <div className="max-h-96 overflow-y-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-DarkColor text-white">
                  <tr>
                    <th className="py-3 px-5 text-left">Payment ID</th>
                    <th className="py-3 px-5 text-left">Customer Name</th>
                    <th className="py-3 px-5 text-left">Vehicle Number</th>
                    <th className="py-3 px-5 text-left">Payment Date</th>
                    <th className="py-3 px-5 text-left">Payment Method</th>
                    <th className="py-3 px-5 text-left">Booking_Id</th>
                    <th className="py-3 px-5 text-left">Package</th>
                    <th className="py-3 px-5 text-left">Package Amount</th>
                    <th className="py-3 px-5 text-left">Customer Email</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr
                      key={payment.PaymentId}
                      className="border-b hover:bg-PrimaryColor transition-colors duration-300"
                    >
                      <td className="py-3 px-5 text-ExtraDarkColor">
                        {payment.PaymentId}
                      </td>
                      <td className="py-3 px-5 text-ExtraDarkColor">
                        {payment.cusName}
                      </td>
                      <td className="py-3 px-5 text-ExtraDarkColor">
                        {payment.Vehicle_Number}
                      </td>
                      <td className="py-3 px-5 text-ExtraDarkColor">
                        {payment.PaymentDate}
                      </td>
                      <td className="py-3 px-5 text-ExtraDarkColor">
                        {payment.PaymentMethod}
                      </td>
                      <td className="py-3 px-5 text-ExtraDarkColor">
                        {payment.Booking_Id}
                      </td>
                      <td className="py-3 px-5 text-ExtraDarkColor">
                        {payment.Package}
                      </td>
                      <td className="py-3 px-5 text-extraDarkColor">
                        {payment.Pamount}
                      </td>
                      <td className="py-3 px-5 text-extraDarkColor">
                        {payment.email}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ShowPayment;
