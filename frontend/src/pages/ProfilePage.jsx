import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../api/services';
import { User, Building, BookOpen, Star, Brain, Plus, X, Save, Edit3, CheckCircle } from 'lucide-react';

const MBTI_TYPES = ['INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP','ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP'];

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name:'',university:'',major:'',gpa:'',bio:'',mbti:'',skills:[] });
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) setForm({ name:user.name||'', university:user.university||'', major:user.major||'', gpa:user.gpa||'', bio:user.bio||'', mbti:user.mbti||'', skills:user.skills||[] });
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await usersAPI.updateProfile({ ...form, gpa: parseFloat(form.gpa)||0 });
      updateUser(res.data.user); setEditing(false); setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch(e){ console.error(e); } finally { setSaving(false); }
  };

  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !form.skills.includes(s)) { setForm({...form, skills:[...form.skills,s]}); setNewSkill(''); }
  };

  const score = user?.profileScore || 0;
  const initials = user?.name?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)||'U';

  return (
    <div className="max-w-3xl mx-auto fade-in">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-extrabold text-luna-400 dark:text-luna-100 tracking-tight">My Profile</h1>
          <p className="text-luna-300/60 dark:text-luna-100/40 text-sm mt-1 font-medium">Manage your student profile</p>
        </div>
        <div className="flex items-center gap-2">
          {saved && <div className="flex items-center gap-1.5 text-teal-500 text-sm font-bold bg-teal-50/80 dark:bg-teal-900/20 px-4 py-2 rounded-xl border border-teal-200/50"><CheckCircle size={14}/> Saved!</div>}
          {!editing
            ? <button onClick={()=>setEditing(true)} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm"><Edit3 size={14}/> Edit Profile</button>
            : <>
                <button onClick={()=>setEditing(false)} className="px-4 py-2 rounded-xl text-sm font-semibold text-luna-300 dark:text-luna-100/60 glass border border-luna-200/30 hover:bg-white/60 dark:hover:bg-luna-400/20 transition-all">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm"><Save size={14}/>{saving?'Saving...':'Save'}</button>
              </>
          }
        </div>
      </div>

      {/* Header card */}
      <div className="glass rounded-2xl p-6 mb-5 card-glow-blue">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-extrabold shadow-lg flex-shrink-0 btn-primary">
            {initials}
          </div>
          <div className="flex-1">
            {editing
              ? <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input-field w-full rounded-xl px-3 py-1.5 text-lg font-bold mb-2"/>
              : <h2 className="text-xl font-extrabold text-luna-400 dark:text-luna-100 mb-1 tracking-tight">{user?.name}</h2>
            }
            <p className="text-luna-300/70 dark:text-luna-100/40 text-sm font-medium">{user?.university||'—'} · {user?.major||'—'}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-3xl font-extrabold text-transparent bg-clip-text" style={{backgroundImage:'linear-gradient(135deg,#54acbf,#023859)'}}>{score}%</div>
            <p className="text-xs text-luna-300/60 dark:text-luna-100/40 font-semibold mb-2">Profile Score</p>
            <div className="w-24 h-1.5 bg-luna-100/40 dark:bg-luna-400/30 rounded-full ml-auto">
              <div className="h-full rounded-full transition-all" style={{width:`${score}%`,background:'linear-gradient(90deg,#54acbf,#023859)'}}/>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 mb-5">
        {/* Basic Info */}
        <div className="glass rounded-2xl p-5 card-glow-blue">
          <h3 className="font-bold text-luna-400 dark:text-luna-100 mb-4 flex items-center gap-2 text-sm"><User size={14} className="text-luna-200"/> Basic Info</h3>
          <div className="space-y-3">
            {[
              {label:'University',icon:<Building size={12}/>,key:'university'},
              {label:'Major',icon:<BookOpen size={12}/>,key:'major'},
              {label:'GPA',icon:<Star size={12}/>,key:'gpa',type:'number'},
            ].map(({label,icon,key,type='text'})=>(
              <div key={key}>
                <label className="text-[10px] font-bold text-luna-300/60 dark:text-luna-100/40 flex items-center gap-1 mb-1 uppercase tracking-wider">{icon}{label}</label>
                {editing
                  ? <input type={type} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} className="input-field w-full rounded-xl px-3 py-1.5 text-sm"/>
                  : <p className="text-sm font-bold text-luna-400 dark:text-luna-100">{form[key]||'—'}</p>
                }
              </div>
            ))}
          </div>
        </div>

        {/* MBTI */}
        <div className="glass rounded-2xl p-5 card-glow-blue">
          <h3 className="font-bold text-luna-400 dark:text-luna-100 mb-4 flex items-center gap-2 text-sm"><Brain size={14} className="text-luna-200"/> MBTI Type</h3>
          {editing
            ? <div className="grid grid-cols-4 gap-1.5">
                {MBTI_TYPES.map(type=>(
                  <button key={type} onClick={()=>setForm({...form,mbti:type})}
                    className={`py-1.5 text-[11px] rounded-lg font-bold transition-all ${form.mbti===type?'text-white shadow-md':'glass text-luna-300 dark:text-luna-100/60 hover:text-luna-200 border border-luna-200/20'}`}
                    style={form.mbti===type?{background:'linear-gradient(135deg,#54acbf,#023859)'}:{}}
                  >{type}</button>
                ))}
              </div>
            : <div className="text-center py-6">
                <div className="text-4xl font-extrabold text-transparent bg-clip-text" style={{backgroundImage:'linear-gradient(135deg,#54acbf,#023859)'}}>{user?.mbti||'—'}</div>
                <p className="text-xs text-luna-300/60 dark:text-luna-100/40 mt-2 font-semibold">Personality Type</p>
              </div>
          }
        </div>
      </div>

      {/* Bio */}
      <div className="glass rounded-2xl p-5 card-glow-blue mb-5">
        <h3 className="font-bold text-luna-400 dark:text-luna-100 mb-3 text-sm">About Me</h3>
        {editing
          ? <textarea value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} rows={3} placeholder="Tell others about yourself..."
              className="input-field w-full rounded-xl px-4 py-3 text-sm resize-none"/>
          : <p className="text-sm text-luna-300/80 dark:text-luna-100/50 leading-relaxed">{user?.bio||'No bio added yet.'}</p>
        }
      </div>

      {/* Skills */}
      <div className="glass rounded-2xl p-5 card-glow-blue">
        <h3 className="font-bold text-luna-400 dark:text-luna-100 mb-4 text-sm">Skills</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {form.skills.map(skill=>(
            <span key={skill} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-bold border" style={{background:'rgba(84,172,191,0.12)',color:'#26658c',borderColor:'rgba(84,172,191,0.25)'}}>
              {skill}
              {editing&&<button onClick={()=>setForm({...form,skills:form.skills.filter(s=>s!==skill)})} className="hover:text-red-400 transition-colors"><X size={11}/></button>}
            </span>
          ))}
          {form.skills.length===0&&<p className="text-sm text-luna-300/50 dark:text-luna-100/30">No skills added yet.</p>}
        </div>
        {editing&&(
          <div className="flex gap-2">
            <input value={newSkill} onChange={e=>setNewSkill(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addSkill()}
              placeholder="Add a skill (e.g. React, Python)"
              className="input-field flex-1 rounded-xl px-3 py-2 text-sm"/>
            <button onClick={addSkill} className="btn-primary px-4 py-2 rounded-xl text-sm"><Plus size={16}/></button>
          </div>
        )}
      </div>
    </div>
  );
}
