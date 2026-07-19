// 🌟 CONFIGURATION: Change this to your live Render URL when you deploy!
const API_URL = "http://localhost:3000/Admin";

const AdminBtn = document.getElementById("Admin");
const img_container = document.getElementById("img_container");
const img_c = document.getElementById("main_container");
const hide_div = document.getElementById("hide_div");
const sub_con = document.getElementById("sub-con");

// Parse the query parameters (?e=true)
const params = new URLSearchParams(window.location.search);
const edit = params.get("e");

// 🌟 Initialize the page based on Admin vs User view mode
function initPage() {
    if (edit === "true") {
        hide_div.style.display = "block";
        img_c.style.display = "none";
        AdminBtn.textContent = "Logout";
        // Change the admin button action to log out
        AdminBtn.setAttribute("onclick", "Logout()");
        loadAdminPanel();
    } else {
        hide_div.style.display = "none";
        img_c.style.display = "flex";
        AdminBtn.textContent = "Admin";
        AdminBtn.setAttribute("onclick", "Admin_b()");
        loadUserGallery();
    }
}

// 🌐 USER VIEW: Fetch and display items globally
function loadUserGallery() {
    img_c.innerHTML = '<p id="loading-text">⏳ Loading Saree Collection... Please wait.</p>';

    fetch(API_URL)
        .then(res => {
            if (!res.ok) throw new Error("Network response error");
            return res.json();
        })
        .then(data => {
            img_c.innerHTML = ""; // Clear out loading text
            
            if (data.length === 0) {
                img_c.innerHTML = "<p>No sarees available in the collection right now.</p>";
                return;
            }

            data.forEach((list) => {
                const main_container = document.createElement("div");
                main_container.id = "div_con";

                const i_e = document.createElement("img");
                i_e.src = list.name; // Holds Base64 string directly
                i_e.alt = list.header;

                const h_e = document.createElement("h3");
                h_e.textContent = list.header || "Premium Collection";

                const d_e = document.createElement("p");
                d_e.textContent = list.description || "Premium Designer Saree";

                main_container.appendChild(i_e);
                main_container.appendChild(h_e);
                main_container.appendChild(d_e);
                img_c.appendChild(main_container);
            });
        })
        .catch(err => {
            console.error(err);
            document.getElementById("loading-text").innerText = "❌ Connection failed. Refresh page.";
        });
}

// 🛠️ ADMIN VIEW: Fetch and display items with Delete options
function loadAdminPanel() {
    sub_con.innerHTML = '<p id="admin-loading">⏳ Loading dashboard controls...</p>';

    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            sub_con.innerHTML = ""; // Clear dashboard loader
            
            data.forEach((list) => {
                const adminCard = document.createElement("div");
                adminCard.className = "admin-card";

                const i_e = document.createElement("img");
                i_e.src = list.name;

                const h_e = document.createElement("h1");
                h_e.textContent = list.header || "Premium Collection";

                const p_e = document.createElement("p");
                p_e.textContent = list.description || "Premium Designer Saree";

                const d_e = document.createElement("button");
                d_e.textContent = "Delete Saree";
                d_e.id = "delete_b";
                
                // Hook up functional delete listener
                d_e.addEventListener("click", function() {
                    if(confirm("Are you sure you want to delete this item?")) {
                        const methods = {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" }
                        };
                        fetch(`${API_URL}/${list.id}`, methods)
                            .then(res => res.json())
                            .then(() => {
                                loadAdminPanel(); // Refresh admin interface instantly
                            })
                            .catch(err => console.error("Delete failed:", err));
                    }
                });

                adminCard.appendChild(h_e);
                adminCard.appendChild(p_e);
                adminCard.appendChild(i_e);
                adminCard.appendChild(d_e);
                sub_con.appendChild(adminCard);
            });
        })
        .catch(err => console.error("Admin fetch error:", err));
}

// 📤 UPLOAD HANDLER
function upload() {
    const imageInput = document.getElementById("image");
    if (!imageInput.files[0]) {
        alert("Please choose a file to upload first.");
        return;
    }

    const image = imageInput.files[0];
    let header = document.getElementById("header").value.trim();
    let desc = document.getElementById("desc").value.trim();

    // Default Fallbacks
    if (header === "") header = "Premium Collection";
    if (desc === "") desc = "Premium Designer Saree";

    const form_data = new FormData();
    form_data.append("file", image);
    form_data.append("header", header);
    form_data.append("desc", desc);

    const methods = {
        method: "POST",
        body: form_data
    };

    // Change display button to show processing state
    sub_con.innerHTML = "<p>📤 Processing image data and syncing with TiDB Cloud...</p>";

    fetch(API_URL, methods)
        .then(res => res.json())
        .then(() => {
            // Reset input values smoothly
            imageInput.value = "";
            document.getElementById("header").value = "";
            document.getElementById("desc").value = "";
            loadAdminPanel(); // Reload dashboard lists
        })
        .catch(err => {
            alert("Upload execution failed: Check terminal/console limits.");
            loadAdminPanel();
        });
}

// Navigation Controls
function Admin_b() {
    window.location.href = "home.html?e=true";
}

function Logout() {
    window.location.href = "home.html";
}

// Execute logic loop on window render
window.addEventListener("DOMContentLoaded", initPage);