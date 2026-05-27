import { useState, useEffect } from 'react';
import { competitionsAPI, teamsAPI } from '../api/services';
import { Trophy, Calendar, Users, Tag, Plus, Filter, Clock } from 'lucide-react';

const categoryColors = {
  hackathon: 'bg-orange-100 text-orange-700',
  design: 'bg-pink-100 text-pink-700',
  business: 'bg-blue-100 text-sky-600 dark:text-sky-300',
  science: 'bg-green-100 text-green-700',
  sports: 'bg-yellow-100 text-yellow-700',
  other: 'bg-luna-100/50 dark:bg-luna-400/20 text-luna-300/70 dark:text-luna-100/40',
};

const statusColors = {
  upcoming: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  active: 'bg-green-50 text-green-600 border-green-200',
  completed: 'bg-white/50 dark:bg-white/5 text-luna-300/50 dark:text-luna-100/30 border-luna-200/30 dark:border-luna-100/10',
};

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'hackathon', prize: '', organizer: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchCompetitions();
  }, [filter]);

  const fetchCompetitions = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const res = await competitionsAPI.getAll(params);
      setCompetitions(res.data.competitions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await competitionsAPI.create(form);
      setShowCreate(false);
      setForm({ title: '', description: '', category: 'hackathon', prize: '', organizer: '' });
      fetchCompetitions();
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'TBD';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="max-w-4xl mx-auto fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-luna-400 dark:text-luna-100 flex items-center gap-2">
            <Trophy size={22} className="text-yellow-500" /> Competitions
          </h1>
          <p className="text-luna-300/50 dark:text-luna-100/30 text-sm mt-1">Discover and join competitions</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 btn-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> Add Competition
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="glass rounded-2xl card-glow-blue card-glow-blue p-5 mb-5">
          <h3 className="font-semibold text-luna-400 dark:text-luna-100/80 mb-4">Create New Competition</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Competition title" className="w-full border border-luna-200/30 dark:border-luna-100/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="col-span-2">
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Description" rows={2}
                className="w-full border border-luna-200/30 dark:border-luna-100/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              className="border border-luna-200/30 dark:border-luna-100/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {Object.keys(categoryColors).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input value={form.prize} onChange={e => setForm({ ...form, prize: e.target.value })}
              placeholder="Prize (e.g. $5,000)" className="border border-luna-200/30 dark:border-luna-100/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input value={form.organizer} onChange={e => setForm({ ...form, organizer: e.target.value })}
              placeholder="Organizer" className="border border-luna-200/30 dark:border-luna-100/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <div className="flex gap-2">
              <button type="submit" disabled={creating} className="btn-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-60">
                {creating ? 'Creating...' : 'Create'}
              </button>
              <button type="button" onClick={() => setShowCreate(false)} className="bg-luna-100/50 dark:bg-luna-400/20 text-luna-300/70 dark:text-luna-100/40 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-200">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-5">
        {['all', 'upcoming', 'active', 'completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${
              filter === f ? 'btn-primary text-white' : 'bg-white text-luna-300/70 dark:text-luna-100/40 border border-luna-200/30 dark:border-luna-100/10 hover:bg-white/50 dark:bg-white/5'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : competitions.length === 0 ? (
        <div className="text-center py-16 text-luna-300/50 dark:text-luna-100/30">
          <Trophy size={40} className="mx-auto mb-3 opacity-40" />
          <p>No competitions found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {competitions.map(comp => (
            <div key={comp._id} className="glass rounded-2xl card-glow-blue card-glow-blue p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-luna-400 dark:text-luna-100 text-lg">{comp.title}</h3>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${categoryColors[comp.category]}`}>
                      {comp.category}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium border capitalize ${statusColors[comp.status]}`}>
                      {comp.status}
                    </span>
                  </div>
                  <p className="text-sm text-luna-300/50 dark:text-luna-100/30 mb-3 leading-relaxed">{comp.description}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-luna-300/50 dark:text-luna-100/30">
                    {comp.organizer && (
                      <span className="flex items-center gap-1"><Tag size={12} /> {comp.organizer}</span>
                    )}
                    {comp.deadline && (
                      <span className="flex items-center gap-1"><Clock size={12} /> Deadline: {formatDate(comp.deadline)}</span>
                    )}
                    <span className="flex items-center gap-1"><Users size={12} /> {comp.minTeamSize}–{comp.maxTeamSize} members</span>
                  </div>
                  {comp.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {comp.tags.map((tag, i) => (
                        <span key={i} className="text-xs bg-luna-100/50 dark:bg-luna-400/20 text-luna-300/50 dark:text-luna-100/30 px-2 py-0.5 rounded-full">#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  {comp.prize && (
                    <div className="text-lg font-bold text-green-600 mb-2">{comp.prize}</div>
                  )}
                  <div className="text-xs text-luna-300/50 dark:text-luna-100/30 mb-3">
                    {comp.registeredTeams?.length || 0} teams registered
                  </div>
                  <button className="btn-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                    Join
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
