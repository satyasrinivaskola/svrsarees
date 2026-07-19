require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const pool = require("./serever.cjs");
const app = express();
//multer



const storage = multer.memoryStorage()

const upload = multer({ 
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB file size limit
})
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.post("/Admin",upload.single("file"),async(req,res)=>{
const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
  const img_header= req.body.header
 const img_desc= req.body.desc
//console.log(req)
//console.log(img_name)
console.log(img_header)
console.log(img_desc)
await pool.execute(`insert into img_details(name,description,header)
values(?,?,?)`,[base64Image,img_desc,img_header])
 const [rows1] = await pool.execute(

        "SELECT * FROM img_details",
    );
    res.json(rows1);
  //res.json("inserted");
})

app.get("/Admin", async (req, res) => {

    const [rows] = await pool.execute(

        "SELECT * FROM img_details",
    );
    res.json(rows);

});

app.delete("/Admin/:id",async (req, res) => {
const id=req.params.id;
console.log(id)
    const [rows] = await pool.execute(

        `delete from img_details where id=?`,[id]
    );
    res.json({row:"row"});})
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`Server Running  ${PORT}`);

});