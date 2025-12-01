/**
 * Live Sessions JavaScript
 * Handles session scheduling, booking, countdowns, and attendance
 */

import { auth, db } from '../firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    arrayUnion,
    arrayRemove,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

let currentUser = null;
let currentSessionId = null;
let countdownInterval = null;

// ==================================
// AUTH CHECK
// ==================================

onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    await loadSessions();
});

// ==================================
// LOAD SESSIONS
// ==================================

async function loadSessions() {
    try {
        const sessionsRef = collection(db, 'liveSessions');
        const q = query(sessionsRef, orderBy('scheduledTime', 'asc'));
        
        const snapshot = await getDocs(q);
        
        const now = new Date();
        const upcomingSessions = [];
        const pastSessions = [];
        let liveSession = null;
        
        snapshot.forEach((doc) => {
            const session = { id: doc.id, ...doc.data() };
            const sessionTime = session.scheduledTime.toDate();
            const sessionEnd = new Date(sessionTime.getTime() + (session.duration || 60) * 60000);
            
            if (sessionTime <= now && now <= sessionEnd) {
                // Live now
                liveSession = session;
            } else if (sessionTime > now) {
                // Upcoming
                upcomingSessions.push(session);
            } else {
                // Past
                pastSessions.push(session);
            }
        });
        
        // Display sections
        displayLiveSession(liveSession);
        displayUpcomingSessions(upcomingSessions.slice(0, 12)); // Show first 12
        displayPastSessions(pastSessions.slice(0, 6)); // Show first 6
        
    } catch (error) {
        console.error('Error loading sessions:', error);
    }
}

// ==================================
// DISPLAY LIVE SESSION
// ==================================

function displayLiveSession(session) {
    const liveNowSection = document.getElementById('liveNowSection');
    
    if (!session) {
        liveNowSection.style.display = 'none';
        return;
    }
    
    liveNowSection.style.display = 'block';
    document.getElementById('liveSessionTitle').textContent = session.title;
    document.getElementById('liveSessionTrainer').textContent = `with ${session.trainer}`;
    document.getElementById('liveSessionViewers').innerHTML = `<i class="fas fa-users"></i> ${session.viewers || 0} watching`;
    
    // Store session ID for join button
    window.currentLiveSession = session;
}

// ==================================
// DISPLAY UPCOMING SESSIONS
// ==================================

function displayUpcomingSessions(sessions) {
    const grid = document.getElementById('upcomingSessionsGrid');
    const emptyMessage = document.getElementById('noSessionsMessage');
    
    if (sessions.length === 0) {
        grid.style.display = 'none';
        emptyMessage.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    emptyMessage.style.display = 'none';
    grid.innerHTML = '';
    
    sessions.forEach((session) => {
        const card = createSessionCard(session, 'upcoming');
        grid.appendChild(card);
    });
}

// ==================================
// DISPLAY PAST SESSIONS
// ==================================

function displayPastSessions(sessions) {
    const grid = document.getElementById('pastSessionsGrid');
    
    if (sessions.length === 0) {
        grid.innerHTML = '<p class="empty-state">No past sessions available yet.</p>';
        return;
    }
    
    grid.innerHTML = '';
    
    sessions.forEach((session) => {
        const card = createSessionCard(session, 'past');
        grid.appendChild(card);
    });
}

// ==================================
// CREATE SESSION CARD
// ==================================

function createSessionCard(session, type) {
    const card = document.createElement('div');
    card.className = 'session-card glass';
    
    const sessionTime = session.scheduledTime.toDate();
    const timeString = sessionTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const dateString = sessionTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    const spotsLeft = (session.maxParticipants || 50) - (session.booked?.length || 0);
    const isBooked = currentUser && session.booked?.includes(currentUser.uid);
    
    card.innerHTML = `
        <div class="session-thumbnail">
            <div class="session-badge ${type}">${type === 'past' ? 'Recording' : 'Upcoming'}</div>
            <div class="session-time-overlay">
                <i class="fas fa-clock"></i> ${type === 'past' ? 'Watch anytime' : `${dateString} • ${timeString}`}
            </div>
        </div>
        <div class="session-body">
            <h3 class="session-title">${session.title}</h3>
            <div class="session-trainer">
                <i class="fas fa-user"></i>
                <span>${session.trainer}</span>
            </div>
            <p class="session-description">${session.description || 'Join this amazing session!'}</p>
            <div class="session-meta">
                <span><i class="fas fa-clock"></i> ${session.duration || 45} min</span>
                <span><i class="fas fa-signal"></i> ${session.level || 'All Levels'}</span>
                <span><i class="fas fa-tag"></i> ${session.category || 'Workout'}</span>
            </div>
            <div class="session-footer">
                <div class="session-spots ${spotsLeft < 10 ? 'limited' : ''}">
                    ${type === 'past' ? `${session.booked?.length || 0} attended` : `${spotsLeft} spots left`}
                </div>
                <button class="session-cta" onclick="showSessionModal('${session.id}')">
                    ${type === 'past' ? 'Watch' : isBooked ? 'View Details' : 'Book Now'}
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// ==================================
// SHOW SESSION MODAL
// ==================================

window.showSessionModal = async (sessionId) => {
    try {
        currentSessionId = sessionId;
        
        // Get sessiondata
        const sessionRef = doc(db, 'liveSessions', sessionId);
        const sessionDoc = await getDoc(sessionRef);
        
        if (!sessionDoc.exists()) {
            alert('Session not found');
            return;
        }
        
        const session = sessionDoc.data();
        const sessionTime = session.scheduledTime.toDate();
        const isBooked = currentUser && session.booked?.includes(currentUser.uid);
        
        // Populate modal
        document.getElementById('modalSessionTitle').textContent = session.title;
        document.getElementById('modalSessionTrainer').textContent = session.trainer;
        document.getElementById('modalSessionDuration').textContent = `${session.duration || 45} min`;
        document.getElementById('modalSessionSlots').textContent = `${(session.maxParticipants || 50)} spots`;
        document.getElementById('modalSessionLevel').textContent = session.level || 'All Levels';
        document.getElementById('modalSessionDescription').textContent = session.description || 'Join this amazing session!';
        
        // Update book button
        const bookBtn = document.getElementById('bookSessionBtn');
        if (isBooked) {
            bookBtn.innerHTML = '<i class="fas fa-check-circle"></i><span>Booked</span>';
            bookBtn.style.background = '#10b981';
        } else {
            bookBtn.innerHTML = '<i class="fas fa-check"></i><span>Book Your Spot</span>';
            bookBtn.style.background = '';
        }
        
        // Show booked users
        displayBookedUsers(session.booked || []);
        
        // Start countdown
        startCountdown(sessionTime);
        
        // Show modal
        document.getElementById('sessionModal').classList.add('active');
    } catch (error) {
        console.error('Error showing session modal:', error);
    }
};

// ==================================
// CLOSE SESSION MODAL
// ==================================

window.closeSessionModal = () => {
    document.getElementById('sessionModal').classList.remove('active');
    
    // Stop countdown
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
};

// ==================================
// START COUNTDOWN
// ==================================

function startCountdown(targetDate) {
    // Clear existing interval
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;
        
        if (distance < 0) {
            document.getElementById('sessionCountdown').innerHTML = '<h3 style="color: #10b981;">Session is Live Now!</h3>';
            clearInterval(countdownInterval);
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('countdownDays').textContent = String(days).padStart(2, '0');
        document.getElementById('countdownHours').textContent = String(hours).padStart(2, '0');
        document.getElementById('countdownMinutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('countdownSeconds').textContent = String(seconds).padStart(2, '0');
    }
    
    // Update immediately
    updateCountdown();
    
    // Update every second
    countdownInterval = setInterval(updateCountdown, 1000);
}

// ==================================
// DISPLAY BOOKED USERS
// ==================================

async function displayBookedUsers(bookedUserIds) {
    const container = document.getElementById('bookedAvatars');
    const countEl = document.getElementById('bookedCount');
    
    countEl.textContent = bookedUserIds.length;
    container.innerHTML = '';
    
    // Show first 20 users
    const displayIds = bookedUserIds.slice(0, 20);
    
    for (const userId of displayIds) {
        try {
            const userRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userRef);
            
            const avatar = document.createElement('div');
            avatar.className = 'booked-avatar';
            
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const initials = (userData.displayName || userData.email || 'U').substring(0, 2).toUpperCase();
                avatar.textContent = initials;
                avatar.title = userData.displayName || userData.email;
            } else {
                avatar.textContent = 'U';
            }
            
            container.appendChild(avatar);
        } catch (error) {
            console.error('Error loading user:', error);
        }
    }
    
    // Show "+X more" if there are more users
    if (bookedUserIds.length > 20) {
        const moreAvatar = document.createElement('div');
        moreAvatar.className = 'booked-avatar';
        moreAvatar.textContent = `+${bookedUserIds.length - 20}`;
        moreAvatar.style.background = 'rgba(255, 255, 255, 0.2)';
        container.appendChild(moreAvatar);
    }
}

// ==================================
// BOOK SESSION
// ==================================

document.getElementById('bookSessionBtn')?.addEventListener('click', async () => {
    if (!currentUser) {
        alert('Please log in to book a session');
        window.location.href = 'admin-login.html';
        return;
    }
    
    if (!currentSessionId) return;
    
    try {
        const sessionRef = doc(db, 'liveSessions', currentSessionId);
        const sessionDoc = await getDoc(sessionRef);
        const session = sessionDoc.data();
        
        const isBooked = session.booked?.includes(currentUser.uid);
        
        if (isBooked) {
            // Unbook
            await updateDoc(sessionRef, {
                booked: arrayRemove(currentUser.uid)
            });
            
            document.getElementById('bookSessionBtn').innerHTML = '<i class="fas fa-check"></i><span>Book Your Spot</span>';
            document.getElementById('bookSessionBtn').style.background = '';
            
            alert('Booking cancelled');
        } else {
            // Check if session is full
            const maxParticipants = session.maxParticipants || 50;
            if ((session.booked?.length || 0) >= maxParticipants) {
                alert('Sorry, this session is fully booked');
                return;
            }
            
            // Book
            await updateDoc(sessionRef, {
                booked: arrayUnion(currentUser.uid)
            });
            
            document.getElementById('bookSessionBtn').innerHTML = '<i class="fas fa-check-circle"></i><span>Booked</span>';
            document.getElementById('bookSessionBtn').style.background = '#10b981';
            
            alert('Session booked successfully! You will receive a reminder before it starts.');
        }
        
        // Reload sessions
        await loadSessions();
        
        // Refresh booked users
        const updatedSession = await getDoc(sessionRef);
        displayBookedUsers(updatedSession.data().booked || []);
        
    } catch (error) {
        console.error('Error booking session:', error);
        alert('Error booking session. Please try again.');
    }
});

// ==================================
// ADD TO CALENDAR
// ==================================

document.getElementById('addToCalendarBtn')?.addEventListener('click', () => {
    // TODO: Generate .ics file
    alert('Calendar event coming soon!');
});

// ==================================
// JOIN LIVE SESSION
// ==================================

window.joinLiveSession = () => {
    if (!window.currentLiveSession) return;
    
    const session = window.currentLiveSession;
    
    // TODO: Open video conferencing link
    if (session.meetingLink) {
        window.open(session.meetingLink, '_blank');
    } else {
        alert('Meeting link will be available soon!');
    }
};

// ==================================
// JOIN NOW BUTTON (HEADER)
// ==================================

document.getElementById('joinNowBtn')?.addEventListener('click', () => {
    if (window.currentLiveSession) {
        joinLiveSession();
    } else {
        // Scroll to upcoming sessions
        document.getElementById('upcomingSessionsGrid').scrollIntoView({ behavior: 'smooth' });
    }
});

console.log('Live sessions loaded!');
