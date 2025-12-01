/**
 * Leaderboard JavaScript
 * Displays rankings and achievements
 */

import { auth, db } from '../firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { collection, query, orderBy, limit, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { ACHIEVEMENTS, LEVEL_CONFIG } from './gamification.js';

let currentUser = null;
let currentPeriod = 'allTime';

// ==================================
// AUTH CHECK
// ==================================

onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        await loadUserRank();
    }
    
    // Load leaderboard (works for both logged in and anonymous)
    await loadLeaderboard(currentPeriod);
    loadAchievementsShowcase();
});

// ==================================
// LOAD USER'S RANK
// ==================================

async function loadUserRank() {
    try {
        const userStatsRef = doc(db, 'userStats', currentUser.uid);
        const userDoc = await getDoc(userStatsRef);
        
        if (!userDoc.exists()) {
            return;
        }
        
        const userStats = userDoc.data();
        const userRankCard = document.getElementById('userRankCard');
        userRankCard.style.display = 'block';
        
        // Display user info
        document.getElementById('userName').textContent = currentUser.displayName || currentUser.email.split('@')[0];
        document.getElementById('userPoints').textContent = userStats.points || 0;
        document.getElementById('userWorkouts').textContent = `${userStats.workoutsCompleted || 0} workouts`;
        
        // Level info
        const level = userStats.level || 1;
        const levelInfo = LEVEL_CONFIG.levels.find(l => l.level === level);
        const nextLevelInfo = LEVEL_CONFIG.levels.find(l => l.level === level + 1);
        
        document.getElementById('userLevel').textContent = `Level ${level} • ${levelInfo.title}`;
        document.getElementById('currentLevel').textContent = level;
        
        if (nextLevelInfo) {
            const pointsToNextString = (nextLevelInfo.pointsRequired - userStats.points).toLocaleString();
            document.getElementById('pointsToNext').textContent = pointsToNextLevel;
            document.getElementById('nextLevel').textContent = nextLevelInfo.level;
            
            // Calculate progress percentage
            const currentLevelPoints = levelInfo.pointsRequired;
            const nextLevelPoints = nextLevelInfo.pointsRequired;
            const progress = ((userStats.points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
            document.getElementById('levelProgressFill').style.width = `${Math.min(progress, 100)}%`;
        } else {
            document.getElementById('pointsToNext').textContent = 'Max';
            document.getElementById('nextLevel').textContent = level;
            document.getElementById('levelProgressFill').style.width = '100%';
        }
        
        // Get user's rank
        const rank = await getUserRank(userStats.points);
        document.getElementById('userRank').textContent = rank;
    } catch (error) {
        console.error('Error loading user rank:', error);
    }
}

async function getUserRank(userPoints) {
    try {
        const statsRef = collection(db, 'userStats');
        const q = query(statsRef, orderBy('points', 'desc'));
        const snapshot = await getDocs(q);
        
        let rank = 1;
        snapshot.forEach((doc) => {
            if (doc.data().points > userPoints) {
                rank++;
            }
        });
        
        return rank;
    } catch (error) {
        console.error('Error getting user rank:', error);
        return '-';
    }
}

// ==================================
// LOAD LEADERBOARD
// ==================================

async function loadLeaderboard(period = 'allTime') {
    try {
        const leaderboardList = document.getElementById('leaderboardList');
        const emptyState = document.getElementById('emptyState');
        
        leaderboardList.innerHTML = '<div style="text-align: center; padding: var(--s-4);"><i class="fas fa-spinner fa-spin" style="font-size: 2rem;"></i></div>';
        
        const statsRef = collection(db, 'userStats');
        const q = query(statsRef, orderBy('points', 'desc'), limit(100));
        
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
            leaderboardList.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }
        
        leaderboardList.style.display = 'flex';
        emptyState.style.display = 'none';
        leaderboardList.innerHTML = '';
        
        let rank = 1;
        snapshot.forEach((doc) => {
            const user = doc.data();
            const item = createLeaderboard Item(rank, user, doc.id);
            leaderboardList.appendChild(item);
            rank++;
        });
    } catch (error) {
        console.error('Error loading leaderboard:', error);
        const leaderboardList = document.getElementById('leaderboardList');
        leaderboardList.innerHTML = '<p class="empty-state">Error loading leaderboard. Please refresh.</p>';
    }
}

function createLeaderboardItem(rank, user, userId) {
    const item = document.createElement('div');
    item.className = 'leaderboard-item';
    
    const level = user.level || 1;
    const levelInfo = LEVEL_CONFIG.levels.find(l => l.level === level) || LEVEL_CONFIG.levels[0];
    
    // Get initials from email if no display name
    const displayName = user.displayName || user.email || 'User';
    const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    
    item.innerHTML = `
        <div class="leaderboard-rank">${rank}</div>
        <div class="leaderboard-avatar">${initials}</div>
        <div class="leaderboard-user">
            <div class="leaderboard-name">${displayName}</div>
            <div class="leaderboard-level">Level ${level} • ${levelInfo.title}</div>
        </div>
        <div class="leaderboard-stats">
            <div class="leaderboard-points">${(user.points || 0).toLocaleString()}</div>
            <div class="leaderboard-workouts">${(user.workoutsCompleted || 0)} workouts</div>
        </div>
    `;
    
    // Highlight current user
    if (currentUser && userId === currentUser.uid) {
        item.style.border = '2px solid var(--c-primary)';
        item.style.background = 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(116, 75, 162, 0.2))';
    }
    
    return item;
}

// ==================================
// LOAD ACHIEVEMENTS SHOWCASE
// ==================================

function loadAchievementsShowcase() {
    const showcase = document.getElementById('achievementsShowcase');
    showcase.innerHTML = '';
    
    // Show first 12 achievements
    const achievementList = Object.values(ACHIEVEMENTS).slice(0, 12);
    
    achievementList.forEach((achievement) => {
        const card = document.createElement('div');
        card.className = 'glass';
        card.style.padding = 'var(--s-3)';
        card.style.textAlign = 'center';
        card.style.cursor = 'pointer';
        card.style.transition = 'var(--transition)';
        
        card.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: var(--s-2);">${achievement.icon}</div>
            <div style="font-weight: 700; margin-bottom: var(--s-1); color: var(--c-text);">${achievement.name}</div>
            <div style="font-size: 0.8125rem; color: var(--c-text-muted); margin-bottom: var(--s-2);">${achievement.description}</div>
            <div class="points-display" style="justify-content: center;">
                <span class="points-display__icon">⭐</span>
                <span class="points-display__value">${achievement.points} pts</span>
            </div>
        `;
        
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
            card.style.boxShadow = 'var(--shadow-xl)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'var(--shadow)';
        });
        
        showcase.appendChild(card);
    });
}

// ==================================
// FILTER BUTTONS
// ==================================

document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Get period
        const period = btn.dataset.period;
        currentPeriod = period;
        
        // Reload leaderboard
        loadLeaderboard(period);
    });
});

console.log('Leaderboard loaded!');
