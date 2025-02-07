"use client"

import React, { useState, useEffect, Suspense } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    Cell, PieChart, Pie
} from 'recharts';
import {
    Clock, Code2, Trophy, Star,
    ArrowUp, Flame, Box, Languages
} from 'lucide-react';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useSearchParams, useRouter } from "next/navigation";




const fetchUserDataByEmail = async (email) => {
    try {
        // Reference to the document in the 'users' collection with the given email
        const userDocRef = doc(db, 'users', email);

        // Fetch the document snapshot
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            console.log('User Data fetched');
            return userDocSnap.data();
        } else {
            // Document does not exist
            console.log('No user found with this email.');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
};



const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const { name, value } = payload[0].payload;
        return (
            <div
                style={{
                    background: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(147,51,234,0.5)",
                    borderRadius: "5px",
                    padding: "10px",
                    color: "white",
                }}
            >
                <p style={{ margin: 0 }}>{`Name: ${name}`}</p>
                <p style={{ margin: 0 }}>{`Value: ${value}`}</p>
            </div>
        );
    }
    return null;
};

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

const msToHrs = (millis) => {
    return (millis / (1000 * 60 * 60)).toFixed(2);
};

const DashboardPage = () => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const uid = searchParams.get("uid"); // Extract 'uid' correctly

    useEffect(() => {
        if (!uid) {
            console.warn("No UID found, redirecting to /register...");
            router.push("/register"); // Redirect if UID is missing
        } else {
            console.log("Page ID:", uid);
        }
    }, [uid, router]);

    const curDate = new Date().toLocaleDateString("en-US");
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [weekHours, setWeekHours] = useState([]);
    const [monthlyContributions, setMonthlyContributions] = useState([]);
    const [dates, setDates] = useState([]);
    const [hours, setHours] = useState([]);
    const [streak, setStreak] = useState(0);
    const [uname, setUname] = useState("");
    const [langs, setLangs] = useState([]);
    const [projs, setProjs] = useState([]);
    const langColors = ['#3178c6', '#3776AB', '#f7df1e', '#00ADD8', '#DEA584', '#6e6e6e'];

    // const weeklyData

    const handleFetchUserData = async (email) => {
        try {
            const userData = await fetchUserDataByEmail(email);
            if (userData) {
                setUser(userData)
            } else {
                console.log('User not found.');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        if (!user) {
            handleFetchUserData(uid);
        }
        else {
            console.log(user)
            const logsData = [];
            const langsData = [];
            let projsData = [];
            logsData.push(user.logs);
            setUname(user.username);
            setStreak(user.streak);
            langsData.push(user.langs);
            projsData = (user.projects)

            console.log(projsData)
            const projectsMap = projsData.map(projStr => {
                const [projName, timeInMillis] = projStr.split('-');
                return { name: projName, time: msToHrs(parseInt(timeInMillis)) };
            });

            setProjs(projectsMap);
            console.log(projectsMap)

            const datesTemp = [];
            const hoursTemp = [];



            logsData[0].forEach(log => {
                const [date, time] = log.split('-');
                datesTemp.push(date);
                hoursTemp.push(parseFloat(msToHrs(parseInt(time))));
            });

            setDates(datesTemp);
            setHours(hoursTemp);

            //Weekly Hours
            const weeklyHours = new Array(7).fill({ day: "", hours: "" });

            for (let i = 0; i < 7; i++) {
                // Get date for current index
                const currentDate = new Date(curDate);
                currentDate.setDate(currentDate.getDate() - i);

                // Convert to string format matching dates array
                const dateStr = currentDate.toLocaleDateString("en-US");

                // Find index of this date in dates array
                const dateIndex = datesTemp.indexOf(dateStr);

                // If date exists in dates array, get corresponding hours value
                if (dateIndex !== -1) {
                    weeklyHours[i] = { day: "", hours: hoursTemp[dateIndex] };
                } else {
                    weeklyHours[i] = { day: "", hours: 0 };
                }
            }

            setWeekHours(weeklyHours.reverse());

            // Calculate total hours across all languages
            const totalHours = langsData[0].reduce((total, langStr) => {
                const hours = parseFloat(langStr.split('-')[1]);
                return total + hours;
            }, 0);

            // Calculate percentage for each language
            const langsPer = langsData[0].map(langStr => {
                const [lang, hoursStr] = langStr.split('-');
                const hours = parseFloat(hoursStr);
                const percentage = ((hours / totalHours) * 100).toFixed(1);
                return { "name": lang, "value": parseFloat(percentage) }
                // return `${lang} ${percentage}`;
            });

            langsPer.sort((a, b) => b.value - a.value);


            setLangs(langsPer);
            console.log(langsPer)


            // Initialize array for last 30 days' contribution data
            const monthlyContributionsTemp = new Array(30).fill(0);

            for (let i = 0; i < 30; i++) {
                // Get date for current index
                const currentDate = new Date(curDate);
                currentDate.setDate(currentDate.getDate() - i);

                // Convert to string format matching dates array
                const dateStr = currentDate.toLocaleDateString("en-US");

                // Find index of this date in dates array
                const dateIndex = datesTemp.indexOf(dateStr);

                // If date exists in dates array, get corresponding hours value
                if (dateIndex !== -1) {
                    monthlyContributionsTemp[i] = hoursTemp[dateIndex];
                }
            }

            // Reverse array so most recent dates are at the end
            setMonthlyContributions(monthlyContributionsTemp.reverse());
            console.log(monthlyContributionsTemp)

        }
    }, [user]);


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
                    value={dates[dates.length - 1] === curDate ? hours[hours.length - 1].toFixed(2) + 'h' : '0h'}
                // subtext="+2.1 hrs vs. yesterday"
                />
                <StatCard
                    icon={Code2}
                    title="This Week"
                    value={weekHours.reduce((sum, entry) => sum + entry.hours, 0).toFixed(2) + 'h'}
                // subtext="On track for 40hrs goal"
                />
                <StatCard
                    icon={Trophy}
                    title="This Month"
                    value={monthlyContributions.reduce((acc, curr) => acc + curr, 0).toFixed(2) + 'h'}
                // subtext="Top 5% this month"
                />
                <StatCard
                    icon={Star}
                    title="Productivity Score"
                    value={user ? user.productivity + "%" : "0%"}
                // subtext="+3 from last week"
                />
                <StatCard
                    icon={Languages}
                    title="Languages Used"
                    value={langs.length}
                // subtext="TypeScript most used"
                />
                <StatCard
                    icon={Flame}
                    title="Current Streak"
                    value={`${streak} day${streak == 1 ? "" : "s"}`}
                // subtext="Personal best: 15 days"
                />
            </div>

            {/* Weekly Activity & Languages */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Weekly Activity Chart */}
                <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-purple-500/20">
                    <h2 className="text-xl font-bold mb-4"> Coding Time - Last 7 Days</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weekHours}>
                                <XAxis dataKey="day" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(0,0,0,0.8)',
                                        border: '1px solid rgba(147,51,234,0.5)'
                                    }}
                                />
                                <Bar dataKey="hours" fill="url(#purpleGradient)">
                                    {weekHours.map((entry, index) => (
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
                                        data={langs}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {langs.map((entry, index) => (
                                            <Cell key={index} fill={langColors[index]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        content={<CustomTooltip />}
                                    // contentStyle={{
                                    //     background: 'rgba(0,0,0,0.8)',
                                    //     border: '1px solid rgba(147,51,234,0.5)',
                                    //     color: 'white'
                                    // }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex-1">
                            {langs.map((lang, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <div
                                        className="w-3 h-3 rounded-full mr-2"
                                        style={{ backgroundColor: langColors[index] }}
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
                        {projs.map((project, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                                <div>
                                    <h3 className="font-medium">{project.name}</h3>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">{project.time} hrs</p>
                                    <p className="text-sm text-gray-400">this month</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Leaderboard */}
                {/* <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-purple-500/20">
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
                </div> */}
            </div>
            <div className="my-6">
                <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-purple-500/20">
                    <h2 className="text-lg font-bold text-gray-100 pb-3 mb-5 border-b-2 border-gray-600">
                        Streaks - {streak} days
                    </h2>
                    <div className="grid grid-cols-10 gap-1">
                        {[...Array(30)].map((_, weekIndex) =>
                            [...Array(1)].map((_, dayIndex) => {
                                const contributions = monthlyContributions[weekIndex];
                                const color = contributions !== 0 ? 'bg-purple-500' : 'bg-purple-900/20';
                                return (
                                    <div
                                        key={`${weekIndex}-${dayIndex}`}
                                        className={`aspect-square flex items-center justify-center rounded-sm text-white text-2xl font-bold ${color}`}
                                        title={`${contributions} hours`}
                                    >
                                        {contributions === 0 ? '-' : contributions}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default function PageWrapper() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <DashboardPage />
        </Suspense>
    );
}