import React, { useState } from "react";
import "../styles/bookappointment.css";
import axios from "axios";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";

const BookAppointment = ({ setModalOpen, ele }) => {
  const [formDetails, setFormDetails] = useState({
    date: "",
    time: "",
    age: "",
    bloodGroup: "",
    gender: "",
    number: "",
    familyDiseases: "",
  });

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails((prev) => ({ ...prev, [name]: value }));
  };

  const bookAppointment = async (e) => {
    e.preventDefault();
    try {
      await toast.promise(
        axios.post(
          "/appointment/bookappointment",
          {
            doctorId: ele?.userId?._id,
            date: formDetails.date,
            time: formDetails.time,
            age: formDetails.age,
            bloodGroup: formDetails.bloodGroup,
            gender: formDetails.gender,
            number: formDetails.number,
            familyDiseases: formDetails.familyDiseases,
            doctorname: `${ele?.userId?.firstname} ${ele?.userId?.lastname}`,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ),
        {
          success: "Appointment booked successfully",
          error: "Unable to book appointment",
          loading: "Booking appointment...",
        }
      );
      setModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h2 className="modal-title">Book Appointment</h2>
          <IoMdClose
            className="modal-close-icon"
            onClick={() => setModalOpen(false)}
          />
        </div>

        <form className="appointment-form" onSubmit={bookAppointment}>
          <input
            type="date"
            name="date"
            value={formDetails.date}
            onChange={inputChange}
            className="form-control"
            required
          />
          <input
            type="time"
            name="time"
            value={formDetails.time}
            onChange={inputChange}
            className="form-control"
            required
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formDetails.age}
            onChange={inputChange}
            className="form-control"
            required
          />
          <input
            type="text"
            name="bloodGroup"
            placeholder="Blood Group (Optional)"
            value={formDetails.bloodGroup}
            onChange={inputChange}
            className="form-control"
          />
          <select
            name="gender"
            value={formDetails.gender}
            onChange={inputChange}
            className="form-control"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input
            type="number"
            name="number"
            placeholder="Mobile Number"
            value={formDetails.number}
            onChange={inputChange}
            className="form-control"
            required
          />
          <textarea
            name="familyDiseases"
            placeholder="Family Diseases"
            value={formDetails.familyDiseases}
            onChange={inputChange}
            className="form-control"
          ></textarea>

          <button type="submit" className="form-button">
            Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
