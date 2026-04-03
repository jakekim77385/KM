'use client';

import { useState } from 'react';

type AppStatus = 'planning' | 'in-progress' | 'submitted' | 'interview' | 'accepted' | 'waitlisted' | 'rejected';

type Application = {
  id: string;
  school: string;
  type: 'ED' | 'EA' | 'REA' | 'RD';
  deadline: string;
  status: AppStatus;
  docs: { name: string; done: boolean }[];
  notes: string;
  priority: number;
};

const statusInfo: Record<AppStatus, { label: string; color: string; bg: string }> = {
  'planning': { label: '준비 중', color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.05)' },
  'in-progress': { label: '작성 중', color: 'var(--amber-400)', bg: 'rgba(251,191,36,0.1)' },
  'submitted': { label: '제출 완료', color: 'var(--blue-400)', bg: 'rgba(96,165,250,0.1)' },
  'interview': { label: '인터뷰', color: 'var(--purple-400)', bg: 'rgba(167,139,250,0.1)' },
  'accepted': { label: '합격 🎉', color: 'var(--green-400)', bg: 'rgba(74,222,128,0.1)' },
  'waitlisted': { label: '대기자', color: 'var(--amber-400)', bg: 'rgba(251,191,36,0.1)' },
  'rejected': { label: '불합격', color: 'var(--rose-400)', bg: 'rgba(251,113,133,0.1)' },
};

const commonDocs = [
  'Common App 원서', 'SAT 공식 점수 전송', '성적표 (공식)', '추천서 1 (선생님)', '추천서 2 (선생님)', '에세이 (메인)', 'Supplemental Essay', '지원비 결제'
];

const initialApplications: Application[] = [
  {
    id: 'mit', school: 'MIT', type: 'EA', deadline: '2026-11-01', status: 'planning', priority: 1,
    docs: commonDocs.map(d => ({ name: d, done: false })),
    notes: '드림 스쿨 1순위! 수학 만점 + STEM 배경 강조'
  },
  {
    id: 'stanford', school: 'Stanford', type: 'REA', deadline: '2026-11-01', status: 'planning', priority: 2,
    docs: commonDocs.map(d => ({ name: d, done: false })),
    notes: 'REA → EA 합격 시 다른 사립대 포기 필요. 신중하게 결정'
  },
  {
    id: 'harvard', school: 'Harvard', type: 'REA', deadline: '2026-11-01', status: 'planning', priority: 3,
    docs: commonDocs.map(d => ({ name: d, done: false })),
    notes: 'REA. 아이비 최강. 피아노 + 다양성 스토리로 차별화'
  },
  {
    id: 'jhu', school: 'Johns Hopkins', type: 'ED', deadline: '2026-11-01', status: 'planning', priority: 4,
    docs: commonDocs.map(d => ({ name: d, done: false })),
    notes: '의대 피더 최강. Pre-Med + 의료봉사 50시간 완벽 매칭'
  },
  {
    id: 'duke', school: 'Duke', type: 'ED', deadline: '2026-11-01', status: 'planning', priority: 5,
    docs: commonDocs.map(d => ({ name: d, done: false })),
    notes: '의대 + 음악 모두 강함. 좋은 옵션'
  },
  {
    id: 'upenn', school: 'UPenn', type: 'ED', deadline: '2026-11-01', status: 'planning', priority: 6,
    docs: commonDocs.map(d => ({ name: d, done: false })),
    notes: 'Wharton + SEAS 강함'
  },
  {
    id: 'columbia', school: 'Columbia', type: 'ED', deadline: '2026-11-01', status: 'planning', priority: 7,
    docs: commonDocs.map(d => ({ name: d, done: false })),
    notes: 'NYC. 글로벌 커뮤니티. 국제학생 경험 강조'
  },
  {
    id: 'caltech', school: 'Caltech', type: 'RD', deadline: '2027-01-03', status: 'planning', priority: 8,
    docs: commonDocs.map(d => ({ name: d, done: false })),
    notes: 'STEM 순수 강자. 수학 만점으로 어필'
  },
  {
    id: 'vanderbilt', school: 'Vanderbilt', type: 'ED', deadline: '2026-11-01', status: 'planning', priority: 9,
    docs: commonDocs.map(d => ({ name: d, done: false })),
    notes: 'Merit 장학금 가능성 높음'
  },
  {
    id: 'emory', school: 'Emory', type: 'ED', deadline: '2026-11-01', status: 'planning', priority: 10,
    docs: commonDocs.map(d => ({ name: d, done: false })),
    notes: '안전망 + 장학금 가능성!'
  },
];

export default function ApplicationTracker() {
  const [apps, setApps] = useState<Application[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kkumi-applications');
      return stored ? JSON.parse(stored) : initialApplications;
    }
    return initialApplications;
  });
  const [selected, setSelected] = useState<Application | null>(null);
  const [filterStatus, setFilterStatus] = useState<AppStatus | 'all'>('all');

  const save = (updated: Application[]) => {
    setApps(updated);
    if (typeof window !== 'undefined') localStorage.setItem('kkumi-applications', JSON.stringify(updated));
  };

  const updateStatus = (id: string, status: AppStatus) => {
    save(apps.map(a => a.id === id ? { ...a, status } : a));
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const toggleDoc = (appId: string, docIdx: number) => {
    const updated = apps.map(a => {
      if (a.id !== appId) return a;
      const docs = a.docs.map((d, i) => i === docIdx ? { ...d, done: !d.done } : d);
      return { ...a, docs };
    });
    save(updated);
    const updatedApp = updated.find(a => a.id === appId);
    if (selected?.id === appId && updatedApp) setSelected(updatedApp);
  };

  const filtered = filterStatus === 'all' ? apps : apps.filter(a => a.status === filterStatus);
  const counts: Record<AppStatus, number> = {} as any;
  (['planning', 'in-progress', 'submitted', 'interview', 'accepted', 'waitlisted', 'rejected'] as AppStatus[]).forEach(s => {
    counts[s] = apps.filter(a => a.status === s).length;
  });

  return (
    <div>
      {/* Stats */}
      <div className="stats-grid animate-in" style={{ marginBottom: '20px' }}>
        {[
          { label: '전체 지원', value: apps.length, icon: '🏛️', color: 'gold' },
          { label: '제출 완료', value: counts.submitted || 0, icon: '✅', color: 'blue' },
          { label: '합격', value: counts.accepted || 0, icon: '🎉', color: 'green' },
          { label: '인터뷰', value: counts.interview || 0, icon: '🎙️', color: 'purple' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <button className={`btn ${filterStatus === 'all' ? 'btn-primary' : 'btn-ghost'}`}
          id="app-filter-all" style={{ fontSize: '12px' }} onClick={() => setFilterStatus('all')}>
          전체 ({apps.length})
        </button>
        {(['planning', 'in-progress', 'submitted', 'accepted'] as AppStatus[]).map(s => (
          <button key={s} className={`btn ${filterStatus === s ? 'btn-primary' : 'btn-ghost'}`}
            id={`app-filter-${s}`} style={{ fontSize: '12px', color: filterStatus !== s ? statusInfo[s].color : undefined }}
            onClick={() => setFilterStatus(s)}>
            {statusInfo[s].label} ({counts[s] || 0})
          </button>
        ))}
      </div>

      {/* Applications Table */}
      <div className="card animate-in">
        <table className="data-table">
          <thead>
            <tr>
              <th>학교</th>
              <th>유형</th>
              <th>마감일</th>
              <th>서류 진행</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.sort((a, b) => a.priority - b.priority).map(app => {
              const info = statusInfo[app.status];
              const docsDone = app.docs.filter(d => d.done).length;
              const docsPct = Math.round((docsDone / app.docs.length) * 100);
              return (
                <tr key={app.id} id={`app-row-${app.id}`}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{app.school}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{app.notes.substring(0, 40)}...</div>
                  </td>
                  <td>
                    <span className={`badge ${app.type === 'EA' || app.type === 'REA' ? 'badge-gold' : app.type === 'ED' ? 'badge-rose' : 'badge-blue'}`}>
                      {app.type}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{app.deadline}</td>
                  <td style={{ minWidth: '100px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="progress-bar-wrap" style={{ flex: 1 }}>
                        <div className="progress-bar" style={{ width: `${docsPct}%` }}></div>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{docsDone}/{app.docs.length}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600,
                      color: info.color, background: info.bg, whiteSpace: 'nowrap'
                    }}>{info.label}</span>
                  </td>
                  <td>
                    <button className="btn btn-ghost" style={{ fontSize: '11px', padding: '4px 10px' }}
                      onClick={() => setSelected(app)} id={`manage-app-${app.id}`}>관리</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
        }} onClick={() => setSelected(null)}>
          <div style={{
            background: 'var(--navy-800)', border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-xl)', padding: '28px', width: '100%', maxWidth: '520px',
            maxHeight: '85vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.7)'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>{selected.school}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>마감: {selected.deadline} · {selected.type}</div>
              </div>
              <button onClick={() => setSelected(null)} className="btn btn-ghost" style={{ padding: '4px 10px' }}>✕</button>
            </div>

            {/* Status Change */}
            <div className="form-label" style={{ marginBottom: '8px' }}>지원 상태 변경</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
              {(Object.keys(statusInfo) as AppStatus[]).map(s => {
                const info = statusInfo[s];
                return (
                  <button key={s} className="btn btn-ghost"
                    id={`change-status-${s}`}
                    style={{
                      fontSize: '11px', padding: '5px 12px',
                      ...(selected.status === s ? { color: info.color, borderColor: info.color, background: info.bg } : {})
                    }}
                    onClick={() => updateStatus(selected.id, s)}>
                    {info.label}
                  </button>
                );
              })}
            </div>

            {/* Docs Checklist */}
            <div className="form-label" style={{ marginBottom: '8px' }}>서류 체크리스트</div>
            {selected.docs.map((doc, i) => (
              <div key={i} className="checklist-item" style={{ cursor: 'pointer' }}
                onClick={() => toggleDoc(selected.id, i)} id={`doc-${selected.id}-${i}`}>
                <div className={`check-box ${doc.done ? 'checked' : ''}`}>{doc.done && '✓'}</div>
                <div className={`check-text ${doc.done ? 'checked' : ''}`}>{doc.name}</div>
              </div>
            ))}

            <div style={{ marginTop: '16px' }}>
              <div className="form-label" style={{ marginBottom: '4px' }}>메모</div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                {selected.notes}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
