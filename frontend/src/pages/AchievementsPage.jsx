import { useState, useEffect } from 'react';
import { achievementsAPI } from '../api/services';
import { Star, CheckCheck } from 'lucide-react';

const typeColors = {
  competition: 'bg-yellow-50 border-yellow-200',
  skill: 'bg-luna-100/50 dark:bg-luna-400/20 border-blue-200',
  profile: 'bg-purple-50 border-purple-200',
  team: 'bg-green-50 border-green-200',
  academic: 'bg-orange-50 border-orange-200',
};

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    achievementsAPI.getAll()
      .then(res => setAchievements(res.data.achievements || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const markAllRead = async () => {
    await achievementsAPI.markAllRead();
    setAchievements(achievements.map(a => ({ ...a, isNew: false })));
  };

  const newCount = achievements.filter(a => a.isNew).length;

  return (
    <div className="max-w-3xl mx-auto fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-luna-400 dark:text-luna-100 flex items-center gap-2">
            <Star size={22} className="text-yellow-500" /> Achievements
          </h1>
          <p className="text-luna-300/50 dark:text-luna-100/30 text-sm mt-1">
            {achievements.length} total · {newCount} new
          </p>
        </div>
        {newCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 text-sm text-luna-200 hover:underline">
            <CheckCheck size={16} /> Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : achievements.length === 0 ? (
        <div className="text-center py-16 text-luna-300/50 dark:text-luna-100/30">
          <Star size={40} className="mx-auto mb-3 opacity-40" />
          <p>No achievements yet. Complete your profile to earn your first badge!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {achievements.map(achievement => (
            <div
              key={achievement._id}
              className={`relative bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition-shadow ${typeColors[achievement.type] || 'bg-white border-gray-100'}`}
            >
              {achievement.isNew && (
                <span className="absolute top-3 right-3 bg-luna-100/50 dark:bg-luna-400/200 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  New
                </span>
              )}
              <div className="text-3xl mb-3">{achievement.icon}</div>
              <h3 className="font-semibold text-luna-400 dark:text-luna-100 mb-1">{achievement.title}</h3>
              <p className="text-xs text-luna-300/50 dark:text-luna-100/30 mb-2">{achievement.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-luna-300/50 dark:text-luna-100/30 capitalize bg-white/70 px-2 py-0.5 rounded-full">
                  {achievement.type}
                </span>
                <span className="text-xs text-luna-300/50 dark:text-luna-100/30">
                  {new Date(achievement.earnedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
