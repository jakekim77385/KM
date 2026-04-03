'use client';

import { useState } from 'react';

// ============================================================
// 꾸미 미국 대학 지원 리스트 (2025-2026 지원 사이클)
// ============================================================

type Category = 'bsmd' | 'stem';
type Tier = 'dream' | 'reach' | 'match' | 'safety';
type AidPolicy = 'need-blind' | 'need-aware' | 'merit' | 'full-pay';

type College = {
  id: string;
  name: string;
  shortName: string;
  category: Category;
  tier: Tier;
  location: string;
  state: string;
  acceptRate: number;       // %
  satRange: string;         // e.g. "1500–1580"
  actRange: string;
  annualCOA: number;        // USD
  aidPolicy: AidPolicy;
  aiMatchScore: number;     // 0–100
  programName?: string;     // BS/MD 프로그램 이름
  programYears?: number;    // 6, 7, 8년제
  strengths: string[];
  applyUrl: string;
  deadlineEA?: string;
  deadlineED?: string;
  deadlineRD: string;
  notes: string;
  researchFit: number;      // 연구 적합도 0–100
  preMedRank?: number;      // Pre-Med 순위 (해당 시)
  intlFriendly: boolean;    // 국제학생 재정지원 가능?
};

const colleges: College[] = [
  // ══════════════════════════════════════════════════════════
  // BS/MD 직행 프로그램 (의대 보장)
  // ══════════════════════════════════════════════════════════
  {
    id: 'brown-plme',
    name: 'Brown University — PLME',
    shortName: 'Brown PLME',
    category: 'bsmd',
    tier: 'dream',
    location: 'Providence, RI',
    state: 'Rhode Island',
    acceptRate: 3.4,
    satRange: '1530–1580',
    actRange: '35–36',
    annualCOA: 85_000,
    aidPolicy: 'need-blind',
    aiMatchScore: 88,
    programName: 'Program in Liberal Medical Education (PLME)',
    programYears: 8,
    strengths: ['Need-blind 국제학생(2025~)', 'BS→Brown Med 보장', '인문의학 융합', '연구 자유'],
    applyUrl: 'https://admission.brown.edu/plme',
    deadlineEA: undefined,
    deadlineED: '11월 1일',
    deadlineRD: '1월 1일',
    notes: '⭐ 최우선. 2025년부터 Need-blind 확정. 단, 의대 4년($65K+/년)은 장학금 없음 — 8년 중 전반 4년만 지원.',
    researchFit: 92,
    preMedRank: 15,
    intlFriendly: true,
  },
  {
    id: 'penn-state-pmm',
    name: 'Penn State + Jefferson — PMM',
    shortName: 'Penn State PMM',
    category: 'bsmd',
    tier: 'reach',
    location: 'University Park, PA',
    state: 'Pennsylvania',
    acceptRate: 5.0,
    satRange: '1490–1560',
    actRange: '34–35',
    annualCOA: 75_000,
    aidPolicy: 'full-pay',
    aiMatchScore: 72,
    programName: 'Premedical-Medical (PMM)',
    programYears: 7,
    strengths: ['7년 BS+MD', '입학 경쟁 낮음', '의대 진학 보장', 'STEM 커리큘럼'],
    applyUrl: 'https://science.psu.edu/pre-major/pmm',
    deadlineRD: '11월 30일',
    notes: '전액 자비 $75K/년 (국제학생 재정지원 없음). 7년 총 ~$525K. 의대 보장 가치 있음.',
    researchFit: 70,
    intlFriendly: false,
  },
  {
    id: 'uconn-spm',
    name: 'UConn — Special Program in Medicine',
    shortName: 'UConn SPM',
    category: 'bsmd',
    tier: 'reach',
    location: 'Storrs, CT',
    state: 'Connecticut',
    acceptRate: 6.0,
    satRange: '1450–1540',
    actRange: '33–35',
    annualCOA: 63_000,
    aidPolicy: 'need-aware',
    aiMatchScore: 68,
    programName: 'Special Program in Medicine (SPM)',
    programYears: 8,
    strengths: ['공립대 저렴', 'BS+MD 8년', '국제학생 지원 일부', 'CT 지역 네트워크'],
    applyUrl: 'https://admissions.uconn.edu/apply/freshman/special-programs/spm/',
    deadlineRD: '12월 1일',
    notes: '공립대 중 가장 합리적. 재정지원 일부 가능. ~$63K/년은 BS/MD 중 저렴한 편.',
    researchFit: 65,
    intlFriendly: true,
  },
  {
    id: 'cwru-ppsp',
    name: 'Case Western Reserve — PPSP',
    shortName: 'CWRU PPSP',
    category: 'bsmd',
    tier: 'reach',
    location: 'Cleveland, OH',
    state: 'Ohio',
    acceptRate: 7.5,
    satRange: '1490–1560',
    actRange: '34–35',
    annualCOA: 75_000,
    aidPolicy: 'merit',
    aiMatchScore: 74,
    programName: 'Pre-Professional Scholars Program (PPSP)',
    programYears: 8,
    strengths: ['Merit 장학금 가능', 'CWRU Med 보장', '의공학 강점', '연구 집중'],
    applyUrl: 'https://case.edu/admission/academics/pre-professional-programs',
    deadlineED: '11월 1일',
    deadlineRD: '1월 15일',
    notes: '국제학생 지원 가능 확인. merit 장학금으로 $20K+ 감액 가능. admission@case.edu에 PPSP 상세 문의 권장.',
    researchFit: 78,
    intlFriendly: true,
  },
  // BU MEDDEP → 2022년 프로그램 폐지로 삭제
  // RPI APS → 미국 시민권자/영주권자 전용, F-1 불가로 삭제

  // ══════════════════════════════════════════════════════════
  // STEM / Pre-Med 학부 (드림)
  // ══════════════════════════════════════════════════════════
  {
    id: 'mit',
    name: 'Massachusetts Institute of Technology',
    shortName: 'MIT',
    category: 'stem',
    tier: 'dream',
    location: 'Cambridge, MA',
    state: 'Massachusetts',
    acceptRate: 3.9,
    satRange: '1530–1580',
    actRange: '35–36',
    annualCOA: 83_000,
    aidPolicy: 'need-blind',
    aiMatchScore: 82,
    strengths: ['세계최고 STEM', 'Need-blind 국제학생', '연구 인프라 최강', '기업가정신'],
    applyUrl: 'https://apply.mit.edu/',
    deadlineEA: '11월 1일',
    deadlineRD: '1월 1일',
    notes: '합격률 3.9%. Need-blind로 장학금 가능. 생명공학·의공학 세계 1위.',
    researchFit: 98,
    preMedRank: 12,
    intlFriendly: true,
  },
  {
    id: 'harvard',
    name: 'Harvard University',
    shortName: 'Harvard',
    category: 'stem',
    tier: 'dream',
    location: 'Cambridge, MA',
    state: 'Massachusetts',
    acceptRate: 3.4,
    satRange: '1530–1580',
    actRange: '35–36',
    annualCOA: 83_000,
    aidPolicy: 'need-blind',
    aiMatchScore: 85,
    strengths: ['Need-blind 국제학생', 'HMS 연계', '최고 Pre-Med 환경', '하버드 브랜드'],
    applyUrl: 'https://college.harvard.edu/admissions',
    deadlineEA: '11월 1일',
    deadlineRD: '1월 1일',
    notes: '⭐ Pre-Med 최강. Need-blind EFC ~$60K/년. 합격 시 의대 진학률 85%+.',
    researchFit: 95,
    preMedRank: 1,
    intlFriendly: true,
  },
  {
    id: 'jhu',
    name: 'Johns Hopkins University',
    shortName: 'JHU',
    category: 'stem',
    tier: 'dream',
    location: 'Baltimore, MD',
    state: 'Maryland',
    acceptRate: 6.1,
    satRange: '1510–1580',
    actRange: '34–36',
    annualCOA: 82_000,
    aidPolicy: 'need-aware',
    aiMatchScore: 78,
    strengths: ['의대 Top 3', '생명과학 최강', '병원 임상 연계', '연구 예산 최대'],
    applyUrl: 'https://apply.jhu.edu/',
    deadlineED: '11월 1일',
    deadlineRD: '1월 2일',
    notes: '⚠️ Need-aware 국제학생 (사실상 Full Pay ~$82K/년). 의대 진학 최강 강점.',
    researchFit: 96,
    preMedRank: 2,
    intlFriendly: false,
  },
  {
    id: 'duke',
    name: 'Duke University',
    shortName: 'Duke',
    category: 'stem',
    tier: 'dream',
    location: 'Durham, NC',
    state: 'North Carolina',
    acceptRate: 6.3,
    satRange: '1510–1580',
    actRange: '34–36',
    annualCOA: 83_000,
    aidPolicy: 'merit',
    aiMatchScore: 80,
    strengths: ['Duke Med 연계', 'Robertson Scholars Merit', '의공학 Top 5', 'Research 중심'],
    applyUrl: 'https://admissions.duke.edu/',
    deadlineED: '11월 1일',
    deadlineRD: '1월 2일',
    notes: 'Robertson Scholars 합격 시 $20K+ Merit. Pre-Med + STEM 강점.',
    researchFit: 90,
    preMedRank: 5,
    intlFriendly: true,
  },
  {
    id: 'caltech',
    name: 'California Institute of Technology',
    shortName: 'Caltech',
    category: 'stem',
    tier: 'dream',
    location: 'Pasadena, CA',
    state: 'California',
    acceptRate: 4.3,
    satRange: '1530–1580',
    actRange: '35–36',
    annualCOA: 82_000,
    aidPolicy: 'need-blind',
    aiMatchScore: 76,
    strengths: ['순수과학 세계최강', 'Need-blind 국제학생', '소수정예 1:3 사제비', 'NASA JPL 연계'],
    applyUrl: 'https://www.admissions.caltech.edu/',
    deadlineEA: '11월 1일',
    deadlineRD: '1월 3일',
    notes: 'Need-blind 국제학생. STEM 순수과학 최강. 연구 몰입 환경.',
    researchFit: 97,
    intlFriendly: true,
  },

  // ══════════════════════════════════════════════════════════
  // STEM / Pre-Med 학부 (도전)
  // ══════════════════════════════════════════════════════════
  {
    id: 'stanford',
    name: 'Stanford University',
    shortName: 'Stanford',
    category: 'stem',
    tier: 'dream',
    location: 'Stanford, CA',
    state: 'California',
    acceptRate: 3.9,
    satRange: '1510–1580',
    actRange: '34–36',
    annualCOA: 84_000,
    aidPolicy: 'need-blind',
    aiMatchScore: 79,
    strengths: ['실리콘밸리 허브', 'Need-blind 국제학생', 'Stanford Med 연계', '기업가정신 최강'],
    applyUrl: 'https://admission.stanford.edu/',
    deadlineEA: undefined,
    deadlineRD: '1월 2일',
    notes: 'Need-blind. 실리콘밸리 + 의대 진학 양쪽 가능. STEM + 창업 병행 가능.',
    researchFit: 94,
    preMedRank: 4,
    intlFriendly: true,
  },
  {
    id: 'emory',
    name: 'Emory University',
    shortName: 'Emory',
    category: 'stem',
    tier: 'reach',
    location: 'Atlanta, GA',
    state: 'Georgia',
    acceptRate: 13.0,
    satRange: '1440–1540',
    actRange: '33–35',
    annualCOA: 75_000,
    aidPolicy: 'merit',
    aiMatchScore: 86,
    strengths: ['Emory Med 자체 의대', 'Emory Scholars Merit $20-30K', '봉사 중심', 'CDC Atlanta 연계'],
    applyUrl: 'https://apply.emory.edu/',
    deadlineED: '11월 1일',
    deadlineRD: '1월 15일',
    notes: '⭐ 현실적 최강 옵션. Merit 장학금 + Pre-Med + 자체 의대. 국제학생 Merit 가능.',
    researchFit: 82,
    preMedRank: 18,
    intlFriendly: true,
  },
  {
    id: 'vanderbilt',
    name: 'Vanderbilt University',
    shortName: 'Vanderbilt',
    category: 'stem',
    tier: 'reach',
    location: 'Nashville, TN',
    state: 'Tennessee',
    acceptRate: 8.3,
    satRange: '1480–1570',
    actRange: '34–36',
    annualCOA: 77_000,
    aidPolicy: 'merit',
    aiMatchScore: 83,
    strengths: ['의대 Top 15', 'Ingram Scholars Merit', '음악도시 Nashville', '연구 지원 풍부'],
    applyUrl: 'https://admissions.vanderbilt.edu/',
    deadlineED: '11월 1일',
    deadlineRD: '1월 1일',
    notes: 'Ingram Scholars 가능 시 $20~25K Merit. Emory와 병행 지원 권장.',
    researchFit: 85,
    preMedRank: 14,
    intlFriendly: true,
  },
  {
    id: 'Georgetown',
    name: 'Georgetown University',
    shortName: 'Georgetown',
    category: 'stem',
    tier: 'reach',
    location: 'Washington, D.C.',
    state: 'D.C.',
    acceptRate: 12.0,
    satRange: '1440–1550',
    actRange: '33–35',
    annualCOA: 81_000,
    aidPolicy: 'need-aware',
    aiMatchScore: 72,
    strengths: ['Georgetown Med 연계', '정책·의학 융합', 'DC 위치', '국제 네트워크'],
    applyUrl: 'https://uadmissions.georgetown.edu/',
    deadlineEA: '11월 1일',
    deadlineRD: '1월 10일',
    notes: 'Need-aware 국제학생. 정치+의학 관심자에게 독보적. 재정지원 제한적.',
    researchFit: 70,
    preMedRank: 20,
    intlFriendly: false,
  },
  {
    id: 'northwestern',
    name: 'Northwestern University',
    shortName: 'Northwestern',
    category: 'stem',
    tier: 'dream',
    location: 'Evanston, IL',
    state: 'Illinois',
    acceptRate: 6.9,
    satRange: '1500–1580',
    actRange: '34–36',
    annualCOA: 83_000,
    aidPolicy: 'need-blind',
    aiMatchScore: 78,
    strengths: ['Feinberg Med 직접 연계', 'Need-blind 국제학생', '통합 과학 커리큘럼', '시카고 의료 허브'],
    applyUrl: 'https://ugadmission.northwestern.edu/',
    deadlineED: '11월 1일',
    deadlineRD: '1월 2일',
    notes: 'Need-blind 국제학생. Feinberg Medical School 진학 경로 강력. 의공학 Top 3.',
    researchFit: 88,
    preMedRank: 8,
    intlFriendly: true,
  },

  // ══════════════════════════════════════════════════════════
  // STEM / Pre-Med 학부 (적정~안정)
  // ══════════════════════════════════════════════════════════
  {
    id: 'tulane',
    name: 'Tulane University',
    shortName: 'Tulane',
    category: 'stem',
    tier: 'match',
    location: 'New Orleans, LA',
    state: 'Louisiana',
    acceptRate: 14.0,
    satRange: '1400–1520',
    actRange: '32–35',
    annualCOA: 78_000,
    aidPolicy: 'merit',
    aiMatchScore: 89,
    strengths: ['국제학생 Merit $25-35K', '봉사학습 중심', 'Tulane Med 연계', '뉴올리언스 글로벌'],
    applyUrl: 'https://admission.tulane.edu/',
    deadlineED: '11월 1일',
    deadlineRD: '1월 15일',
    notes: '⭐ 봉사 배경 + Merit 최강 조합. 꾸미 프로필과 완벽 매칭. 실납부 ~$48K 예상.',
    researchFit: 75,
    preMedRank: 25,
    intlFriendly: true,
  },
  {
    id: 'ucsd',
    name: 'UC San Diego',
    shortName: 'UCSD',
    category: 'stem',
    tier: 'match',
    location: 'La Jolla, CA',
    state: 'California',
    acceptRate: 24.0,
    satRange: '1370–1530',
    actRange: '31–35',
    annualCOA: 67_000,
    aidPolicy: 'need-aware',
    aiMatchScore: 75,
    strengths: ['생명과학 Top 3', '스크립스 연구소', 'UCSD Med 연계', '공립대 학비'],
    applyUrl: 'https://admissions.ucsd.edu/',
    deadlineRD: '11월 30일',
    notes: '공립대, 국제학생 재정지원 거의 없지만 총비용 낮음. 연구 경력 쌓기 최적.',
    researchFit: 88,
    preMedRank: 22,
    intlFriendly: false,
  },
  {
    id: 'uci',
    name: 'UC Irvine',
    shortName: 'UCI',
    category: 'stem',
    tier: 'match',
    location: 'Irvine, CA',
    state: 'California',
    acceptRate: 26.0,
    satRange: '1320–1500',
    actRange: '30–35',
    annualCOA: 65_000,
    aidPolicy: 'need-aware',
    aiMatchScore: 70,
    strengths: ['생명과학 강점', 'UCI Med 연계', '아시안 커뮤니티', 'OC 안전한 환경'],
    applyUrl: 'https://admissions.uci.edu/',
    deadlineRD: '11월 30일',
    notes: '공립대 안정 옵션. 아시아계 커뮤니티 강함. Pre-Med 경쟁 치열하지만 의대 진학 경로 명확.',
    researchFit: 72,
    preMedRank: 30,
    intlFriendly: false,
  },
  {
    id: 'purdue',
    name: 'Purdue University',
    shortName: 'Purdue',
    category: 'stem',
    tier: 'safety',
    location: 'West Lafayette, IN',
    state: 'Indiana',
    acceptRate: 53.0,
    satRange: '1250–1480',
    actRange: '28–34',
    annualCOA: 58_000,
    aidPolicy: 'merit',
    aiMatchScore: 65,
    strengths: ['공학 Top 5', 'STEM 강세', 'Merit 장학금 가능', '학비 합리적'],
    applyUrl: 'https://admissions.purdue.edu/',
    deadlineEA: '11월 1일',
    deadlineRD: '2월 1일',
    notes: '안정 옵션. 공학+생명과학. Merit 장학금 가능성 높음. 의대 진학 경쟁은 있음.',
    researchFit: 70,
    intlFriendly: true,
  },
];

// ──────────────────────────────────────────────────────────
// 유틸
// ──────────────────────────────────────────────────────────
const tierConfig: Record<Tier, { label: string; color: string; bg: string }> = {
  dream:  { label: '🌟 드림', color: 'var(--gold-400)',   bg: 'rgba(212,175,55,0.12)' },
  reach:  { label: '🚀 도전', color: 'var(--purple-400)', bg: 'rgba(167,139,250,0.10)' },
  match:  { label: '✅ 적정', color: 'var(--green-400)',  bg: 'rgba(74,222,128,0.10)' },
  safety: { label: '🛡️ 안정', color: 'var(--blue-400)',  bg: 'rgba(96,165,250,0.10)' },
};

const aidConfig: Record<AidPolicy, { label: string; color: string }> = {
  'need-blind': { label: '✅ Need-blind', color: 'var(--green-400)' },
  'need-aware': { label: '⚠️ Need-aware', color: 'var(--amber-400)' },
  'merit':      { label: '⭐ Merit 가능', color: 'var(--purple-400)' },
  'full-pay':   { label: '❌ 전액자비', color: 'var(--rose-400)' },
};

const scoreColor = (s: number) =>
  s >= 85 ? 'var(--green-400)' : s >= 70 ? 'var(--amber-400)' : 'var(--rose-400)';

const tierOrder: Tier[] = ['dream', 'reach', 'match', 'safety'];

type SortKey = 'match' | 'accept' | 'cost' | 'research';
type Tab = 'bsmd' | 'stem' | 'strategy';

export default function CollegeList() {
  const [tab, setTab] = useState<Tab>('bsmd');
  const [sortKey, setSortKey] = useState<SortKey>('match');
  const [filterTier, setFilterTier] = useState<Tier | 'all'>('all');
  const [filterIntl, setFilterIntl] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = colleges
    .filter(c => tab === 'strategy' ? true : c.category === tab)
    .filter(c => filterTier === 'all' || c.tier === filterTier)
    .filter(c => !filterIntl || c.intlFriendly)
    .filter(c =>
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.programName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    )
    .sort((a, b) => {
      if (sortKey === 'match')    return b.aiMatchScore - a.aiMatchScore;
      if (sortKey === 'accept')   return a.acceptRate - b.acceptRate;
      if (sortKey === 'cost')     return a.annualCOA - b.annualCOA;
      if (sortKey === 'research') return b.researchFit - a.researchFit;
      return 0;
    });

  const bsmdCount = colleges.filter(c => c.category === 'bsmd').length;
  const stemCount  = colleges.filter(c => c.category === 'stem').length;
  const intlCount  = colleges.filter(c => c.intlFriendly).length;
  const avgMatch   = Math.round(colleges.reduce((a, b) => a + b.aiMatchScore, 0) / colleges.length);

  return (
    <div>
      {/* 요약 배너 */}
      <div className="card card-gold animate-in" style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--gold-400)', marginBottom: '14px' }}>
          🎓 꾸미 미국 대학 지원 리스트 (2025–26)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px', marginBottom: '12px' }}>
          {[
            { label: '총 지원 대학', val: `${colleges.length}개`, sub: 'STEM + BS/MD', color: 'var(--blue-400)' },
            { label: 'BS/MD 직행', val: `${bsmdCount}개`, sub: '의대 보장 프로그램', color: 'var(--purple-400)' },
            { label: 'STEM Pre-Med', val: `${stemCount}개`, sub: '학부 → 의대 경로', color: 'var(--green-400)' },
            { label: '국제 장학 가능', val: `${intlCount}개`, sub: 'Need-blind / Merit', color: 'var(--gold-400)' },
            { label: '평균 AI 매치', val: `${avgMatch}점`, sub: '꾸미 프로필 기준', color: 'var(--amber-400)' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{s.label}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{s.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: '10px 14px', background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '8px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          💡 <strong style={{ color: 'var(--green-400)' }}>전략 요약:</strong> BS/MD 직행 프로그램(Brown PLME 최우선) + STEM Pre-Med(Emory/Vanderbilt Merit) 병행 지원.
          국제학생 Need-blind 5개교 + Merit 장학 가능 6개교 포함.
          <span style={{ color: 'var(--amber-400)' }}> ※ 목표 SAT 1520+, 꾸미 현재 스펙 기준 AI 매치 점수 산정.</span>
        </div>
      </div>

      {/* 탭 */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '4px' }}>
        {([
          ['bsmd',     '🏥 BS/MD 직행', bsmdCount],
          ['stem',     '🔬 STEM Pre-Med', stemCount],
          ['strategy', '📋 지원 전략', null],
        ] as const).map(([key, label, count]) => (
          <button key={key} id={`college-tab-${key}`}
            className={`btn ${tab === key ? 'btn-primary' : 'btn-ghost'}`}
            style={{ flex: 1, justifyContent: 'center', fontSize: '12px', gap: '6px' }}
            onClick={() => setTab(key)}>
            {label}
            {count !== null && (
              <span style={{ padding: '1px 7px', borderRadius: '100px', background: tab === key ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)', fontSize: '10px' }}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 전략 탭 */}
      {tab === 'strategy' && (
        <div className="animate-in">
          {/* 지원 전략 개요 */}
          <div className="card card-gold" style={{ marginBottom: '16px' }}>
            <div className="card-title" style={{ marginBottom: '16px' }}>🗺️ 꾸미 지원 전략 로드맵</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              {[
                {
                  title: '1단계: BS/MD 최우선',
                  color: 'var(--purple-400)',
                  bg: 'rgba(167,139,250,0.06)',
                  border: 'rgba(167,139,250,0.2)',
                  items: [
                    'Brown PLME — ED1 지원 (11/1) ⭐ 최우선',
                    'CWRU PPSP — 국제학생 지원 가능, Merit $20K+ (ED 11/1)',
                    'UConn SPM — 공식 확인, 비용 합리적 (12/1)',
                    'Penn State PMM — 지원 가능, 전액자비 각오 (11/30)',
                  ],
                },
                {
                  title: '2단계: STEM Pre-Med 병행',
                  color: 'var(--green-400)',
                  bg: 'rgba(74,222,128,0.06)',
                  border: 'rgba(74,222,128,0.2)',
                  items: [
                    'Harvard / MIT / Caltech — Need-blind 드림',
                    'Emory — Merit 장학금 최강 옵션',
                    'Vanderbilt — Ingram Scholars 도전',
                    'Tulane — 봉사 배경 매칭, Merit 큼',
                    'UCSD / UCI — 공립대 안정 옵션',
                  ],
                },
              ].map((s, i) => (
                <div key={i} style={{ padding: '14px', background: s.bg, border: `1px solid ${s.border}`, borderRadius: '10px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: s.color, marginBottom: '10px' }}>{s.title}</div>
                  {s.items.map((item, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      <span style={{ color: s.color, flexShrink: 0 }}>▸</span>
                      {item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* 마감일 캘린더 */}
          <div className="card" style={{ marginBottom: '16px' }}>
            <div className="card-title" style={{ marginBottom: '14px' }}>📅 지원 마감일 요약</div>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>대학</th>
                    <th>카테고리</th>
                    <th>EA</th>
                    <th>ED</th>
                    <th>RD</th>
                    <th>국제 장학</th>
                  </tr>
                </thead>
                <tbody>
                  {colleges
                    .filter(c => c.tier === 'dream' || c.tier === 'reach')
                    .sort((a, b) => {
                      const getDate = (c: College) => c.deadlineED || c.deadlineEA || c.deadlineRD;
                      return getDate(a).localeCompare(getDate(b));
                    })
                    .map((c, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.shortName}</td>
                        <td>
                          <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: c.category === 'bsmd' ? 'rgba(167,139,250,0.15)' : 'rgba(74,222,128,0.12)', color: c.category === 'bsmd' ? 'var(--purple-400)' : 'var(--green-400)' }}>
                            {c.category === 'bsmd' ? '🏥 BS/MD' : '🔬 STEM'}
                          </span>
                        </td>
                        <td style={{ color: 'var(--amber-400)', fontSize: '12px' }}>{c.deadlineEA ?? '—'}</td>
                        <td style={{ color: 'var(--purple-400)', fontSize: '12px' }}>{c.deadlineED ?? '—'}</td>
                        <td style={{ fontSize: '12px' }}>{c.deadlineRD}</td>
                        <td>
                          <span style={{ color: aidConfig[c.aidPolicy].color, fontSize: '11px' }}>
                            {aidConfig[c.aidPolicy].label}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 핵심 체크리스트 */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: '14px' }}>✅ 지원 준비 핵심 체크</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { item: 'SAT 1520+ 달성 (현재 목표치 확인)', done: false, color: 'var(--amber-400)' },
                { item: 'Common App 계정 생성 및 학교별 섹션 작성', done: false, color: 'var(--blue-400)' },
                { item: 'Brown PLME Essay 초안 작성 (Why Medicine, Why Brown + Why PLME)', done: false, color: 'var(--purple-400)' },
                { item: '추천서 3명 확정 (2이과 교사 + 담임 또는 멘토)', done: false, color: 'var(--blue-400)' },
                { item: 'Emory Scholars / Tulane Merit 별도 앱 확인', done: false, color: 'var(--green-400)' },
                { item: 'CWRU admission@case.edu PPSP 상세 조건 문의 (의대 MCAT 면제 등)', done: false, color: 'var(--amber-400)' },
                { item: 'CSS Profile 제출 준비 (Brown, Harvard, Northwestern, Caltech)', done: false, color: 'var(--gold-400)' },
                { item: '과외활동 목록 최종 정리 (10개 이내, 꾸미 봉사 포함)', done: false, color: 'var(--green-400)' },
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '5px', border: `2px solid ${c.color}`, flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{c.item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BS/MD 또는 STEM 탭 */}
      {tab !== 'strategy' && (
        <div className="animate-in">
          {/* 필터 + 정렬 + 검색 */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
            {/* 검색 */}
            <input
              type="text"
              placeholder="대학명 검색..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '7px 12px',
                color: 'var(--text-primary)',
                fontSize: '12px',
                minWidth: '160px',
                outline: 'none',
              }}
            />
            {/* 티어 필터 */}
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {(['all', 'dream', 'reach', 'match', 'safety'] as const).map(t => (
                <button key={t} id={`filter-${t}`}
                  className={`btn ${filterTier === t ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ fontSize: '11px', padding: '5px 10px' }}
                  onClick={() => setFilterTier(t)}>
                  {t === 'all' ? '전체' : tierConfig[t].label}
                </button>
              ))}
            </div>
            {/* 국제 장학 토글 */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px', color: filterIntl ? 'var(--green-400)' : 'var(--text-muted)', userSelect: 'none' }}>
              <div style={{ position: 'relative', width: '34px', height: '20px' }}>
                <input type="checkbox" checked={filterIntl} onChange={e => setFilterIntl(e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }} />
                <div style={{ position: 'absolute', inset: 0, background: filterIntl ? 'var(--green-400)' : 'rgba(255,255,255,0.15)', borderRadius: '10px', transition: '.3s' }} />
                <div style={{ position: 'absolute', top: '3px', left: filterIntl ? '17px' : '3px', width: '14px', height: '14px', background: 'white', borderRadius: '50%', transition: '.3s' }} />
              </div>
              국제 장학만
            </label>
            {/* 정렬 */}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>정렬:</span>
              {([
                ['match', '🤖 AI매치'],
                ['accept', '📊 합격률'],
                ['cost', '💰 학비'],
                ['research', '🔬 연구'],
              ] as const).map(([k, l]) => (
                <button key={k} id={`sort-${k}`}
                  className={`btn ${sortKey === k ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ fontSize: '11px', padding: '5px 10px' }}
                  onClick={() => setSortKey(k)}>{l}</button>
              ))}
            </div>
          </div>

          {/* 결과 카운트 */}
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            {filtered.length}개 대학 표시 중
          </div>

          {/* 대학 카드 목록 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                조건에 맞는 대학이 없습니다.
              </div>
            )}
            {filtered.map(c => {
              const isExpanded = expandedId === c.id;
              const tier = tierConfig[c.tier];
              const aid = aidConfig[c.aidPolicy];
              return (
                <div key={c.id} id={`college-${c.id}`}
                  style={{
                    background: c.tier === 'dream'
                      ? 'linear-gradient(135deg, rgba(212,175,55,0.06), var(--glass-bg))'
                      : 'var(--glass-bg)',
                    border: `1px solid ${c.tier === 'dream' ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                  }}>

                  {/* 카드 헤더 — 클릭 시 확장 */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : c.id)}
                    style={{ padding: '18px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                      {/* 왼쪽: 이름 + 배지들 */}
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                          <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>{c.shortName}</span>
                          <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '100px', background: tier.bg, color: tier.color }}>
                            {tier.label}
                          </span>
                          {c.category === 'bsmd' && (
                            <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: 'rgba(167,139,250,0.15)', color: 'var(--purple-400)', fontWeight: 700 }}>
                              🏥 {c.programYears}년제
                            </span>
                          )}
                          <span style={{ fontSize: '10px', color: aid.color }}>{aid.label}</span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          📍 {c.location}
                          {c.programName && <span style={{ marginLeft: '10px', color: 'var(--purple-400)' }}>• {c.programName}</span>}
                        </div>
                      </div>

                      {/* 오른쪽: AI 매치 점수 + 주요 수치 */}
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* 주요 수치 */}
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '15px', fontWeight: 800, color: c.acceptRate < 5 ? 'var(--rose-400)' : c.acceptRate < 15 ? 'var(--amber-400)' : 'var(--green-400)' }}>
                              {c.acceptRate}%
                            </div>
                            <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>합격률</div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--blue-400)' }}>
                              ${(c.annualCOA / 1000).toFixed(0)}K
                            </div>
                            <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>연학비</div>
                          </div>
                        </div>

                        {/* AI 매치 원형 */}
                        <div style={{ textAlign: 'center', minWidth: '60px' }}>
                          <div style={{
                            width: '54px', height: '54px', borderRadius: '50%',
                            background: `conic-gradient(${scoreColor(c.aiMatchScore)} ${c.aiMatchScore * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            position: 'relative', margin: '0 auto',
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

                    {/* SAT 범위 + 강점 태그 */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                        SAT {c.satRange}
                      </span>
                      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                        ACT {c.actRange}
                      </span>
                      {c.strengths.slice(0, 3).map((s, i) => (
                        <span key={i} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: 'rgba(96,165,250,0.08)', color: 'var(--blue-400)' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 확장 상세 */}
                  {isExpanded && (
                    <div style={{ padding: '0 18px 18px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>

                      {/* 연구 적합도 바 */}
                      <div style={{ marginBottom: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '5px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>🔬 연구 적합도</span>
                          <span style={{ color: scoreColor(c.researchFit), fontWeight: 700 }}>{c.researchFit}/100</span>
                        </div>
                        <div style={{ height: '6px', borderRadius: '100px', background: 'rgba(255,255,255,0.08)' }}>
                          <div style={{ height: '100%', width: `${c.researchFit}%`, background: `linear-gradient(90deg, ${scoreColor(c.researchFit)}, var(--blue-400))`, borderRadius: '100px', transition: 'width 0.5s' }} />
                        </div>
                      </div>

                      {/* 전략 노트 */}
                      <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '14px' }}>
                        💬 {c.notes}
                      </div>

                      {/* 전체 강점 */}
                      <div style={{ marginBottom: '14px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '7px' }}>🏆 강점</div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {c.strengths.map((s, i) => (
                            <span key={i} style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '100px', background: 'rgba(96,165,250,0.1)', color: 'var(--blue-400)' }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 마감일 + 지원 버튼 */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', fontSize: '11px' }}>
                          {c.deadlineEA && (
                            <span style={{ padding: '4px 10px', borderRadius: '100px', background: 'rgba(251,191,36,0.1)', color: 'var(--amber-400)' }}>
                              EA: {c.deadlineEA}
                            </span>
                          )}
                          {c.deadlineED && (
                            <span style={{ padding: '4px 10px', borderRadius: '100px', background: 'rgba(167,139,250,0.1)', color: 'var(--purple-400)' }}>
                              ED: {c.deadlineED}
                            </span>
                          )}
                          <span style={{ padding: '4px 10px', borderRadius: '100px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
                            RD: {c.deadlineRD}
                          </span>
                        </div>
                        <a href={c.applyUrl} target="_blank" rel="noopener noreferrer"
                          id={`apply-${c.id}`}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '8px 16px', borderRadius: '8px',
                            background: 'linear-gradient(135deg, var(--accent-from), var(--accent-to))',
                            color: 'white', fontSize: '12px', fontWeight: 700,
                            textDecoration: 'none', transition: 'opacity 0.2s',
                          }}
                          onClick={e => e.stopPropagation()}>
                          🔗 지원 사이트 →
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 티어별 요약 */}
          <div className="card" style={{ marginTop: '20px' }}>
            <div className="card-title" style={{ marginBottom: '14px' }}>
              📊 {tab === 'bsmd' ? 'BS/MD' : 'STEM Pre-Med'} 티어별 분포
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {tierOrder.map(t => {
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
        </div>
      )}
    </div>
  );
}
