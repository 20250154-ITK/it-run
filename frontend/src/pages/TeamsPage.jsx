import { useState, useEffect } from 'react';
import { teamsAPI, competitionsAPI } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { Users, Plus, Crown, UserPlus, Zap } from 'lucide-react';

const statusColors = {
  recruiting: 'bg-green-50 text-green-600 border-green-200',
  full: 'bg-red-50 text-red-600 border-red-200',
  active: 'bg-luna-100/50 dark:bg-luna-400/20 text-luna-200 border-blue-200',
  completed: 'bg-white/50 dark:bg-white/5 text-luna-300/50 dark:text-luna-100/30 border-luna-200/30 dark:border-luna-100/10',
};

const avatarColors = ['bg-luna-100/50 dark:bg-luna-400/200', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500'];
const getAvatarColor = (name) => avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length];
const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

export default function TeamsPage() {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', competition: '', maxMembers: 4, requiredSkills: '' });
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState({});

  useEffect(() => {
    Promise.all([
      teamsAPI.getAll(),
      teamsAPI.getMy(),
      competitionsAPI.getAll()
    ]).then(([allRes, myRes, compRes]) => {
      setTeams(allRes.data.teams || []);
      setMyTeams(myRes.data.teams || []);
      setCompetitions(compRes.data.competitions || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const skills = form.requiredSkills.split(',').map(s => s.trim()).filter(Boolean);
      await teamsAPI.create({ ...form, requiredSkills: skills });
      setShowCreate(false);
      const [allRes, myRes] = await Promise.all([teamsAPI.getAll(), teamsAPI.getMy()]);
      setTeams(allRes.data.teams || []);
      setMyTeams(myRes.data.teams || []);
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleJoin = async (teamId) => {
    setJoining({ ...joining, [teamId]: true });
    try {
      await teamsAPI.join(teamId);
      const [allRes, myRes] = await Promise.all([teamsAPI.getAll(), teamsAPI.getMy()]);
      setTeams(allRes.data.teams || []);
      setMyTeams(myRes.data.teams || []);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not join team');
    } finally {
      setJoining({ ...joining, [teamId]: false });
    }
  };

  const displayTeams = tab === 'my' ? myTeams : teams;

  return (
    <div className="max-w-4xl mx-auto fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-luna-400 dark:text-luna-100 flex items-center gap-2">
            <Zap size={22} className="text-blue-500" /> Teams
          </h1>
          <p className="text-luna-300/50 dark:text-luna-100/30 text-sm mt-1">Find and join teams for competitions</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 btn-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus size={16} /> Create Team
        </button>
      </div>

      {/* Create Team Form */}
      {showCreate && (
        <div className="glass rounded-2xl card-glow-blue card-glow-blue p-5 mb-5">
          <h3 className="font-semibold text-luna-400 dark:text-luna-100/80 mb-4">Create New Team</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Team name" className="border border-luna-200/30 dark:border-luna-100/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <select value={form.competition} onChange={e => setForm({ ...form, competition: e.target.value })}
              className="border border-luna-200/30 dark:border-luna-100/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select competition (optional)</option>
              {competitions.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
            <div className="col-span-2">
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Team description" rows={2}
                className="w-full border border-luna-200/30 dark:border-luna-100/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <input value={form.requiredSkills} onChange={e => setForm({ ...form, requiredSkills: e.target.value })}
              placeholder="Required skills (comma separated)" className="border border-luna-200/30 dark:border-luna-100/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="number" min="2" max="10" value={form.maxMembers} onChange={e => setForm({ ...form, maxMembers: parseInt(e.target.value) })}
              placeholder="Max members" className="border border-luna-200/30 dark:border-luna-100/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <div className="flex gap-2">
              <button type="submit" disabled={creating} className="btn-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
                {creating ? 'Creating...' : 'Create Team'}
              </button>
              <button type="button" onClick={() => setShowCreate(false)} className="bg-luna-100/50 dark:bg-luna-400/20 text-luna-300/70 dark:text-luna-100/40 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-200">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {[['all', 'All Teams'], ['my', 'My Teams']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === key ? 'btn-primary text-white' : 'bg-white text-luna-300/70 dark:text-luna-100/40 border border-luna-200/30 dark:border-luna-100/10 hover:bg-white/50 dark:bg-white/5'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : displayTeams.length === 0 ? (
        <div className="text-center py-16 text-luna-300/50 dark:text-luna-100/30">
          <Users size={40} className="mx-auto mb-3 opacity-40" />
          <p>{tab === 'my' ? "You haven't joined any teams yet." : 'No teams available.'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayTeams.map(team => {
            const isLeader = team.leader?._id === user._id;
            const isMember = team.members?.some(m => m.user?._id === user._id || m.user === user._id);
            return (
              <div key={team._id} className="glass rounded-2xl card-glow-blue card-glow-blue p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-luna-400 dark:text-luna-100 text-lg">{team.name}</h3>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium border capitalize ${statusColors[team.status]}`}>
                        {team.status}
                      </span>
                      {isLeader && (
                        <span className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                          <Crown size={11} /> Leader
                        </span>
                      )}
                    </div>
                    {team.description && <p className="text-sm text-luna-300/50 dark:text-luna-100/30 mb-3">{team.description}</p>}
                    {team.competition && (
                      <p className="text-xs text-luna-200 mb-2">📋 {team.competition.title}</p>
                    )}

                    {/* Members */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex -space-x-2">
                        {team.members?.slice(0, 5).map((m, i) => (
                          <div key={i} className={`w-7 h-7 ${getAvatarColor(m.user?.name)} rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold`}>
                            {getInitials(m.user?.name)}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs text-luna-300/50 dark:text-luna-100/30">
                        {team.members?.length}/{team.maxMembers} members
                      </span>
                    </div>

                    {/* Required Skills */}
                    {team.requiredSkills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {team.requiredSkills.map((skill, i) => (
                          <span key={i} className="text-xs bg-luna-100/50 dark:bg-luna-400/20 text-luna-300/70 dark:text-luna-100/40 px-2.5 py-1 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    {isMember ? (
                      <span className="text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-xl font-medium border border-green-200">
                        ✓ Member
                      </span>
                    ) : team.status === 'recruiting' ? (
                      <button
                        onClick={() => handleJoin(team._id)}
                        disabled={joining[team._id]}
                        className="flex items-center gap-1.5 btn-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
                      >
                        <UserPlus size={14} />
                        {joining[team._id] ? 'Joining...' : 'Join'}
                      </button>
                    ) : (
                      <span className="text-xs text-luna-300/50 dark:text-luna-100/30 bg-white/50 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-luna-200/30 dark:border-luna-100/10">
                        {team.status === 'full' ? 'Full' : 'Closed'}
                      </span>
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
