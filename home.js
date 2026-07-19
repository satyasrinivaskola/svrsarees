
const Admin=document.getElementById("Admin")
const img_container=document.getElementById("img_container")
const params=new URLSearchParams(window.location.search)
const edit=params.get("e")

const hide_div=document.getElementById("hide_div")
const home_div=document.getElementById("home_div")
if(edit==="true"){

  hide_div.style.display = "block";
  home_div.style.display="none"
  Admin.textContent="logout"
 
}
else{
    hide_div.style.display = "none";
      home_div.style.display="block"

}
fetch("https://svrsarees.onrender.com/Admin")
.then(res=>res.json())
.then(data=>{
data.map(list=>{
const div_e=document.createElement("div")
const i_e=document.createElement("img")
const h_e=document.createElement("h1")
const p_e=document.createElement("p")
i_e.src="./uploads/"+list.name
h_e.textContent=list.header
p_e.textContent=list.description

div_e.appendChild(i_e)
div_e.appendChild(h_e)
div_e.appendChild(p_e)
home_div.appendChild(div_e)
})
})
//admin button
function Admin_b(){
console.log(edit)
console.log("Admin_b")
window.location.href="Admin.html"

}
const sub_con=document.getElementById("sub-con")


//upload button
function upload(){

const image=document.getElementById("image").files[0]
let header=document.getElementById("header").value;
let desc=document.getElementById("desc").value
console.log(image)
if(header==""){
header="Premium Collection"}
else if(desc==""){
desc="Premium Designer Saree"
}
const form_data=new FormData()
form_data.append("file",image)
form_data.append("header",header)
form_data.append("desc",desc)
const methods={
method:"POST",
//headers:{"Content-Type":"application/json"},
body:form_data}
fetch("https://svrsarees.onrender.com/Admin",methods)
.then(res=>res.json())
.then(()=>loadimage())


//loadImages
function loadimage(){
   sub_con.innerHTML = "";

fetch("https://svrsarees.onrender.com/Admin")
.then(res=>res.json())
.then(data=>
data.map((list)=>{
const i_e=document.createElement("img")
const h_e=document.createElement("h1")
const p_e=document.createElement("p")
const d_e=document.createElement("button")
console.log("./uploads/"+list.name)
i_e.src=list.name
h_e.textContent=list.header
p_e.textContent=list.description
d_e.textContent="delete"
d_e.id="delete_b"
d_e.addEventListener("click",function(){
console.log("delete")
const methods={
method:"DELETE",
headers:{"Content-Type":"application/json"}}
fetch(`http://localhost:3000/Admin/${list.id}`,methods)
.then(res=>res.json())
.then(data=>console.log(data))

loadimage()
})
sub_con.appendChild(h_e)
sub_con.appendChild(p_e)
sub_con.appendChild(d_e)
sub_con.appendChild(i_e)
img_container.appendChild(sub_con)

console.log(list.name)

}))
}
// admin Logout button
function Logout(){
window.location.href="User.html"
}

}
//home page

