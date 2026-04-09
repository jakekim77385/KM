'use client';

import { useState } from 'react';

type Phase = { id: string; month: string; year: string; title: string; tasks: { text: string; done: boolean; urgent?: boolean }[]; status: 'completed' | 'current' | 'upcoming' };

const initialTimeline: Phase[] = [
  {
    id: 'apr26', month: '4월', year: '2026', title: '대학 리서치 & AP 준비', status: 'current',
    tasks: [
      { text: '🇪🇸 DELE B2 스페인어 시험 접수 완료 (4/8 마감)', done: true },
      { text: '🔢 OPM 파나마 수학경시대회 1차 시험 (4/13 월)', done: false, urgent: true },
      { text: '⚯️ Chem 13 시험 접수 마감 (4/24 금) — 화학 선생님께 요청!', done: false, urgent: true },
      { text: 'AP 시험 최종 스터디 (5월 시험 준비)', done: false, urgent: true },
      { text: 'Common App 계정 생성', done: false },
      { text: '드림 스쿨 Top 20 리스트 확정', done: false },
    ]
  },
  {
    id: 'may26', month: '5월', year: '2026', title: 'AP 시험의 달 🔥', status: 'upcoming',
    tasks: [
      { text: 'AP Chemistry 시험 (5/4 월 오후)', done: false, urgent: true },
      { text: 'AP Physics 1 시험 (5/5 화 오후)', done: false, urgent: true },
      { text: 'AP English Language 시험 (5/6 수 오전)', done: false, urgent: true },
      { text: '⚯️ Chem 13 시험 (5/7 목) — University of Waterloo', done: false, urgent: true },
      { text: 'AP Calculus BC 시험 (5/12 화 오전)', done: false, urgent: true },
      { text: '🔢 OPM 파나마 수학경시대회 2차 시험 (5/18 월)', done: false, urgent: true },
      { text: '🇪🇸 DELE B2 스페인어 시험 (5/23 토)', done: false, urgent: true },
      { text: '선생님들께 추천서 미리 요청드리기', done: false },
      { text: '여름 활동 계획 확정 (인턴십/캠프/연구 등)', done: false },
    ]
  },
  {
    id: 'jun26', month: '6월', year: '2026', title: '에세이 시작 & 여름 준비', status: 'upcoming',
    tasks: [
      { text: 'Common App 에세이 초안 첫 번째 작성 시작', done: false, urgent: true },
      { text: '대학 캠퍼스 투어 일정 계획', done: false },
      { text: 'EC 활동 정리 및 문서화 (Common App 활동란)', done: false },
      { text: '여름 프로그램/인턴십 시작', done: false },
    ]
  },
  {
    id: 'jul26', month: '7월', year: '2026', title: '에세이 집중 작성 ✍️', status: 'upcoming',
    tasks: [
      { text: 'Common App 메인 에세이 2차 수정 완료', done: false, urgent: true },
      { text: '지원 대학 Supplemental Essays 초안 시작', done: false },
      { text: '캠퍼스 방문 투어 (EA/ED 대학 위주)', done: false },
      { text: 'Activity List 완성 (150자 제한 확인)', done: false },
    ]
  },
  {
    id: 'aug26', month: '8월', year: '2026', title: '에세이 마무리 & 12학년 준비', status: 'upcoming',
    tasks: [
      { text: 'Common App 에세이 최종 수정 (전문가 리뷰)', done: false, urgent: true },
      { text: 'EA/ED 지원 대학 최종 결정', done: false },
      { text: 'Supplemental Essays 학교별로 완성', done: false },
      { text: '성적표, 추천서 제출 일정 선생님과 확인', done: false },
    ]
  },
  {
    id: 'sep26', month: '9월', year: '2026', title: '12학년 시작 & 원서 준비', status: 'upcoming',
    tasks: [
      { text: '12학년 첫 학기 시작 — GPA 유지 최우선!', done: false, urgent: true },
      { text: 'EA/ED 원서 세부 검토 및 점검', done: false },
      { text: '추천서 제출 선생님께 최종 확인', done: false },
      { text: 'CSS Profile 작성 시작 (재정보조)', done: false },
    ]
  },
  {
    id: 'oct26', month: '10월', year: '2026', title: 'SAT 마지막 & 에세이 완성', status: 'upcoming',
    tasks: [
      { text: 'SAT 마지막 응시 — 1570 수학 800점 만점으로 이미 충분. 재응시보다 에세이 완성 집중 권장', done: false },
      { text: '모든 에세이 최종 완성', done: false, urgent: true },
      { text: 'EA/ED 원서 최종 점검 (성적, 에세이, 활동)', done: false, urgent: true },
      { text: '인터뷰 준비 시작 (학교별 알럼나이 인터뷰)', done: false },
    ]
  },
  {
    id: 'nov26', month: '11월', year: '2026', title: '🔥 EA/ED 마감! 가장 중요한 달', status: 'upcoming',
    tasks: [
      { text: '🚨 EA/ED 원서 제출 (11월 1일~15일)', done: false, urgent: true },
      { text: '모든 지원 서류 확인 (추천서 수신 확인)', done: false, urgent: true },
      { text: 'RD 지원 대학 최종 리스트 확정', done: false },
      { text: '인터뷰 참여 (오퍼 오면 즉시)', done: false },
      { text: 'CSS Profile 제출 (재정보조 신청)', done: false },
    ]
  },
  {
    id: 'dec26', month: '12월', year: '2026', title: 'EA/ED 결과 & RD 마지막 준비', status: 'upcoming',
    tasks: [
      { text: 'EA/ED 결과 확인 (12월 중순~말)', done: false },
      { text: 'RD 원서 최종 점검 (1월 마감 대비)', done: false },
      { text: '장학금 에세이 추가 제출', done: false },
    ]
  },
  {
    id: 'jan27', month: '1월', year: '2027', title: '🎯 RD 마감 + 합격 발표 대기', status: 'upcoming',
    tasks: [
      { text: '🚨 RD 원서 제출 마감 (1월 1일~15일)', done: false, urgent: true },
      { text: '장학금 원서 제출 완료', done: false, urgent: true },
      { text: 'UC 계열 마감 (11월 30일 이미 완료)', done: false },
      { text: '웨이팅리스트 전략 준비 (만약을 위해)', done: false },
    ]
  },
  {
    id: 'mar27', month: '3월', year: '2027', title: '🎉 합격 발표의 달!', status: 'upcoming',
    tasks: [
      { text: 'RD 합격 결과 발표 (3월 말)', done: false },
      { text: '장학금 패키지 비교 분석', done: false },
      { text: '최종 진학 대학 결정 (5월 1일 전)', done: false },
      { text: '비자 신청 (F-1)', done: false },
    ]
  },
];

type FilterStatus = 'all' | 'completed' | 'current' | 'upcoming';

const statusColors = { completed: 'var(--green-400)', current: 'var(--gold-400)', upcoming: 'var(--text-muted)' };
const statusLabels = { completed: '완료', current: '진행 중', upcoming: '예정' };

export default function Timeline() {
  const [timeline, setTimeline] = useState<Phase[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kkumi-timeline-v8');
      return stored ? JSON.parse(stored) : initialTimeline;
    }
    return initialTimeline;
  });
  const [filter, setFilter] = useState<FilterStatus>('all');

  const saveTimeline = (updated: Phase[]) => {
    setTimeline(updated);
    if (typeof window !== 'undefined') localStorage.setItem('kkumi-timeline-v8', JSON.stringify(updated));
  };

  const toggleTask = (phaseId: string, taskIdx: number) => {
    const updated = timeline.map(phase => {
      if (phase.id !== phaseId) return phase;
      const tasks = phase.tasks.map((t, i) => i === taskIdx ? { ...t, done: !t.done } : t);
      return { ...phase, tasks };
    });
    saveTimeline(updated);
  };

  const filtered = filter === 'all' ? timeline : timeline.filter(p => p.status === filter);
  const totalTasks = timeline.reduce((sum, p) => sum + p.tasks.length, 0);
  const doneTasks = timeline.reduce((sum, p) => sum + p.tasks.filter(t => t.done).length, 0);
  const completionPct = Math.round((doneTasks / totalTasks) * 100);

  return (
    <div>
      {/* Progress Overview */}
      <div className="card card-gold animate-in" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <div className="card-title">📊 전체 진행률</div>
            <div className="card-subtitle">2025.4 ~ 2027.3 입시 로드맵</div>
          </div>
          <div style={{ fontSize: '36px', fontWeight: 900, color: 'var(--gold-400)' }}>{completionPct}%</div>
        </div>
        <div className="progress-bar-wrap" style={{ height: '10px' }}>
          <div className="progress-bar" style={{ width: `${completionPct}%` }}></div>
        </div>
        <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
          <span style={{ fontSize: '12px', color: 'var(--green-400)' }}>✅ 완료 {doneTasks}개</span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>📋 전체 {totalTasks}개</span>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[
          { key: 'all', label: '전체' },
          { key: 'current', label: '🔥 진행 중' },
          { key: 'upcoming', label: '📅 예정' },
          { key: 'completed', label: '✅ 완료' },
        ].map(f => (
          <button key={f.key} id={`timeline-filter-${f.key}`}
            className={`btn ${filter === f.key ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '13px' }} onClick={() => setFilter(f.key as FilterStatus)}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Timeline Items */}
      <div className="animate-in">
        {filtered.map((phase, phaseIdx) => {
          const donePhaseTasks = phase.tasks.filter(t => t.done).length;
          const phasePct = Math.round((donePhaseTasks / phase.tasks.length) * 100);
          return (
            <div key={phase.id} style={{ marginBottom: '16px' }}>
              <div className="card" style={{
                borderLeft: `3px solid ${statusColors[phase.status]}`,
                ...(phase.status === 'current' ? { borderColor: 'rgba(212,175,55,0.4)', background: 'linear-gradient(135deg, rgba(212,175,55,0.05), var(--glass-bg))' } : {})
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ textAlign: 'center', minWidth: '50px' }}>
                      <div style={{ fontSize: '22px', fontWeight: 900, color: statusColors[phase.status], lineHeight: 1 }}>{phase.month}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{phase.year}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{phase.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{donePhaseTasks}/{phase.tasks.length} 완료</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 600,
                      color: statusColors[phase.status],
                      background: `${statusColors[phase.status]}15`,
                      border: `1px solid ${statusColors[phase.status]}40`
                    }}>{statusLabels[phase.status]}</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: statusColors[phase.status] }}>{phasePct}%</span>
                  </div>
                </div>

                <div className="progress-bar-wrap" style={{ marginBottom: '12px' }}>
                  <div className="progress-bar" style={{
                    width: `${phasePct}%`,
                    background: phase.status === 'completed'
                      ? 'linear-gradient(90deg, #16A34A, var(--green-400))'
                      : phase.status === 'current'
                      ? 'linear-gradient(90deg, var(--gold-600), var(--gold-400))'
                      : 'linear-gradient(90deg, var(--navy-400), var(--navy-300))'
                  }}></div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {phase.tasks.map((task, taskIdx) => (
                    <div key={taskIdx}
                      className="checklist-item"
                      onClick={() => toggleTask(phase.id, taskIdx)}
                      style={{ cursor: 'pointer' }}
                      id={`task-${phase.id}-${taskIdx}`}>
                      <div className={`check-box ${task.done ? 'checked' : ''}`}>{task.done && '✓'}</div>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className={`check-text ${task.done ? 'checked' : ''}`}>{task.text}</span>
                        {task.urgent && !task.done && (
                          <span style={{
                            fontSize: '10px', padding: '1px 7px', borderRadius: '100px',
                            background: 'var(--rose-glow)', color: 'var(--rose-400)',
                            border: '1px solid rgba(251,113,133,0.3)', fontWeight: 600, flexShrink: 0
                          }}>중요</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
