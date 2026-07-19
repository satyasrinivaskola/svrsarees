console.log("collection_container")
const img_c=document.getElementById("main_container")
fetch("http://localhost:3000/Admin")
.then(res=>res.json())
.then(data=>
data.map((list)=>{
const i_e=document.createElement("img")
const h_e=document.createElement("h1")
const d_e=document.createElement("p")
const main_container=document.createElement("div")
console.log("./uploads/"+list.name)
i_e.src="./uploads/"+list.name
h_e.textContent=list.header
d_e.textContent=list.description
main_container.appendChild(i_e)
main_container.appendChild(h_e)
main_container.appendChild(d_e)
img_c.appendChild(main_container)})
)