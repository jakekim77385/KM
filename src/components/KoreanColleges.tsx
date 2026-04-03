'use client';
import { useState } from 'react';

type KrCategory = 'medical' | 'stem';
type KrTier = 'dream' | 'reach' | 'match' | 'safety';
type ExamType = '서류+면접' | '서류+필답+면접';

type KoreanCollege = {
  id: string;
  name: string;
  shortName: string;
  category: KrCategory;
  tier: KrTier;
  location: string;
  hospital: string;
  specialQuota: string;
  programYears: number;
  annualTuitionKRW: number;
  examRequired: boolean;
  koreanRequired: boolean;
  examType: ExamType;
  interviewNote: string;
  satRange: string;
  toeflMin: number;
  applicationPeriod: string;
  applyUrl: string;
  requirements: string[];
  notes: string;
  aiMatchScore: number;
  chancePercent: number;
  pros: string[];
  cons: string[];
  verdict: string;
};

const krColleges: KoreanCollege[] = [
  // ── 의대 (3년 특례 확정) ──
  {
    id: 'yonsei-med',
    name: '연세대학교 의과대학',
    shortName: '연세대 의대',
    category: 'medical', tier: 'dream',
    location: '서울 서대문구',
    hospital: '세브란스병원 (세계 100위권)',
    specialQuota: '3명',
    programYears: 6, annualTuitionKRW: 1100,
    examRequired: false, koreanRequired: true,
    examType: '서류+면접',
    interviewNote: '서류기반 면접 + 인성면접 (한국어)',
    satRange: '1500–1580 권장',
    toeflMin: 110,
    applicationPeriod: '매년 9~10월',
    applyUrl: 'https://admission.yonsei.ac.kr',
    requirements: ['재외국민 특별전형 자격 서류', '해외 고교 성적증명서 (GPA)', 'TOEFL 110+ 또는 SAT 1500+', '자기소개서 (의학 지원 동기)', '한국어 면접'],
    notes: '세브란스병원 연계. TO 3명. 영어 서류 중심. 꾸미 SAT 1570 — 최상위권.',
    aiMatchScore: 76, chancePercent: 28,
    pros: ['세브란스 세계적 명성', 'SAT 1570 최상위권 ✅', 'GPA 4.0 ✅', '영어 서류 중심 — 유리'],
    cons: ['TO 3명 경쟁 극심', '한국어 면접 필수', '연 학비 1,100만원', 'USMLE 추가 필요'],
    verdict: '🌟 드림. TO 극소. 영어 서류에서 차별화 가능. 연세+고려 묶음 지원 전략.',
  },
  {
    id: 'korea-med',
    name: '고려대학교 의과대학',
    shortName: '고려대 의대',
    category: 'medical', tier: 'dream',
    location: '서울 성북구',
    hospital: '고려대안암병원',
    specialQuota: '3명',
    programYears: 6, annualTuitionKRW: 1050,
    examRequired: false, koreanRequired: true,
    examType: '서류+면접',
    interviewNote: '1단계 서류 3배수 → 2단계 한국어 면접',
    satRange: '1480–1580 권장',
    toeflMin: 108,
    applicationPeriod: '매년 9~10월',
    applyUrl: 'https://oku.korea.ac.kr',
    requirements: ['재외국민 특별전형 서류', '고교 성적증명서', 'TOEFL 108+ 또는 SAT', '자기소개서', '면접 (의학 지원 동기·인성)'],
    notes: '1단계 서류 3배수 → 2단계 면접. SAT·GPA 경쟁력 있으면 1단계 통과 가능.',
    aiMatchScore: 78, chancePercent: 35,
    pros: ['SAT 1570 — 서류 경쟁력 최상 ✅', 'GPA 4.0 ✅', '고대병원 임상 탄탄', '서울 캠퍼스'],
    cons: ['TO 3명', '2단계 한국어 면접 결정적', '연 학비 1,050만원', 'USMLE 추가'],
    verdict: '🚀 도전. 서류 통과 가능성 높음. 한국어 면접을 집중 준비하면 현실적.',
  },
  {
    id: 'skku-med',
    name: '성균관대학교 의과대학',
    shortName: '성균관대 의대',
    category: 'medical', tier: 'reach',
    location: '경기 수원 / 임상 서울 강남',
    hospital: '삼성서울병원 (세계 Top 20)',
    specialQuota: '3~4명',
    programYears: 6, annualTuitionKRW: 900,
    examRequired: false, koreanRequired: true,
    examType: '서류+면접',
    interviewNote: '서류 기반 인성·적성 면접 (한국어)',
    satRange: '1450–1580 권장',
    toeflMin: 105,
    applicationPeriod: '매년 9~10월',
    applyUrl: 'https://adm.skku.edu',
    requirements: ['재외국민 특별전형 서류', 'GPA 성적증명서', 'TOEFL 105+ 또는 SAT', '자기소개서', '면접'],
    notes: '삼성서울병원 세계 Top 20. 의대 연구력 급성장. 실질 학비 900만원 — 중간.  꾸미 스펙 충분 초과.',
    aiMatchScore: 80, chancePercent: 45,
    pros: ['삼성서울병원 World Top 20', 'SAT 1570 초과 ✅', 'GPA 4.0 초과 ✅', 'TO 3~4명 — 상대적 여유'],
    cons: ['수원 기초과정 (강남 병원 따로)', '한국어 면접', '연 학비 900만원', 'SKY 브랜드보다 낮음'],
    verdict: '✅ 현실적 Match. 삼성병원 연계 + 꾸미 스펙 충분. 강력 추천.',
  },
  {
    id: 'hanyang-med',
    name: '한양대학교 의과대학',
    shortName: '한양대 의대',
    category: 'medical', tier: 'reach',
    location: '서울 성동구',
    hospital: '한양대병원 / 구리한양대병원',
    specialQuota: '3~5명',
    programYears: 6, annualTuitionKRW: 1000,
    examRequired: false, koreanRequired: true,
    examType: '서류+면접',
    interviewNote: '서류 기반 면접 (한국어, 의학 동기 중심)',
    satRange: '1430–1580 권장',
    toeflMin: 100,
    applicationPeriod: '매년 9~10월',
    applyUrl: 'https://go.hanyang.ac.kr',
    requirements: ['재외국민 특별전형 서류', '고교 성적', '어학 성적 (TOEFL/SAT)', '자기소개서', '면접'],
    notes: 'TO 3~5명으로 상대적 여유. 서울 캠퍼스. SAT 1570 — 매우 유리한 경쟁력.',
    aiMatchScore: 82, chancePercent: 55,
    pros: ['TO 3~5명 — 여유 있음', '서울 캠퍼스', 'SAT 1570 ✅', 'GPA 4.0 ✅'],
    cons: ['한국어 면접 필수', '연 학비 1,000만원', 'SKY 브랜드 대비 낮음'],
    verdict: '✅ Match. TO 여유 + 꾸미 스펙 충분. 성균관대와 묶음 지원 권장.',
  },
  {
    id: 'catholic-med',
    name: '가톨릭대학교 의과대학',
    shortName: '가톨릭대 의대',
    category: 'medical', tier: 'match',
    location: '서울 서초구',
    hospital: '서울성모병원 (가톨릭 의료원 8개 병원)',
    specialQuota: '3명',
    programYears: 6, annualTuitionKRW: 950,
    examRequired: false, koreanRequired: true,
    examType: '서류+면접',
    interviewNote: '인성면접 + MMI(다중 미니 면접, 한국어) — 난도 높음',
    satRange: '1450–1580 권장',
    toeflMin: 105,
    applicationPeriod: '매년 9~10월',
    applyUrl: 'https://ipsi.catholic.ac.kr',
    requirements: ['재외국민 특별전형 서류', '고교 성적', 'TOEFL 105+ 또는 SAT', '자기소개서', 'MMI 면접 (한국어)'],
    notes: '서울성모병원 포함 8개 병원. MMI 면접 방식으로 인성·상황판단력 중점 평가. 봉사 배경 어필 유리.',
    aiMatchScore: 81, chancePercent: 58,
    pros: ['서울성모병원 임상 탄탄', 'TO 3명', '봉사 중심 꾸미 배경 부합', 'SAT 1570 ✅'],
    cons: ['MMI 면접 준비 추가 필요', '한국어 필수', '연 학비 950만원'],
    verdict: '✅ Match. 봉사 배경 강하면 MMI 유리. 면접이 당락 좌우.',
  },
  {
    id: 'kyunghee-med',
    name: '경희대학교 의과대학',
    shortName: '경희대 의대',
    category: 'medical', tier: 'match',
    location: '서울 동대문구',
    hospital: '경희대병원 / 강동경희대병원',
    specialQuota: '약 5명',
    programYears: 6, annualTuitionKRW: 950,
    examRequired: false, koreanRequired: true,
    examType: '서류+면접',
    interviewNote: '서류 기반 면접 + 한방의학 오리엔테이션 (한국어)',
    satRange: '1420–1580 권장',
    toeflMin: 100,
    applicationPeriod: '매년 9~10월',
    applyUrl: 'https://iphak.khu.ac.kr',
    requirements: ['재외국민 특별전형 서류', '성적증명서', '어학성적 TOEFL/SAT', '면접'],
    notes: 'TO 약 5명 — 가장 많은 편. 한방+서양의학 통합 커리큘럼 특징. 꾸미 GPA·SAT 충분히 초과.',
    aiMatchScore: 84, chancePercent: 65,
    pros: ['TO 5명 — 현실적 ✅', 'SAT 1570 크게 초과 ✅', 'GPA 4.0 ✅', '서울 캠퍼스'],
    cons: ['한방 커리큘럼 관심 확인 필요', '한국어 면접', '브랜드 중위권'],
    verdict: '✅ 안전 Match. TO 5명 최다. 꾸미 스펙이면 서류 통과 거의 확실.',
  },
  {
    id: 'chungang-med',
    name: '중앙대학교 의과대학',
    shortName: '중앙대 의대',
    category: 'medical', tier: 'match',
    location: '서울 동작구 / 경기 안성',
    hospital: '중앙대병원 (서울 흑석동)',
    specialQuota: '2명',
    programYears: 6, annualTuitionKRW: 950,
    examRequired: false, koreanRequired: true,
    examType: '서류+면접',
    interviewNote: '서류 기반 인성 면접 (한국어)',
    satRange: '1400–1580 권장',
    toeflMin: 100,
    applicationPeriod: '매년 9~10월',
    applyUrl: 'https://ipsi.cau.ac.kr',
    requirements: ['재외국민 특별전형 서류', '고교 성적', 'TOEFL 또는 SAT', '자기소개서', '면접'],
    notes: 'TO 2명으로 적지만 서울 흑석동 병원 위치. 꾸미 스펙 충분. 가톨릭대·경희대와 묶음 지원.',
    aiMatchScore: 79, chancePercent: 62,
    pros: ['서울 중앙대병원 연계', 'SAT 1570 ✅', 'GPA 4.0 크게 초과 ✅'],
    cons: ['TO 2명 — 경쟁 있음', '한국어 면접', '브랜드 중위권'],
    verdict: '✅ Match. 꾸미 스펙 대비 적절. 서울 위치 강점. 안전망 포함.',
  },
  {
    id: 'ajou-med',
    name: '아주대학교 의과대학',
    shortName: '아주대 의대',
    category: 'medical', tier: 'match',
    location: '경기 수원시',
    hospital: '아주대병원 (경기 최대 규모)',
    specialQuota: '2명',
    programYears: 6, annualTuitionKRW: 900,
    examRequired: true, koreanRequired: true,
    examType: '서류+필답+면접',
    interviewNote: '필답고사(수학·영어) + 면접 (한국어) — 수학 준비 필수',
    satRange: '1400–1580 권장',
    toeflMin: 95,
    applicationPeriod: '매년 9~10월',
    applyUrl: 'https://admission.ajou.ac.kr',
    requirements: ['재외국민 특별전형 서류', '고교 성적', '어학 성적', '필답고사 (수학·영어)', '면접'],
    notes: '⚠️ 필답고사 있음. 수학 고급 과정(Precalc/Calc) 준비 별도 필요. TO 2명. 경기도 위치.',
    aiMatchScore: 77, chancePercent: 68,
    pros: ['TO 2명 중 꾸미 수학 강점', 'SAT Math 높으면 필답 유리', '경기 최대 병원'],
    cons: ['⚠️ 필답고사 별도 준비', '수원 위치 (서울 외)', '한국어 면접'],
    verdict: '⚠️ Match + 필답 준비 필요. SAT Math 강하면 유리. 수원 수용 시 고려.',
  },
  {
    id: 'inha-med',
    name: '인하대학교 의과대학',
    shortName: '인하대 의대',
    category: 'medical', tier: 'match',
    location: '인천광역시',
    hospital: '인하대병원 (인천 최대)',
    specialQuota: '1명',
    programYears: 6, annualTuitionKRW: 800,
    examRequired: true, koreanRequired: true,
    examType: '서류+필답+면접',
    interviewNote: '필답고사(수학·영어·과학) + 면접 (한국어)',
    satRange: '1380–1580 권장',
    toeflMin: 90,
    applicationPeriod: '매년 9~10월',
    applyUrl: 'https://admission.inha.ac.kr',
    requirements: ['재외국민 특별전형 서류', '고교 성적', '어학 성적', '필답고사 (수학·영어·과학)', '면접'],
    notes: '⚠️ TO 1명. 필답고사(수학+영어+과학). SAT 1570은 강점이나 TO 1명 리스크 큼.',
    aiMatchScore: 72, chancePercent: 58,
    pros: ['연 학비 800만원 — 저렴', 'SAT Math·Science 강하면 필답 유리', '인천공항 근접'],
    cons: ['⚠️ TO 1명 — 리스크 극크', '필답 3과목 준비', '인천 위치', '한국어 면접'],
    verdict: '⚠️ 도전. TO 1명 리스크. 필답 준비되면 꾸미 스펙으로 충분히 경쟁 가능.',
  },
  {
    id: 'konkuk-med',
    name: '건국대학교 의과대학 (글로컬)',
    shortName: '건국대 의대(충주)',
    category: 'medical', tier: 'safety',
    location: '충북 충주시',
    hospital: '건국대충주병원',
    specialQuota: '5명',
    programYears: 6, annualTuitionKRW: 750,
    examRequired: false, koreanRequired: true,
    examType: '서류+면접',
    interviewNote: '서류 기반 면접 (한국어). 상대적으로 난도 낮음',
    satRange: '1350–1580 참고',
    toeflMin: 85,
    applicationPeriod: '매년 9~10월',
    applyUrl: 'https://ipsi.kku.ac.kr',
    requirements: ['재외국민 특별전형 서류', '고교 성적', '어학 성적', '자기소개서', '면접'],
    notes: '⭐ TO 5명 — 가장 많음. 충주 위치 감수 시 가장 현실적인 안전망. 서울 캠퍼스 아님.',
    aiMatchScore: 86, chancePercent: 82,
    pros: ['TO 5명 최다 ✅', '연 학비 750만원 저렴', 'SAT 1570 압도적 경쟁력', '면접 난도 상대적 낮음'],
    cons: ['충주 위치 (서울에서 2시간)', '브랜드 하위권', '건국대충주병원 (대형 병원 아님)'],
    verdict: '✅ 안전망. TO 5명 + 꾸미 스펙 압도적. 충주 수용 시 거의 확실한 합격.',
  },

  // ── 이공계 ──
  {
    id: 'kaist',
    name: 'KAIST (한국과학기술원)',
    shortName: 'KAIST',
    category: 'stem', tier: 'reach',
    location: '대전 유성구',
    hospital: 'N/A (의공학 → 의대 대학원 경로)',
    specialQuota: '별도 정원 (재외국민 전형)',
    programYears: 4, annualTuitionKRW: 0,
    examRequired: false, koreanRequired: false,
    examType: '서류+면접',
    interviewNote: '영어 면접 가능. 연구 관심·수학/과학 역량 중심',
    satRange: '1500+ (SAT Math 760+)',
    toeflMin: 90,
    applicationPeriod: '매년 9~11월',
    applyUrl: 'https://admission.kaist.ac.kr',
    requirements: ['재외국민 전형 자격', 'GPA 상위 10%', 'SAT Math 750+ 또는 동급', 'TOEFL 90+', '연구 관심 에세이', '면접 (영어 가능)'],
    notes: '등록금 전액 국가 지원 (무료). 세계 Top 50. 의공학·바이오 전공 후 의대 대학원 경로 가능.',
    aiMatchScore: 85, chancePercent: 55,
    pros: ['학비 0원 무료 ✅', '세계 Top 50 이공계', '영어 면접 가능 — 꾸미 유리', '의공학 경로'],
    cons: ['의대 직행 아님', '대전 위치', '수학·과학 최상위 경쟁'],
    verdict: '🔬 이공계 백업. 학비 무료 + 글로벌. 의대 대신 의공학 경로 탁월.',
  },
  {
    id: 'postech',
    name: 'POSTECH (포항공과대학교)',
    shortName: 'POSTECH',
    category: 'stem', tier: 'reach',
    location: '경북 포항시',
    hospital: 'N/A',
    specialQuota: '별도 정원',
    programYears: 4, annualTuitionKRW: 600,
    examRequired: false, koreanRequired: false,
    examType: '서류+면접',
    interviewNote: '영어 면접 가능. 연구 경험·수학 역량 중심',
    satRange: '1480+ (SAT Math 750+)',
    toeflMin: 88,
    applicationPeriod: '매년 9~11월',
    applyUrl: 'https://admission.postech.ac.kr',
    requirements: ['재외국민 전형', 'GPA 상위권', 'SAT Math 750+', 'TOEFL/SAT', '연구 에세이'],
    notes: '한국 Top 2 이공계. 소수정예 집중. 연구 환경 세계적. 연 학비 600만원.',
    aiMatchScore: 82, chancePercent: 60,
    pros: ['한국 Top 2 이공계', '소수정예 연구 집중', '영어 강의 비율 높음'],
    cons: ['포항 위치', '의대 직행 아님', '연 학비 600만원'],
    verdict: '🔬 이공계 옵션. KAIST 다음으로 추천. 연구 중심 의공학 경로.',
  },
];

const tierConfig: Record<KrTier, { label: string; color: string; bg: string }> = {
  dream:  { label: '드림',  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  reach:  { label: '도전',  color: '#818cf8', bg: 'rgba(129,140,248,0.1)' },
  match:  { label: '적정',  color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
  safety: { label: '안전',  color: '#60a5fa', bg: 'rgba(96,165,250,0.1)' },
};

const scoreColor = (s: number) => s >= 80 ? '#4ade80' : s >= 65 ? '#fbbf24' : '#f87171';
const pctColor   = (p: number) => p >= 60 ? '#4ade80' : p >= 40 ? '#fbbf24' : '#fb7185';

type KrSortKey = 'match' | 'chance' | 'cost';
type KrTab = 'medical' | 'stem' | 'strategy';

export default function KoreanColleges() {
  const [tab, setTab] = useState<KrTab>('medical');
  const [sortKey, setSortKey] = useState<KrSortKey>('match');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterTier, setFilterTier] = useState<KrTier | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (key: KrSortKey) => {
    if (key === sortKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir(key === 'cost' ? 'asc' : 'desc'); }
  };

  const medColleges  = krColleges.filter(c => c.category === 'medical');
  const stemColleges = krColleges.filter(c => c.category === 'stem');
  const medCount  = medColleges.length;
  const stemCount = stemColleges.length;
  const avgChance = Math.round(medColleges.reduce((s, c) => s + c.chancePercent, 0) / medCount);
  const totalTO   = medColleges.reduce((s, c) => {
    const n = parseInt(c.specialQuota.replace(/[^0-9]/g, '')) || 0; return s + n;
  }, 0);

  const filtered = krColleges
    .filter(c => tab === 'strategy' ? true : c.category === tab)
    .filter(c => filterTier === 'all' || c.tier === filterTier)
    .filter(c => !searchQuery || c.name.includes(searchQuery) || c.shortName.includes(searchQuery))
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortKey === 'match')  return dir * (a.aiMatchScore - b.aiMatchScore);
      if (sortKey === 'chance') return dir * (a.chancePercent - b.chancePercent);
      if (sortKey === 'cost')   return dir * (a.annualTuitionKRW - b.annualTuitionKRW);
      return 0;
    });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* 자격 배너 */}
      <div style={{ padding: '16px 20px', background: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(96,165,250,0.08))', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '12px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#c084fc', marginBottom: '4px' }}>🎓 재외국민 특별전형 (3년 특례) 자격 확인</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            꾸미 (Balboa Academy · G11) — <strong style={{ color: '#4ade80' }}>3년 특례 해당</strong>. 수능 면제, 서류+면접 위주.
            <br/>⚠️ 서울대는 12년 특례만 — 미포함. 울산대는 재외국민 특별전형 없음.
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto', flexWrap: 'wrap' }}>
          {[
            { label: '수능', value: '면제', ok: true },
            { label: 'SAT 1570', value: '최상위권', ok: true },
            { label: '한국어 면접', value: '대부분 필요', ok: false },
            { label: '지원 시기', value: '9~10월', ok: true },
            { label: '미국 EA와', value: '동시 가능', ok: true },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '7px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: item.ok ? '#4ade80' : '#fbbf24' }}>{item.value}</div>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 통계 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
        {[
          { label: '의과대학', val: `${medCount}개교`, sub: '3년 특례 확정', color: '#fb7185' },
          { label: '총 TO', val: `~${totalTO}명`, sub: '2025년 기준 추산', color: '#fbbf24' },
          { label: '평균 합격률', val: `~${avgChance}%`, sub: '꾸미 스펙 기준', color: '#4ade80' },
          { label: 'SAT 1570', val: '전교 최상위', sub: '경쟁자 대비 압도적', color: '#c084fc' },
          { label: '지원 시기', val: '9~10월', sub: '미국 EA와 동시', color: '#60a5fa' },
        ].map((s, i) => (
          <div key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '18px', fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '3px' }}>{s.label}</div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* 탭 */}
      <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '4px' }}>
        {([
          ['medical',  `🏥 의과대학 (${medCount}개교)`,  medCount],
          ['stem',     `⚗️ 이공계 (${stemCount}개)`,     stemCount],
          ['strategy', '📋 한국 특례 전략',               null],
        ] as const).map(([key, label]) => (
          <button key={key} id={`kr-tab-${key}`}
            className={`btn ${tab === key ? 'btn-primary' : 'btn-ghost'}`}
            style={{ flex: 1, justifyContent: 'center', fontSize: '12px' }}
            onClick={() => setTab(key as KrTab)}>
            {label}
          </button>
        ))}
      </div>

      {/* 전략 탭 */}
      {tab === 'strategy' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="card">
            <div className="card-title" style={{ marginBottom: '12px' }}>🗺️ 한국 의대 3년 특례 vs 미국 BS/MD 비교</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { title: '🇰🇷 한국 의대 특례', color: '#fb7185',
                  items: ['수능 면제 (서류+면접 위주)', '학비 연 750~1,100만원', '필답고사 있는 곳 일부 (인하·아주)', '6년 후 국내 의사면허', '미국 진출 시 USMLE 추가', '한국어 면접 필수', '미국 EA와 동시 지원 가능 (9~10월)'] },
                { title: '🇺🇸 미국 BS/MD', color: '#60a5fa',
                  items: ['SAT+에세이 중심', '학비 연 $75~85K', '수능·필답 불필요', '8~9년 과정 후 MD', 'MD 후 미국 의사면허 자동', '영어 전용 — 꾸미 최적화', 'Brown PLME Need-blind 장학 가능'] },
              ].map((col, i) => (
                <div key={i} style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: `1px solid ${col.color}33` }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: col.color, marginBottom: '8px' }}>{col.title}</div>
                  {col.items.map((item, j) => <div key={j} style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>• {item}</div>)}
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: '12px' }}>💡 꾸미 전략 권장안</div>
            {[
              { step: '1순위', icon: '🥇', color: '#4ade80', desc: '미국 BS/MD 집중 (Brown PLME ED1 + CWRU/UConn RD)' },
              { step: '2순위', icon: '🥈', color: '#fbbf24', desc: '한국 의대 특례 병행 (연세대·고려대·성균관대 필수 / 경희대·가톨릭대 안전망)' },
              { step: '3순위', icon: '🥉', color: '#60a5fa', desc: '미국 STEM Pre-Med (Emory/Vanderbilt — 의대 진학 경로)' },
              { step: '안전망', icon: '🔬', color: '#c084fc', desc: 'KAIST (학비 무료, 의공학 경로) + 건국대글로컬 (TO 5명 최다)' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '16px' }}>{s.icon}</span>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: s.color, marginRight: '6px' }}>{s.step}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{s.desc}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 필답고사 대학 주의 */}
          <div style={{ padding: '12px 14px', background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#fbbf24', marginBottom: '6px' }}>⚠️ 필답고사 있는 대학 (별도 준비 필요)</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              • <strong style={{ color: 'var(--text-primary)' }}>인하대</strong>: 수학 + 영어 + 과학 필기시험 (TO 1명 — 리스크 큼)<br/>
              • <strong style={{ color: 'var(--text-primary)' }}>아주대</strong>: 수학 + 영어 필기시험 (TO 2명 — 꾸미 SAT Math 강점 활용)<br/>
              → 필답 있는 곳은 SAT Math 고득점 강점을 어필할 수 있으나, 별도 한국 수학 형식 적응 훈련 필요
            </div>
          </div>

          {/* 체크리스트 */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: '10px' }}>📋 3년 특례 지원 체크리스트</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px' }}>
              {[
                { item: '재외국민 자격 서류 (해외 거주/재학 증명)', done: true },
                { item: '해외 고교 성적증명서 (영문 GPA)', done: true },
                { item: 'SAT 성적 보유 (1570 — 최상위권)', done: true },
                { item: 'TOEFL 110+ 준비 (일부 필수)', done: false },
                { item: '한국어 면접 준비 (의학 동기·인성)', done: false },
                { item: '자기소개서 (한국어) 준비', done: false },
                { item: '의대별 전형 요강 개별 확인', done: false },
                { item: '필답고사 대비 (아주대·인하대 지원 시)', done: false },
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: '7px', alignItems: 'center', padding: '7px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                  <span style={{ fontSize: '13px' }}>{c.done ? '✅' : '⬜'}</span>
                  <span style={{ fontSize: '10px', color: c.done ? 'var(--text-primary)' : 'var(--text-muted)' }}>{c.item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 대학 리스트 탭 */}
      {tab !== 'strategy' && (
        <>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="대학명 검색..."
              style={{ padding: '7px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', fontSize: '12px', width: '140px' }} />
            {(['all', 'dream', 'reach', 'match', 'safety'] as const).map(t => (
              <button key={t} id={`kr-filter-${t}`} className={`btn ${filterTier === t ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: '11px', padding: '5px 10px' }} onClick={() => setFilterTier(t)}>
                {t === 'all' ? '전체' : tierConfig[t].label}
              </button>
            ))}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>정렬:</span>
              {([['match','🤖 AI매치'],['chance','🎯 가능성'],['cost','💰 학비']] as const).map(([k, l]) => {
                const isActive = sortKey === k;
                const dir = isActive ? (sortDir === 'desc' ? '▼' : '▲') : '';
                return (
                  <button key={k} id={`kr-sort-${k}`} className={`btn ${isActive ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ fontSize: '11px', padding: '5px 10px' }} onClick={() => handleSort(k)}>
                    {l}{isActive && <span style={{ marginLeft: '3px', opacity: 0.8 }}>{dir}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{filtered.length}개 표시 중 (2025년 기준 의대 10개교 총 ~29명 TO)</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map(c => {
              const isExpanded = expandedId === c.id;
              const tc = tierConfig[c.tier];
              return (
                <div key={c.id} id={`kr-college-${c.id}`}
                  style={{ background: c.tier === 'dream' ? 'linear-gradient(135deg, rgba(212,175,55,0.06), var(--glass-bg))' : 'var(--glass-bg)',
                    border: `1px solid ${c.tier === 'dream' ? 'rgba(212,175,55,0.2)' : c.tier === 'safety' ? 'rgba(96,165,250,0.2)' : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>

                  {/* 카드 헤더 */}
                  <div onClick={() => setExpandedId(isExpanded ? null : c.id)} style={{ padding: '16px 18px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap', marginBottom: '5px' }}>
                          <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>{c.shortName}</span>
                          <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '100px', background: tc.bg, color: tc.color }}>{tc.label}</span>
                          {c.examType === '서류+필답+면접' && (
                            <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}>⚠️ 필답고사</span>
                          )}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                          📍 {c.location} · {c.programYears}년제 · TO: <strong style={{ color: '#fbbf24' }}>{c.specialQuota}</strong> · 🏥 {c.hospital}
                        </div>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '7px' }}>
                          <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}>수능 면제</span>
                          <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>SAT {c.satRange}</span>
                          <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>TOEFL {c.toeflMin}+</span>
                          <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: 'rgba(251,191,36,0.08)', color: '#fbbf24' }}>📅 {c.applicationPeriod}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '16px', fontWeight: 800, color: pctColor(c.chancePercent) }}>{c.chancePercent}%</div>
                          <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>합격 가능성</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '14px', fontWeight: 800, color: '#60a5fa' }}>{c.annualTuitionKRW === 0 ? '무료' : `${c.annualTuitionKRW}만원`}</div>
                          <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>연 학비</div>
                        </div>
                        <div style={{ textAlign: 'center', minWidth: '50px' }}>
                          <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: `conic-gradient(${scoreColor(c.aiMatchScore)} ${c.aiMatchScore * 3.6}deg, rgba(255,255,255,0.08) 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                            <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ fontSize: '12px', fontWeight: 800, color: scoreColor(c.aiMatchScore) }}>{c.aiMatchScore}</span>
                            </div>
                          </div>
                          <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>AI 매치</div>
                        </div>
                        <span style={{ fontSize: '14px', color: 'var(--text-muted)', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>▼</span>
                      </div>
                    </div>
                  </div>

                  {/* 확장 */}
                  {isExpanded && (
                    <div style={{ padding: '0 18px 18px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>

                      {/* 합격 분석 */}
                      <div style={{ padding: '14px', background: 'rgba(167,139,250,0.05)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: '10px', marginBottom: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: '#c084fc' }}>🎯 꾸미 합격 가능성 분석</span>
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '100px', background: 'rgba(74,222,128,0.12)', color: '#4ade80' }}>SAT 1570 ↑</span>
                            <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '100px', background: 'rgba(74,222,128,0.12)', color: '#4ade80' }}>GPA 4.0 ↑</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '5px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>합격 가능성 (추정)</span>
                          <span style={{ fontWeight: 800, color: pctColor(c.chancePercent) }}>{c.chancePercent}%</span>
                        </div>
                        <div style={{ height: '7px', borderRadius: '100px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden', marginBottom: '12px' }}>
                          <div style={{ height: '100%', width: `${c.chancePercent}%`, background: `linear-gradient(90deg, ${pctColor(c.chancePercent)}, rgba(167,139,250,0.6))`, borderRadius: '100px' }} />
                        </div>

                        {/* 면접 방식 */}
                        <div style={{ fontSize: '10px', padding: '6px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', marginBottom: '10px', color: 'var(--text-secondary)' }}>
                          📋 <strong style={{ color: 'var(--text-primary)' }}>전형 방식:</strong> {c.examType} &nbsp;|&nbsp; 🎤 <strong style={{ color: 'var(--text-primary)' }}>면접:</strong> {c.interviewNote}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                          <div style={{ padding: '10px', background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.15)', borderRadius: '8px' }}>
                            <div style={{ fontSize: '10px', fontWeight: 700, color: '#4ade80', marginBottom: '5px' }}>✅ 꾸미 강점</div>
                            {c.pros.map((p, i) => <div key={i} style={{ fontSize: '10px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>• {p}</div>)}
                          </div>
                          <div style={{ padding: '10px', background: 'rgba(251,191,36,0.05)', border: '1px solid rgba(251,191,36,0.15)', borderRadius: '8px' }}>
                            <div style={{ fontSize: '10px', fontWeight: 700, color: '#fbbf24', marginBottom: '5px' }}>⚠️ 보완·유의사항</div>
                            {c.cons.map((p, i) => <div key={i} style={{ fontSize: '10px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>• {p}</div>)}
                          </div>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-primary)', fontWeight: 600, padding: '8px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px' }}>
                          {c.verdict}
                        </div>
                      </div>

                      {/* 전형 조건 */}
                      <div style={{ marginBottom: '12px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 700 }}>📋 주요 전형 조건</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                          {c.requirements.map((r, i) => (
                            <span key={i} style={{ fontSize: '10px', padding: '3px 10px', borderRadius: '100px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.08)' }}>{r}</span>
                          ))}
                        </div>
                      </div>

                      {/* 노트 + 링크 */}
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, padding: '10px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                          💬 {c.notes}
                        </div>
                        <a href={c.applyUrl} target="_blank" rel="noopener noreferrer" id={`kr-apply-${c.id}`}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--accent-from), var(--accent-to))', color: 'white', fontSize: '12px', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}
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

          {/* 의대 TO 요약 테이블 (의대 탭에서만) */}
          {tab === 'medical' && (
            <div className="card" style={{ marginTop: '8px' }}>
              <div className="card-title" style={{ marginBottom: '12px' }}>📊 2025년 의대 특례 TO 요약 (3년 특례 기준)</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                {medColleges.sort((a, b) => b.chancePercent - a.chancePercent).map(c => (
                  <div key={c.id} style={{ padding: '10px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', border: `1px solid ${tierConfig[c.tier].color}22`, textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>{c.shortName}</div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: tierConfig[c.tier].color }}>{c.specialQuota}</div>
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>{c.chancePercent}% 가능</div>
                    {c.examType === '서류+필답+면접' && <div style={{ fontSize: '9px', color: '#fbbf24', marginTop: '2px' }}>⚠️ 필답</div>}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '10px', fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                ※ 2025학년도 기준. 매년 TO 변경 가능. 서울대는 12년 특례만 — 미포함. 울산대는 재외국민 특별전형 없음.
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
