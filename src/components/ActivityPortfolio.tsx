'use client';

import { useState, useEffect } from 'react';

// ═══════════════════════════════════════════════
//  Types
// ═══════════════════════════════════════════════
type MilestoneStatus = 'done' | 'active' | 'planned';

interface Milestone {
  id: string;
  text: string;
  status: MilestoneStatus;
  date?: string;
  note?: string;
}

interface Project {
  id: string;
  name: string;
  org: string;
  orgType: string;
  emoji: string;
  accentColor: string;
  bgGradient: string;
  description: string;
  essayAngle: string;
  impact: { label: string; value: string; icon: string }[];
  milestones: Milestone[];
}

interface Competition {
  id: string;
  name: string;
  host: string;
  emoji: string;
  date: string;
  status: 'upcoming' | 'preparing' | 'completed';
  prepPercent: number;
  result?: string;
  notes: string;
}

interface PreMedLog {
  date: string;
  hours: number;
  note: string;
}

interface PreMedActivity {
  id: string;
  type: string;
  emoji: string;
  org: string;
  supervisor?: string;
  hours: number;
  targetHours: number;
  status: 'active' | 'planned' | 'completed';
  description: string;
  logs: PreMedLog[];
}

// ═══════════════════════════════════════════════
//  Data
// ═══════════════════════════════════════════════
const projects: Project[] = [
  {
    id: 'latidos',
    name: 'Project Latidos',
    org: 'Latidos',
    orgType: '🏥 심장병 아동 지원 NGO',
    emoji: '🫀',
    accentColor: '#EF4444',
    bgGradient: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(220,38,38,0.03))',
    description:
      '파나마 심장병 아동들의 건강 관리를 지원하는 NGO와 협력. 접종 추적 앱을 개발하여 파나마 보건복지부(MINSA)에 제출하고, 파나마 NGO 네트워크 전체로 배포하는 것을 목표로 한다.',
    essayAngle:
      '파나마 심장병 아동과의 만남이 Pre-Med 진로를 확신하게 만들었고, 기술(앱)이 의료 격차를 해소할 수 있음을 직접 증명하는 과정 — Yale Global Health / Pre-Med + Tech for Good',
    impact: [
      { label: '봉사 시간', value: '30h+', icon: '⏱️' },
      { label: '파트너', value: 'Latidos NGO', icon: '🤝' },
      { label: '앱 목표', value: '파나마 전역', icon: '🌎' },
    ],
    milestones: [
      { id: 'l1', text: 'Latidos 봉사 활동 시작', status: 'done', date: '2024' },
      { id: 'l2', text: '단체 관계 구축 및 심장병 아동 실태 파악', status: 'done', date: '2024' },
      { id: 'l3', text: '접종예방 앱 기획서 작성', status: 'active', note: '진행 중' },
      { id: 'l4', text: 'Latidos 공식 미팅 및 제안서 제출', status: 'planned', date: '2026년 5~6월' },
      { id: 'l5', text: '앱 프로토타입 개발 시작', status: 'planned', date: '2026년 여름' },
      { id: 'l6', text: '파나마 MINSA(보건복지부) 공식 접촉', status: 'planned', date: '2026년 하반기' },
      { id: 'l7', text: '파나마 NGO 네트워크 배포 계획 수립', status: 'planned', date: '2026' },
    ],
  },
  {
    id: 'gabriel',
    name: 'Project Gabriel',
    org: 'Gabriel School',
    orgType: '🏫 파나마 공립학교 (저소득층)',
    emoji: '📐',
    accentColor: '#3B82F6',
    bgGradient: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(37,99,235,0.03))',
    description:
      '파나마 공립학교 저소득층 학생들을 위해 온라인 영어 봉사를 진행하고, 개발 중인 수학 학습 플랫폼을 실제 교육 현장에 적용하여 파나마 교육부(Meduca)에 제출하고 NGO 네트워크로 배포하는 것을 목표로 한다.',
    essayAngle:
      '언어 장벽과 경제적 불평등이 교육 격차를 만드는 현실을 직접 목격하고, 기술(플랫폼)로 이를 해소하겠다는 결심 — 사회혁신 + 교육 공정성 + 실질적 임팩트',
    impact: [
      { label: '영어 봉사', value: '40h+', icon: '📚' },
      { label: '파트너', value: 'Gabriel 학교', icon: '🏫' },
      { label: '플랫폼', value: '초안 완성', icon: '💻' },
    ],
    milestones: [
      { id: 'g1', text: 'Gabriel 학교 온라인 영어 봉사 시작', status: 'done', date: '2024' },
      { id: 'g2', text: '저소득층 학생 수학 교육 격차 파악', status: 'done', date: '2024' },
      { id: 'g3', text: '수학 학습 플랫폼 초안 완성', status: 'done', date: '2026년 4월' },
      { id: 'g4', text: 'Latidos & Gabriel 시범 소개', status: 'active', date: '2026년 5월 예정' },
      { id: 'g5', text: 'Gabriel 학교 실제 수업 적용 시작', status: 'planned', date: '2026년 6~7월' },
      { id: 'g6', text: '플랫폼 피드백 반영 및 개선', status: 'planned', date: '2026년 여름' },
      { id: 'g7', text: 'Meduca(교육부) 공식 제안서 제출', status: 'planned', date: '2026년 하반기' },
      { id: 'g8', text: '파나마 NGO 네트워크 배포', status: 'planned', date: '2026' },
    ],
  },
];

const competitions: Competition[] = [
  {
    id: 'dele',
    name: 'DELE B2 — 스페인어 공인시험',
    host: 'Instituto Cervantes (스페인 문화원)',
    emoji: '🇪🇸',
    date: '2026년 5월 23일 (토)',
    status: 'preparing',
    prepPercent: 65,
    notes: '✅ 접수 완료 (4월 8일 마감). DELE B2 = 유럽언어기준 중상급 — 스페인어로 의사소통 가능한 수준 공식 인증. 파나마 공립병원 스페인어 쉐도잉 + Gabriel 학교 봉사와 직결. 3개 국어 역량을 공식 자격증으로 증명.',
  },
  {
    id: 'math',
    name: 'OPM 파나마 수학경시대회',
    host: '파나마 교육부(Meduca) 주관',
    emoji: '🔢',
    date: '1차 4/13 (월) · 2차 5/18 (월)',
    status: 'preparing',
    prepPercent: 55,
    notes: 'Mathletic Society 수학 튜터링 활동과 연계하여 준비 중. 1차 4월 13일, 2차 5월 18일 — 파나마 전국 규모 OPM. 입상 시 입시 강점 확보.',
  },
  {
    id: 'chem13',
    name: 'Chem 13 News Exam',
    host: 'University of Waterloo (캐나다)',
    emoji: '⚗️',
    date: '시험 5/7 (목) · 접수마감 4/24 (금)',
    status: 'preparing',
    prepPercent: 30,
    notes: 'AP Chemistry와 연계하여 준비 중. ⚠️ 접수는 화학 선생님을 통해서만 가능 (개인 접수 불가) — 4/24 마감 전에 선생님께 요청 필수!',
  },
];

const preMedActivities: PreMedActivity[] = [
  {
    id: 'shadowing',
    type: '닥터 쉐도잉',
    emoji: '👩‍⚕️',
    org: '파나마 공립병원',
    hours: 50,
    targetHours: 100,
    status: 'active',
    description: '파나마 공립병원에서 의사 쉐도잉. 스페인어 전용 의사소통 환경. 심장과·내과·소아과 중심.',
    logs: [
      { date: '2024-09', hours: 10, note: '내과 외래 쉐도잉 — 스페인어 환자 소통 관찰' },
      { date: '2024-10', hours: 12, note: '응급실 관찰 — 심장 관련 케이스 다수' },
      { date: '2024-11', hours: 15, note: '심장과 전문의 쉐도잉 집중' },
      { date: '2025-01', hours: 8, note: '소아과 — Latidos 연계 심장병 아동 케이스 관찰' },
      { date: '2025-03', hours: 5, note: '예방의학 클리닉 방문' },
    ],
  },
  {
    id: 'research',
    type: '리서치',
    emoji: '🔬',
    org: '미정 (준비 중)',
    hours: 0,
    targetHours: 80,
    status: 'planned',
    description: '대학교수 또는 병원 연구팀 연계 리서치 기회 탐색 중. 접종예방 앱 또는 심장병 관련 주제 목표.',
    logs: [],
  },
  {
    id: 'intern',
    type: '병원 인턴',
    emoji: '🏥',
    org: '미정 (2025년 여름 목표)',
    hours: 0,
    targetHours: 120,
    status: 'planned',
    description: '2025년 여름방학 병원 인턴십 기회 확보 목표. Latidos 연계 또는 파나마 사립병원 대상으로 준비 중.',
    logs: [],
  },
];

// ═══════════════════════════════════════════════
//  Sub-components
// ═══════════════════════════════════════════════

/** 마일스톤 리스트 */
function MilestoneList({
  milestones,
  checked,
  onToggle,
}: {
  milestones: Milestone[];
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  const dotColor = (s: MilestoneStatus) =>
    s === 'done' ? '#22C55E' : s === 'active' ? '#F59E0B' : '#374151';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '14px' }}>
      {milestones.map((m) => {
        const isDone = m.status === 'done' || checked[m.id];
        return (
          <div
            key={m.id}
            onClick={() => m.status !== 'done' && onToggle(m.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '7px 10px', borderRadius: '8px',
              background: isDone ? 'rgba(34,197,94,0.06)' : m.status === 'active' ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${isDone ? 'rgba(34,197,94,0.2)' : m.status === 'active' ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.05)'}`,
              cursor: m.status !== 'done' ? 'pointer' : 'default',
              transition: 'all 0.15s',
            }}
          >
            {/* 상태 표시 */}
            <div style={{
              width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
              border: `2px solid ${dotColor(m.status)}`,
              background: isDone ? dotColor(m.status) : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {isDone && <span style={{ fontSize: '10px', color: '#fff', fontWeight: 800 }}>✓</span>}
              {m.status === 'active' && !isDone && (
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B' }} />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '12.5px', fontWeight: m.status === 'active' ? 700 : 500,
                color: isDone ? 'var(--text-muted)' : m.status === 'active' ? 'var(--text-primary)' : 'var(--text-secondary)',
                textDecoration: isDone && m.status !== 'done' ? 'line-through' : 'none',
              }}>
                {m.text}
                {m.status === 'active' && <span style={{ marginLeft: '6px', fontSize: '10px', color: '#F59E0B', fontWeight: 700 }}>● 진행 중</span>}
              </div>
              {(m.date || m.note) && (
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>
                  {m.date && `📅 ${m.date}`}{m.note && ` — ${m.note}`}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Heartitude 프로젝트 카드 */
function ProjectCard({
  project,
  checked,
  onToggle,
}: {
  project: Project;
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  const doneCount = project.milestones.filter(
    (m) => m.status === 'done' || checked[m.id]
  ).length;
  const progress = Math.round((doneCount / project.milestones.length) * 100);

  return (
    <div style={{
      background: project.bgGradient,
      border: `1.5px solid ${project.accentColor}33`,
      borderRadius: '14px', padding: '20px',
      display: 'flex', flexDirection: 'column', gap: '12px',
    }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '22px' }}>{project.emoji}</span>
            <span style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-primary)' }}>{project.name}</span>
          </div>
          <div style={{ fontSize: '12px', color: project.accentColor, fontWeight: 600 }}>{project.orgType}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '22px', fontWeight: 900, color: project.accentColor }}>{progress}%</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{doneCount}/{project.milestones.length} 완료</div>
        </div>
      </div>

      {/* 진행 바 */}
      <div style={{ height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '100px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: project.accentColor, borderRadius: '100px', transition: 'width 0.4s' }} />
      </div>

      {/* 설명 */}
      <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{project.description}</p>

      {/* 임팩트 지표 */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {project.impact.map((item, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px', padding: '8px 12px', textAlign: 'center', flex: 1, minWidth: '80px',
          }}>
            <div style={{ fontSize: '14px' }}>{item.icon}</div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: project.accentColor }}>{item.value}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* 마일스톤 */}
      <div>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>
          마일스톤
        </div>
        <MilestoneList milestones={project.milestones} checked={checked} onToggle={onToggle} />
      </div>

      {/* 에세이 각도 */}
      <div style={{
        background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)',
        borderRadius: '10px', padding: '12px 14px',
      }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#D4AF37', marginBottom: '4px' }}>⭐ Yale/입시 에세이 각도</div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{project.essayAngle}</div>
      </div>
    </div>
  );
}

/** 대회 카드 */
function CompetitionCard({ comp }: { comp: Competition }) {
  const statusBadge = {
    upcoming:   { label: '예정', color: '#6B7280' },
    preparing:  { label: '준비 중', color: '#F59E0B' },
    completed:  { label: '완료', color: '#22C55E' },
  }[comp.status];

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '14px', padding: '20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '20px' }}>{comp.emoji}</span>
            <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>{comp.name}</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{comp.host}</div>
        </div>
        <span style={{
          fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '100px',
          background: `${statusBadge.color}22`, color: statusBadge.color, border: `1px solid ${statusBadge.color}44`,
        }}>{statusBadge.label}</span>
      </div>

      {/* 날짜 */}
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
        📅 {comp.date}
        {comp.result && <span style={{ marginLeft: '12px', color: '#22C55E', fontWeight: 700 }}>🏆 {comp.result}</span>}
      </div>

      {/* 준비도 */}
      {comp.status !== 'completed' && (
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            <span>준비도</span><span>{comp.prepPercent}%</span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '100px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${comp.prepPercent}%`,
              background: 'linear-gradient(90deg, #6366F1, #8B5CF6)', borderRadius: '100px',
            }} />
          </div>
        </div>
      )}

      <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>{comp.notes}</p>
    </div>
  );
}

/** Pre-Med 활동 카드 */
function PreMedCard({
  activity,
  expanded,
  onToggleExpand,
}: {
  activity: PreMedActivity;
  expanded: boolean;
  onToggleExpand: () => void;
}) {
  const pct = Math.min(Math.round((activity.hours / activity.targetHours) * 100), 100);
  const statusColor = activity.status === 'active' ? '#22C55E' : activity.status === 'planned' ? '#6B7280' : '#3B82F6';
  const statusLabel = activity.status === 'active' ? '진행 중' : activity.status === 'planned' ? '계획 중' : '완료';

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '14px', padding: '20px',
    }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>{activity.emoji}</span>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)' }}>{activity.type}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{activity.org}</div>
          </div>
        </div>
        <span style={{
          fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '100px',
          background: `${statusColor}22`, color: statusColor, border: `1px solid ${statusColor}44`,
        }}>{statusLabel}</span>
      </div>

      {/* 시간 진행 */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '5px' }}>
          <span>누적 시간</span>
          <span style={{ fontWeight: 700, color: '#22C55E' }}>{activity.hours}h <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>/ {activity.targetHours}h 목표</span></span>
        </div>
        <div style={{ height: '8px', background: 'rgba(255,255,255,0.07)', borderRadius: '100px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: activity.hours > 0 ? 'linear-gradient(90deg, #22C55E, #16A34A)' : 'rgba(255,255,255,0.1)',
            borderRadius: '100px', transition: 'width 0.4s',
          }} />
        </div>
        {activity.targetHours > 0 && activity.hours === 0 && (
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>시작 전</div>
        )}
      </div>

      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 12px 0' }}>{activity.description}</p>

      {/* 로그 */}
      {activity.logs.length > 0 && (
        <div>
          <button
            onClick={onToggleExpand}
            style={{
              background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
              color: 'var(--text-muted)', fontSize: '12px', padding: '6px 12px', cursor: 'pointer',
              width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between',
            }}
          >
            <span>📋 활동 로그 ({activity.logs.length}건)</span>
            <span>{expanded ? '▲' : '▼'}</span>
          </button>
          {expanded && (
            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {activity.logs.map((log, i) => (
                <div key={i} style={{
                  padding: '8px 12px', background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px',
                  display: 'flex', gap: '12px', alignItems: 'flex-start',
                }}>
                  <div style={{ fontSize: '11px', color: '#22C55E', fontWeight: 700, flexShrink: 0, minWidth: '52px' }}>{log.date}</div>
                  <div style={{ fontSize: '11px', color: '#22C55E', fontWeight: 700, flexShrink: 0 }}>+{log.hours}h</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{log.note}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════
//  Main Component
// ═══════════════════════════════════════════════
export default function ActivityPortfolio() {
  type TabKey = 'heartitude' | 'competitions' | 'premed';
  const [activeTab, setActiveTab] = useState<TabKey>('heartitude');
  const [checkedMilestones, setCheckedMilestones] = useState<Record<string, boolean>>({});
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  // localStorage에서 마일스톤 상태 복원
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kkumi-portfolio-milestones');
      if (saved) setCheckedMilestones(JSON.parse(saved));
    } catch (_) {}
  }, []);

  const handleToggleMilestone = (id: string) => {
    const updated = { ...checkedMilestones, [id]: !checkedMilestones[id] };
    setCheckedMilestones(updated);
    try { localStorage.setItem('kkumi-portfolio-milestones', JSON.stringify(updated)); } catch (_) {}
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'heartitude',   label: '🫀 Heartitude 프로젝트' },
    { key: 'competitions', label: '🏆 학문 대회' },
    { key: 'premed',       label: '🏥 Pre-Med 경험' },
  ];

  // 전체 완료 마일스톤 수
  const allMilestones = projects.flatMap((p) => p.milestones);
  const completedAll = allMilestones.filter((m) => m.status === 'done' || checkedMilestones[m.id]).length;
  const totalAll = allMilestones.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ── Hero Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(59,130,246,0.10), rgba(34,197,94,0.08))',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '28px' }}>🌟</span>
              <span style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-primary)' }}>Heartitude</span>
              <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '100px', background: 'rgba(34,197,94,0.15)', color: '#22C55E', fontWeight: 700, border: '1px solid rgba(34,197,94,0.3)' }}>활성 조직</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0, maxWidth: '600px' }}>
              파나마에서 꾸미가 설립한 사회혁신 조직. 기술(Tech for Good)을 통해 심장병 아동 보건 접근성과 저소득층 교육 격차 해소를 동시에 목표로 한다.
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--gold-400)' }}>{Math.round((completedAll / totalAll) * 100)}%</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>전체 마일스톤 달성</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{completedAll} / {totalAll}</div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '4px' }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1, padding: '10px 8px', borderRadius: '8px', border: 'none',
              background: activeTab === tab.key ? 'rgba(255,255,255,0.10)' : 'transparent',
              color: activeTab === tab.key ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: activeTab === tab.key ? 700 : 400,
              fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s',
              borderBottom: activeTab === tab.key ? '2px solid var(--gold-400)' : '2px solid transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Heartitude ── */}
      {activeTab === 'heartitude' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              checked={checkedMilestones}
              onToggle={handleToggleMilestone}
            />
          ))}
        </div>
      )}

      {/* ── Tab: Competitions ── */}
      {activeTab === 'competitions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', paddingLeft: '4px' }}>
            학문 대회 실적은 Pre-Med + Chemistry + Math 역량을 객관적으로 증명합니다.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {competitions.map((comp) => (
              <CompetitionCard key={comp.id} comp={comp} />
            ))}
          </div>
          {/* 추가 대회 안내 */}
          <div style={{
            background: 'rgba(99,102,241,0.06)', border: '1px dashed rgba(99,102,241,0.25)',
            borderRadius: '12px', padding: '16px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>+ 대회 추가 예정 (Science Olympiad, AMC, 파나마 화학경시 등)</div>
          </div>
        </div>
      )}

      {/* ── Tab: Pre-Med ── */}
      {activeTab === 'premed' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 총합 요약 */}
          <div style={{
            background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: '12px', padding: '16px',
            display: 'flex', gap: '24px', flexWrap: 'wrap',
          }}>
            {[
              { label: '총 임상 시간', value: `${preMedActivities.reduce((s, a) => s + a.hours, 0)}h`, icon: '⏱️' },
              { label: '목표 총 시간', value: `${preMedActivities.reduce((s, a) => s + a.targetHours, 0)}h`, icon: '🎯' },
              { label: '활동 종류', value: `${preMedActivities.length}개`, icon: '📋' },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: 'center', flex: 1, minWidth: '80px' }}>
                <div style={{ fontSize: '16px', marginBottom: '2px' }}>{stat.icon}</div>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#22C55E' }}>{stat.value}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
          {/* 활동 카드 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {preMedActivities.map((activity) => (
              <PreMedCard
                key={activity.id}
                activity={activity}
                expanded={expandedLog === activity.id}
                onToggleExpand={() => setExpandedLog(expandedLog === activity.id ? null : activity.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
