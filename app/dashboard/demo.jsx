"use client"

import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    Cell, PieChart, Pie
} from 'recharts';
import {
    Clock, Code2, Trophy, Star,
    ArrowUp, Flame, Box, Languages
} from 'lucide-react';



// Generate sample contribution data for the year
const generateContributionData = () => {
    const days = 52 * 7; // 52 weeks
    const data = [];
    const now = new Date();

    for (let i = 0; i < days; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - (days - i));

        // Generate random hours between 0-8 with higher probability of lower numbers
        const hours = Math.floor(Math.random() * Math.random() * 8);

        data.push({
            date,
            hours
        });
    }

    return data;
};

const ContributionGraph = () => {
    const contributions = generateContributionData();
    const weeks = [];

    // Group by weeks
    for (let i = 0; i < contributions.length; i += 7) {
        weeks.push(contributions.slice(i, i + 7));
    }

    // Get activity level class based on hours
    const getActivityClass = (hours) => {
        if (hours === 0) return 'bg-gray-800';
        if (hours <= 2) return 'bg-purple-900';
        if (hours <= 4) return 'bg-purple-700';
        if (hours <= 6) return 'bg-purple-500';
        return 'bg-purple-300';
    };

    // Get month labels
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthLabels = [];
    let currentMonth = -1;

    weeks.forEach((week, i) => {
        const month = week[0].date.getMonth();
        if (month !== currentMonth) {
            monthLabels.push({
                month: months[month],
                position: i
            });
            currentMonth = month;
        }
    });

    return (
        <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-purple-500/20">
            <h2 className="text-xl font-bold mb-4">Coding Activity</h2>

            {/* Month labels */}
            <div className="flex mb-2 text-sm text-gray-400">
                <div className="w-8" /> {/* Spacing for day labels */}
                {monthLabels.map((label, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'relative',
                            left: `${label.position * 16}px`
                        }}
                        className="absolute"
                    >
                        {label.month}
                    </div>
                ))}
            </div>

            <div className="flex">
                {/* Day labels */}
                <div className="flex flex-col justify-around text-sm text-gray-400 mr-2">
                    <span>Mon</span>
                    <span>Wed</span>
                    <span>Fri</span>
                </div>

                {/* Contribution grid */}
                <div className="flex gap-1">
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                            {week.map((day, dayIndex) => (
                                <div
                                    key={dayIndex}
                                    className={`w-3 h-3 rounded-sm ${getActivityClass(day.hours)} hover:ring-2 hover:ring-purple-400 transition-all duration-150`}
                                    title={`${day.date.toDateString()}: ${day.hours} hours`}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end mt-4 text-sm text-gray-400 gap-2">
                <span>Less</span>
                <div className="w-3 h-3 rounded-sm bg-gray-800" />
                <div className="w-3 h-3 rounded-sm bg-purple-900" />
                <div className="w-3 h-3 rounded-sm bg-purple-700" />
                <div className="w-3 h-3 rounded-sm bg-purple-500" />
                <div className="w-3 h-3 rounded-sm bg-purple-300" />
                <span>More</span>
            </div>
        </div>
    );
};

// Sample data - in real app would come from API
const weeklyData = [
    { day: 'Mon', hours: 6.5 },
    { day: 'Tue', hours: 8.2 },
    { day: 'Wed', hours: 7.1 },
    { day: 'Thu', hours: 5.5 },
    { day: 'Fri', hours: 9.3 },
    { day: 'Sat', hours: 4.2 },
    { day: 'Sun', hours: 3.8 }
];

const languageData = [
    { name: 'TypeScript', value: 45, color: '#3178c6' },
    { name: 'Python', value: 25, color: '#3776AB' },
    { name: 'JavaScript', value: 15, color: '#f7df1e' },
    { name: 'Go', value: 8, color: '#00ADD8' },
    { name: 'Rust', value: 4, color: '#DEA584' },
    { name: 'Other', value: 3, color: '#6e6e6e' }
];

const projectData = [
    { name: 'API Gateway', hours: 45, commits: 123 },
    { name: 'Frontend App', hours: 38, commits: 98 },
    { name: 'Database Migration', hours: 32, commits: 76 },
    { name: 'Auth Service', hours: 28, commits: 65 },
    { name: 'Documentation', hours: 15, commits: 34 },
    { name: 'Testing Suite', hours: 12, commits: 28 }
];

const leaderboardData = [
    { rank: 1, name: 'Sarah Chen', hours: 245, streak: 65 },
    { rank: 2, name: 'Mike Ross', hours: 232, streak: 48 },
    { rank: 3, name: 'David Kim', hours: 228, streak: 52 },
    // ... more users
];

const StatCard = ({ icon: Icon, title, value, subtext }) => (
    <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-gray-400 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
                <p className="text-sm text-gray-500">{subtext}</p>
            </div>
            <Icon className="text-purple-400" size={24} />
        </div>
    </div>
);

const DashboardPage = () => {
    return (
        <div className="min-h-screen bg-black text-gray-100 relative overflow-hidden p-6">
            {/* Background Effects */}
            <div className="fixed inset-0 opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,purple,transparent_70%)]" />
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full filter blur-[128px] -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/30 rounded-full filter blur-[128px] -z-10" />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
                <StatCard
                    icon={Clock}
                    title="Today's Coding"
                    value="6.5 hrs"
                    subtext="+2.1 hrs vs. yesterday"
                />
                <StatCard
                    icon={Code2}
                    title="This Week"
                    value="32.4 hrs"
                    subtext="On track for 40hrs goal"
                />
                <StatCard
                    icon={Trophy}
                    title="Monthly Total"
                    value="142 hrs"
                    subtext="Top 5% this month"
                />
                <StatCard
                    icon={Star}
                    title="Productivity Score"
                    value="92"
                    subtext="+3 from last week"
                />
                <StatCard
                    icon={Languages}
                    title="Languages Used"
                    value="8"
                    subtext="TypeScript most used"
                />
                <StatCard
                    icon={Flame}
                    title="Current Streak"
                    value="12 days"
                    subtext="Personal best: 15 days"
                />
            </div>

            {/* Weekly Activity & Languages */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Weekly Activity Chart */}
                <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-purple-500/20">
                    <h2 className="text-xl font-bold mb-4">Coding Time - Last 7 Days</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData}>
                                <XAxis dataKey="day" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(0,0,0,0.8)',
                                        border: '1px solid rgba(147,51,234,0.5)'
                                    }}
                                />
                                <Bar dataKey="hours" fill="url(#purpleGradient)">
                                    {weeklyData.map((entry, index) => (
                                        <Cell
                                            key={index}
                                            fill={`url(#purpleGradient)`}
                                            className="hover:opacity-80 transition-opacity"
                                        />
                                    ))}
                                </Bar>
                                <defs>
                                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#9333EA" />
                                        <stop offset="100%" stopColor="#6366F1" />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Languages */}
                <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-purple-500/20">
                    <h2 className="text-xl font-bold mb-4">Top Languages</h2>
                    <div className="flex">
                        <div className="h-64 flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={languageData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {languageData.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            background: 'rgba(0,0,0,0.8)',
                                            border: '1px solid rgba(147,51,234,0.5)'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex-1">
                            {languageData.map((lang, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <div
                                        className="w-3 h-3 rounded-full mr-2"
                                        style={{ backgroundColor: lang.color }}
                                    />
                                    <span className="text-sm">{lang.name} - {lang.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Projects & Leaderboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Projects */}
                <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-purple-500/20">
                    <h2 className="text-xl font-bold mb-4">Most Active Projects</h2>
                    <div className="space-y-4">
                        {projectData.map((project, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                                <div>
                                    <h3 className="font-medium">{project.name}</h3>
                                    <p className="text-sm text-gray-400">{project.commits} commits</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">{project.hours} hrs</p>
                                    <p className="text-sm text-gray-400">this month</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Leaderboard */}
                <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-purple-500/20">
                    <h2 className="text-xl font-bold mb-4">Global Leaderboard</h2>
                    <div className="space-y-3">
                        {leaderboardData.map((user, index) => (
                            <div
                                key={index}
                                className={`flex items-center justify-between p-3 rounded-lg
                  ${index === 0 ? 'bg-purple-500/20' : 'bg-black/30'}`}
                            >
                                <div className="flex items-center">
                                    <span className="w-8 text-lg font-bold">{user.rank}</span>
                                    <div>
                                        <h3 className="font-medium">{user.name}</h3>
                                        <p className="text-sm text-gray-400">{user.streak} day streak</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">{user.hours} hrs</p>
                                    <p className="text-sm text-gray-400">this month</p>
                                </div>
                            </div>
                        ))}
                        {/* Current User's Rank */}
                        <div className="mt-4 p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <span className="w-8 text-lg font-bold">24</span>
                                    <div>
                                        <h3 className="font-medium">You</h3>
                                        <p className="text-sm text-gray-400">12 day streak</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">156 hrs</p>
                                    <p className="text-sm text-gray-400">this month</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mb-6">
                <ContributionGraph />
            </div>
        </div>
    );
};

export default DashboardPage;