const Doctor = require("../models/doctorModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const Appointment = require("../models/appointmentModel");

const getalldoctors = async (req, res) => {
  try {
    console.log("Fetching all doctors...");
    let docs;
    if (!req.locals) {
      console.log("No user context found. Fetching all doctors.");
      docs = await Doctor.find({ isDoctor: true }).populate("userId");
    } else {
      console.log(`Fetching doctors excluding: ${req.locals}`);
      docs = await Doctor.find({ isDoctor: true })
        .find({ _id: { $ne: req.locals } })
        .populate("userId");
    }
    console.log("Doctors fetched successfully:", docs);
    return res.send(docs);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).send("Unable to get doctors");
  }
};

const getnotdoctors = async (req, res) => {
  try {
    console.log("Fetching non-doctors...");
    const docs = await Doctor.find({ isDoctor: false })
      .find({ _id: { $ne: req.locals } })
      .populate("userId");
    console.log("Non-doctors fetched successfully:", docs);
    return res.send(docs);
  } catch (error) {
    console.error("Error fetching non-doctors:", error);
    res.status(500).send("Unable to get non-doctors");
  }
};

const applyfordoctor = async (req, res) => {
  try {
    console.log("Doctor application request received:", req.body);
    const alreadyFound = await Doctor.findOne({ userId: req.locals });
    if (alreadyFound) {
      console.log("Application already exists for user:", req.locals);
      return res.status(400).send("Application already exists");
    }

    console.log("Creating new doctor application...");
    const doctor = new Doctor({ ...req.body.formDetails, userId: req.locals });
    const result = await doctor.save();
    console.log("Application saved successfully:", result);

    return res.status(201).send("Application submitted successfully");
  } catch (error) {
    console.error("Error submitting doctor application:", error);
    res.status(500).send("Unable to submit application");
  }
};

const acceptdoctor = async (req, res) => {
  try {
    console.log("Accepting doctor application for user:", req.body.id);
    
    const user = await User.findOneAndUpdate(
      { _id: req.body.id },
      { isDoctor: true, status: "accepted" }
    );
    console.log("User updated:", user);

    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.body.id },
      { isDoctor: true }
    );
    console.log("Doctor record updated:", doctor);

    const notification = new Notification({
      userId: req.body.id,
      content: `Congratulations, Your application has been accepted.`,
    });

    await notification.save();
    console.log("Notification sent successfully");

    return res.status(201).send("Application accepted notification sent");
  } catch (error) {
    console.error("Error while sending acceptance notification:", error);
    res.status(500).send("Error while sending notification");
  }
};

const rejectdoctor = async (req, res) => {
  try {
    console.log("Rejecting doctor application for user:", req.body.id);
    
    const details = await User.findOneAndUpdate(
      { _id: req.body.id },
      { isDoctor: false, status: "rejected" }
    );
    console.log("User updated with rejection status:", details);

    const delDoc = await Doctor.findOneAndDelete({ userId: req.body.id });
    console.log("Doctor record deleted:", delDoc);

    const notification = new Notification({
      userId: req.body.id,
      content: `Sorry, Your application has been rejected.`,
    });

    await notification.save();
    console.log("Rejection notification sent successfully");

    return res.status(201).send("Application rejection notification sent");
  } catch (error) {
    console.error("Error while rejecting application:", error);
    res.status(500).send("Error while rejecting application");
  }
};

const deletedoctor = async (req, res) => {
  try {
    console.log("Deleting doctor with userId:", req.body.userId);

    const result = await User.findByIdAndUpdate(req.body.userId, {
      isDoctor: false,
    });
    console.log("User updated to non-doctor:", result);

    const removeDoc = await Doctor.findOneAndDelete({
      userId: req.body.userId,
    });
    console.log("Doctor record deleted:", removeDoc);

    const removeAppoint = await Appointment.findOneAndDelete({
      userId: req.body.userId,
    });
    console.log("Associated appointment deleted:", removeAppoint);

    return res.send("Doctor deleted successfully");
  } catch (error) {
    console.error("Error while deleting doctor:", error);
    res.status(500).send("Unable to delete doctor");
  }
};

module.exports = {
  getalldoctors,
  getnotdoctors,
  deletedoctor,
  applyfordoctor,
  acceptdoctor,
  rejectdoctor,
};
