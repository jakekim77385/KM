'use client';

import { useState, useEffect } from 'react';

type PageKey = 'dashboard' | 'profile' | 'colleges' | 'timeline' | 'essays' | 'tracker' | 'financial';

interface Props {
  onNavigate: (page: PageKey) => void;
}

const monthlyTasks = [
  { month: '2026년 4월', tasks: ['AP 시험 최종 준비 (5월 시험)', 'Common App 계정 만들기', '대학 리서치 심화 (Top 20)', 'SAT 재응시 불필요 (1570·수학800 만점) — 에세이 시작!'] },
  { month: '2026년 5월', tasks: ['AP 시험 응시 (Calculus BC, Physics 1, Chemistry, English)', '여름 활동 계획 확정', '추천서 선생님께 미리 요청'] },
  { month: '2026년 6월', tasks: ['Common App 에세이 초안 시작', '대학 캠퍼스 투어 계획', 'EC 활동 정리 & 문서화', '여름 프로그램 참가 시작'] },
  { month: '2026년 7월~8월', tasks: ['에세이 집중 작성 & 수정', '캠퍼스 방문 (희망 대학)', '봉사활동 & 여름 프로그램', 'Common App 활동란 입력'] },
  { month: '2026년 9월', tasks: ['12학년 시작', 'EA/ED 대학 최종 선택', '에세이 최종 수정', '추천서 제출 요청 확인'] },
  { month: '2026년 10월', tasks: ['SAT 마지막 응시 기회', '에세이 최종 완성', 'EA/ED 원서 세부 점검'] },
  { month: '2026년 11월', tasks: ['🔥 EA/ED 마감 (11월 1일~15일)', 'Supplemental Essays 마무리', 'RD 지원 대학 최종 리스트 확정'] },
  { month: '2027년 1월', tasks: ['🔥 RD 지원 마감 (1월 1일)', '장학금 원서 제출', 'CSS Profile 제출 완료'] },
];

const upcomingDeadlines = [
  { label: 'EA / ED 마감', date: '2026-11-01', daysKey: 'ea', color: 'var(--rose-400)', icon: '🔥' },
  { label: 'RD 마감 (일반)', date: '2027-01-01', daysKey: 'rd', color: 'var(--blue-400)', icon: '📋' },
  { label: 'SAT 마지막 기회', date: '2026-10-04', daysKey: 'sat', color: 'var(--amber-400)', icon: '📝' },
];

const quickStats = [
  { icon: '📊', label: 'SAT 점수', value: '1570', sub: '/ 1600', color: 'gold', trend: '상위 1%! 🎉' },
  { icon: '🧮', label: 'SAT 수학', value: '800', sub: '만점', color: 'green', trend: '완벽한 점수! 🔥' },
  { icon: '📚', label: 'GPA', value: '4.0', sub: '/ 4.0', color: 'purple', trend: '언웨이티드 만점' },
  { icon: '📝', label: 'AP 과목', value: '6', sub: '개 수강', color: 'blue', trend: 'BC Calc 포함' },
];

export default function Dashboard({ onNavigate }: Props) {
  const [days, setDays] = useState<Record<string, number>>({});
  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('kkumi-checked-tasks');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    }
    return new Set();
  });

  useEffect(() => {
    const now = new Date();
    const result: Record<string, number> = {};
    upcomingDeadlines.forEach(d => {
      result[d.daysKey] = Math.ceil((new Date(d.date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    });
    setDays(result);
  }, []);

  const toggleTask = (key: string) => {
    setCheckedTasks(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      if (typeof window !== 'undefined') {
        localStorage.setItem('kkumi-checked-tasks', JSON.stringify([...next]));
      }
      return next;
    });
  };

  const currentMonth = monthlyTasks[0]; // April 2026

  return (
    <div>
      {/* Welcome Banner */}
      <div className="card card-gold animate-in" style={{
        marginBottom: '24px',
        background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(13,20,38,0.9) 60%)',
        borderColor: 'rgba(212,175,55,0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          fontSize: '120px', opacity: 0.04, userSelect: 'none', lineHeight: 1
        }}>🎓</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{
              fontSize: '13px', color: 'var(--gold-400)', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px'
            }}>Welcome Back</div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
              안녕, 꾸미야! 👋
            </div>
            <div style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '6px' }}>
              오늘도 꿈을 향해 한 걸음씩! 너는 충분히 해낼 수 있어 💪
            </div>
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-gold">Balboa Academy 11th</span>
              <span className="badge badge-green">Panama 🇵🇦</span>
              <span className="badge badge-purple">Class of 2027</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="dday-card" style={{ minWidth: '120px', padding: '16px' }}>
              <div className="dday-number" style={{ fontSize: '40px' }}>
                {days.ea ?? '...'}
              </div>
              <div className="dday-label">EA 마감까지</div>
              <div className="dday-description" style={{ fontSize: '12px' }}>2026. 11. 1</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid animate-in animate-in-delay-1" style={{ marginBottom: '24px' }}>
        {quickStats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>
            <div>
              <div className="stat-value">
                {stat.value}<span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>{stat.sub}</span>
              </div>
              <div className="stat-label">{stat.label}</div>
              <div className={`stat-trend ${stat.color === 'gold' || stat.color === 'green' ? stat.color : 'up'}`}
                style={{ color: stat.color === 'purple' ? 'var(--purple-400)' : stat.color === 'blue' ? 'var(--blue-400)' : undefined }}>
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2 animate-in animate-in-delay-2" style={{ marginBottom: '24px' }}>
        {/* D-Day Countdown */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">⏰ 주요 마감일</div>
              <div className="card-subtitle">놓치면 안 되는 일정들</div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {upcomingDeadlines.map((d, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 14px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '10px',
                border: `1px solid rgba(255,255,255,0.06)`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>{d.icon}</span>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>{d.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>{d.date}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: d.color, letterSpacing: '-0.5px' }}>
                    D-{days[d.daysKey] ?? '...'}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>days</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* This Month Tasks */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">📋 이번 달 할 일</div>
              <div className="card-subtitle">{currentMonth.month}</div>
            </div>
            <span className="badge badge-gold">{currentMonth.tasks.length}개</span>
          </div>
          <div>
            {currentMonth.tasks.map((task, i) => {
              const key = `${currentMonth.month}-${i}`;
              const checked = checkedTasks.has(key);
              return (
                <div key={i} className="checklist-item" onClick={() => toggleTask(key)} style={{ cursor: 'pointer' }}>
                  <div className={`check-box ${checked ? 'checked' : ''}`}>
                    {checked && '✓'}
                  </div>
                  <div className={`check-text ${checked ? 'checked' : ''}`}>{task}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 꾸미's Strengths */}
      <div className="card animate-in animate-in-delay-3" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div>
            <div className="card-title">⭐ 꾸미의 강점 분석</div>
            <div className="card-subtitle">입시 전략의 핵심 포인트</div>
          </div>
          <button className="btn btn-ghost" style={{ fontSize: '12px', padding: '6px 12px' }}
            onClick={() => onNavigate('profile')}>
            프로필 보기 →
          </button>
        </div>
        <div className="grid-3" style={{ gap: '12px' }}>
          {[
            { icon: '🧮', title: 'SAT 수학 만점', desc: '800점 满점 달성 — STEM 역량 최상위 증명', color: 'var(--gold-400)' },
            { icon: '📚', title: 'GPA 4.0 만점', desc: '모든 과목 A학점 — 학업 우수성 완벽 증명', color: 'var(--green-400)' },
            { icon: '🎹', title: '전국 피아노 1위', desc: '2024 파나마 청소년 피아노 대회 우승', color: 'var(--purple-400)' },
            { icon: '👩‍⚕️', title: '의료 쉐도잉 50h', desc: '파나마 공립병원 — 스페인어로만 소통', color: 'var(--blue-400)' },
            { icon: '🌍', title: '3개 국어 구사', desc: '한국어, 영어, 스페인어 — 국제적 역량', color: 'var(--amber-400)' },
            { icon: '🤝', title: '리더십 다수', desc: '학생회, 수학동아리 부회장, STEM 리더', color: 'var(--rose-400)' },
          ].map((item, i) => (
            <div key={i} style={{
              padding: '14px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '10px',
              border: `1px solid rgba(255,255,255,0.06)`,
              transition: 'all 0.2s ease'
            }}>
              <div style={{ fontSize: '22px', marginBottom: '8px' }}>{item.icon}</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: item.color, marginBottom: '4px' }}>{item.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="card animate-in animate-in-delay-4">
        <div className="card-title" style={{ marginBottom: '16px' }}>🚀 빠른 메뉴</div>
        <div className="grid-4" style={{ gap: '10px' }}>
          {[
            { icon: '🏛️', label: '대학 리스트', page: 'colleges' as PageKey },
            { icon: '📅', label: '타임라인', page: 'timeline' as PageKey },
            { icon: '✍️', label: '에세이', page: 'essays' as PageKey },
            { icon: '📊', label: '지원 현황', page: 'tracker' as PageKey },
          ].map((item, i) => (
            <button key={i}
              className="btn btn-ghost"
              style={{ flexDirection: 'column', padding: '16px 12px', gap: '8px', height: 'auto' }}
              onClick={() => onNavigate(item.page)}
              id={`quick-nav-${item.page}`}>
              <span style={{ fontSize: '24px' }}>{item.icon}</span>
              <span style={{ fontSize: '12px' }}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
