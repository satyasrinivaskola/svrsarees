console.log("collection_container")
const img_c=document.getElementById("main_container")
img_c.innerHTML=`<p id="loading-text">Loading Saree Collection... Please wait.</p>`
fetch("http://localhost:3000/Admin")
.then(res=>res.json())
.then(data=>{
img_c.innerHTML=""
data.map((list)=>{

const i_e=document.createElement("img")
const h_e=document.createElement("h3")
const d_e=document.createElement("p")
const main_container=document.createElement("div")
console.log("./uploads/"+list.name)
i_e.src=list.name
h_e.textContent=list.header
d_e.textContent=list.description
main_container.appendChild(i_e)
main_container.appendChild(h_e)
main_container.appendChild(d_e)
main_container.id="div_con"
img_c.appendChild(main_container)})
})