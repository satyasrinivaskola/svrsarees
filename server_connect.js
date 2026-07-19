require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs"); // Added to automatically manage directories
const pool = require("./serever.cjs"); // Ensure this matches your exact file spelling!

const app = express();

// Global Middleware Configuration
app.use(cors());
app.use(express.json()); // Uncommented this in case you need to parse JSON requests elsewhere

// 🛠️ FIX: Automatically create the uploads directory on the server if it is missing
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

// 📥 Create (Insert Image Details)
app.post("/Admin", upload.single("file"), async (req, res) => {
    try {
        // 🛠️ FIX: Removed 'await' from these plain text variables
        const img_name = req.file.originalname;
        const img_header = req.body.header;
        const img_desc = req.body.desc;

        console.log("Saving to DB:", { img_name, img_header, img_desc });

        // Insert new entry into MySQL database
        await pool.execute(
            `INSERT INTO img_details (name, description, header) VALUES (?, ?, ?)`,
            [img_name, img_desc, img_header]
        );

        // Fetch the updated table to send back to the user interface
        const [rows1] = await pool.execute("SELECT * FROM img_details");
        res.json(rows1);

    } catch (error) {
        console.error("Upload Route Failed:", error);
        res.status(500).json({ error: "Internal Server Error during data processing" });
    }
});

// 📤 Read (Fetch All Images)
app.get("/Admin", async (req, res) => {
    try {
        const [rows] = await pool.execute("SELECT * FROM img_details");
        res.json(rows);
    } catch (error) {
        console.error("Fetch Route Failed:", error);
        res.status(500).json({ error: "Could not fetch image listings" });
    }
});

// 🗑️ Delete (Remove Entry by ID)
app.delete("/Admin/:id", async (req, res) => {
    try {
        const id = req.params.id;
        console.log("Target Delete ID:", id);

        await pool.execute(`DELETE FROM img_details WHERE id = ?`, [id]);
        
        // 🛠️ FIX: Send back a clean dynamic response array or confirmation string
        res.json({ message: `Successfully deleted entry with ID ${id}` });
    } catch (error) {
        console.error("Delete Route Failed:", error);
        res.status(500).json({ error: "Could not remove database entry" });
    }
});

// Boot the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 API Server running smoothly on port ${PORT}`);
});