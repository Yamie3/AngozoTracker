function createExpenseCategoryChart(expenseCategoryData) {
    const expenseCategoryLabels = Object.keys(expenseCategoryData);
    const expenseCategoryValues = Object.values(expenseCategoryData);

    // Generate colors dynamically or use a predefined color palette
    const backgroundColors = generateColors(expenseCategoryLabels.length);

    new Chart(document.getElementById('expenseCategoryChart'), {
        type: 'doughnut',
        data: {
            labels: expenseCategoryLabels,
            datasets: [{
                data: expenseCategoryValues,
                backgroundColor: backgroundColors,
                borderColor: '#fff'
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Expense by Category'
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function createMonthlyExpensesChart(monthlyExpenseLabels, monthlyExpenseData) {
    new Chart(document.getElementById('monthlyExpensesChart'), {
        type: 'line',
        data: {
            labels: monthlyExpenseLabels,
            datasets: [{
                label: 'Monthly Expenses',
                data: monthlyExpenseData,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Monthly Expenses'
                }
            }
        }
    });
}

function createIncomeVsExpensesChart(incomeLabels, incomeData, expenseData) {
    new Chart(document.getElementById('incomeVsExpensesChart'), {
        type: 'bar',
        data: {
            labels: incomeLabels,
            datasets: [{
                label: 'Income',
                data: incomeData,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }, {
                label: 'Expenses',
                data: expenseData,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Income vs Expenses (Last 6 Months)'
                },
                legend: {
                    position: 'top'
                }
            }
        }
    });
}

// Helper function to generate colors
function generateColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    // Example: Generate random colors
    colors.push(`hsl(${i * (360 / count)}, 100%, 50%)`);
  }
  return colors;
}

// Handle the data coming from the server, with error handling
document.addEventListener("DOMContentLoaded", function() {
  try {
    const expenseCategoryData = JSON.parse('{{ expense_category_data|escapejs }}');
    createExpenseCategoryChart(expenseCategoryData);
  } catch (error) {
    console.error("Error parsing or creating Expense Category Chart:", error);
    // Handle the error (e.g., display an error message to the user)
  }

  try {
    const monthlyExpenseLabels = JSON.parse('{{ monthly_expenses_labels|escapejs }}');
    const monthlyExpenseData = JSON.parse('{{ monthly_expenses_data|escapejs }}');
    createMonthlyExpensesChart(monthlyExpenseLabels, monthlyExpenseData);
  } catch (error) {
    console.error("Error parsing or creating Monthly Expenses Chart:", error);
    // Handle the error
  }

  try {
    const incomeLabels = JSON.parse('{{ income_labels|escapejs }}');
    const incomeData = JSON.parse('{{ income_data|escapejs }}');
    const expenseData = JSON.parse('{{ expense_data|escapejs }}');
    createIncomeVsExpensesChart(incomeLabels, incomeData, expenseData);
  } catch (error) {
    console.error("Error parsing or creating Income vs Expenses Chart:", error);
    // Handle the error
  }
});

document.addEventListener("DOMContentLoaded", function () {
  fetch("/income/income-category-summary")
    .then((response) => response.json())
    .then((data) => {
      const ctx = document.getElementById("myChart").getContext("2d");

      const labels = Object.keys(data);
      const values = Object.values(data);

      new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: labels,
          datasets: [{
            label: "Income by Source",
            data: values,
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
              "#FF9F40"
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Income Summary by Source"
            },
            legend: {
              position: "bottom"
            }
          }
        }
      });
    });
});
document.addEventListener("DOMContentLoaded", () => {
  const searchField = document.querySelector("#searchField");
  const tableOutput = document.querySelector(".table-output");
  const appTable = document.querySelector(".app-table");
  const paginationContainer = document.querySelector(".pagination-container");
  const noResults = document.querySelector(".no-results");
  const tbody = document.querySelector(".table-body");

  if (!searchField || !tableOutput || !appTable || !paginationContainer || !noResults || !tbody) {
    console.warn("One or more elements not found in DOM.");
    return;
  }

  tableOutput.style.display = "none";
  noResults.style.display = "none";
});
