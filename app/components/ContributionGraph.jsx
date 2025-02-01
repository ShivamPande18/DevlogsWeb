"use client"

export default function ContributionGraph({ contributions }) {

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