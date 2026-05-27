import { useState, useEffect } from 'react';
import { usersAPI, messagesAPI } from '../api/services';
import { Search, Sparkles, MessageSquare, Users, Filter } from 'lucide-react';

const avatarColors = ['bg-luna-100/50 dark:bg-luna-400/200', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'];
const getAvatarColor = (name) => avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length];

const skillColors = {
  React: 'bg-blue-100 text-sky-600 dark:text-sky-300', Python: 'bg-green-100 text-green-700',
  'Node.js': 'bg-emerald-100 text-emerald-700', Hackathon: 'bg-orange-100 text-orange-700',
  Research: 'bg-purple-100 text-purple-700', Statistics: 'bg-pink-100 text-pink-700',
  Leadership: 'bg-yellow-100 text-yellow-700', Agile: 'bg-cyan-100 text-cyan-700',
  PM: 'bg-indigo-100 text-indigo-700', 'UI/UX': 'bg-rose-100 text-rose-700',
  Figma: 'bg-violet-100 text-violet-700', JavaScript: 'bg-amber-100 text-amber-700',
};
const getSkillColor = (skill) => skillColors[skill] || 'bg-luna-100/50 dark:bg-luna-400/20 text-luna-300/70 dark:text-luna-100/40';

export default function AISearchPage() {
  const [matches, setMatches] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [minScore, setMinScore] = useState(0);
  const [messagingId, setMessagingId] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [sent, setSent] = useState({});

  useEffect(() => {
    usersAPI.getMatches()
      .then(res => {
        setMatches(res.data.matches || []);
        setFiltered(res.data.matches || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = matches;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(m =>
        m.user.name?.toLowerCase().includes(q) ||
        m.user.skills?.some(s => s.toLowerCase().includes(q)) ||
        m.user.university?.toLowerCase().includes(q)
      );
    }
    if (minScore > 0) {
      result = result.filter(m => m.matchScore >= minScore);
    }
    setFiltered(result);
  }, [search, minScore, matches]);

  const sendMessage = async (userId) => {
    if (!messageText.trim()) return;
    try {
      await messagesAPI.send({ receiverId: userId, content: messageText });
      setSent({ ...sent, [userId]: true });
      setMessageText('');
      setMessagingId(null);
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-luna-400 dark:text-luna-100 flex items-center gap-2">
          <Sparkles size={22} className="text-blue-500" /> AI Team Search
        </h1>
        <p className="text-luna-300/50 dark:text-luna-100/30 text-sm mt-1">AI-powered matching based on your skills, MBTI, and GPA</p>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl card-glow-blue card-glow-blue p-4 mb-5 flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luna-300/50 dark:text-luna-100/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, skill, or university..."
            className="w-full pl-10 pr-4 py-2.5 border border-luna-200/30 dark:border-luna-100/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-luna-300/50 dark:text-luna-100/30" />
          <select
            value={minScore}
            onChange={e => setMinScore(Number(e.target.value))}
            className="border border-luna-200/30 dark:border-luna-100/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={0}>All scores</option>
            <option value={70}>70%+</option>
            <option value={80}>80%+</option>
            <option value={90}>90%+</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-luna-300/50 dark:text-luna-100/30">
          <Users size={40} className="mx-auto mb-3 opacity-40" />
          <p>No matches found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((match, i) => {
            const { user: matchUser, matchScore, complementarySkills } = match;
            const initials = matchUser.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
            const avatarColor = getAvatarColor(matchUser.name);
            const scoreColor = matchScore >= 90 ? 'text-green-600 bg-green-50 border-green-200' :
              matchScore >= 75 ? 'text-luna-200 bg-luna-100/50 dark:bg-luna-400/20 border-blue-200' :
              'text-orange-600 bg-orange-50 border-orange-200';

            return (
              <div key={i} className="glass rounded-2xl card-glow-blue card-glow-blue p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${avatarColor} rounded-xl flex items-center justify-center text-white font-semibold flex-shrink-0`}>
                    {initials}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-luna-400 dark:text-luna-100">{matchUser.name}</h3>
                      {matchUser.mbti && (
                        <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-medium">
                          {matchUser.mbti}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-luna-300/50 dark:text-luna-100/30 mb-2">
                      {matchUser.major} · {matchUser.university}
                      {matchUser.gpa > 0 && ` · GPA ${matchUser.gpa.toFixed(1)}`}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {matchUser.skills?.slice(0, 5).map((skill, j) => (
                        <span key={j} className={`text-xs px-2.5 py-1 rounded-full font-medium ${getSkillColor(skill)}`}>
                          {skill}
                        </span>
                      ))}
                    </div>
                    {complementarySkills?.length > 0 && (
                      <p className="text-xs text-luna-300/50 dark:text-luna-100/30 mt-2">
                        Complementary skills: {complementarySkills.slice(0, 3).join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`text-lg font-bold px-4 py-1.5 rounded-xl border ${scoreColor}`}>
                      {matchScore}%
                    </div>
                    {sent[matchUser._id] ? (
                      <span className="text-xs text-green-600 font-medium">✓ Message sent</span>
                    ) : messagingId === matchUser._id ? (
                      <div className="flex gap-2 mt-1">
                        <input
                          value={messageText}
                          onChange={e => setMessageText(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && sendMessage(matchUser._id)}
                          placeholder="Type a message..."
                          className="border border-luna-200/30 dark:border-luna-100/10 rounded-lg px-3 py-1.5 text-xs w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                        <button onClick={() => sendMessage(matchUser._id)} className="btn-primary text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700">
                          Send
                        </button>
                        <button onClick={() => setMessagingId(null)} className="text-luna-300/50 dark:text-luna-100/30 hover:text-luna-300/70 dark:text-luna-100/40 text-xs px-2">✕</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setMessagingId(matchUser._id)}
                        className="flex items-center gap-1.5 text-xs bg-luna-100/50 dark:bg-luna-400/20 hover:bg-luna-100/50 dark:bg-luna-400/20 hover:text-luna-200 text-luna-300/70 dark:text-luna-100/40 px-3 py-1.5 rounded-lg transition-colors font-medium"
                      >
                        <MessageSquare size={13} /> Connect
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
