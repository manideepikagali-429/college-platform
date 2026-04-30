const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
mongoose.connect(process.env.MONGO_URI)

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

const collegeSchema = new mongoose.Schema({
  name: String,
  location: String,
  fees: Number,
  rating: Number,
  placement: String,
  courses: [String],
  description: String,
});

const College = mongoose.model("College", collegeSchema);

app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully");
});

app.get("/api/seed", async (req, res) => {
  try {
    await College.deleteMany();

    await College.insertMany([
      {
        name: "VVIT",
        location: "Guntur",
        fees: 80000,
        rating: 4.2,
        placement: "85%",
        courses: ["CSE", "IT", "ECE"],
        description:
          "VVIT is a well-known engineering college in Guntur with good academic environment and placement support.",
      },
      {
        name: "SRM University",
        location: "Chennai",
        fees: 250000,
        rating: 4.5,
        placement: "90%",
        courses: ["CSE", "AIML", "ECE"],
        description:
          "SRM University offers modern infrastructure, multiple engineering courses, and good placement opportunities.",
      },
      {
        name: "VIT University",
        location: "Vellore",
        fees: 300000,
        rating: 4.6,
        placement: "92%",
        courses: ["CSE", "Data Science", "EEE"],
        description:
          "VIT University is popular for engineering education, strong campus placements, and technical learning.",
      },
      {
        name: "KL University",
        location: "Vijayawada",
        fees: 220000,
        rating: 4.3,
        placement: "88%",
        courses: ["CSE", "AI", "IoT"],
        description:
          "KL University provides industry-oriented education, skill-based learning, and placement training.",
      },
      {
        name: "Andhra University",
        location: "Visakhapatnam",
        fees: 60000,
        rating: 4.1,
        placement: "80%",
        courses: ["CSE", "Civil", "Mechanical"],
        description:
          "Andhra University is one of the oldest universities in Andhra Pradesh with affordable education.",
      },
    ]);

    res.send("✅ College data inserted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("❌ Error inserting college data");
  }
});

app.get("/api/colleges", async (req, res) => {
  try {
    const colleges = await College.find();
    res.json(colleges);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching colleges" });
  }
});

app.get("/api/colleges/:id", async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    res.json(college);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "College not found" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});