const API_BASE = "https://www.themealdb.com/api/json/v1/1/";
let previousView = "home";

// Fetch and render categories on load
async function loadCategories() {
  const res = await fetch(`${API_BASE}categories.php`);
  const data = await res.json();
  const categories = data.categories;

  const grid = document.getElementById("category-grid");
  grid.innerHTML = "";
  const sidebarList = document.getElementById("sidebar-categories");
  sidebarList.innerHTML = "";

  categories.forEach((cat) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
                    <img src="${cat.strCategoryThumb}" alt="${cat.strCategory}">
                    <div class="card-label">${cat.strCategory.toUpperCase()}</div>
                `;
    card.onclick = () =>
      showCategoryDetails(cat.strCategory, cat.strCategoryDescription);
    grid.appendChild(card);

    const li = document.createElement("li");
    li.textContent = cat.strCategory;
    li.onclick = () =>
      showCategoryDetails(cat.strCategory, cat.strCategoryDescription);
    sidebarList.appendChild(li);
  });

  // Add click event to menu icon to toggle sidebar
  const menuIcon = document.querySelector(".menu-icon");
  const sidebar = document.querySelector(".sidebar");
  menuIcon.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });
}

// Show category details
async function showCategoryDetails(category, description) {
  document.getElementById("home").style.display = "none";
  document.getElementById("search-results").style.display = "none";
  const catDetails = document.getElementById("category-details");
  catDetails.style.display = "block";

  document.getElementById("category-title").textContent = category;
  document.getElementById("category-description").textContent = description;

  const res = await fetch(`${API_BASE}filter.php?c=${category}`);
  const data = await res.json();
  const meals = data.meals || [];

  const grid = document.getElementById("category-meal-grid");
  grid.innerHTML = "";

  meals.forEach((meal) => {
    const card = document.createElement("div");
    card.classList.add("card", "meal-card");
    card.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <p>${meal.strMeal}</p>
                `;
    card.onclick = () => showMealDetails(meal.idMeal, "category");
    grid.appendChild(card);
  });

  previousView = "category";
}

// Search functionality
document.querySelector(".search-button").onclick = async () => {
  const query = document.getElementById("search-input").value.trim();
  if (!query) return;

  document.getElementById("home").style.display = "none";
  document.getElementById("category-details").style.display = "none";
  const searchResults = document.getElementById("search-results");
  searchResults.style.display = "block";

  const res = await fetch(`${API_BASE}search.php?s=${query}`);
  const data = await res.json();
  const meals = data.meals || [];

  const grid = document.getElementById("search-grid");
  grid.innerHTML = "";

  meals.forEach((meal) => {
    const card = document.createElement("div");
    card.classList.add("card", "meal-card");
    card.innerHTML = `
                    <span class="meal-tag">${meal.strCategory}</span>
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <p>${meal.strArea}</p>
                    <p>${meal.strMeal}</p>
                `;
    card.onclick = () => showFullMealDetails(meal);
    grid.appendChild(card);
  });

  previousView = "search";
};

// Show meal details from ID (for category lists)
async function showMealDetails(id, from) {
  const res = await fetch(`${API_BASE}lookup.php?i=${id}`);
  const data = await res.json();
  const meal = data.meals[0];
  showFullMealDetails(meal);
  previousView = from;
}

// Show full meal details
function showFullMealDetails(meal) {
  document.getElementById("home").style.display = "none";
  document.getElementById("search-results").style.display = "none";
  document.getElementById("category-details").style.display = "none";
  const details = document.getElementById("meal-details");
  details.style.display = "block";

  document.getElementById("meal-title").textContent = meal.strMeal;
  document.getElementById("meal-image").src = meal.strMealThumb;
  document.getElementById("meal-category").textContent = meal.strCategory;
  document.getElementById("meal-source").href = meal.strSource;
  document.getElementById("meal-source").textContent = meal.strSource;
  document.getElementById("meal-tags").textContent = meal.strTags || "None";
  document.getElementById("meal-instructions").textContent =
    meal.strInstructions;

  const ingList = document.getElementById("ingredients-list");
  ingList.innerHTML = "";
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      const ing = document.createElement("div");
      ing.classList.add("ingredient");
      ing.textContent = meal[`strIngredient${i}`];
      ingList.appendChild(ing);
    }
  }

  const measList = document.getElementById("measures-list");
  measList.innerHTML = "";
  for (let i = 1; i <= 20; i++) {
    if (meal[`strMeasure${i}`]) {
      const li = document.createElement("li");
      li.textContent = meal[`strMeasure${i}`];
      measList.appendChild(li);
    }
  }
}

// Back to home
function backToHome() {
  document.getElementById("category-details").style.display = "none";
  document.getElementById("search-results").style.display = "none";
  document.getElementById("meal-details").style.display = "none";
  document.getElementById("home").style.display = "block";
}
// Back from details
function backFromDetails() {
  document.getElementById("meal-details").style.display = "none";
  if (previousView === "category") {
    document.getElementById("category-details").style.display = "block";
  } else if (previousView === "search") {
    document.getElementById("search-results").style.display = "block";
  } else {
    backToHome();
  }
}
// Load on start
loadCategories();
