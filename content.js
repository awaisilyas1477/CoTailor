// console.clear();

let contentTitle;

console.log(document.cookie);

function dynamicClothingSection(ob) {
  let boxDiv = document.createElement("div");
  boxDiv.id = "box";

  let boxLink = document.createElement("a");
  boxLink.href = "/contentDetails.html?" + ob.id;

  let imgTag = document.createElement("img");
  imgTag.src = ob.preview;

  let detailsDiv = document.createElement("div");
  detailsDiv.id = "details";

  let h3 = document.createElement("h3");
  h3.textContent = ob.name;

  let h4 = document.createElement("h4");
  h4.textContent = ob.brand;

  let h2 = document.createElement("h2");
  h2.textContent = "Rs " + ob.price;

  boxDiv.appendChild(boxLink);
  boxLink.appendChild(imgTag);
  boxLink.appendChild(detailsDiv);
  detailsDiv.appendChild(h3);
  detailsDiv.appendChild(h4);
  detailsDiv.appendChild(h2);

  return boxDiv;
}

let mainContainer = document.getElementById("mainContainer");
let containerClothing = document.getElementById("containerClothing");
let containerAccessories = document.getElementById("containerAccessories");

// Supabase details
const SUPABASE_URL = "https://grksptxhbdlbdrlabaew.supabase.co/rest/v1/products?select=*";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya3NwdHhoYmRsYmRybGFiYWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyOTI2MDgsImV4cCI6MjA4Mjg2ODYwOH0.TpiilrTDb4ZNbETvl0h4E_LFHZGpcx91_6Nx_dDPbew"; // <-- Replace with your anon key

// BACKEND CALLING with XMLHttpRequest
let httpRequest = new XMLHttpRequest();

httpRequest.onreadystatechange = function() {
  if (this.readyState === 4) {
    if (this.status == 200) {
      contentTitle = JSON.parse(this.responseText);

      // Badge counter from cookie
      if (document.cookie.indexOf(",counter=") >= 0) {
        var counter = document.cookie.split(",")[1].split("=")[1];
        document.getElementById("badge").innerHTML = counter;
      }

      // Loop through products and append
      for (let i = 0; i < contentTitle.length; i++) {
        if (contentTitle[i].isaccessory) { // <-- make sure spelling matches DB column
          containerAccessories.appendChild(dynamicClothingSection(contentTitle[i]));
        } else {
          containerClothing.appendChild(dynamicClothingSection(contentTitle[i]));
        }
      }

      console.log("All products loaded!", contentTitle);

    } else {
      console.log("call failed! Status:", this.status, this.responseText);
    }
  }
};

// Open request with headers
httpRequest.open("GET", SUPABASE_URL, true);
httpRequest.setRequestHeader("apikey", SUPABASE_ANON_KEY);
httpRequest.setRequestHeader("Authorization", "Bearer " + SUPABASE_ANON_KEY);
httpRequest.send();
