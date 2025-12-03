/**
 * Charts.js - Dashboard Data Visualization
 * Handles all Chart.js charts for the dashboard
 */

import { db } from '../firebase-config.js';
import { auth } from '../firebase-config.js';
import { collection, query, where, getDocs, orderBy, limit } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

let progressChart = null;
let nutritionChart = null;

// ================================
// PROGRESS CHART
// ================================

export async function initProgressChart() {
    const ctx = document.getElementById('progressChart');
    if (!ctx) return;

    // Load workout history data
    const workoutData = await loadWorkoutHistory(30);

    // Destroy existing chart if any
    if (progressChart) {
        progressChart.destroy();
    }

    progressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: workoutData.labels,
            datasets: [
                {
                    label: 'Calories Burned',
                    data: workoutData.calories,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                },
                {
                    label: 'Workout Duration (min)',
                    data: workoutData.duration,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#a0aec0',
                        font: {
                            family: 'Inter',
                            size: 12
                        },
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        family: 'Inter',
                        size: 13
                    },
                    bodyFont: {
                        family: 'Inter',
                        size: 12
                    },
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: true
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#718096',
                        font: {
                            family: 'Inter',
                            size: 11
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        borderDash: [5, 5]
                    },
                    ticks: {
                        color: '#718096',
                        font: {
                            family: 'Inter',
                            size: 11
                        }
                    },
                    beginAtZero: true
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// ================================
// NUTRITION CHART (Doughnut)
// ================================

export function initNutritionChart(protein = 0, carbs = 0, fats = 0) {
    const ctx = document.getElementById('nutritionChart');
    if (!ctx) return;

    // Destroy existing chart if any
    if (nutritionChart) {
        nutritionChart.destroy();
    }

    // Calculate total and percentages
    const total = protein + carbs + fats;
    const hasData = total > 0;

    nutritionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Protein', 'Carbs', 'Fats'],
            datasets: [{
                data: hasData ? [protein, carbs, fats] : [1, 1, 1],
                backgroundColor: [
                    '#667eea',
                    '#10b981',
                    '#f093fb'
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: hasData,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        family: 'Inter',
                        size: 13
                    },
                    bodyFont: {
                        family: 'Inter',
                        size: 12
                    },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return `${label}: ${value}g (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });

    // Add center text
    if (hasData) {
        addCenterText(ctx, total, 'Total Calories');
    }
}

// Add center text to doughnut chart
function addCenterText(ctx, value, label) {
    const originalDraw = Chart.controllers.doughnut.prototype.draw;
    Chart.controllers.doughnut.prototype.draw = function() {
        originalDraw.apply(this, arguments);
        
        const chart = this.chart;
        const ctx = chart.ctx;
        const width = chart.width;
        const height = chart.height;

        ctx.restore();
        const fontSize = (height / 114).toFixed(2);
        ctx.font = `bold ${fontSize}em 'Poppins'`;
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#f7fafc';

        const text = value.toString();
        const textX = Math.round((width - ctx.measureText(text).width) / 2);
        const textY = height / 2 - 10;

        ctx.fillText(text, textX, textY);

        // Draw label
        ctx.font = `${fontSize * 0.5}em 'Inter'`;
        ctx.fillStyle = '#a0aec0';
        const labelText = label;
        const labelX = Math.round((width - ctx.measureText(labelText).width) / 2);
        const labelY = height / 2 + 15;
        ctx.fillText(labelText, labelX, labelY);

        ctx.save();
    };
}

// ================================
// LOAD WORKOUT HISTORY
// ================================

async function loadWorkoutHistory(days = 30) {
    try {
        const user = auth.currentUser;
        if (!user) return { labels: [], calories: [], duration: [] };

        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Query workout history
        const workoutsRef = collection(db, 'userProgress');
        const q = query(
            workoutsRef,
            where('userId', '==', user.uid),
            where('completedAt', '>=', startDate),
            where('completedAt', '<=', endDate),
            orderBy('completedAt', 'asc')
        );

        const querySnapshot = await getDocs(q);

        // Prepare data arrays
        const labels = [];
        const calories = [];
        const duration = [];

        // Create a map for daily aggregation
        const dailyData = {};

        querySnapshot.forEach((doc) => {
            const workout = doc.data();
            const date = workout.completedAt.toDate();
            const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            if (!dailyData[dateKey]) {
                dailyData[dateKey] = {
                    calories: 0,
                    duration: 0
                };
            }

            dailyData[dateKey].calories += workout.caloriesBurned || 0;
            dailyData[dateKey].duration += workout.duration || 0;
        });

        // Convert to arrays
        Object.keys(dailyData).forEach((dateKey) => {
            labels.push(dateKey);
            calories.push(dailyData[dateKey].calories);
            duration.push(dailyData[dateKey].duration);
        });

        // If no data, create sample data
        if (labels.length === 0) {
            // Generate last 7 days
            for (let i = 6; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                labels.push(dateLabel);
                calories.push(0);
                duration.push(0);
            }
        }

        return { labels, calories, duration };
    } catch (error) {
        console.error('Error loading workout history:', error);
        return { labels: [], calories: [], duration: [] };
    }
}

// ================================
// CHART UPDATE FUNCTIONS
// ================================

export function updateProgressChart(days = 30) {
    initProgressChart(days);
}

export function updateNutritionChart(protein, carbs, fats) {
    initNutritionChart(protein, carbs, fats);
}

// ================================
// CHART PERIOD CHANGE HANDLER
// ================================

document.getElementById('chartPeriod')?.addEventListener('change', (e) => {
    const days = parseInt(e.target.value);
    updateProgressChart(days);
});

// ================================
// INITIALIZE CHARTS ON LOAD
// ================================

// Wait for auth to be ready
setTimeout(() => {
    if (auth.currentUser) {
        initProgressChart();
        initNutritionChart(0, 0, 0);
    }
}, 1000);

console.log('Charts module loaded!');
