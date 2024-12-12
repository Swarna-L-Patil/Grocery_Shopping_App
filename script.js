// Getting all necessary DOM elements
const addItemButton = document.getElementById('add-item');
const itemInput = document.getElementById('item');
const quantityInput = document.getElementById('quantity');
const priceInput = document.getElementById('price');
const shoppingList = document.getElementById('list-items');
const totalCostElement = document.getElementById('total-cost');
const budgetInput = document.getElementById('budget');
const budgetStatus = document.getElementById('budget-status');
const recommendationsToggle = document.getElementById('recommendations-toggle');
const recommendationsSection = document.getElementById('recommendations-section');
const recommendationsList = document.getElementById('recommendations-list');
const listPageItems = document.getElementById('list-page-items');
const themeToggle = document.getElementById('theme-toggle');
const listSelector = document.getElementById('list-selector');
const badgesList = document.getElementById('badges-list');
const rewardPoints = document.getElementById('reward-points');

// Initialize variables
let totalCost = 0;
let shoppingItems = [];
let recommendationsEnabled = false;
let isDarkMode = false;
let rewardPointsCount = 0;
let shoppingLists = { "Default List": [] };
let currentList = "Default List";

// Categories and items
const categories = {
    "Fruits": ["apple", "banana", "orange"],
    "Vegetables": ["carrot", "potato", "spinach"],
    "Dairy": ["milk", "cheese", "butter"],
    "Snacks": ["chips", "cookies", "crackers"],
    "Grains": ["wheat", "jowar", "ragi", "rice", "moong dal", "urad dal", "ragi"]
};

// Assign an item to a category
function getCategory(itemName) {
    const normalizedItem = itemName.toLowerCase().trim();
    for (const [category, items] of Object.entries(categories)) {
        if (items.includes(normalizedItem)) {
            return category;
        }
    }
    return "Others";
}

// Function to add an item to the shopping list
addItemButton.addEventListener('click', () => {
    const itemName = itemInput.value.trim();
    const itemQuantity = parseInt(quantityInput.value.trim());
    const itemPrice = parseFloat(priceInput.value.trim());

    if (itemName && itemQuantity && itemPrice) {
        const itemTotal = itemQuantity * itemPrice;

        // Add item to the shopping list array
        shoppingItems.push({ name: itemName, quantity: itemQuantity, price: itemPrice, total: itemTotal });

        // Add item to the DOM
        const li = document.createElement('li');
        li.textContent = `${itemQuantity} x ${itemName} - ₹${itemTotal.toFixed(2)}`;
        shoppingList.appendChild(li);

        // Add item to List Page
        const listItem = document.createElement('li');
        listItem.textContent = `${itemQuantity} x ${itemName} - ₹${itemTotal.toFixed(2)}`;
        listPageItems.appendChild(listItem);

        // Update total cost
        totalCost += itemTotal;
        totalCostElement.textContent = totalCost.toFixed(2);

        // Clear input fields
        itemInput.value = '';
        quantityInput.value = '';
        priceInput.value = '';

        // Show recommendations for the same category if enabled
        if (recommendationsEnabled) {
            showRecommendationsForCategory(itemName);
        }

        // Check if total cost is within budget
        checkBudget();

    // Add reward points
        addRewardPoints(10);
    } 
    else {
        alert("Please fill in all fields correctly.");
    }
    
});

// Function to check if total cost is within budget
function checkBudget() {
    const budget = parseFloat(budgetInput.value.trim());
    if (budget && totalCost > budget) {
        budgetStatus.textContent = `You are over budget by ₹${(totalCost - budget).toFixed(2)}`;
        budgetStatus.style.color = 'red';
    } else if (budget && totalCost <= budget) {
        budgetStatus.textContent = `You are within your budget!`;
        budgetStatus.style.color = 'green';
    } else {
        budgetStatus.textContent = '';
    }
}

// Listen for changes in the budget input to recheck budget status
budgetInput.addEventListener('input', checkBudget);

// Recommendations toggle functionality
recommendationsToggle.addEventListener('change', (e) => {
    recommendationsEnabled = e.target.checked;
    updateRecommendationsVisibility();
});

// Function to show or hide the recommendations section
function updateRecommendationsVisibility() {
    if (recommendationsEnabled) {
        recommendationsSection.style.display = 'block';
    } else {
        recommendationsSection.style.display = 'none';
    }
}

// Show recommendations for a category
function showRecommendationsForCategory(itemName) {
    // Check the active page
    const activePage = document.querySelector(".tab-content[style*='block']");
    const allowedPages = ["home", "list"]; // Pages where recommendations are allowed

    // If the active page is not in the allowed list, do not display recommendations
    if (!allowedPages.includes(activePage.id)) {
        recommendationsSection.style.display = 'none';
        return;
    }

    const category = getCategory(itemName);
    const recommendations = categories[category]
        .filter(product => product.toLowerCase() !== itemName.toLowerCase())
        .map(product => `${product} - Recommended`);

    recommendationsList.innerHTML = ''; // Clear existing recommendations
    if (recommendations.length > 0) {
        recommendationsSection.style.display = 'block';
        recommendations.forEach(product => {
            const p = document.createElement('p');
            p.textContent = product;
            recommendationsList.appendChild(p);
        });
    } else {
        recommendationsSection.style.display = 'none'; // Hide if no recommendations available
    }
}

// Manage Lists
listSelector.addEventListener('change', () => {
    currentList = listSelector.value;
    renderList();
});

document.getElementById('new-list').addEventListener('click', () => {
    const newListName = prompt("Enter a name for the new list:");
    if (newListName && !shoppingLists[newListName]) {
        shoppingLists[newListName] = [];
        updateListSelector();
    } else {
        alert("List already exists or invalid name.");
    }
});

function updateListSelector() {
    listSelector.innerHTML = '';
    Object.keys(shoppingLists).forEach(listName => {
        const option = document.createElement('option');
        option.value = listName;
        option.textContent = listName;
        listSelector.appendChild(option);
    });
    listSelector.value = currentList;
}

function renderList() {
    shoppingList.innerHTML = '';
    totalCost = 0;
    shoppingLists[currentList].forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.quantity} x ${item.name} - ₹${item.total.toFixed(2)}`;
        shoppingList.appendChild(li);
        totalCost += item.total;
    });
    totalCostElement.textContent = totalCost.toFixed(2);
    checkBudget();
}

// Rewards System
function addRewardPoints(points) {
    rewardPointsCount += points;
    rewardPoints.textContent = rewardPointsCount;

    if (rewardPointsCount >= 50 && !document.querySelector(".badge")) {
        const badge = document.createElement('li');
        badge.textContent = "Gold Shopper";
        badge.classList.add('badge');
        badgesList.appendChild(badge);
    }
    if (rewardPointsCount >= 100 && !document.querySelector(".badge")) {
        const badge = document.createElement('li');
        badge.textContent = "Gold Shopper";
        badge.classList.add('badge');
        badgesList.appendChild(badge);
    }
    if (rewardPointsCount >= 150 && !document.querySelector(".badge")) {
        const badge = document.createElement('li');
        badge.textContent = "Gold Shopper";
        badge.classList.add('badge');
        badgesList.appendChild(badge);
    }
}

function addBadge(name) {
    const badge = document.createElement('li');
    badge.textContent = name;
    document.getElementById('badges-list').appendChild(badge);
}





// Function to switch between pages
function openPage(evt, pageName) {
    const tabcontent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none"; // Hide all tab content
    }
    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    document.getElementById(pageName).style.display = "block"; // Show selected tab content
    evt.currentTarget.classList.add("active");

    // Hide recommendations when switching to disallowed pages
    const allowedPages = ["home", "list"];
    if (!allowedPages.includes(pageName)) {
        recommendationsSection.style.display = 'none';
    }
}

// Open only the Home page by default
document.addEventListener("DOMContentLoaded", () => {
    const tabcontent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none"; // Hide all initially
    }
    document.getElementById("home").style.display = "block"; // Show home
    recommendationsSection.style.display = 'none'; // Hide recommendations by default
});

// Dark Mode functionality
themeToggle.addEventListener('change', (e) => {
    isDarkMode = e.target.checked;
    // Toggle dark mode on body and other elements
    document.body.classList.toggle('dark-mode', isDarkMode); // Apply dark mode to the body

    // Apply dark mode to tabs and content
    document.querySelectorAll('.tablinks').forEach(tab => {
        tab.classList.toggle('dark-mode', isDarkMode);
    });

    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.toggle('dark-mode', isDarkMode);
    });
});



Initialization
document.addEventListener('DOMContentLoaded', () => {
    // updateListSelector();
    renderList();
});

// Function to populate the Store Map
function populateStoreMap() {
    const storeCategoriesContainer = document.getElementById('store-categories');
    storeCategoriesContainer.innerHTML = ''; // Clear existing content

    // Loop through each category and its items
    for (const [category, items] of Object.entries(categories)) {
        // Create a container for each category
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category-container';

        // Create and append the category title
        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = category;
        categoryDiv.appendChild(categoryTitle);

        // Create a list for the items
        const itemList = document.createElement('ul');
        itemList.className = 'item-list';
        items.forEach(item => {
            const itemLi = document.createElement('li');
            itemLi.textContent = item;
            itemList.appendChild(itemLi);
        });

        // Append the item list to the category container
        categoryDiv.appendChild(itemList);

        // Add the category container to the store categories section
        storeCategoriesContainer.appendChild(categoryDiv);
    }
}

// Ensure the Store Map is populated when the page is loaded
// document.addEventListener('DOMContentLoaded', populateStoreMap);
document.addEventListener('DOMContentLoaded', () => {
    populateStoreMap(); // Populate categories when the page loads
});


// Initialization
document.addEventListener('DOMContentLoaded', () => {
    updateListSelector();
    renderList();
    populateStoreMap(); // Pre-populate for Store Map readiness
});






