// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// DOM Elements
const searchForm = document.getElementById('searchForm');
const resultsContainer = document.getElementById('resultsContainer');
const categorySelect = document.getElementById('category');
const clearFiltersBtn = document.getElementById('clearFilters');

// State
let currentFilters = {};
let categories = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadCategories();
    setupEventListeners();
});

// Load categories for the dropdown
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
            categories = result.data;
            populateCategoryDropdown();
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        // Fallback to empty categories
        categories = [];
    }
}

// Populate category dropdown
function populateCategoryDropdown() {
    categorySelect.innerHTML = '<option value="">All Categories</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}

// Setup event listeners
function setupEventListeners() {
    searchForm.addEventListener('submit', handleSearch);
    clearFiltersBtn.addEventListener('click', clearFilters);
}

// Handle search form submission
async function handleSearch(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(searchForm);
    currentFilters = {
        category: formData.get('category'),
        location: formData.get('location'),
        date: formData.get('date'),
        title: formData.get('title'),        
        is_active: formData.get('is_active') 
    };
    
    // Remove the filter conditions for null values
    Object.keys(currentFilters).forEach(key => {
        if (currentFilters[key] === '') {
            delete currentFilters[key];
        }
    });
    
    await performSearch(currentFilters);
}

// Perform the search
async function performSearch(filters) {
    try {
        // Show loading state
        showLoadingState();
        
        // Build query string
        const queryParams = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            queryParams.append(key, filters[key]);
        });
        
        const url = `${API_BASE_URL}/events/search?${queryParams.toString()}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        displaySearchResults(result, filters);
        
    } catch (error) {
        console.error('Error performing search:', error);
        showErrorState(error.message);
    }
}

// Display search results
function displaySearchResults(result, filters) {
    if (result.success && result.data && result.data.length > 0) {
        const resultsHTML = `
            <div class="results-header">
                <div class="results-count">
                    Found ${result.count} event${result.count !== 1 ? 's' : ''}
                    ${Object.keys(filters).length > 0 ? ' matching your criteria' : ''}
                </div>
            </div>
            <div class="events-grid">
                ${result.data.map(createEventCard).join('')}
            </div>
        `;
        
        resultsContainer.innerHTML = resultsHTML;
    } else {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <h3>No Events Found</h3>
                <p>We couldn't find any events matching your search criteria.</p>
                <p>Try adjusting your filters or <a href="javascript:void(0)" onclick="clearFilters()">clear all filters</a> to see all available events.</p>
            </div>
        `;
    }
}

// Create event card HTML (similar to main.js but adapted for search results)
function createEventCard(event) {
    const imageContent = event.image_url && event.image_url !== '/images/events/default-event.jpg' 
        ? `<img src="${event.image_url}" alt="${event.title}" style="width:100%;height:100%;object-fit:cover;">`
        : `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;background:#e2e8f0;color:#64748b;">${event.category_name}</div>`;
    
    return `
        <div class="event-card">
            <div class="event-image">
                ${imageContent}
            </div>
            <div class="event-content">
                <div class="event-category">${event.category_name}</div>
                <h3 class="event-title">${event.title}</h3>
                <div class="event-meta">
                    <div><strong>Date:</strong> ${formatDate(event.event_date)}</div>
                    <div><strong>Location:</strong> ${event.location}</div>
                    <div><strong>Organizer:</strong> ${event.organization_name}</div>
                </div>
                <p class="event-description">${truncateText(event.short_description || event.description, 120)}</p>
                <div class="event-footer">
                    <div class="event-price">${formatCurrency(event.ticket_price)}</div>
                    <a href="event-details.html?id=${event.id}" class="btn btn-outline">View Details</a>
                </div>
            </div>
        </div>
    `;
}

// Show loading state
function showLoadingState() {
    resultsContainer.innerHTML = `
        <div class="search-loading">
            <div class="search-loading-spinner"></div>
            <p>Searching for events...</p>
        </div>
    `;
}

// Show error state
function showErrorState(errorMessage) {
    resultsContainer.innerHTML = `
        <div class="error-state">
            <h3>Search Failed</h3>
            <p>We encountered an error while searching for events. Please try again.</p>
            <p style="margin-top: 1rem; font-size: 0.875rem;">Error: ${errorMessage}</p>
        </div>
    `;
}

// Clear all filters
function clearFilters() {
    searchForm.reset();
    currentFilters = {};
    
    // Reset to initial state
    resultsContainer.innerHTML = `
        <div class="empty-state">
            <h3>Ready to Search</h3>
            <p>Use the filters above to find charity events that match your criteria.</p>
        </div>
    `;
}

// Utility functions (same as main.js)
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-AU', options);
}

function formatCurrency(amount) {
    if (amount === null || amount === undefined || amount === '') {
        return 'Free';
    }
    
    const numericAmount = parseFloat(amount);
    
    if (isNaN(numericAmount)) {
        return 'Free';
    }
    
    if (numericAmount === 0) {
        return 'Free';
    }
    
    return `$${numericAmount.toFixed(2)}`;
}

function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}