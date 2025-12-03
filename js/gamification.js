/**
 * Gamification System - Complete Implementation
 * Handles points, levels, achievements, leaderboards, and streaks
 */

import { db } from '../firebase-config.js';
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    increment,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// ================================
// POINTS SYSTEM CONFIGURATION
// ================================

const POINTS_CONFIG = {
    // Workout points
    COMPLETE_WORKOUT: 50,
    COMPLETE_WORKOUT_EARLY: 75, // Bonus for completing ahead of schedule
    WORKOUT_STREAK_BONUS: 25, // Per consecutive day
    
    // Nutrition points
    LOG_MEAL: 10,
    MEET_MACRO_GOAL: 30,
    FULL_DAY_NUTRITION: 50,
    
    // Social points
    SHARE_PROGRESS: 20,
    INVITE_FRIEND: 100,
    FRIEND_JOINS: 150,
    
    // Content engagement
    READ_ARTICLE: 5,
    WATCH_VLOG: 10,
    COMMENT: 15,
    
    // Goal achievement
    COMPLETE_GOAL: 200,
    BEAT_PERSONAL_RECORD: 100,
    
    // Consistency bonuses
    WEEKLY_GOAL_MET: 100,
    MONTHLY_ACTIVE: 500
};

// ================================
// LEVEL SYSTEM
// ================================

const LEVEL_CONFIG = {
    // Points required for each level
    levels: [
        { level: 1, pointsRequired: 0, title: 'Beginner' },
        { level: 2, pointsRequired: 100, title: 'Novice' },
        { level: 3, pointsRequired: 250, title: 'Intermediate' },
        { level: 4, pointsRequired: 500, title: 'Advanced' },
        { level: 5, pointsRequired: 1000, title: 'Expert' },
        { level: 6, pointsRequired: 2000, title: 'Master' },
        { level: 7, pointsRequired: 3500, title: 'Elite' },
        { level: 8, pointsRequired: 5500, title: 'Champion' },
        { level: 9, pointsRequired: 8000, title: 'Legend' },
        { level: 10, pointsRequired: 12000, title: 'God Mode' }
    ]
};

// ================================
// ACHIEVEMENT DEFINITIONS
// ================================

const ACHIEVEMENTS = {
    // First time achievements
    first_workout: {
        id: 'first_workout',
        name: 'First Steps',
        description: 'Complete your first workout',
        icon: '🏃',
        points: 50,
        requirement: { type: 'workouts_completed', value: 1 }
    },
    first_goal: {
        id: 'first_goal',
        name: 'Goal Setter',
        description: 'Set your first fitness goal',
        icon: '🎯',
        points: 25,
        requirement: { type: 'goals_set', value: 1 }
    },
    first_meal_logged: {
        id: 'first_meal_logged',
        name: 'Nutrition Tracker',
        description: 'Log your first meal',
        icon: '🥗',
        points: 25,
        requirement: { type: 'meals_logged', value: 1 }
    },
    
    // Workout milestones
    '10_workouts': {
        id: '10_workouts',
        name: 'Getting Started',
        description: 'Complete 10 workouts',
        icon: '💪',
        points: 100,
        requirement: { type: 'workouts_completed', value: 10 }
    },
    '50_workouts': {
        id: '50_workouts',
        name: 'Consistent Crusher',
        description: 'Complete 50 workouts',
        icon: '🔥',
        points: 250,
        requirement: { type: 'workouts_completed', value: 50 }
    },
    '100_workouts': {
        id: '100_workouts',
        name: 'Century Club',
        description: 'Complete 100 workouts',
        icon: '💯',
        points: 500,
        requirement: { type: 'workouts_completed', value: 100 }
    },
    '500_workouts': {
        id: '500_workouts',
        name: 'Fitness Machine',
        description: 'Complete 500 workouts',
        icon: '🚀',
        points: 1000,
        requirement: { type: 'workouts_completed', value: 500 }
    },
    
    // Streak achievements
    '7_day_streak': {
        id: '7_day_streak',
        name: 'Week Warrior',
        description: 'Maintain a 7-day workout streak',
        icon: '⚡',
        points: 150,
        requirement: { type: 'streak', value: 7 }
    },
    '30_day_streak': {
        id: '30_day_streak',
        name: 'Month Master',
        description: 'Maintain a 30-day workout streak',
        icon: '✨',
        points: 500,
        requirement: { type: 'streak', value: 30 }
    },
    '100_day_streak': {
        id: '100_day_streak',
        name: 'Unstoppable',
        description: 'Maintain a 100-day workout streak',
        icon: '🌟',
        points: 1500,
        requirement: { type: 'streak', value: 100 }
    },
    
    // Calorie achievements
    '1000_calories': {
        id: '1000_calories',
        name: 'Calorie Burner',
        description: 'Burn 1,000 calories',
        icon: '🔥',
        points: 100,
        requirement: { type: 'calories_burned', value: 1000 }
    },
    '5000_calories': {
        id: '5000_calories',
        name: 'Furnace',
        description: 'Burn 5,000 calories',
        icon: '🌋',
        points: 300,
        requirement: { type: 'calories_burned', value: 5000 }
    },
    '10000_calories': {
        id: '10000_calories',
        name: 'Inferno',
        description: 'Burn 10,000 calories',
        icon: '🔥',
        points: 600,
        requirement: { type: 'calories_burned', value: 10000 }
    },
    
    // Social achievements
    share_first_progress: {
        id: 'share_first_progress',
        name: 'Proud Sharer',
        description: 'Share your progress for the first time',
        icon: '📱',
        points: 50,
        requirement: { type: 'progress_shared', value: 1 }
    },
    invite_friend: {
        id: 'invite_friend',
        name: 'Team Builder',
        description: 'Invite a friend to join',
        icon: '👥',
        points: 100,
        requirement: { type: 'friends_invited', value: 1 }
    },
    
    // Level achievements
    reach_level_5: {
        id: 'reach_level_5',
        name: 'Expert Status',
        description: 'Reach Level 5',
        icon: '⭐',
        points: 0, // No extra points, level-up is reward
        requirement: { type: 'level', value: 5 }
    },
    reach_level_10: {
        id: 'reach_level_10',
        name: 'God Mode Activated',
        description: 'Reach the maximum level',
        icon: '👑',
        points: 0,
        requirement: { type: 'level', value: 10 }
    },
    
    // Special achievements
    early_bird: {
        id: 'early_bird',
        name: 'Early Bird',
        description: 'Complete 10 workouts before 8 AM',
        icon: '🌅',
        points: 200,
        requirement: { type: 'early_workouts', value: 10 }
    },
    night_owl: {
        id: 'night_owl',
        name: 'Night Owl',
        description: 'Complete 10 workouts after 8 PM',
        icon: '🦉',
        points: 200,
        requirement: { type: 'late_workouts', value: 10 }
    },
    weekend_warrior: {
        id: 'weekend_warrior',
        name: 'Weekend Warrior',
        description: 'Complete workouts on 20 weekends',
        icon: '🏖️',
        points: 250,
        requirement: { type: 'weekend_workouts', value: 20 }
    }
};

// ================================
// GAMIFICATION CLASS
// ================================

export class GamificationSystem {
    constructor(userId) {
        this.userId = userId;
        this.userStatsRef = doc(db, 'userStats', userId);
        this.userStats = null;
    }

    // Initialize and load user stats
    async init() {
        try {
            const statsDoc = await getDoc(this.userStatsRef);
            
            if (statsDoc.exists()) {
                this.userStats = statsDoc.data();
            } else {
                // Initialize new user stats
                this.userStats = {
                    points: 0,
                    level: 1,
                    workoutsCompleted: 0,
                    caloriesBurned: 0,
                    streak: 0,
                    longestStreak: 0,
                    achievements: [],
                    goalsCompleted: 0,
                    mealsLogged: 0,
                    lastWorkoutDate: null,
                    earlyWorkouts: 0,
                    lateWorkouts: 0,
                    weekendWorkouts: 0,
                    progressShared: 0,
                    friendsInvited: 0
                };
                
                await setDoc(this.userStatsRef, {
                    ...this.userStats,
                    createdAt: serverTimestamp()
                });
            }
            
            return this.userStats;
        } catch (error) {
            console.error('Error initializing gamification:', error);
            throw error;
        }
    }

    // Award points to user
    async awardPoints(points, reason = 'Activity completed') {
        try {
            await updateDoc(this.userStatsRef, {
                points: increment(points)
            });
            
            this.userStats.points += points;
            
            // Check for level up
            await this.checkLevelUp();
            
            // Show notification
            this.showPointsNotification(points, reason);
            
            return this.userStats.points;
        } catch (error) {
            console.error('Error awarding points:', error);
        }
    }

    // Calculate and return current level
    calculateLevel(points) {
        let currentLevel = 1;
        
        for (const level of LEVEL_CONFIG.levels) {
            if (points >= level.pointsRequired) {
                currentLevel = level.level;
            } else {
                break;
            }
        }
        
        return currentLevel;
    }

    // Check if user leveled up
    async checkLevelUp() {
        const newLevel = this.calculateLevel(this.userStats.points);
        
        if (newLevel > this.userStats.level) {
            await updateDoc(this.userStatsRef, {
                level: newLevel
            });
            
            this.userStats.level = newLevel;
            
            // Show level up notification
            this.showLevelUpNotification(newLevel);
            
            // Check for level achievements
            await this.checkAchievements();
            
            return true;
        }
        
        return false;
    }

    // Log completed workout
    async logWorkout(workoutData) {
        const { caloriesBurned = 0, duration = 0, completedAt = new Date() } = workoutData;
        
        try {
            // Update stats
            await updateDoc(this.userStatsRef, {
                workoutsCompleted: increment(1),
                caloriesBurned: increment(caloriesBurned),
                lastWorkoutDate: completedAt
            });
            
            this.userStats.workoutsCompleted++;
            this.userStats.caloriesBurned += caloriesBurned;
            
            // Award points
            let points = POINTS_CONFIG.COMPLETE_WORKOUT;
            
            // Bonus for streak
            if (this.userStats.streak > 0) {
                points += this.userStats.streak * POINTS_CONFIG.WORKOUT_STREAK_BONUS;
            }
            
            // Time-based bonuses
            const hour = completedAt.getHours();
            if (hour < 8) {
                points += 25; // Early bird bonus
                await updateDoc(this.userStatsRef, {
                    earlyWorkouts: increment(1)
                });
                this.userStats.earlyWorkouts++;
            } else if (hour >= 20) {
                points += 25; // Night owl bonus
                await updateDoc(this.userStatsRef, {
                    lateWorkouts: increment(1)
                });
                this.userStats.lateWorkouts++;
            }
            
            // Weekend bonus
            const dayOfWeek = completedAt.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                points += 20;
                await updateDoc(this.userStatsRef, {
                    weekendWorkouts: increment(1)
                });
                this.userStats.weekendWorkouts++;
            }
            
            await this.awardPoints(points, 'Workout completed');
            
            // Update streak
            await this.updateStreak(completedAt);
            
            // Check achievements
            await this.checkAchievements();
            
            return points;
        } catch (error) {
            console.error('Error logging workout:', error);
        }
    }

    // Update workout streak
    async updateStreak(completedAt) {
        const lastDate = this.userStats.lastWorkoutDate;
        
        if (!lastDate) {
            // First workout
            this.userStats.streak = 1;
        } else {
            const lastWorkout = lastDate.toDate ? lastDate.toDate() : new Date(lastDate);
            const daysSince = Math.floor((completedAt - lastWorkout) / (1000 * 60 * 60 * 24));
            
            if (daysSince === 1) {
                // Consecutive day
                this.userStats.streak++;
            } else if (daysSince === 0) {
                // Same day, keep streak
                return;
            } else {
                // Streak broken
                this.userStats.streak = 1;
            }
        }
        
        // Update longest streak
        if (this.userStats.streak > (this.userStats.longestStreak || 0)) {
            this.userStats.longestStreak = this.userStats.streak;
            await updateDoc(this.userStatsRef, {
                longestStreak: this.userStats.streak
            });
        }
        
        await updateDoc(this.userStatsRef, {
            streak: this.userStats.streak
        });
    }

    // Check and unlock achievements
    async checkAchievements() {
        const unlockedAchievements = [];
        
        for (const [key, achievement] of Object.entries(ACHIEVEMENTS)) {
            // Skip if already unlocked
            if (this.userStats.achievements.includes(achievement.id)) {
                continue;
            }
            
            // Check if requirements met
            if (this.isAchievementUnlocked(achievement)) {
                // Unlock achievement
                this.userStats.achievements.push(achievement.id);
                unlockedAchievements.push(achievement);
                
                // Award achievement points
                if (achievement.points > 0) {
                    await this.awardPoints(achievement.points, `Achievement: ${achievement.name}`);
                }
            }
        }
        
        // Update achievements in database
        if (unlockedAchievements.length > 0) {
            await updateDoc(this.userStatsRef, {
                achievements: this.userStats.achievements
            });
            
            // Show achievement notifications
            this.showAchievementNotifications(unlockedAchievements);
        }
        
        return unlockedAchievements;
    }

    // Check if achievement requirements are met
    isAchievementUnlocked(achievement) {
        const { type, value } = achievement.requirement;
        
        switch (type) {
            case 'workouts_completed':
                return this.userStats.workoutsCompleted >= value;
            
            case 'calories_burned':
                return this.userStats.caloriesBurned >= value;
            
            case 'streak':
                return this.userStats.streak >= value;
            
            case 'level':
                return this.userStats.level >= value;
            
            case 'goals_set':
            case 'goals_completed':
                return this.userStats.goalsCompleted >= value;
            
            case 'meals_logged':
                return this.userStats.mealsLogged >= value;
            
            case 'early_workouts':
                return this.userStats.earlyWorkouts >= value;
            
            case 'late_workouts':
                return this.userStats.lateWorkouts >= value;
            
            case 'weekend_workouts':
                return this.userStats.weekendWorkouts >= value;
            
            case 'progress_shared':
                return this.userStats.progressShared >= value;
            
            case 'friends_invited':
                return this.userStats.friendsInvited >= value;
            
            default:
                return false;
        }
    }

    // Get leaderboard
    async getLeaderboard(period = 'allTime', limitCount = 10) {
        try {
            const leaderboardRef = collection(db, 'userStats');
            let q;
            
            if (period === 'allTime') {
                q = query(
                    leaderboardRef,
                    orderBy('points', 'desc'),
                    limit(limitCount)
                );
            } else if (period === 'weekly') {
                // Query weekly leaderboard (requires separate collection)
                const weekStart = new Date();
                weekStart.setDate(weekStart.getDate() - 7);
                
                q = query(
                    collection(db, 'weeklyStats'),
                    where('weekStart', '>=', weekStart),
                    orderBy('points', 'desc'),
                    limit(limitCount)
                );
            }
            
            const snapshot = await getDocs(q);
            const leaderboard = [];
            
            snapshot.forEach((doc) => {
                leaderboard.push({
                    userId: doc.id,
                    ...doc.data()
                });
            });
            
            return leaderboard;
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            return [];
        }
    }

    // Show points notification
    showPointsNotification(points, reason) {
        this.showNotification({
            type: 'points',
            icon: '⭐',
            title: `+${points} Points!`,
            message: reason,
            duration: 3000
        });
    }

    // Show level up notification
    showLevelUpNotification(level) {
        const levelInfo = LEVEL_CONFIG.levels.find(l => l.level === level);
        
        this.showNotification({
            type: 'levelup',
            icon: '🎉',
            title: `Level ${level} Unlocked!`,
            message: `You are now ${levelInfo.title}!`,
            duration: 5000
        });
    }

    // Show achievement notifications
    showAchievementNotifications(achievements) {
        achievements.forEach((achievement, index) => {
            setTimeout(() => {
                this.showNotification({
                    type: 'achievement',
                    icon: achievement.icon,
                    title: 'Achievement Unlocked!',
                    message: achievement.name,
                    description: achievement.description,
                    duration: 5000
                });
            }, index * 1000); // Stagger notifications
        });
    }

    // Generic notification display
    showNotification({ type, icon, title, message, description, duration = 3000 }) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `gamification-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-icon">${icon}</div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
                ${description ? `<div class="notification-description">${description}</div>` : ''}
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        // Add to page
        let container = document.getElementById('notificationContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationContainer';
            document.body.appendChild(container);
        }
        
        container.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Close handler
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto-remove after duration
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
}

// Export for use in other modules
export default GamificationSystem;
export { POINTS_CONFIG, LEVEL_CONFIG, ACHIEVEMENTS };
