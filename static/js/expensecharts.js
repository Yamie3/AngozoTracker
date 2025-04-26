document.addEventListener("DOMContentLoaded", () => {
  const colors = [
    "rgba(255, 99, 132, 0.6)",
    "rgba(54, 162, 235, 0.6)",
    "rgba(255, 206, 86, 0.6)",
    "rgba(75, 192, 192, 0.6)",
    "rgba(153, 102, 255, 0.6)",
    "rgba(255, 159, 64, 0.6)"
  ];

  // 1. EXPENSE BY CATEGORY
  fetch('/expense_category_summary')
    .then(res => res.json())
    .then(data => {
      const ctx = document.getElementById("expenseCategoryChart").getContext("2d");
      new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: Object.keys(data.expense_category_data),
          datasets: [{
            label: "Expenses by Category",
            data: Object.values(data.expense_category_data),
            backgroundColor: colors,
            borderColor: "rgba(255, 255, 255, 1)",
            borderWidth: 1
          }]
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: "Expenses by Category"
            },
            legend: {
              position: "bottom"
            }
          },
          responsive: true
        }
      });
    });

  // 2. MONTHLY EXPENSES
  fetch('/monthly_expense_summary')
    .then(res => res.json())
    .then(data => {
      const ctx = document.getElementById("monthlyExpensesChart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: data.labels.map(month => `Month ${month}`),
          datasets: [{
            label: "Monthly Expenses",
            data: data.data,
            backgroundColor: colors
          }]
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: "Monthly Expenses Overview"
            }
          },
          responsive: true
        }
      });
    });

  // 3. INCOME VS EXPENSES
  fetch('/income_vs_expenses_summary')
    .then(res => res.json())
    .then(data => {
      const ctx = document.getElementById("incomeVsExpensesChart").getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: data.labels.map(month => `Month ${month}`),
          datasets: [
            {
              label: "Income",
              data: data.income,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true
            },
            {
              label: "Expenses",
              data: data.expenses,
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              fill: true
            }
          ]
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: "Income vs Expenses"
            }
          },
          responsive: true
        }
      });
    });
});
