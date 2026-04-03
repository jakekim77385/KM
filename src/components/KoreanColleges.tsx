'use client';
import { useState } from 'react';

// ──────────────────────────────────────────
// 꾸미 스펙
// ──────────────────────────────────────────
const KUMMI = { gpa: 4.0, sat: 1570, grade: 11 } as const;

// ──────────────────────────────────────────
// 타입 정의
// ──────────────────────────────────────────
type KrCategory = 'medical' | 'stem' | 'pharmacy';
type KrTier = 'dream' | 'reach' | 'match' | 'safety';

type KoreanCollege = {
  id: string;
  name: string;
  shortName: string;
  category: KrCategory;
  tier: KrTier;
  location: string;
  specialQuota: string;      // 특례 TO
  specialType: '3년' | '12년' | '모두';
  programYears: number;       // 6년 (의대), 4년 (이공)
  annualTuitionKRW: number;  // 연 학비 (만원)
  examRequired: boolean;      // 수능 필요 여부
  koreanRequired: boolean;    // 한국어 능력 필요 여부
  applicationPeriod: string;  // 지원 시기
  applyUrl: string;
  requirements: string[];
  notes: string;
  aiMatchScore: number;       // 0-100 꾸미 기준
  chancePercent: number;      // 합격 가능성 추정 %
  pros: string[];
  cons: string[];
  verdict: string;
};

// ──────────────────────────────────────────
// 대학 데이터
// ──────────────────────────────────────────
const krColleges: KoreanCollege[] = [
  // ── 의대 ──
  {
    id: 'snu-med',
    name: '서울대학교 의과대학',
    shortName: '서울대 의대',
    category: 'medical',
    tier: 'dream',
    location: '서울 종로구',
    specialQuota: '약 2명 이내',
    specialType: '3년',
    programYears: 6,
    annualTuitionKRW: 450,
    examRequired: false,
    koreanRequired: true,
    applicationPeriod: '매년 9~10월 (다음해 3월 입학)',
    applyUrl: 'https://admission.snu.ac.kr',
    requirements: ['재외국민 특별전형 지원 자격', '고교 성적증명서 (GPA)', '공인어학성적 (TOEFL/SAT)', '자기소개서', '한국어 면접 (일부)'],
    notes: '국내 최고 의대. 특례 TO 극히 적음. 국공립이라 학비 저렴. 한국어 면접 주의.',
    aiMatchScore: 72,
    chancePercent: 18,
    pros: ['국내 의대 최정상 브랜드', '연 학비 ~450만원 (미국의 1/20)', '서울대병원 임상 환경 최강', 'GPA 4.0 경쟁력 우수'],
    cons: ['TO 2명 이내 — 경쟁 극심', '한국어 면접 필수', '국내 의사면허 취득 후 미국 USMLE 추가 필요', '해외 의대 대비 글로벌 인지도 제한'],
    verdict: '🌟 드림. TO 극소. 한국어 면접 준비 필수. 미국 의대와 병행 지원 시 추가 옵션.',
  },
  {
    id: 'yonsei-med',
    name: '연세대학교 의과대학',
    shortName: '연세대 의대',
    category: 'medical',
    tier: 'dream',
    location: '서울 서대문구',
    specialQuota: '약 3명',
    specialType: '3년',
    programYears: 6,
    annualTuitionKRW: 1100,
    examRequired: false,
    koreanRequired: true,
    applicationPeriod: '매년 9~10월',
    applyUrl: 'https://admission.yonsei.ac.kr',
    requirements: ['재외국민 특별전형 자격서류', '고교 성적 (GPA/석차)', 'TOEFL 100+ 또는 SAT 1400+', '자기소개서', '면접'],
    notes: '세브란스병원 연계. TO 3명 수준. 미국 의대 지원자와 경쟁. 영어 서류 중심.',
    aiMatchScore: 76,
    chancePercent: 28,
    pros: ['세브란스병원 세계적 명성', 'TO 3명 — SNU보다 기회 ↑', 'GPA·SAT 유리', '영어 서류 중심 — 꾸미 유리'],
    cons: ['연 학비 1,100만원', 'TO 여전히 매우 적음', '한국어 면접 필요', '국내 취업 중심 네트워크'],
    verdict: '🌟 드림. SNU보다 TO 약간 많음. 영어 서류 중심이라 꾸미 유리. 강력 추천 지원.',
  },
  {
    id: 'korea-med',
    name: '고려대학교 의과대학',
    shortName: '고려대 의대',
    category: 'medical',
    tier: 'reach',
    location: '서울 성북구',
    specialQuota: '약 3명',
    specialType: '3년',
    programYears: 6,
    annualTuitionKRW: 1050,
    examRequired: false,
    koreanRequired: true,
    applicationPeriod: '매년 9~10월',
    applyUrl: 'https://oku.korea.ac.kr',
    requirements: ['재외국민 특별전형 지원자격 서류', '고교 성적', '공인어학성적', '자기소개서', '면접'],
    notes: '고대안암병원 연계. 3년 특례 TO 약 3명. 면접에서 의학 지식/동기 강조.',
    aiMatchScore: 78,
    chancePercent: 35,
    pros: ['고대병원 임상 강점', 'TO 3명 — 도전 가치', 'GPA 4.0 경쟁력 충분', '한국 내 의대 Top 5'],
    cons: ['연 학비 1,050만원', '한국어 면접 필수', '의사 면허 후 USMLE 별도', '미국 의대 합격 시 우선순위 재검토'],
    verdict: '🚀 도전. 꾸미 스펙으로 충분히 경쟁 가능. 연세대와 동시 지원 권장.',
  },
  {
    id: 'skku-med',
    name: '성균관대학교 의과대학',
    shortName: '성균관대 의대',
    category: 'medical',
    tier: 'reach',
    location: '경기 수원시',
    specialQuota: '약 3명',
    specialType: '3년',
    programYears: 6,
    annualTuitionKRW: 900,
    examRequired: false,
    koreanRequired: true,
    applicationPeriod: '매년 9~10월',
    applyUrl: 'https://adm.skku.edu',
    requirements: ['재외국민 특별전형 서류', 'GPA/성적증명서', 'TOEFL or SAT', '자기소개서', '면접'],
    notes: '삼성서울병원 연계 — 세계 Top 20 병원. 의대 연구력 급성장. 취업 연계 강점.',
    aiMatchScore: 80,
    chancePercent: 45,
    pros: ['삼성서울병원 세계적 수준', 'SAT·GPA 경쟁력 우위', '상대적으로 TO 가능성 높음', '연구 중심 성장 중'],
    cons: ['성균관 브랜드 SKY보다 낮음', '수원 위치 (서울 외)', '한국어 면접', '글로벌 인지도 제한'],
    verdict: '✅ 현실적 Match. 꾸미 스펙 충분 초과. 삼성병원 Environment 강점. 필수 지원.',
  },
  {
    id: 'hanyang-med',
    name: '한양대학교 의과대학',
    shortName: '한양대 의대',
    category: 'medical',
    tier: 'match',
    location: '서울 성동구',
    specialQuota: '약 3~5명',
    specialType: '3년',
    programYears: 6,
    annualTuitionKRW: 1000,
    examRequired: false,
    koreanRequired: true,
    applicationPeriod: '매년 9~10월',
    applyUrl: 'https://go.hanyang.ac.kr',
    requirements: ['재외국민 특별전형 서류', '성적증명서', '어학성적', '자기소개서', '면접'],
    notes: '한양대병원 연계. TO 3~5명으로 상대적으로 유리. 서울 캠퍼스.',
    aiMatchScore: 82,
    chancePercent: 58,
    pros: ['TO 3~5명 — 도전 현실적', '서울 캠퍼스', 'GPA·SAT 충분히 경쟁력', '의대 현대적 교육과정'],
    cons: ['브랜드 SKY보다 낮음', '한국어 면접', '학비 1,000만원', 'USMLE 후 미국 활동 시 추가 과정'],
    verdict: '✅ Match. TO 여유 있어 현실적. 고려대·성균관대와 함께 지원 패키지로 구성.',
  },
  {
    id: 'kyunghee-med',
    name: '경희대학교 의과대학',
    shortName: '경희대 의대',
    category: 'medical',
    tier: 'match',
    location: '서울 동대문구',
    specialQuota: '약 5명',
    specialType: '3년',
    programYears: 6,
    annualTuitionKRW: 950,
    examRequired: false,
    koreanRequired: true,
    applicationPeriod: '매년 9~10월',
    applyUrl: 'https://iphak.khu.ac.kr',
    requirements: ['재외국민 특별전형 서류', '성적증명서', '어학성적 (TOEFL/SAT)', '면접'],
    notes: '한방·서양의학 통합 교육이 특징. TO 약 5명으로 합격 가능성 높은 편.',
    aiMatchScore: 84,
    chancePercent: 65,
    pros: ['TO 약 5명 — 현실적', 'GPA 4.0 충분히 경쟁력', '서울 캠퍼스', '국제 의학 협약 다수'],
    cons: ['브랜드 중위권', '한방 커리큘럼 (관심 여부 확인 필요)', '미국 의대 합격 시 우선순위 낮음', '학비 950만원'],
    verdict: '✅ 안전 Match. TO 5명으로 꾸미 스펙이면 충분. 안전망 학교로 필수 포함.',
  },

  // ── 이공계 ──
  {
    id: 'kaist',
    name: 'KAIST (한국과학기술원)',
    shortName: 'KAIST',
    category: 'stem',
    tier: 'reach',
    location: '대전 유성구',
    specialQuota: '별도 정원',
    specialType: '모두',
    programYears: 4,
    annualTuitionKRW: 0,
    examRequired: false,
    koreanRequired: false,
    applicationPeriod: '매년 9~11월',
    applyUrl: 'https://admission.kaist.ac.kr',
    requirements: ['재외국민 / 외국인 전형 지원', 'GPA 4.0/4.5 또는 상위 10%', '수학·과학 성적 강세', 'TOEFL 90+ 또는 SAT Math 750+', '자기소개서 (연구 관심)'],
    notes: '학비 전액 국가지원 (등록금 무료). 세계 Top 50 이공계 대학. 바이오/의공학 특강.',
    aiMatchScore: 85,
    chancePercent: 55,
    pros: ['학비 0원 — 등록금 전액 면제', '세계 Top 50 이공계', '영어 강의 비율 높음', '의공학·바이오 Pre-Med 경로'],
    cons: ['대전 위치', '의대 직행 아님 (대학원 의학통합과정 必)', '이공계 집중 — 의대 준비에 추가 시간'], 
    verdict: '🔬 이공계 백업 옵션. 학비 무료 + 세계적 수준. 의대 대신 의공학 경로로 탁월.',
  },
  {
    id: 'postech',
    name: 'POSTECH (포항공과대학교)',
    shortName: 'POSTECH',
    category: 'stem',
    tier: 'reach',
    location: '경북 포항시',
    specialQuota: '별도 정원',
    specialType: '모두',
    programYears: 4,
    annualTuitionKRW: 600,
    examRequired: false,
    koreanRequired: false,
    applicationPeriod: '매년 9~11월',
    applyUrl: 'https://admission.postech.ac.kr',
    requirements: ['재외국민 전형 지원', 'GPA 상위권', '수학·과학 성적', 'TOEFL/SAT', '연구 관심 에세이'],
    notes: 'POSTECH-카이스트와 함께 한국 최고 이공계. 소수정예 집중교육. 연구 중심.',
    aiMatchScore: 82,
    chancePercent: 60,
    pros: ['한국 Top 2 이공계', '소수정예 집중 교육', '연구 환경 세계적', '영어 전공 수업 가능'],
    cons: ['포항 위치 (교통 불편)', '학비 연 600만원', '의대 직행 아님', '의공학 경로 시 추가 시간'],
    verdict: '🔬 이공계 안정 옵션. 학비 저렴 + 세계적 연구 환경. 의공학/바이오 관심 시 고려.',
  },
  {
    id: 'snu-eng',
    name: '서울대학교 공과대학 (생명공학부)',
    shortName: '서울대 공대',
    category: 'stem',
    tier: 'dream',
    location: '서울 관악구',
    specialQuota: '약 2~3명',
    specialType: '3년',
    programYears: 4,
    annualTuitionKRW: 420,
    examRequired: false,
    koreanRequired: true,
    applicationPeriod: '매년 9~10월',
    applyUrl: 'https://admission.snu.ac.kr',
    requirements: ['재외국민 특별전형', 'GPA 상위권', 'TOEFL/SAT', '자기소개서', '면접 (한국어)'],
    notes: '생명공학부 → Pre-Med 경로 가능. 국공립 학비 최저. 서울대 브랜드 + 의대 진학 문 있음.',
    aiMatchScore: 78,
    chancePercent: 30,
    pros: ['연 학비 420만원 (최저)', '서울대 브랜드', '의대 진학 가능 경로', '최고 연구 환경'],
    cons: ['TO 2~3명 — 경쟁 심함', '한국어 면접', '의대 직행 아님 (MEET 필요)', '수도권 의대 지원과 중복 전략 필요'],
    verdict: '🌟 드림 이공계. 학비 최저 + 서울대 브랜드. 의대 외 백업으로 가치 있음.',
  },
];

// ──────────────────────────────────────────
// 헬퍼
// ──────────────────────────────────────────
const tierConfig: Record<KrTier, { label: string; color: string; bg: string }> = {
  dream:  { label: '드림',  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  reach:  { label: '도전',  color: '#818cf8', bg: 'rgba(129,140,248,0.1)' },
  match:  { label: '적정',  color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
  safety: { label: '안정',  color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
};

const catConfig: Record<KrCategory, { label: string; icon: string; color: string }> = {
  medical:  { label: '의과대학', icon: '🏥', color: 'var(--rose-400, #fb7185)' },
  stem:     { label: '이공계',   icon: '⚗️', color: 'var(--blue-400, #60a5fa)' },
  pharmacy: { label: '약학대학', icon: '💊', color: 'var(--green-400, #4ade80)' },
};

const scoreColor = (s: number) =>
  s >= 80 ? '#4ade80' : s >= 65 ? '#fbbf24' : '#f87171';

const pctColor = (p: number) =>
  p >= 55 ? 'var(--green-400, #4ade80)' : p >= 30 ? 'var(--amber-400, #fbbf24)' : 'var(--rose-400, #fb7185)';

type KrSortKey = 'match' | 'chance' | 'cost' | 'quota';
type KrTab = 'medical' | 'stem' | 'strategy';

export default function KoreanColleges() {
  const [tab, setTab] = useState<KrTab>('medical');
  const [sortKey, setSortKey] = useState<KrSortKey>('match');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<KrTier | 'all'>('all');

  const handleSort = (key: KrSortKey) => {
    if (key === sortKey) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir(key === 'cost' ? 'asc' : 'desc');
    }
  };

  const filtered = krColleges
    .filter(c => tab === 'strategy' ? true : c.category === tab)
    .filter(c => filterTier === 'all' || c.tier === filterTier)
    .filter(c =>
      !searchQuery ||
      c.name.includes(searchQuery) ||
      c.shortName.includes(searchQuery)
    )
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortKey === 'match')  return dir * (a.aiMatchScore - b.aiMatchScore);
      if (sortKey === 'chance') return dir * (a.chancePercent - b.chancePercent);
      if (sortKey === 'cost')   return dir * (a.annualTuitionKRW - b.annualTuitionKRW);
      return 0;
    });

  const medCount  = krColleges.filter(c => c.category === 'medical').length;
  const stemCount = krColleges.filter(c => c.category === 'stem').length;
  const avgChance = Math.round(
    krColleges.filter(c => c.category === 'medical').reduce((s, c) => s + c.chancePercent, 0) /
    krColleges.filter(c => c.category === 'medical').length
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ── 자격 배너 ── */}
      <div style={{
        padding: '16px 20px',
        background: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(96,165,250,0.08))',
        border: '1px solid rgba(168,85,247,0.3)',
        borderRadius: '12px',
        display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#c084fc', marginBottom: '4px' }}>
            🎓 재외국민 특별전형 (3년 특례) 자격 확인
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            꾸미 (Balboa Academy · G11) — 해외 고교 재학 기준 <strong style={{ color: '#4ade80' }}>3년 특례 해당</strong>.
            수능 면제, 서류+면접으로 국내 주요 의대 지원 가능.
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginLeft: 'auto', flexWrap: 'wrap' }}>
          {[
            { label: '수능', value: '면제', ok: true },
            { label: '특례 유형', value: '3년', ok: true },
            { label: '한국어 면접', value: '대부분 필요', ok: false },
            { label: '지원 시기', value: '9~10월', ok: true },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: item.ok ? '#4ade80' : '#fbbf24' }}>{item.value}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 통계 배너 ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
        {[
          { label: '의과대학', val: `${medCount}개`, sub: '3년 특례 가능', color: '#fb7185' },
          { label: '이공계 대학', val: `${stemCount}개`, sub: 'KAIST·POSTECH 포함', color: '#60a5fa' },
          { label: '의대 평균 합격률', val: `~${avgChance}%`, sub: '꾸미 스펙 기준', color: '#fbbf24' },
          { label: '최저 학비', val: '무료', sub: 'KAIST 등록금 면제', color: '#4ade80' },
          { label: '지원 시기', val: '9~10월', sub: '미국 EA와 병행 가능', color: '#c084fc' },
        ].map((s, i) => (
          <div key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '3px' }}>{s.label}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── 탭 ── */}
      <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '4px' }}>
        {([
          ['medical',  '🏥 의과대학',  medCount],
          ['stem',     '⚗️ 이공계',     stemCount],
          ['strategy', '📋 한국 특례 전략', null],
        ] as const).map(([key, label, count]) => (
          <button key={key} id={`kr-tab-${key}`}
            className={`btn ${tab === key ? 'btn-primary' : 'btn-ghost'}`}
            style={{ flex: 1, justifyContent: 'center', fontSize: '12px', gap: '6px' }}
            onClick={() => setTab(key)}>
            {label}
            {count !== null && (
              <span style={{ fontSize: '11px', padding: '1px 7px', borderRadius: '100px',
                background: tab === key ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)' }}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── 전략 탭 ── */}
      {tab === 'strategy' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card">
            <div className="card-title" style={{ marginBottom: '14px' }}>🗺️ 한국 특례 vs 미국 의대 비교 전략</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                {
                  title: '🇰🇷 한국 의대 특례',
                  color: '#fb7185',
                  items: [
                    '수능 면제 (서류+면접)',
                    '학비 연 450~1,100만원 (KAIST 무료)',
                    '6년 과정 후 의사면허 취득',
                    '미국 활동 시 USMLE 추가 필요',
                    '지원 시기: 9~10월 (미국 EA와 동시)',
                    '한국어 면접 준비 필수',
                    '가족과 가깝고 문화적으로 친숙',
                  ],
                },
                {
                  title: '🇺🇸 미국 의대 (BS/MD)',
                  color: '#60a5fa',
                  items: [
                    'SAT+에세이 중심 (수능 불필요)',
                    '학비 연 $75~85K (BS/MD 8년)',
                    'BS/MD 직행으로 8~9년 과정',
                    'MD 후 미국 의사면허 자동 취득',
                    'Brown PLME Need-blind 장학 가능',
                    '글로벌 의대 브랜드 (Johns Hopkins 등)',
                    '꾸미 현재 스펙 최적화 경로',
                  ],
                },
              ].map((col, i) => (
                <div key={i} style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: `1px solid ${col.color}33` }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: col.color, marginBottom: '10px' }}>{col.title}</div>
                  {col.items.map((item, j) => (
                    <div key={j} style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>• {item}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: '14px' }}>💡 꾸미 전략 권장안</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { step: '1순위', desc: '미국 BS/MD 집중 (Brown PLME ED1 + CWRU/UConn RD)', color: '#4ade80', icon: '🥇' },
                { step: '2순위', desc: '한국 의대 특례 병행 (연세대·고려대·성균관대 — 9~10월)', color: '#fbbf24', icon: '🥈' },
                { step: '3순위', desc: '미국 STEM Pre-Med (Emory/Vanderbilt — 의대 진학 경로)', color: '#60a5fa', icon: '🥉' },
                { step: '백업', desc: 'KAIST/POSTECH 이공계 특례 (학비 무료, 의공학 경로)', color: '#c084fc', icon: '🔬' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <span style={{ fontSize: '18px' }}>{s.icon}</span>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: s.color, marginRight: '8px' }}>{s.step}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{s.desc}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '14px', padding: '10px 14px', background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '8px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              ⚠️ <strong style={{ color: '#4ade80' }}>중요:</strong> 한국 의대와 미국 의대 동시 합격 시 미국 선택이 장기적으로 유리.
              한국 특례는 미국 지원 결과 보완용 안전망으로 활용. 지원 시기가 겹치지 않아 동시 지원 가능.
            </div>
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: '14px' }}>📋 3년 특례 지원 체크리스트</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                { item: '재외국민 자격 서류 (해외 거주 증명)', done: true },
                { item: '해외 고교 성적증명서 (GPA/영문)', done: true },
                { item: '학교생활기록부 (영문 번역)', done: true },
                { item: 'TOEFL 100+ 또는 SAT 성적', done: true },
                { item: '한국어 능력 자가 점검', done: false },
                { item: '의대별 지원 서류 상세 확인', done: false },
                { item: '자기소개서 (한국어/영어) 준비', done: false },
                { item: '면접 준비 (의학 지식·동기)', done: false },
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '14px' }}>{c.done ? '✅' : '⬜'}</span>
                  <span style={{ fontSize: '11px', color: c.done ? 'var(--text-primary)' : 'var(--text-muted)' }}>{c.item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 대학 리스트 탭 (의대/이공계) ── */}
      {tab !== 'strategy' && (
        <>
          {/* 필터 + 정렬 */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="대학명 검색..."
              style={{ padding: '7px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', fontSize: '12px', width: '140px' }}
            />
            {(['all', 'dream', 'reach', 'match', 'safety'] as const).map(t => (
              <button key={t} id={`kr-filter-${t}`}
                className={`btn ${filterTier === t ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: '11px', padding: '5px 10px' }}
                onClick={() => setFilterTier(t)}>
                {t === 'all' ? '전체' : tierConfig[t].label}
              </button>
            ))}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>정렬:</span>
              {([
                ['match',  '🤖 AI매치', 'desc', '▼ 높은순', '▲ 낮은순'],
                ['chance', '🎯 가능성',  'desc', '▼ 높은순', '▲ 낮은순'],
                ['cost',   '💰 학비',    'asc',  '▲ 저렴순', '▼ 비싼순'],
              ] as const).map(([k, l, _def, dLabel, aLabel]) => {
                const isActive = sortKey === k;
                const dirLabel = isActive ? (sortDir === 'asc' ? aLabel : dLabel) : '';
                return (
                  <button key={k} id={`kr-sort-${k}`}
                    className={`btn ${isActive ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ fontSize: '11px', padding: '5px 10px' }}
                    onClick={() => handleSort(k)}>
                    {l}{isActive && <span style={{ fontSize: '10px', marginLeft: '2px', opacity: 0.85 }}>{dirLabel}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {filtered.length}개 대학 표시 중
          </div>

          {/* 대학 카드 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map(c => {
              const isExpanded = expandedId === c.id;
              const tier = tierConfig[c.tier];
              const cat = catConfig[c.category];
              return (
                <div key={c.id} id={`kr-college-${c.id}`}
                  style={{
                    background: c.tier === 'dream'
                      ? 'linear-gradient(135deg, rgba(212,175,55,0.06), var(--glass-bg))'
                      : 'var(--glass-bg)',
                    border: `1px solid ${c.tier === 'dream' ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                  }}>

                  {/* 카드 헤더 */}
                  <div onClick={() => setExpandedId(isExpanded ? null : c.id)}
                    style={{ padding: '18px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                      {/* 왼쪽 */}
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                          <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>{c.shortName}</span>
                          <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '100px', background: tier.bg, color: tier.color }}>
                            {tier.label}
                          </span>
                          <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: 'rgba(255,255,255,0.06)', color: cat.color }}>
                            {cat.icon} {cat.label}
                          </span>
                          <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: 'rgba(167,139,250,0.12)', color: '#c084fc' }}>
                            🎓 특례 {c.specialType}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          📍 {c.location} · {c.programYears}년제 · TO: <strong style={{ color: 'var(--amber-400)' }}>{c.specialQuota}</strong>
                        </div>
                      </div>

                      {/* 오른쪽 */}
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '15px', fontWeight: 800, color: pctColor(c.chancePercent) }}>
                            {c.chancePercent}%
                          </div>
                          <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>합격 가능성</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--blue-400)' }}>
                            {c.annualTuitionKRW === 0 ? '무료' : `${c.annualTuitionKRW}만원`}
                          </div>
                          <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>연 학비</div>
                        </div>
                        {/* AI 매치 원형 */}
                        <div style={{ textAlign: 'center', minWidth: '54px' }}>
                          <div style={{
                            width: '54px', height: '54px', borderRadius: '50%',
                            background: `conic-gradient(${scoreColor(c.aiMatchScore)} ${c.aiMatchScore * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', margin: '0 auto',
                          }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ fontSize: '13px', fontWeight: 800, color: scoreColor(c.aiMatchScore) }}>{c.aiMatchScore}</span>
                            </div>
                          </div>
                          <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '3px' }}>AI 매치</div>
                        </div>
                        <span style={{ fontSize: '16px', color: 'var(--text-muted)', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>▼</span>
                      </div>
                    </div>

                    {/* 수능/한국어 뱃지 + 지원 시기 */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px',
                        background: c.examRequired ? 'rgba(251,113,133,0.12)' : 'rgba(74,222,128,0.12)',
                        color: c.examRequired ? '#fb7185' : '#4ade80' }}>
                        수능 {c.examRequired ? '필요' : '면제'}
                      </span>
                      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px',
                        background: c.koreanRequired ? 'rgba(251,191,36,0.12)' : 'rgba(74,222,128,0.12)',
                        color: c.koreanRequired ? '#fbbf24' : '#4ade80' }}>
                        한국어 면접 {c.koreanRequired ? '필요' : '불필요'}
                      </span>
                      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                        📅 {c.applicationPeriod}
                      </span>
                    </div>
                  </div>

                  {/* 확장 상세 */}
                  {isExpanded && (
                    <div style={{ padding: '0 18px 18px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>

                      {/* 합격 가능성 게이지 */}
                      <div style={{ marginBottom: '16px', padding: '14px', background: 'rgba(167,139,250,0.05)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: '#c084fc' }}>🎯 꾸미 합격 가능성 분석</span>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: 'rgba(74,222,128,0.12)', color: '#4ade80' }}>GPA 4.0 ↑ 초과</span>
                            <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: 'rgba(74,222,128,0.12)', color: '#4ade80' }}>SAT 1570 ↑ 초과</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>꾸미 합격 가능성 (추정)</span>
                          <span style={{ fontWeight: 800, color: pctColor(c.chancePercent) }}>{c.chancePercent}%</span>
                        </div>
                        <div style={{ height: '8px', borderRadius: '100px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden', marginBottom: '12px' }}>
                          <div style={{ height: '100%', width: `${c.chancePercent}%`, background: `linear-gradient(90deg, ${pctColor(c.chancePercent)}, rgba(167,139,250,0.7))`, borderRadius: '100px', transition: 'width 0.6s ease' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                          <div style={{ padding: '10px', background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.15)', borderRadius: '8px' }}>
                            <div style={{ fontSize: '10px', fontWeight: 700, color: '#4ade80', marginBottom: '5px' }}>✅ 꾸미 강점</div>
                            {c.pros.map((p, i) => <div key={i} style={{ fontSize: '10px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>• {p}</div>)}
                          </div>
                          <div style={{ padding: '10px', background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.15)', borderRadius: '8px' }}>
                            <div style={{ fontSize: '10px', fontWeight: 700, color: '#fbbf24', marginBottom: '5px' }}>⚠️ 보완·유의 사항</div>
                            {c.cons.map((p, i) => <div key={i} style={{ fontSize: '10px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>• {p}</div>)}
                          </div>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-primary)', fontWeight: 600, padding: '8px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px' }}>
                          {c.verdict}
                        </div>
                      </div>

                      {/* 전형 조건 */}
                      <div style={{ marginBottom: '14px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '7px', fontWeight: 700 }}>📋 전형 조건</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                          {c.requirements.map((r, i) => (
                            <span key={i} style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.08)' }}>{r}</span>
                          ))}
                        </div>
                      </div>

                      {/* 노트 + 지원 버튼 */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ flex: 1, padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                          💬 {c.notes}
                        </div>
                        <a href={c.applyUrl} target="_blank" rel="noopener noreferrer" id={`kr-apply-${c.id}`}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px',
                            background: 'linear-gradient(135deg, var(--accent-from), var(--accent-to))',
                            color: 'white', fontSize: '12px', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}
                          onClick={e => e.stopPropagation()}>
                          🔗 입시 사이트 →
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 티어 분포 */}
          <div className="card" style={{ marginTop: '8px' }}>
            <div className="card-title" style={{ marginBottom: '12px' }}>
              📊 {tab === 'medical' ? '의대' : '이공계'} 특례 티어별 분포
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {(['dream', 'reach', 'match', 'safety'] as const).map(t => {
                const count = filtered.filter(c => c.tier === t).length;
                const tc = tierConfig[t];
                return (
                  <div key={t} style={{ padding: '12px', background: tc.bg, border: `1px solid ${tc.color}33`, borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: tc.color }}>{count}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-primary)', marginTop: '3px' }}>{tc.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
