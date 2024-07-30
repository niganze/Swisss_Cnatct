// controllers/schoolController.js
import { signup } from "../authentication/signup.js";
import School from "../models/School.js";

// Add new school
export const addSchool = async (req, res) => {
  const { school_name, district, sector, phone, email, username, password } =
    req.body;

  try {
    let school = await School.findOne({ email });
    if (school) {
      return res.status(400).json({ msg: "School already exists" });
    }

    school = new School({
      school_name,
      district,
      sector,
      phone,
      email,
      username,
      password,
    });
    const newSchool = await school.save();
    console.log ("------------------------------------", newSchool);
    // Call signup function to create the user
    const userReq = {
      body: {
        email,
        password,
        Names: school_name,
        Username: username,
        role: "schooll", // Assign a role to the school user
      },
    };
    await signup(userReq, res, () => {
      res.status(201).json(school);
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

// Edit school information
export async function editSchool(req, res) {
  const { school_name, district, sector, phone, email, username, password } =
    req.body;
  try {
    let school = await School.findById(req.params.id);
    if (!school) return res.status(404).json({ msg: "School not found" });

    school.school_name = school_name || school.school_name;
    school.district = district || school.district;
    school.sector = sector || school.sector;
    school.phone = phone || school.phone;
    school.email = email || school.email;
    school.username = username || school.username;
    school.password = password || school.password;

    await school.save();
    res.json(school);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

// Delete school
export async function deleteSchool(req, res) {
  try {
    const school = await School.findByIdAndDelete(req.params.id);
    if (!school) {
      return res.status(404).json({ msg: "School not found" });
    }
    res.json({ msg: "School removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

// Revoke/Grant school
export async function revokeGrantSchool(req, res) {
  try {
    let school = await School.findById(req.params.id);
    if (!school) return res.status(404).json({ msg: "School not found" });

    school.active = !school.active;
    await school.save();
    res.json(school);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

// Get all schools
export async function getSchools(req, res) {
  try {
    const schools = await School.find();
    res.json(schools);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}

// Get school by ID
export async function getSchoolById(req, res) {
  try {
    const school = await School.findById(req.params.id);
    if (!school) return res.status(404).json({ msg: "School not found" });

    res.json(school);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}
