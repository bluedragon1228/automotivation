import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate, useParams } from 'react-router-dom';
import Spinner from "./Spinner";

const UpdateSalary = () => {
    const { id } = useParams(); // Assuming you're using React Router to get the employee ID from the URL
    const [employeeName, setEmployeeName] = useState('');
    const [NIC, setNIC] = useState('');
    const [formDate, setFormDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [totalOThours, setTotalOThours] = useState(0);
    const [totalOTpay, setTotalOTpay] = useState(0);
    const [basicSalary, setBasicSalary] = useState(0);
    const [totalSalary, setTotalSalary] = useState(0);
    const [employees, setEmployees] = useState([]);
    const [employeesAttendance, setEmployeesAttendance] = useState([]);
    const [selectEmployee, setSelectEmployee] = useState({
        employeeID: '',
        NIC: '',
        employeeName: '',
    });
    const [loading, setLoading] = useState(false);
    const [includeEPF, setIncludeEPF] = useState(false);
    const navigate = useNavigate();

    // Get the employee data when the component mounts
    useEffect(() => {
        setLoading(true);
        axios
            .post(`http://localhost:5555/EmployeeSalary/${id}`)
            .then((res) => {
                setEmployeeName(res.data.employeeName);
                setNIC(res.data.NIC);
                setFormDate(res.data.formDate);
                setToDate(res.data.toDate);
                setTotalOThours(res.data.totalOThours);
                setTotalOTpay(res.data.totalOTpay);
                setBasicSalary(res.data.BasicSalary);
                setTotalSalary(res.data.TotalSalary);
            })
            .catch((error) => {
                setLoading(false);
                console.error(error);
            });
    }, [id]);

    // Get employee data
    useEffect(() => {
        axios.get('http://localhost:5555/employees')
            .then((res) => {
                setEmployees(res.data);
            })
            .catch((error) => console.error(error));
    }, []);

    // Handle employee selection based on NIC
    const handleNIC = (e) => {
        const selectedNIC = e.target.value;
        const selectedEmployee = employees.find(emp => emp.NIC === selectedNIC);
        if (selectedEmployee) {
            setSelectEmployee({
                ...selectEmployee,
                NIC: selectedNIC,
                employeeName: selectedEmployee.employeeName,
                employeeID: selectedEmployee._id,
            });
            setBasicSalary(selectedEmployee.BasicSalary);
        }
    };

    // Handle employee selection based on name
    const handleEmployeeName = (e) => {
        const selectedEmployeeName = e.target.value;
        const selectedEmployee = employees.find(emp => emp.employeeName === selectedEmployeeName);
        if (selectedEmployee) {
            setSelectEmployee({
                ...selectEmployee,
                NIC: selectedEmployee.NIC,
                employeeName: selectedEmployeeName,
                employeeID: selectedEmployee._id,
            });
            setBasicSalary(selectedEmployee.BasicSalary);
        }
    };

    // Calculate total overtime hours
    const calculateTotalOtHour = () => {
        const filteredAttendance = employeesAttendance.filter(attendance =>
            attendance.NIC === selectEmployee.NIC &&
            new Date(attendance.date) >= new Date(formDate) &&
            new Date(attendance.date) <= new Date(toDate)
        );

        const totalOtHour = filteredAttendance.reduce((total, attendance) => total + attendance.OTHour, 0);
        setTotalOThours(totalOtHour);
    };

    // Calculate total overtime pay
    const calculateTotalOTpay = () => {
        const calculatedTotalOTpay = totalOThours * 585;
        setTotalOTpay(calculatedTotalOTpay);
    };

    // Calculate total salary
    const calculateTotalSalary = () => {
        let totalSalary = totalOTpay + parseFloat(basicSalary);

        if (includeEPF) {
            const amount = totalSalary * 0.08;
            totalSalary -= amount;
        }
        setTotalSalary(totalSalary);
    };

    // Handle salary submission
    const handleAddEmployeeSalary = async () => {
        if (!selectEmployee.NIC || !selectEmployee.employeeName || !formDate || !toDate || !basicSalary) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill in all required fields.',
            });
            return;
        }

        // Sequentially calculate OT hours, OT pay, and total salary
        calculateTotalOtHour();
        setTimeout(() => {
            calculateTotalOTpay();
            setTimeout(() => {
                calculateTotalSalary();
            }, 100);
        }, 100);

        const data = {
            NIC: selectEmployee.NIC,
            employeeName: selectEmployee.employeeName,
            formDate,
            toDate,
            totalOThours,
            totalOTpay,
            BasicSalary: basicSalary,
            TotalSalary: totalSalary,
        };

        setLoading(true);
        axios
            .put(`http://localhost:5555/EmployeeSalary/${id}`, data)
            .then(() => {
                setLoading(false);
                Swal.fire({
                    title: 'Update Success',
                    text: 'You have successfully updated the salary.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 4000,
                });
                navigate('/employee-management/salary');
            })
            .catch((error) => {
                setLoading(false);
                console.error(error);
            });
    };

    return (
        <div className="attendance-container">
            <h2 className="attendance-title">Update Employee Salary</h2>

            {loading && <Spinner />}

            <div className="form-group">
                <label htmlFor="NIC" className="form-label">Employee NIC</label>
                <select
                    id="NIC"
                    className="form-select"
                    value={setBasicSalary.NIC}
                    onChange={handleNIC}
                >
                    <option value=''>Select NIC</option>
                    {employees.map((employee) => (
                        <option key={employee._id} value={employee.NIC}>
                            {employee.NIC}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="employeeName" className="form-label">Employee Name</label>
                <select
                    id="employeeName"
                    className="form-select"
                    value={selectEmployee.employeeName}
                    onChange={handleEmployeeName}
                >
                    <option value=''>Select Employee Name</option>
                    {employees.map((employee) => (
                        <option key={employee._id} value={employee.employeeName}>
                            {employee.employeeName}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="date" className="form-label">From Date</label>
                <input
                    type="date"
                    className="form-control"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label htmlFor="toDate" className="form-label">To Date</label>
                <input
                    type="date"
                    className="form-control"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label htmlFor="totalOThours" className="form-label">Total OT Hours</label>
                <input
                    type="text"
                    className="form-control"
                    value={totalOThours}
                    readOnly
                />
            </div>

            <div className="form-group">
                <label htmlFor="basicSalary" className="form-label">Basic Salary</label>
                <input
                    className="form-control"
                    type='number'
                    value={basicSalary}
                    onChange={(e) => setBasicSalary(e.target.value)}
                    readOnly
                />
            </div>

            <div className="form-group">
                <label htmlFor="EPF" className="form-label">Include EPF</label>
                <button onClick={() => setIncludeEPF(!includeEPF)}>
                    {includeEPF ? 'Yes' : 'No'}
                </button>
            </div>

            <div className="form-group">
                <label htmlFor="totalOTpay" className="form-label">Total OT Pay</label>
                <input
                    type="text"
                    className="form-control"
                    value={totalOTpay}
                    readOnly
                />
            </div>

            <div className="form-group">
                <label htmlFor="totalSalary" className="form-label">Total Salary</label>
                <input
                    type="text"
                    className="form-control"
                    value={totalSalary}
                    readOnly
                />
                <button 
                    onClick={calculateTotalSalary} 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                >
                    Calculate Total Salary
                </button>
            </div>

            <div className="form-group">
                <button 
                    onClick={handleAddEmployeeSalary} 
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Update Salary
                </button>
                <Link to="/employee-management/salary">
                    <button 
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Cancel
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default UpdateSalary;
