const express = require("express");
const cors = require("cors");
const connectDB = require("./db/conn");
const userRouter = require("./routes/userRoutes");
const doctorRouter = require("./routes/doctorRoutes");
const appointRouter = require("./routes/appointRoutes");
const notificationRouter = require("./routes/notificationRouter");

const app = express();
const port = process.env.PORT || 5015;
connectDB();

const allowedOrigins= [
    "http://localhost:5173",
    "https://doc-care-frontend.vercel.app",
    "https://www.doc-care-frontend.vercel.app",
    "http://doc-care-frontend.vercel.app",
    "https://www.doc-care-frontend.vercel.app",
  ];
  

// Middlewares
app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }
}));

app.use(express.json());

// Root Endpoint
app.get("/", (req, res) => {
    res.json({ message: "Hello from Doc-Care Server!" });
});

// Other Endpoints
app.use("/api/user", userRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/appointment", appointRouter);
app.use("/api/notification", notificationRouter);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

