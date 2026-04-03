'use client';

import { useState } from 'react';

// ============================================================
// 꾸미네 가족 재정 현황 (2025년 기준)
// 이 정보는 가족 내부용 플랫폼에만 사용됩니다.
// ============================================================
const familyFinance = {
  incomeKRW: 170_000_000,      // 연소득 약 1억7천만원
  incomeUSD: 124_088,           // ~$124K (1$=1,370원)
  // 부동산
  house1Market: 430_000_000,   // 집A 시세 4억3천
  house1Jeonse: 230_000_000,   // 집A 전세보증금 2억3천 → 순자산 2억
  house2Market: 700_000_000,   // 집B 시세 7억
  house2Jeonse: 480_000_000,   // 집B 전세보증금 4억8천 → 순자산 2억2천
  // 금융자산
  stocks: 300_000_000,           // 주식 3억
  gold:   200_000_000,           // 금 + 은통장 합 2억
  cash:   270_000_000,           // 현금계좌 2억7천
};

const KRW = 1370; // 환율 (2025년 기준)
const toUSD = (krw: number) => Math.round(krw / KRW);

// ============================================================
// CSS Profile 자산 계산 (전세보증금 부채 정확 반영)
// ============================================================
// 부동산: 시세 - 전세보증금 (이미 세입자에게 반환 의무 있는 금액 차감)
const realEstateNet    = (familyFinance.house1Market - familyFinance.house1Jeonse)
                       + (familyFinance.house2Market - familyFinance.house2Jeonse); // ₩3억9천
const realEstateNetUSD = toUSD(realEstateNet); // ~$300K

// 금융자산: 그로스 $600K에서 전세보증금 부채 ~$546K 차감 (CSS Section Q — Other Debts 신고)
// 전세보증금 = 임시 보관 중인 세입자 자금 → CSS Profile상 부채로 인정 요청
const jeonseDebtKRW    = familyFinance.house1Jeonse + familyFinance.house2Jeonse; // ₩7억1천
const jeonseDebtUSD    = toUSD(jeonseDebtKRW);    // ~$546K
const financialGrossKRW = familyFinance.stocks + familyFinance.gold + familyFinance.cash; // ₩7억8천
const financialGrossUSD = toUSD(financialGrossKRW); // ~$600K (그로스)
const financialNetUSD   = Math.max(0, financialGrossUSD - jeonseDebtUSD); // ~$54K (전세 차감 후)

// CSS Profile 기준 총자산 (전세 차감 인정 시)
const cssAssetUSD   = realEstateNetUSD + financialNetUSD; // ~$354K
// 참고용: 전세 미인정 시 (최악 시나리오)
const cssAssetWorst = realEstateNetUSD + financialGrossUSD; // ~$900K

// ============================================================
// CSS Profile IM 기반 EFC 추정 (Need-blind 학교 기준)
// Harvard/Brown/MIT 등 Institutional Methodology:
//   소득 기여: (소득 - 공제 $38K) × 22%
//   자산 기여: CSS 자산 × 5%
// ============================================================
const incomeProtectionAllowance = 38_000; // IM 표준 소득 공제
const incomeContrib = Math.round(
  Math.max(0, familyFinance.incomeUSD - incomeProtectionAllowance) * 0.22
); // ~$20,400
const assetContrib  = Math.round(cssAssetUSD * 0.05); // ~$17,700 (전세 차감 후)
const estimatedEFC  = incomeContrib + assetContrib + 2_700; // +학생기여 $2,700 → ~$40,800

// 최악 시나리오 EFC (전세 미인정)
const estimatedEFCWorst = Math.round(
  Math.max(0, familyFinance.incomeUSD - incomeProtectionAllowance) * 0.22
) + Math.round(cssAssetWorst * 0.05) + 2_700; // ~$66,500

// ============================================================
// 학교별 실납부액 추정 데이터
// ============================================================
type AidType = 'need-blind' | 'merit' | 'need-aware' | 'full-pay';

type SchoolCost = {
  school: string;
  shortName: string;
  type: 'bsmd' | 'dream' | 'reach' | 'match';
  aidType: AidType;
  totalCOA: number;       // 연간 총비용 (학비+기숙사+생활비)
  estimatedAid: number;   // 예상 장학금 (중간값)
  netCost: number;        // 실납부 예상액 (중간값)
  efcLow: number;         // 낙관적 EFC (전세 차감 인정)
  efcHigh: number;        // 보수적 EFC (학교 재량에 따라)
  aidBasis: string;       // 장학금 근거
  note: string;
  confidence: '높음' | '중간' | '낮음';
  // CSS Profile 관련
  cssRequired: boolean;   // CSS Profile 필요 여부
  cssDeadline: string;    // CSS 제출 마감
  intlNeedPolicy: string; // 국제학생 Need 심사 방식 설명
  incomeRate: number;     // 소득 기여율
  assetRate: number;      // 자산 기여율
};

const schoolCosts: SchoolCost[] = [
  // ── BS/MD 직행 ──────────────────────────────────────────────
  {
    school: 'Brown University PLME',
    shortName: 'Brown PLME',
    type: 'bsmd',
    aidType: 'need-blind',
    totalCOA: 85_000,
    estimatedAid: 44_200,
    netCost: 40_800,
    efcLow: 38_000,   // 전세 차감 인정 + 소득 기여
    efcHigh: 66_500,  // 전세 미인정 최악 시나리오
    aidBasis: 'Need-blind 100% 국제학생. CSS IM: (소득$130K-공제$38K)×22% + 자산$354K×5% + 학생기여 = EFC ~$41K.',
    note: '⭐ 최우선 지원. Need-blind + BS/MD 8년 보장. 전세 차감 인정 시 실납부 ~$41K/년. 8년 총 ~$328K.',
    confidence: '중간',
    cssRequired: true,
    cssDeadline: 'ED: 11월 1일 / RD: 1월 1일',
    intlNeedPolicy: 'Need-blind: 재정 필요 여부와 무관하게 동등 심사. CSS Profile + IDOC 필요. 한국 세금서류 (원천징수영수증) 영문 번역 제출.',
    incomeRate: 0.22,
    assetRate: 0.05,
  },
  {
    school: 'Penn State + Jefferson PMM',
    shortName: 'Penn State PMM',
    type: 'bsmd',
    aidType: 'full-pay',
    totalCOA: 75_000,
    estimatedAid: 0,
    netCost: 75_000,
    efcLow: 75_000,
    efcHigh: 75_000,
    aidBasis: '국제학생 재정지원 없음. CSS Profile 제출 불가 / 불필요. 전액 자비.',
    note: '⚠️ 전액 자비 $75K/년. 7년 총 $525K. 의대 보장 가치 있으나 재정 부담 최대.',
    confidence: '높음',
    cssRequired: false,
    cssDeadline: 'N/A',
    intlNeedPolicy: '국제학생 재정지원 없음. 지원 불필요.',
    incomeRate: 0,
    assetRate: 0,
  },
  {
    school: 'UConn Special Program Medicine',
    shortName: 'UConn SPM',
    type: 'bsmd',
    aidType: 'need-aware',
    totalCOA: 63_000,
    estimatedAid: 8_000,
    netCost: 55_000,
    efcLow: 52_000,
    efcHigh: 63_000,
    aidBasis: '공립대 Need-aware. CSS Profile 접수하나 국제학생 지원 풀 소규모. 일부 Merit/Need 혼합 가능.',
    note: 'BS/MD 중 총비용 최저. 재정지원 제한적이나 공립대 학비 자체가 낮음. 재정 부담 현실적.',
    confidence: '중간',
    cssRequired: true,
    cssDeadline: '12월 1일',
    intlNeedPolicy: 'Need-aware: 재정지원 신청이 합격에 불리할 수 있음. 국제학생 지원 풀 한정. CSS IM 적용하나 공립대라 비율 상이.',
    incomeRate: 0.15,
    assetRate: 0.05,
  },
  {
    school: 'Case Western Reserve PPSP',
    shortName: 'CWRU PPSP',
    type: 'bsmd',
    aidType: 'merit',
    totalCOA: 75_000,
    estimatedAid: 18_000,
    netCost: 57_000,
    efcLow: 52_000,
    efcHigh: 65_000,
    aidBasis: 'Merit 중심. CSS Profile 제출 시 Need-based 일부 가능. 꾸미 스펙 GPA/SAT 기준 Merit $15~20K 추정.',
    note: '⚠️ 국제학생 PPSP 가능 여부 먼저 확인 필요 (admission@case.edu). Merit 있으면 현실적 옵션.',
    confidence: '낮음',
    cssRequired: true,
    cssDeadline: '12월 1일',
    intlNeedPolicy: 'Merit + 일부 Need-based. CSS Profile 접수 후 개별 심사. 국제학생 PPSP 자격 확인 필수.',
    incomeRate: 0.15,
    assetRate: 0.05,
  },

  // ── Pre-Med 드림 ────────────────────────────────────────────
  {
    school: 'Harvard University',
    shortName: 'Harvard',
    type: 'dream',
    aidType: 'need-blind',
    totalCOA: 83_000,
    estimatedAid: 42_200,
    netCost: 40_800,
    efcLow: 38_000,
    efcHigh: 66_500,
    aidBasis: 'Need-blind 국제학생. 소득 $100~200K 구간 → 최소 학비($57K) 전액 커버 원칙. CSS IM EFC ~$41K.',
    note: '⭐ Pre-Med 최강. 소득 $130K는 Harvard \"최소 학비 커버\" 원칙 적용 = 실납부 ~$41K. 합격률 3.4%.',
    confidence: '중간',
    cssRequired: true,
    cssDeadline: 'EA: 11월 1일 / RD: 1월 1일',
    intlNeedPolicy: 'Need-blind. 소득 $100K→기여$0, $200K→학비 전액 커버. $130K 구간: 학비($57K) 커버 + 생활비 일부 기여. CSS + IDOC + 한국 세금서류.',
    incomeRate: 0.22,
    assetRate: 0.05,
  },
  {
    school: 'Johns Hopkins University',
    shortName: 'JHU',
    type: 'dream',
    aidType: 'need-aware',
    totalCOA: 82_000,
    estimatedAid: 0,
    netCost: 82_000,
    efcLow: 82_000,
    efcHigh: 82_000,
    aidBasis: '국제학생 Need-aware: 재정지원 신청 시 합격 불이익 가능. 실질적으로 국제학생 = Full Pay.',
    note: '⚠️ 의대 Top 3지만 국제학생 재정지원 없음. $82K/년 × 4년 = $328K. 재정 부담 가장 큼.',
    confidence: '높음',
    cssRequired: false,
    cssDeadline: 'N/A (불필요)',
    intlNeedPolicy: 'Need-aware: 국제학생의 재정지원 신청은 합격률에 부정적. 실질 Full Pay 대응 필요.',
    incomeRate: 0,
    assetRate: 0,
  },
  {
    school: 'Duke University',
    shortName: 'Duke',
    type: 'dream',
    aidType: 'merit',
    totalCOA: 83_000,
    estimatedAid: 20_000,
    netCost: 63_000,
    efcLow: 58_000,
    efcHigh: 83_000,
    aidBasis: 'Need-aware 국제학생. Robertson Scholars Merit 가능 시 $20K+. CSS 제출하나 Need-based 기대 어려움.',
    note: 'Robertson Scholars 프로그램 별도 지원 필요. Merit 받지 못하면 사실상 Full Pay 각오.',
    confidence: '낮음',
    cssRequired: true,
    cssDeadline: 'ED: 11월 1일',
    intlNeedPolicy: 'Need-aware. CSS 제출 가능하나 국제학생 Need-based 지원 풀 매우 한정적. Merit 위주로 접근.',
    incomeRate: 0.10,
    assetRate: 0.03,
  },

  // ── Pre-Med 도전/적정 ──────────────────────────────────────
  {
    school: 'Emory University',
    shortName: 'Emory',
    type: 'reach',
    aidType: 'merit',
    totalCOA: 75_000,
    estimatedAid: 27_000,
    netCost: 48_000,
    efcLow: 45_000,
    efcHigh: 75_000,
    aidBasis: 'Emory Scholars Merit $20~30K + CSS Profile 기반 Need-based 소규 풀. 합산 $25~35K 추정.',
    note: '⭐ CSS 제출 필수 (2월 5일 마감). Merit + Need 병행 가능. 꾸미 스펙 Emory Scholars 도전 가치.',
    confidence: '중간',
    cssRequired: true,
    cssDeadline: '2월 5일 (RD 기준)',
    intlNeedPolicy: 'Need-aware. CSS Profile + 세금서류 제출. 국제학생 Need 지원풀 소규모. Merit + Need 합산으로 접근. ED1: 11/1, ED2: 1/1.',
    incomeRate: 0.15,
    assetRate: 0.04,
  },
  {
    school: 'Vanderbilt University',
    shortName: 'Vanderbilt',
    type: 'reach',
    aidType: 'merit',
    totalCOA: 77_000,
    estimatedAid: 23_000,
    netCost: 54_000,
    efcLow: 50_000,
    efcHigh: 77_000,
    aidBasis: 'Need-aware 국제학생. CSS Profile 제출. Ingram Scholars/Cornelius Vanderbilt Merit 가능. $20~25K Merit 추정.',
    note: '재정지원 신청이 합격에 불이익 가능 (Need-aware). Merit 중심으로 접근. MyAppVU 별도 Merit 신청 필수.',
    confidence: '중간',
    cssRequired: true,
    cssDeadline: '12월 초 (Merit 포털 기준)',
    intlNeedPolicy: 'Need-aware: 재정지원 신청이 합격에 영향. Merit 으로 접근 권장. CSS는 Need-based 소규 풀용. ED: 11/1.',
    incomeRate: 0.15,
    assetRate: 0.04,
  },
  {
    school: 'Tulane University',
    shortName: 'Tulane',
    type: 'match',
    aidType: 'merit',
    totalCOA: 78_000,
    estimatedAid: 32_000,
    netCost: 46_000,
    efcLow: 43_000,
    efcHigh: 78_000,
    aidBasis: '자동 Merit 고려 + CSS Profile 기반 Need-based 최대 $30K/년. 합산 $25~35K 장학금 가능.',
    note: '⭐ 봉사 배경 매칭 + Merit 장학금 적극적. CSS 제출 시 Need-based 최대 $30K 추가 가능 (2월 15일 마감).',
    confidence: '중간',
    cssRequired: true,
    cssDeadline: '2월 15일',
    intlNeedPolicy: 'Need-aware지만 국제학생에게 가장 적극적인 학교 중 하나. Merit 자동 + CSS 제출 시 Need-based 최대 $30K/년 추가. 합산 효과 좋음.',
    incomeRate: 0.18,
    assetRate: 0.04,
  },
  {
    school: 'UC San Diego',
    shortName: 'UCSD',
    type: 'match',
    aidType: 'need-aware',
    totalCOA: 67_000,
    estimatedAid: 3_000,
    netCost: 64_000,
    efcLow: 64_000,
    efcHigh: 67_000,
    aidBasis: '공립대 국제학생 재정지원 거의 없음. CSS Profile 불필요. 학비 자체가 낮아 총비용 상대적으로 저렴.',
    note: '재정지원 기대 없음. 연구 경력용 안정 옵션. CAL Grant 등 공립 지원은 국제학생 해당 없음.',
    confidence: '높음',
    cssRequired: false,
    cssDeadline: 'N/A',
    intlNeedPolicy: '공립대 국제학생 재정지원 없음. CSS Profile 제출 무의미. 전액 자비 준비.',
    incomeRate: 0,
    assetRate: 0,
  },
];

// 4년/8년 총비용도 계산
const calcTotal = (annual: number, years: number) => annual * years;

// ============================================================
// CSS Profile 체크리스트
// ============================================================
const finaidChecklist = [
  { name: '⚠️ FAFSA — 해당 없음', deadline: 'N/A', done: true, note: 'FAFSA는 미국 시민권자/영주권자 전용. 꾸미(F-1)는 신청 불가.', disabled: true },
  { name: 'CSS Profile 제출 (Brown, Harvard)', deadline: '11월 1일 (EA/ED 기준)', done: false, note: 'College Board cssprofile.collegeboard.org 에서 제출. 국제학생 가능. 소득·자산 상세 입력 필요.' },
  { name: '한국 원천징수영수증 영문 번역 준비', deadline: '원서 마감 전', done: false, note: 'CSS Profile 제출 후 학교에서 소득 증빙 서류 요구. 세무사통해 영문 번역 공증 권장.' },
  { name: '해외 부동산 자산 증빙 준비', deadline: '원서 마감 전', done: false, note: '한국 집 2채 KB부동산 시세 증빙. 전세보증금 계약서 영문 번역. 순자산 계산 근거 준비.' },
  { name: '주식/금 자산 증빙', deadline: '원서 마감 전', done: false, note: '증권 계좌 잔고 증명서 (영문). 전세부채 상계 근거 계약서 첨부.' },
  { name: 'CWRU 입학처 국제학생 PPSP 가능 여부 이메일 확인', deadline: '빠를수록 좋음', done: false, note: 'admission@case.edu — \"Is PPSP open to F-1 international students?\" 직접 문의 필요.' },
  { name: '학교별 International Aid Application 별도 확인', deadline: '학교별 상이', done: false, note: '일부 학교는 CSS 외 별도 국제학생 재정신청서 있음. Brown, Harvard 공식 사이트 확인.' },
  { name: 'I-20 및 F-1 비자 재정 증명 (합격 후)', deadline: '합격 후 즉시', done: false, note: '합격 대학에서 I-20 발급. In-state이 아닌 Out-of-state 학비 기준 Bank Statement 준비.' },
];

const aidTypeInfo: Record<AidType, { label: string; color: string; bg: string }> = {
  'need-blind': { label: '✅ Need-blind', color: 'var(--green-400)', bg: 'rgba(74,222,128,0.1)' },
  'merit':      { label: '⭐ Merit 가능', color: 'var(--purple-400)', bg: 'rgba(167,139,250,0.1)' },
  'need-aware': { label: '⚠️ Need-aware', color: 'var(--amber-400)', bg: 'rgba(251,191,36,0.1)' },
  'full-pay':   { label: '❌ 전액 자비', color: 'var(--rose-400)', bg: 'rgba(251,113,133,0.1)' },
};

const confidenceColor = { '높음': 'var(--green-400)', '중간': 'var(--amber-400)', '낮음': 'var(--rose-400)' };

type Tab = 'netcost' | 'cssdetail' | 'optimizer' | 'profile' | 'checklist';

export default function Financial() {
  const [tab, setTab] = useState<Tab>('netcost');
  const [checklist, setChecklist] = useState(finaidChecklist);
  const [sortBy, setSortBy] = useState<'net' | 'aid' | 'total'>('net');
  const [years, setYears] = useState<4 | 8>(4);

  // EFC 절감 계획기 state
  const [pensionKRW, setPensionKRW] = useState(0);
  const [excludeHouse1, setExcludeHouse1] = useState(false);
  const [debtPayKRW, setDebtPayKRW] = useState(0);
  const [childAssetKRW, setChildAssetKRW] = useState(0);

  const sorted = [...schoolCosts].sort((a, b) => {
    if (sortBy === 'net')   return a.netCost - b.netCost;
    if (sortBy === 'aid')   return b.estimatedAid - a.estimatedAid;
    if (sortBy === 'total') return a.totalCOA - b.totalCOA;
    return 0;
  });

  const toggleCheck = (i: number) => {
    if (finaidChecklist[i].disabled) return;
    setChecklist(prev => prev.map((c, idx) => idx === i ? { ...c, done: !c.done } : c));
  };

  const totalNetMin = schoolCosts.reduce((a, b) => Math.min(a, b.netCost), Infinity);
  const totalNetMax = schoolCosts.reduce((a, b) => Math.max(a, b.netCost), 0);

  return (
    <div>
      {/* 가족 재정 요약 배너 */}
      <div className="card card-gold animate-in" style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--gold-400)', marginBottom: '14px' }}>
          💰 꾸미네 가족 재정 현황 요약
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '10px', marginBottom: '14px' }}>
          {[
            { label: '연간 총소득 (세전)', val: '~$130K', sub: '약 1억7천만원', color: 'var(--green-400)' },
            { label: '부동산 순자산', val: `~$${(realEstateNetUSD/1000).toFixed(0)}K`, sub: '시세 11억 - 전세보증금 7.1억 차감', color: 'var(--blue-400)' },
            { label: 'CSS 금융자산', val: `~$${(financialNetUSD/1000).toFixed(0)}K`, sub: `그로스 $${(financialGrossUSD/1000).toFixed(0)}K - 전세부채 $${(jeonseDebtUSD/1000).toFixed(0)}K`, color: 'var(--amber-400)' },
            { label: 'CSS 총자산 (전세차감)', val: `~$${(cssAssetUSD/1000).toFixed(0)}K`, sub: `미차감 시 $${(cssAssetWorst/1000).toFixed(0)}K → 전세 인정 시 절감!`, color: 'var(--gold-400)' },
            { label: '수정 EFC (연간)', val: `~$${(estimatedEFC/1000).toFixed(0)}K`, sub: '전세 차감 인정 기준', color: 'var(--green-400)' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '18px', fontWeight: 800, color: s.color }}>{s.val}</div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{s.label}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{s.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: '10px 14px', background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '8px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          💡 <strong style={{ color: 'var(--green-400)' }}>수정 EFC 분석 (전세 차감 반영):</strong> (소득$130K - 공제$38K) × 22% = 소득기여 ~${incomeContrib.toLocaleString()} + CSS자산$354K × 5% = 자산기여 ~${assetContrib.toLocaleString()} + 학생기여 $2,700 = 예상 EFC <strong style={{ color: 'var(--gold-400)' }}>~${estimatedEFC.toLocaleString()}/년</strong>.
          <span style={{ color: 'var(--amber-400)' }}>  ← 이전 추정($66K)보다 <strong style={{ color: 'var(--green-400)' }}>~${(estimatedEFCWorst - estimatedEFC).toLocaleString()} 절감</strong>! 전세보증금 $546K 부채 인정 효과.</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '4px', flexWrap: 'wrap' }}>
        {([
          ['netcost',   '💵 실납부'],
          ['cssdetail', '🏫 학교별 CSS'],
          ['optimizer', '🔍 EFC 절감'],
          ['profile',   '👨‍👩‍👧 재정프로필'],
          ['checklist', '📋 체크리스트'],
        ] as const).map(([key, label]) => (
          <button key={key} id={`fin-tab-${key}`}
            className={`btn ${tab === key ? 'btn-primary' : 'btn-ghost'}`}
            style={{ flex: 1, justifyContent: 'center', fontSize: '11px', minWidth: '80px' }}
            onClick={() => setTab(key as Tab)}>
            {label}
          </button>
        ))}
      </div>

      {/* ── 실납부 비용 계산 탭 ── */}
      {tab === 'netcost' && (
        <div className="animate-in">
          {/* 정렬 + 연수 선택 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>정렬:</span>
              {([['net', '💰 실납부 낮은순'], ['aid', '🎓 장학금 큰순'], ['total', '📊 총비용 낮은순']] as const).map(([k, l]) => (
                <button key={k} id={`sort-${k}`}
                  className={`btn ${sortBy === k ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ fontSize: '11px', padding: '5px 10px' }}
                  onClick={() => setSortBy(k)}>{l}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>총비용 기간:</span>
              <button id="years-4" className={`btn ${years === 4 ? 'btn-primary' : 'btn-ghost'}`} style={{ fontSize: '11px', padding: '5px 10px' }} onClick={() => setYears(4)}>4년</button>
              <button id="years-8" className={`btn ${years === 8 ? 'btn-primary' : 'btn-ghost'}`} style={{ fontSize: '11px', padding: '5px 10px' }} onClick={() => setYears(8)}>8년 (BS+MD)</button>
            </div>
          </div>

          {/* 요약 통계 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '16px' }}>
            {[
              { label: '최저 실납부', val: `$${(totalNetMin/1000).toFixed(0)}K/년`, sub: '(Harvard/Brown 기준)', color: 'var(--green-400)' },
              { label: '중간 실납부', val: `$${(55000/1000).toFixed(0)}K/년`, sub: '(Emory/Vanderbilt)', color: 'var(--amber-400)' },
              { label: '최고 실납부', val: `$${(totalNetMax/1000).toFixed(0)}K/년`, sub: '(JHU/Full Pay)', color: 'var(--rose-400)' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '12px', background: 'var(--glass-bg)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>{s.label}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* 학교별 카드 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sorted.map((s, i) => {
              const aid = aidTypeInfo[s.aidType];
              const aidPct = Math.round((s.estimatedAid / s.totalCOA) * 100);
              const totalYears = calcTotal(s.netCost, years);
              return (
                <div key={i} id={`cost-${s.shortName.replace(/\s/g,'')}`}
                  style={{ padding: '18px', background: s.aidType === 'need-blind' ? 'linear-gradient(135deg, rgba(74,222,128,0.05), var(--glass-bg))' : 'var(--glass-bg)', border: `1px solid ${s.aidType === 'need-blind' ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 'var(--radius-md)' }}>

                  {/* 헤더 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>{s.school}</span>
                        <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '100px', background: s.type === 'bsmd' ? 'rgba(167,139,250,0.2)' : 'rgba(212,175,55,0.1)', color: s.type === 'bsmd' ? 'var(--purple-400)' : 'var(--gold-400)' }}>
                          {s.type === 'bsmd' ? '🏥 BS/MD' : '🎓 Pre-Med'}
                        </span>
                        <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '100px', background: aid.bg, color: aid.color }}>{aid.label}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '22px', fontWeight: 900, color: s.netCost < 40000 ? 'var(--green-400)' : s.netCost < 65000 ? 'var(--amber-400)' : 'var(--rose-400)', letterSpacing: '-1px' }}>
                        ${s.netCost.toLocaleString()}<span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>/년</span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {years}년 총 <strong style={{ color: 'var(--amber-400)' }}>${(totalYears/1000).toFixed(0)}K</strong>
                      </div>
                    </div>
                  </div>

                  {/* 비용 분해 바 */}
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '5px' }}>
                      <span>장학금 ${s.estimatedAid.toLocaleString()} ({aidPct}% 절감)</span>
                      <span>총비용 ${s.totalCOA.toLocaleString()}</span>
                    </div>
                    <div style={{ height: '8px', borderRadius: '100px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${aidPct}%`, background: 'linear-gradient(90deg, var(--green-400), var(--blue-400))', borderRadius: '100px', transition: 'width 0.5s' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginTop: '4px' }}>
                      <span style={{ color: 'var(--green-400)' }}>← 장학금 ${s.estimatedAid.toLocaleString()}</span>
                      <span style={{ color: 'var(--rose-400)' }}>실납부 ${s.netCost.toLocaleString()} →</span>
                    </div>
                  </div>

                  {/* 근거 + 노트 */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
                    <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '7px' }}>
                      <div style={{ color: 'var(--text-muted)', marginBottom: '3px' }}>📎 장학금 근거</div>
                      <div style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.aidBasis}</div>
                    </div>
                    <div style={{ padding: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '7px' }}>
                      <div style={{ color: 'var(--text-muted)', marginBottom: '3px' }}>💬 전략 노트</div>
                      <div style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.note}</div>
                    </div>
                  </div>

                  <div style={{ marginTop: '8px', textAlign: 'right' }}>
                    <span style={{ fontSize: '10px', color: confidenceColor[s.confidence] }}>
                      예상치 신뢰도: {s.confidence}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 주의사항 */}
          <div style={{ marginTop: '16px', padding: '12px 14px', background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '10px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            ⚠️ <strong style={{ color: 'var(--amber-400)' }}>주의:</strong> 위 금액은 CSS Profile 기반 추정치입니다. 실제 장학금은 학교별 심사 후 결정됩니다. Brown/Harvard는 합격 후 Financial Aid Letter에서 정확한 금액을 통보받습니다. 개략적인 계획 수립 목적으로만 사용하세요.
          </div>
        </div>
      )}

      {/* ── 재정 프로필 탭 ── */}
      {tab === 'profile' && (
        <div className="animate-in">
          <div className="card" style={{ marginBottom: '16px' }}>
            <div className="card-title" style={{ marginBottom: '16px' }}>🏠 부동산 자산</div>
            <table className="data-table">
              <thead>
                <tr><th>항목</th><th>시세</th><th>전세보증금</th><th>순자산</th><th>순자산 ($)</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>집 1호</td>
                  <td>₩400,000,000</td>
                  <td style={{ color: 'var(--rose-400)' }}>₩230,000,000</td>
                  <td style={{ color: 'var(--green-400)', fontWeight: 700 }}>₩170,000,000</td>
                  <td style={{ color: 'var(--green-400)', fontWeight: 700 }}>~$131K</td>
                </tr>
                <tr>
                  <td>집 2호</td>
                  <td>₩700,000,000</td>
                  <td style={{ color: 'var(--rose-400)' }}>₩480,000,000</td>
                  <td style={{ color: 'var(--green-400)', fontWeight: 700 }}>₩220,000,000</td>
                  <td style={{ color: 'var(--green-400)', fontWeight: 700 }}>~$169K</td>
                </tr>
                <tr style={{ background: 'rgba(212,175,55,0.06)' }}>
                  <td><strong>합계</strong></td>
                  <td><strong>₩1,100,000,000</strong></td>
                  <td style={{ color: 'var(--rose-400)' }}><strong>₩710,000,000</strong></td>
                  <td style={{ color: 'var(--gold-400)', fontWeight: 800 }}><strong>₩390,000,000</strong></td>
                  <td style={{ color: 'var(--gold-400)', fontWeight: 800 }}><strong>~$300K</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="card" style={{ marginBottom: '16px' }}>
            <div className="card-title" style={{ marginBottom: '16px' }}>💹 금융자산 (전세보증금 운용)</div>
            <table className="data-table">
              <thead>
                <tr><th>항목</th><th>금액</th><th>달러</th><th>비고</th></tr>
              </thead>
              <tbody>
                <tr><td>주식</td><td>₩300,000,000</td><td>~$231K</td><td style={{ color: 'var(--amber-400)' }}>전세금 운용</td></tr>
                <tr><td>금(Gold)</td><td>₩200,000,000</td><td>~$154K</td><td style={{ color: 'var(--amber-400)' }}>전세금 운용</td></tr>
                <tr><td>예금·기타</td><td>₩200,000,000</td><td>~$154K</td><td style={{ color: 'var(--amber-400)' }}>전세금 운용</td></tr>
                <tr><td style={{ color: 'var(--rose-400)' }}>전세보증금 부채</td><td style={{ color: 'var(--rose-400)' }}>-₩710,000,000</td><td style={{ color: 'var(--rose-400)' }}>-$546K</td><td>세입자에게 반환 의무</td></tr>
                <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <td><strong>순 금융자산</strong></td>
                  <td><strong>≈ ₩0</strong></td>
                  <td><strong style={{ color: 'var(--text-muted)' }}>≈ $0</strong></td>
                  <td style={{ color: 'var(--green-400)' }}>CSS Profile 유리!</td>
                </tr>
              </tbody>
            </table>
            <div style={{ marginTop: '10px', padding: '10px', background: 'rgba(74,222,128,0.06)', borderRadius: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
              💡 금융자산 7억이 전세보증금(부채) 7억과 상계되어 CSS Profile상 금융 순자산은 거의 0. 이는 <strong style={{ color: 'var(--green-400)' }}>재정지원에 매우 유리한 구조</strong>입니다.
            </div>
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: '16px' }}>📊 CSS Profile EFC 추정 계산</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: '소득 기여 (Income Contribution)', calc: `$130,769 × 12%`, val: `~$${incomeContrib.toLocaleString()}`, color: 'var(--blue-400)' },
                { label: '자산 기여 (Asset Contribution)', calc: `$300,000 × 5%`, val: `~$${assetContrib.toLocaleString()}`, color: 'var(--purple-400)' },
                { label: '예상 EFC (Expected Family Contribution)', calc: '소득기여 + 자산기여', val: `~$${estimatedEFC.toLocaleString()}`, color: 'var(--gold-400)' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{r.label}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{r.calc}</div>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: r.color }}>{r.val}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              ✅ 예상 EFC ~${estimatedEFC.toLocaleString()}/년 = <strong style={{ color: 'var(--gold-400)' }}>Brown PLME ($85K) 기준 약 $52K 장학금</strong>. Harvard도 유사. 단, 해외 부동산 처리 방식에 따라 ±$5~10K 변동 가능.
            </div>
          </div>
        </div>
      )}

      {/* ── 학교별 CSS Profile 분석 탭 ── */}
      {tab === 'cssdetail' && (
        <div className="animate-in">
          {/* EFC 계산 방법론 요약 */}
          <div style={{ padding: '16px', background: 'linear-gradient(135deg, rgba(74,222,128,.07), rgba(96,165,250,.05))', border: '1px solid rgba(74,222,128,.2)', borderRadius: '12px', marginBottom: '18px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--green-400)', marginBottom: '8px' }}>📐 CSS Profile Institutional Methodology (IM) — 꾸미네 계산 기준</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', marginBottom: '10px' }}>
              {[
                { label: '소득 공제 (Protection Allowance)', val: `$${incomeProtectionAllowance.toLocaleString()}`, color: 'var(--blue-400)' },
                { label: '소득 기여율 (IM 표준)', val: '22%', color: 'var(--blue-400)' },
                { label: 'CSS 자산 (전세 차감 후)', val: `$${cssAssetUSD.toLocaleString()}`, color: 'var(--green-400)' },
                { label: '자산 기여율 (IM 표준)', val: '5%', color: 'var(--green-400)' },
                { label: '학생 기여 (Student Contribution)', val: '$2,700', color: 'var(--amber-400)' },
                { label: '전세 차감 절감 효과', val: `-$${(estimatedEFCWorst - estimatedEFC).toLocaleString()}/년`, color: 'var(--gold-400)' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              💡 전세보증금($546K)을 CSS Profile Section Q(기타 부채)에 신고하면 금융자산에서 차감 인정 요청 가능.
              학교 Financial Aid Office에 전세 제도 설명 커버레터 첨부 권장. 인정 여부는 학교 재량이나, Need-blind 학교들은 대체로 수용적.
            </div>
          </div>

          {/* 학교별 상세 테이블 */}
          <div className="card" style={{ marginBottom: '16px' }}>
            <div className="card-title" style={{ marginBottom: '14px' }}>🏫 학교별 CSS Profile 정책 및 EFC 범위</div>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>대학</th>
                    <th>CSS 필요</th>
                    <th>마감일</th>
                    <th>소득기여율</th>
                    <th>자산기여율</th>
                    <th>EFC 낙관<br/><span style={{fontWeight:400,fontSize:'9px'}}>(전세차감)</span></th>
                    <th>EFC 보수<br/><span style={{fontWeight:400,fontSize:'9px'}}>(전세미인정)</span></th>
                    <th>예상 실납부</th>
                  </tr>
                </thead>
                <tbody>
                  {schoolCosts.map((s, i) => {
                    const saving = s.efcHigh - s.efcLow;
                    return (
                      <tr key={i}>
                        <td style={{ fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                          {s.shortName}
                          <div style={{ fontSize: '9px', color: s.aidType === 'need-blind' ? 'var(--green-400)' : s.aidType === 'full-pay' ? 'var(--rose-400)' : 'var(--amber-400)', marginTop: '2px' }}>
                            {aidTypeInfo[s.aidType].label}
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {s.cssRequired
                            ? <span style={{ color: 'var(--green-400)', fontSize: '13px' }}>✅</span>
                            : <span style={{ color: 'var(--rose-400)', fontSize: '13px' }}>❌</span>}
                        </td>
                        <td style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{s.cssDeadline}</td>
                        <td style={{ textAlign: 'center', color: s.incomeRate > 0 ? 'var(--blue-400)' : 'var(--text-muted)', fontWeight: 700 }}>
                          {s.incomeRate > 0 ? `${(s.incomeRate*100).toFixed(0)}%` : '—'}
                        </td>
                        <td style={{ textAlign: 'center', color: s.assetRate > 0 ? 'var(--purple-400)' : 'var(--text-muted)', fontWeight: 700 }}>
                          {s.assetRate > 0 ? `${(s.assetRate*100).toFixed(0)}%` : '—'}
                        </td>
                        <td style={{ color: 'var(--green-400)', fontWeight: 700 }}>
                          ${(s.efcLow/1000).toFixed(0)}K
                        </td>
                        <td style={{ color: 'var(--amber-400)', fontWeight: 700 }}>
                          ${(s.efcHigh/1000).toFixed(0)}K
                          {saving > 0 && (
                            <div style={{ fontSize: '9px', color: 'var(--green-400)' }}>전세 인정 시 -${(saving/1000).toFixed(0)}K↓</div>
                          )}
                        </td>
                        <td style={{ fontWeight: 800, color: s.netCost < 50000 ? 'var(--green-400)' : s.netCost < 70000 ? 'var(--amber-400)' : 'var(--rose-400)' }}>
                          ${(s.netCost/1000).toFixed(0)}K
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 학교별 국제학생 CSS 정책 카드 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {schoolCosts.filter(s => s.cssRequired).map((s, i) => (
              <div key={i} style={{
                padding: '14px 16px',
                background: s.aidType === 'need-blind'
                  ? 'linear-gradient(135deg, rgba(74,222,128,.05), var(--glass-bg))'
                  : 'var(--glass-bg)',
                border: `1px solid ${s.aidType === 'need-blind' ? 'rgba(74,222,128,.2)' : 'rgba(255,255,255,.07)'}`,
                borderRadius: '10px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>{s.school}</span>
                    <span style={{ marginLeft: '8px', fontSize: '10px', padding: '2px 8px', borderRadius: '100px',
                      background: s.aidType === 'need-blind' ? 'rgba(74,222,128,.12)' : 'rgba(251,191,36,.1)',
                      color: s.aidType === 'need-blind' ? 'var(--green-400)' : 'var(--amber-400)' }}>
                      {aidTypeInfo[s.aidType].label}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ textAlign: 'center', padding: '6px 12px', background: 'rgba(74,222,128,.08)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--green-400)' }}>${(s.efcLow/1000).toFixed(0)}K</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>EFC 낙관</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '6px 12px', background: 'rgba(251,191,36,.06)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--amber-400)' }}>${(s.efcHigh/1000).toFixed(0)}K</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>EFC 보수</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '6px 12px', background: 'rgba(212,175,55,.08)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--gold-400)' }}>${(s.netCost/1000).toFixed(0)}K</div>
                      <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>예상 실납부</div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: 'rgba(96,165,250,.1)', color: 'var(--blue-400)' }}>
                    📅 CSS 마감: {s.cssDeadline}
                  </span>
                  {s.incomeRate > 0 && (
                    <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: 'rgba(167,139,250,.1)', color: 'var(--purple-400)' }}>
                      소득 {(s.incomeRate*100).toFixed(0)}% / 자산 {(s.assetRate*100).toFixed(0)}%
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.6, padding: '8px', background: 'rgba(255,255,255,.03)', borderRadius: '7px' }}>
                  {s.intlNeedPolicy}
                </div>
              </div>
            ))}
          </div>

          {/* 전세 설명 커버레터 가이드 */}
          <div style={{ marginTop: '16px', padding: '14px 16px', background: 'rgba(212,175,55,.06)', border: '1px solid rgba(212,175,55,.2)', borderRadius: '12px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--gold-400)', marginBottom: '10px' }}>✍️ 전세 커버레터 핵심 포인트 (CSS 제출 시)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              <div>▸ <strong style={{ color: 'var(--text-primary)' }}>전세 정의:</strong> \"Jeonse is a unique Korean housing lease system where the tenant pays a large lump-sum deposit (typically 50-80% of property value) instead of monthly rent. This deposit is FULLY returnable to the tenant at lease end and is legally a liability of the property owner (us).\"</div>
              <div>▸ <strong style={{ color: 'var(--text-primary)' }}>자산 신고 방법:</strong> CSS Section Q \"Other Debts\" → 전세보증금 합계 ₩710,000,000 (≈$546,154) 기재. 계약서 영문 번역본 첨부.</div>
              <div>▸ <strong style={{ color: 'var(--text-primary)' }}>금융자산 설명:</strong> \"Our financial assets (stocks, gold, cash ≈$600K) represent the invested Jeonse deposits we received. Net financial assets after returning the Jeonse obligations = ~$54K.\"</div>
              <div>▸ <strong style={{ color: 'var(--text-primary)' }}>문의 선행:</strong> 수시 원서 전 각 학교 Financial Aid Office에 이메일로 전세 처리 방법 문의 권장.</div>
            </div>
          </div>
        </div>
      )}

      {/* ── CSS Profile 체크리스트 탭 ── */}
      {tab === 'checklist' && (
        <div className="animate-in">
          <div className="card">
            <div className="card-title" style={{ marginBottom: '16px' }}>📋 재정보조 준비 체크리스트</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {checklist.map((item, i) => (
                <div key={i}
                  onClick={() => toggleCheck(i)}
                  style={{
                    display: 'flex', gap: '12px', alignItems: 'flex-start',
                    padding: '12px 14px',
                    background: item.done ? 'rgba(74,222,128,0.06)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${item.done ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.07)'}`,
                    borderRadius: '8px',
                    cursor: item.disabled ? 'default' : 'pointer',
                    opacity: item.disabled ? 0.6 : 1,
                    transition: 'all 0.2s',
                  }}>
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0,
                    border: `2px solid ${item.done ? 'var(--green-400)' : 'rgba(255,255,255,0.2)'}`,
                    background: item.done ? 'var(--green-400)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginTop: '1px',
                  }}>
                    {item.done && <span style={{ color: '#0a0f1e', fontSize: '12px', fontWeight: 800 }}>✓</span>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: item.done ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: item.done ? 'line-through' : 'none', marginBottom: '4px' }}>
                      {item.name}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '4px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--gold-400)' }}>📅 {item.deadline}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.note}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '12px', textAlign: 'right', fontSize: '12px', color: 'var(--text-muted)' }}>
              완료: {checklist.filter(c => c.done).length} / {checklist.length}
            </div>
          </div>
        </div>
      )}

      {/* ── EFC 절감 계획기 탭 ── */}
      {tab === 'optimizer' && (() => {
        const pensionUSD   = Math.round(pensionKRW / KRW);
        const house1NetUSD = toUSD(familyFinance.house1Market - familyFinance.house1Jeonse); // $131K
        const debtUSD      = Math.round(debtPayKRW / KRW);
        const childUSD     = Math.round(childAssetKRW / KRW);

        // 수정: cssAssetUSD 기준 (전세 차감 이미 반영)
        const optAssetBase = Math.max(0,
          cssAssetUSD
          - pensionUSD
          - (excludeHouse1 ? house1NetUSD : 0)
          - debtUSD
        );
        const optAssetContrib = Math.round(optAssetBase * 0.05);
        const optEFC          = incomeContrib + optAssetContrib + 2_700;
        const efcSaving       = estimatedEFC - optEFC;
        const childPenaltyUSD = Math.round(childUSD * 0.15); // extra penalty vs parent rate

        return (
          <div className="animate-in">

            {/* 안내 배너 */}
            <div style={{ padding: '16px', background: 'linear-gradient(135deg,rgba(74,222,128,.08),rgba(251,191,36,.05))', border: '1px solid rgba(74,222,128,.2)', borderRadius: '12px', marginBottom: '20px' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--green-400)', marginBottom: '6px' }}>🔍 CSS Profile EFC 절감 계획기</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                아래 전략을 조절하면 <strong style={{ color: 'var(--gold-400)' }}>EFC가 실시간으로 바뀒집니다.</strong><br />
                모든 전략은 CSS Profile에 <strong style={{ color: 'var(--green-400)' }}>정직하게 신고하는 범위 내</strong>의 합법적 자산 구조 최적화입니다.
              </div>
            </div>

            {/* 현재 vs 최적화 비교 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ padding: '18px', background: 'rgba(251,113,133,.06)', border: '1px solid rgba(251,113,133,.2)', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>현재 EFC (미최적화)</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--rose-400)' }}>${estimatedEFC.toLocaleString()}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>CSS자산 $354K 기준 / 년 (전세차감)</div>
              </div>
              <div style={{ padding: '18px', background: 'rgba(74,222,128,.06)', border: '1px solid rgba(74,222,128,.2)', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>최적화 후 EFC</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: efcSaving > 0 ? 'var(--green-400)' : 'var(--rose-400)' }}>${optEFC.toLocaleString()}</div>
                <div style={{ fontSize: '11px', color: efcSaving > 0 ? 'var(--green-400)' : 'var(--text-muted)', marginTop: '3px', fontWeight: 600 }}>
                  {efcSaving > 0 ? `↓ -$${efcSaving.toLocaleString()} 절감/년` : '슬라이더를 조절하세요'}
                </div>
              </div>
            </div>

            {/* 절감 이익 바 */}
            {efcSaving > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '22px' }}>
                {[['💪 연간 절감', `$${efcSaving.toLocaleString()}`, '년간 EFC 감소'],
                  ['🎓 Brown 4년', `$${(efcSaving * 4).toLocaleString()}`, '학부 4년 절감'],
                  ['🏥 Brown PLME 8년', `$${(efcSaving * 8).toLocaleString()}`, 'MD까지 8년 절감'],
                ].map(([icon, val, sub], i) => (
                  <div key={i} style={{ padding: '12px', background: 'rgba(167,139,250,.06)', border: '1px solid rgba(167,139,250,.15)', borderRadius: '10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>{icon}</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--purple-400)' }}>{val}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{sub}</div>
                  </div>
                ))}
              </div>
            )}

            {/* 전략 슬라이더들 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>

              {/* 1. 연금보험 */}
              <div className="card" style={{ padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>🏦 전략 1 — 현금/주식 → 연금보험(IRP) 전환</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>한국 개인연금보험은 CSS Profile 자산에서 <strong style={{ color: 'var(--green-400)' }}>제외</strong> → EFC 구조적 삭감</div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '80px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--green-400)' }}>-${Math.round(pensionUSD * 0.05).toLocaleString()}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>/년 EFC 절감</div>
                  </div>
                </div>
                <input type="range" min={0} max={300000000} step={10000000}
                  value={pensionKRW} onChange={e => setPensionKRW(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--green-400)', marginBottom: '4px' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>0원</span>
                  <span style={{ color: 'var(--green-400)', fontWeight: 700 }}>{(pensionKRW / 1e8).toFixed(1)}억원 전환 (~${pensionUSD.toLocaleString()})</span>
                  <span>3억원</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', padding: '8px', background: 'rgba(74,222,128,.05)', borderRadius: '6px', lineHeight: 1.5 }}>
                  💡 노뚩IRP · 신한은행 개인연금저축보험 등 적립. 한국 연금은 유동성이 낙아 CSS에서 컨 디스클띄트 혹은 제외 인정.
                </div>
              </div>

              {/* 2. 거주주택 제외 */}
              <div className="card" style={{ padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>🏠 전략 2 — 거주주택(중4) Primary Residence 제외</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Brown · Harvard는 해외 거주주택을 CSS에서 제외/할인 적용 가능. 중4 순자산 ~$131K</div>
                    {excludeHouse1 && (
                      <div style={{ fontSize: '11px', color: 'var(--green-400)', marginTop: '4px', fontWeight: 600 }}>
                        $131K 제외 → EFC -${Math.round(house1NetUSD * 0.05).toLocaleString()}/년
                      </div>
                    )}
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginLeft: '16px' }}>
                    <div style={{ position: 'relative', width: '46px', height: '26px' }}>
                      <input type="checkbox" checked={excludeHouse1} onChange={e => setExcludeHouse1(e.target.checked)}
                        style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }} />
                      <div style={{ position: 'absolute', inset: 0, background: excludeHouse1 ? 'var(--green-400)' : 'rgba(255,255,255,.15)', borderRadius: '13px', transition: '.3s' }} />
                      <div style={{ position: 'absolute', top: '4px', left: excludeHouse1 ? '24px' : '4px', width: '18px', height: '18px', background: 'white', borderRadius: '50%', transition: '.3s', boxShadow: '0 1px 3px rgba(0,0,0,.3)' }} />
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{excludeHouse1 ? '✅ 제외적용' : '현재포함'}</span>
                  </label>
                </div>
              </div>

              {/* 3. 부체 상환 */}
              <div className="card" style={{ padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>💳 전략 3 — 현금으로 부체 상환</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>대출금 상환 → 순자산 감소 → EFC 감소</div>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '80px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--blue-400)' }}>-${Math.round(debtUSD * 0.05).toLocaleString()}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>/년 EFC 절감</div>
                  </div>
                </div>
                <input type="range" min={0} max={200000000} step={10000000}
                  value={debtPayKRW} onChange={e => setDebtPayKRW(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--blue-400)', marginBottom: '4px' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>0원</span>
                  <span style={{ color: 'var(--blue-400)', fontWeight: 700 }}>{(debtPayKRW / 1e8).toFixed(1)}억원 상환 (~${debtUSD.toLocaleString()})</span>
                  <span>2억원</span>
                </div>
              </div>

              {/* 4. 코미 명의 자산 주의 */}
              <div className="card" style={{ padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--rose-400)' }}>⚠️ 주의 — 코미 명의 자산 (자녀 20% 폘널티)</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>자녀 자산은 <strong style={{ color: 'var(--rose-400)' }}>20%로 계산</strong> (vs 부모 5%). 코미 쫙에 돈을 두면 4배 손해!</div>
                    {childAssetKRW > 0 && (
                      <div style={{ fontSize: '11px', color: 'var(--rose-400)', marginTop: '4px', fontWeight: 600 }}>
                        코미 목의 ${childUSD.toLocaleString()} → EFC +${childPenaltyUSD.toLocaleString()}/년 추가 손해!
                      </div>
                    )}
                  </div>
                </div>
                <input type="range" min={0} max={100000000} step={5000000}
                  value={childAssetKRW} onChange={e => setChildAssetKRW(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--rose-400)', marginBottom: '4px' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>0원</span>
                  <span style={{ color: childAssetKRW > 0 ? 'var(--rose-400)' : 'var(--text-muted)', fontWeight: 700 }}>코미 목의 {(childAssetKRW / 1e8).toFixed(2)}억원 (~${childUSD.toLocaleString()})</span>
                  <span>1억원</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--rose-400)', marginTop: '8px', padding: '8px', background: 'rgba(251,113,133,.05)', borderRadius: '6px', lineHeight: 1.5 }}>
                  🔴 수력금 등을 코미 이름으로 보내는 것도 코미의 학생자산이 되어 손해. CSS 제출 전 1-2년부툄 모든 은행계좌는 부모 명의로 통일할 것.
                </div>
              </div>
            </div>

            {/* 요약 테이블 */}
            <div className="card">
              <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px' }}>📊 전략별 EFC 절감 요약</div>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>전략</th>
                      <th>적용액</th>
                      <th>EFC 절감/년</th>
                      <th>4년 코포</th>
                      <th>8년(PLME)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: '🏦 연금보험 전환', applied: `${(pensionKRW/1e8).toFixed(1)}억원`, saving: Math.round(pensionUSD * 0.05) },
                      { label: '🏠 거주주택 제외', applied: excludeHouse1 ? '적용' : '미적용', saving: excludeHouse1 ? Math.round(house1NetUSD * 0.05) : 0 },
                      { label: '💳 부체 상환', applied: `${(debtPayKRW/1e8).toFixed(1)}억원`, saving: Math.round(debtUSD * 0.05) },
                    ].map((row, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{row.label}</td>
                        <td style={{ fontSize: '12px' }}>{row.applied}</td>
                        <td style={{ color: row.saving > 0 ? 'var(--green-400)' : 'var(--text-muted)', fontWeight: 600 }}>
                          {row.saving > 0 ? `-$${row.saving.toLocaleString()}` : '$0'}
                        </td>
                        <td style={{ color: row.saving > 0 ? 'var(--green-400)' : 'var(--text-muted)' }}>
                          {row.saving > 0 ? `-$${(row.saving * 4).toLocaleString()}` : '-'}
                        </td>
                        <td style={{ color: row.saving > 0 ? 'var(--gold-400)' : 'var(--text-muted)' }}>
                          {row.saving > 0 ? `-$${(row.saving * 8).toLocaleString()}` : '-'}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ background: 'rgba(74,222,128,.06)', fontWeight: 700 }}>
                      <td style={{ color: 'var(--green-400)' }}>🏆 합계 절감</td>
                      <td style={{ fontSize: '12px' }}>EFC {estimatedEFC.toLocaleString()} → {optEFC.toLocaleString()}</td>
                      <td style={{ color: 'var(--green-400)' }}>{efcSaving > 0 ? `-$${efcSaving.toLocaleString()}` : '$0'}</td>
                      <td style={{ color: 'var(--green-400)' }}>{efcSaving > 0 ? `-$${(efcSaving*4).toLocaleString()}` : '$0'}</td>
                      <td style={{ color: 'var(--gold-400)', fontSize: '14px' }}>{efcSaving > 0 ? `-$${(efcSaving*8).toLocaleString()}` : '$0'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '12px', lineHeight: 1.7, padding: '10px', background: 'rgba(255,255,255,.03)', borderRadius: '8px' }}>
                ⚠️ 이 계산은 CSS Profile <strong>추정값</strong>입니다. 실제 Aid는 각 학교가 CSS 제출 후 독립적으로 산정.
                중4 연금보험 전환은 <strong>코미 입학 전 2-3년 안에 시작하는 것이 최적</strong> (CSS에는 최근 2년 자산변동 추적 가능).
              </div>
            </div>

          </div>
        );
      })()}
    </div>
  );
}
