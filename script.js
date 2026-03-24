let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function saveData() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

$(document).ready(function () {

  displayData(expenses);

  // ADD EXPENSE (jQuery event)
  $("#addBtn").click(function () {

    let desc = $("#desc").val();
    let amount = $("#amount").val();
    let date = $("#date").val();
    let category = $("#category").val();

    if (!desc || !amount || !date) {
      alert("Fill all fields");
      return;
    }

    expenses.push({
      desc,
      amount: parseFloat(amount),
      date,
      category
    });

    saveData();
    displayData(expenses);

    $("#desc").val("");
    $("#amount").val("");
    $("#date").val("");
  });

  // FILTER BUTTONS (jQuery)
  $(".filter").click(function () {
    let type = $(this).data("type");
    filterData(type);
  });

});

function deleteExpense(index) {
  expenses.splice(index, 1);
  saveData();
  displayData(expenses);
}

function displayData(data) {

  let table = $("#tableBody");
  table.empty();

  let total = 0;

  $.each(data, function (index, exp) {
    total += exp.amount;

    table.append(`
      <tr>
        <td>${exp.desc}</td>
        <td>₹${exp.amount}</td>
        <td>${exp.date}</td>
        <td>${exp.category}</td>
        <td><span class="delete-btn" onclick="deleteExpense(${index})">❌</span></td>
      </tr>
    `);
  });

  $("#total").text("₹" + total);

  updateCharts(data);
}

function filterData(type) {
  let now = new Date();

  let filtered = expenses.filter(exp => {
    let d = new Date(exp.date);

    if (type === "daily") return d.toDateString() === now.toDateString();

    if (type === "weekly") {
      let diff = (now - d) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    }

    if (type === "monthly") {
      return d.getMonth() === now.getMonth() &&
             d.getFullYear() === now.getFullYear();
    }

    if (type === "yearly") {
      return d.getFullYear() === now.getFullYear();
    }

    return true;
  });

  displayData(filtered);
}

let pieChart, barChart;

function updateCharts(data) {

  let categoryMap = {};
  let dateMap = {};

  data.forEach(exp => {
    categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
    dateMap[exp.date] = (dateMap[exp.date] || 0) + exp.amount;
  });

  let pieLabels = Object.keys(categoryMap);
  let pieData = Object.values(categoryMap);

  let barLabels = Object.keys(dateMap);
  let barData = Object.values(dateMap);

  if (pieChart) pieChart.destroy();
  if (barChart) barChart.destroy();

  pieChart = new Chart($("#pieChart"), {
    type: 'pie',
    data: {
      labels: pieLabels,
      datasets: [{ data: pieData }]
    }
  });

  barChart = new Chart($("#barChart"), {
    type: 'bar',
    data: {
      labels: barLabels,
      datasets: [{ data: barData }]
    }
  });
}