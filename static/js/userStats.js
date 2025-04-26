// Helper function to get human-readable month
const getHumanMonth = (monthIndex) => {
  const [_, month] = new Date(new Date().getFullYear(), monthIndex - 1, 1).toDateString().split(" ");
  return month;
};

// Generic function to update the month UI for both expenses and income
const updateMonthUI = (monthData, type) => {
  const month = getHumanMonth(Object.keys(monthData)[0]);
  const value = Object.values(monthData)[0];

  if (type === "expenses") {
    document.querySelector(".expense-top-month").textContent = month;
    document.querySelector(".expense-top-month-value").textContent = value;
  } else {
    document.querySelector(".income-top-month").textContent = month;
    document.querySelector(".income-top-month-value").textContent = value;
  }
};

// Function to update the UI for "This Month"
const updateThisMonthUI = (data = [], type = "expenses") => {
  const currentMonthNumber = new Date().getMonth() + 1;

  const currentMonthData = data.find((item) => {
    return Object.keys(item)[0] === String(currentMonthNumber);
  });

  if (currentMonthData) {
    const month = getHumanMonth(Object.keys(currentMonthData)[0]);
    const value = Object.values(currentMonthData)[0];

    if (type === "expenses") {
      document.querySelector(".expense-this-month").textContent = month;
      document.querySelector(".expense-this-month-value").textContent = value;
    } else {
      document.querySelector(".income-this-month").textContent = month;
      document.querySelector(".income-this-month-value").textContent = value;
    }
  }
};

// Function to format and sort stats
const formatStats = (data = {}, type = "expenses") => {
  const monthData = data.months;
  const sorted = Object.entries(monthData)
    .map(([month, value], index) => ({ [index + 1]: value }))
    .sort((a, b) => Object.values(b)[0] - Object.values(a)[0]);

  const topMonth = sorted[0];
  updateMonthUI(topMonth, type); // Update the top month UI
  updateThisMonthUI(sorted, type); // Update the "this month" UI
};

// Function to fetch data from multiple sources
const fetchData = () => {
  const requests = [
    fetch("/expense_summary_rest").then((res) => res.json()),
    fetch("/last_3months_stats").then((res) => res.json()),
    fetch("/income/income_sources_data").then((res) => res.json()),
    fetch("/income/income_summary_rest").then((res) => res.json())
  ];

  Promise.all(requests)
    .then(([thisYearExpenses, expenseCategories, incomeSources, thisYearIncome]) => {
      formatStats(thisYearExpenses.this_year_expenses_data, "expenses");
      formatStats(thisYearIncome.this_year_income_data, "income");
      setGraphs([thisYearExpenses, expenseCategories, incomeSources, thisYearIncome]);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      // Optionally, show a user-friendly error message
      alert("There was an error fetching the data. Please try again later.");
    });
};

// Placeholder function for setting graphs (for future implementation)
const setGraphs = (data) => {
  // Implement graph rendering logic here if needed
};

// Load the data when the page is ready
window.onload = fetchData;
