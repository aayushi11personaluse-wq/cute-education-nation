
import { useEffect, useState } from 'react';
import {
  Sparkles, Star, BookOpen, Trophy, Heart, Music2,
  Target, Gift, ChevronRight, CheckCircle2, Crown,
  Flame, Flower2, LockKeyhole, RotateCcw
} from 'lucide-react';

type Mission = {
  id: number;
  title: string;
  description: string;
  points: number;
  category: string;
  icon: string;
};

type Profile = {
  nickname: string;
  points: number;
  completed: number[];
  unlocked: string[];
  activeTab: string;
};

const missions: Mission[] = [
  { id: 1, title: 'Flashcard Stage', description: 'Review a set of flashcards and recall the answers.', points: 30, category: 'MEMORY', icon: '🃏' },
  { id: 2, title: 'Practice Performance', description: 'Answer five practice questions for a subject.', points: 40, category: 'PRACTICE', icon: '📝' },
  { id: 3, title: 'Teach-Back Challenge', description: 'Explain something you learned in your own words.', points: 45, category: 'MASTERY', icon: '🎤' },
  { id: 4, title: 'Reading Encore', description: 'Read a section and write down three key ideas.', points: 30, category: 'READING', icon: '📚' },
  { id: 5, title: 'Boss Battle', description: 'Try a challenging problem without looking at the solution first.', points: 60, category: 'CHALLENGE', icon: '👑' },
  { id: 6, title: 'Review Remix', description: 'Revisit an older topic and test what you remember.', points: 35, category: 'REVIEW', icon: '🎧' },
  { id: 7, title: 'Creative Comeback', description: 'Create a mind map, diagram, or summary of a topic.', points: 40, category: 'CREATIVITY', icon: '🎨' },
  { id: 8, title: 'Assignment Quest', description: 'Make meaningful progress on an assignment.', points: 50, category: 'PROGRESS', icon: '🌷' }
];

const ranks = [
  { name: 'Rookie Trainee', min: 0, next: 100, emoji: '🌱' },
  { name: 'Rising Star', min: 100, next: 300, emoji: '⭐' },
  { name: 'Debut Candidate', min: 300, next: 650, emoji: '🎤' },
  { name: 'Elite Trainee', min: 650, next: 1100, emoji: '💎' },
  { name: 'Academy Ace', min: 1100, next: 1800, emoji: '👑' },
  { name: 'Nation Icon', min: 1800, next: 1800, emoji: '✨' }
];

const cards = [
  { id: 'pink', name: 'Cotton Candy', rarity: 'COMMON', emoji: '🍓', color: 'pink' },
  { id: 'moon', name: 'Moonlight Stage', rarity: 'RARE', emoji: '🌙', color: 'purple' },
  { id: 'star', name: 'Golden Encore', rarity: 'EPIC', emoji: '🌟', color: 'gold' },
  { id: 'bloom', name: 'Dream Bloom', rarity: 'RARE', emoji: '🌸', color: 'mint' },
  { id: 'crown', name: 'Royal Debut', rarity: 'LEGENDARY', emoji: '👑', color: 'blue' }
];

const defaultProfile: Profile = {
  nickname: 'Star Trainee',
  points: 0,
  completed: [],
  unlocked: [],
  activeTab: 'Home'
};

function loadProfile(): Profile {
  try {
    const saved = localStorage.getItem('cen-profile');
    if (saved) return { ...defaultProfile, ...JSON.parse(saved) };
  } catch {
    // Use a fresh profile if local storage is unavailable.
  }
  return defaultProfile;
}

export default function App() {
  const [profile, setProfile] = useState<Profile>(loadProfile);
  const [tab, setTab] = useState('Home');
  const [nicknameDraft, setNicknameDraft] = useState(profile.nickname);
  const [toast, setToast] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('cen-profile', JSON.stringify(profile));
    } catch {
      // The app can still be used without local storage.
    }
  }, [profile]);

  const rank = [...ranks].reverse().find(r => profile.points >= r.min) ?? ranks[0];
  const rankIndex = ranks.findIndex(r => r.name === rank.name);
  const progress = rank.next === rank.min
    ? 100
    : Math.min(100, Math.max(0, ((profile.points - rank.min) / (rank.next - rank.min)) * 100));

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  }

  function completeMission(mission: Mission) {
    if (profile.completed.includes(mission.id)) return;
    const updated = {
      ...profile,
      points: profile.points + mission.points,
      completed: [...profile.completed, mission.id]
    };
    const newRank = [...ranks].reverse().find(r => updated.points >= r.min) ?? ranks[0];
    setProfile(updated);
    notify(`+${mission.points} SP! Amazing work, ${newRank.name}! ✨`);
  }

  function unlockCard(cardId: string) {
    if (profile.unlocked.includes(cardId)) {
      notify('You already own this photocard! 💗');
      return;
    }
    if (profile.points < 80) {
      notify('Earn 80 SP first to unlock a photocard! ⭐');
      return;
    }
    setProfile({
      ...profile,
      points: profile.points - 80,
      unlocked: [...profile.unlocked, cardId]
    });
    notify('New photocard added to your closet! 🎀');
  }

  const navItems = [
    { name: 'Home', icon: Sparkles },
    { name: 'Missions', icon: Target },
    { name: 'Photocards', icon: Star },
    { name: 'Charter', icon: BookOpen },
    { name: 'Profile', icon: Heart }
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Flower2 size={25} /></div>
          <div><strong>CUTE EDUCATION</strong><span>NATION ✦ STUDY CLUB</span></div>
        </div>
        <div className="academy-stamp">✦ YOUR ACADEMIC DEBUT ✦</div>
        <nav className="side-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.name} className={`nav-item ${tab === item.name ? 'active' : ''}`} onClick={() => setTab(item.name)}>
                <Icon size={19} /><span>{item.name}</span>{tab === item.name && <ChevronRight size={16} className="nav-arrow" />}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="mini-star">✦</div>
          <p>Your journey, your pace.</p>
          <span>No lost points. No pressure. Just progress.</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">ACADEMY <span>/</span> {tab.toUpperCase()}</div>
          <div className="top-profile">
            <div className="avatar">🌷</div>
            <div><strong>{profile.nickname}</strong><span>{rank.name}</span></div>
          </div>
        </header>

        <div className="page-content">
          {tab === 'Home' && (
            <>
              <section className="welcome-row">
                <div>
                  <div className="eyebrow"><Sparkles size={14} /> YOUR NEXT ERA STARTS HERE</div>
                  <h1>Hello, {profile.nickname}! <span>♡</span></h1>
                  <p className="subtitle">Every little step is part of your academic debut.</p>
                </div>
                <div className="welcome-sticker">🎀<span>YOU'VE GOT THIS!</span></div>
              </section>

              <section className="hero-card">
                <div className="hero-copy">
                  <div className="hero-label"><Crown size={14} /> CURRENT ERA</div>
                  <h2>{rank.emoji} {rank.name}</h2>
                  <p>Train your mind. Earn your era.<br />Become your own academic star.</p>
                  <button className="hero-button" onClick={() => setTab('Missions')}>Explore missions <ChevronRight size={17} /></button>
                </div>
                <div className="hero-art">
                  <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
                  <div className="hero-orb">🌟</div><span className="float-star star-one">✦</span><span className="float-star star-two">♡</span><span className="float-star star-three">✧</span>
                  <div className="hero-caption">DREAM • LEARN • SHINE</div>
                </div>
              </section>

              <section className="stats-grid">
                <div className="stat-card"><div className="stat-icon pink-icon"><Star size={19} /></div><span className="stat-label">STAR POINTS</span><strong>{profile.points} <small>SP</small></strong><span className="stat-foot">Your effort currency ✦</span></div>
                <div className="stat-card"><div className="stat-icon purple-icon"><Trophy size={19} /></div><span className="stat-label">MISSIONS CLEARED</span><strong>{profile.completed.length}<small> / {missions.length}</small></strong><span className="stat-foot">Every quest counts!</span></div>
                <div className="stat-card"><div className="stat-icon mint-icon"><Gift size={19} /></div><span className="stat-label">PHOTOCARDS</span><strong>{profile.unlocked.length}<small> collected</small></strong><span className="stat-foot">Build your collection ✿</span></div>
              </section>

              <section className="rank-panel">
                <div className="section-heading"><div><span className="eyebrow">YOUR TRAINEE JOURNEY</span><h3>On your way to stardom <span>✦</span></h3></div><span className="rank-emoji">{rank.emoji}</span></div>
                <div className="rank-line"><div className="rank-labels"><span>{rank.name}</span><span>{rank.next === rank.min ? 'MAX RANK!' : `${profile.points} / ${rank.next} SP`}</span></div><div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div><p>{rank.next === rank.min ? 'You reached the highest rank. Incredible!' : `${Math.max(0, rank.next - profile.points)} SP until your next era!`}</p></div>
                <div className="rank-steps">{ranks.map((r, i) => <div key={r.name} className={`rank-step ${profile.points >= r.min ? 'earned' : ''}`}><div>{profile.points >= r.min ? '✦' : <LockKeyhole size={13} />}</div><span>{r.name}</span></div>)}</div>
              </section>

              <section className="section-block">
                <div className="section-heading"><div><span className="eyebrow">PICK YOUR NEXT QUEST</span><h3>Today's featured missions <span>♡</span></h3></div><button className="text-button" onClick={() => setTab('Missions')}>View all <ChevronRight size={15} /></button></div>
                <div className="mission-grid">
                  {missions.slice(0, 3).map(m => <MissionCard key={m.id} mission={m} done={profile.completed.includes(m.id)} onComplete={() => completeMission(m)} />)}
                </div>
              </section>
            </>
          )}

          {tab === 'Missions' && (
            <>
              <PageTitle eyebrow="YOUR TRAINING SCHEDULE" title="Mission stage" subtitle="Choose a learning quest. Earn points for meaningful progress." />
              <div className="mission-banner"><span>🎧</span><div><strong>Small steps are still a comeback.</strong><p>Take breaks whenever you need. Your points never expire.</p></div></div>
              <div className="mission-grid full-missions">{missions.map(m => <MissionCard key={m.id} mission={m} done={profile.completed.includes(m.id)} onComplete={() => completeMission(m)} />)}</div>
            </>
          )}

          {tab === 'Photocards' && (
            <>
              <PageTitle eyebrow="YOUR COLLECTOR'S ALBUM" title="Photocard closet" subtitle="Collect tiny reminders of every era you create." />
              <div className="closet-balance"><Star size={18} /> Your balance: <strong>{profile.points} SP</strong><span>Each new card costs 80 SP.</span></div>
              <div className="card-grid">{cards.map(card => {
                const owned = profile.unlocked.includes(card.id);
                return <div className={`collect-card ${card.color}`} key={card.id}><div className="card-rarity">{card.rarity}</div><div className="card-art">{owned ? card.emoji : <LockKeyhole size={34} />}</div><h3>{owned ? card.name : 'Mystery Photocard'}</h3><p>{owned ? 'A little piece of your journey.' : 'A surprise waiting to be discovered.'}</p><button className="card-button" disabled={owned || profile.points < 80} onClick={() => unlockCard(card.id)}>{owned ? '♡ Collected' : profile.points < 80 ? '80 SP required' : 'Unlock · 80 SP'}</button></div>;
              })}</div>
              <p className="gentle-note">Photocards are optional fun rewards. You never need to collect them to succeed. 🌸</p>
            </>
          )}

          {tab === 'Charter' && (
            <>
              <PageTitle eyebrow="THE ACADEMY HANDBOOK" title="Nation Charter" subtitle="Our little community is built on kindness, curiosity, and balance." />
              <div className="charter-hero"><div className="charter-seal">✦<span>CEN</span>✦</div><div><span className="eyebrow">THE ACADEMY PROMISE</span><h2>Learn with heart. Shine with kindness.</h2><p>This preview introduces the values behind Cute Education Nation. It is not the full 50-rule charter or the final graduation exam.</p></div></div>
              <div className="charter-list">
                {[
                  ['01','Kindness first','Encourage others without comparing scores or ranks.'],
                  ['02','Progress over perfection','Mistakes are clues that help your brain grow.'],
                  ['03','Rest is part of training','Breaks are allowed. No one loses points for resting.'],
                  ['04','Your privacy matters','Never share private details just to join the club.'],
                  ['05','Celebrate every effort','A tiny step forward is still worth celebrating.']
                ].map(([n,title,desc]) => <div className="charter-rule" key={n}><span>{n}</span><div><strong>{title}</strong><p>{desc}</p></div><Heart size={18} /></div>)}
              </div>
            </>
          )}

          {tab === 'Profile' && (
            <>
              <PageTitle eyebrow="YOUR PERSONAL TRAINEE FILE" title="My profile" subtitle="Make this little academy space feel like yours." />
              <div className="profile-panel"><div className="profile-avatar">🌷</div><span className="eyebrow">TRAINEE ID · LOCAL PROFILE</span><h2>{profile.nickname}</h2><div className="profile-rank">{rank.emoji} {rank.name}</div><div className="profile-stats"><div><strong>{profile.points}</strong><span>Star Points</span></div><div><strong>{profile.completed.length}</strong><span>Missions cleared</span></div><div><strong>{profile.unlocked.length}</strong><span>Photocards</span></div></div><label className="nickname-label" htmlFor="nickname">Your display nickname</label><div className="nickname-form"><input id="nickname" maxLength={24} value={nicknameDraft} onChange={e => setNicknameDraft(e.target.value)} /><button onClick={() => { const name = nicknameDraft.trim().slice(0,24) || 'Star Trainee'; setProfile({ ...profile, nickname: name }); setNicknameDraft(name); notify('Profile updated! 💗'); }}>Save name</button></div><p className="gentle-note">Your profile is saved in this browser on this device. It is not a public account and does not sync to other devices.</p><button className="reset-button" onClick={() => { if (window.confirm('Reset your local progress? This cannot be undone.')) { setProfile(defaultProfile); setNicknameDraft(defaultProfile.nickname); notify('Fresh start! Your choice, your pace.'); } }}><RotateCcw size={15} /> Reset local progress</button></div>
            </>
          )}
          <footer className="footer">MADE OF LITTLE STEPS & BIG DREAMS <span>♡</span> CUTE EDUCATION NATION</footer>
        </div>
      </main>

      <div className="mobile-nav">{navItems.map(item => { const Icon = item.icon; return <button key={item.name} className={tab === item.name ? 'selected' : ''} onClick={() => setTab(item.name)}><Icon size={19} /><span>{item.name}</span></button>; })}</div>
      {toast && <div className="toast"><Sparkles size={17} />{toast}</div>}
    </div>
  );
}

function PageTitle({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return <section className="page-title"><span className="eyebrow"><Sparkles size={14} /> {eyebrow}</span><h1>{title} <span>♡</span></h1><p>{subtitle}</p></section>;
}

function MissionCard({ mission, done, onComplete }: { mission: Mission; done: boolean; onComplete: () => void }) {
  return <article className={`mission-card ${done ? 'mission-done' : ''}`}><div className="mission-card-top"><span className="mission-emoji">{mission.icon}</span><span className="mission-category">{mission.category}</span></div><h3>{mission.title}</h3><p>{mission.description}</p><div className="mission-card-bottom"><span className="points-pill"><Star size={14} /> +{mission.points} SP</span><button className="complete-button" disabled={done} onClick={onComplete}>{done ? <><CheckCircle2 size={15} /> Cleared</> : 'Complete quest'}</button></div></article>;
}
