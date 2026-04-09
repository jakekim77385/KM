'use client';

import { useState } from 'react';

const apCourses = [
  { grades: '9학년', courses: ['PreAP English 1', 'Algebra 2 Honors', 'Biology Honors', 'AP Human Geography', 'Spanish 3', 'Art', 'PE'] },
  { grades: '10학년', courses: ['PreAP English 2', 'AP Pre-Calculus', 'Advanced Physics', 'AP World History', 'Spanish 4', 'Art 2', 'PE'] },
  { grades: '11학년', courses: ['AP English Language', 'AP Calculus BC', 'AP Physics 1', 'AP Chemistry', 'Panama Civics & History', 'Spanish 5'] },
];

const apScores = [
  {
    year: '2024년 5월',
    note: '9학년',
    exams: [
      { subject: 'AP Human Geography', score: 5 },
    ],
  },
  {
    year: '2025년 5월',
    note: '10학년',
    exams: [
      { subject: 'AP Pre-Calculus', score: 5 },
      { subject: 'AP Calculus AB', score: 4 },
      { subject: 'AP World History: Modern', score: 4 },
    ],
  },
  {
    year: '2026년 5월',
    note: '11학년 — 응시 예정',
    exams: [
      { subject: 'AP Chemistry', score: null },
      { subject: 'AP Physics 1', score: null },
      { subject: 'AP English Language', score: null },
      { subject: 'AP Calculus BC', score: null },
    ],
  },
];

const activities = [
  {
    icon: '🔢', name: 'The Mathletic Society', role: '부회장 (Vice President)',
    desc: '수학 튜터링 프로그램(Math Buddies) 운영, 3학년 대상 수학올림피아드 조직',
    type: '클럽', typeColor: 'blue'
  },
  {
    icon: '🏫', name: 'DRACO (학생회)', role: '임원',
    desc: '40개 이상 클럽 관리, 학교 캘린더 기획, 모금 활동 총괄',
    type: '리더십', typeColor: 'gold'
  },
  {
    icon: '🔬', name: 'STEM Outreach', role: '리더 (Leader)',
    desc: '저소득층 학생들을 초청해 화학·생물·물리 실험실 체험 기회 제공',
    type: '봉사/리더십', typeColor: 'green'
  },
  {
    icon: '🧠', name: 'Battle of the Geniuses', role: '주최자 & 리더',
    desc: '학교 간 학문 퀴즈 대회 기획 및 진행 — 리더십 + 기획력 증명',
    type: '리더십', typeColor: 'purple'
  },
];

const volunteer = [
  { icon: '🏥', name: 'Casita de Mausi', hours: '30h+', desc: '암 환자 저소득층 호스피스 자원봉사' },
  { icon: '📚', name: '초등학교 도서관', hours: '40h', desc: '도서 정리 및 시스템 운영 (여름방학)' },
  { icon: '🇺🇸', name: '메모리얼 데이', hours: '참여', desc: '코로잘 미국인 공동묘지 국기 게양식' },
  { icon: '👩‍⚕️', name: '의료 쉐도잉', hours: '50h', desc: '파나마 공립병원 — 스페인어 전용 소통' },
];

const awards = [
  { icon: '🎹', title: '파나마 청소년 피아노 대회', result: '전국 1위', year: '2024', detail: '클래식 피아노 — 전국 규모 대회 우승' },
];

const languages = [
  { lang: '한국어', level: '원어민', flag: '🇰🇷', percent: 100 },
  { lang: '영어', level: '원어민급 (국제학교)', flag: '🇺🇸', percent: 98 },
  { lang: '스페인어', level: '고급 (병원 의사소통 가능)', flag: '🇵🇦', percent: 82 },
];

type ContactInfo = {
  name: string;
  email: string;
  phone: string;
};

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'academic' | 'activities' | 'awards'>('academic');

  return (
    <div>
      {/* Profile Header */}
      <div className="card card-gold animate-in" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--gold-400), var(--gold-600))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', fontWeight: 800, color: 'var(--navy-900)',
            boxShadow: '0 0 40px rgba(212,175,55,0.4)', flexShrink: 0
          }}>
            꾸
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <span style={{ fontSize: '26px', fontWeight: 900, color: 'var(--text-primary)' }}>Kim Jiyun (김지윤)</span>
              <span className="badge badge-gold">꾸미</span>
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
              Balboa Academy, Panama 🇵🇦 · 11학년 · 2008년 5월 3일생
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-blue">Class of 2027</span>
              <span className="badge badge-green">GPA 4.0/4.0</span>
              <span className="badge badge-gold">SAT 1570</span>
              <span className="badge badge-purple">Math 800 만점</span>
              <span className="badge badge-rose">3개 국어</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {[
              { label: 'SAT', value: '1570', sub: '/1600' },
              { label: 'GPA', value: '4.0', sub: 'UW' },
              { label: 'AP', value: '6', sub: '과목' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--gold-400)', letterSpacing: '-1px' }}>
                  {s.value}<span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>{s.sub}</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '4px' }}>
        {[
          { key: 'academic', label: '📚 학업 성적' },
          { key: 'activities', label: '🏆 활동 & 봉사' },
          { key: 'awards', label: '⭐ 수상 & 특기' },
        ].map(tab => (
          <button
            key={tab.key}
            id={`profile-tab-${tab.key}`}
            className={`btn ${activeTab === tab.key ? 'btn-primary' : 'btn-ghost'}`}
            style={{ flex: 1, justifyContent: 'center', fontSize: '13px' }}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Academic Tab */}
      {activeTab === 'academic' && (
        <div className="animate-in">
          <div className="grid-2" style={{ marginBottom: '20px' }}>
            {/* Test Scores */}
            <div className="card">
              <div className="card-title" style={{ marginBottom: '20px' }}>📊 시험 점수</div>

              {/* SAT */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(212,175,55,0.1), transparent)',
                border: '1px solid rgba(212,175,55,0.2)',
                borderRadius: '10px', padding: '16px', marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>SAT</div>
                  <span className="badge badge-gold">2025년 10월 4일</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '40px', fontWeight: 900, color: 'var(--gold-400)', letterSpacing: '-2px' }}>1570</span>
                  <span style={{ fontSize: '16px', color: 'var(--text-muted)' }}>/1600</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '10px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--blue-400)' }}>770</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Reading & Writing</div>
                    <div style={{ marginTop: '6px' }}>
                      <div className="progress-bar-wrap"><div className="progress-bar blue" style={{ width: '96%' }}></div></div>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '10px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--green-400)' }}>800 🔥</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Math (만점!)</div>
                    <div style={{ marginTop: '6px' }}>
                      <div className="progress-bar-wrap"><div className="progress-bar green" style={{ width: '100%' }}></div></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* GPA */}
              <div style={{
                background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)',
                borderRadius: '10px', padding: '16px', marginBottom: '16px'
              }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>GPA (Unweighted)</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '40px', fontWeight: 900, color: 'var(--purple-400)', letterSpacing: '-2px' }}>4.0</span>
                  <span style={{ fontSize: '16px', color: 'var(--text-muted)' }}>/4.0 — 모든 과목 A학점!</span>
                </div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar" style={{ width: '100%', background: 'linear-gradient(90deg, var(--purple-400), #C4B5FD)' }}></div>
                </div>
              </div>

              {/* PSAT */}
              <div style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px', padding: '14px'
              }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>PSAT/NMSQT</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>2025년 10월 15일 응시 · 결과 확인 중</div>
              </div>
            </div>

            {/* Languages */}
            <div className="card">
              <div className="card-title" style={{ marginBottom: '16px' }}>🌍 언어 능력</div>
              {languages.map((lang, i) => (
                <div key={i} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>{lang.flag}</span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{lang.lang}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--gold-400)', fontWeight: 500 }}>{lang.level}</span>
                  </div>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar" style={{ width: `${lang.percent}%` }}></div>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{lang.level}</div>
                </div>
              ))}

              <div className="divider"></div>
              <div className="card-title" style={{ marginBottom: '12px' }}>📬 연락처</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { label: '📧 이메일', value: 'jiyunkimm0503@gmail.com' },
                ].map((item, i) => (
                  <div key={i} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>{item.label}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Courses by Grade */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: '16px' }}>📖 학년별 수강 과목</div>
            <div className="grid-3" style={{ gap: '12px' }}>
              {apCourses.map((grade, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '10px', padding: '14px'
                }}>
                  <div style={{
                    fontSize: '12px', fontWeight: 700, color: 'var(--gold-400)',
                    textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px'
                  }}>{grade.grades}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {grade.courses.map((course, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                          width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
                          background: course.startsWith('AP') ? 'var(--gold-400)' : 'var(--text-muted)'
                        }}></span>
                        <span style={{
                          fontSize: '12.5px',
                          color: course.startsWith('AP') ? 'var(--text-primary)' : 'var(--text-secondary)',
                          fontWeight: course.startsWith('AP') ? 600 : 400
                        }}>{course}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AP 시험 성적 */}
      {activeTab === 'academic' && (
        <div className="card" style={{ marginTop: '20px' }}>
          <div className="card-title" style={{ marginBottom: '16px' }}>🏅 AP 시험 성적</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {apScores.map((group, gi) => (
              <div key={gi} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px', padding: '16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--gold-400)' }}>{group.year}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '100px' }}>{group.note}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {group.exams.map((exam, ei) => {
                    const scoreColor = exam.score === 5 ? '#22C55E' : exam.score === 4 ? '#3B82F6' : exam.score === 3 ? '#F59E0B' : '#6B7280';
                    const scoreBg = exam.score === 5 ? 'rgba(34,197,94,0.12)' : exam.score === 4 ? 'rgba(59,130,246,0.12)' : exam.score === 3 ? 'rgba(245,158,11,0.12)' : 'rgba(107,114,128,0.08)';
                    return (
                      <div key={ei} style={{
                        background: scoreBg, border: `1px solid ${scoreColor}33`,
                        borderRadius: '10px', padding: '10px 14px',
                        display: 'flex', alignItems: 'center', gap: '10px',
                      }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{exam.subject}</span>
                        <span style={{ fontSize: '20px', fontWeight: 900, color: scoreColor }}>{exam.score ?? '—'}</span>
                        {exam.score === 5 && <span style={{ fontSize: '13px' }}>⭐</span>}
                        {exam.score === null && <span style={{ fontSize: '10px', color: '#6B7280' }}>응시 예정</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activities Tab */}
      {activeTab === 'activities' && (
        <div className="animate-in">
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-title" style={{ marginBottom: '16px' }}>🏆 과외 활동 (Extracurricular)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activities.map((act, i) => (
                <div key={i} style={{
                  padding: '16px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '10px',
                  display: 'flex', gap: '14px', alignItems: 'flex-start'
                }}>
                  <span style={{ fontSize: '28px', flexShrink: 0 }}>{act.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{act.name}</span>
                      <span className={`badge badge-${act.typeColor}`}>{act.type}</span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--gold-400)', marginBottom: '4px' }}>{act.role}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{act.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: '16px' }}>🤝 봉사 활동 (Volunteer)</div>
            <div className="grid-2" style={{ gap: '12px' }}>
              {volunteer.map((vol, i) => (
                <div key={i} style={{
                  padding: '14px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '22px' }}>{vol.icon}</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{vol.name}</div>
                      <span className="badge badge-green" style={{ marginTop: '2px' }}>{vol.hours}</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '6px' }}>{vol.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Awards Tab */}
      {activeTab === 'awards' && (
        <div className="animate-in">
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="card-title" style={{ marginBottom: '16px' }}>🏅 수상 경력</div>
            {awards.map((award, i) => (
              <div key={i} style={{
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(212,175,55,0.03))',
                border: '1px solid rgba(212,175,55,0.25)',
                borderRadius: '12px',
                display: 'flex', gap: '16px', alignItems: 'center'
              }}>
                <span style={{ fontSize: '48px' }}>{award.icon}</span>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--gold-400)', marginBottom: '4px' }}>{award.result}</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>{award.title}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{award.detail}</div>
                  <span className="badge badge-gold" style={{ marginTop: '8px' }}>🗓️ {award.year}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: '16px' }}>💡 입시 전략 메모</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                '🎹 피아노 전국 1위 → 예술적 재능과 장기간 헌신 증명 (10+ 년 수련)',
                '👩‍⚕️ 의료 쉐도잉 50시간 → Pre-Med 관심 입증 — 에세이 소재로 강력',
                '🌍 국제 경험 → 한국인 + 파나마 거주 + 3개 국어 = 진정한 글로벌 인재',
                '🔬 STEM + 인문 균형 → Math 800 + 역사 + 영어 → 올라운드 강점',
                '🤝 봉사 120h+ → 단순 참여가 아닌 리더십 + 기여 → 스토리 중심 어필',
              ].map((tip, i) => (
                <div key={i} style={{
                  padding: '12px 14px',
                  background: 'rgba(255,255,255,0.03)',
                  borderLeft: '3px solid var(--gold-400)',
                  borderRadius: '0 8px 8px 0',
                  fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6
                }}>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
