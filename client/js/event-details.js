// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// DOM Elements
const loadingState = document.getElementById('loadingState');
const eventContent = document.getElementById('eventContent');
const errorState = document.getElementById('errorState');
const registrationModal = document.getElementById('registrationModal');
const registerButton = document.getElementById('registerButton');

// State
let currentEvent = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    
    if (eventId) {
        loadEventDetails(eventId);
    } else {
        showErrorState('No event ID provided in URL');
    }
    
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    registerButton.addEventListener('click', openRegistrationModal);
    
    // Close modal when clicking outside
    registrationModal.addEventListener('click', function(event) {
        if (event.target === registrationModal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
}

// Load event details from API
async function loadEventDetails(eventId) {
    try {
        showLoadingState();
        
        const response = await fetch(`${API_BASE_URL}/events/${eventId}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Event not found');
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
            currentEvent = result.data;
            displayEventDetails(currentEvent);
            showEventContent();
        } else {
            throw new Error('Event data not available');
        }
        
    } catch (error) {
        console.error('Error loading event details:', error);
        showErrorState(error.message);
    }
}

// Display event details on the page
function displayEventDetails(event) {
    // Update breadcrumb
    document.getElementById('breadcrumbEventName').textContent = event.title;
    
    // Update event header
    document.getElementById('eventCategory').textContent = event.category_name;
    document.getElementById('eventTitle').textContent = event.title;
    document.getElementById('eventDate').textContent = formatDetailedDate(event.event_date);
    document.getElementById('eventLocation').textContent = event.location;
    document.getElementById('eventOrganization').textContent = event.organization_name;
    
    // Update event image
    const eventImage = document.getElementById('eventImage');
    if (event.image_url && event.image_url !== '/images/events/default-event.jpg') {
        eventImage.innerHTML = `<img src="${event.image_url}" alt="${event.title}" style="width:100%;height:100%;object-fit:cover;">`;
    } else {
        eventImage.textContent = event.category_name + ' Event';
    }
    
    // Update event description
    document.getElementById('eventDescription').textContent = event.description;
    
    // Update fundraising progress
    const goalAmount = parseFloat(event.fundraising_goal) || 0;
    const currentAmount = parseFloat(event.current_amount) || 0;
    const progressPercentage = goalAmount > 0 ? Math.min((currentAmount / goalAmount) * 100, 100) : 0;
    
    document.getElementById('progressAmount').textContent = formatCurrency(currentAmount);
    document.getElementById('goalAmount').textContent = formatCurrency(goalAmount);
    document.getElementById('progressFill').style.width = `${progressPercentage}%`;
    document.getElementById('progressPercentage').textContent = `${Math.round(progressPercentage)}%`;
    
    // Update event details
    document.getElementById('eventVenue').textContent = event.venue_name || 'To be announced';
    document.getElementById('registrationDeadline').textContent = event.registration_deadline 
        ? formatDetailedDate(event.registration_deadline) 
        : 'Not specified';
    document.getElementById('maxAttendees').textContent = event.max_attendees 
        ? `${event.max_attendees} people` 
        : 'Not specified';
    document.getElementById('eventStatus').textContent = event.is_active ? 'Active' : 'Inactive';
    
    // Update ticket price
    document.getElementById('ticketPrice').textContent = formatCurrency(event.ticket_price);
    
    // Update organization info
    document.getElementById('orgName').textContent = event.organization_name;
    document.getElementById('orgDescription').textContent = event.organization_description || 'A charitable organization dedicated to making a difference.';
    document.getElementById('orgEmail').textContent = event.contact_email || 'Not provided';
    document.getElementById('orgPhone').textContent = event.contact_phone || 'Not provided';
    document.getElementById('orgAddress').textContent = event.organization_address || 'Not provided';
    
    // Update organization logo
    const orgLogo = document.getElementById('orgLogo');
    if (event.organization_logo && event.organization_logo !== '/images/logos/default-org-logo.png') {
        orgLogo.innerHTML = `<img src="${event.organization_logo}" alt="${event.organization_name}" style="width:100%;height:100%;object-fit:cover;border-radius:0.5rem;">`;
    } else {
        orgLogo.textContent = event.organization_name.substring(0, 2).toUpperCase();
    }
    
    // Update modal with organizer contact
    document.getElementById('modalOrgEmail').textContent = event.contact_email || 'Email not provided';
    document.getElementById('modalOrgPhone').textContent = event.contact_phone || 'Phone not provided';
}

// Show loading state
function showLoadingState() {
    loadingState.style.display = 'flex';
    eventContent.style.display = 'none';
    errorState.style.display = 'none';
}

// Show event content
function showEventContent() {
    loadingState.style.display = 'none';
    eventContent.style.display = 'block';
    errorState.style.display = 'none';
}

// Show error state
function showErrorState(errorMessage) {
    loadingState.style.display = 'none';
    eventContent.style.display = 'none';
    errorState.style.display = 'block';
    
    console.error('Event details error:', errorMessage);
}

// Open registration modal
function openRegistrationModal() {
    registrationModal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Close modal
function closeModal() {
    registrationModal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

// Share event function
function shareEvent() {
    if (navigator.share) {
        navigator.share({
            title: currentEvent.title,
            text: currentEvent.short_description || currentEvent.description.substring(0, 100),
            url: window.location.href
        }).catch(error => {
            console.log('Error sharing:', error);
            fallbackShare();
        });
    } else {
        fallbackShare();
    }
}

// Fallback share method
function fallbackShare() {
    // Copy URL to clipboard
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Event URL copied to clipboard! You can now share it.');
    }).catch(() => {
        // Fallback if clipboard fails
        prompt('Copy this URL to share:', window.location.href);
    });
}

// Utility functions
function formatDetailedDate(dateString) {
    const options = { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
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