import React, { useState } from "react";
import BookAppointment from "../components/BookAppointment";
import { toast } from "react-hot-toast";
import "../styles/doctorcard.css"; // CSS import

const DoctorCard = ({ ele }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const token = localStorage.getItem("token") || "";

  const handleModal = () => {
    if (!token) {
      return toast.error("You must log in first");
    }
    setModalOpen(true);
  };

  return (
    <div className="doctor-card">
      <img
        src={
          ele?.userId?.pic ||
          "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        }
        alt="Doctor"
        className="doctor-avatar"
      />
      <h3 className="doctor-name">
        Dr. {ele?.userId?.firstname} {ele?.userId?.lastname}
      </h3>
      <p className="doctor-detail">
        <strong>Specialization:</strong> {ele?.specialization}
      </p>
      <p className="doctor-detail">
        <strong>Experience:</strong> {ele?.experience} yrs
      </p>
      <p className="doctor-detail">
        <strong>Fees:</strong> ${ele?.fees}
      </p>
      <p className="doctor-detail doctor-phone">
        <strong>Phone:</strong> {ele?.userId?.mobile}
      </p>
      <button className="appointment-btn" onClick={handleModal}>
        Book Appointment
      </button>

      {modalOpen && <BookAppointment setModalOpen={setModalOpen} ele={ele} />}
    </div>
  );
};

export default DoctorCard;
