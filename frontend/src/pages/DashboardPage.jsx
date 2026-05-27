import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI, achievementsAPI } from '../api/services';
import { Link } from 'react-router-dom';
import { TrendingUp, Award, Users, GraduationCap, Sparkles, ChevronRight, Bot } from 'lucide-react';
import { AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

const profitData = [
  {m:'Jan',v:30},{m:'Feb',v:45},{m:'Mar',v:35},{m:'Apr',v:60},{m:'May',v:50},{m:'Jun',v:75},
];
const radarData = [
  {s:'Skills',A:80},{s:'GPA',A:85},{s:'Teams',A:60},{s:'Activity',A:70},{s:'Matches',A:90},{s:'Profile',A:87},
];

const avatarGrads = [
  'from-luna-100 to-luna-200','from-luna-200 to-luna-300',
  'from-luna-300 to-luna-400','from-teal-400 to-luna-200','from-blue-400 to-luna-300',
];
const getAvatarGrad = name => avatarGrads[name?.charCodeAt(0) % avatarGrads.length] || avatarGrads[0];

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [matches, setMatches] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [sR, mR, aR] = await Promise.all([
          usersAPI.getDashboardStats(), usersAPI.getMatches(), achievementsAPI.getAll(),
        ]);
        setStats(sR.data.stats);
        setMatches(mR.data.matches?.slice(0, 3) || []);
        setAchievements(aR.data.achievements || []);
      } catch(e){ console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const newAch = achievements.filter(a => a.isNew).length;
  const today = new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-[3px] border-luna-200 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const statCards = [
    { label:'PROFILE SCORE', value:`${stats?.profileScore||user?.profileScore||0}%`, sub:'↑ +5 this week', subColor:'text-teal-500 dark:text-teal-400', icon:TrendingUp, delay:'fade-in-1' },
    { label:'ACHIEVEMENTS',  value:stats?.totalAchievements||achievements.length, sub:`${newAch} new unlocked`, subColor:'text-teal-500 dark:text-teal-400', icon:Award, delay:'fade-in-2' },
    { label:'TEAM MATCHES',  value:stats?.teamMatches||3, sub:'AI recommended', subColor:'text-luna-200 dark:text-luna-100', icon:Users, delay:'fade-in-3' },
    { label:'GPA CREDIT',    value:(user?.gpa||stats?.gpa||0).toFixed(1), sub:'Sent to professor', subColor:'text-luna-300/60 dark:text-luna-100/40', icon:GraduationCap, delay:'fade-in-4' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 fade-in">
        <h1 className="text-3xl font-extrabold text-luna-400 dark:text-luna-100 tracking-tight">
          Good morning, <span className="text-transparent bg-clip-text" style={{backgroundImage:'linear-gradient(135deg,#54acbf,#023859)'}}>{user?.name?.split(' ')[0]}</span> ✦
        </h1>
        <p className="text-luna-300/60 dark:text-luna-100/40 text-sm mt-1.5 font-medium">
          {today} — {matches.length} new team matches waiting
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {statCards.map(({ label, value, sub, subColor, icon:Icon, delay }) => (
          <div key={label} className={`glass rounded-2xl p-5 card-glow-blue ${delay}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] font-bold text-luna-300/70 dark:text-luna-100/40 uppercase tracking-[0.15em]">{label}</span>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:'linear-gradient(135deg,rgba(84,172,191,0.2),rgba(2,56,89,0.15))'}}>
                <Icon size={14} className="text-luna-200 dark:text-luna-100" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-luna-400 dark:text-luna-100 mb-1 tracking-tight">{value}</div>
            <div className={`text-xs font-semibold ${subColor}`}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-3 gap-5">
        {/* AI Matches */}
        <div className="col-span-2 glass rounded-2xl p-5 card-glow-blue fade-in-2">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center btn-primary">
                <Sparkles size={12} className="text-white" />
              </div>
              <span className="text-[10px] font-bold text-luna-300/70 dark:text-luna-100/50 uppercase tracking-[0.15em]">
                AI TEAM MATCHES — For "Design Innovation Contest"
              </span>
            </div>
            <Link to="/ai-search" className="flex items-center gap-1 text-xs text-luna-200 dark:text-luna-100/70 font-bold hover:underline">
              View all <ChevronRight size={13} />
            </Link>
          </div>

          <div className="space-y-2">
            {matches.length === 0 ? (
              <div className="text-center py-10 text-luna-300/50 dark:text-luna-100/30">
                <Users size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">Complete your profile to get AI recommendations.</p>
              </div>
            ) : matches.map((match, i) => (
              <MatchCard key={i} match={match} getAvatarGrad={getAvatarGrad} />
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="space-y-4">
          {/* AI Coach */}
          <div className="rounded-2xl p-5 text-white fade-in-3 relative overflow-hidden" style={{background:'linear-gradient(135deg,#54acbf,#023859)'}}>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10" style={{background:'radial-gradient(circle,#a7ebf2,transparent)',transform:'translate(20%,-20%)'}}></div>
            <div className="flex items-center gap-2 mb-3 relative z-10">
              <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                <Bot size={14} />
              </div>
              <span className="font-bold text-sm">AI Coach says...</span>
            </div>
            <p className="text-sm text-white/80 leading-relaxed mb-4 relative z-10">
              {user?.skills?.length > 0
                ? `Your ${user.skills[0]} skills are in demand. Join the Design Innovation Contest to boost your profile!`
                : 'Add skills to get personalized AI coaching recommendations!'}
            </p>
            <Link to="/ai-search" className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs px-3.5 py-2 rounded-xl transition-colors font-bold relative z-10">
              See recommendations <ChevronRight size={12} />
            </Link>
          </div>

          {/* Charts */}
          <div className="glass rounded-2xl p-4 card-glow-blue fade-in-4">
            <p className="text-[9px] font-bold text-luna-300/70 dark:text-luna-100/40 uppercase tracking-[0.15em] mb-3">Profit</p>
            <ResponsiveContainer width="100%" height={75}>
              <AreaChart data={profitData}>
                <defs>
                  <linearGradient id="lunaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#54acbf" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#54acbf" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="#54acbf" fill="url(#lunaGrad)" strokeWidth={2} dot={false} />
                <Tooltip contentStyle={{ fontSize:'11px', borderRadius:'10px', border:'none', background:'rgba(255,255,255,0.9)', boxShadow:'0 4px 16px rgba(2,56,89,0.15)' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-2xl p-4 card-glow-blue fade-in-4">
            <p className="text-[9px] font-bold text-luna-300/70 dark:text-luna-100/40 uppercase tracking-[0.15em] mb-2">Analysis</p>
            <ResponsiveContainer width="100%" height={110}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(2,56,89,0.15)" />
                <PolarAngleAxis dataKey="s" tick={{ fontSize:9, fill:'#26658c', fontWeight:600 }} />
                <Radar dataKey="A" stroke="#54acbf" fill="#54acbf" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function MatchCard({ match, getAvatarGrad }) {
  const { user:mu, matchScore, complementarySkills } = match;
  const initials = mu.name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);
  const grad = getAvatarGrad(mu.name);
  const scoreColor = matchScore>=90 ? 'text-teal-600 dark:text-teal-400' :
    matchScore>=75 ? 'text-luna-200' : 'text-luna-300 dark:text-luna-100/60';

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/40 dark:hover:bg-luna-400/20 transition-all group">
      <div className={`w-10 h-10 bg-gradient-to-br ${grad} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md`}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-sm text-luna-400 dark:text-luna-100">{mu.name}</span>
          <span className="text-xs text-luna-300/60 dark:text-luna-100/40 truncate">{mu.major} — {mu.mbti}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {(complementarySkills||mu.skills||[]).slice(0,3).map((s,i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded-full font-semibold bg-luna-100/60 dark:bg-luna-400/30 text-luna-300 dark:text-luna-100/70">
              {s}
            </span>
          ))}
        </div>
      </div>
      <div className={`text-sm font-extrabold ${scoreColor} flex-shrink-0`}>{matchScore}%</div>
    </div>
  );
}
