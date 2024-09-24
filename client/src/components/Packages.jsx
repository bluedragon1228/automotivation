import React, { useEffect, useState } from "react";
import img from "../assets/EventCalender.png";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Packages = () => {
  const [maintancePkgs, setmaintancePkgs] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMaintaincePkgs = async () => {
      try {
        const pkgs = await axios.get("http://localhost:3000/api/maintance/get");
        setmaintancePkgs(pkgs.data);
      } catch (error) {
        console.error("Error fetching repair estimates:", error);
      }
    };
    fetchMaintaincePkgs();
  }, []);

  const handleClickCard = () => {};
  const handleBooking = (id) => {
    navigate(`/book/add/${id}`);
  };
  return (
    <section className="bg-gray-100 py-10 px-6 pt-28">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold">Maintenance Packages</h2>
        <p className="text-gray-600">
          Keep your vehicle running at its best with our tailored maintenance
          packages.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ml-20 mr-20">
        {maintancePkgs.map((pkg, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md overflow-hidden"
            onClick={handleClickCard}
          >
            <img
              src={pkg.imageURL}
              alt={pkg.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{pkg.pkgName}</h3>
              <p className="text-gray-700 mb-4">{pkg.pkgDes}</p>
              <div className="flex">
                <h4 className="bg-red-400 text-white font-bold py-2 px-4 rounded-lg w-36 mr-5">
                  Rs. {pkg.pkgPrice}
                </h4>
                <button
                  className="bg-green-400 text-white font-bold py-2 px-4 rounded-lg"
                  onClick={() => handleBooking(pkg._id)}
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Packages;
