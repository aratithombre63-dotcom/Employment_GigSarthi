const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");

router.post("/", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "../data/ability-vectors.json");

    const { name, score, skills } = req.body;

    // Validation
    if (!name || !score) {
      return res.status(400).json({
        success: false,
        message: "Name and score are required"
      });
    }

    let data = [];

    try {
      const fileContent = await fs.readFile(filePath, "utf8");
      data = JSON.parse(fileContent);
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
    }

    const newEntry = {
      id: Date.now(),
      name,
      score,
      skills: skills || [],
      createdAt: new Date().toISOString()
    };

    data.push(newEntry);

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    res.status(201).json({
      success: true,
      message: "Saved successfully",
      data: newEntry
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

module.exports = router;
