/**
 * Dashboard JavaScript - Main Logic
 * Handles user dashboard data, charts, and interactions
 */

import { auth, db } from '../firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// Global state
let currentUser = null;
let userStats = null;

// ==================================
// AUTH PROTECTION
// ==================================

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        // Redirect to login if not authenticated
        window.location.href = 'admin-login.html';
    } else {
        currentUser = user;
        document.getElementById('userName').textContent = user.displayName || user.email.split('@')[0];
        
        // Load dashboard data
        await loadUserStats();
        await loadSchedule();
        await loadGoals();
        await loadAchievements();
        await loadNutrition();
    }
});

// Logout functionality
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
    }
});

// ==================================
// LOAD USER STATS
// ==================================

async function loadUserStats() {
    try {
        const userStatsRef = doc(db, 'userStats', currentUser.uid);
        const statsDoc = await getDoc(userStatsRef);
        
        if (statsDoc.exists()) {
            userStats = statsDoc.data();
        } else {
            // Initialize default stats
            userStats = {
                streak: 0,
                weeklyWorkouts: 0,
                totalCalories: 0,
                currentWeight: 0,
                goalWeight: 0,
                points: 0,
                level: 1,
                workoutHistory: [],
                goals: [],
                achievements: []
            };
            
            // Save to Firestore
            await setDoc(userStatsRef, {
                ...userStats,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        }
        
        // Update UI
        updateStatsUI();
    } catch (error) {
        console.error('Error loading user stats:', error);
    }
}

function updateStatsUI() {
    // Update streak
    document.getElementById('streakValue').textContent = userStats.streak || 0;
    
    // Update workouts
    document.getElementById('workoutsValue').textContent = userStats.weeklyWorkouts || 0;
    document.getElementById('workoutsChange').textContent = `+${userStats.weeklyWorkouts || 0}`;
    
    // Update calories
    document.getElementById('caloriesValue').textContent = userStats.totalCalories || 0;
    
    // Update weight
    const currentWeight = userStats.currentWeight || 0;
    const weightChange = userStats.weightChange || 0;
    document.getElementById('weightValue').textContent = currentWeight;
    
    const weightChangeEl = document.getElementById('weightChange');
    if (weightChange < 0) {
        weightChangeEl.classList.add('positive');
        weightChangeEl.innerHTML = `<i class="fas fa-arrow-down"></i><span>${weightChange} kg this week</span>`;
    } else if (weightChange > 0) {
        weightChangeEl.classList.remove('positive');
        weightChangeEl.classList.add('negative');
        weightChangeEl.innerHTML = `<i class="fas fa-arrow-up"></i><span>+${weightChange} kg this week</span>`;
    }
}

// ==================================
// LOAD WORKOUT SCHEDULE
// ==================================

async function loadSchedule() {
    try {
        const scheduleList = document.getElementById('scheduleList');
        
        // Query user's scheduled workouts for this week
        const workoutsRef = collection(db, 'userWorkouts');
        const now = new Date();
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        
        const q = query(
            workoutsRef,
            where('userId', '==', currentUser.uid),
            where('scheduledDate', '>=', weekStart),
            orderBy('scheduledDate', 'asc'),
            limit(7)
        );
        
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            scheduleList.innerHTML = '<p class="empty-state">No workouts scheduled this week. Click "Add" to plan your week!</p>';
            return;
        }
        
        scheduleList.innerHTML = '';
        
        querySnapshot.forEach((doc) => {
            const workout = doc.data();
            const scheduleDate = workout.scheduledDate.toDate();
            
            const scheduleItem = createScheduleItem(doc.id, workout, scheduleDate);
            scheduleList.appendChild(scheduleItem);
        });
    } catch (error) {
        console.error('Error loading schedule:', error);
        document.getElementById('scheduleList').innerHTML = '<p class="empty-state">Error loading schedule. Please refresh.</p>';
    }
}

function createScheduleItem(id, workout, date) {
    const item = document.createElement('div');
    item.className = 'schedule-item';
    
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    item.innerHTML = `
        <div class="schedule-date">
            <div class="schedule-day">${day}</div>
            <div class="schedule-month">${month}</div>
        </div>
        <div class="schedule-content">
            <div class="schedule-title">${workout.title || 'Workout'}</div>
            <div class="schedule-time">
                <i class="fas fa-clock"></i>
                ${time} • ${workout.duration || 30} min
            </div>
        </div>
        <div class="schedule-actions">
            <button class="schedule-btn" onclick="startWorkout('${id}')">
                <i class="fas fa-play"></i> Start
            </button>
            <button class="schedule-btn" onclick="editWorkout('${id}')">
                <i class="fas fa-edit"></i>
            </button>
        </div>
    `;
    
    return item;
}

// ==================================
// LOAD GOALS
// ==================================

async function loadGoals() {
    try {
        const goalsList = document.getElementById('goalsList');
        
        if (!userStats.goals || userStats.goals.length === 0) {
            goalsList.innerHTML = '<p class="empty-state">No active goals. Click "Set Goal" to add one!</p>';
            return;
        }
        
        goalsList.innerHTML = '';
        
        userStats.goals.forEach((goal) => {
            const progress = calculateGoalProgress(goal);
            const goalItem = createGoalItem(goal, progress);
            goalsList.appendChild(goalItem);
        });
    } catch (error) {
        console.error('Error loading goals:', error);
    }
}

function calculateGoalProgress(goal) {
    // Calculate progress based on goal type
    switch (goal.type) {
        case 'weight':
            const weightDiff = Math.abs(userStats.currentWeight - goal.startValue);
            const goalDiff = Math.abs(goal.targetValue - goal.startValue);
            return Math.min((weightDiff / goalDiff) * 100, 100);
        
        case 'workouts':
            return Math.min((userStats.weeklyWorkouts / goal.targetValue) * 100, 100);
        
        case 'calories':
            return Math.min((userStats.totalCalories / goal.targetValue) * 100, 100);
        
        default:
            return 0;
    }
}

function createGoalItem(goal, progress) {
    const item = document.createElement('div');
    item.className = 'goal-item';
    
    item.innerHTML = `
        <div class="goal-header">
            <span class="goal-name">${goal.name}</span>
            <span class="goal-percentage">${Math.round(progress)}%</span>
        </div>
        <div class="goal-progress">
            <div class="goal-progress-bar" style="width: ${progress}%"></div>
        </div>
    `;
    
    return item;
}

// ==================================
// LOAD ACHIEVEMENTS
// ==================================

async function loadAchievements() {
    const achievementsGrid = document.getElementById('achievementsGrid');
    
    // Define all available achievements
    const allAchievements = [
        { id: 'first_workout', name: 'First Workout', icon: '🏃' },
        { id: '10_workouts', name: '10 Workouts', icon: '💪' },
        { id: '50_workouts', name: '50 Workouts', icon: '🔥' },
        { id: '7_day_streak', name: '7 Day Streak', icon: '⚡' },
        { id: '30_day_streak', name: '30 Day Streak', icon: '✨' },
        { id: '1000_calories', name: '1000 Calories', icon: '🎯' },
        { id: '5000_calories', name: '5000 Calories', icon: '🚀' },
        { id: 'first_goal', name: 'First Goal', icon: '🎖️' },
    ];
    
    const unlockedAchievements = userStats.achievements || [];
    
    achievementsGrid.innerHTML = '';
    
    allAchievements.forEach((achievement) => {
        const isUnlocked = unlockedAchievements.includes(achievement.id);
        const achievementItem = createAchievementItem(achievement, isUnlocked);
        achievementsGrid.appendChild(achievementItem);
    });
}

function createAchievementItem(achievement, isUnlocked) {
    const item = document.createElement('div');
    item.className = `achievement-item ${!isUnlocked ? 'achievement-locked' : ''}`;
    item.title = achievement.name;
    
    item.innerHTML = `
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-name">${achievement.name}</div>
    `;
    
    return item;
}

// ==================================
// LOAD NUTRITION DATA
// ==================================

async function loadNutrition() {
    try {
        const today = new Date().toISOString().split('T')[0];
        const nutritionRef = doc(db, 'userNutrition', `${currentUser.uid}_${today}`);
        const nutritionDoc = await getDoc(nutritionRef);
        
        let nutrition = {
            protein: 0,
            carbs: 0,
            fats: 0,
            meals: []
        };
        
        if (nutritionDoc.exists()) {
            nutrition = nutritionDoc.data();
        }
        
        // Update macro values
        document.getElementById('proteinValue').textContent = `${nutrition.protein}g`;
        document.getElementById('carbsValue').textContent = `${nutrition.carbs}g`;
        document.getElementById('fatsValue').textContent = `${nutrition.fats}g`;
        
        // Update meal log
        const mealLog = document.getElementById('mealLog');
        if (nutrition.meals && nutrition.meals.length > 0) {
            mealLog.innerHTML = '<h4 class="meal-log-title">Today\'s Meals</h4>';
            nutrition.meals.forEach((meal) => {
                const mealItem = document.createElement('div');
                mealItem.className = 'meal-item';
                mealItem.innerHTML = `<p>${meal.name} - ${meal.calories} cal</p>`;
                mealLog.appendChild(mealItem);
            });
        }
    } catch (error) {
        console.error('Error loading nutrition:', error);
    }
}

// ==================================
// BUTTON HANDLERS
// ==================================

document.getElementById('startWorkoutBtn')?.addEventListener('click', () => {
    // TODO: Open workout selector modal
    alert('Workout selector coming soon!');
});

document.getElementById('logMealBtn')?.addEventListener('click', () => {
    // TODO: Open meal logging modal
    alert('Meal logging feature coming soon!');
});

document.getElementById('addWorkoutBtn')?.addEventListener('click', () => {
    // TODO: Open workout scheduler modal
    alert('Workout scheduler coming soon!');
});

document.getElementById('setGoalBtn')?.addEventListener('click', () => {
    // TODO: Open goal setting modal
    alert('Goal setting feature coming soon!');
});

document.getElementById('logFoodBtn')?.addEventListener('click', () => {
    // TODO: Open food logging modal
    alert('Food logging feature coming soon!');
});

// Make functions globally available for inline handlers
window.startWorkout = (id) => {
    alert(`Starting workout ${id}`);
};

window.editWorkout = (id) => {
    alert(`Editing workout ${id}`);
};

console.log('Dashboard loaded successfully!');
