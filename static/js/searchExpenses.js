const searchField = document.querySelector("#searchField");
const tableOutput = document.querySelector(".table-output");
const appTable = document.querySelector(".app-table");
const paginationContainer = document.querySelector(".pagination-container");
const noResults = document.querySelector(".no-results");
const tbody = document.querySelector(".table-body");

tableOutput.style.display = "none";
noResults.style.display = "none";

// CSRF token helper (for Django)
function getCSRFToken() {
  const cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    if (cookie.startsWith("csrftoken=")) {
      return cookie.split("=")[1];
    }
  }
  return "";
}

// Debounce to avoid too many fetch requests
let debounceTimeout = null;
const debounceDelay = 300; // ms

searchField.addEventListener("keyup", (e) => {
  clearTimeout(debounceTimeout);

  const searchValue = e.target.value.trim();

  debounceTimeout = setTimeout(() => {
    if (searchValue.length > 0) {
      fetchExpenses(searchValue);
    } else {
      showOriginalTable();
    }
  }, debounceDelay);
});

function fetchExpenses(searchText) {
  paginationContainer.style.display = "none";
  appTable.style.display = "none";
  tableOutput.style.display = "block";
  tbody.innerHTML = "";

  fetch("/search-expenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCSRFToken(),
    },
    body: JSON.stringify({ searchText }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.length) {
        noResults.style.display = "block";
        tableOutput.style.display = "none";
        return;
      }

      noResults.style.display = "none";
      data.forEach((item) => {
        tbody.innerHTML += `
          <tr>
            <td>${item.amount}</td>
            <td>${item.category}</td>
            <td>${item.description}</td>
            <td>${item.date}</td>
          </tr>`;
      });
    })
    .catch((err) => {
      console.error("Search failed", err);
      noResults.style.display = "block";
      tableOutput.style.display = "none";
    });
}

function showOriginalTable() {
  tableOutput.style.display = "none";
  appTable.style.display = "block";
  paginationContainer.style.display = "block";
  noResults.style.display = "none";
}
