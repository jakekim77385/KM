'use client';

import { useState, useEffect } from 'react';

type PageKey = 'dashboard' | 'profile' | 'colleges' | 'timeline' | 'essays' | 'tracker' | 'financial';

interface Props {
  onNavigate: (page: PageKey) => void;
}

const monthlyTasks = [
  { month: '2026년 4월', tasks: ['AP 시험 최종 준비 (5월 시험)', 'Common App 계정 만들기', '대학 리서치 심화 (Top 20)'] },
  { month: '2026년 5월', tasks: ['AP 시험 응시 (Calculus BC, Physics 1, Chemistry, English)', '여름 활동 계획 확정', '추천서 선생님께 미리 요청'] },
  { month: '2026년 6월', tasks: ['Common App 에세이 초안 시작', '대학 캠퍼스 투어 계획', 'EC 활동 정리 & 문서화', '여름 프로그램 참가 시작'] },
  { month: '2026년 7월~8월', tasks: ['에세이 집중 작성 & 수정', '캠퍼스 방문 (희망 대학)', '봉사활동 & 여름 프로그램', 'Common App 활동란 입력'] },
  { month: '2026년 9월', tasks: ['12학년 시작', 'EA/ED 대학 최종 선택', '에세이 최종 수정', '추천서 제출 요청 확인'] },
  { month: '2026년 10월', tasks: ['SAT 마지막 응시 기회', '에세이 최종 완성', 'EA/ED 원서 세부 점검'] },
  { month: '2026년 11월', tasks: ['🔥 EA/ED 마감 (11월 1일~15일)', 'Supplemental Essays 마무리', 'RD 지원 대학 최종 리스트 확정'] },
  { month: '2027년 1월', tasks: ['🔥 RD 지원 마감 (1월 1일)', '장학금 원서 제출', 'CSS Profile 제출 완료'] },
];

const upcomingDeadlines = [
  { label: 'EA / ED 마감', date: '2026-11-01', daysKey: 'ea', color: 'var(--rose-600)', icon: '🔥' },
  { label: 'RD 마감 (일반)', date: '2027-01-01', daysKey: 'rd', color: 'var(--blue-600)', icon: '📋' },
  { label: 'SAT 마지막 기회', date: '2026-10-04', daysKey: 'sat', color: 'var(--amber-600)', icon: '📝' },
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
      <div className="card animate-in" style={{
        marginBottom: '24px',
        background: 'linear-gradient(135deg, #38BDF8 0%, #818CF8 40%, #C084FC 100%)',
        border: 'none',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(56, 189, 248, 0.35)'
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-60px', right: '-30px',
          width: '200px', height: '200px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.12)',
          pointerEvents: 'none'
        }}/>
        <div style={{
          position: 'absolute', bottom: '-40px', right: '80px',
          width: '120px', height: '120px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
          pointerEvents: 'none'
        }}/>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{
              fontSize: '12px', color: 'rgba(255,255,255,0.85)', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px'
            }}>✦ Welcome Back ✦</div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.5px', textShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              안녕, 꾸미야! 👋
            </div>
            <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)', marginTop: '6px', fontWeight: 500 }}>
              오늘도 꿈을 향해 한 걸음씩! 너는 충분히 해낼 수 있어 💪
            </div>
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.25)', color: '#FFF', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '100px', backdropFilter: 'blur(8px)' }}>Balboa Academy 11th</span>
              <span style={{ background: 'rgba(255,255,255,0.25)', color: '#FFF', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '100px', backdropFilter: 'blur(8px)' }}>Panama 🇵🇦</span>
              <span style={{ background: 'rgba(255,255,255,0.25)', color: '#FFF', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '100px', backdropFilter: 'blur(8px)' }}>Class of 2027</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.22)',
              backdropFilter: 'blur(12px)',
              borderRadius: '16px',
              padding: '20px 24px',
              minWidth: '120px',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>
              <div style={{ fontSize: '40px', fontWeight: 900, color: '#FFFFFF', lineHeight: 1, letterSpacing: '-2px' }}>
                {days.ea ?? '...'}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.85)', marginTop: '6px' }}>EA 마감까지</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#FFFFFF', marginTop: '4px' }}>2026. 11. 1</div>
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
                background: i === 0 ? 'rgba(244, 63, 94, 0.06)' : i === 1 ? 'rgba(59, 130, 246, 0.06)' : 'rgba(245, 158, 11, 0.06)',
                borderRadius: '10px',
                border: `1px solid ${i === 0 ? 'rgba(244,63,94,0.18)' : i === 1 ? 'rgba(59,130,246,0.18)' : 'rgba(245,158,11,0.18)'}`
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
            { icon: '🧮', title: 'SAT 수학 만점', desc: '800점 满점 달성 — STEM 역량 최상위 증명', bg: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', border: '#FCD34D', titleColor: '#92400E' },
            { icon: '📚', title: 'GPA 4.0 만점', desc: '모든 과목 A학점 — 학업 우수성 완벽 증명', bg: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)', border: '#6EE7B7', titleColor: '#065F46' },
            { icon: '🎹', title: '전국 피아노 1위', desc: '2024 파나마 청소년 피아노 대회 우승', bg: 'linear-gradient(135deg, #EDE9FE, #DDD6FE)', border: '#C4B5FD', titleColor: '#5B21B6' },
            { icon: '👩‍⚕️', title: '의료 쉐도잉 50h', desc: '파나마 공립병원 — 스페인어로만 소통', bg: 'linear-gradient(135deg, #DBEAFE, #BFDBFE)', border: '#93C5FD', titleColor: '#1E40AF' },
            { icon: '🌍', title: '3개 국어 구사', desc: '한국어, 영어, 스페인어 — 국제적 역량', bg: 'linear-gradient(135deg, #FEE2E2, #FECACA)', border: '#FCA5A5', titleColor: '#991B1B' },
            { icon: '🤝', title: '리더십 다수', desc: '학생회, 수학동아리 부회장, STEM 리더', bg: 'linear-gradient(135deg, #CFFAFE, #A5F3FC)', border: '#67E8F9', titleColor: '#155E75' },
          ].map((item, i) => (
            <div key={i} style={{
              padding: '16px',
              background: item.bg,
              borderRadius: '12px',
              border: `1px solid ${item.border}`,
              transition: 'all 0.2s ease'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: item.titleColor, marginBottom: '4px' }}>{item.title}</div>
              <div style={{ fontSize: '12px', color: '#374151', lineHeight: 1.5 }}>{item.desc}</div>
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
