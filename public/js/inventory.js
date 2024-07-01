"use strict";

// Get a list of items in inventory base on the classification_id
let classificationList = document.querySelector("#classificationList");
classificationList.addEventListener("change", function () {
  let classification_id = classificationList.value;
  console.log(`classifiaction_id is: ${classificationList}`);
  let classIdURL = "inv/getInventory/" + classification_id;
  fetch(classIdURL)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw Error("Network response was not OK");
    })
    .then(function (data) {
      console.log(data);
      buildInventoryList(data);
    })
    .catch(function (error) {
      console.log("There was a problem: ", error.message);
    });
});

// Build inventory items into HTML table component and injest into DOM
function buildInventoryList(data) {
  let inventoryDisplay = document.querySelector("#inventoryDisplay");
  // Set up the table labels
  let dataTable = "<thead>";
  dataTable += "<tr><th>Vehicle Name</th><br><td>&nbsp;</td><td>&nbsp;</td></tr>";
  dataTable += "</thead>";
  // set up the table body
  dataTable += "<tbody>";
  // Iterate over all vehicles in the array and put each in a row
  data.forEach(function (element) {
    console.log(element.inv_id + ", " + element.inv_model);
    dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`; 
    dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`;
    dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`;
  });
  dataTable += "</tbody>";
  // Display the contents in the Inventory management view
  inventoryDisplay.innerHTML = dataTable;
}
