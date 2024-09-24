import React, { useState } from 'react';
// import Spinner from '../../Components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Spinner from './Spinner';
import './../../assets/css/Dashboard.css';

const AddEmployee = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [DOB, setDOB] = useState('');
  const [NIC, setNIC] = useState('');
  const [Address, setAddress] = useState('');
  const [BasicSalary, setBasicsalary] = useState('');
  const [ContactNo, setContactNo] = useState('');
  const [Email, setEmail] = useState('');
  const [Designation, setDesignation] = useState('')
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  
  const handleAddEmployee = () => {

    if(!employeeName || !DOB || !NIC || !Address || !BasicSalary || !ContactNo || !Email || !Designation){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all required fields.',
    });
    return;
    }

        // Validating employeeName
        // const namePattern = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        // if (!namePattern.test(employeeName)) {
        //   Swal.fire({
        //     type:'text',
        //     icon: 'error',
        //     title: 'Oops...',
        //     text: 'Employee Name should only contain letters.',
        //   });
        //   return;
        // }

        // Validating NIC
        const NICPatternOld = /^[0-9]{9}[vVxX]$/;  
        const NICPatternNew = /^[0-9]{12}$/;       

          if (!NICPatternOld.test(NIC) && !NICPatternNew.test(NIC)) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'NIC should be in the format XXXXXXXXXV (old) or XXXXXXXXXXXX (new)',
            });
            return;
          }

        // Validating Email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(Email)) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please enter a valid Email.',
          });
          return;
        }

        // Validating Contact Number
        const contactNumberPattern = /^[0-9]{10}$/;
        if (!contactNumberPattern.test(ContactNo)) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Contact Number should be in the format XXXXXXXXXX.',
            });
            return;
            }

        //Basic Salary Validation
        const basicSalaryPattern = /^[1-9][0-9]*(\.\d+)?$/; // Pattern to validate positive numbers greater than 0

            if (!basicSalaryPattern.test(BasicSalary)) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Basic Salary must be a positive number greater than 0.',
              });
              return;
            }

        

    const data = {
      employeeName,
      DOB,
      NIC,
      Address,
      BasicSalary,
      ContactNo,
      Email,
      Designation,
    };

    console.log("Data to be sent:", data); // Debugging

    setLoading(true);
    axios
      .post('http://localhost:5555/Employee', data)
      .then(() => {
        setLoading(false);
        Swal.fire({
          title: 'Add Employee Success..',
          text: 'You have successfully Add in',
          icon: 'success',
          confirmButtonText: 'OK',
          //cancelButtonAriaLabel: 'cancel',
          showCancelButton: false,
          timer:4000,
          })
        navigate('/employee-management/');
        return;
        // alert('Details Update Sussces.')
        
      })
      .catch((error) => {
        setLoading(false);
        alert("An error happened. Please check the console.");
        console.log(error);
      });
  };

  return (
    <div className='form-container'>
  <h1 className='form-title'>Add Employee</h1>

  {loading && <Spinner />}
  
  <div className="form-content">
    <div className="form-group">
      <label className='form-label'>Employee Name</label>
      <input  
      type="text" 
      value={employeeName} 
      onChange={(e) => {
        const onlyText = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        setEmployeeName(onlyText);
      }} className='form-input' />
    </div>

    <div className="form-group">
          <label className="form-label">Date Of Birth</label>
          <input
            type="date"
            value={DOB}
            onChange={(e) => {
              const selectedDate = new Date(e.target.value);
              const today = new Date();
              
              // Calculate the difference in years between today and selected date
              const age = today.getFullYear() - selectedDate.getFullYear();
              const monthDiff = today.getMonth() - selectedDate.getMonth();
              const dayDiff = today.getDate() - selectedDate.getDate();

              // If the person is younger than 18, display error
              if (age < 18 || (age === 18 && (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)))) {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Employee must be at least 18 years old.',
                });
                return;
              }

              // If valid, set the DOB state
              setDOB(e.target.value);
            }}
            className="form-input"
          />
</div>

    <div className="form-group">
      <label className='form-label'>NIC</label>
      <input type="text" value={NIC} 
        onChange={(e) => setNIC(e.target.value)}
        className='form-input' />
    </div>

    <div className="form-group">
      <label className='form-label'>Address</label>
      <input type="text" value={Address} 
        onChange={(e) => setAddress(e.target.value)}
        className='form-input' />
    </div>

    <div className="form-group">
      <label className='form-label'>Basic Salary</label>
      <input type="number" value={BasicSalary} 
        onChange={(e) => setBasicsalary(e.target.value)}
        className='form-input' />
    </div>

    <div className="form-group">
      <label className='form-label'>Contact Number</label>
      <input type="text" value={ContactNo} 
        onChange={(e) => setContactNo(e.target.value)}
        className='form-input' />
    </div>

    <div className="form-group">
      <label className='form-label'>Email</label>
      <input type="email" value={Email} 
        onChange={(e) => setEmail(e.target.value)}
        className='form-input' />
    </div>

    <div className="form-group">
      <label className='form-label'>Designation</label>
      <input  
      type="text" 
      value={Designation} 
      onChange={(e) => {
        const onlyText = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        setDesignation(onlyText);
      }} className='form-input' />
    </div>

    <button className='form-button' onClick={handleAddEmployee}>
      Add Employee
    </button>
    
    {/* <Link to="/Attemdence/dashbord" className="btn-secondary">
            Cancel
        </Link> */}
   
  </div>
</div>

  );
};

export default AddEmployee;
