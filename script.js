const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const filterBtns = document.querySelectorAll(".filter-btn");
const darkModeToggle = document.getElementById("toggleDarkMode");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function setDarkMode(enabled) {
  if (enabled) {
    document.body.classList.add("dark");
    localStorage.setItem("darkMode", "enabled");
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("darkMode", "disabled");
  }
}

function loadDarkModePreference() {
  const mode = localStorage.getItem("darkMode");
  if (mode === "enabled") {
    document.body.classList.add("dark");
  }
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const searchText = searchInput.value.toLowerCase();
  taskList.innerHTML = "";

  tasks
    .filter((task) => {
      const matchesSearch = task.text.toLowerCase().includes(searchText);
      const matchesFilter =
        currentFilter === "all" ||
        (currentFilter === "active" && !task.completed) ||
        (currentFilter === "completed" && task.completed);
      return matchesSearch && matchesFilter;
    })
    .forEach((task, index) => {
      const li = document.createElement("li");
      if (task.completed) li.classList.add("done");

      li.innerHTML = `
        <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleComplete(${index})" />
        <span>${task.text}</span>
        <button class="deleteBtn" onclick="deleteTask(${index})">✖</button>
      `;
      taskList.appendChild(li);
    });

  saveTasks();
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({ text, completed: false });
  taskInput.value = "";
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

function applyFilter(filter) {
  currentFilter = filter;
  filterBtns.forEach((btn) =>
    btn.classList.toggle("active", btn.dataset.filter === filter)
  );
  renderTasks();
}

addTaskBtn.onclick = addTask;
searchInput.oninput = renderTasks;
filterBtns.forEach((btn) => {
  btn.onclick = () => applyFilter(btn.dataset.filter);
});

darkModeToggle.onclick = () => {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
};


renderTasks();



// Add task when pressing Enter
taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addTask();
    }
  });
  
  function updateDarkModeButton() {
    const isDark = document.body.classList.contains("dark");
    darkModeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  }
  
  darkModeToggle.onclick = () => {
    const isDark = document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
    updateDarkModeButton();
  };
  
  loadDarkModePreference();
  updateDarkModeButton();
  
