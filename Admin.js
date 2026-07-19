function Login(){
const user=document.getElementById("user").value
const password=document.getElementById("password").value

//window.location.href=`home.html?edit=true`
if(user=="user" && password=="Admin@123"){
alert("Admin login successfully")
window.location.href=`home.html?e=true`
}
else{
window.location.href=`home.html?e=false`
alert("wrong Password")}
}