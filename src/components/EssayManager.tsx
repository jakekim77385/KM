'use client';

import { useState } from 'react';

type EssayStatus = 'not-started' | 'drafting' | 'revision' | 'final';

type Essay = {
  id: string;
  school: string;
  type: 'common-app' | 'supplemental';
  prompt: string;
  wordLimit: number;
  currentWords: number;
  status: EssayStatus;
  content: string;
  deadline: string;
};

const statusInfo: Record<EssayStatus, { label: string; color: string; pct: number }> = {
  'not-started': { label: '시작 전', color: 'var(--text-muted)', pct: 0 },
  'drafting': { label: '초안 작성', color: 'var(--amber-400)', pct: 40 },
  'revision': { label: '수정 중', color: 'var(--blue-400)', pct: 70 },
  'final': { label: '최종 완성', color: 'var(--green-400)', pct: 100 },
};

const commonAppPrompts = [
  "어떤 배경, 정체성, 관심사, 또는 재능이 당신을 특별하게 만드나요?",
  "당신이 극복한 도전, 실패, 또는 걸림돌에 대해 서술하세요.",
  "당신의 가치관이나 세계관에 도전한 아이디어나 개념에 대해 설명하세요.",
  "당신이 지속적으로 관심을 가져온 활동을 설명하세요.",
  "당신에게 영향을 준 사람을 설명하고, 그 영향을 논의하세요.",
  "매혹스럽거나 흥미로운 주제나 개념에 대해 논의하세요.",
  "자유 주제 (위 항목 외 어떤 내용이든 가능)",
];

const initialEssays: Essay[] = [
  {
    id: 'ca-main', school: 'Common App', type: 'common-app',
    prompt: '자유 주제 — 나를 가장 잘 표현하는 스토리 (피아노 + 의료봉사 + 수학의 연결?)',
    wordLimit: 650, currentWords: 0, status: 'not-started',
    content: '', deadline: '2026-11-01'
  },
  {
    id: 'mit-1', school: 'MIT', type: 'supplemental',
    prompt: 'We know you lead a busy life. Tell us about something you do for fun.',
    wordLimit: 250, currentWords: 0, status: 'not-started',
    content: '', deadline: '2026-11-01'
  },
  {
    id: 'mit-2', school: 'MIT', type: 'supplemental',
    prompt: 'Describe the world you come from and how it has shaped your dreams and aspirations.',
    wordLimit: 250, currentWords: 0, status: 'not-started',
    content: '', deadline: '2026-11-01'
  },
  {
    id: 'stanford-1', school: 'Stanford', type: 'supplemental',
    prompt: 'What is the most significant challenge that society faces today?',
    wordLimit: 250, currentWords: 0, status: 'not-started',
    content: '', deadline: '2026-11-01'
  },
  {
    id: 'jhu-1', school: 'Johns Hopkins', type: 'supplemental',
    prompt: 'Tell us about an engineering challenge, medical puzzle, or research problem that you would like to see solved in your lifetime.',
    wordLimit: 300, currentWords: 0, status: 'not-started',
    content: '', deadline: '2026-11-01'
  },
  {
    id: 'harvard-1', school: 'Harvard', type: 'supplemental',
    prompt: 'Harvard has long recognized the importance of student body diversity. How will the life experiences, perspectives, and skills that you bring enhance the Harvard community?',
    wordLimit: 200, currentWords: 0, status: 'not-started',
    content: '', deadline: '2026-11-01'
  },
  {
    id: 'columbia-1', school: 'Columbia', type: 'supplemental',
    prompt: 'What attracts you to your preferred areas of study at Columbia University?',
    wordLimit: 300, currentWords: 0, status: 'not-started',
    content: '', deadline: '2026-11-01'
  },
];

const essayIdeas = [
  { title: '🎹 피아노 1위 + 수학의 연결', idea: '파나마 전국 1위 수상 → 수학적 사고와 음악의 연결 → 두 가지가 나를 어떻게 형성했나 → 의대에서 정밀함과 창의성의 균형 이야기' },
  { title: '👩‍⚕️ 스페인어 의료 봉사', idea: '파나마 공립병원 50시간 의료 봉사 → 스페인어로만 소통 → 언어 장벽을 넘어 환자와 소통한 경험 → 의료에서 공감과 소통의 중요성' },
  { title: '🌍 세 개의 정체성', idea: '한국인 정체성 + 파나마 거주 + 국제학교 → 3개 문화 사이에서 자신만의 정체성 형성 → 다양성을 강점으로 → 글로벌 리더십' },
  { title: '🧮 수학 올림피아드 조직', idea: 'Mathletic Society 부회장 → Math Buddies 튜터링 → 어려운 수학을 쉽게 설명하는 과정 → 가르치면서 배우는 성장 이야기' },
  { title: '🔬 STEM Outreach 리더', idea: '저소득층 학생들에게 실험실 경험 제공 → 과학의 기회 불평등 인식 → 이를 해결하려는 의지 → 앞으로의 목표와 연결' },
];

export default function EssayManager() {
  const [essays, setEssays] = useState<Essay[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kkumi-essays');
      return stored ? JSON.parse(stored) : initialEssays;
    }
    return initialEssays;
  });
  const [editing, setEditing] = useState<Essay | null>(null);
  const [activeTab, setActiveTab] = useState<'essays' | 'ideas' | 'prompts'>('essays');

  const saveEssays = (updated: Essay[]) => {
    setEssays(updated);
    if (typeof window !== 'undefined') localStorage.setItem('kkumi-essays', JSON.stringify(updated));
  };

  const updateEssay = () => {
    if (!editing) return;
    const wordCount = editing.content.trim().split(/\s+/).filter(Boolean).length;
    const updated = essays.map(e => e.id === editing.id ? { ...editing, currentWords: wordCount } : e);
    saveEssays(updated);
    setEditing(null);
  };

  const changeStatus = (id: string, status: EssayStatus) => {
    const updated = essays.map(e => e.id === id ? { ...e, status } : e);
    saveEssays(updated);
  };

  const finalCount = essays.filter(e => e.status === 'final').length;
  const inProgressCount = essays.filter(e => e.status === 'drafting' || e.status === 'revision').length;

  return (
    <div>
      {/* Overview */}
      <div className="stats-grid animate-in" style={{ marginBottom: '20px' }}>
        <div className="stat-card">
          <div className="stat-icon gold">✍️</div>
          <div>
            <div className="stat-value">{essays.length}</div>
            <div className="stat-label">총 에세이</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div>
            <div className="stat-value">{finalCount}</div>
            <div className="stat-label">최종 완성</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber">📝</div>
          <div>
            <div className="stat-value">{inProgressCount}</div>
            <div className="stat-label">작성 중</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon rose">⏰</div>
          <div>
            <div className="stat-value">{essays.filter(e => e.status === 'not-started').length}</div>
            <div className="stat-label">시작 전</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '4px' }}>
        {[
          { key: 'essays', label: '📝 에세이 목록' },
          { key: 'ideas', label: '💡 에세이 아이디어' },
          { key: 'prompts', label: '📋 Common App 프롬프트' },
        ].map(tab => (
          <button key={tab.key} id={`essay-tab-${tab.key}`}
            className={`btn ${activeTab === tab.key ? 'btn-primary' : 'btn-ghost'}`}
            style={{ flex: 1, justifyContent: 'center', fontSize: '13px' }}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Essays List */}
      {activeTab === 'essays' && (
        <div className="animate-in">
          {/* Common App */}
          <div style={{ marginBottom: '12px', fontSize: '12px', fontWeight: 700, color: 'var(--gold-400)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            📋 Common App Main Essay
          </div>
          {essays.filter(e => e.type === 'common-app').map(essay => (
            <EssayCard key={essay.id} essay={essay} onEdit={() => setEditing({ ...essay })} onStatusChange={changeStatus} />
          ))}

          <div style={{ margin: '20px 0 12px', fontSize: '12px', fontWeight: 700, color: 'var(--blue-400)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            🏛️ Supplemental Essays
          </div>
          {essays.filter(e => e.type === 'supplemental').map(essay => (
            <EssayCard key={essay.id} essay={essay} onEdit={() => setEditing({ ...essay })} onStatusChange={changeStatus} />
          ))}
        </div>
      )}

      {/* Ideas */}
      {activeTab === 'ideas' && (
        <div className="animate-in">
          <div className="card" style={{ marginBottom: '16px' }}>
            <div className="card-title" style={{ marginBottom: '6px' }}>💡 꾸미를 위한 에세이 아이디어</div>
            <div className="card-subtitle" style={{ marginBottom: '16px' }}>꾸미의 실제 경험을 바탕으로 한 강력한 스토리들</div>
            {essayIdeas.map((idea, i) => (
              <div key={i} style={{
                padding: '16px', background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', marginBottom: '10px'
              }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gold-400)', marginBottom: '8px' }}>{idea.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{idea.idea}</div>
              </div>
            ))}
          </div>
          <div className="card" style={{ borderColor: 'rgba(212,175,55,0.2)' }}>
            <div className="card-title" style={{ marginBottom: '12px' }}>⭐ 꾸미의 최강 에세이 소재</div>
            <div style={{ padding: '14px', background: 'linear-gradient(135deg, rgba(212,175,55,0.1), transparent)', borderRadius: '10px', marginBottom: '10px' }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>🥇 추천 메인 에세이: "수학과 음악의 교차점"</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                파나마 전국 피아노 대회 1위 + SAT 수학 만점 → 두 가지가 어떻게 연결되는지 → 음악에서 배운 정밀함이 수학에, 수학의 논리가 음악에 → 이 사고방식이 의료에서 어떻게 적용될지. <strong style={{ color: 'var(--gold-400)' }}>독창적이고 강력한 스토리!</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prompts */}
      {activeTab === 'prompts' && (
        <div className="animate-in">
          <div className="card">
            <div className="card-title" style={{ marginBottom: '6px' }}>📋 Common App Essay Prompts 2026-27</div>
            <div className="card-subtitle" style={{ marginBottom: '16px' }}>7개 중 1개 선택 · 250~650 단어</div>
            {commonAppPrompts.map((prompt, i) => (
              <div key={i} style={{
                padding: '14px', background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', marginBottom: '8px',
                display: 'flex', gap: '12px', alignItems: 'flex-start'
              }}>
                <div style={{
                  minWidth: '28px', height: '28px', borderRadius: '50%',
                  background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 700, color: 'var(--gold-400)', flexShrink: 0
                }}>{i + 1}</div>
                <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{prompt}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
        }} onClick={() => setEditing(null)}>
          <div style={{
            background: 'var(--navy-800)', border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-xl)', padding: '28px', width: '100%', maxWidth: '700px',
            maxHeight: '85vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.7)'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ marginBottom: '16px' }}>
              <span className="badge badge-gold" style={{ marginBottom: '8px', display: 'inline-flex' }}>{editing.school}</span>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{editing.prompt}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>단어 제한: {editing.wordLimit}자</div>
            </div>
            <div className="form-label">에세이 내용</div>
            <textarea className="form-input" style={{ minHeight: '240px' }}
              value={editing.content}
              onChange={e => setEditing({ ...editing, content: e.target.value })}
              placeholder="에세이를 여기에 작성하세요..." />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                현재 단어 수: <strong style={{ color: editing.content.trim().split(/\s+/).filter(Boolean).length > editing.wordLimit ? 'var(--rose-400)' : 'var(--green-400)' }}>
                  {editing.content.trim().split(/\s+/).filter(Boolean).length}
                </strong> / {editing.wordLimit}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['not-started', 'drafting', 'revision', 'final'] as EssayStatus[]).map(s => (
                  <button key={s} className="btn btn-ghost"
                    id={`essay-status-${s}`}
                    style={{ fontSize: '11px', padding: '4px 10px', color: editing.status === s ? statusInfo[s].color : undefined }}
                    onClick={() => setEditing({ ...editing, status: s })}>
                    {statusInfo[s].label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={updateEssay} id="save-essay">저장</button>
              <button className="btn btn-ghost" onClick={() => setEditing(null)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EssayCard({ essay, onEdit, onStatusChange }: {
  essay: Essay;
  onEdit: () => void;
  onStatusChange: (id: string, status: EssayStatus) => void;
}) {
  const info = statusInfo[essay.status];
  const pct = info.pct;
  const wordPct = essay.wordLimit > 0 ? Math.min(100, Math.round((essay.currentWords / essay.wordLimit) * 100)) : 0;

  return (
    <div className="essay-card" style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-blue" style={{ fontSize: '10px' }}>{essay.school}</span>
            {essay.type === 'common-app' && <span className="badge badge-gold" style={{ fontSize: '10px' }}>메인</span>}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{essay.prompt}</div>
        </div>
        <button className="btn btn-ghost" style={{ fontSize: '11px', padding: '4px 10px', marginLeft: '10px', flexShrink: 0 }}
          onClick={onEdit} id={`edit-essay-${essay.id}`}>편집</button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <span className={`essay-status ${essay.status.replace('-', '-')}`}
            style={{ color: info.color, background: `${info.color}15`, border: `1px solid ${info.color}40`, padding: '2px 8px', borderRadius: '100px', fontSize: '11px', fontWeight: 600 }}>
            {info.label}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            {essay.currentWords}/{essay.wordLimit} 단어
          </span>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--gold-400)' }}>📅 {essay.deadline}</span>
      </div>
      <div className="progress-bar-wrap">
        <div className="progress-bar" style={{
          width: `${pct}%`,
          background: essay.status === 'final' ? 'linear-gradient(90deg, #16A34A, var(--green-400))' :
            essay.status === 'revision' ? 'linear-gradient(90deg, #2563EB, var(--blue-400))' :
              essay.status === 'drafting' ? 'linear-gradient(90deg, #D97706, var(--amber-400))' :
                'rgba(255,255,255,0.1)'
        }}></div>
      </div>
    </div>
  );
}
