require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const pool = require("./serever.cjs");
const app = express();
//multer



const storage = multer.diskStorage({

    destination:function(req,file,cb){

        cb(null,"uploads");

    },

    filename:function(req,file,cb){

        cb(null,file.originalname);

    }

});

const upload = multer({storage});
app.use(cors());
//app.use(express.json());
app.post("/Admin",upload.single("file"),async(req,res)=>{
 const img_name= req.file.originalname
  const img_header= req.body.header
 const img_desc= req.body.desc
//console.log(req)
//console.log(img_name)
console.log(img_header)
console.log(img_desc)
await pool.execute(`insert into img_details(name,description,header)
values(?,?,?)`,[img_name,img_desc,img_header])
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