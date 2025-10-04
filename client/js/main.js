// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// DOM Elements
const eventsContainer = document.getElementById('events-container');

// Format date to readable string
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

// Format currency - 修复版本
function formatCurrency(amount) {
    // 处理各种可能的情况
    if (amount === null || amount === undefined || amount === '') {
        return 'Free';
    }
    
    // 确保是数字类型
    const numericAmount = parseFloat(amount);
    
    if (isNaN(numericAmount)) {
        return 'Free';
    }
    
    if (numericAmount === 0) {
        return 'Free';
    }
    
    return `$${numericAmount.toFixed(2)}`;
}

// Truncate text to specified length
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Create event card HTML
function createEventCard(event) {
    console.log('Processing event:', event); // 调试信息
    
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

// Load and display events
async function loadEvents() {
    try {
        eventsContainer.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>Loading events...</p>
            </div>
        `;
        
        console.log('Fetching events from:', `${API_BASE_URL}/events`); // 调试信息
        
        const response = await fetch(`${API_BASE_URL}/events`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('API Response:', result); // 调试信息

        if (result.success && result.data && result.data.length > 0) {
            const eventsHTML = result.data.map(createEventCard).join('');
            eventsContainer.innerHTML = `
                <div class="events-grid">
                    ${eventsHTML}
                </div>
            `;
        } else {
            eventsContainer.innerHTML = `
                <div class="error-state">
                    <h3>No Events Available</h3>
                    <p>There are currently no upcoming events. Check back soon for new opportunities to make a difference.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading events:', error);
        eventsContainer.innerHTML = `
            <div class="error-state">
                <h3>Connection Issue</h3>
                <p>We're having trouble loading events right now. Please check your connection and try again.</p>
                <p style="margin-top: 1rem; font-size: 0.875rem;">Error: ${error.message}</p>
            </div>
        `;
    }
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadEvents();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});