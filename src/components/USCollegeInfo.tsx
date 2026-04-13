'use client';

import { useState } from 'react';

type Tab = 'original' | 'intl' | 'cds';

// ────────────────────────────────────────────────
//  학교 상세 정보 DB
// ────────────────────────────────────────────────
type EvalCriterion = {
  label: string;   // e.g., "에세이"
  weight: '핵심' | '높음' | '중간' | '참고';  // importance
  note: string;    // 한 줄 설명
};

type SchoolDetail = {
  fullName: string;
  location: string;
  type: string;
  founded: string;
  size: string;
  acceptRate: string;
  intlRate: string;
  satPolicy: '필수 제출' | '선택 제출' | '점수 미반영';  // SAT 제출 정책
  satRange: string;
  satRangeKR: string;   // 한국 국적 지원자 실질 경쟁 범위
  tuition: string;
  coa: string;
  needBlindDomestic: boolean;
  needBlindIntl: boolean;
  avgAid: string;
  avgAidKR: string;    // 한국 중산층 가정 추정 재정지원
  preMedRating: '최상' | '상' | '중상' | '중' | '보통' | '낮음';
  preMedNote: string;
  bsMd: boolean;
  bsMdProgram: string;
  applyTypes: string[];
  mapX: number;  // % from left on US map
  mapY: number;  // % from top on US map
  color1: string;
  color2: string;
  emoji: string;
  kkumiNote: string;
  panamaNote: string;  // 파나마 국제학교 출신 포지셔닝 분석
  chemNote: string;   // 화학 관련 정보
  evalCriteria: EvalCriterion[];  // 사정관이 중점적으로 보는 평가 기준
};


const schoolDB: Record<string, SchoolDetail> = {
  'MIT': {
    fullName: 'Massachusetts Institute of Technology',
    location: 'Cambridge, MA',
    type: '사립 연구중심대학',
    founded: '1861년',
    size: '약 11,500명',
    acceptRate: '~3.9%',
    intlRate: '~4%',
    satPolicy: '필수 제출',
    satRange: '1510 ~ 1580',
    satRangeKR: '1550 ~ 1590 (수학 800 기본 기대치)',
    tuition: '$59,750',
    coa: '~$82,000/년',
    needBlindDomestic: true,
    needBlindIntl: true,
    avgAid: '평균 $55,000+ (전체 학생)',
    avgAidKR: '~$30,000~45,000 추정 (CSS Profile 기반, 한국 자산 포함 시 감소 가능)',  
    preMedRating: '상',
    preMedNote: 'Pre-Med 트랙 있음. 단, 학교 이미지가 공학·CS 중심이라 의대 지원 시 불리하진 않지만 Bio/화학 Pre-Med 분위기는 Johns Hopkins보다 약함',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['RD'],
    mapX: 91, mapY: 28,
    color1: '#A31F34',
    color2: '#6B0F1F',
    emoji: '⚡',
    kkumiNote: 'SAT 1570 + 수학 800 만점은 MIT 지원자 평균 수준. 국제학생 Need-Blind라 재정지원 가능. 단 ED 없이 RD만 운영하므로 조기지원 이점 없음. Pre-Med보다 공학·STEM 스탬프가 강한 학교.',
    panamaNote: '📍 평가 담당: 라틴아메리카 지역 사정관 — 한국 고교생과 완전히 다른 풀. 파나마 → MIT 지원자는 연간 극소수(사실상 0~2명 수준)라 지역 희소성이 실질적 플러스 요소. 한국 국적이지만 파나마 국제학교 재학을 통해 "한국 학생 클러스터" 부담에서 벗어남 — 이것이 핵심 전략적 강점. 단, 한국 국적이므로 CSS Profile 재정지원 계산은 한국 가정 기준 그대로 적용. MIT 에세이에서 파나마 다문화 경험을 녹이면 강력한 차별화 가능.',
    chemNote: '🏆 세계 Top3 화학과. Nobel 수상자 교수진이 직접 강의. 생화학(5.07), 유기화학(5.12) 코스는 전미 최고 수준의 깊이를 자랑함. 꾸미처럼 화학을 좋아한다면 연구 기회가 무한하며 Premed-Chemistry 연계가 탄탄함. 단, 내부 경쟁이 극심해 학점 관리가 도전적.',
    evalCriteria: [
      { label: 'STEM 실력', weight: '핵심', note: '수학·과학 성취가 압도적이어야 함. 수학 800점은 기본 기대치' },
      { label: '연구 경험', weight: '핵심', note: '실제 연구 프로젝트·수상·발명 경험이 큰 차별화 요소' },
      { label: '에세이', weight: '높음', note: '창의적 문제해결 방식과 지적 호기심을 보여야 함' },
      { label: 'GPA / 학업 성취', weight: '높음', note: '최상위 성적 필수. AP·IB 고급 과목 이수 중요' },
      { label: '과외활동', weight: '중간', note: '깊이 있는 STEM 관련 활동 (올림피아드, 경시대회, 연구 인턴십 등)' },
      { label: '추천서', weight: '중간', note: '수학·과학 교사의 강력한 학문적 추천서 요구' },
    ],
  },
  'Caltech': {
    fullName: 'California Institute of Technology',
    location: 'Pasadena, CA',
    type: '사립 이공계 특화대학',
    founded: '1891년',
    size: '약 2,400명 (초소규모)',
    acceptRate: '~3.9%',
    intlRate: '~4%',
    satPolicy: '필수 제출',
    satRange: '1530 ~ 1580',
    satRangeKR: '1560 ~ 1600 (수학 800 필수 수준)',
    tuition: '$60,816',
    coa: '~$84,000/년',
    needBlindDomestic: true,
    needBlindIntl: false,
    avgAid: '평균 $50,000+ (전체 학생)',
    avgAidKR: '~$15,000~30,000 추정 (Need-Aware — 국제학생 지원 불확실)',  
    preMedRating: '낮음',
    preMedNote: '순수 이공계·연구 중심. Pre-Med 문화 자체가 약함. 의대 진학을 목표로 한다면 최적의 환경은 아님',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 11, mapY: 62,
    color1: '#FF6C0C',
    color2: '#C04F00',
    emoji: '🔬',
    kkumiNote: '꾸미의 SAT 수학 800점 만점은 여기선 기본 수준. Pre-Med 목표와 방향이 다소 다름. 국제학생 Need-Aware라 재정지원 보장 안 됨. 연구에 관심 있다면 지원해볼 수 있지만 우선순위는 낮음.',
    panamaNote: '📍 평가 담당: 라틴아메리카 지역 사정관으로 한국 고교 지원자와 다른 풀. 단, Caltech은 연간 신입생 ~235명의 초소규모라 라틴아메리카 지역 전체 합격자 수 자체가 극히 제한적. 지역 희소성 효과는 존재하지만 MIT·Stanford 대비 약함. Caltech 합격의 80%는 STEM 실력 그 자체 — 파나마 배경보다 수학 능력·연구 경험 입증이 절대 우선. 파나마 효과: 보통 수준.',
    chemNote: '💎 세계 최정상 화학과 (글로벌 Top3). Linus Pauling(화학결합 이론, 2회 Nobel 수상)의 학교. 학부생이 교수와 1:1 연구를 하는 문화가 정착되어 있어 화학 좋아하는 학생에겐 천국. 분자생물학·계산화학 분야 독보적. 단, Pre-Med 화학으로 접근하기보단 순수 화학 연구자 양성에 초점이 맞춰져 있음.',
    evalCriteria: [
      { label: 'STEM 순수 실력', weight: '핵심', note: '수학·물리 성취가 압도적이어야 함. 수학 800 거의 필수' },
      { label: '연구 경험', weight: '핵심', note: '실험실 연구·발명·학술 출판 경험이 결정적 차별화 요소' },
      { label: 'GPA', weight: '높음', note: '최상위 이공계 성적. AP 물리·화학·수학 BC 만점 기대' },
      { label: '에세이', weight: '중간', note: '지적 열정과 과학적 사고 방식을 보여야 함' },
      { label: '추천서', weight: '중간', note: '수학·과학 교사의 학문적 능력 증명 추천서' },
      { label: '다양성', weight: '참고', note: '소규모(235명)라 다양성 고려하지만 STEM 실력이 절대 우선' },
    ],
  },
  'Stanford': {
    fullName: 'Stanford University',
    location: 'Stanford (Palo Alto), CA',
    type: '사립 연구중심대학',
    founded: '1885년',
    size: '약 17,000명',
    acceptRate: '~3.7%',
    intlRate: '~4%',
    satPolicy: '필수 제출',
    satRange: '1500 ~ 1570',
    satRangeKR: '1540 ~ 1580 (수학 800 기대치)',
    tuition: '$62,484',
    coa: '~$82,000/년',
    needBlindDomestic: true,
    needBlindIntl: false,
    avgAid: '평균 $56,000+ (전체 학생)',
    avgAidKR: '~$15,000~30,000 추정 (Need-Aware — 고소득 한국 가정은 지원 거의 없음 가능)',  
    preMedRating: '최상',
    preMedNote: 'Human Biology 전공 Pre-Med 최상급. Stanford Medical School은 전국 Top 3. Pre-Med 분위기와 mentoring 환경 모두 탁월',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['REA', 'RD'],
    mapX: 6, mapY: 48,
    color1: '#8C1515',
    color2: '#5A0A0A',
    emoji: '🌲',
    kkumiNote: 'Pre-Med 목표에 완벽한 환경. 단, REA(제한적 조기전형)라 지원 시 다른 사립 EA/ED 동시 지원 불가. 국제학생 Need-Aware이지만 재정지원 매우 후함. 꾸미 스펙으로 최상위 Dream 학교.',
    panamaNote: '📍 파나마 효과 최상급 ★★★. Stanford는 세 학교 중 지역 다양성을 가장 적극적으로 가치 있게 봄. 라틴아메리카 지역 사정관 평가 + Stanford만의 "다양한 삶의 경험" 중시 철학이 꾸미 프로필과 강하게 맞닿음. 파나마 한인 정체성·다문화 환경·국제학교 경험은 REA 에세이의 매우 강력한 소재. "한국 학생 경쟁" 부담 없이 중미·카리브 지역에서 매우 특별한 지원자로 포지셔닝 가능. 단, REA 조기 지원 여부 결정이 2025년 하반기 핵심 전략 분기점.',
    chemNote: '⭐ Stanford 화학과는 Chemical Biology (화학+생물 융합) 분야 세계 1위 수준. Stanford Medical School과 직접 연결되어 의학-화학 인터페이스 연구가 활발함. 꾸미처럼 화학+Pre-Med 조합을 원한다면 최적의 환경. Biochemistry, Organic Chemistry 강의 수준 최상. 학부 연구(SURF 프로그램) 통해 실제 연구 참여 가능.',
    evalCriteria: [
      { label: '에세이', weight: '핵심', note: '삶의 서사·다양성·자신만의 관점. "What matters most to you and why?"' },
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 어려운 과목(AP/IB) 선택이 중요' },
      { label: '리더십·임팩트', weight: '높음', note: '커뮤니티에 실질적 변화를 만든 리더십 증거 요구' },
      { label: '과외활동', weight: '높음', note: '넓게보다 깊게. 한두 가지에서 탁월한 성과를 낸 증거' },
      { label: '추천서', weight: '중간', note: '담임·교과목 교사 모두에서 인격·학업 능력 보증' },
      { label: '인터뷰', weight: '중간', note: '동문(alumni) 인터뷰 — 인성·호기심·커뮤니케이션 평가' },
    ],
  },

  'Yale': {
    fullName: 'Yale University',
    location: 'New Haven, CT',
    type: '사립 연구중심대학 (Ivy League)',
    founded: '1701년 (미국 3번째로 오래된 대학)',
    size: '약 14,000명 (학부 ~6,000명)',
    acceptRate: '~3.7%',
    intlRate: '~3%',
    satPolicy: '필수 제출',
    satRange: '1500 ~ 1570',
    satRangeKR: '1540 ~ 1580 (수학 800 기대치)',
    tuition: '$64,700',
    coa: '~$84,000/년',
    needBlindDomestic: true,
    needBlindIntl: true,
    avgAid: '평균 $62,000+ (전체 학생)',
    avgAidKR: '~$35,000~50,000 추정 (Need-Blind — CSS Profile 기반, 한국 중산층 가정 기준)',
    preMedRating: '최상',
    preMedNote: 'Yale School of Medicine 전국 Top 5. Pre-Med 환경과 Biology/Chemistry 연계 최상급. 내부 경쟁은 있지만 JHU보다 협력적 문화로 알려짐. 의대 진학률 전국 최상위권 유지.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['REA', 'RD'],
    mapX: 90,
    mapY: 35,
    color1: '#00356B',
    color2: '#001F3F',
    emoji: '🏛️',
    kkumiNote: '국제학생 Need-Blind + REA 조기전형 = 꾸미에게 재정지원 + 조기합격 두 마리 토끼 가능. Pre-Med 환경 최상, 에세이 중시 학교라 파나마 다문화 스토리가 강점이 됨. 세 Ivy 중 가장 인문학적 감수성을 중시.',
    panamaNote: '📍 국제학생 Need-Blind → 파나마 출신이어도 재정지원 걱정 없음. 라틴아메리카 지역 사정관 평가. Yale은 다양한 삶의 배경·서사를 에세이에서 매우 중시하는 학교 — 파나마 한인 스토리가 강력한 소재. 파나마 → Yale 지원자는 연간 극히 드물어 희소성 효과 있음. REA 지원 권장 (조기 합격률 > RD).',
    chemNote: '🔷 Yale 화학과 전국 Top 10. 특히 생물의학 화학(Biomedical Chemistry)·합성화학 연구 활발. Yale SOM(의대)과 연계해 의학-화학 인터페이스 연구 기회 풍부. Pre-Med 화학 트랙 탁월. Nobel 수상자 출신 교수진 다수. 학부 연구 참여(Bass Fellowship 등) 적극 지원.',
    evalCriteria: [
      { label: '에세이', weight: '핵심', note: '인문학적 감수성과 Yale 커뮤니티 기여를 보여야 함. Why Yale? 중요' },
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적. AP·IB 도전적 과목 이수가 중요' },
      { label: '과외활동', weight: '높음', note: '예술·음악·스포츠 등 Yale은 전인격적 활동 매우 중시' },
      { label: '추천서', weight: '높음', note: '교사 2명 + 카운슬러 추천서. 인격 및 지적 성장 서술 핵심' },
      { label: '다양성', weight: '높음', note: '독특한 배경·경험·시각이 Yale 커뮤니티에 기여하는 점' },
      { label: '인터뷰', weight: '중간', note: '동문 인터뷰 실시. Yale에 대한 진정한 관심 표현 필요' },
    ],
  },

  'Harvard': {
    fullName: 'Harvard University',
    location: 'Cambridge, MA',
    type: '사립 연구중심대학 (Ivy League)',
    founded: '1636년 (미국 최초의 대학)',
    size: '약 23,000명 (학부 ~7,000명)',
    acceptRate: '~3.6%',
    intlRate: '~3%',
    satPolicy: '필수 제출',
    satRange: '1500 ~ 1580',
    satRangeKR: '1540 ~ 1580 (수학 800 기대치)',
    tuition: '$59,950',
    coa: '~$82,000/년',
    needBlindDomestic: true,
    needBlindIntl: true,
    avgAid: '평균 $62,000+ (전체 학생)',
    avgAidKR: '~$35,000~50,000 추정 (Need-Blind — CSS Profile 기반, 한국 중산층 가정 기준)',
    preMedRating: '최상',
    preMedNote: 'Harvard Medical School과 같은 캠퍼스 인접. Pre-Med 환경·의대 진학률 전국 최상위. 내부 경쟁 극심하지만 멘토링·연구 기회 독보적. Biochemical Sciences 전공 Pre-Med 트랙 최강.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['REA', 'RD'],
    mapX: 92,
    mapY: 27,
    color1: '#A51C30',
    color2: '#7A0E20',
    emoji: '📚',
    kkumiNote: '세계 최고 인지도 + 국제학생 Need-Blind + Pre-Med 최강 3박자. REA 지원 시 조기 합격 발표(12월). 꾸미 SAT 1570은 합격자 중간 수준. 단 내부 경쟁 매우 치열하고 학점 관리가 도전적. Harvard Medical School 파이프라인은 실질적 장점.',
    panamaNote: '📍 국제학생 Need-Blind → 파나마 출신 재정지원 안심. 라틴아메리카 지역 담당 사정관 평가. Harvard는 매년 파나마에서 학생 선발이 극소수 → 지역 희소성 효과 명확. REA 지원 시 파나마 국제학교 출신이라는 독특한 프로필이 더욱 부각됨. 재정지원 최대화를 원한다면 Harvard REA는 강력한 선택지.',
    chemNote: '⚗️ Harvard 화학과 전국 Top 5. 화학생물학(Chemical Biology)·합성생물학 연구 세계적 수준. Biochemical Sciences 학위 과정에서 Pre-Med + 화학 시너지 최고. 학부 연구 참여(HURO 프로그램) 적극 지원. MIT와 인접해 공동 연구·강의 교류도 가능.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. AP 5점 다수, Valedictorian급 기대' },
      { label: '에세이', weight: '핵심', note: '개인 서사와 지적 호기심. 단순 성취 나열 X, 스토리텔링 필수' },
      { label: '과외활동·임팩트', weight: '핵심', note: '주·국가·국제 수준의 리더십 또는 업적이 있어야 함' },
      { label: '추천서', weight: '높음', note: '교사 추천서 품질이 매우 중요. 탁월함을 구체적 사례로 증명' },
      { label: '인터뷰', weight: '높음', note: '동문 인터뷰 필수. 지적 호기심·인성·하버드 적합성 평가' },
      { label: '다양성', weight: '중간', note: '파나마 출신 등 지역 다양성, 1세대 이민자 배경 고려' },
    ],
  },

  'Princeton': {
    fullName: 'Princeton University',
    location: 'Princeton, NJ',
    type: '사립 연구중심대학 (Ivy League)',
    founded: '1746년',
    size: '약 10,000명 (학부 ~5,500명 — 학부 중심 대학)',
    acceptRate: '~3.9%',
    intlRate: '~4%',
    satPolicy: '필수 제출',
    satRange: '1500 ~ 1570',
    satRangeKR: '1540 ~ 1580 (수학 800 기대치)',
    tuition: '$59,710',
    coa: '~$82,000/년',
    needBlindDomestic: true,
    needBlindIntl: true,
    avgAid: '평균 $65,000+ (전체 학생 — Ivy 중 최고 수준)',
    avgAidKR: '~$40,000~55,000 추정 (Need-Blind + Princeton 재정지원 특히 후함)',
    preMedRating: '상',
    preMedNote: 'Princeton에는 의대(Medical School)가 없음. 단, Molecular Biology 전공이 Pre-Med에 최적화되어 있어 의대 진학률은 높음. 학부 연구(Junior/Senior Thesis 의무)로 졸업 전 연구 경험 충분히 쌓을 수 있음.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['REA', 'RD'],
    mapX: 87,
    mapY: 39,
    color1: '#EE7F2D',
    color2: '#B85C00',
    emoji: '🦁',
    kkumiNote: '세 Ivy 중 학부생 교육 가장 집중 (대학원 상대적으로 작음). 국제학생 Need-Blind + Ivy 중 재정지원 가장 후함. 학부 연구 의무(Thesis)로 의대 지원용 연구 경험 확보 유리. 단 Princeton 자체엔 의대 없어 졸업 후 타 의대 진학해야 함.',
    panamaNote: '📍 국제학생 Need-Blind + Ivy 중 재정지원 최고 수준 → 파나마 출신 꾸미에게 재정 측면 최적. Princeton은 학부 규모가 작아 국제학생 지역 다양성을 더욱 중시. 파나마 출신 Princeton 지원자는 사실상 매우 드문 케이스 → 희소성 극대화 가능. 라틴아메리카 사정관 평가. Princeton도 REA 조기 지원 권장.',
    chemNote: '🔬 Princeton 화학과 전국 Top 10. 이론화학·계산화학 분야 세계적 수준. Molecular Biology과의 연계 강의 풍부해 Pre-Med 화학 트랙 탁월. 학부 Junior Paper + Senior Thesis 의무 과정에서 실질적 연구 경험 축적 가능. 꾸미의 화학 관심 + Pre-Med 목표에 Princeton 연구 문화가 잘 맞음.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '학업이 최우선. AP·IB 최상위 성적. 도전적 커리큘럼 필수' },
      { label: '에세이', weight: '핵심', note: '"Your voice" 중시. Princeton만을 위한 Why Princeton? 에세이 매우 중요' },
      { label: 'SAT/ACT', weight: '높음', note: 'Princeton은 시험 점수를 중요하게 봄. 1550+ 글로벌 풀 기대' },
      { label: '추천서', weight: '높음', note: '교사 2명 + 카운슬러. 학문적 탁월함을 구체적으로 서술해야 함' },
      { label: '과외활동', weight: '높음', note: '연구·창작·리더십에서 실질적 성과. 학부 Thesis 의무와 연계' },
      { label: '인터뷰', weight: '중간', note: '동문 인터뷰 실시. Princeton 커뮤니티 기여 의지 표현 필요' },
    ],
  },

  'Columbia': {
    fullName: 'Columbia University',
    location: 'New York City, NY (Upper West Side)',
    type: '사립 연구중심대학 (Ivy League)',
    founded: '1754년 (미국 5번째로 오래된 대학)',
    size: '약 35,000명 (학부 ~9,000명)',
    acceptRate: '~3.9%',
    intlRate: '~4%',
    satPolicy: '필수 제출',
    satRange: '1510 ~ 1580',
    satRangeKR: '1550 ~ 1590 (수학 800 기대치)',
    tuition: '$67,314',
    coa: '~$90,000/년 (NYC 생활비 포함)',
    needBlindDomestic: true,
    needBlindIntl: false,
    avgAid: '평균 $63,000+ (전체 학생)',
    avgAidKR: '~$20,000~35,000 추정 (Need-Aware — 국제학생 재정지원 불확실, NYC 생활비 고려 필수)',
    preMedRating: '최상',
    preMedNote: 'Columbia Medical Center(Vagelos P&S 의대) + NYC 최대 병원군 인접. Pre-Med 환경 탁월하지만 내부 경쟁 극심. 뉴욕 병원·연구기관(Sloan Kettering, Rockefeller University 등)과의 연계는 독보적',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED', 'RD'],
    mapX: 88,
    mapY: 37,
    color1: '#1D4E8F',
    color2: '#0B2D5E',
    emoji: '🗽',
    kkumiNote: 'NYC 위치로 COA ~$90,000 — 6개교 중 생활비 가장 높음. Need-Aware(국제학생)라 재정지원 불확실. 최근 합격률 급락(~4%)으로 실질 난이도 상승. 단 NYC 의료·연구 환경은 Pre-Med에 세계 최고 수준. ED 지원 시 합격률 소폭 상승.',
    panamaNote: '📍 Need-Aware(국제학생) → 재정지원 불확실, Ivy 중 재정 리스크 가장 큰 학교. 라틴아메리카 사정관 평가. NYC의 히스패닉·라틴아메리카 커뮤니티 문화와 파나마 배경이 잘 연결됨. ED 지원 시 합격 가능성 소폭 유리. 파나마 → Columbia 지원자 역시 극소수 → 희소성 효과 존재.',
    chemNote: '🗽 Columbia 화학과 전국 Top 10. NYC라는 위치 덕분에 Columbia Medical Center·Memorial Sloan Kettering(암연구 세계 1위)·Rockefeller University 등 주변 세계 최고 연구기관 직접 접근 가능. 화학+생의학 연구 인턴십 기회 독보적. 도시에서 연구하고 싶다면 여기가 최적.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. Core Curriculum 이수 의지도 평가 요소' },
      { label: 'Why Columbia 에세이', weight: '핵심', note: 'NYC 도시 환경 활용 계획과 Columbia 특정 교육 철학 언급 필수' },
      { label: 'SAT/ACT', weight: '높음', note: '1550+ 기대. 국제학생 경쟁풀에서도 상위권 필요' },
      { label: '과외활동', weight: '높음', note: 'NYC 기반 활동·인턴십·리더십 경험이 Columbia와 궁합 좋음' },
      { label: '추천서', weight: '중간', note: '교사·카운슬러 추천서. 학업 능력과 저변을 보여야 함' },
      { label: '다양성', weight: '중간', note: 'Columbia는 NYC 다양성을 강하게 중시함' },
    ],
  },

  'U of Chicago': {
    fullName: 'University of Chicago',
    location: 'Chicago, IL (Hyde Park)',
    type: '사립 연구중심대학',
    founded: '1890년',
    size: '약 18,000명 (학부 ~7,000명)',
    acceptRate: '~5.4%',
    intlRate: '~5%',
    satPolicy: '필수 제출',
    satRange: '1500 ~ 1570',
    satRangeKR: '1540 ~ 1580 (수학 800 기대치)',
    tuition: '$65,391',
    coa: '~$85,000/년',
    needBlindDomestic: true,
    needBlindIntl: false,
    avgAid: '평균 $61,000+ (전체 학생)',
    avgAidKR: '~$20,000~35,000 추정 (Need-Aware — 국제학생 재정지원 불확실)',
    preMedRating: '상',
    preMedNote: 'Pre-Med 학생 비율 상대적으로 낮고 학교 문화가 지적·이론 중심. Pritzker School of Medicine 연계 있지만 의대 진학보다 연구·학문 지향적. Core Curriculum(필수 교양 과목) 의무라 시간 부담 있음.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['REA', 'RD'],
    mapX: 65,
    mapY: 33,
    color1: '#800000',
    color2: '#5A0000',
    emoji: '📖',
    kkumiNote: '"Why UChicago" 에세이가 매우 중요한 학교 — 단순 성적보다 지적 호기심·분석 능력 평가 중시. Core Curriculum이 강력해 Pre-Med 학점 관리 도전적. Need-Aware(국제학생)라 재정지원 불확실. REA 조기 지원 가능. 화학을 깊이 공부하고 싶다면 매력적.',
    panamaNote: '📍 Need-Aware(국제학생) → 재정지원 불확실. 라틴아메리카 사정관 평가. UChicago는 독특한 에세이 질문으로 유명 — 파나마 한인이라는 독특한 관점과 지적 서사가 강점. REA 지원 전략 고려. Chicago 도시 자체의 히스패닉 커뮤니티 문화 + 파나마 배경의 접점.',
    chemNote: '⚗️ UChicago 화학과 전국 Top 5 — Nobel 수상자 다수 배출 (역사적으로 화학·물리화학 세계 최정상). Chicago는 방사성 원소 최초 원자력 반응(맨해튼 프로젝트)의 발상지. 단, 학교 분위기가 매우 이론적이라 Pro-Med 실용 화학보다 순수 화학 연구에 무게. 화학 자체를 열정적으로 공부하고 싶은 학생에게 최상.',
    evalCriteria: [
      { label: '에세이·지적 호기심', weight: '핵심', note: '독특한 UChicago 에세이("Extended Essay")가 핵심. 창의적·철학적 사고 요구' },
      { label: 'GPA / 학업성취', weight: '핵심', note: '이론 중심 커리큘럼에 맞는 학문적 깊이 필요. 도전적 과목 이수' },
      { label: '추천서', weight: '높음', note: '지적 성장을 잘 아는 교사 추천서. "이 학생을 왜 사랑하나요?" 수준의 서술' },
      { label: '과외활동', weight: '중간', note: '학문적 클럽·연구·토론 등 지적 활동 선호' },
      { label: 'SAT/ACT', weight: '중간', note: '점수보다 에세이 비중이 높은 학교지만 1520+ 권장' },
      { label: 'Why UChicago', weight: '핵심', note: 'Core Curriculum·교수진·특정 프로그램에 대한 구체적 이유 필수' },
    ],
  },

  'Brown': {
    fullName: 'Brown University',
    location: 'Providence, RI',
    type: '사립 연구중심대학 (Ivy League)',
    founded: '1764년',
    size: '약 11,000명 (학부 ~7,000명)',
    acceptRate: '~5.1%',
    intlRate: '~5%',
    satPolicy: '필수 제출',
    satRange: '1490 ~ 1570',
    satRangeKR: '1530 ~ 1570 (비공식 추정 — Ivy 중 상대적으로 유연)',
    tuition: '$66,636',
    coa: '~$87,000/년',
    needBlindDomestic: true,
    needBlindIntl: true,
    avgAid: '평균 $58,000+ (전체 학생)',
    avgAidKR: '~$30,000~45,000 추정 (Need-Blind — CSS Profile 기반, 한국 중산층 가정 기준)',
    preMedRating: '최상',
    preMedNote: '🏥 PLME (Program in Liberal Medical Education) — 입학 시 의대 보장 8년 BS-MD 프로그램. MCAT 불필요. Pre-Med 환경 최상급. Open Curriculum으로 자유롭게 전공 설계 가능. PLME 별도 지원 필수 (합격률 ~2~3%).\n\n⚠️ 국제학생 주의: 지원 자체는 가능하나, 미국 의대(Brown Alpert Medical School)는 US 시민권자/영주권자(PR) 강력 우대. 8년 후 의대 입학 시점에 국적 상태가 핵심 변수 — 영주권/시민권 미취득 시 "보장" 흔들릴 수 있음. 부모님과 장기 국적 플랜 필수 검토.',
    bsMd: true,
    bsMdProgram: 'PLME (8년 BS-MD)',
    applyTypes: ['ED', 'RD'],
    mapX: 91,
    mapY: 33,
    color1: '#4E3629',
    color2: '#2E1F18',
    emoji: '🏥',
    kkumiNote: '꾸미 Pre-Med 목표 기준 최우선 고려 학교. PLME 합격 시 의대 보장 + MCAT 불필요. 국제학생 Need-Blind라 재정 걱정 없음. Open Curriculum으로 화학+Bio 자유 조합 가능. ED 지원 + PLME 동시 지원 전략 필요. ⚠️ 단, 한국 국적 유지 시 8년 후 의대 입학 시점 국적 제약 확인 필수. 2026 지원의 핵심 카드 중 하나!',
    panamaNote: '📍 Need-Blind(국제학생) → 파나마 출신 재정지원 안심. ED 지원 시 합격 가능성 유리. Brown Open Curriculum 철학이 다양한 배경 학생을 환영하는 문화 — 파나마 한인 스토리와 매우 잘 맞음. PLME 인터뷰 있음 — 파나마에서의 의료 경험·관찰 스토리가 강력한 소재. 라틴아메리카 사정관 평가.',
    chemNote: '🏥 Brown 화학과는 Pre-Med 화학 연계 최상. PLME 학생들의 화학+의학 경로 잘 구축. 특히 생화학(Biochemistry)·약학 화학 분야 연구 활발. Open Curriculum 덕분에 화학 + 의대 프리트랙을 자유롭게 조합 가능. 꾸미처럼 화학 좋아하는 Pre-Med 학생에게 PLME 내 화학 전공 경로는 최상의 조합.',
    evalCriteria: [
      { label: '에세이', weight: '핵심', note: 'Brown의 Open Curriculum 철학에 대한 이해와 자기주도 학습 계획 필수' },
      { label: '과외활동·열정', weight: '핵심', note: '한 분야에 대한 깊은 관심과 열정이 있는 "spike" 지원자 선호' },
      { label: 'GPA / 학업성취', weight: '높음', note: '최상위 성적 필수. 도전적 과목 선택이 중요' },
      { label: '추천서', weight: '높음', note: '교사 추천서가 개인 성격과 학문적 열정을 잘 표현해야 함' },
      { label: '다양성', weight: '높음', note: 'Brown은 다양한 배경·사고방식을 가진 학생을 매우 강하게 선호' },
      { label: 'PLME 전형', weight: '핵심', note: '(PLME 지원 시) 별도 에세이+인터뷰. 의학적 관심과 인성 평가' },
    ],
  },

  'Dartmouth': {
    fullName: 'Dartmouth College',
    location: 'Hanover, NH',
    type: '사립 연구중심대학 (Ivy League)',
    founded: '1769년',
    size: '약 8,000명 (학부 ~4,500명 — Ivy 중 가장 소규모)',
    acceptRate: '~5.8%',
    intlRate: '~5%',
    satPolicy: '필수 제출',
    satRange: '1490 ~ 1570',
    satRangeKR: '1530 ~ 1570 (비공식 추정)',
    tuition: '$65,511',
    coa: '~$86,000/년',
    needBlindDomestic: true,
    needBlindIntl: true,
    avgAid: '평균 $61,000+ (전체 학생)',
    avgAidKR: '~$30,000~45,000 추정 (Need-Blind — CSS Profile 기반)',
    preMedRating: '상',
    preMedNote: 'Geisel School of Medicine (Dartmouth 의대) 동일 캠퍼스 위치 — Pre-Med 파이프라인 강점. 소규모 학교라 예과 학생-교수 관계 밀접. 단 뉴햄프셔 시골 위치라 대형 병원 접근성 낮음.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED', 'RD'],
    mapX: 91,
    mapY: 25,
    color1: '#00693E',
    color2: '#004D2C',
    emoji: '🌲',
    kkumiNote: 'Ivy 중 가장 소규모(학부 ~4,500명). 국제학생 Need-Blind라 재정 안심. Geisel Medical School 동일 캠퍼스 Pre-Med 파이프라인. 단 뉴햄프셔 시골 위치 — 도시 선호 학생에게는 다소 제한적. ED 조기 지원 전략.',
    panamaNote: '📍 Need-Blind(국제학생) → 재정 안심. 라틴아메리카 사정관 평가. Ivy 중 가장 작은 커뮤니티 — 지역 다양성을 더욱 중시. 파나마 출신 Dartmouth 지원자는 극소수 → 희소성 효과 강함. 소규모 캠퍼스 문화와 파나마 한인 정체성이 독특한 스토리 구성에 유리.',
    chemNote: '🌲 Dartmouth 화학과는 전국 중상위권. 소규모 학교라 학부생-교수 1:1 연구 기회가 탁월. Geisel Medical School 연계 생화학·생의학 화학 연구 가능. Pre-Med 화학 환경 우수하지만 대형 연구 인프라는 MIT·Stanford 대비 제한적. 조용한 환경에서 집중적으로 연구에 몰입하고 싶은 학생에게 적합.',
    evalCriteria: [
      { label: '에세이', weight: '핵심', note: 'Dartmouth 커뮤니티 기여와 야외활동 문화 등 "Dartmouth 사람"되기 어필 필요' },
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적. AP·IB 도전적 과목. 소규모 강의 환경에 맞는 학업 깊이' },
      { label: '과외활동', weight: '높음', note: '특정 분야 깊이 있는 활동. 리더십·계절 스포츠·아웃도어 활동 호응 좋음' },
      { label: '추천서', weight: '높음', note: '소규모 학교라 추천서 품질이 합격에 미치는 영향 큼' },
      { label: '인터뷰', weight: '중간', note: '동문 인터뷰. Dartmouth 문화 fit과 커뮤니티 기여 의지 평가' },
      { label: '다양성', weight: '중간', note: '소규모라 지역 다양성(파나마 등 희소 지역) 가중치 있음' },
    ],
  },

  'UPenn': {
    fullName: 'University of Pennsylvania',
    location: 'Philadelphia, PA',
    type: '사립 연구중심대학 (Ivy League)',
    founded: '1740년 (Benjamin Franklin 설립)',
    size: '약 25,000명 (학부 ~10,000명)',
    acceptRate: '~5.7%',
    intlRate: '~5%',
    satPolicy: '필수 제출',
    satRange: '1500 ~ 1570',
    satRangeKR: '1540 ~ 1580 (수학 800 기대치)',
    tuition: '$65,554',
    coa: '~$88,000/년',
    needBlindDomestic: true,
    needBlindIntl: false,
    avgAid: '평균 $60,000+ (전체 학생)',
    avgAidKR: '~$20,000~35,000 추정 (Need-Aware — 국제학생 재정지원 불확실)',
    preMedRating: '최상',
    preMedNote: 'Perelman School of Medicine (Penn 의대, 전국 Top 5) 동일 캠퍼스. Pre-Med 환경 최상급. Penn Health System + HUP(University of Pennsylvania Hospital) 임상 경험 기회 독보적. 내부 Pre-Med 경쟁 있지만 JHU보다는 협력적.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED', 'RD'],
    mapX: 86,
    mapY: 40,
    color1: '#011F5B',
    color2: '#000E2E',
    emoji: '🔱',
    kkumiNote: 'Perelman 의대 동일 캠퍼스 → Pre-Med 최상 환경. Wharton(경영)+Engineering+의대 Pre-Med 복합 강점. Need-Aware(국제학생)라 재정 주의 필요. ED 지원 시 합격 가능성 소폭 상승. Philadelphia 생활비는 NYC보다 현저히 저렴.',
    panamaNote: '📍 Need-Aware(국제학생) → 재정지원 불확실. ED 지원 추천. 라틴아메리카 사정관 평가. Philadelphia의 다양한 히스패닉 커뮤니티 문화와 파나마 배경이 맥락적으로 연결됨. 파나마 → UPenn 지원자 극소수 → 희소성 효과. Penn의 글로벌 Health 프로그램과 파나마 의료 관심 연결 가능.',
    chemNote: '🔱 Penn 화학과 전국 Top 10. Perelman School of Medicine과의 연계로 Pre-Med 화학 트랙 탁월. 화학생물학(Chemical Biology)·생화학 분야 강함. 특히 Philadelphia 지역 제약산업(GlaxoSmithKline, Merck 등) 인접으로 화학 관련 인턴십 기회 풍부. 꾸미처럼 화학+의학 꿈이 있다면 Penn 화학과 Pre-Med 트랙이 실용적 강점.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. Penn의 전문적 학문 트랙(Wharton 등)에 맞는 성적' },
      { label: 'Why Penn 에세이', weight: '핵심', note: '특정 칼리지(Wharton·CAS·Engineering·Nursing)와 맞는 구체적 이유 필수' },
      { label: '과외활동·리더십', weight: '높음', note: '실용적 성과를 낸 리더십. Penn은 실용주의적 성취를 높이 평가' },
      { label: 'SAT/ACT', weight: '높음', note: '1550+ 기대. 국제학생 경쟁풀에서 상위권 필수' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학업 능력과 실용적 성취 서술' },
      { label: 'Pre-Med 관련 활동', weight: '높음', note: '(Pre-Med 지원 시) 병원 봉사·연구·의학 노출 경험 중요' },
    ],
  },

  'Cornell': {
    fullName: 'Cornell University',
    location: 'Ithaca, NY (Central NY)',
    type: '사립 연구중심대학 (Ivy League)',
    founded: '1865년',
    size: '약 24,000명 (학부 ~15,000명)',
    acceptRate: '~7.3%',
    intlRate: '~6%',
    satPolicy: '선택 제출',
    satRange: '1480 ~ 1570',
    satRangeKR: '1520 ~ 1570 (비공식 추정 — 상 2에서 상대적으로 유연)',
    tuition: '$66,014',
    coa: '~$88,000/년',
    needBlindDomestic: true,
    needBlindIntl: false,
    avgAid: '평균 $60,000+ (전체 학생)',
    avgAidKR: '~$20,000~35,000 추정 (Need-Aware — 국제학생 재정지원 불확실)',
    preMedRating: '상',
    preMedNote: 'Weill Cornell Medical College(NYC 위치) Pre-Med 파이프라인 연계. 신경과학·생명과학 연구 탁월. 다양한 전공(공학·농업·인문 등) 강점. 이타카 시골 위치 — 의료기관 접근성 제한적이지만 캠퍼스 자체 연구 인프라 강함.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED', 'RD'],
    mapX: 84,
    mapY: 30,
    color1: '#B31B1B',
    color2: '#7A0F0F',
    emoji: '🌁',
    kkumiNote: '상 2 중 합격률 가장 높음(~7%) — 현실적 Target 학교로 포지셔닝. Weill Cornell Medical(NYC) 연계 Pre-Med 파이프라인. 다양한 칼리지 구조 → Pre-Med면 College of Arts & Sciences(CAS) 지원 추천. Need-Aware(국제학생) 주의.',
    panamaNote: '📍 Need-Aware(국제학생) → 재정 불확실. 라틴아메리카 사정관 평가. 파나마 → Cornell 지원자 극소수 → 희소성 효과. Cornell은 다양한 학부대학 구조라 지원 전략 선택 중요 — Pre-Med면 CAS, 환경보건이면 CALS 고려.',
    chemNote: '🌁 Cornell 화학과 전국 Top 10 수준. 유기화학·재료화학 분야 강하고 Nobel 수상자 출신 교수진. Weill Cornell Medical College(NYC)와 연계한 생화학·분자생물학 연구 파이프라인. 학부생 연구 참여 기회 풍부. 이타카의 조용한 환경에서 화학에 집중할 수 있는 최적 조건.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '각 칼리지별 요구 성적 다름. CAS(Pre-Med)는 최상위권 요구' },
      { label: 'Why Cornell 에세이', weight: '핵심', note: '지원 칼리지에 맞는 구체적 이유 필수. 칼리지 선택이 전략의 핵심' },
      { label: '과외활동', weight: '높음', note: '연구·인턴십·리더십·봉사 등 다양한 분야에서 실질적 성과' },
      { label: '추천서', weight: '높음', note: '교사 추천서. 이타카 환경에 적응할 수 있는 독립심과 학문성 표현' },
      { label: 'SAT/ACT', weight: '중간', note: '선택 제출이지만 제출 시 1520+ 권장. 수학 성취도 중요' },
      { label: '다양성', weight: '중간', note: '파나마 배경 같은 지역 희소성은 CAS 심사에서 긍정적 요소' },
    ],
  },

  'Johns Hopkins': {
    fullName: 'Johns Hopkins University',
    location: 'Baltimore, MD',
    type: '사립 연구중심대학 (미국 최초 연구중심대학, 1876년)',
    founded: '1876년',
    size: '약 29,000명 (학부 ~5,500명)',
    acceptRate: '~6.6%',
    intlRate: '~6%',
    satPolicy: '선택 제출',
    satRange: '1500 ~ 1570',
    satRangeKR: '1540 ~ 1580 (수학 800 기대치)',
    tuition: '$63,340',
    coa: '~$85,000/년',
    needBlindDomestic: true,
    needBlindIntl: false,
    avgAid: '평균 $55,000+ (전체 학생)',
    avgAidKR: '~$20,000~35,000 추정 (Need-Aware — 국제학생 재정지원 불확실)',
    preMedRating: '최상',
    preMedNote: '🏆 Pre-Med 전국 최강. Johns Hopkins Hospital(세계 1위 병원) 캠퍼스 인접. 생물의학 연구 규모·수준 독보적. Bloomberg Public Health, School of Nursing 연계. 단 내부 Pre-Med 경쟁 극심 — 학점 따기 어렵기로 악명. 의대 진학 목표라면 JHU는 절대적 선택지.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED', 'RD'],
    mapX: 83,
    mapY: 43,
    color1: '#002D62',
    color2: '#001A3E',
    emoji: '🏥',
    kkumiNote: 'Pre-Med 목표라면 JHU를 빼놓을 수 없음. 세계 1위 병원 바로 옆 캠퍼스. 생물의학 연구 환경 독보적. 단 내부 경쟁 극심 — Pre-Med 학점 관리가 6개교 중 가장 도전적. Need-Aware(국제학생) 재정 주의. SAT 1570은 JHU 합격자 평균 수준.',
    panamaNote: '📍 Need-Aware(국제학생) → 재정지원 불확실. 라틴아메리카 사정관 평가. JHU Pre-Med 지원자로서 파나마 의료 경험(클리닉 방문, 공중보건 관찰 등) 스토리가 매우 강력한 에세이 소재. 파나마 → JHU 지원자 극소수 → 희소성 효과. JHU의 글로벌 보건(Global Health) 프로그램과 중미 배경 연결 가능.',
    chemNote: '🏆 JHU 화학과 Pre-Med 화학 연계 전국 최강. Krieger School의 Chemistry + Bloomberg Public Health + Hopkins Hospital 삼각 연계는 세계 어디에도 없는 조합. Pre-Med 필수 과목(Gen Chem → Orgo → Biochem) 커리큘럼 완성도 세계 최고 수준. 꾸미처럼 화학 좋아하고 의사가 꿈이라면 JHU 화학 Pre-Med 트랙은 최고의 선택. 단 경쟁 매우 치열.',
    evalCriteria: [
      { label: '연구 경험', weight: '핵심', note: '연구소 인턴십·학술 출판·과학 경시대회 수상이 매우 강력한 자산' },
      { label: 'GPA / 학업성취', weight: '핵심', note: 'Pre-Med 최강 학교답게 최상위 이과 성적 필수. 화학·생물 만점 기대' },
      { label: 'Pre-Med 헌신', weight: '핵심', note: '의학 관심을 보여주는 병원 봉사·쉐도잉·의료 관련 활동 필수' },
      { label: '에세이', weight: '높음', note: 'JHU 연구 문화에 맞는 학문적 열정 서술. "Why JHU?" 강력히 강조' },
      { label: '추천서', weight: '높음', note: '과학 교사의 강력한 학문적 추천서. 연구 능력 증명이 핵심' },
      { label: '과외활동', weight: '중간', note: '의료·과학 중심 클럽·봉사·연구 인턴. 다양성보다 깊이 선호' },
    ],
  },

  'Duke': {
    fullName: 'Duke University',
    location: 'Durham, NC',
    type: '사립 연구중심대학',
    founded: '1838년 (현 위치 1924년)',
    size: '약 17,000명 (학부 ~7,000명)',
    acceptRate: '~6.2%',
    intlRate: '~6%',
    satPolicy: '선택 제출',
    satRange: '1500 ~ 1570',
    satRangeKR: '1540 ~ 1580 (수학 800 기대치)',
    tuition: '$64,686',
    coa: '~$85,000/년',
    needBlindDomestic: true,
    needBlindIntl: false,
    avgAid: '평균 $60,000+ (전체 학생)',
    avgAidKR: '~$20,000~35,000 추정 (Need-Aware — 단, 국제학생 재정지원 비교적 후한 편)',
    preMedRating: '최상',
    preMedNote: 'Duke School of Medicine (전국 Top 10) 연계 Pre-Med. Duke Clinical Research Institute(세계 최대 임상연구기관 중 하나) 학부생 접근 가능. 생물의학 연구 탁월. JHU보다는 내부 경쟁 약간 덜 치열.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED', 'RD'],
    mapX: 80,
    mapY: 56,
    color1: '#003087',
    color2: '#001F6B',
    emoji: '😈',
    kkumiNote: 'Pre-Med 환경 탁월 + Duke Medical School Top 10. 노스캐롤라이나 위치로 생활비 상대적으로 낮음. Need-Aware(국제학생)이지만 국제학생 재정지원 상대적으로 후한 편. 스포츠(농구 명문) 강해 캠퍼스 커뮤니티 활력. Global Health 프로그램 세계 강함.',
    panamaNote: '📍 Need-Aware(국제학생) → 재정 불확실. 라틴아메리카 사정관 평가. Duke의 Global Health 프로그램이 중미 공중보건과 강한 접점 — 파나마 배경과 시너지 탁월. Duke-NUS Medical School(싱가포르 연계) 보유 → 국제 의료 관심 학생에게 매력적. 파나마 → Duke 지원자 극소수 → 희소성 효과.',
    chemNote: '😈 Duke 화학과 전국 Top 10. 생화학·의화학 분야 강하고 Duke Medical School과 연계한 Pre-Med 화학 커리큘럼 탁월. Bass Connections 학제간 연구 프로그램으로 화학+글로벌보건 융합 연구 가능. 꾸미처럼 화학+Pre-Med+글로벌 의료 관심이 있다면 Duke의 화학과 Global Health 조합이 매우 매력적.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적. Duke는 학업과 과외활동 균형을 매우 중시하는 학교' },
      { label: '에세이', weight: '핵심', note: 'Why Duke? + 글로벌 보건·리더십·연구 관심 어필이 효과적' },
      { label: '과외활동 균형', weight: '핵심', note: '스포츠·봉사·연구 등 다방면에서 균형 잡힌 "Duke 사람" 선호' },
      { label: '추천서', weight: '높음', note: '교사+카운슬러. 지적 성장과 커뮤니티 기여를 구체적으로 서술' },
      { label: '리더십', weight: '높음', note: '학생 조직·캡스톤·사회 기여 활동에서의 리더십이 중요' },
      { label: 'Global Health 관심', weight: '중간', note: '파나마 배경 + 글로벌 보건 관심은 Duke와 매우 잘 맞음' },
    ],
  },

  'Northwestern': {
    fullName: 'Northwestern University',
    location: 'Evanston, IL (시카고 북쪽 14마일)',
    type: '사립 연구중심대학',
    founded: '1851년',
    size: '약 22,000명 (학부 ~8,000명)',
    acceptRate: '~6.8%',
    intlRate: '~6%',
    satPolicy: '선택 제출',
    satRange: '1500 ~ 1570',
    satRangeKR: '1540 ~ 1580 (수학 800 기대치)',
    tuition: '$65,997',
    coa: '~$87,000/년',
    needBlindDomestic: true,
    needBlindIntl: false,
    avgAid: '평균 $59,000+ (전체 학생)',
    avgAidKR: '~$20,000~35,000 추정 (Need-Aware — 국제학생 재정지원 불확실)',
    preMedRating: '최상',
    preMedNote: 'Feinberg School of Medicine(Chicago 캠퍼스) 연계 Pre-Med 환경 탁월. Northwestern Memorial Hospital 임상 연계. ❌ HPME(Honors Program in Medical Education) BS-MD 프로그램은 2020년 10월 영구 폐지됨 — 현재 신규 지원 불가. (출처: Daily Northwestern, 2020.10) 일반 Pre-Med 트랙으로만 진학 가능.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED', 'RD'],
    mapX: 64,
    mapY: 32,
    color1: '#4E2A84',
    color2: '#2D1147',
    emoji: '🟣',
    kkumiNote: 'Feinberg 의대 연계 Pre-Med 환경 탁월. 시카고 근교(Evanston) 위치로 생활 환경 우수. Need-Aware(국제학생)라 재정 주의. ED 지원 전략. ❌ HPME BS-MD는 2020년 폐지 — 일반 Pre-Med 트랙 기준으로 Northwestern을 평가해야 함. Pre-Med만으로는 Brown·JHU·Duke 대비 우선순위 낮음.',
    panamaNote: '📍 Need-Aware(국제학생) → 재정 불확실. 라틴아메리카 사정관 평가. 파나마 → Northwestern 지원자 극소수 → 희소성 효과. 시카고의 라틴아메리카 커뮤니티(히스패닉 대도시) 문화와도 맞닿음. ED 지원 추천.',
    chemNote: '🟣 Northwestern 화학과 전국 Top 5. 화학+재료과학 분야 세계적 수준. 특히 나노화학·의화학(Medicinal Chemistry) 세계 최강. Feinberg Medical School 연계 Pre-Med 화학 트랙 탁월. HPME 폐지로 BS-MD 경로는 없지만, 화학 전공+Pre-Med 조합으로 의대 지원 스펙 쌓기엔 여전히 우수한 환경.',
    evalCriteria: [
      { label: 'Why Northwestern 에세이', weight: '핵심', note: '특정 교수·프로그램·연구를 구체적으로 언급한 맞춤형 에세이 필수' },
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 선택. 학문적 깊이가 중요' },
      { label: '과외활동', weight: '높음', note: '특정 분야 깊이 있는 집중 활동. Spike(탁월한 한 분야) 선호' },
      { label: '추천서', weight: '높음', note: '교사+카운슬러 추천서. Northwestern의 학문적 엄격성 감당 가능함을 보여야' },
      { label: '인터뷰', weight: '중간', note: '동문 인터뷰 실시. NU 커뮤니티 fit 및 열정 평가' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성은 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'Vanderbilt': {
    fullName: 'Vanderbilt University',
    location: 'Nashville, TN',
    type: '사립 연구중심대학',
    founded: '1873년',
    size: '약 15,000명 (학부 ~7,000명)',
    acceptRate: '~5.8%',
    intlRate: '~5%',
    satPolicy: '선택 제출',
    satRange: '1500 ~ 1570',
    satRangeKR: '1530 ~ 1570 (비공식 추정)',
    tuition: '$63,194',
    coa: '~$84,000/년',
    needBlindDomestic: true,
    needBlindIntl: false,
    avgAid: '평균 $58,000+ (전체 학생)',
    avgAidKR: '~$15,000~30,000 추정 (Need-Aware — 국제학생 재정지원 불확실)',
    preMedRating: '최상',
    preMedNote: 'Vanderbilt University Medical Center(VUMC) 동일 캠퍼스 — Pre-Med 임상 환경 최상. 테네시주 의료 허브로 연계 병원 규모 큼. Medicine, Health & Society 학제간 프로그램. 의대 진학률 SE 지역 최상위. 내부 경쟁 JHU보다 덜 치열.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED', 'RD'],
    mapX: 66,
    mapY: 55,
    color1: '#866D4B',
    color2: '#5C4A2A',
    emoji: '⭐',
    kkumiNote: 'VUMC 동일 캠퍼스 Pre-Med 환경 우수. SE 지역 의대 진학률 최상위. Vanderbilt는 최근 합격률 급락 중 — 실제 난이도 상승. Need-Aware(국제학생) 재정 주의. Nashville = 음악·문화 도시라 캠퍼스 생활 활력. ED 지원 전략.',
    panamaNote: '📍 Need-Aware(국제학생) → 재정 불확실. 라틴아메리카 사정관 평가. Vanderbilt의 Global Health 프로그램이 발전 중 — 파나마 중미 배경과 의료 관심 연결 가능. Nashville의 다양성 문화 확대 중. 파나마 → Vanderbilt 지원자 극소수 → 희소성.',
    chemNote: '⭐ Vanderbilt 화학과 전국 상위권. Pre-Med 화학 트랙 우수. VUMC 연계 생화학·분자생물학 연구 기회 있음. Vanderbilt Institute of Chemical Biology(VICB) — 화학생물학 연구 독자적 인스티튜트 보유. 꾸미처럼 화학+Pre-Med 목표라면 VICB 연구 참여가 강력한 의대 지원 스펙.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 합격률이 급락해 학업 수준 기대치 상승' },
      { label: '에세이', weight: '핵심', note: 'Why Vanderbilt? + 개인 서사. VUMC 의료 환경 관심 어필 효과적' },
      { label: '과외활동·균형', weight: '높음', note: '학업+활동 균형 잡힌 전인격적 학생 선호. 음악·의료봉사 등' },
      { label: '추천서', weight: '높음', note: '교사+카운슬러 추천서. 인성 및 커뮤니티 기여 강조' },
      { label: 'Pre-Med 헌신', weight: '높음', note: '의학 관심 활동 (VUMC 연계 봉사·인턴십 등) 중요' },
      { label: 'SAT/ACT', weight: '중간', note: '선택 제출이지만 1530+ 권장. 제출 시 유리' },
    ],
  },

  'Williams': {
    fullName: 'Williams College',
    location: 'Williamstown, MA (매사추세츠 서부)',
    type: '사립 Liberal Arts College (LAC 전국 1위)',
    founded: '1793년',
    size: '약 2,200명 (초소규모 — LAC 기준)',
    acceptRate: '~7.6%',
    intlRate: '~6%',
    satPolicy: '선택 제출',
    satRange: '1470 ~ 1570',
    satRangeKR: '1510 ~ 1560 (비공식 추정 — LAC 기준 상대적 유연)',
    tuition: '$66,240',
    coa: '~$84,000/년',
    needBlindDomestic: true,
    needBlindIntl: true,
    avgAid: '평균 $62,000+ (전체 학생 — Ivy급 재정지원)',
    avgAidKR: '~$35,000~50,000 추정 (Need-Blind + 매우 후한 재정지원)',
    preMedRating: '상',
    preMedNote: 'LAC 특성상 의대 보장 프로그램 없음. 단 Williams Pre-Med → 의대 진학률 전국 LAC 중 최상위. 교수-학생 비율 7:1로 mentoring 탁월. 폭넓은 교양+과학 기반이 의대 지원 에세이·면접에 유리.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED', 'RD'],
    mapX: 89,
    mapY: 29,
    color1: '#512888',
    color2: '#2D0F5E',
    emoji: '🎨',
    kkumiNote: '전미 LAC 1위. 국제학생 Need-Blind + Ivy급 재정지원. 초소규모(~2,200명)라 교수와 1:1 관계가 깊음. 의대 진학 목표라면 Williams는 LAC 중 최상위 경로. 단 매사추세츠 서부 시골 위치 — 도시 선호 학생과는 맞지 않을 수 있음.',
    panamaNote: '📍 Need-Blind(국제학생) → 재정 안심. 라틴아메리카 사정관 평가. 초소규모 커뮤니티 — 지역 다양성 더욱 중시. 파나마 한인이라는 독특한 배경이 Williams 소규모 다양성 문화에서 특히 빛남. 파나마 → Williams 지원자 사실상 없음 → 지역 희소성 극대화.',
    chemNote: '🎨 Williams 화학과는 소규모이지만 교수-학생 비율 7:1 수준의 집중적 지도. 학부생 연구 참여 기회(Summer Research) 탁월. Pre-Med 화학 환경 우수. 단 대형 연구 인프라는 종합대학 대비 제한. 화학을 교수와 가까이에서 깊이 연구하고 싶다면 Williams LAC 환경이 최적.',
    evalCriteria: [
      { label: '에세이', weight: '핵심', note: 'Williams 철학(소규모 집중 교육)에 공감하는 개인 서사 필수' },
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 + 지적 탐구 능력. LAC 1위답게 학문적 깊이 중시' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 한두 가지 활동. 커뮤니티 기여·예술·스포츠 고루 평가' },
      { label: '추천서', weight: '높음', note: '초소규모 학교라 추천서 비중 매우 큼. 인격·지적 능력 구체 서술 필수' },
      { label: '다양성·희소성', weight: '높음', note: '파나마 출신 희소성이 Williams 소규모 다양성 가치와 완벽히 맞음' },
      { label: '인터뷰', weight: '중간', note: '동문 인터뷰. 지적 호기심·커뮤니티 기여 의지 평가' },
    ],
  },

  'Amherst': {
    fullName: 'Amherst College',
    location: 'Amherst, MA (Five College Consortium)',
    type: '사립 Liberal Arts College (LAC 전국 2위)',
    founded: '1821년',
    size: '약 2,000명 (초소규모)',
    acceptRate: '~7.4%',
    intlRate: '~6%',
    satPolicy: '선택 제출',
    satRange: '1470 ~ 1570',
    satRangeKR: '1510 ~ 1560 (비공식 추정)',
    tuition: '$68,290',
    coa: '~$86,000/년',
    needBlindDomestic: true,
    needBlindIntl: true,
    avgAid: '평균 $65,000+ (전체 학생 — LAC 중 최최고 수준)',
    avgAidKR: '~$38,000~55,000 추정 (Need-Blind + Amherst 재정지원 매우 후함)',
    preMedRating: '상',
    preMedNote: 'Five College Consortium(UMass, Smith, Mt. Holyoke, Hampshire 협력)으로 연구 기회 확장. Open Curriculum(전공 필수 없음)으로 화학+Pre-Med 자유 설계. Pre-Med 의대 진학률 LAC 상위권.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED', 'RD'],
    mapX: 90,
    mapY: 31,
    color1: '#6C2DC7',
    color2: '#3B1473',
    emoji: '🔮',
    kkumiNote: '국제학생 Need-Blind + LAC 중 최상위 재정지원. Five College Consortium으로 UMass Amherst 시설·강의 활용 가능. Open Curriculum으로 화학+Pre-Med 자유 조합. 초소규모(~2,000명) 집중도 최강. 매사추세츠 서부 위치.',
    panamaNote: '📍 Need-Blind(국제학생) → 재정 안심(최상급 수준). 라틴아메리카 사정관 평가. 파나마 출신 Amherst 지원자 사실상 없음 → 희소성 극대화. Amherst의 강한 다양성 중시 문화와 파나마 한인 스토리 완벽히 맞음. Five College로 UMass 의예 관련 과목 수강도 가능.',
    chemNote: '🔮 Amherst 화학과는 소규모이지만 탄탄. Five College Consortium으로 UMass Amherst 대형 화학 연구시설 접근 가능 — LAC임에도 연구 인프라 제한 덜함. Pre-Med 화학 커리큘럼 탄탄하고 Open Curriculum으로 화학+생물+Pre-Med 조합 자유자재. 꾸미의 화학 관심과 유연한 학습 스타일에 잘 맞음.',
    evalCriteria: [
      { label: '에세이', weight: '핵심', note: 'Amherst Open Curriculum + 지적 자유 철학에 공감하는 서사 필수' },
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적. Open Curriculum으로 자기주도 학습 능력도 평가' },
      { label: '다양성', weight: '핵심', note: 'Amherst는 사회경제적·지역적 다양성을 매우 적극적으로 추구' },
      { label: '과외활동', weight: '높음', note: '특정 분야 열정+깊이. Five College 활용 계획도 어필 가능' },
      { label: '추천서', weight: '높음', note: '초소규모(2,000명)라 추천서 품질이 합격에 큰 영향' },
      { label: '인터뷰', weight: '중간', note: '동문 인터뷰. 자기주도성·지적 호기심·커뮤니티 기여 평가' },
    ],
  },

  'Pomona': {
    fullName: 'Pomona College',
    location: 'Claremont, CA (LA 동쪽 35마일, Claremont Consortium)',
    type: '사립 Liberal Arts College (LAC 전국 7위)',
    founded: '1887년',
    size: '약 1,800명 (초소규모 — 미국 최소 규모 LAC)',
    acceptRate: '~6.8%',
    intlRate: '~6%',
    satPolicy: '선택 제출',
    satRange: '1450 ~ 1560',
    satRangeKR: '1500 ~ 1560 (비공식 추정)',
    tuition: '$61,488',
    coa: '~$82,000/년',
    needBlindDomestic: true,
    needBlindIntl: true,
    avgAid: '평균 $58,000+ (전체 학생)',
    avgAidKR: '~$35,000~50,000 추정 (Need-Blind)',
    preMedRating: '상',
    preMedNote: 'Claremont Consortium(5 Claremont Colleges: Pomona, Claremont McKenna, Harvey Mudd, Scripps, Pitzer) 협력으로 연구 기회 확대. 서부 캘리포니아 위치로 LA 의료기관 접근 가능. Pre-Med 의대 진학률 LAC 상위권.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED', 'RD'],
    mapX: 13,
    mapY: 64,
    color1: '#002868',
    color2: '#001540',
    emoji: '🌴',
    kkumiNote: '국제학생 Need-Blind + 서부 캘리포니아 위치. Claremont Consortium으로 Harvey Mudd(STEM 최강) 등 5개교 강의·연구 공유. 초소규모(~1,800명) 최강 집중도. LA 근교로 도시 접근 가능 — 시골 LAC 부담 없음.',
    panamaNote: '📍 Need-Blind(국제학생) → 재정 안심. 라틴아메리카 사정관 평가. 캘리포니아의 강한 히스패닉/라틴아메리카 커뮤니티 — 파나마 배경과 자연스러운 접점. 파나마 → Pomona 지원자 극소수 → 희소성. LA 접근 가능이라 한인 커뮤니티도 있어 꾸미에게 문화적 편안함.',
    chemNote: '🌴 Pomona 화학과는 LAC임에도 연구 장비·인프라 탁월. Claremont Consortium으로 Harvey Mudd College 화학 강의 접근 가능 — STEM 집중도 높은 화학 커리큘럼 수강 가능. Pre-Med 화학 환경 우수. 캘리포니아 위치로 제약·바이오텍 산업(생명과학) 인접. 학부생 여름 연구 기회 풍부.',
    evalCriteria: [
      { label: '에세이', weight: '핵심', note: 'Pomona의 다양성·포용 문화와 본인 배경 연결하는 서사 필수' },
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 + 지적 탐구 능력. LAC 7위 수준의 학문적 깊이' },
      { label: '다양성', weight: '핵심', note: 'Claremont 지역 다양성 + 파나마 배경은 매우 강력한 자산' },
      { label: '과외활동', weight: '높음', note: '특정 분야 열정. Claremont Consortium 활용 계획 어필 가능' },
      { label: '추천서', weight: '높음', note: '초소규모라 추천서 품질이 합격에 큰 영향' },
      { label: '인터뷰', weight: '중간', note: '동문 인터뷰. Pomona와의 철학적 fit 및 열정 평가' },
    ],
  },

  'Rice': {
    fullName: 'Rice University',
    location: 'Houston, TX (Texas Medical Center 인근)',
    type: '사립 연구중심대학',
    founded: '1912년',
    size: '약 8,500명 (학부 ~4,500명 — 소규모)',
    acceptRate: '~8.6%',
    intlRate: '~7%',
    satPolicy: '필수 제출',
    satRange: '1500 ~ 1570',
    satRangeKR: '1520 ~ 1570 (비공식 추정)',
    tuition: '$58,248 (6개교 중 상대적으로 저렴)',
    coa: '~$80,000/년',
    needBlindDomestic: true,
    needBlindIntl: false,
    avgAid: '평균 $57,000+ (전체 학생)',
    avgAidKR: '~$15,000~30,000 추정 (Need-Aware — 국제학생 재정지원 불확실)',
    preMedRating: '최상',
    preMedNote: 'Texas Medical Center(세계 최대 의료 복합단지) 캠퍼스 인근 — 병원·연구기관 접근 독보적. Baylor College of Medicine 연계. Pre-Med 환경 최상급. 소규모(~4,500명)라 교수 접근 용이.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 51,
    mapY: 81,
    color1: '#00205B',
    color2: '#001230',
    emoji: '🏙️',
    kkumiNote: 'Texas Medical Center 인접 Pre-Med 환경 독보적. 학비 상대적 저렴($58K). EA(비구속 조기지원) 전형 가능. 소규모 교육 환경 우수. Need-Aware(국제학생) 재정 주의. Houston = 미국 내 최대 히스패닉 도시 중 하나.',
    panamaNote: '📍 Need-Aware(국제학생) → 재정 불확실. EA 전형 지원 가능(비구속적). 라틴아메리카 사정관 평가. Houston은 미국 내 최대 히스패닉 대도시 중 하나 — 파나마 배경과 강한 문화적 접점. 멕시코만 + 중미 연결성.',
    chemNote: '🏙️ Rice 화학과는 나노기술·재료화학 분야 세계적 수준 (Richard Smalley — 탄소나노튜브 발견, Nobel 수상). Texas Medical Center 인접으로 화학+의학 연구 인턴십 기회 독보적. Pre-Med 화학 환경 최상급. 꾸미처럼 화학+Pre-Med 목표라면 Rice의 TMC 연계는 실질적 강점.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 이공계·Pre-Med 모두 최상위 성적 요구' },
      { label: 'Why Rice 에세이', weight: '핵심', note: 'Residential College 시스템·TMC 연계·특정 교수 언급 맞춤형 에세이 필수' },
      { label: '과외활동·연구', weight: '높음', note: '연구 경험 + 다양한 활동. Rice는 학업·활동 균형 선호' },
      { label: '추천서', weight: '높음', note: '교사+카운슬러. 학문적 깊이와 커뮤니티 기여 서술' },
      { label: 'Pre-Med 헌신', weight: '높음', note: '(Pre-Med 지원 시) TMC 인턴·병원 봉사·의료 관심 활동 중요' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성 + Houston 히스패닉 커뮤니티 연결 가능' },
    ],
  },

  'Swarthmore': {
    fullName: 'Swarthmore College',
    location: 'Swarthmore, PA (Philadelphia 남서쪽 14마일)',
    type: '사립 Liberal Arts College (LAC 전국 4위)',
    founded: '1864년',
    size: '약 1,600명 (초소규모 — STEM 강점 LAC)',
    acceptRate: '~6.9%',
    intlRate: '~6%',
    satPolicy: '선택 제출',
    satRange: '1470 ~ 1570',
    satRangeKR: '1510 ~ 1560 (비공식 추정)',
    tuition: '$66,432',
    coa: '~$84,000/년',
    needBlindDomestic: true,
    needBlindIntl: true,
    avgAid: '평균 $60,000+ (전체 학생)',
    avgAidKR: '~$35,000~50,000 추정 (Need-Blind)',
    preMedRating: '상',
    preMedNote: 'STEM 강점 LAC. Philadelphia 근교로 Penn Medical Center·병원 접근 가능. 소규모 집중 교육. Pre-Med 의대 진학률 LAC 상위권. 교수-학생 비율 최저 수준.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED', 'RD'],
    mapX: 86,
    mapY: 40,
    color1: '#862334',
    color2: '#5A1520',
    emoji: '🪷',
    kkumiNote: '전미 LAC 4위. 국제학생 Need-Blind + 재정지원 후함. Philadelphia 근교 위치로 도시 접근 가능. 초소규모(~1,600명) 집중 STEM 교육. Pre-Med 의대 진학률 LAC 최상위급. 꾸미 SAT 1570은 충분한 수준.',
    panamaNote: '📍 Need-Blind(국제학생) → 재정 안심. 라틴아메리카 사정관 평가. 파나마 → Swarthmore 지원자 사실상 없음 → 희소성 극대화. Philadelphia 히스패닉 커뮤니티 접점.',
    chemNote: '🪷 Swarthmore 화학과는 STEM 강점 LAC답게 연구 수준 탁월. 교수 1인당 학생 수 최저 수준 — 1:1 연구 지도. Philadelphia 근교라 대형 제약사·병원 연구 접근 가능. Pre-Med 화학 환경 우수. 꾸미의 화학 관심과 소규모 집중 학습 스타일에 최적.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: 'STEM 강점 LAC답게 최상위 이과 성적 필수. Honors Program 도전 중요' },
      { label: '에세이', weight: '핵심', note: 'Swarthmore 가치(지적 엄격성·사회정의·다양성)에 공감하는 서사 필수' },
      { label: '지적 호기심', weight: '핵심', note: '학문 탐구 열정과 깊이 있는 지적 관심이 가장 중요한 평가 요소' },
      { label: '다양성·사회정의', weight: '높음', note: 'Swarthmore는 다양성과 사회 기여를 매우 강하게 중시' },
      { label: '추천서', weight: '높음', note: '초소규모(1,600명)라 추천서 품질이 합격에 매우 큰 영향' },
      { label: '과외활동', weight: '중간', note: '사회봉사·연구·예술 등 다양한 활동. 한 분야 깊이 선호' },
    ],
  },

  'Bowdoin': {
    fullName: 'Bowdoin College',
    location: 'Brunswick, ME (메인주 해안가)',
    type: '사립 Liberal Arts College (LAC 전국 5위)',
    founded: '1794년',
    size: '약 1,850명 (초소규모)',
    acceptRate: '~8.5%',
    intlRate: '~6%',
    satPolicy: '점수 미반영',
    satRange: '1440 ~ 1560',
    satRangeKR: '1490 ~ 1550 (비공식 추정 — Bowdoin은 SAT 제출 하더라도 점수 미반영)',
    tuition: '$65,694',
    coa: '~$83,000/년',
    needBlindDomestic: true,
    needBlindIntl: true,
    avgAid: '평균 $57,000+ (전체 학생)',
    avgAidKR: '~$32,000~48,000 추정 (Need-Blind)',
    preMedRating: '상',
    preMedNote: 'LAC이라 의대 보장 없음. Pre-Med 의대 진학률 중상위권. 소규모 교수 mentoring 최강. 메인주 해안 위치로 의료기관 접근 제한적이지만 환경·해양과학 특화 강점.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED', 'RD'],
    mapX: 95,
    mapY: 24,
    color1: '#14213D',
    color2: '#0A1428',
    emoji: '🐻‍❄️',
    kkumiNote: '전미 LAC 5위. 국제학생 Need-Blind + 재정지원 후함. 초소규모(~1,850명) 최고 집중도. 단 메인주 시골 해안 위치 — 도시 생활 제한적. 학업 능력보다 에세이·활동 스토리 중심으로 평가. 꾸미의 파나마 서사와 잘 맞는 학교.',
    panamaNote: '📍 Need-Blind(국제학생) → 재정 안심. 라틴아메리카 사정관 평가. 파나마 → Bowdoin 지원자 사실상 없음 → 초희소성. 메인주 작은 공동체에서 다양성이 특히 두드러짐. 자연·해양 환경이 파나마 해안 배경과 유사한 정서.',
    chemNote: '🐻‍❄️ Bowdoin 화학과는 해양화학·환경화학 독특한 강점 (메인 해안 위치 활용). Pre-Med 화학 커리큘럼 탄탄. 교수 1:1 연구 지도 탁월. 꾸미처럼 화학 관심 있다면 일반적인 의화학 외에 해양·환경 화학이라는 독특한 관점도 경험 가능.',
    evalCriteria: [
      { label: '에세이', weight: '핵심', note: '개인 서사와 커뮤니티 기여. "Bowdoin 사람"으로서의 진정성이 핵심' },
      { label: '과외활동·서사', weight: '핵심', note: 'Bowdoin은 성적보다 에세이·활동·스토리 중심으로 평가' },
      { label: '다양성', weight: '핵심', note: '파나마 배경 등 지역 희소성이 소규모 Bowdoin 커뮤니티에서 매우 강력' },
      { label: '추천서', weight: '높음', note: '초소규모(1,850명)라 추천서 품질이 결정적 영향' },
      { label: 'GPA / 학업성취', weight: '높음', note: 'SAT 미반영이지만 학업 성적은 여전히 중요. 도전적 과목 이수' },
      { label: '인터뷰', weight: '중간', note: '동문 인터뷰. 인성·지적 호기심·커뮤니티 fit 평가' },
    ],
  },

  'WashU in St. Louis': {
    fullName: 'Washington University in St. Louis',
    location: 'St. Louis, MO',
    type: '사립 연구중심대학',
    founded: '1853년',
    size: '약 17,000명 (학부 ~7,000명)',
    acceptRate: '~11.4%',
    intlRate: '~8%',
    satPolicy: '선택 제출',
    satRange: '1500 ~ 1570',
    satRangeKR: '1530 ~ 1570 (비공식 추정)',
    tuition: '$64,570',
    coa: '~$86,000/년',
    needBlindDomestic: true,
    needBlindIntl: false,
    avgAid: '평균 $62,000+ (전체 학생 — Need-Aware지만 매우 후함)',
    avgAidKR: '~$25,000~45,000 추정 (Need-Aware지만 장학금 매우 후한 편)',
    preMedRating: '최상',
    preMedNote: 'Washington University School of Medicine (전국 Top 5!) 동일 캠퍼스. Barnes-Jewish Hospital(전국 Top 10 종합병원) 연계. Pre-Med 환경 최상급. 하단2 중 Pre-Med 수준 최상위.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED1', 'ED2', 'RD'],
    mapX: 60,
    mapY: 45,
    color1: '#A51417',
    color2: '#7A0E10',
    emoji: '🌆',
    kkumiNote: 'WashU 의대(Top 5) 동일 캠퍼스 — Pre-Med 환경 하단2 중 최상. Need-Aware이지만 재정지원 매우 후한 편. 합격률 ~11%로 하단2 중 상대적으로 현실적. St. Louis 중서부 위치. ED1·ED2 모두 지원 가능.',
    panamaNote: '📍 Need-Aware지만 재정지원 후함 → 기대보다 지원금 받을 가능성. 라틴아메리카 사정관 평가. 파나마 → WashU 지원자 극소수 → 희소성 효과. ED1 지원 추천.',
    chemNote: '🌆 WashU 화학과 전국 Top 10. WashU 의대(Top 5)와 직접 연계한 생화학·의화학 연구 탁월. Barnes-Jewish Hospital 연계 임상화학 연구 접근 가능. Pre-Med 화학 환경 최상급. 꾸미처럼 화학+Pre-Med 목표라면 WashU는 하단2 그룹 최고 선택.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적. WashU 의대(Top 5) 연계 Pre-Med는 최상위권 요구' },
      { label: '에세이', weight: '핵심', note: 'Why WashU? + 특정 교수·연구·프로그램 구체 언급 필수' },
      { label: '과외활동·연구', weight: '높음', note: '연구 경험 + 의료 관심 활동. Barnes-Jewish 연계 강조 가능' },
      { label: '추천서', weight: '높음', note: '교사+카운슬러 추천서. 학문적 능력과 인성 구체 서술' },
      { label: 'Pre-Med 헌신', weight: '높음', note: '의학 관심 활동 필수. WashU 의대 연계 강점 어필' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 중서부 WashU에서 강한 차별화 요소' },
    ],
  },

  'Carnegie Mellon': {
    fullName: 'Carnegie Mellon University',
    location: 'Pittsburgh, PA',
    type: '사립 연구중심대학 (CS·공학 세계 최강)',
    founded: '1900년',
    size: '약 16,000명 (학부 ~7,000명)',
    acceptRate: '~11.3%',
    intlRate: '~10%',
    satPolicy: '선택 제출',
    satRange: '1500 ~ 1570',
    satRangeKR: '1540 ~ 1580 (수학 800 기대치 — CS/Engineering 지원 기준)',
    tuition: '$63,829',
    coa: '~$85,000/년',
    needBlindDomestic: true,
    needBlindIntl: false,
    avgAid: '평균 $55,000+ (전체 학생)',
    avgAidKR: '~$15,000~30,000 추정 (Need-Aware — 국제학생 재정지원 불확실)',
    preMedRating: '보통',
    preMedNote: 'Pre-Med 특화 학교가 아님. CS·공학·음대 세계 최강. Computational Biology·Bioinformatics 분야 강해 화학+CS 융합 관심자에게는 탁월. 순수 Pre-Med 목표라면 적합하지 않음.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED1', 'ED2', 'RD'],
    mapX: 78,
    mapY: 38,
    color1: '#C41230',
    color2: '#8B0D21',
    emoji: '🤖',
    kkumiNote: 'CS·공학 세계 최강. Pre-Med 목표와 방향이 다른 학교 — 꾸미 Pre-Med 목표로는 우선순위 낮음. 단 화학+CS를 융합해 Computational Biology·Drug Discovery AI 분야 관심 있다면 고려 가능. Need-Aware 재정 주의.',
    panamaNote: '📍 Need-Aware(국제학생) → 재정 불확실. 라틴아메리카 사정관 평가. CMU는 한국 학생들이 CS 전공으로 많이 지원 — 파나마 출신이지만 한국 국적이라 CS 지원자 풀 고려 필요. Pre-Med 목표면 CMU에서의 경쟁 낮음 (지원자 적음).',
    chemNote: '🤖 CMU 화학과는 재료화학·계산화학 분야 강함. Computational Chemistry + CS 융합 독보적. 화학+CS = Drug Discovery AI라는 최신 분야. 꾸미가 화학+Pre-Med 외에 AI 기반 신약개발에 관심 있다면 CMU가 독특한 경로. 단 순수 Pre-Med 화학 트랙은 아님.',
    evalCriteria: [
      { label: 'CS/공학 실력', weight: '핵심', note: '지원 학부(CS·공학 등)에 맞는 압도적 STEM 능력 필수' },
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 이과 성적. 수학 800. AP CS·미적분 학점 중요' },
      { label: 'Why CMU 에세이', weight: '핵심', note: '지원 칼리지(SCS·Engineering·Dietrich 등) 맞춤형 에세이 필수' },
      { label: '포트폴리오·프로젝트', weight: '높음', note: '코딩 프로젝트·게임 개발·해커톤 등 실제 구현 경험' },
      { label: '추천서', weight: '중간', note: '수학·CS 교사 추천서. 분석 능력과 창의성 증명' },
      { label: '과외활동', weight: '중간', note: 'STEM 관련 클럽·경진대회·연구. 학문적 깊이 위주' },
    ],
  },

  'Notre Dame': {
    fullName: 'University of Notre Dame',
    location: 'Notre Dame, IN (South Bend 인근)',
    type: '사립 연구중심대학 (가톨릭)',
    founded: '1842년',
    size: '약 12,700명 (학부 ~8,500명)',
    acceptRate: '~11.7%',
    intlRate: '~6%',
    satPolicy: '선택 제출',
    satRange: '1470 ~ 1570',
    satRangeKR: '1510 ~ 1560 (비공식 추정)',
    tuition: '$62,693',
    coa: '~$83,000/년',
    needBlindDomestic: true,
    needBlindIntl: false,
    avgAid: '평균 $55,000+ (전체 학생)',
    avgAidKR: '~$15,000~30,000 추정 (Need-Aware — 국제학생 재정지원 불확실)',
    preMedRating: '상',
    preMedNote: 'Pre-Med 환경 우수. 자체 의대 없지만 의대 진학률 상위권. 가톨릭 대학으로 의료 윤리·의학인류학 과목 연계 풍부. 글로벌 보건 및 의료 선교 프로그램 특화.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['REA', 'RD'],
    mapX: 67,
    mapY: 33,
    color1: '#0C2340',
    color2: '#051220',
    emoji: '⛪',
    kkumiNote: '가톨릭 전통 대학. Pre-Med 환경 우수하지만 의대 없음. 글로벌 보건 프로그램 강점. Need-Aware(국제학생) 재정 주의. REA 전형(제한적 조기행동 — 다른 사립 EA/ED 동시 지원 불가). 종교적 문화 맞는지 확인 필요.',
    panamaNote: '📍 Need-Aware(국제학생) → 재정 불확실. 라틴아메리카 사정관 평가. Notre Dame의 가톨릭·선교·글로벌 보건 문화와 파나마(라틴아메리카 가톨릭 문화권) 배경이 자연스럽게 맞닿음. 파나마 의료 관찰 경험이 Notre Dame 에세이 소재로 적합.',
    chemNote: '⛪ Notre Dame 화학과 전국 상위권. 특히 유기 합성화학 분야 강함. Pre-Med 화학 커리큘럼 탄탄. 가톨릭 대학이라 의료 윤리·의학인류학 과목 연계 독특. 화학+글로벌 보건 융합 관심 있다면 Notre Dame의 학문적 환경이 잘 맞음.',
    evalCriteria: [
      { label: '에세이·스토리', weight: '핵심', note: 'Notre Dame 가톨릭 가치·봉사·글로벌 보건과 연결되는 개인 서사 필수' },
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적. 도전적 과목 이수. 의대 진학 목표 시 이과 최상위' },
      { label: '봉사·커뮤니티', weight: '핵심', note: 'Notre Dame은 가톨릭 봉사 정신·커뮤니티 기여를 매우 강하게 중시' },
      { label: '과외활동', weight: '높음', note: '의료봉사·해외봉사·글로벌 보건 활동이 Notre Dame 철학과 잘 맞음' },
      { label: '추천서', weight: '높음', note: '교사+카운슬러. 인성과 가톨릭 가치 부합 여부 서술 도움' },
      { label: '인터뷰', weight: '중간', note: '동문 인터뷰. Notre Dame 커뮤니티 fit 및 봉사 정신 평가' },
    ],
  },

  'Harvey Mudd': {
    fullName: 'Harvey Mudd College',
    location: 'Claremont, CA (Claremont Consortium)',
    type: '사립 Liberal Arts College STEM 특화 (LAC 전국 10위)',
    founded: '1955년',
    size: '약 900명 (초초소규모 — STEM 전문)',
    acceptRate: '~10.4%',
    intlRate: '~7%',
    satPolicy: '선택 제출',
    satRange: '1500 ~ 1580',
    satRangeKR: '1540 ~ 1580 (수학 800 필수에 가까움)',
    tuition: '$65,686',
    coa: '~$83,000/년',
    needBlindDomestic: true,
    needBlindIntl: false,
    avgAid: '평균 $55,000+ (전체 학생)',
    avgAidKR: '~$15,000~30,000 추정 (Need-Aware — 국제학생 재정지원 불확실)',
    preMedRating: '낮음',
    preMedNote: 'STEM 순수 공학/과학 특화 학교. Pre-Med 트랙 거의 없음. 의대 진학보다 엔지니어링·순수과학자 양성에 초점. Pre-Med 목표라면 Harvey Mudd는 적합하지 않음.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED', 'RD'],
    mapX: 12,
    mapY: 63,
    color1: '#F9A21A',
    color2: '#C07A10',
    emoji: '⚙️',
    kkumiNote: '수학 800 + STEM 최강 환경. 단 Pre-Med 목표와 방향 완전히 다름. 꾸미 Pre-Med 목표로는 적합하지 않음. Claremont Consortium으로 Pomona 등과 강의 공유. 만약 의사보다 과학자·엔지니어 방향으로 전환한다면 세계 최고 환경.',
    panamaNote: '📍 Need-Aware(국제학생) → 재정 불확실. 라틴아메리카 사정관 평가. Harvey Mudd는 STEM 실력이 전부 — 파나마 출신 다양성보다 수학·과학 능력이 절대 우선. Claremont의 히스패닉 커뮤니티.',
    chemNote: '⚙️ Harvey Mudd 화학과는 STEM 특화 LAC답게 연구 강도 세계 최고 수준. 학부생 연구 의무. Claremont Consortium으로 Pomona·Scripps 화학 강의 공유. 순수 화학·물리화학 연구 환경 LAC 중 최강. 단 Pre-Med 연계보다 화학자·재료과학자 양성에 초점.',
    evalCriteria: [
      { label: 'STEM 순수 실력', weight: '핵심', note: '수학·물리·화학 압도적 성취 필수. Caltech 수준의 STEM 강도' },
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 이과 성적 필수. AP 수학·물리·화학 5점 기대' },
      { label: '에세이·개인성', weight: '핵심', note: 'Harvey Mudd의 독특한 문화·소규모 공동체 철학과 fit 보여야 함' },
      { label: '연구·프로젝트', weight: '높음', note: 'STEM 연구 경험·로보틱스·컴퓨팅 프로젝트 등 실제 구현 경험' },
      { label: '추천서', weight: '높음', note: '초소규모(900명)라 추천서 품질이 합격에 결정적 영향' },
      { label: '과외활동', weight: '중간', note: 'STEM 관련 활동 위주. 깊이 집중형 선호' },
    ],
  },

  'UCLA': {
    fullName: 'University of California, Los Angeles',
    location: 'Los Angeles, CA (Westwood)',
    type: '공립 대학 (University of California)',
    founded: '1919년',
    size: '약 47,000명 (학부 ~32,000명 — 대형)',
    acceptRate: '~8.8%',
    intlRate: '~6%',
    satPolicy: '점수 미반영',
    satRange: '1390 ~ 1550',
    satRangeKR: '1470 ~ 1550 (비공식 추정)',
    tuition: '~$46,500/년 (국제학생 — 거주민 학비 $14,312 + NRST $31,026 + 수수료)',
    coa: '~$72,000~76,000/년 (국제학생 전체 비용 — 학비+기숙사+생활비)',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 사실상 $0 (UC 공립 시스템 정책)',
    avgAidKR: '사실상 $0 — UC 공립은 국제학생에게 Need-based Aid 제공 안 함. 극소수 Merit 장학금 존재하지만 경쟁률 매우 높음. 4년 총 비용 ~$290,000~305,000 ⚠️ 재정지원 받는 사립 명문보다 실질 비용이 더 비쌀 수 있음',
    preMedRating: '상',
    preMedNote: 'David Geffen School of Medicine at UCLA 세계 Top 10. Pre-Med 환경 탁월. 대형 학교(~32,000명)라 교수 접근성 낮고 내부 경쟁 치열. LA 위치로 다양한 의료기관 접근 가능.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['RD'],
    mapX: 11,
    mapY: 64,
    color1: '#2774AE',
    color2: '#003B5C',
    emoji: '🌅',
    kkumiNote: '⚠️ 공립이라 저렴할 것 같지만 국제학생 재정지원 사실상 $0 — 4년 총 비용 ~$290,000~305,000. Need-Blind 사립에서 재정지원 $40,000/년 받으면 4년 총 비용 비슷하거나 오히려 사립이 저렴. David Geffen 의대 Top 10. LA·한인타운 근접. EA/ED 없음(RD 단일).',
    panamaNote: '📍 ⚠️ 국제학생 재정지원 $0 (공립 UC 정책) — 실질 비용 재검토 필요. 라틴아메리카 사정관 평가. LA = 미국 최대 히스패닉+한인 도시 → 파나마 한인 배경 문화적 접점 최강. 한인타운 직접 접근 가능.',
    chemNote: '🌅 UCLA 화학과 전국 Top 10. Nobel 수상자 출신 다수. LA 위치로 제약·바이오텍 산업 허브 인접. Pre-Med 화학 환경 우수. 단 대형 학교라 교수 접근 경쟁 치열. 화학 기초를 매우 탄탄하게 쌓을 수 있는 환경.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: 'UC 시스템 특성상 학업 성적이 가장 중요. 가중 GPA 4.2+ 권장' },
      { label: '개인 에세이(PIQ)', weight: '핵심', note: 'UC Personal Insight Questions — 4개 서술. 개인 서사와 역경 극복 중요' },
      { label: '과외활동', weight: '높음', note: 'UC는 활동을 "Activities & Awards" 형식으로 별도 평가. 다양하고 깊이 있는 활동' },
      { label: '다양성·배경', weight: '높음', note: 'UC는 1세대 대학생·저소득층·다양한 배경을 강하게 우대' },
      { label: 'SAT/ACT', weight: '참고', note: 'UC 전체 Test-Free 정책으로 SAT 불사용. 학업 성적이 더 중요' },
      { label: '지역 다양성', weight: '높음', note: '파나마 출신 희소성이 캘리포니아 중심 UC에서는 강한 차별화 요소' },
    ],
  },

  'UC Berkeley': {
    fullName: 'University of California, Berkeley',
    location: 'Berkeley, CA (Bay Area)',
    type: '공립 대학 (University of California)',
    founded: '1868년',
    size: '약 45,000명 (학부 ~31,000명 — 대형)',
    acceptRate: '~11.4%',
    intlRate: '~7%',
    satPolicy: '점수 미반영',
    satRange: '1360 ~ 1530',
    satRangeKR: '1450 ~ 1540 (비공식 추정 — 전공별 차이 큼)',
    tuition: '~$46,500/년 (국제학생 — 거주민 학비 $14,312 + NRST $31,026 + 수수료)',
    coa: '~$68,000~72,000/년 (국제학생 전체 비용 — 학비+기숙사+생활비)',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 사실상 $0 (UC 공립 시스템 정책)',
    avgAidKR: '사실상 $0 — UC 공립은 국제학생에게 Need-based Aid 제공 안 함. 극소수 Merit 장학금 존재. 4년 총 비용 ~$272,000~288,000 ⚠️ 재정지원 받는 사립 명문보다 실질 비용이 더 비쌀 수 있음',
    preMedRating: '중상',
    preMedNote: '자체 의대 없음(UCSF와 연계). 생물학·Molecular & Cell Biology 강함. Pre-Med 목표로는 UCLA 대비 환경 약함. 연구 중심이며 실리콘밸리·Bio 연구 쪽 강점.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['RD'],
    mapX: 5,
    mapY: 49,
    color1: '#003262',
    color2: '#001E3E',
    emoji: '🐻',
    kkumiNote: '⚠️ 공립이라 저렴할 것 같지만 국제학생 재정지원 사실상 $0 — 4년 총 비용 ~$272,000~288,000. 자체 의대 없어 Pre-Med 목표론 WashU·JHU 대비 약점. 실리콘밸리+테크 연계 최강. EA/ED 없음(RD 단일). 캠퍼스 분위기 자유·진보적.',
    panamaNote: '📍 ⚠️ 국제학생 재정지원 $0 (공립 UC 정책) — 실질 비용 재검토 필요. 라틴아메리카 사정관 평가. Bay Area = 실리콘밸리 + 아시아계·히스패닉 다양성. 한인 커뮤니티 접근 가능. Pre-Med보다 Bio+CS 융합 관심 시 강점.',
    chemNote: '🐻 UC Berkeley 화학과 전국 Top 5 (역사적 Nobel 수상자 최다 — Seaborg, Calvin, Giauque 등). 물리화학·합성화학·그린케미스트리 세계 최강. 단 Pre-Med 화학 연계보다 순수 화학 연구 집중. 꾸미에게 화학 기초를 가장 깊고 넓게 쌓을 수 있는 환경.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '가중 GPA 4.3+ 권장. 전공별 경쟁이 다름 (CS·공학 가장 치열)' },
      { label: '개인 에세이(PIQ)', weight: '핵심', note: 'UC Personal Insight Questions 4개. 역경·리더십·지식 추구 서술 핵심' },
      { label: '과외활동', weight: '높음', note: '학문·리더십·봉사 등 다양한 활동. UC는 활동 다양성 선호' },
      { label: '다양성·배경', weight: '높음', note: 'UC는 사회경제적 다양성을 매우 강하게 고려' },
      { label: '전공 적합성', weight: '높음', note: '지원 전공과 학업·활동의 연계성. CS는 코딩 포트폴리오 중요' },
      { label: 'SAT/ACT', weight: '참고', note: 'UC 전체 Test-Free. GPA·에세이·활동이 전부' },
    ],
  },

  // ─────────────────────────────────────────
  //  2 Group 상 1 (23~26위)
  // ─────────────────────────────────────────

  'NYU': {
    fullName: 'New York University',
    location: 'New York City, NY (Greenwich Village)',
    type: '사립 연구중심대학',
    founded: '1831년',
    size: '약 67,000명 (학부 ~28,000명 — 전미 최대 사립)',
    acceptRate: '~12.2%',
    intlRate: '~15% (전미 최상위권 국제학생 비율)',
    satPolicy: '선택 제출',
    satRange: '1390 ~ 1540',
    satRangeKR: '1470 ~ 1540 (비공식 추정)',
    tuition: '$60,438',
    coa: '~$88,000/년 (NYC 생활비 포함 — 전미 최고 수준)',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '평균 $35,000+ (전체 학생)',
    avgAidKR: '~$10,000~25,000 추정 (Need-Aware — NYC 생활비 포함 실질 부담 매우 큼)',
    preMedRating: '중상',
    preMedNote: 'Grossman School of Medicine 연계 + NYU Langone Health (세계적 병원) 임상 환경 탁월. 단 Grossman 의대 무료화(2019) 이후 의대 경쟁 극적 급등. Pre-Med 학생 수 많아 내부 경쟁 치열.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED', 'RD'],
    mapX: 88,
    mapY: 37,
    color1: '#57068C',
    color2: '#3A0460',
    emoji: '🗽',
    kkumiNote: '⚠️ 국제학생 비율 ~15%로 매우 높음 — 파나마 출신 희소성 프리미엄 상대적으로 낮음. COA ~$88K (NYC 생활비)로 전미 최고 수준. Need-Aware 재정지원 불확실. Langone Health 임상 환경은 탁월. Pre-Med 내부 경쟁 치열.',
    panamaNote: '📍 Need-Aware(국제학생) → 재정 불확실 + NYC 비용 주의. 국제학생 비율 15%로 파나마 희소성 낮음. NYC = 미국 내 최대 의료·제약 허브. Langone Health Pre-Med 임상 기회 독보적.',
    chemNote: '🗽 NYU 화학과는 연구 수준 우수. NYC 위치로 제약회사·병원 연구 인턴십 접근 독보적 — Pfizer·BMS·Merck 본사 인근. Grossman 의대 연계 생화학·의화학 연구. 단 학교 규모가 커 교수 접근성 경쟁 있음.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 글로벌 Top 지원자 풀에서 경쟁' },
      { label: 'Why NYU 에세이', weight: '핵심', note: 'NYC 도시 환경·특정 스쿨(Stern·CAS·Gallatin 등) 맞춤 에세이 필수' },
      { label: '과외활동', weight: '높음', note: 'NYC 기반 인턴십·예술·연구 등 도시 활용 경험이 NYU와 궁합 좋음' },
      { label: '다양성', weight: '높음', note: 'NYU는 국제적 다양성을 매우 강하게 중시' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러. 학업 능력과 NYU 환경 fit 서술' },
      { label: '인터뷰', weight: '참고', note: '일부 프로그램에서 인터뷰 실시. 전반적으로 에세이 비중이 더 큼' },
    ],
  },

  'Georgia Tech': {
    fullName: 'Georgia Institute of Technology',
    location: 'Atlanta, GA',
    type: '공립 연구중심대학 (STEM·공학 특화)',
    founded: '1885년',
    size: '약 44,000명 (학부 ~17,000명)',
    acceptRate: '~17%',
    intlRate: '~7%',
    satPolicy: '선택 제출',
    satRange: '1390 ~ 1540',
    satRangeKR: '1480 ~ 1540 (비공식 추정)',
    tuition: '~$36,972/년 (국제학생 비거주민 기준)',
    coa: '~$60,000~65,000/년 (국제학생 전체 비용)',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 매우 제한적 (공립 조지아주)',
    avgAidKR: '~$5,000~15,000 추정 (공립 — Merit 장학금 중심, Need-based 거의 없음)',
    preMedRating: '낮음',
    preMedNote: 'Pre-Med 전용 환경 없음. 공학·STEM 세계 최강. Biomedical Engineering 분야 전국 Top 3 — 의공학·의료기기 방향은 독보적. 꾸미의 Pre-Med(의대 진학) 목표와 방향이 다름.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 70,
    mapY: 65,
    color1: '#003057',
    color2: '#001A38',
    emoji: '🐝',
    kkumiNote: '공학·STEM 세계 최강. Pre-Med 목표와 방향 다름. 공립이라 학비 저렴($37K)하지만 재정지원 거의 없음. Atlanta = CDC(미국 질병통제센터) 인접. Biomedical Engineering 관심 있다면 세계 최고 환경. 꾸미 Pre-Med 목표로는 우선순위 낮음.',
    panamaNote: '📍 공립 → 국제학생 재정지원 제한적. Atlanta 위치 — CDC 인접으로 공중보건 관심자에게 독보적. 파나마 출신 공학·STEM 방향이라면 Georgia Tech의 비용 효율 매우 좋음. Pre-Med 목표면 부적합.',
    chemNote: '🐝 Georgia Tech 화학과는 Materials Science + Chemistry 융합 세계적 수준. Biomedical Engineering 연계 의화학. 단 Pre-Med 화학 트랙보다 화학공학·재료 방향에 특화. 꾸미 화학+Pre-Med 목표와는 방향 다소 달라.',
    evalCriteria: [
      { label: 'GPA / 이과 성적', weight: '핵심', note: '공학·STEM 성적이 핵심. 수학·물리 최상위 성적 필수' },
      { label: 'Why Georgia Tech 에세이', weight: '핵심', note: '공학 분야 관심과 Georgia Tech 특정 프로그램 연결 에세이 필수' },
      { label: 'STEM 과외활동', weight: '높음', note: '로보틱스·해커톤·경진대회·연구 프로젝트 등 실제 STEM 활동' },
      { label: '추천서', weight: '높음', note: '수학·과학 교사 추천서. 공학적 사고력과 문제해결 능력 증명' },
      { label: '협업·리더십', weight: '중간', note: 'GT는 팀 프로젝트 글로벌 문화 — 협업 능력 어필 도움' },
      { label: 'SAT/ACT', weight: '중간', note: '선택 제출이지만 제출 시 1520+ 권장' },
    ],
  },

  'UT Austin': {
    fullName: 'University of Texas at Austin',
    location: 'Austin, TX',
    type: '공립 대학 (University of Texas System)',
    founded: '1883년',
    size: '약 51,000명 (학부 ~39,000명 — 초대형)',
    acceptRate: '~29% (전공·칼리지별 격차 큼)',
    intlRate: '~5%',
    satPolicy: '필수 제출',
    satRange: '1310 ~ 1530',
    satRangeKR: '1440 ~ 1530 (비공식 추정 — 전공별 차이 큼)',
    tuition: '~$38,000/년 (국제학생 비거주민 기준)',
    coa: '~$62,000~65,000/년 (국제학생 전체 비용)',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 매우 제한적 (공립 텍사스주)',
    avgAidKR: '~$5,000~10,000 추정 (공립 — 국제학생 지원 극히 제한적)',
    preMedRating: '중상',
    preMedNote: 'Dell Medical School(2016 개교) 연계. Texas Medical Center(Houston) 접근 가능. Pre-Med 환경 우수하지만 초대형(~39,000명)이라 경쟁 치열. 텍사스 거주민 우대 정책 존재.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 47,
    mapY: 79,
    color1: '#BF5700',
    color2: '#8C3B00',
    emoji: '🤠',
    kkumiNote: '초대형 공립(~39,000명 학부). 국제학생 재정지원 사실상 없음. 합격률 ~29%지만 전공별 격차 큼. Dell 의대 연계 Pre-Med 환경 보통. Austin 테크 생태계 급성장. 학비 저렴($38K)하지만 재정지원 없어 총 비용 부담 있음.',
    panamaNote: '📍 국제학생 재정지원 매우 제한적 (공립 텍사스). Austin = 급성장 히스패닉+한인 커뮤니티. Texas Medical Center(Houston, 세계 최대) 접근. 파나마 출신 희소성 효과 있음. SAT 필수 제출.',
    chemNote: '🤠 UT Austin 화학과 전국 상위권. 유기화학·합성화학 분야 강함. Dell 의대 연계 의화학 연구. 텍사스 석유화학 산업 연계 인턴십 기회. Pre-Med 화학 환경 우수. 학비 대비 화학 교육 효율 좋음.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'Georgetown': {
    fullName: 'Georgetown University',
    location: 'Washington D.C.',
    type: '사립 연구중심대학 (가톨릭 예수회)',
    founded: '1789년 (미국 최초의 가톨릭 대학)',
    size: '약 21,000명 (학부 ~7,000명)',
    acceptRate: '~13.1%',
    intlRate: '~8%',
    satPolicy: '선택 제출',
    satRange: '1430 ~ 1560',
    satRangeKR: '1490 ~ 1560 (비공식 추정)',
    tuition: '$65,682',
    coa: '~$87,000/년 (DC 생활비 포함)',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '평균 $53,000+ (전체 학생)',
    avgAidKR: '~$15,000~30,000 추정 (Need-Aware — 국제학생 재정지원 불확실)',
    preMedRating: '상',
    preMedNote: 'Georgetown University Medical Center + MedStar 병원군 연계. 가톨릭 대학으로 의료 윤리·사회정의 의학 문화 강함. Global Health 프로그램 세계적 수준. 의대 진학률 상위권.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['RD'],
    mapX: 83,
    mapY: 44,
    color1: '#041E42',
    color2: '#02102A',
    emoji: '⚖️',
    kkumiNote: 'DC 위치 — 정치·외교·세계보건 접근 최강. Pre-Med 환경 우수 + Global Health 독보적. Need-Aware(국제학생) 재정 주의. DC 생활비 포함 COA ~$87K. ED 없음(RD 단일). 가톨릭 학문 문화.',
    panamaNote: '📍 DC 위치 — 파나마(중미) 외교 관계에서 DC는 전략적 요충. 라틴아메리카 사정관 평가. Georgetown의 가톨릭·글로벌 보건·라틴아메리카 연구 프로그램과 파나마 배경이 자연스럽게 연결. 정치·외교 에세이 소재로 파나마 위치 활용 강점.',
    chemNote: '⚖️ Georgetown 화학과는 재료화학·생화학 연구 우수. DC 위치로 FDA·NIH 인턴십 접근 독보적. Pre-Med 화학 환경 양호. 의료 윤리·공공보건 관점의 독특한 학문적 화학 시각. 정부 연구기관 연계 화학 연구 기회.',
    evalCriteria: [
      { label: '에세이', weight: '핵심', note: 'Georgetown 가톨릭·globlal 가치 공감 + 특정 스쿨 맞춤 에세이 필수' },
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적. 정치·외교·보건 분야 학문적 관심 필수' },
      { label: '봉사·사회정의', weight: '핵심', note: 'Georgetown 예수회 전통 — 커뮤니티 봉사·사회정의 활동이 핵심 평가' },
      { label: '인터뷰', weight: '높음', note: 'Georgetown 인터뷰는 실질적으로 중요. DC 위치 인지와 정치·외교 관심 표현 필요' },
      { label: '과외활동', weight: '높음', note: '글로벌 보건·외교·정치·봉사 관련 활동이 Georgetown과 매우 잘 맞음' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러. 인성과 사회 기여 의지를 구체적으로 서술' },
    ],
  },

  'USC': {
    fullName: 'University of Southern California',
    location: 'Los Angeles, CA (University Park)',
    type: '사립 연구중심대학',
    founded: '1880년',
    size: '약 49,000명 (학부 ~23,000명)',
    acceptRate: '~11.4%',
    intlRate: '~13% (국제학생 비율 높음)',
    satPolicy: '선택 제출',
    satRange: '1410 ~ 1550',
    satRangeKR: '1480 ~ 1550 (비공식 추정)',
    tuition: '$68,237 (전미 최고 수준 학비)',
    coa: '~$93,000/년 (학비+LA 생활비 — 2그룹 최고)',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '평균 $40,000+ (전체 학생)',
    avgAidKR: '~$10,000~25,000 추정 (Need-Aware — 국제학생 재정지원 불확실)',
    preMedRating: '중상',
    preMedNote: 'Keck School of Medicine 연계. LA 위치로 세계적 병원군 접근. Pre-Med 환경 양호하지만 내부 경쟁 치열. 국제학생 비율 높아 다양성 프리미엄 낮음.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED', 'RD'],
    mapX: 12,
    mapY: 64,
    color1: '#990000',
    color2: '#6B0000',
    emoji: '🎬',
    kkumiNote: '⚠️ 학비 $68K + COA ~$93K — 2그룹 최고 비용. Need-Aware + 국제학생 재정지원 불확실. 국제학생 비율 ~13%로 높아 파나마 희소성 낮음. Keck 의대 연계 Pre-Med 환경 양호. LA 엔터·테크 산업 연계 강점. 먼저 비용 대비 가치 검토 필요.',
    panamaNote: '📍 Need-Aware(국제학생) → 재정 불확실. 국제학생 비율 높아 파나마 희소성 상대적 낮음. LA의 대규모 히스패닉+한인 문화 접점. Keck 의대 연계 Pre-Med 기회. 비용 대비 효율은 낮은 편.',
    chemNote: '🎬 USC 화학과는 연구 수준 우수. LA 위치로 제약·바이오 산업 인접. Keck 의대 연계 의화학 연구 기회. 나노화학·재료화학 분야 강함. 꾸미 Pre-Med 목표에 적절한 연결 — 단 비용 대비 효율 체크 필요.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'Cooper Union': {
    fullName: 'Cooper Union for the Advancement of Science and Art',
    location: 'New York City, NY (East Village)',
    type: '사립 공학·건축·예술 특화 대학',
    founded: '1859년',
    size: '약 900명 (초초소규모 — 공학·건축·예술 전문)',
    acceptRate: '~12% (공학부 ~6% — 극도 선별적)',
    intlRate: '~10%',
    satPolicy: '필수 제출',
    satRange: '1480 ~ 1570',
    satRangeKR: '1510 ~ 1570 (수학 800 기대치 — 공학부 기준)',
    tuition: '$55,900 (전원 반액 장학금 자동 지급 → 실질 $27,950/년)',
    coa: '~$52,000~57,000/년 (반액 장학금 후 실질 비용 + NYC 생활비)',
    needBlindDomestic: true,
    needBlindIntl: false,
    avgAid: '🎓 모든 입학생 반액(50%) 장학금 자동 지급 + 추가 Need-Based Aid 가능',
    avgAidKR: '반액 장학금 자동 $27,950/년 절감 + 추가 Need-Based Aid 가능. 2그룹 중 가장 경제적인 학교 중 하나',
    preMedRating: '낮음',
    preMedNote: '공학·건축·예술 특화 학교. Pre-Med 트랙 없음. 의대 진학 목표와 완전히 다른 방향. 전기·기계·화학공학 분야 세계적 수준.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED', 'RD'],
    mapX: 88,
    mapY: 38,
    color1: '#CF2030',
    color2: '#8B0012',
    emoji: '🔩',
    kkumiNote: '❌ Pre-Med 목표와 방향 완전히 다름. 모든 학생 반액(50%) 장학금 자동 — 2그룹 최고 비용 효율. NYC 위치. 화학공학 방향으로 전환 시 세계적 환경. 꾸미 Pre-Med 목표로는 지원 부적합.',
    panamaNote: '📍 반액 장학금 → 재정 상대적 안심. NYC 위치. 공학·예술 분야면 파나마 배경보다 STEM 실력이 절대 우선. Pre-Med 목표 꾸미에게 부적합.',
    chemNote: '🔩 Cooper Union 화학공학과는 세계적 수준. 단 Pre-Med 화학 트랙 없음. 화학공학·재료공학 방향에 특화. 꾸미 Pre-Med 목표 기준으로는 방향이 다름. 화학공학 방향 관심 시 NYC + 반액 장학금은 최강 조합.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'Franklin W. Olin College of Engineering': {
    fullName: 'Franklin W. Olin College of Engineering',
    location: 'Needham, MA (Boston 근교)',
    type: '사립 공학 특화 대학 (혁신 공학 교육)',
    founded: '1997년 (미국 최신 명문 공학 대학)',
    size: '약 360명 (초초초소규모 — 전미 최소 공학 명문)',
    acceptRate: '~15% (지원자 자체가 매우 선별적)',
    intlRate: '~10%',
    satPolicy: '선택 제출',
    satRange: '1480 ~ 1560',
    satRangeKR: '1510 ~ 1560 (수학 800 기대치)',
    tuition: '$60,350 (전원 반액 장학금 자동 지급 → 실질 $30,175/년)',
    coa: '~$55,000~60,000/년 (반액 장학금 후 실질 비용 + Boston 생활비)',
    needBlindDomestic: true,
    needBlindIntl: false,
    avgAid: '🎓 모든 입학생 반액(50%) 장학금 자동 지급 + 추가 Need-Based Aid 가능',
    avgAidKR: '반액 장학금 자동 $30,175/년 절감. Boston 근교 MIT·Harvard 커뮤니티 접근 가능',
    preMedRating: '낮음',
    preMedNote: '순수 공학 특화 학교. Pre-Med 트랙 없음(공학 학위만 수여). 의대 진학 목표와 완전히 다른 방향. 프로젝트 기반 혁신 공학 교육 독보적.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['RD'],
    mapX: 93,
    mapY: 31,
    color1: '#003F87',
    color2: '#002254',
    emoji: '🔧',
    kkumiNote: '❌ Pre-Med 목표와 방향 완전히 다름. 360명 초소규모 + 모든 학생 반액(50%) 장학금 자동. Boston 근교라 MIT·Harvard 커뮤니티 접근 가능. 공학 방향 전환 시 비용 효율 최강. 꾸미 Pre-Med 목표로는 부적합.',
    panamaNote: '📍 반액 장학금 → 재정 상대적 안심. Boston 근교. 공학 분야면 Olin의 비용 효율과 혁신 교육 탁월. Pre-Med 꾸미에게는 방향 안 맞음.',
    chemNote: '🔧 Olin은 화학 전공이 없음(기계·전기·컴퓨터공학 중심). Pre-Med 화학 트랙 없음. 꾸미의 화학+Pre-Med 목표와 방향이 맞지 않음. 공학 방향 전환 시에만 고려 대상.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  // ─────────────────────────────────────────
  //  2 Group 상 2 (27~31위)
  // ─────────────────────────────────────────

  'Emory': {
    fullName: 'Emory University',
    location: 'Atlanta, GA',
    type: '사립 연구중심대학',
    founded: '1836년',
    size: '약 22,000명 (학부 ~7,000명)',
    acceptRate: '~13.8%',
    intlRate: '~7%',
    satPolicy: '선택 제출',
    satRange: '1430 ~ 1540',
    satRangeKR: '1480 ~ 1540 (비공식 추정)',
    tuition: '$61,570',
    coa: '~$84,000/년',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '평균 $41,000+ (전체 학생)',
    avgAidKR: '~$15,000~30,000 추정 (Need-Aware — 국제학생 재정지원 불확실)',
    preMedRating: '상',
    preMedNote: 'Emory 의대 전국 Top 25. Atlanta = CDC(미국 질병통제센터) 본부 인근. Emory University Hospital 임상 환경 탁월. Biology/Chemistry Pre-Med 연계 우수. 의대 진학률 전국 최상위권.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED', 'RD'],
    mapX: 71,
    mapY: 66,
    color1: '#012169',
    color2: '#00154D',
    emoji: '🦅',
    kkumiNote: '✅ Pre-Med 목표 꾸미에게 강력 추천. Atlanta = CDC + Emory Hospital. 의대 진학률 전국 최상위. Need-Aware 재정 주의. Georgetown과 함께 꾸미 2그룹 핵심 타겟. 소규모(7,000명)로 교수 접근성 우수.',
    panamaNote: '📍 Need-Aware → 재정 불확실. Atlanta 위치 — CDC 본부 인근. 파나마 출신 + 공중보건·의학 관심 → Emory-CDC 파트너십이 독보적 강점. 라틴아메리카 사정관 평가. 파나마 희소성 효과 있음.',
    chemNote: '🦅 Emory 화학과는 Pre-Med 연계 최강. 생화학·의화학 연구에 CDC 연구진과 협업 가능. Pre-Med 화학 트랙 탄탄. 꾸미의 화학+의학 목표에 매우 잘 맞는 환경. 교수 접근성도 대형 학교보다 좋음.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. Pre-Med 지원 시 이과 만점 기대' },
      { label: 'Why Emory 에세이', weight: '핵심', note: 'Emory+CDC 연계·글로벌 보건 관심 연결 에세이가 매우 효과적' },
      { label: 'Pre-Med 헌신', weight: '핵심', note: '의학 관심 활동 필수. Emory 병원·CDC 연계 강조하면 큰 강점' },
      { label: '과외활동', weight: '높음', note: '의료봉사·연구·글로벌 보건 관련 활동. Emory 철학과 맞는 것 우선' },
      { label: '추천서', weight: '높음', note: '교사+카운슬러. 학문적 능력과 의료 분야 열정 서술' },
      { label: '다양성', weight: '중간', note: '파나마 배경 + 공중보건 관심은 Emory-CDC 파트너십과 강한 시너지' },
    ],
  },

  'U of Virginia': {
    fullName: 'University of Virginia',
    location: 'Charlottesville, VA',
    type: '공립 대학 (토마스 제퍼슨 설립)',
    founded: '1819년 (토마스 제퍼슨이 설립한 역사적 명문)',
    size: '약 27,000명 (학부 ~17,000명)',
    acceptRate: '~18% (국제학생 실질 합격률 훨씬 낮음)',
    intlRate: '~4%',
    satPolicy: '선택 제출',
    satRange: '1380 ~ 1540',
    satRangeKR: '1470 ~ 1540 (비공식 추정)',
    tuition: '~$54,000/년 (국제학생 비거주민 기준)',
    coa: '~$77,000/년 (국제학생 전체 비용)',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 매우 제한적 (공립 버지니아주)',
    avgAidKR: '~$5,000~15,000 추정 (공립 — 국제학생 지원 제한적. 주내 학생 우대)',
    preMedRating: '중상',
    preMedNote: 'UVA 의대 전국 Top 25. Pre-Med 환경 우수. 대형 학교(17,000명)라 내부 경쟁 치열. Charlottesville 의료기관 접근 가능. 공립 특성상 버지니아 주내 학생 경쟁 우위.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 80,
    mapY: 48,
    color1: '#232D4B',
    color2: '#14192D',
    emoji: '📜',
    kkumiNote: '공립이지만 사립급 위상 (\'Public Ivy\'). 토마스 제퍼슨 설립 역사적 명문. 국제학생 재정지원 제한적. EA 지원 가능. UVA 의대 Top 25. 국제학생 실질 합격률은 전체(18%)보다 훨씬 낮음 주의.',
    panamaNote: '📍 공립 → 국제학생 재정지원 제한적. EA 지원 가능(비서약). Charlottesville = 조용하고 아름다운 대학 도시. 파나마 출신 희소성 효과 있지만 공립 특성상 재정은 스스로 해결해야 함.',
    chemNote: '📜 UVA 화학과 연구 수준 상위권. 분석화학·합성화학 분야 우수. UVA 의대 연계 의화학 연구. 역사적 건축물 안에서의 학문 환경 특별. Pre-Med 화학 트랙 있음. 대형 학교라 교수 접근성 노력 필요.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'Tufts': {
    fullName: 'Tufts University',
    location: 'Medford, MA (Boston 근교)',
    type: '사립 연구중심대학',
    founded: '1852년',
    size: '약 13,000명 (학부 ~6,500명)',
    acceptRate: '~9.7%',
    intlRate: '~7%',
    satPolicy: '선택 제출',
    satRange: '1450 ~ 1570',
    satRangeKR: '1490 ~ 1560 (비공식 추정)',
    tuition: '$67,156',
    coa: '~$89,000/년 (Boston 생활비 포함)',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '평균 $37,000+ (전체 학생)',
    avgAidKR: '~$15,000~25,000 추정 (Need-Aware — 국제학생 재정지원 불확실)',
    preMedRating: '상',
    preMedNote: 'Tufts School of Medicine 연계. Boston 인근 세계적 병원군(Mass General, Brigham & Women\'s) 접근. 소규모(6,500명)라 교수 접근성 우수. 국제관계·Global Health 프로그램 특화. 의대 진학률 상위권.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED', 'RD'],
    mapX: 93,
    mapY: 30,
    color1: '#052049',
    color2: '#031430',
    emoji: '🌿',
    kkumiNote: 'Boston 근교 사립 명문. Tufts 의대 + 세계적 병원 접근. 소규모(6,500명) 교수 접근성 우수. Need-Aware 재정 주의. 국제관계·Global Health 특화로 파나마 배경 꾸미에게 매력적. 합격률 ~9.7%로 선별적.',
    panamaNote: '📍 Need-Aware(국제학생). Boston 근교 = 세계 최고 의료 환경. 국제관계·Global Health 프로그램이 파나마 배경과 자연스럽게 연결. 파나마 출신 희소성 효과 있음. Tufts의 다문화·외교 감수성과 꾸미 프로필 잘 맞음.',
    chemNote: '🌿 Tufts 화학과는 소규모+우수 교수진 조합. Boston 인근 제약·바이오텍 인턴십 접근. Tufts 의대 연계 생화학 연구. Pre-Med 화학 트랙 탄탄. 대형 학교보다 교수 1:1 접근성 훨씬 좋음.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'U of Michigan': {
    fullName: 'University of Michigan',
    location: 'Ann Arbor, MI',
    type: '공립 대학 (University of Michigan System)',
    founded: '1817년',
    size: '약 48,000명 (학부 ~31,000명)',
    acceptRate: '~18%',
    intlRate: '~7%',
    satPolicy: '선택 제출',
    satRange: '1390 ~ 1560',
    satRangeKR: '1470 ~ 1540 (비공식 추정)',
    tuition: '~$53,258/년 (국제학생 비거주민 기준)',
    coa: '~$74,000/년 (국제학생 전체 비용)',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 매우 제한적 (공립 미시간주)',
    avgAidKR: '~$5,000~15,000 추정 (공립 — 국제학생 지원 제한적)',
    preMedRating: '상',
    preMedNote: 'Michigan Medical School 전국 Top 10. Pre-Med 환경 탁월. 대형 학교(31,000명)라 내부 경쟁 치열하지만 연구 기회 풍부. 의대 진학률 전미 상위권. EA 지원 가능.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 71,
    mapY: 31,
    color1: '#00274C',
    color2: '#001831',
    emoji: '🏆',
    kkumiNote: '전미 최고 공립 중 하나 (\'Public Ivy\'). Michigan 의대 Top 10. EA 지원 가능(비서약). 국제학생 재정지원 제한적(공립). 대형(31,000명)이라 Pre-Med 내부 경쟁 치열. 학비 $53K(비거주민) 상대적 저렴하지만 재정지원 거의 없음.',
    panamaNote: '📍 공립 → 국제학생 재정지원 제한적. EA 지원 가능(비서약). Ann Arbor = 아름다운 대학 도시. Michigan 의대 Top 10. 파나마 출신 희소성 효과 있음. 대형 학교라 파나마 배경보다 성적·활동이 절대 우선.',
    chemNote: '🏆 Michigan 화학과 전국 Top 10. 합성화학·분광학·계산화학 분야 강함. Michigan 의대 연계 의화학 연구. 대학원 수준의 학부 연구 참여 기회. 단 대형 학교라 학부 단계 교수 접근성 노력 필요.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'UNC Chapel Hill': {
    fullName: 'University of North Carolina at Chapel Hill',
    location: 'Chapel Hill, NC',
    type: '공립 대학 (미국 최초의 공립 대학, 1789년)',
    founded: '1789년 (미국 최초의 공립 대학)',
    size: '약 32,000명 (학부 ~20,000명)',
    acceptRate: '~17% (국제학생 실질 합격률 훨씬 낮음)',
    intlRate: '~3%',
    satPolicy: '선택 제출',
    satRange: '1340 ~ 1530',
    satRangeKR: '1440 ~ 1530 (비공식 추정)',
    tuition: '~$45,240/년 (국제학생 비거주민 기준)',
    coa: '~$66,000/년 (국제학생 전체 비용)',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 매우 제한적 (공립 노스캐롤라이나주)',
    avgAidKR: '~$5,000~10,000 추정 (공립 — 국제학생 지원 극히 제한적)',
    preMedRating: '상',
    preMedNote: 'UNC 의대 전국 Top 25 (1차 의료·공공보건 특화). Gillings School of Public Health 세계 Top급. Research Triangle(Chapel Hill-Durham-Raleigh) 의료·제약 연구 허브. 의대 진학률 상위권.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 79,
    mapY: 56,
    color1: '#13294B',
    color2: '#0B1A30',
    emoji: '🌊',
    kkumiNote: '미국 최초의 공립대(1789). UNC 의대 + Gillings 공중보건대학원 세계Top. 공립이라 국제학생 재정지원 사실상 없음. 학비 $45K(비거주민) 2그룹 중 저렴. Research Triangle 의료 환경 탁월. 국제학생 실질 합격률 낮음 주의.',
    panamaNote: '📍 공립 → 국제학생 재정지원 매우 제한적. Research Triangle = 세계적 의료·제약 허브. Gillings 공중보건 + 라틴아메리카 건강 연구. 파나마 배경을 공중보건 관심으로 연결 가능. 국제학생 합격률 매우 낮음 주의.',
    chemNote: '🌊 UNC 화학과 전국 상위권. 분석화학·방법론 분야 강함. Lineberger Cancer Center 연계 항암 화학 연구. Research Triangle 제약 인턴십 접근. Pre-Med 화학 트랙 있음. 공립 대비 높은 연구 수준.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  // ─────────────────────────────────────────
  //  2 Group 중단 1 (32~34위)
  // ─────────────────────────────────────────

  'Boston College': {
    fullName: 'Boston College',
    location: 'Chestnut Hill, MA (Boston 근교)',
    type: '사립 연구중심대학 (가톨릭 예수회)',
    founded: '1863년',
    size: '약 14,000명 (학부 ~9,500명)',
    acceptRate: '~16.3%',
    intlRate: '~5%',
    satPolicy: '선택 제출',
    satRange: '1410 ~ 1540',
    satRangeKR: '1470 ~ 1540 (비공식 추정)',
    tuition: '$66,512',
    coa: '~$88,000/년 (Boston 생활비 포함)',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '평균 $36,000+ (전체 학생)',
    avgAidKR: '~$15,000~25,000 추정 (Need-Aware — 국제학생 재정지원 불확실)',
    preMedRating: '중상',
    preMedNote: '자체 의대 없음. Boston 인근 세계적 병원군(Brigham & Women\'s, Dana-Farber, Beth Israel) 접근. 가톨릭 예수회 대학으로 의료 윤리·봉사 문화 강함. Pre-Med 환경 양호. 의대 진학률 괜찮음.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 93,
    mapY: 31,
    color1: '#8A0000',
    color2: '#5C0000',
    emoji: '⛪',
    kkumiNote: 'Georgetown과 유사한 가톨릭 예수회 대학. Boston 인근 세계적 병원 접근. Need-Aware 재정 주의. 합격률 ~16%로 접근 가능한 편. 파나마 가톨릭 배경(파나마는 가톨릭 국가)과 문화적 연결 가능. Pre-Med 환경 양호.',
    panamaNote: '📍 가톨릭 예수회 대학 — 파나마 가톨릭 문화권 배경과 자연스러운 연결. Need-Aware(국제학생) 재정 주의. Boston 인근 세계적 의료 환경. 라틴아메리카 사정관 평가. 파나마 출신 희소성 효과 있음.',
    chemNote: '⛪ BC 화학과는 Boston의 연구 생태계 속에서 성장. Dana-Farber Cancer Institute 등 인근 의료기관 연계 가능. Pre-Med 화학 트랙 있음. 소규모 대비 우수한 연구 환경. 교수 접근성 Emory·Tufts보다 약간 낮음.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'Boston University': {
    fullName: 'Boston University',
    location: 'Boston, MA (Charles River 캠퍼스)',
    type: '사립 연구중심대학',
    founded: '1839년',
    size: '약 36,000명 (학부 ~17,000명)',
    acceptRate: '~14.8%',
    intlRate: '~12% (국제학생 비율 높음)',
    satPolicy: '선택 제출',
    satRange: '1380 ~ 1540',
    satRangeKR: '1460 ~ 1530 (비공식 추정)',
    tuition: '$65,168',
    coa: '~$88,000/년 (Boston 생활비 포함)',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '평균 $42,000+ (전체 학생)',
    avgAidKR: '~$15,000~25,000 추정 (Need-Aware — 국제학생 비율 높아 재정 경쟁 있음)',
    preMedRating: '중상',
    preMedNote: 'Chobanian & Avedisian School of Medicine 연계. 🏥 7년 통합 BA/MD 프로그램(AMP) 존재 — 매년 ~16명 극도 선별적. 국제학생 지원 가능 여부는 공식 홈페이지 최신 확인 필수. Boston 세계적 병원군 접근.',
    bsMd: true,
    bsMdProgram: 'BA/MD 7년 통합 프로그램 (AMP) — 매년 ~16명, 극도 선별적. ⚠️ 국제학생 지원 가능 여부 공식 확인 필수',
    applyTypes: ['EA', 'RD'],
    mapX: 93,
    mapY: 32,
    color1: '#CC0000',
    color2: '#880000',
    emoji: '🏙️',
    kkumiNote: '국제학생 비율 ~12%로 높아 파나마 희소성 상대적 낮음. 7년 BA/MD 프로그램 존재(국제학생 지원 적합성 확인 필요). Need-Aware 재정 주의. Boston 세계적 병원 환경. Pre-Med 내부 경쟁 있음.',
    panamaNote: '📍 Need-Aware(국제학생) + 국제학생 비율 12%로 희소성 낮음. Boston = 세계 최고 의료 환경. 7년 BA/MD 프로그램 관심 시 공식 확인 필요. 라틴아메리카 사정관 평가.',
    chemNote: '🏙️ BU 화학과는 Boston의 의료연구 생태계 내에서 강함. Rafik B. Hariri Institute for Computing 연계 계산화학. Pre-Med 화학 트랙 있음. Chobanian 의대 연계 의화학 연구 기회. 대형 학교라 교수 접근성 노력 필요.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'Haverford': {
    fullName: 'Haverford College',
    location: 'Haverford, PA (Philadelphia 근교 30분)',
    type: '사립 Liberal Arts College (Quaker 전통)',
    founded: '1833년',
    size: '약 1,400명 (초소규모 — Quaker 명문 LAC)',
    acceptRate: '~14.7%',
    intlRate: '~8%',
    satPolicy: '선택 제출',
    satRange: '1440 ~ 1560',
    satRangeKR: '1490 ~ 1550 (비공식 추정)',
    tuition: '$65,392',
    coa: '~$84,000/년',
    needBlindDomestic: true,
    needBlindIntl: false,
    avgAid: '평균 $55,000+ (Need 100% 충족 정책)',
    avgAidKR: '~$25,000~40,000 추정 (국제학생 Need-Aware이지만 합격 후 재정지원 후한 편)',
    preMedRating: '상',
    preMedNote: 'Quaker 전통 초소규모 LAC. Pre-Med 환경 우수. Bryn Mawr·Swarthmore와 Tri-College Consortium — 화학·생물학 강의 공유. Philadelphia 인근 세계적 병원군(Penn Medicine, CHOP) 접근. Honor Code 기반 협력적 학문 문화.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED', 'RD'],
    mapX: 86,
    mapY: 40,
    color1: '#0F0F5A',
    color2: '#080838',
    emoji: '🕊️',
    kkumiNote: '초소규모(1,400명) 교수 1:1 접근성 최고. Swarthmore·Bryn Mawr Consortium으로 수업 선택 폭 확대. Quaker 협력·평화 문화. Philadelphia 인근 병원 접근. Need 100% 충족 정책으로 재정지원 후함. 꾸미 Pre-Med 목표에 강력 추천.',
    panamaNote: '📍 Quaker 평화·사회정의 전통 — 파나마 국제적 배경과 잘 맞음. Philadelphia 근교. 국제학생 재정지원 후한 편. 파나마 출신 희소성 효과 있음. 소규모에서 다양성 가치 크게 두드러짐.',
    chemNote: '🕊️ Haverford 화학과는 초소규모 LAC 최고 수준. Swarthmore·Bryn Mawr Consortium 화학 강의 공유. Phil 인근 Penn Medicine 연계 가능. 교수 1:1 연구 지도 독보적. Pre-Med 화학 트랙 탄탄. 꾸미에게 강력 추천하는 화학 환경.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'Colby': {
    fullName: 'Colby College',
    location: 'Waterville, ME (메인주 내륙)',
    type: '사립 Liberal Arts College',
    founded: '1813년',
    size: '약 2,200명 (소규모 LAC)',
    acceptRate: '~14.8%',
    intlRate: '~8%',
    satPolicy: '점수 미반영',
    satRange: 'N/A (Colby는 2020년부터 영구 Test-Free 정책)',
    satRangeKR: 'N/A (SAT 점수를 입시에 사용하지 않음)',
    tuition: '$65,870',
    coa: '~$84,000/년',
    needBlindDomestic: true,
    needBlindIntl: false,
    avgAid: '평균 $56,000+ (Need 100% 충족 정책)',
    avgAidKR: '~$20,000~40,000 추정 (국제학생 Need-Aware이지만 합격 후 100% Need 충족 정책)',
    preMedRating: '중',
    preMedNote: '소규모 LAC(2,200명). Pre-Med 환경 보통. Waterville = 메인주 내륙 소도시로 의료기관 접근 제한적. 환경·해양과학 강점. 화학·생물학 기초 탄탄. 연구 지향 학생에게 적합한 소규모 환경.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED', 'RD'],
    mapX: 96,
    mapY: 22,
    color1: '#002868',
    color2: '#001540',
    emoji: '🏔️',
    kkumiNote: 'Test-Free 영구 정책(2020~) — SAT 점수 완전히 관계없음. 에세이·활동·인터뷰 중심 평가. Need 100% 충족 정책 재정지원 후함. 메인주 시골 위치 — 도시 생활 제한. 꾸미 SAT와 무관하게 스토리로 승부하는 학교.',
    panamaNote: '📍 Test-Free → 파나마 국제학교 배경·에세이 스토리가 절대 핵심. Need 100% 충족. 메인주 위치 — 자연환경 탁월. 파나마 출신 희소성 효과 있음. 조용한 환경을 선호한다면 Colby는 좋은 선택.',
    chemNote: '🏔️ Colby 화학과는 소규모 LAC 내에서 환경화학·분석화학 강점. 메인 자연환경을 활용한 현장 화학 연구 독특. Pre-Med 화학 기초 탄탄. 교수 1:1 접근성 좋음. 단 도시 병원 접근 제한으로 임상 Pre-Med 환경은 약함.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'Vassar': {
    fullName: 'Vassar College',
    location: 'Poughkeepsie, NY (NYC 북쪽 2시간)',
    type: '사립 Liberal Arts College (Seven Sisters 출신 공학)',
    founded: '1861년 (원래 여대, 1969년 공학 전환)',
    size: '약 2,450명 (소규모 LAC)',
    acceptRate: '~16.8%',
    intlRate: '~7%',
    satPolicy: '선택 제출',
    satRange: '1430 ~ 1560',
    satRangeKR: '1470 ~ 1540 (비공식 추정)',
    tuition: '$66,290',
    coa: '~$85,000/년',
    needBlindDomestic: true,
    needBlindIntl: false,
    avgAid: '평균 $52,000+ (Need 100% 충족 정책)',
    avgAidKR: '~$20,000~35,000 추정 (국제학생 Need-Aware이지만 합격 후 재정지원 후함)',
    preMedRating: '중',
    preMedNote: '소규모 LAC. Pre-Med 환경 보통. Poughkeepsie에 지역 병원 있지만 세계적 병원군 접근 제한. 인문학·사회과학·예술 분야 강한 Liberal Arts 분위기. 화학·생물학 기초 있음.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED', 'RD'],
    mapX: 88,
    mapY: 33,
    color1: '#721232',
    color2: '#4A0B1F',
    emoji: '🎨',
    kkumiNote: 'Seven Sisters 출신 공학(남녀공학 전환 1969). 소규모(2,450명) 교수 접근성 우수. Need 100% 충족 재정지원 후함. Pre-Med보다 인문·예술·교육 강한 분위기. NYC 2시간 거리. 꾸미 Pre-Med 목표에 우선순위 중간.',
    panamaNote: '📍 국제학생 Need-Aware이지만 합격 후 재정지원 후함. NYC 2시간. 다양성·예술·표현 중시 학교 문화 — 파나마 한인 다문화 스토리 환영. 파나마 출신 희소성 효과 있음.',
    chemNote: '🎨 Vassar 화학과는 소규모 LAC 내 우수. 분석화학·물리화학 分야. Pre-Med 화학 트랙 있음. NYC 근접성 활용한 외부 연구 인턴십 가능. 단 Pre-Med 중심보다 기초 과학 탐구 문화가 강함.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  // ─────────────────────────────────────────
  //  2 Group 중단 2 (35~40위)
  // ─────────────────────────────────────────

  'UCSD': {
    fullName: 'University of California, San Diego',
    location: 'La Jolla, CA (San Diego 북쪽 해안)',
    type: '공립 대학 (University of California System)',
    founded: '1960년',
    size: '약 45,000명 (학부 ~31,000명)',
    acceptRate: '~24%',
    intlRate: '~9%',
    satPolicy: '점수 미반영',
    satRange: 'N/A (UC System 전체 영구 Test-Free)',
    satRangeKR: 'N/A (SAT 점수를 입시에 사용하지 않음)',
    tuition: '~$46,000/년 (국제학생 — NRST 포함)',
    coa: '~$70,000~75,000/년 (국제학생 전체 비용)',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 사실상 $0 (UC 공립 시스템 정책)',
    avgAidKR: '사실상 $0 — 4년 총 비용 ~$280,000~300,000 ⚠️ 재정지원 받는 사립보다 실질 비용이 더 비쌀 수 있음',
    preMedRating: '상',
    preMedNote: 'UCSD School of Medicine 전국 Top 15. Salk Institute·Scripps Research Institute 바로 인근 — 생명과학 연구 환경 세계 최강. Pre-Med 환경 탁월하지만 공립이라 재정지원 없음. 내부 경쟁 치열.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['RD'],
    mapX: 13,
    mapY: 69,
    color1: '#00629B',
    color2: '#003F6B',
    emoji: '🔱',
    kkumiNote: '⚠️ UC 공립 — 국제학생 재정지원 사실상 $0. 4년 총 비용 ~$280K~300K. UCSD 의대 Top 15 + Salk/Scripps 연구 환경 세계 최강. Test-Free. San Diego 기후 최고. 단 재정지원 없는 공립 비용은 사립 명문과 동급이므로 재정 재검토 필수.',
    panamaNote: '📍 UC 공립 → 국제학생 재정지원 $0. Test-Free → SAT 관계없음. San Diego = 라틴아메리카 문화 접점 강함(멕시코 국경 인접). 파나마 출신 희소성 있음. UCSD 의대 연계 Pre-Med 기회 탁월 — 단 비용이 문제.',
    chemNote: '🔱 UCSD 화학과 전국 Top 10. Salk Institute·Scripps Research 인접 — 세계 최고 생화학·구조생물학 연구 환경. Pre-Med 화학 트랙 우수. Nobel 수상자 다수 재직. 단 대규모 공립이라 학부 단계 교수 접근성 노력 필요.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'UIUC': {
    fullName: 'University of Illinois at Urbana-Champaign',
    location: 'Champaign, IL (Midwest — 소도시)',
    type: '공립 대학 (University of Illinois System)',
    founded: '1867년',
    size: '약 56,000명 (학부 ~35,000명)',
    acceptRate: '~42% (전체; CS/Engineering은 ~12% 수준)',
    intlRate: '~22% (전미 최상위 국제학생 비율)',
    satPolicy: '선택 제출',
    satRange: '1350 ~ 1570 (전공별 격차 매우 큼)',
    satRangeKR: '1450 ~ 1540 (비공식 추정 — CS/Engineering 기준)',
    tuition: '~$36,892/년 (국제학생 비거주민)',
    coa: '~$55,000~60,000/년 (Champaign 생활비 저렴)',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 매우 제한적 (공립 일리노이주)',
    avgAidKR: '~$5,000~10,000 추정 (공립 — Merit 장학금 중심, Need-based 거의 없음)',
    preMedRating: '중',
    preMedNote: 'CS·공학 세계 최강 (CS 전국 Top 3). Pre-Med 전용 환경 약함. Carle Illinois College of Medicine (2018, 세계 최초 공학+의대 융합) 연계. Pre-Med보다 Bioengineering·CS+Bio 방향이 더 적합.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 63,
    mapY: 40,
    color1: '#13294B',
    color2: '#0A1A30',
    emoji: '💻',
    kkumiNote: '⚠️ 국제학생 비율 ~22% — 파나마 희소성 극히 낮음. CS/공학 세계 최강. Pre-Med 목표와 방향 다름. Champaign = 조용한 대학 도시. 공립이라 학비 저렴($37K)하지만 재정지원 거의 없음. Carle Illinois 의대는 공학+의료 융합에 관심 있는 경우만.',
    panamaNote: '📍 공립 → 국제학생 재정지원 제한적. 국제학생 22%로 파나마 희소성 극히 낮음. CS/공학 방향이면 UIUC 비용 대비 최강. Pre-Med 목표 꾸미에게는 방향 안 맞음.',
    chemNote: '💻 UIUC 화학과 전국 Top 10 (특히 재료화학·계산화학). Carle Illinois 의대 연계 가능. 단 Pre-Med 화학 트랙보다 화학공학·재료과학 방향에 특화. 꾸미 화학+Pre-Med 목표와는 방향이 다소 달라.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'U of Florida': {
    fullName: 'University of Florida',
    location: 'Gainesville, FL',
    type: '공립 대학 (University of Florida System)',
    founded: '1853년',
    size: '약 59,000명 (학부 ~36,000명)',
    acceptRate: '~23%',
    intlRate: '~4%',
    satPolicy: '선택 제출',
    satRange: '1330 ~ 1490',
    satRangeKR: '1420 ~ 1490 (비공식 추정)',
    tuition: '~$28,659/년 (국제학생 비거주민 — 2그룹 최저)',
    coa: '~$50,000~55,000/년 (Gainesville 생활비 저렴)',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 매우 제한적 (공립 플로리다주)',
    avgAidKR: '~$5,000~10,000 추정 (공립 — Florida Bright Futures 장학금은 거주민만 해당)',
    preMedRating: '중상',
    preMedNote: 'UF College of Medicine 전국 상위권. UF Health Shands Hospital(플로리다 최대) 바로 인접. 플로리다 라틴아메리카 커뮤니티 강점. Pre-Med 환경 우수. 단 국내 플로리다 거주민 경쟁 우위.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 74,
    mapY: 81,
    color1: '#003087',
    color2: '#001F5C',
    emoji: '🐊',
    kkumiNote: '2그룹 최저 학비($28K) — 비용 효율 최강. 국제학생 재정지원은 없지만 COA 자체가 낮음. UF 의대 + Shands Hospital 임상 환경 탁월. 플로리다 라틴아메리카·쿠바·파나마 커뮤니티 실질적. EA 가능.',
    panamaNote: '📍 공립 → 국제학생 재정지원 제한적. Gainesville = 플로리다 내륙 대학 도시. 플로리다 라틴아메리카(쿠바·멕시코·파나마) 커뮤니티 문화 접점 강함. Shands Hospital Pre-Med 임상 기회. 파나마 출신 희소성 효과 있음.',
    chemNote: '🐊 UF 화학과 전국 상위권. 특히 유기화학·신소재 분야 강함. UF Health 연계 의화학 연구. Gainesville 플로리다 기후 속 현장 환경 연구. Pre-Med 화학 트랙 있음. 2그룹 중 비용 대비 화학 교육 효율 최강.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'Northeastern': {
    fullName: 'Northeastern University',
    location: 'Boston, MA (Fenway 인근)',
    type: '사립 연구중심대학 (Co-op 교육 특화)',
    founded: '1898년',
    size: '약 30,000명 (학부 ~14,000명)',
    acceptRate: '~6.8% (급격히 선별적)',
    intlRate: '~18% (전미 최상위 국제학생 비율)',
    satPolicy: '선택 제출',
    satRange: '1450 ~ 1570',
    satRangeKR: '1490 ~ 1560 (비공식 추정)',
    tuition: '$63,141',
    coa: '~$89,000/년 (Boston 생활비 포함)',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '평균 $36,000+ (전체 학생)',
    avgAidKR: '~$15,000~25,000 추정 (Need-Aware — 국제학생 비율 높아 재정 경쟁 있음)',
    preMedRating: '중상',
    preMedNote: 'Co-op 프로그램 (6개월 실습) 특화 — 의료기관 Co-op 가능. Boston 병원군(Mass General, Brigham & Women\'s 등) 접근 탁월. 단 국제학생 비율 ~18%로 전미 최고 — 파나마 희소성 극히 낮음.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED', 'RD'],
    mapX: 93,
    mapY: 32,
    color1: '#C8102E',
    color2: '#871020',
    emoji: '🤝',
    kkumiNote: '⚠️ 국제학생 비율 ~18% — 파나마 희소성 극히 낮음. 합격률 ~6.8%로 급격히 선별적. Co-op 실습 특화(의료기관 실습 가능). Need-Aware 재정 주의. Boston 최고의 의료 환경. 비용 대비 효율성과 희소성 먼저 검토 필요.',
    panamaNote: '📍 Need-Aware + 국제학생 18%로 파나마 희소성 최저. Co-op 의료기관 실습은 파나마 배경보다 스펙이 절대 우선. Boston = 최고 의료 환경. 희소성 낮음을 감안해 지원 전략 신중히 검토.',
    chemNote: '🤝 Northeastern 화학과는 Co-op 연계 제약·바이오 실습 접근 탁월. Boston 인근 Pfizer·Biogen 인턴십. Pre-Med 화학 트랙 있음. Co-op으로 6개월 연구소 실습 가능 — 화학 연구 경험 쌓기에 독보적 환경.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'Lehigh': {
    fullName: 'Lehigh University',
    location: 'Bethlehem, PA (Philadelphia 북쪽 1시간)',
    type: '사립 연구중심대학 (공학·비즈니스 특화)',
    founded: '1865년',
    size: '약 9,000명 (학부 ~5,500명)',
    acceptRate: '~39%',
    intlRate: '~5%',
    satPolicy: '선택 제출',
    satRange: '1370 ~ 1530',
    satRangeKR: '1440 ~ 1510 (비공식 추정)',
    tuition: '$66,020',
    coa: '~$83,000/년',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '평균 $32,000+ (전체 학생)',
    avgAidKR: '~$10,000~20,000 추정 (Need-Aware — 국제학생 재정지원 불확실)',
    preMedRating: '중',
    preMedNote: '공학·비즈니스 특화 대학. 자체 의대 없음. Pre-Med 환경 보통. Philadelphia 근교(1시간). 생체공학·화학공학 분야 강함. Pre-Med 목표라면 의료기관 접근성이 약한 편.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED', 'RD'],
    mapX: 86,
    mapY: 38,
    color1: '#4B2000',
    color2: '#2A1200',
    emoji: '⚙️',
    kkumiNote: '합격률 ~39%로 2그룹 중 접근 가능. 공학·비즈니스 특화로 Pre-Med 방향과 다소 다름. Need-Aware 재정 주의. Philadelphia 근교이지만 직접 병원 접근 제한. 꾸미 Pre-Med 목표에 우선순위 낮음.',
    panamaNote: '📍 합격률 높아 안전 지원 고려 가능. Need-Aware → 재정 불확실. Philadelphia 근교. 공학 방향이면 Lehigh 비용 효율 좋음. Pre-Med 목표 꾸미에게는 우선순위 낮음.',
    chemNote: '⚙️ Lehigh 화학과는 생체공학·재료화학 연계 강점. 소규모(5,500명)라 교수 접근성 좋음. Pre-Med 화학 트랙 있음. 단 의대 연계 환경이 약해 임상 경험 쌓기에 제한. Philadelphia 병원 접근 공학계열보다 약함.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'Wake Forest': {
    fullName: 'Wake Forest University',
    location: 'Winston-Salem, NC',
    type: '사립 연구중심대학',
    founded: '1834년',
    size: '약 9,000명 (학부 ~5,500명)',
    acceptRate: '~20%',
    intlRate: '~4%',
    satPolicy: '선택 제출',
    satRange: '1370 ~ 1510',
    satRangeKR: '1430 ~ 1500 (비공식 추정)',
    tuition: '$67,830',
    coa: '~$86,000/년',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '평균 $43,000+ (전체 학생)',
    avgAidKR: '~$15,000~25,000 추정 (Need-Aware — 국제학생 재정지원 불확실)',
    preMedRating: '상',
    preMedNote: 'Atrium Wake Forest Baptist Medical Center (미국 최대 병원 시스템 중 하나) 인접. Wake Forest School of Medicine 바로 연계. 소규모(5,500명) 교수 접근성 우수. 의대 진학률 2그룹 중 최상위. Research Triangle 근접.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED', 'RD'],
    mapX: 77,
    mapY: 56,
    color1: '#4B3D00',
    color2: '#2A2200',
    emoji: '🌲',
    kkumiNote: '✅ Pre-Med 목표 꾸미에게 추천! Wake Forest 의대 바로 연계 + Atrium 병원 인접. 소규모(5,500명) 교수 1:1 접근. Need-Aware 재정 주의. 합격률 ~20%로 접근 가능한 편. 2그룹 중단 중 Pre-Med 환경 최강.',
    panamaNote: '📍 Need-Aware(국제학생). Winston-Salem = 북캐롤라이나 종합병원 도시. Wake Forest 의대 + Atrium 병원 연계로 Pre-Med 임상 환경 탁월. 파나마 출신 희소성 효과. Research Triangle 근접.',
    chemNote: '🌲 Wake Forest 화학과는 소규모+우수 교수진. Wake Forest 의대 연계 생화학·의화학 연구. Pre-Med 화학 트랙 탄탄. Atrium 병원 임상 연계 화학 연구 가능. 교수 1:1 접근성 탁월. 꾸미 Pre-Med 화학 목표에 매우 잘 맞음.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'Villanova': {
    fullName: 'Villanova University',
    location: 'Villanova, PA (Philadelphia Main Line 근교)',
    type: '사립 연구중심대학 (가톨릭 아우구스티노회)',
    founded: '1842년',
    size: '약 11,000명 (학부 ~7,000명)',
    acceptRate: '~28%',
    intlRate: '~3%',
    satPolicy: '선택 제출',
    satRange: '1350 ~ 1490',
    satRangeKR: '1400 ~ 1480 (비공식 추정)',
    tuition: '$67,630',
    coa: '~$85,000/년 (Philadelphia 근교)',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '평균 $37,000+ (전체 학생)',
    avgAidKR: '~$10,000~20,000 추정 (Need-Aware — 국제학생 재정지원 불확실)',
    preMedRating: '중상',
    preMedNote: '가톨릭 아우구스티노회 대학. 자체 의대는 없지만 의대 진학률 합리적. Philadelphia 인근 세계적 병원군(Penn Medicine, CHOP, Jefferson) 접근. 소규모(7,000명) 가톨릭 커뮤니티 문화.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 86,
    mapY: 40,
    color1: '#003366',
    color2: '#002244',
    emoji: '📿',
    kkumiNote: '가톨릭 대학 (Georgetown·BC와 유사). Philadelphia 근교 세계적 병원 접근. 합격률 ~28%로 접근 가능. Need-Aware 재정 주의. 파나마 가톨릭 배경과 문화적 연결. Pre-Med 환경 적당. 안전 지원 고려 가능.',
    panamaNote: '📍 가톨릭 아우구스티노회 — 파나마 가톨릭 배경과 자연스러운 연결. Philadelphia 근교 Penn Medicine·CHOP 접근. Need-Aware → 재정 불확실. 국제학생 비율 낮아 파나마 희소성 효과. EA 지원 가능.',
    chemNote: '📿 Villanova 화학과는 소규모 환경에서 교수 접근성 우수. Philadelphia 인근 Penn Medicine 연계 가능. 제약·생화학 분야 인턴십 접근. Pre-Med 화학 트랙 있음. 가톨릭 대학 환경의 학문적 엄격함과 공동체 문화.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  // ─────────────────────────────────────────
  //  2 Group 하단 (40~45위)
  // ─────────────────────────────────────────

  'UC Irvine': {
    fullName: 'University of California, Irvine',
    location: 'Irvine, CA (Orange County)',
    type: '공립 대학 (University of California System)',
    founded: '1965년',
    size: '약 36,000명 (학부 ~30,000명)',
    acceptRate: '~21%',
    intlRate: '~10%',
    satPolicy: '점수 미반영',
    satRange: 'N/A (UC System 전체 영구 Test-Free)',
    satRangeKR: 'N/A (SAT 점수를 입시에 사용하지 않음)',
    tuition: '~$46,000/년 (국제학생 — NRST 포함)',
    coa: '~$69,000~73,000/년 (국제학생 전체 비용)',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 사실상 $0 (UC 공립 시스템 정책)',
    avgAidKR: '사실상 $0 — 4년 총 비용 ~$275,000~290,000 ⚠️',
    preMedRating: '상',
    preMedNote: 'UCI School of Medicine 연계. Orange County 세계적 병원군 인접. Pre-Med 환경 우수. 아시아계 학생 비율 매우 높아 Pre-Med 내부 경쟁 치열. Test-Free.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['RD'],
    mapX: 12,
    mapY: 65,
    color1: '#003764',
    color2: '#002243',
    emoji: '🐜',
    kkumiNote: '⚠️ UC 공립 재정지원 $0. 4년 총비용 ~$275K~290K. UCI 의대 연계 Pre-Med 환경 우수. Test-Free. Orange County 기후 훌륭. 아시아계 학생 매우 많아 Pre-Med 내부 경쟁 특히 치열. 재정 재검토 필수.',
    panamaNote: '📍 UC 공립 → 재정지원 $0. Test-Free. Orange County = 아시아계·라틴계 커뮤니티 혼재. 파나마 출신 희소성 있음. UCI 의대 연계 Pre-Med 기회 탁월 — 단 비용 문제.',
    chemNote: '🐜 UCI 화학과 전국 상위권. Nobel 수상자 출신 다수 (F. Sherwood Rowland — 오존층 연구). 환경화학·물리화학 세계적 수준. Pre-Med 화학 트랙 있음. 단 대규모 공립이라 학부 단계 교수 접근성 노력 필요.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'U of Rochester': {
    fullName: 'University of Rochester',
    location: 'Rochester, NY',
    type: '사립 연구중심대학',
    founded: '1850년',
    size: '약 12,000명 (학부 ~6,500명)',
    acceptRate: '~29%',
    intlRate: '~12%',
    satPolicy: '선택 제출',
    satRange: '1400 ~ 1540',
    satRangeKR: '1460 ~ 1530 (비공식 추정)',
    tuition: '$65,384',
    coa: '~$83,000/년',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '평균 $40,000+ (전체 학생)',
    avgAidKR: '~$15,000~25,000 추정 (Need-Aware — 국제학생 재정지원 불확실)',
    preMedRating: '상',
    preMedNote: 'UR Medical Center 바로 연계. 소규모(6,500명) 교수 접근성 우수. Take 5 학년제 특별 프로그램(1년 추가 무료 수강). Pre-Med 환경 탁월. 의대 진학률 상위권.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED', 'RD'],
    mapX: 82,
    mapY: 27,
    color1: '#003B71',
    color2: '#002347',
    emoji: '🎶',
    kkumiNote: '소규모(6,500명) + UR Medical Center 직접 연계 → Pre-Med 환경 강함. Take 5 프로그램(1년 무료 추가 수강) 독특. Need-Aware 재정 주의. 합격률 ~29%로 접근 가능. 국제학생 비율 12% 주의.',
    panamaNote: '📍 Need-Aware(국제학생). Rochester 소도시 환경. UR 의대 연계 Pre-Med 임상 기회. 파나마 출신 희소성 있음. Eastman 음대로도 유명 — 음악 관심 있으면 추가 메리트.',
    chemNote: '🎶 Rochester 화학과는 소규모+우수 교수진. UR 의대 연계 의화학 연구. 레이저·광학화학 분야 강함 (Institute of Optics 연계). Pre-Med 화학 트랙 탄탄. 교수 1:1 접근성 좋음.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'U of Washington': {
    fullName: 'University of Washington',
    location: 'Seattle, WA',
    type: '공립 대학 (University of Washington System)',
    founded: '1861년',
    size: '약 53,000명 (학부 ~32,000명)',
    acceptRate: '~49% (전체; CS는 ~7% 수준)',
    intlRate: '~13% (높음)',
    satPolicy: '선택 제출',
    satRange: '1300 ~ 1530',
    satRangeKR: '1420 ~ 1510 (비공식 추정)',
    tuition: '~$41,997/년 (국제학생 비거주민)',
    coa: '~$65,000~70,000/년 (Seattle 생활비 높음)',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 매우 제한적 (공립 워싱턴주)',
    avgAidKR: '~$5,000~10,000 추정 (공립 — 국제학생 지원 제한적)',
    preMedRating: '상',
    preMedNote: 'UW School of Medicine 전국 Top 5 (1차 의료·가정의학 연구 세계 최강). UW Medical Center + Seattle Children\'s Hospital 바로 인접. 의대 진학 매우 경쟁적. 단 공립이라 워싱턴주 거주민 우대.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['RD'],
    mapX: 5,
    mapY: 9,
    color1: '#4B2E83',
    color2: '#311D57',
    emoji: '☔',
    kkumiNote: '공립 — 국제학생 재정지원 제한적. UW 의대 전국 Top 5 (1차 의료) + Seattle Children\'s 임상 환경. 국제학생 비율 13% 주의. Seattle = Amazon·Microsoft 테크 허브. 학비 상대적 저렴($42K)하지만 Seattle 생활비 높음.',
    panamaNote: '📍 공립 → 국제학생 재정지원 제한적. 국제학생 13%로 희소성 낮음. UW 의대 1차 의료 Top 5 — 파나마 공중보건 관심 연결 가능. Seattle 아시아·라틴계 커뮤니티. 파나마 출신 희소성 상대적 낮음 주의.',
    chemNote: '☔ UW 화학과 전국 Top 5 (특히 나노화학·바이오화학). Paul G. Allen School(CS)과 화학 융합 연구. UW 의대 연계 의화학 연구. Pre-Med 화학 트랙 있음. 단 대형 공립이라 학부 단계 교수 접근성 노력 필요.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'Grinnell': {
    fullName: 'Grinnell College',
    location: 'Grinnell, IA (Iowa 중서부 Prairie)',
    type: '사립 Liberal Arts College (초강력 Endowment)',
    founded: '1846년',
    size: '약 1,800명 (소규모 LAC)',
    acceptRate: '~13.5%',
    intlRate: '~13%',
    satPolicy: '선택 제출',
    satRange: '1420 ~ 1570',
    satRangeKR: '1470 ~ 1540 (비공식 추정)',
    tuition: '$60,876',
    coa: '~$79,000/년',
    needBlindDomestic: true,
    needBlindIntl: false,
    avgAid: '평균 $50,000+ (초강력 Endowment 기반 — 학생당 $1.4M)',
    avgAidKR: '~$25,000~45,000 추정 (국제학생 Need-Aware이지만 합격 후 매우 후한 재정지원)',
    preMedRating: '중상',
    preMedNote: 'Iowa 중서부 시골 위치로 의료기관 직접 접근 제한. 화학·생물학 기초 탄탄. 초강력 endowment로 연구 기회 풍부. 소규모(1,800명) 교수 1:1 접근 최고. 진보적 자율 교육 문화.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED', 'RD'],
    mapX: 56,
    mapY: 33,
    color1: '#C41230',
    color2: '#8A0020',
    emoji: '🌾',
    kkumiNote: 'Endowment 초강력(학생당 $1.4M — Williams·Amherst 수준). 재정지원 매우 후함. 소규모(1,800명) 자율 교육. Iowa 시골 위치 — 도시 생활 없음. Pre-Med 목표면 임상 접근 어렵지만 기초 화학·생물학 탁월. 꾸미 재정지원 필요 시 고려 가치 있음.',
    panamaNote: '📍 Endowment 기반 재정지원 후함 → 파나마 배경 국제학생에게 좋은 조건. Iowa 시골 = 조용한 학문 환경. Test-Optional. 파나마 출신 희소성 효과 있음. 에세이·스토리 중심 평가.',
    chemNote: '🌾 Grinnell 화학과는 소규모 LAC 최고 수준. 초강력 endowment로 화학 장비·연구비 매우 풍부. 교수 1:1 연구 지도 독보적. Pre-Med 화학 기초 탄탄. 단 Iowa 위치로 의료기관 실습 제한 — 화학 이론+실험에 집중해야 함.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'Brandeis': {
    fullName: 'Brandeis University',
    location: 'Waltham, MA (Boston 근교 20분)',
    type: '사립 연구중심대학 (유대 전통 — 모든 종교·배경 환영)',
    founded: '1948년',
    size: '약 6,000명 (학부 ~3,600명)',
    acceptRate: '~38%',
    intlRate: '~19% (매우 높음)',
    satPolicy: '선택 제출',
    satRange: '1410 ~ 1560',
    satRangeKR: '1460 ~ 1540 (비공식 추정)',
    tuition: '$65,304',
    coa: '~$87,000/년 (Boston 근교 생활비)',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '평균 $34,000+ (전체 학생)',
    avgAidKR: '~$10,000~20,000 추정 (Need-Aware — 국제학생 재정지원 불확실)',
    preMedRating: '중상',
    preMedNote: 'Boston 근교 세계적 병원 접근(Brigham & Women\'s, Mass General 등). 소규모(3,600명) 교수 접근성 우수. 진보·지식인·국제 감수성 학문 문화. Pre-Med 환경 양호.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED', 'RD'],
    mapX: 93,
    mapY: 31,
    color1: '#003478',
    color2: '#002255',
    emoji: '📖',
    kkumiNote: '⚠️ 국제학생 비율 ~19% — 파나마 희소성 낮음. Boston 근교 세계 최고 병원 접근. 소규모(3,600명) 교수 접근성 우수. Need-Aware 재정 주의. 합격률 ~38%로 접근 가능. 진보·국제 감수성 학문 문화.',
    panamaNote: '📍 국제학생 19%로 희소성 낮음. Boston 근교 세계적 의료 환경. 유대 전통이지만 모든 배경 학생 환영. 국제감수성 강한 학문 문화 — 파나마 다문화 배경과 맞음.',
    chemNote: '📖 Brandeis 화학과는 소규모+연구 중심. Boston 인근 제약·바이오 인턴십 접근. 생화학·분자화학 분야 강함. Pre-Med 화학 트랙 있음. 진보적 학문 문화에서의 실험적 화학 연구.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'Bucknell': {
    fullName: 'Bucknell University',
    location: 'Lewisburg, PA (Pennsylvania 중부 시골)',
    type: '사립 연구중심대학 (공학·문리 특화)',
    founded: '1846년',
    size: '약 4,800명 (소규모)',
    acceptRate: '~35%',
    intlRate: '~5%',
    satPolicy: '선택 제출',
    satRange: '1330 ~ 1490',
    satRangeKR: '1400 ~ 1480 (비공식 추정)',
    tuition: '$66,758',
    coa: '~$83,000/년',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '평균 $40,000+ (전체 학생)',
    avgAidKR: '~$15,000~25,000 추정 (Need-Aware)',
    preMedRating: '중',
    preMedNote: '소규모(4,800명) 공학·문리 대학. 자체 의대 없음. Lewisburg = 펜실베이니아 중부 소도시. Pre-Med 환경 보통. 화학공학·생체공학 분야 강함.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED', 'RD'],
    mapX: 83,
    mapY: 36,
    color1: '#E87722',
    color2: '#9E4E0D',
    emoji: '🦬',
    kkumiNote: '소규모 공학·문리 대학. 합격률 ~35%로 접근 가능. Need-Aware 재정 주의. Pre-Med 환경 보통. Lewisburg 시골 위치 — 도시 생활 없음. 꾸미 Pre-Med 목표에 우선순위 낮음.',
    panamaNote: '📍 Need-Aware. Lewisburg 소도시. 국제학생 비율 낮아 파나마 희소성 효과 있음. 공학 방향이면 Bucknell 비용 효율 양호. Pre-Med 꾸미에게는 우선순위 낮음.',
    chemNote: '🦬 Bucknell 화학과는 소규모 환경에서 교수 접근성 좋음. 화학공학·생체공학 연계 강점. Pre-Med 화학 기초 있음. 단 의대 연계 없어 임상 접근 제한. 펜실베이니아 중부 환경의 현장 화학 연구.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'U of Georgia': {
    fullName: 'University of Georgia',
    location: 'Athens, GA',
    type: '공립 대학 (University System of Georgia, 1785년 미국 최초)',
    founded: '1785년 (미국 최초의 공립 대학)',
    size: '약 42,000명 (학부 ~31,000명)',
    acceptRate: '~40%',
    intlRate: '~3%',
    satPolicy: '선택 제출',
    satRange: '1300 ~ 1460',
    satRangeKR: '1380 ~ 1440 (비공식 추정)',
    tuition: '~$30,860/년 (국제학생 비거주민)',
    coa: '~$51,000~54,000/년 (Athens 생활비 저렴)',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 매우 제한적 (공립 조지아주)',
    avgAidKR: '~$5,000~10,000 추정 (공립 — 국제학생 지원 제한적)',
    preMedRating: '중상',
    preMedNote: 'Augusta University Medical College of Georgia 연계. Emory 인근 Atlanta 의료 생태계 접근. Pre-Med 환경 양호. 합격률 ~40%로 접근 가능. 공립이라 조지아 거주민 우대.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 72,
    mapY: 64,
    color1: '#BA0C2F',
    color2: '#7D0820',
    emoji: '🐾',
    kkumiNote: '미국 최초의 공립대(1785). 합격률 ~40%로 접근 쉬움. 학비 저렴($31K). 재정지원 없음. Emory 근처 Atlanta 의료 생태계 간접 접근. 꾸미에게 안전 지원 고려 가능. CDC + Emory 근접.',
    panamaNote: '📍 공립 → 재정지원 제한적. 학비 저렴. Athens = Atlanta 동쪽 1시간. 조지아 라틴아메리카 커뮤니티. 파나마 출신 희소성 있음. 안전 지원으로 고려 가능.',
    chemNote: '🐾 UGA 화학과 전국 중상위권. 농업화학·환경화학 분야 특색. Pre-Med 화학 트랙 있음. Atlanta 의료·제약 인턴십 간접 접근 가능. 합격률 높아 접근 가능한 화학 연구 환경.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'U of Wisconsin': {
    fullName: 'University of Wisconsin-Madison',
    location: 'Madison, WI',
    type: '공립 대학 (University of Wisconsin System)',
    founded: '1848년',
    size: '약 49,000명 (학부 ~32,000명)',
    acceptRate: '~49%',
    intlRate: '~9%',
    satPolicy: '선택 제출',
    satRange: '1340 ~ 1530',
    satRangeKR: '1430 ~ 1510 (비공식 추정)',
    tuition: '~$40,532/년 (국제학생 비거주민)',
    coa: '~$60,000~65,000/년',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 매우 제한적 (공립 위스콘신주)',
    avgAidKR: '~$5,000~10,000 추정 (공립 — 국제학생 지원 제한적)',
    preMedRating: '중상',
    preMedNote: 'UW-Madison School of Medicine and Public Health 전국 상위. WARF(Wisconsin Alumni Research Foundation) 강력한 연구 재원. Pre-Med 환경 양호하지만 대형(32,000명) 내부 경쟁. 의대 진학률 상위권.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 61,
    mapY: 28,
    color1: '#C5050C',
    color2: '#8A0308',
    emoji: '❄️',
    kkumiNote: '전미 최고 공립 연구대학 중 하나. UW 의대 + WARF 연구 재원 강력. 합격률 ~49%로 접근 쉬움. 공립 재정지원 없음. Madison = 아름다운 호수 도시. 겨울 추위 매우 심함. Pre-Med 환경 양호.',
    panamaNote: '📍 공립 → 재정지원 제한적. Madison 호수 도시. Wisconsin 겨울 극한 추위 주의. UW 의대 연계 Pre-Med 기회. 파나마 출신 희소성 효과. 합격률 높아 안전 지원 가능.',
    chemNote: '❄️ UW-Madison 화학과 전국 Top 10 (특히 유기화학·방법론). WARF 연구 재원으로 학부 연구 기회 풍부. Pre-Med 화학 트랙 있음. UW 의대 연계 의화학 연구. 단 대형 학교라 교수 접근성 노력 필요.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'Florida State': {
    fullName: 'Florida State University',
    location: 'Tallahassee, FL',
    type: '공립 대학 (State University System of Florida)',
    founded: '1851년',
    size: '약 44,000명 (학부 ~33,000명)',
    acceptRate: '~25%',
    intlRate: '~3%',
    satPolicy: '선택 제출',
    satRange: '1280 ~ 1430',
    satRangeKR: '1360 ~ 1420 (비공식 추정)',
    tuition: '~$21,683/년 (국제학생 비거주민 — 2그룹 최저 수준)',
    coa: '~$44,000~48,000/년 (Tallahassee 생활비 저렴)',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 매우 제한적 (공립 플로리다주)',
    avgAidKR: '~$5,000 이하 (공립 — 국제학생 지원 극히 제한적)',
    preMedRating: '중',
    preMedNote: 'FSU College of Medicine 있음. Tallahassee 병원 접근 가능. Pre-Med 환경 보통. 학비 매우 저렴. FSU 연구력은 UF보다 낮음. 화학·생물학 기초 있음.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 70,
    mapY: 78,
    color1: '#782F40',
    color2: '#4D1E29',
    emoji: '🔥',
    kkumiNote: '최저 수준 학비($21K) — 비용 압도적 절감. 재정지원 없지만 COA 자체가 매우 낮음 (~$45K). Pre-Med 환경은 UF보다 약함. FSU 의대 있음. 꾸미 안전 지원 + 극히 낮은 비용 고려 시 유효.',
    panamaNote: '📍 공립 학비 최저. Tallahassee = 플로리다 주도(政都). 라틴아메리카 커뮤니티 있음. 재정지원 거의 없지만 총비용 자체가 낮음. Pre-Med 환경 보통. 안전 지원 + 경제적 선택.',
    chemNote: '🔥 FSU 화학과는 전국 상위권 (특히 고분자화학·재료화학). National High Magnetic Field Laboratory(세계 최강 자기장 연구소) 바로 인접 — 이 분야에서는 세계 유일. Pre-Med 화학 트랙 있음. 학비 대비 연구 환경 좋음.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'Case Western Reserve': {
    fullName: 'Case Western Reserve University',
    location: 'Cleveland, OH (University Circle)',
    type: '사립 연구중심대학 (의학·공학 특화)',
    founded: '1826년',
    size: '약 12,000명 (학부 ~5,600명)',
    acceptRate: '~27%',
    intlRate: '~11%',
    satPolicy: '선택 제출',
    satRange: '1470 ~ 1570',
    satRangeKR: '1500 ~ 1570 (비공식 추정 — STEM 특화)',
    tuition: '$66,090',
    coa: '~$83,000/년',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '평균 $42,000+ (전체 학생)',
    avgAidKR: '~$20,000~35,000 추정 (Need-Aware — 의학+공학 우수 학생 장학금 있음)',
    preMedRating: '최상',
    preMedNote: '🏥 Cleveland Clinic(세계 Top 3 병원) + University Hospitals Cleveland Medical Center 바로 인접! CWRU School of Medicine 전국 Top 25. 🎓 PPSP(Pre-Professional Scholars Program in Medicine) — 학부 입학 시 조건부 의대 합격 보장. ⚠️ 국제학생 지원 가능 여부 공식 확인 필수.',
    bsMd: true,
    bsMdProgram: 'PPSP (Pre-Professional Scholars Program in Medicine) — 조건부 의대 합격 보장 프로그램 (GPA·MCAT 조건 달성 시). ⚠️ 국제학생 지원 가능 여부 공식 홈페이지 확인 필수',
    applyTypes: ['ED', 'RD'],
    mapX: 75,
    mapY: 34,
    color1: '#003A5D',
    color2: '#002135',
    emoji: '🏥',
    kkumiNote: '✅ Pre-Med 목표 꾸미에게 강력 추천! Cleveland Clinic(세계 Top 3) 바로 접근. PPSP BS/MD 보장 프로그램 (국제학생 지원 여부 확인 필수). 합격률 ~27%로 접근 가능. Need-Aware 재정 주의. Pre-Med 환경 2그룹 하단 최강.',
    panamaNote: '📍 Need-Aware(국제학생). Cleveland Clinic 세계 Top 3 병원 바로 인접. PPSP BS/MD 프로그램 국제학생 적합성 확인 필수. 파나마 출신 희소성 있음. Pre-Med 화학 환경 탁월.',
    chemNote: '🏥 CWRU 화학과는 Cleveland Clinic 연계 의화학·생화학 연구 세계 최강. Nobel 수상자 출신 다수. Pre-Med 화학 트랙 탁월. 의공학·생체재료 분야도 세계적. 하단 중 Pre-Med 화학 환경 최강.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '이과 최상위 성적 필수. Cleveland Clinic 연계 Pre-Med는 엄격한 학업 기준' },
      { label: 'Pre-Med 헌신', weight: '핵심', note: '병원 봉사·쉐도잉·연구 경험 필수. Cleveland Clinic 관심 어필 매우 도움' },
      { label: '에세이', weight: '높음', note: 'PPSP 지원 시 의학 소명과 Cleveland Clinic 연계 비전 서술이 핵심' },
      { label: '추천서', weight: '높음', note: '과학 교사+카운슬러. 연구 잠재력과 의료 부문 헌신 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '선택 제출이지만 PPSP 지원 시 1540+ 권장' },
      { label: 'PPSP 인터뷰', weight: '핵심', note: 'PPSP 지원 시 인터뷰 필수. 의학적 소명·윤리적 사고·성숙도 평가' },
    ],
  },

  'NC State': {
    fullName: 'North Carolina State University',
    location: 'Raleigh, NC',
    type: '공립 대학 (University of North Carolina System)',
    founded: '1887년',
    size: '약 35,000명 (학부 ~25,000명)',
    acceptRate: '~42%',
    intlRate: '~3%',
    satPolicy: '선택 제출',
    satRange: '1260 ~ 1460',
    satRangeKR: '1370 ~ 1440 (비공식 추정)',
    tuition: '~$29,220/년 (국제학생 비거주민)',
    coa: '~$52,000~56,000/년',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 매우 제한적 (공립 노스캐롤라이나주)',
    avgAidKR: '~$5,000~10,000 추정 (공립)',
    preMedRating: '중',
    preMedNote: '공학·농업·STEM 특화. Pre-Med 전용 환경 약함. Research Triangle(Raleigh-Durham-Chapel Hill) 의료·제약 연구 허브 인근. College of Sciences로 Pre-Med 가능하지만 의대 연계는 UNC Chapel Hill보다 약함.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 80,
    mapY: 57,
    color1: '#990000',
    color2: '#660000',
    emoji: '🐺',
    kkumiNote: '공학·STEM 특화 (공립). Pre-Med 방향 약함. 학비 저렴($29K). 재정지원 없음. Research Triangle 인근 의료·제약 허브. 합격률 ~42%로 안전 지원. 꾸미 Pre-Med 목표에는 우선순위 낮음.',
    panamaNote: '📍 공립 → 재정지원 제한적. Research Triangle = 세계 의료·제약 허브 인근. Raleigh 성장하는 도시. 파나마 희소성 있음. 공학 방향이면 NC State 비용 효율 좋음. Pre-Med 목표에는 약함.',
    chemNote: '🐺 NC State 화학과는 재료화학·분석화학 강점. Research Triangle 제약 인턴십 접근 가능. Pre-Med 화학 기초 있음. 단 UNC Chapel Hill 화학과보다 Pre-Med 연계 약함. 학비 대비 연구 환경 양호.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'William & Mary': {
    fullName: 'College of William & Mary',
    location: 'Williamsburg, VA',
    type: '공립 대학 (미국에서 두 번째로 오래된 대학, 1693년)',
    founded: '1693년 (미국에서 두 번째로 오래된 대학)',
    size: '약 9,500명 (학부 ~6,200명)',
    acceptRate: '~33%',
    intlRate: '~4%',
    satPolicy: '선택 제출',
    satRange: '1330 ~ 1500',
    satRangeKR: '1430 ~ 1490 (비공식 추정)',
    tuition: '~$42,726/년 (국제학생 비거주민)',
    coa: '~$60,000~65,000/년',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 매우 제한적 (공립 버지니아주)',
    avgAidKR: '~$5,000~15,000 추정 (공립 — 버지니아주 학생 우대)',
    preMedRating: '중상',
    preMedNote: '자체 의대 없음. 법학·국제관계 명성 강함. Pre-Med 환경 양호. Eastern Virginia Medical School 간접 접근. Williamsburg 역사 도시 — 조용하고 아름다운 환경.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 83,
    mapY: 51,
    color1: '#115740',
    color2: '#0A3828',
    emoji: '🏰',
    kkumiNote: '미국에서 두 번째로 오래된 역사 명문(1693). 공립이지만 소규모(6,200명) 사립급 학문 환경. 버지니아주 공립이라 재정지원 제한. 법학·국제관계 강함. Pre-Med 환경 양호. Williamsburg = 역사 관광 도시.',
    panamaNote: '📍 공립 → 재정지원 제한적. Williamsburg 역사 도시 — 조용하고 아름다움. 법학·국제관계 전통 — 파나마 국제적 배경과 연결 가능. 파나마 희소성 있음. Pre-Med 목표에 중간 우선순위.',
    chemNote: '🏰 W&M 화학과는 소규모 공립의 강점. 교수 접근성 사립급. Pre-Med 화학 트랙 있음. 역사적 캠퍼스 환경에서의 기초 화학 탄탄. Eastern Virginia Medical School 배경으로 의화학 연구 간접 접근.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'UCSB': {
    fullName: 'University of California, Santa Barbara',
    location: 'Santa Barbara, CA (Goleta 해안)',
    type: '공립 대학 (University of California System)',
    founded: '1909년',
    size: '약 26,000명 (학부 ~22,000명)',
    acceptRate: '~26%',
    intlRate: '~8%',
    satPolicy: '점수 미반영',
    satRange: 'N/A (UC System 전체 영구 Test-Free)',
    satRangeKR: 'N/A (SAT 점수를 입시에 사용하지 않음)',
    tuition: '~$46,000/년 (국제학생 — NRST 포함)',
    coa: '~$70,000~74,000/년 (Santa Barbara 생활비)',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 사실상 $0 (UC 공립 시스템 정책)',
    avgAidKR: '사실상 $0 — 4년 총 비용 ~$280,000~295,000 ⚠️',
    preMedRating: '중상',
    preMedNote: '기초과학 연구 강함(Nobel 수상자 6명 재직). Pre-Med 환경 중간 수준. 의대 직접 연계 약함. 환경·해양과학 세계적. Test-Free. Santa Barbara 경관 최고.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['RD'],
    mapX: 9,
    mapY: 62,
    color1: '#003660',
    color2: '#002040',
    emoji: '🏖️',
    kkumiNote: '⚠️ UC 공립 재정지원 $0. 4년 총비용 ~$280K~295K. Nobel 수상자 6명 재직 기초과학 최강. Test-Free. Santa Barbara 해안 — 최고의 캠퍼스 환경. Pre-Med 직접 연계는 약함. 재정 재검토 필수.',
    panamaNote: '📍 UC 공립 → 재정지원 $0. Test-Free. Santa Barbara 아름다운 해안 — 파나마 해안 출신에게 친숙한 자연환경. 환경·해양과학 관심 시 세계 최강. 단 재정 문제. 파나마 희소성 있음.',
    chemNote: '🏖️ UCSB 화학과 전국 Top 10 (특히 재료화학·나노화학 — Nobel 수상자 多). Kavli Institute for Theoretical Physics 연계. Pre-Med 화학 트랙 있음. 단 의대 직접 연계보다 순수 기초과학 화학 환경. 세계 최고 해안 환경에서의 환경화학 독특.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  // ─────────────────────────────────────────
  //  3 Group 상 (46위+)
  // ─────────────────────────────────────────

  'Purdue': {
    fullName: 'Purdue University',
    location: 'West Lafayette, IN',
    type: '공립 대학 (Purdue University System)',
    founded: '1869년',
    size: '약 50,000명 (학부 ~34,000명)',
    acceptRate: '~53%',
    intlRate: '~18% (매우 높음)',
    satPolicy: '선택 제출',
    satRange: '1300 ~ 1530 (전공별 격차 큼)',
    satRangeKR: '1420 ~ 1510 (비공식 — 공학 기준)',
    tuition: '~$28,794/년 (국제학생 비거주민)',
    coa: '~$50,000~55,000/년',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 매우 제한적 (공립 인디애나주)',
    avgAidKR: '~$5,000~10,000 추정 (공립 — 국제학생 지원 제한적)',
    preMedRating: '중',
    preMedNote: '공학·농업·STEM 특화. CS·항공·기계공학 세계 최강(Neil Armstrong 출신). Pre-Med 전용 환경 약함. 국제학생 비율 ~18%로 매우 높아 파나마 희소성 낮음.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 65,
    mapY: 38,
    color1: '#CEB888',
    color2: '#8B7A4A',
    emoji: '🚀',
    kkumiNote: '공학·STEM 세계 최강(Neil Armstrong·우주비행사 다수 출신). 국제학생 비율 18%로 희소성 낮음. Pre-Med 환경 약함. 학비 저렴($29K). 공립 재정지원 없음. 꾸미 Pre-Med 목표에는 우선순위 낮음.',
    panamaNote: '📍 공립 → 재정지원 제한적. 국제학생 18%로 파나마 희소성 낮음. West Lafayette = 공학 대학 도시. 공학 방향이면 Purdue 비용 효율 탁월. Pre-Med 목표에는 부적합.',
    chemNote: '🚀 Purdue 화학과 전국 상위권. 특히 분석화학·화학공학 연계 강함. 항공우주·재료 분야 연구 연계 독특. Pre-Med 화학 트랙 있음. 단 Pre-Med보다 공학화학 방향에 특화.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'George Washington': {
    fullName: 'George Washington University',
    location: 'Washington D.C. (Foggy Bottom)',
    type: '사립 연구중심대학',
    founded: '1821년',
    size: '약 27,000명 (학부 ~12,000명)',
    acceptRate: '~41%',
    intlRate: '~9%',
    satPolicy: '선택 제출',
    satRange: '1340 ~ 1500',
    satRangeKR: '1400 ~ 1480 (비공식 추정)',
    tuition: '$64,545',
    coa: '~$87,000/년 (DC 생활비 포함)',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '평균 $38,000+ (전체 학생)',
    avgAidKR: '~$10,000~20,000 추정 (Need-Aware)',
    preMedRating: '중상',
    preMedNote: 'DC 위치 — 정치·외교·보건 정책 환경 독보적. GW School of Medicine & Health Sciences 연계. MedStar Hospital 접근. Pre-Med 환경 양호. 합격률 ~41%로 접근 가능.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 83,
    mapY: 45,
    color1: '#033C5A',
    color2: '#021E2F',
    emoji: '🏛️',
    kkumiNote: 'DC 위치(Georgetown과 유사 입지). 합격률 41%로 접근 가능. GW 의대 연계 Pre-Med 환경 양호. Need-Aware 재정 주의. COA ~$87K(DC 생활비). 정치·보건 정책 관심이라면 DC 환경 탁월.',
    panamaNote: '📍 DC 위치 — 파나마 외교·보건 정책 연결. Georgetown보다 접근 쉬운 DC 사립. Need-Aware → 재정 불확실. 파나마 출신 희소성 있음. FMI·세계보건기구 DC 사무소 접근.',
    chemNote: '🏛️ GWU 화학과는 DC 위치 활용 NIH·FDA 인턴십 접근 탁월. Pre-Med 화학 트랙 있음. 정부·정책 연계 화학 연구 독특. 합격률 높아 접근 가능한 화학 환경.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'Texas A&M': {
    fullName: 'Texas A&M University',
    location: 'College Station, TX',
    type: '공립 대학 (Texas A&M University System)',
    founded: '1876년 (텍사스 최초의 공립 대학)',
    size: '약 74,000명 (학부 ~57,000명 — 전미 최대급)',
    acceptRate: '~63%',
    intlRate: '~3%',
    satPolicy: '선택 제출',
    satRange: '1230 ~ 1450',
    satRangeKR: '1360 ~ 1430 (비공식 추정)',
    tuition: '~$37,270/년 (국제학생 비거주민)',
    coa: '~$56,000~60,000/년',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 매우 제한적 (공립 텍사스주)',
    avgAidKR: '~$5,000 이하 (공립 — 국제학생 지원 극히 제한적)',
    preMedRating: '중',
    preMedNote: 'Texas A&M College of Medicine 있음. College Station = 소도시. 초대형 학교(57,000명). Pre-Med 환경 보통. Texas Medical Center(Houston) 2시간 거리.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 49,
    mapY: 78,
    color1: '#500000',
    color2: '#300000',
    emoji: '🐴',
    kkumiNote: '전미 최대급 공립(57,000명). 합격률 ~63%로 안전 지원. 학비 저렴($37K). 공립 재정지원 없음. Pre-Med 환경 보통. College Station = 작은 대학 도시. 꾸미 안전 지원 최후방 고려.',
    panamaNote: '📍 공립 → 재정지원 제한적. College Station 소도시. 텍사스 히스패닉 커뮤니티. 파나마 희소성 있음. 합격률 높아 안전 지원가능. Texas Medical Center(Houston) 접근 2시간.',
    chemNote: '🐴 Texas A&M 화학과는 전국 상위권. 석유화학·재료화학 분야 세계적 (텍사스 석유 산업 연계). Pre-Med 화학 트랙 있음. 초대형 학교라 학부 연구는 경쟁적이지만 기회 풍부.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'UMD College Park': {
    fullName: 'University of Maryland, College Park',
    location: 'College Park, MD (DC 근교 30분)',
    type: '공립 대학 (University System of Maryland)',
    founded: '1856년',
    size: '약 41,000명 (학부 ~30,000명)',
    acceptRate: '~44%',
    intlRate: '~7%',
    satPolicy: '선택 제출',
    satRange: '1350 ~ 1530',
    satRangeKR: '1440 ~ 1510 (비공식 추정)',
    tuition: '~$39,747/년 (국제학생 비거주민)',
    coa: '~$62,000~66,000/년',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 매우 제한적 (공립 메릴랜드주)',
    avgAidKR: '~$5,000~10,000 추정 (공립)',
    preMedRating: '중상',
    preMedNote: 'DC·NIH(National Institutes of Health) 30분 거리 — 세계 최대 생의학 연구기관 인접. Pre-Med 환경 양호. 대형 학교(30,000명) 내부 경쟁.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 83,
    mapY: 46,
    color1: '#E03A3E',
    color2: '#9E1A1E',
    emoji: '🐢',
    kkumiNote: 'DC 근교(30분) + NIH 인접 — Pre-Med 연구 환경 독보적. 공립 재정지원 없음. 합격률 ~44%. 학비 $40K. CS·공학·비즈니스도 강함. NIH 인턴십이 Pre-Med 목표에 핵심 자산.',
    panamaNote: '📍 DC·NIH 30분 — 파나마 출신 공중보건·연구 관심에 최적. 공립 재정지원 제한. 메릴랜드 라틴아메리카 커뮤니티. 파나마 희소성 있음. NIH 실습 기회 독보적.',
    chemNote: '🐢 UMD 화학과 전국 상위권. NIH·NIST(국립표준기술연구소) 인근 협업 기회 독보적. 생화학·분석화학·계산화학 강함. Pre-Med 화학 트랙 있음. DC 근교라 정부 연구기관 연계 화학 경험 쌓기 최적.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'Ohio State': {
    fullName: 'Ohio State University',
    location: 'Columbus, OH',
    type: '공립 대학 (Ohio State University System)',
    founded: '1870년',
    size: '약 66,000명 (학부 ~46,000명 — 전미 최대급)',
    acceptRate: '~53%',
    intlRate: '~7%',
    satPolicy: '선택 제출',
    satRange: '1300 ~ 1500',
    satRangeKR: '1400 ~ 1470 (비공식 추정)',
    tuition: '~$36,722/년 (국제학생 비거주민)',
    coa: '~$58,000~62,000/년',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 매우 제한적 (공립 오하이오주)',
    avgAidKR: '~$5,000~10,000 추정 (공립)',
    preMedRating: '중상',
    preMedNote: 'Ohio State Wexner Medical Center 연계 — 전국 Top 15 병원. Pre-Med 환경 양호. 초대형(46,000명) 내부 경쟁 치열. Columbus = 중부 대도시.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 73,
    mapY: 38,
    color1: '#BA0C2F',
    color2: '#7A0820',
    emoji: '🌰',
    kkumiNote: '전미 최대급 공립. Wexner 의대 병원 Top 15. 합격률 ~53%로 쉬운 안전 지원. 공립 재정지원 없음. 학비 $37K. 초대형이라 교수 접근성 낮음. Columbus 중부 대도시.',
    panamaNote: '📍 공립 → 재정지원 제한적. Columbus = 오하이오 중부. Wexner 의대 병원 Pre-Med 기회. 합격률 높아 안전 지원. 파나마 희소성 있음.',
    chemNote: '🌰 OSU 화학과 전국 상위권. 고분자화학·재료화학 강함. Wexner 의대 연계 의화학 연구. Pre-Med 화학 트랙 있음. 대형 학교라 연구 기회 많지만 교수 접근성은 경쟁적.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'Santa Clara': {
    fullName: 'Santa Clara University',
    location: 'Santa Clara, CA (Silicon Valley 중심)',
    type: '사립 연구중심대학 (가톨릭 예수회)',
    founded: '1851년',
    size: '약 9,000명 (학부 ~5,500명)',
    acceptRate: '~51%',
    intlRate: '~6%',
    satPolicy: '선택 제출',
    satRange: '1340 ~ 1510',
    satRangeKR: '1400 ~ 1480 (비공식 추정)',
    tuition: '$65,382',
    coa: '~$88,000/년 (Silicon Valley 생활비 매우 높음)',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '평균 $36,000+ (전체 학생)',
    avgAidKR: '~$10,000~20,000 추정 (Need-Aware)',
    preMedRating: '중상',
    preMedNote: 'Silicon Valley 중심부 — 의료 테크·바이오텍 접근 독보적. 가톨릭 예수회 소규모(5,500명). Pre-Med 환경 양호하지만 자체 의대 없음. Stanford 인근 저명 연구기관 간접 접근.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 6,
    mapY: 54,
    color1: '#862633',
    color2: '#5A1820',
    emoji: '💡',
    kkumiNote: 'Silicon Valley 중심부 — 의료테크·바이오텍 스타트업 접근 독보적. 가톨릭 예수회(파나마 가톨릭 연결). 합격률 ~51%로 접근 쉬움. COA ~$88K(SV 생활비 매우 높음). Stanford 인근.',
    panamaNote: '📍 가톨릭 예수회 — 파나마 가톨릭 배경 연결. Silicon Valley = 의료테크·AI 허브. Need-Aware → 재정 불확실. SV 생활비 매우 높음 주의. 파나마 희소성 있음.',
    chemNote: '💡 Santa Clara 화학과는 소규모+Silicon Valley 연계. 바이오테크·의료테크 화학 인턴십 접근 독보적. Stanford·Google·Apple 인근. Pre-Med 화학 트랙 있음. SV 스타트업 연계 화학 실습 가능.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  // ─────────────────────────────────────────
  //  3 Group 하단 1
  // ─────────────────────────────────────────

  'Baylor': {
    fullName: 'Baylor University',
    location: 'Waco, TX',
    type: '사립 연구중심대학 (Baptist 기독교 전통)',
    founded: '1845년 (텍사스 최초의 4년제 대학)',
    size: '약 20,000명 (학부 ~15,000명)',
    acceptRate: '~45%',
    intlRate: '~4%',
    satPolicy: '선택 제출',
    satRange: '1280 ~ 1450',
    satRangeKR: '1380 ~ 1440 (비공식 추정)',
    tuition: '$62,546',
    coa: '~$80,000/년',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '평균 $35,000+ (전체 학생)',
    avgAidKR: '~$10,000~20,000 추정 (Need-Aware)',
    preMedRating: '중상',
    preMedNote: 'Baylor Scott & White Health(텍사스 최대 병원 시스템) 연계. 자체 의대 연계 Pre-Med 환경 양호. Baptist 기독교 문화. Texas Medical Center(Houston) 접근 가능.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 51,
    mapY: 75,
    color1: '#154734',
    color2: '#0C2B1F',
    emoji: '🐻',
    kkumiNote: 'Baptist 기독교 대학. Baylor Scott & White 병원 연계 Pre-Med. 합격률 ~45%. Need-Aware 재정 주의. Waco = 텍사스 중부 소도시. 종교적 분위기 강함. 꾸미 Pre-Med 목표에 중간 우선순위.',
    panamaNote: '📍 Baptist 기독교 — 종교적 문화 배경 확인 필요. Waco 소도시. Texas 히스패닉 커뮤니티. Need-Aware → 재정 불확실. Baylor 병원 Pre-Med 임상 기회.',
    chemNote: '🐻 Baylor 화학과는 소규모 환경 교수 접근성 우수. Baylor 병원 연계 의화학 연구. Pre-Med 화학 트랙 있음. Baptist 기독교 문화 속 학문 환경.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'UC Davis': {
    fullName: 'University of California, Davis',
    location: 'Davis, CA (Sacramento 인근)',
    type: '공립 대학 (University of California System)',
    founded: '1905년',
    size: '약 40,000명 (학부 ~31,000명)',
    acceptRate: '~39%',
    intlRate: '~10%',
    satPolicy: '점수 미반영',
    satRange: 'N/A (UC System 전체 영구 Test-Free)',
    satRangeKR: 'N/A (SAT 점수를 입시에 사용하지 않음)',
    tuition: '~$46,000/년 (국제학생 — NRST 포함)',
    coa: '~$67,000~71,000/년',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 사실상 $0 (UC 공립 시스템 정책)',
    avgAidKR: '사실상 $0 — 4년 총 비용 ~$268,000~284,000 ⚠️',
    preMedRating: '중상',
    preMedNote: 'UC Davis Health System (의대) 연계. 농업·수의학 세계 최강. Pre-Med 환경 양호. Davis = Sacramento 인근 소도시.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['RD'],
    mapX: 8,
    mapY: 55,
    color1: '#002855',
    color2: '#001533',
    emoji: '🐄',
    kkumiNote: '⚠️ UC 공립 재정지원 $0. Test-Free. UC Davis 의대 연계. 농업·수의학 세계 최강. Davis = 조용한 대학 도시. 재정 재검토 필수.',
    panamaNote: '📍 UC 공립 → $0. Test-Free. Davis 조용한 환경. Sacramento 인근. UC Davis 의대 Pre-Med 기회. 농업·식품과학 관심 있다면 세계 최강.',
    chemNote: '🐄 UC Davis 화학과 전국 상위권. 농업화학·식품화학·환경화학 분야 세계적. Pre-Med 화학 트랙 있음. UC 계열 높은 연구 수준. Test-Free.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'SMU': {
    fullName: 'Southern Methodist University',
    location: 'Dallas, TX (University Park)',
    type: '사립 연구중심대학 (Methodist 기독교)',
    founded: '1911년',
    size: '약 12,000명 (학부 ~7,000명)',
    acceptRate: '~49%',
    intlRate: '~9%',
    satPolicy: '선택 제출',
    satRange: '1310 ~ 1490',
    satRangeKR: '1390 ~ 1460 (비공식 추정)',
    tuition: '$67,994',
    coa: '~$88,000/년 (Dallas 생활비)',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '평균 $35,000+ (전체 학생)',
    avgAidKR: '~$10,000~20,000 추정 (Need-Aware)',
    preMedRating: '중',
    preMedNote: 'Dallas 대도시 병원군 인접. 자체 의대 없음. Pre-Med 환경 보통. 비즈니스·법학·예술 강함. Texas 석유·금융 엘리트 네트워크.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 50,
    mapY: 74,
    color1: '#CC0035',
    color2: '#8A0023',
    emoji: '🤠',
    kkumiNote: '학비 비쌈($68K). Neo-Gothic 아름다운 캠퍼스. Dallas 대도시 병원 접근. Pre-Med 환경 보통. 비즈니스·법학 강함. 꾸미 Pre-Med 목표에 우선순위 낮음.',
    panamaNote: '📍 Dallas = 텍사스 히스패닉 커뮤니티 중심. Need-Aware → 재정 불확실. 비즈니스·법학 관심이면 SMU 네트워크 좋음. Pre-Med 목표에는 약함.',
    chemNote: '🤠 SMU 화학과는 중간 수준. Dallas 제약·의료 산업 인턴십 접근. Pre-Med 화학 트랙 있음. 단 연구 수준은 3그룹 상위 학교보다 낮음.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'Rose-Hulman': {
    fullName: 'Rose-Hulman Institute of Technology',
    location: 'Terre Haute, IN',
    type: '사립 공학 특화 대학 (전미 최고 학부 공학)',
    founded: '1874년',
    size: '약 2,200명 (초소규모 — 순수 공학)',
    acceptRate: '~59%',
    intlRate: '~4%',
    satPolicy: '선택 제출',
    satRange: '1320 ~ 1510',
    satRangeKR: '1420 ~ 1500 (수학 800 기대치)',
    tuition: '$62,070',
    coa: '~$80,000/년',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '평균 $35,000+ (전체 학생)',
    avgAidKR: '~$15,000~25,000 추정 (Need-Aware)',
    preMedRating: '낮음',
    preMedNote: '전국 학부 공학교육 US News #1 (2000년대부터 연속). 순수 공학 대학. Pre-Med 트랙 없음. 의대 진학 목표와 방향 완전히 다름.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 65,
    mapY: 42,
    color1: '#800000',
    color2: '#500000',
    emoji: '⚗️',
    kkumiNote: '❌ Pre-Med 목표와 방향 완전히 다름. 학부 공학교육 전국 #1. 화학공학 방향이면 Rose-Hulman은 세계 최고. Pre-Med 목표 꾸미에게는 부적합.',
    panamaNote: '📍 공학 최강. Pre-Med 방향 아님. Terre Haute = 인디애나 소도시. 파나마 희소성 있음. 공학 방향 전환 시 Rose-Hulman 탁월.',
    chemNote: '⚗️ Rose-Hulman 화학공학과 전국 #1 수준. 단 Pre-Med 화학 트랙 없음. 화학공학·재료공학 방향. 꾸미 Pre-Med+화학 목표와 방향 다름.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'Penn State': {
    fullName: 'Pennsylvania State University',
    location: 'University Park, PA (Pennsylvania 중부)',
    type: '공립 대학 (Pennsylvania State University System)',
    founded: '1855년',
    size: '약 88,000명 (학부 ~60,000명 — 전미 최대급)',
    acceptRate: '~54%',
    intlRate: '~9%',
    satPolicy: '선택 제출',
    satRange: '1250 ~ 1460',
    satRangeKR: '1380 ~ 1440 (비공식 추정)',
    tuition: '~$42,798/년 (국제학생 비거주민)',
    coa: '~$62,000~66,000/년',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 매우 제한적 (공립 펜실베이니아주)',
    avgAidKR: '~$5,000~10,000 추정 (공립)',
    preMedRating: '중',
    preMedNote: 'Hershey Medical Center(Penn State 의대) 연계. University Park = 펜실베이니아 중부 소도시. 초대형(60,000명). Pre-Med 환경 보통.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 84,
    mapY: 39,
    color1: '#1E407C',
    color2: '#102245',
    emoji: '🦁',
    kkumiNote: '전미 최대급 공립(60,000명). 합격률 ~54%. Hershey 의대 연계. 공립 재정지원 없음. University Park = 소도시. 꾸미 안전 지원 최후방 고려. Pre-Med 환경 보통.',
    panamaNote: '📍 공립 → 재정지원 제한적. 초대형 학교. Hershey 의대 연계 Pre-Med. 파나마 희소성 있음. 합격률 높아 안전 지원 가능.',
    chemNote: '🦁 Penn State 화학과는 전국 상위권. 재료화학·고분자화학 강함. Hershey 의대 연계 의화학. Pre-Med 화학 트랙 있음. 대형 학교라 연구 기회 많음.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'Rutgers NB': {
    fullName: 'Rutgers University–New Brunswick',
    location: 'New Brunswick, NJ (NYC 1시간)',
    type: '공립 대학 (Rutgers University System)',
    founded: '1766년 (미국 식민지 시대 대학)',
    size: '약 51,000명 (학부 ~36,000명)',
    acceptRate: '~61%',
    intlRate: '~9%',
    satPolicy: '선택 제출',
    satRange: '1300 ~ 1510',
    satRangeKR: '1410 ~ 1480 (비공식 추정)',
    tuition: '~$34,109/년 (국제학생 비거주민)',
    coa: '~$57,000~62,000/년',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 매우 제한적 (공립 뉴저지주)',
    avgAidKR: '~$5,000~10,000 추정 (공립)',
    preMedRating: '중상',
    preMedNote: 'Rutgers New Jersey Medical School 연계. NYC 1시간 거리 세계적 병원군 간접 접근. Pre-Med 환경 양호. 합격률 ~61%로 접근 쉬움.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 87,
    mapY: 39,
    color1: '#CC0033',
    color2: '#8A0020',
    emoji: '🌿',
    kkumiNote: 'NYC 1시간 거리. Rutgers 의대 연계 Pre-Med 환경. 합격률 ~61% 안전 지원. 학비 저렴($34K). 공립 재정지원 없음. NYC 병원 간접 접근. 꾸미 안전 지원 고려.',
    panamaNote: '📍 NYC 1시간. Rutgers 의대 연계. 공립 재정지원 제한. 뉴저지 히스패닉 커뮤니티. 파나마 희소성 있음. 안전 지원 가능.',
    chemNote: '🌿 Rutgers 화학과 전국 상위권. 유기화학·생화학 분야 강함. Rutgers 의대 연계 의화학 연구. NYC 인근 제약 인턴십(Pfizer NJ 본사 인근) 접근. Pre-Med 화학 트랙 있음.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'Stony Brook': {
    fullName: 'Stony Brook University (SUNY)',
    location: 'Stony Brook, NY (Long Island)',
    type: '공립 대학 (State University of New York System)',
    founded: '1957년',
    size: '약 27,000명 (학부 ~17,000명)',
    acceptRate: '~48%',
    intlRate: '~14% (높음)',
    satPolicy: '선택 제출',
    satRange: '1310 ~ 1520',
    satRangeKR: '1420 ~ 1490 (비공식 추정)',
    tuition: '~$28,048/년 (국제학생 비거주민 — 매우 저렴)',
    coa: '~$51,000~55,000/년',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 매우 제한적 (공립 뉴욕주)',
    avgAidKR: '~$5,000~10,000 추정 (공립)',
    preMedRating: '중상',
    preMedNote: 'Stony Brook Medicine 연계. NYC 1시간 Long Island. 공립 의대 연계 Pre-Med 환경 양호. 학비 매우 저렴($28K). 국제학생 비율 14% 높음.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 89,
    mapY: 37,
    color1: '#CC4E00',
    color2: '#8A3400',
    emoji: '🏝️',
    kkumiNote: '학비 매우 저렴($28K). Stony Brook 의대 연계. NYC 1시간. 국제학생 비율 14% 주의. 공립 재정지원 없음. 3그룹 중 비용 효율 최강군. 꾸미 안전+경제적 선택.',
    panamaNote: '📍 학비 최저급. NYC 1시간. Long Island 환경. 공립 재정지원 제한. 국제학생 14%로 희소성 낮음. Stony Brook 의대 Pre-Med 기회.',
    chemNote: '🏝️ Stony Brook 화학과 전국 상위권. 물리화학·나노화학 강함 (Brookhaven National Laboratory 인근). Pre-Med 화학 트랙 있음. 국립연구소 협업 기회 독특.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'Virginia Tech': {
    fullName: 'Virginia Tech',
    location: 'Blacksburg, VA (Virginia 남서부 산악지대)',
    type: '공립 대학 (Virginia Tech Carilion School)',
    founded: '1872년',
    size: '약 36,000명 (학부 ~26,000명)',
    acceptRate: '~65%',
    intlRate: '~6%',
    satPolicy: '선택 제출',
    satRange: '1280 ~ 1470',
    satRangeKR: '1380 ~ 1440 (비공식 추정)',
    tuition: '~$34,370/년 (국제학생 비거주민)',
    coa: '~$55,000~58,000/년',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 매우 제한적 (공립 버지니아주)',
    avgAidKR: '~$5,000~10,000 추정 (공립)',
    preMedRating: '중',
    preMedNote: '공학·농업·건축 특화. Pre-Med 환경 보통. Virginia Tech Carilion School of Medicine 연계. Blacksburg = 산악 소도시. 자연환경 탁월.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 79,
    mapY: 51,
    color1: '#630031',
    color2: '#3F0020',
    emoji: '🦃',
    kkumiNote: '공학·건축 특화. Pre-Med 환경 보통. 합격률 ~65% 안전 지원. 학비 저렴($34K). 공립 재정지원 없음. Blacksburg 산악 소도시 — 도시 생활 없음.',
    panamaNote: '📍 공립 → 재정지원 제한적. Blacksburg 산악 소도시. 자연환경 탁월. 공학 방향이면 VT 비용 효율 좋음. Pre-Med 목표에는 약함.',
    chemNote: '🦃 Virginia Tech 화학과는 중상위권. 재료화학·환경화학 강함. VTC 의대 연계 의화학 연구. Pre-Med 화학 트랙 있음. 산악 자연환경 연계 환경화학 연구 독특.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'Cal Poly SLO': {
    fullName: 'California Polytechnic State University, San Luis Obispo',
    location: 'San Luis Obispo, CA (Central Coast)',
    type: '공립 대학 (California State University System)',
    founded: '1901년',
    size: '약 22,000명 (학부 ~20,000명)',
    acceptRate: '~27% (Cal Poly는 합격률 낮음)',
    intlRate: '~3%',
    satPolicy: '선택 제출',
    satRange: '1310 ~ 1500',
    satRangeKR: '1400 ~ 1470 (비공식 추정)',
    tuition: '~$19,647/년 (국제학생 — CSU 시스템, 매우 저렴)',
    coa: '~$43,000~47,000/년',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 매우 제한적 (공립 캘리포니아주)',
    avgAidKR: '~$3,000~8,000 추정 (공립 CSU — UC보다 저렴)',
    preMedRating: '낮음',
    preMedNote: 'Learn By Doing 교육 철학. 공학·농업 특화. Pre-Med 트랙 약함. San Luis Obispo = 캘리포니아 중앙 해안 소도시. 의대 연계 없음.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['ED', 'RD'],
    mapX: 9,
    mapY: 60,
    color1: '#154734',
    color2: '#0B2D20',
    emoji: '🌾',
    kkumiNote: '학비 극히 저렴($20K). 공학·농업 특화. Pre-Med 환경 없음. SLO = 아름다운 해안 소도시. 꾸미 Pre-Med 목표와 방향 다름. 비용 극절감 고려 시에만 유효.',
    panamaNote: '📍 CSU 공립 최저 학비. Pre-Med 방향 아님. SLO 해안 소도시. 파나마 희소성 있음. 공학/농업 방향이면 비용 효율 최강.',
    chemNote: '🌾 Cal Poly SLO 화학과는 실습 중심 교육. 농업화학·환경화학 특화. Pre-Med 화학 트랙 약함. 학비 대비 실습 교육은 탁월.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'UMass Amherst': {
    fullName: 'University of Massachusetts Amherst',
    location: 'Amherst, MA (New England 시골)',
    type: '공립 대학 (University of Massachusetts System)',
    founded: '1863년',
    size: '약 33,000명 (학부 ~24,000명)',
    acceptRate: '~64%',
    intlRate: '~7%',
    satPolicy: '선택 제출',
    satRange: '1310 ~ 1510',
    satRangeKR: '1420 ~ 1490 (비공식 추정)',
    tuition: '~$36,950/년 (국제학생 비거주민)',
    coa: '~$58,000~62,000/년',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 매우 제한적 (공립 매사추세츠주)',
    avgAidKR: '~$5,000~10,000 추정 (공립)',
    preMedRating: '중',
    preMedNote: 'Five College Consortium(Amherst·Smith·Mt Holyoke·Hampshire·UMass) — 수업 공유. Pre-Med 환경 보통. Boston 2시간 거리. Amherst = 농촌 대학 도시.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 91,
    mapY: 31,
    color1: '#971B2F',
    color2: '#63111F',
    emoji: '🍁',
    kkumiNote: 'Five College Consortium으로 인근 5개 대학 수업 공유 독특. 합격률 ~64% 안전 지원. 공립 재정지원 없음. Amherst 농촌 환경. Pre-Med 환경 보통. New England 단풍 환경.',
    panamaNote: '📍 공립 → 재정지원 제한적. Five College Consortium 수업 다양성. Boston 2시간. Amherst 농촌 소도시. 파나마 희소성 있음. 안전 지원 고려.',
    chemNote: '🍁 UMass Amherst 화학과 전국 상위권 (특히 고분자화학 — James Rathman Nobel 라인). Five College Consortium 화학 강의 공유. Pre-Med 화학 트랙 있음. 농촌 뉴잉글랜드 환경의 환경화학.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  // ─────────────────────────────────────────
  //  3 Group 하단 2
  // ─────────────────────────────────────────

  'U of Minnesota': {
    fullName: 'University of Minnesota Twin Cities',
    location: 'Minneapolis, MN',
    type: '공립 대학 (University of Minnesota System)',
    founded: '1851년',
    size: '약 55,000명 (학부 ~34,000명)',
    acceptRate: '~57%',
    intlRate: '~8%',
    satPolicy: '선택 제출',
    satRange: '1310 ~ 1510',
    satRangeKR: '1410 ~ 1480 (비공식 추정)',
    tuition: '~$36,402/년 (국제학생 비거주민)',
    coa: '~$58,000~62,000/년',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 매우 제한적 (공립 미네소타주)',
    avgAidKR: '~$5,000~10,000 추정 (공립)',
    preMedRating: '중상',
    preMedNote: 'UMN Medical School 전국 상위권. Twin Cities = 대도시. M Health Fairview 병원 시스템 인접. Pre-Med 환경 양호. 대형(34,000명) 내부 경쟁.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 57,
    mapY: 24,
    color1: '#7A0019',
    color2: '#4F000F',
    emoji: '⛄',
    kkumiNote: 'UMN 의대 상위권. Twin Cities 대도시. 공립 재정지원 없음. 학비 $36K. Minnesota 겨울 극한 추위(-20°C) 주의. Pre-Med 환경 양호. 안전 지원 고려.',
    panamaNote: '📍 공립 → 재정지원 제한적. Twin Cities 대도시. M Health 병원 Pre-Med 기회. Minnesota 겨울 매우 추움 — 파나마 출신에게 극한 환경 적응 필요. 파나마 희소성 있음.',
    chemNote: '⛄ UMN 화학과 전국 상위권. 유기화학·재료화학·계산화학 강함. UMN 의대 연계 의화학 연구. Pre-Med 화학 트랙 있음. 학비 대비 화학 교육 효율 좋음.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'UC Santa Cruz': {
    fullName: 'University of California, Santa Cruz',
    location: 'Santa Cruz, CA (Silicon Valley 남쪽 해안)',
    type: '공립 대학 (University of California System)',
    founded: '1965년',
    size: '약 19,000명 (학부 ~16,000명)',
    acceptRate: '~47%',
    intlRate: '~5%',
    satPolicy: '점수 미반영',
    satRange: 'N/A (UC System 전체 영구 Test-Free)',
    satRangeKR: 'N/A (SAT 점수를 입시에 사용하지 않음)',
    tuition: '~$46,000/년 (국제학생 — NRST 포함)',
    coa: '~$66,000~70,000/년',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 사실상 $0 (UC 공립 시스템 정책)',
    avgAidKR: '사실상 $0 — 4년 총 비용 ~$264,000~280,000 ⚠️',
    preMedRating: '중',
    preMedNote: '기초과학·환경과학 강함. Pre-Med 전용 환경 약함. 의대 직접 연계 없음. Silicon Valley 남쪽 해안 아름다운 환경. Test-Free.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['RD'],
    mapX: 7,
    mapY: 57,
    color1: '#003C6C',
    color2: '#002244',
    emoji: '🌊',
    kkumiNote: '⚠️ UC 공립 재정지원 $0. Test-Free. 기초과학·환경과학 강함. Pre-Med 환경 약함. Santa Cruz 해안 아름다운 환경. 재정 재검토 필수. 꾸미 Pre-Med 목표에 우선순위 낮음.',
    panamaNote: '📍 UC 공립 → $0. Test-Free. Santa Cruz = Silicon Valley 남쪽 해안. 환경과학·생태학 세계적. Pre-Med 약함. 파나마 해안 출신 친숙한 자연환경.',
    chemNote: '🌊 UCSC 화학과는 환경화학·해양화학 분야 특화. Silicon Valley 인근 바이오텍 접근 가능. Pre-Med 화학 트랙 있음. 단 의대 연계 약함.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'UC Riverside': {
    fullName: 'University of California, Riverside',
    location: 'Riverside, CA (Inland Empire)',
    type: '공립 대학 (University of California System)',
    founded: '1954년',
    size: '약 26,000명 (학부 ~22,000명)',
    acceptRate: '~66%',
    intlRate: '~5%',
    satPolicy: '점수 미반영',
    satRange: 'N/A (UC System 전체 영구 Test-Free)',
    satRangeKR: 'N/A (SAT 점수를 입시에 사용하지 않음)',
    tuition: '~$46,000/년 (국제학생 — NRST 포함)',
    coa: '~$64,000~68,000/년',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 사실상 $0 (UC 공립 시스템 정책)',
    avgAidKR: '사실상 $0 — 4년 총 비용 ~$256,000~272,000 ⚠️',
    preMedRating: '중',
    preMedNote: '합격률 ~66%로 UC 계열 중 가장 접근 쉬움. UCR School of Medicine(2013년 개교) 연계. Pre-Med 환경 보통. Riverside = 대도시권 내륙 도시.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['RD'],
    mapX: 13,
    mapY: 67,
    color1: '#003DA5',
    color2: '#002570',
    emoji: '🍊',
    kkumiNote: '⚠️ UC 공립 재정지원 $0. UC계열 중 가장 접근 쉬움(66%). UCR 의대 연계. Test-Free. Riverside 내륙 도시 — 무더운 기후. 재정 재검토 필수. 꾸미 안전 지원 최후방.',
    panamaNote: '📍 UC 공립 → $0. Test-Free. UC 계열 입학 가장 쉬움. UCR 의대 연계. Riverside 내륙 더운 기후 — 파나마 출신에게 친숙한 열기. 파나마 희소성 있음.',
    chemNote: '🍊 UCR 화학과는 환경화학·농업화학 분야 강함 (Inland Empire 농업 지역 연계). UCR 의대 연계 의화학 연구. Pre-Med 화학 트랙 있음. UC 계열 중 접근 가장 쉬운 화학 연구 환경.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'Michigan State': {
    fullName: 'Michigan State University',
    location: 'East Lansing, MI',
    type: '공립 대학 (Michigan State University System)',
    founded: '1855년',
    size: '약 50,000명 (학부 ~39,000명)',
    acceptRate: '~88% (접근 매우 쉬움)',
    intlRate: '~8%',
    satPolicy: '선택 제출',
    satRange: '1230 ~ 1450',
    satRangeKR: '1360 ~ 1420 (비공식 추정)',
    tuition: '~$41,410/년 (국제학생 비거주민)',
    coa: '~$62,000~66,000/년',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 매우 제한적 (공립 미시간주)',
    avgAidKR: '~$5,000~10,000 추정 (공립)',
    preMedRating: '중',
    preMedNote: 'MSU College of Human Medicine 연계. 농업·수의학·식품과학 세계 최강. Pre-Med 환경 보통. 대형(39,000명). East Lansing 대학 도시.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 68,
    mapY: 31,
    color1: '#18453B',
    color2: '#0D2B24',
    emoji: '🌱',
    kkumiNote: '합격률 ~88%으로 거의 확실한 안전 지원. 공립 재정지원 없음. 농업·수의학 세계 최강. Pre-Med 환경 보통. MSU 의대 연계. 꾸미 최후방 안전 지원.',
    panamaNote: '📍 공립 → 재정지원 제한적. East Lansing. 합격률 88%로 안전. MSU 의대 연계. 농업·식품과학 파나마 농업 연결 가능. 파나마 희소성 있음.',
    chemNote: '🌱 MSU 화학과는 농업화학·식품화학·환경화학 세계적. MSU 의대 연계 의화학 연구. Pre-Med 화학 트랙 있음. 학비 대비 연구 기회 양호.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },

  'Cal Poly Pomona': {
    fullName: 'California State Polytechnic University, Pomona',
    location: 'Pomona, CA (LA 동쪽 35마일)',
    type: '공립 대학 (California State University System)',
    founded: '1938년',
    size: '약 28,000명 (학부 ~25,000명)',
    acceptRate: '~55%',
    intlRate: '~3%',
    satPolicy: '선택 제출',
    satRange: '1150 ~ 1380',
    satRangeKR: '1280 ~ 1360 (비공식 추정)',
    tuition: '~$15,000/년 (국제학생 — CSU 시스템, 극히 저렴)',
    coa: '~$38,000~43,000/년 (LA 근교지만 저렴)',
    needBlindDomestic: false,
    needBlindIntl: false,
    avgAid: '⚠️ 국제학생 재정지원 매우 제한적 (공립 캘리포니아주)',
    avgAidKR: '~$3,000~5,000 추정 (공립 CSU)',
    preMedRating: '낮음',
    preMedNote: '공학·건축·농업 특화. Pre-Med 트랙 없음. LA 근교이지만 Pre-Med 환경 매우 약함. 의대 연계 없음.',
    bsMd: false,
    bsMdProgram: '',
    applyTypes: ['EA', 'RD'],
    mapX: 13,
    mapY: 66,
    color1: '#007A33',
    color2: '#00471E',
    emoji: '🌵',
    kkumiNote: '학비 극히 저렴($15K) — 4년 총비용 ~$150K대. Pre-Med 환경 없음. 공학·건축 특화. LA 근교. 꾸미 Pre-Med 목표와 방향 완전히 다름. 비용 절대 우선이라면 최후 선택지.',
    panamaNote: '📍 CSU 최저 학비. LA 근교. Pre-Med 방향 아님. 파나마 희소성 있음. 비용 절대 우선이라면 고려 가능. Pre-Med 목표에는 부적합.',
    chemNote: '🌵 Cal Poly Pomona 화학과는 실습 중심. Pre-Med 화학 트랙 약함. LA 인근 제약·바이오 간접 접근. 학비 대비 실습 교육 가능. 꾸미 Pre-Med+화학 목표에는 방향 다름.',
    evalCriteria: [
      { label: 'GPA / 학업성취', weight: '핵심', note: '최상위 성적 필수. 도전적 과목 이수 중요' },
      { label: '에세이', weight: '높음', note: '개인 서사와 학교 커뮤니티 fit을 보여주는 에세이 필수' },
      { label: '과외활동', weight: '높음', note: '깊이 있는 활동과 커뮤니티 기여 증거' },
      { label: '추천서', weight: '중간', note: '교사+카운슬러 추천서. 학문적 능력과 인성 서술' },
      { label: 'SAT/ACT', weight: '중간', note: '학교 정책에 따라 중요도 다름. 제출 시 상위권 권장' },
      { label: '다양성', weight: '중간', note: '파나마 출신 희소성이 지역 다양성 측면에서 긍정적 요소' },
    ],
  },
};

// 배지 텍스트에서 학교 키 추출 함수
function extractKey(badge: string): string {
  // "MIT (T, 2위, N)" -> "MIT"
  // "Caltech (T, 11위)" -> "Caltech"
  return badge.split(' (')[0].split('(')[0].trim();
}

// ────────────────────────────────────────────────
//  원본 엑셀 데이터
// ────────────────────────────────────────────────
const originalGroups = [
  {
    group: '1 Group', range: '1 ~ 22위',
    color: { bg: 'linear-gradient(135deg,#EDE9FE,#DDD6FE)', border: '#C4B5FD', label: '#5B21B6', badge: '#7C3AED' },
    tiers: [
      { tier: '최상 1', range: '1~3위', schools: ['MIT (T, 2위, N)', 'Caltech (T, 11위)', 'Stanford (T, 4위)'], note: '' },
      { tier: '최상 2', range: '4~6위', schools: ['Yale (T, 4위, N)', 'Harvard (T, 3위, N)', 'Princeton (T, 1위, N)'], note: '' },
      { tier: '상 1', range: '7~9위', schools: ['Columbia (15위)', 'U of Chicago (6위)', 'Brown (T, 13위, N)'], note: '1그룹 최상에 추가 가능 검토' },
      { tier: '상 2', range: '10~14위', schools: ['Dartmouth (T, 13위, N)', 'UPenn (T, 7위)', 'Cornell (T, 12위)', 'Johns Hopkins (T, 7위)', 'Duke (7위)'], note: 'JHU: Bio 최상위 / 상1·2 최상 병렬' },
      { tier: '하단 1', range: '15~16위', schools: ['Northwestern (7위)', 'Vanderbilt (17위)', 'Williams (L1)', 'Amherst (L2, N)', 'Pomona (L7)'], note: '1그룹 상2 ↔ 하단1 경계' },
      { tier: '하단 2', range: '17~22위', schools: ['Rice (T, 17위)', 'Swarthmore (L4)', 'Bowdoin (L5, N)', 'WashU in St. Louis (20위)', 'Carnegie Mellon (T)(ED1) (20위)', 'Notre Dame (20위)', 'Harvey Mudd (L10)', 'UCLA (17위)', 'UC Berkeley (15위)'], note: '수학 능력 최상위 — 하단1 / UCLA: 공대는 약간 어려움 / UC Berkeley: 컴사 상단2, 공대 하단1' },
    ]
  },
  {
    group: '2 Group', range: '23 ~ 45위',
    color: { bg: 'linear-gradient(135deg,#DBEAFE,#BFDBFE)', border: '#93C5FD', label: '#1E40AF', badge: '#2563EB' },
    tiers: [
      { tier: '상 1', range: '23~26위', schools: ['NYU (32위)', 'Georgia Tech (T, 32위)', 'UT Austin (T, 30위)', 'Georgetown (T, 24위)', 'USC (28위)', 'Cooper Union', 'Franklin W. Olin College of Engineering'], note: 'Georgetown: 1그룹 하단2 경계 / UT Austin: 의사·비즈니스 분야 1그룹 하단' },
      { tier: '상 2', range: '27~31위', schools: ['Emory (24위)', 'U of Virginia (26위)', 'Tufts (36위)', 'U of Michigan (EA기준 20위)', 'UNC Chapel Hill (26위)'], note: 'UPenn 동영역 상1 or 2 최상' },
      { tier: '중단 1', range: '32~34위', schools: ['Boston College (36위)', 'Boston University (42위)', 'Haverford (L24)', 'Colby (L24)', 'Vassar (L13)'], note: '' },
      { tier: '중단 2', range: '35~40위', schools: ['UCSD (29위)', 'UIUC (36위)', 'U of Florida (30위)', 'Northeastern (46위)', 'Lehigh (46위)', 'Wake Forest (51위)', 'Villanova (57위)'], note: '' },
      { tier: '하단', range: '40~45위', schools: ['UC Irvine (32위)', 'U of Rochester (44위)', 'U of Washington (42위)', 'Grinnell (L13)', 'Brandeis (69위)', 'Bucknell (L30)', 'U of Georgia (46위)', 'U of Wisconsin (36위)', 'Florida State (51위)', 'Case Western Reserve (51위)', 'NC State (64위)', 'William & Mary (51위)', 'UCSB (40위)'], note: '' },
    ]
  },
  {
    group: '3 Group', range: '46위+',
    color: { bg: 'linear-gradient(135deg,#D1FAE5,#A7F3D0)', border: '#6EE7B7', label: '#065F46', badge: '#16A34A' },
    tiers: [
      { tier: '상', range: '', schools: ['Purdue (46위)', 'George Washington (59위)', 'Texas A&M (51위)', 'UMD College Park (42위)', 'Ohio State (41위)', 'Santa Clara (59위)'], note: '의사와의 관계에서 2그룹 하단' },
      { tier: '하단 1', range: '', schools: ['Baylor', 'UC Davis (32위)', 'SMU', 'Rose-Hulman', 'Penn State (59위)', 'Rutgers NB (42위)', 'Stony Brook (59위)', 'Virginia Tech (51위)', 'Cal Poly SLO', 'UMass Amherst (64위)'], note: '' },
      { tier: '하단 2', range: '', schools: ['U of Minnesota (59위)', 'UC Santa Cruz', 'UC Riverside', 'Michigan State (64위)', 'Cal Poly Pomona'], note: '' },
    ]
  },
];

// ────────────────────────────────────────────────
//  국제학생 관점 데이터
// ────────────────────────────────────────────────
type IntlSchool = {
  name: string; rank: string; intlRate: string;
  needBlind: boolean; bsMd: boolean;
  originalTier: string; correctedTier: string;
  warning: string; note: string; category: 'Dream'|'Reach'|'Target'|'Caution';
};

const intlGroups: { tier: string; desc: string; color: { bg:string;border:string;label:string;dot:string }; schools: IntlSchool[] }[] = [
  {
    tier: '극상', desc: '국제학생 합격률 < 6% — 사실상 복권',
    color: { bg:'linear-gradient(135deg,#FEE2E2,#FECACA)', border:'#FCA5A5', label:'#991B1B', dot:'#EF4444' },
    schools: [
      { name:'Harvard', rank:'3위', intlRate:'~3%', needBlind:true, bsMd:false, originalTier:'최상2', correctedTier:'극상', warning:'', note:'국제학생 Need-Blind', category:'Dream' },
      { name:'Princeton', rank:'1위', intlRate:'~4%', needBlind:true, bsMd:false, originalTier:'최상2', correctedTier:'극상', warning:'', note:'국제학생 Need-Blind', category:'Dream' },
      { name:'MIT', rank:'2위', intlRate:'~4%', needBlind:true, bsMd:false, originalTier:'최상1', correctedTier:'극상', warning:'', note:'국제학생 Need-Blind, T 필수', category:'Dream' },
      { name:'Stanford', rank:'4위', intlRate:'~4%', needBlind:false, bsMd:false, originalTier:'최상1', correctedTier:'극상', warning:'', note:'Need-Aware (국제학생)', category:'Dream' },
      { name:'Columbia', rank:'12위', intlRate:'~4%', needBlind:false, bsMd:false, originalTier:'상1', correctedTier:'극상', warning:'⚠️ 원본 "상1" → 실제 최상2 수준', note:'최근 합격률 3.9%로 급락', category:'Dream' },
      { name:'Yale', rank:'8위', intlRate:'~5%', needBlind:true, bsMd:false, originalTier:'최상2', correctedTier:'극상', warning:'', note:'국제학생 Need-Blind', category:'Dream' },
      { name:'UChicago', rank:'6위', intlRate:'~5%', needBlind:false, bsMd:false, originalTier:'상1', correctedTier:'극상', warning:'⚠️ 원본 "상1" → 실제 최상2 수준', note:'최근 5년간 합격률 급락', category:'Dream' },
      { name:'Caltech', rank:'11위', intlRate:'~4%', needBlind:false, bsMd:false, originalTier:'최상1', correctedTier:'극상', warning:'', note:'STEM 특화, 소규모', category:'Dream' },
    ]
  },
  {
    tier: '상', desc: '국제학생 합격률 6~15% — 최상위 Reach',
    color: { bg:'linear-gradient(135deg,#FEF3C7,#FDE68A)', border:'#FCD34D', label:'#92400E', dot:'#F59E0B' },
    schools: [
      { name:'Brown', rank:'13위', intlRate:'~5%', needBlind:true, bsMd:true, originalTier:'상1', correctedTier:'상', warning:'', note:'🏥 PLME 8년 BS-MD ★ / Need-Blind', category:'Reach' },
      { name:'Dartmouth', rank:'15위', intlRate:'~6%', needBlind:true, bsMd:false, originalTier:'상2', correctedTier:'상', warning:'', note:'국제학생 Need-Blind', category:'Reach' },
      { name:'Vanderbilt', rank:'17위', intlRate:'~7%', needBlind:false, bsMd:false, originalTier:'하단1', correctedTier:'상', warning:'⚠️ 원본 "하단1" → 실제 상2 수준', note:'합격률 6.7%로 최근 급락', category:'Reach' },
      { name:'UPenn', rank:'7위', intlRate:'~7%', needBlind:false, bsMd:false, originalTier:'상2', correctedTier:'상', warning:'', note:'Perelman 의대 연계 강점', category:'Reach' },
      { name:'Cornell', rank:'12위', intlRate:'~7%', needBlind:false, bsMd:false, originalTier:'상2', correctedTier:'상', warning:'', note:'Pre-Med 강세', category:'Reach' },
      { name:'Johns Hopkins', rank:'9위', intlRate:'~7%', needBlind:false, bsMd:false, originalTier:'상2', correctedTier:'상', warning:'', note:'Pre-Med 절대 최강 — 내부 경쟁 극심', category:'Reach' },
      { name:'Duke', rank:'10위', intlRate:'~7%', needBlind:false, bsMd:false, originalTier:'상2', correctedTier:'상', warning:'', note:'Bio/Pre-Med 최상위', category:'Reach' },
      { name:'Northwestern', rank:'9위', intlRate:'~7%', needBlind:false, bsMd:true, originalTier:'하단1', correctedTier:'상', warning:'', note:'🏥 HPME 7년 BS-MD ★ (별도 지원)', category:'Reach' },
      { name:'Carnegie Mellon', rank:'23위', intlRate:'~4~7% (STEM)', needBlind:false, bsMd:false, originalTier:'하단2', correctedTier:'상', warning:'⚠️ 원본 "하단2" → STEM 기준 상1~2 수준', note:'CS/공학과는 최상위권 난이도', category:'Reach' },
      { name:'Swarthmore', rank:'L4', intlRate:'~7%', needBlind:false, bsMd:false, originalTier:'하단2', correctedTier:'상', warning:'⚠️ LAC — 실제 난이도 "하단2"보다 훨씬 높음', note:'LAC 최상위, 의대 진학률 높음', category:'Reach' },
      { name:'Williams', rank:'L1', intlRate:'~8%', needBlind:false, bsMd:false, originalTier:'하단1', correctedTier:'상', warning:'', note:'LAC 1위, 의대 진학률 최상', category:'Reach' },
      { name:'Amherst', rank:'L2', intlRate:'~8%', needBlind:true, bsMd:false, originalTier:'하단1', correctedTier:'상', warning:'', note:'국제학생 Need-Blind', category:'Reach' },
      { name:'Harvey Mudd', rank:'L10', intlRate:'~10%', needBlind:false, bsMd:false, originalTier:'하단2', correctedTier:'상', warning:'⚠️ 원본 "하단2" → 공학계 실제 난이도 훨씬 높음', note:'Caltech 바로 아래 공학 난이도', category:'Reach' },
      { name:'Pomona', rank:'L7', intlRate:'~7%', needBlind:false, bsMd:false, originalTier:'하단1', correctedTier:'상', warning:'', note:'LAC 7위', category:'Reach' },
    ]
  },
  {
    tier: '중상', desc: '합격률 10~20% — 현실적 Target',
    color: { bg:'linear-gradient(135deg,#D1FAE5,#A7F3D0)', border:'#6EE7B7', label:'#065F46', dot:'#22C55E' },
    schools: [
      { name:'Rice', rank:'17위', intlRate:'~10%', needBlind:false, bsMd:true, originalTier:'하단2', correctedTier:'중상', warning:'', note:'🏥 Rice-Baylor Medical Scholars ★', category:'Target' },
      { name:'WashU in St.Louis', rank:'20위', intlRate:'~12%', needBlind:false, bsMd:false, originalTier:'하단2', correctedTier:'중상', warning:'', note:'Pre-Med 강세, Need-Aware', category:'Target' },
      { name:'Notre Dame', rank:'20위', intlRate:'~12%', needBlind:false, bsMd:false, originalTier:'하단2', correctedTier:'중상', warning:'', note:'ED1 우선, 외국인 지원 제한적', category:'Target' },
      { name:'Bowdoin', rank:'L5', intlRate:'~8%', needBlind:true, bsMd:false, originalTier:'하단2', correctedTier:'중상', warning:'', note:'LAC Need-Blind', category:'Target' },
      { name:'Georgetown', rank:'22위', intlRate:'~13%', needBlind:false, bsMd:false, originalTier:'2그룹 상1', correctedTier:'중상', warning:'⚠️ 원본 "2그룹 상1" → 1그룹 하단2 경계', note:'Pre-Med 경쟁 극심, 재정지원 거의 없음', category:'Target' },
      { name:'Emory', rank:'24위', intlRate:'~13%', needBlind:false, bsMd:false, originalTier:'2그룹 상2', correctedTier:'중상', warning:'', note:'Pre-Med 강세, 국제학생 지원 양호', category:'Target' },
      { name:'Tufts', rank:'36위', intlRate:'~10%', needBlind:false, bsMd:false, originalTier:'2그룹 상2', correctedTier:'중상', warning:'', note:'국제학생 친화적, Pre-Med 좋음', category:'Target' },
      { name:'USC', rank:'28위', intlRate:'~10%', needBlind:false, bsMd:false, originalTier:'2그룹 상1', correctedTier:'중상', warning:'', note:'국제학생 비율 높음', category:'Target' },
      { name:'Boston University', rank:'42위', intlRate:'~17%', needBlind:false, bsMd:true, originalTier:'2그룹 중단1', correctedTier:'중상', warning:'', note:'🏥 7년 BS-MD (MMEDIC) ★', category:'Target' },
      { name:'Case Western Reserve', rank:'51위', intlRate:'~15%', needBlind:false, bsMd:true, originalTier:'2그룹 하단', correctedTier:'중상', warning:'', note:'🏥 PPSP 8년 BS-MD ★', category:'Target' },
      { name:'Georgia Tech', rank:'32위', intlRate:'~15%', needBlind:false, bsMd:false, originalTier:'2그룹 상1', correctedTier:'중상', warning:'', note:'STEM 특화, 국제학생 접근성 양호', category:'Target' },
      { name:'Northeastern', rank:'40위', intlRate:'~15%', needBlind:false, bsMd:false, originalTier:'2그룹 중단2', correctedTier:'중상', warning:'⚠️ 원본 46위 → 실제 40위로 급상승', note:'코압 프로그램 강점', category:'Target' },
    ]
  },
  {
    tier: '⚠️ 국제학생 주의', desc: 'Public 대학 — 전체 합격률 ≠ 국제학생 합격률',
    color: { bg:'linear-gradient(135deg,#FEE2E2,#FED7AA)', border:'#FCA5A5', label:'#7C2D12', dot:'#EF4444' },
    schools: [
      { name:'U of Michigan', rank:'7위 (Public)', intlRate:'~5~7% (전체 17%)', needBlind:false, bsMd:false, originalTier:'2그룹 상2', correctedTier:'⚠️ 따로 검토', warning:'🚨 Public: 전체 합격률 17% vs 국제학생 5~7% — 재정지원 거의 없음', note:'Out-of-state 학비 $60,000+', category:'Caution' },
      { name:'UNC Chapel Hill', rank:'26위 (Public)', intlRate:'~1~2% (전체 18%)', needBlind:false, bsMd:false, originalTier:'2그룹 상2', correctedTier:'⚠️ 따로 검토', warning:'🚨 Public: 국제학생 사실상 불가 수준', note:'북캐롤라이나 거주자 우선', category:'Caution' },
      { name:'UT Austin', rank:'30위 (Public)', intlRate:'~5% (intl, 전체 30%)', needBlind:false, bsMd:false, originalTier:'2그룹 상1', correctedTier:'⚠️ 따로 검토', warning:'🚨 Public: 텍사스 거주자 우선, 국제학생 재정지원 없음', note:'Pre-Med 내부 경쟁 매우 심함', category:'Caution' },
      { name:'U of Florida', rank:'30위 (Public)', intlRate:'제한적 (전체 30%)', needBlind:false, bsMd:false, originalTier:'2그룹 중단2', correctedTier:'⚠️ 따로 검토', warning:'🚨 Public: 국제학생 쿼터 극히 제한', note:'재정지원 없음', category:'Caution' },
      { name:'UVA', rank:'26위 (Public)', intlRate:'~5% (intl, 전체 17%)', needBlind:false, bsMd:false, originalTier:'2그룹 상2', correctedTier:'⚠️ 따로 검토', warning:'🚨 Public: Out-of-state/국제학생 합격률 대폭 낮음', note:'비용 높음, 재정지원 제한', category:'Caution' },
      { name:'U of Washington', rank:'42위 (Public)', intlRate:'~20% (상대적 양호)', needBlind:false, bsMd:false, originalTier:'2그룹 하단', correctedTier:'2그룹 하단 유지', warning:'', note:'Public이지만 국제학생 접근성 상대적으로 양호', category:'Target' },
      { name:'UCSD', rank:'29위 (Public)', intlRate:'~24%', needBlind:false, bsMd:false, originalTier:'2그룹 중단2', correctedTier:'2그룹 중하', warning:'', note:'UC계열 중 접근성 양호, 재정지원 제한', category:'Target' },
    ]
  },
];

const bsMdPrograms = [
  { school:'Brown University', program:'PLME', duration:'8년', intlRate:'~3%', note:'입학 시 의대 보장. MCAT 불필요. 국제학생 Need-Blind' },
  { school:'Rice + Baylor COM', program:'Medical Scholars Program', duration:'8년', intlRate:'~2%', note:'Rice 합격 후 추가 지원. 별도 인터뷰 필수' },
  { school:'Northwestern', program:'HPME', duration:'7년', intlRate:'~2%', note:'극히 경쟁적. 별도 에세이·인터뷰 필요' },
  { school:'Boston University', program:'MMEDIC', duration:'7년', intlRate:'~5%', note:'GPA 3.2+ 유지 조건. MCAT 필요' },
  { school:'Case Western Reserve', program:'PPSP', duration:'8년', intlRate:'~10%', note:'CWRU 의대 보장. Pre-Med 트랙 유연' },
  { school:'Penn State + Jefferson', program:'BS/MD Articulation', duration:'8년', intlRate:'제한적', note:'Schreyers Honors College 기반' },
];

const preMedColors: Record<string, string> = {
  '최상': '#16A34A', '상': '#2563EB', '중': '#D97706', '낮음': '#DC2626',
};

// ────────────────────────────────────────────────
//  CDS (Common Data Set) C7 원본 데이터 — 1 Group
// ────────────────────────────────────────────────
type CdsRating = 'VI' | 'I' | 'C' | 'NC';
type AwardsLevel = '★★★' | '★★' | '★' | '—';  // 수상이력 중요도 (비공식)
type CdsRow = {
  school: string;
  tier: string;
  year: string;
  satPolicy: string;
  factors: {
    rigor: CdsRating;          // 고교 커리큘럼 난이도
    classRank: CdsRating;      // 학급 석차
    gpa: CdsRating;            // 내신 GPA
    testScores: CdsRating;     // SAT/ACT
    essay: CdsRating;          // 에세이
    recs: CdsRating;           // 추천서
    interview: CdsRating;      // 인터뷰
    extracurricular: CdsRating;// 과외활동
    talent: CdsRating;         // 특별한 재능
    character: CdsRating;      // 인격/품성
    firstGen: CdsRating;       // 1세대 대학생
    alumni: CdsRating;         // 동문 자녀
    geo: CdsRating;            // 지역 다양성
    stateRes: CdsRating;       // 주 거주자
    religion: CdsRating;       // 종교
    race: CdsRating;           // 인종/다양성
    volunteer: CdsRating;      // 봉사활동
    work: CdsRating;           // 직업 경험
    interest: CdsRating;       // 지원 관심도
  };
  awardsEmphasis: AwardsLevel; // 수상이력 중요도 (비공식 보조 지표)
  awardsNote: string;          // 어떤 수상이 특히 유효한지
  sourceUrl: string;
};

const cdsGroup1: CdsRow[] = [
  { school:'MIT', tier:'최상1', year:'2023-24', satPolicy:'필수',
    factors:{ rigor:'VI', classRank:'C', gpa:'VI', testScores:'VI', essay:'VI', recs:'VI', interview:'C', extracurricular:'VI', talent:'VI', character:'VI', firstGen:'I', alumni:'NC', geo:'C', stateRes:'NC', religion:'NC', race:'I', volunteer:'I', work:'C', interest:'NC' },
    awardsEmphasis:'★★★', awardsNote:'수학·물리·화학 올림피아드(국제/국가), ISEF, Intel STS, Regeneron 수상이 매우 강력한 차별화 요소. USACO Platinum, AMC/AIME 고득점도 유효',
    sourceUrl:'https://web.mit.edu/ir/cds' },
  { school:'Caltech', tier:'최상1', year:'2023-24', satPolicy:'필수',
    factors:{ rigor:'VI', classRank:'C', gpa:'VI', testScores:'VI', essay:'VI', recs:'VI', interview:'C', extracurricular:'VI', talent:'VI', character:'VI', firstGen:'I', alumni:'NC', geo:'C', stateRes:'NC', religion:'NC', race:'I', volunteer:'I', work:'C', interest:'NC' },
    awardsEmphasis:'★★★', awardsNote:'수학·물리·화학 국제올림피아드(IMO/IPhO/IChO) 국가대표 수준 수상이 압도적 강점. ISEF 수상 및 학술 출판도 강력히 유효',
    sourceUrl:'https://www.caltech.edu/about/ir/cds' },
  { school:'Stanford', tier:'최상1', year:'2023-24', satPolicy:'필수',
    factors:{ rigor:'VI', classRank:'C', gpa:'VI', testScores:'VI', essay:'VI', recs:'VI', interview:'C', extracurricular:'VI', talent:'VI', character:'VI', firstGen:'I', alumni:'NC', geo:'I', stateRes:'NC', religion:'NC', race:'I', volunteer:'I', work:'I', interest:'NC' },
    awardsEmphasis:'★★★', awardsNote:'올림피아드·Regeneron·Siemens 등 국가/국제 수준 수상이 강점. 단 수상 단독보다 에세이와 연계된 스토리텔링이 필수',
    sourceUrl:'https://irds.stanford.edu/cds' },
  { school:'Harvard', tier:'최상2', year:'2023-24', satPolicy:'필수',
    factors:{ rigor:'VI', classRank:'VI', gpa:'VI', testScores:'VI', essay:'VI', recs:'VI', interview:'VI', extracurricular:'VI', talent:'VI', character:'VI', firstGen:'I', alumni:'I', geo:'I', stateRes:'NC', religion:'NC', race:'I', volunteer:'I', work:'I', interest:'NC' },
    awardsEmphasis:'★★★', awardsNote:'국가/국제 수준 학문·예술·리더십 수상이 강점. 단순 교내 수상보다 외부 공신력 있는 국제대회 수상이 훨씬 중요',
    sourceUrl:'https://oir.harvard.edu/cds' },
  { school:'Yale', tier:'최상2', year:'2023-24', satPolicy:'필수',
    factors:{ rigor:'VI', classRank:'VI', gpa:'VI', testScores:'VI', essay:'VI', recs:'VI', interview:'VI', extracurricular:'VI', talent:'VI', character:'VI', firstGen:'I', alumni:'C', geo:'C', stateRes:'NC', religion:'NC', race:'I', volunteer:'I', work:'C', interest:'NC' },
    awardsEmphasis:'★★★', awardsNote:'학문 수상뿐 아니라 예술·음악·문학·변론 대회 수상도 유효. Yale은 전인격적 평가라 다양한 분야 수상 모두 강점',
    sourceUrl:'https://oira.yale.edu/cds' },
  { school:'Princeton', tier:'최상2', year:'2023-24', satPolicy:'필수',
    factors:{ rigor:'VI', classRank:'VI', gpa:'VI', testScores:'VI', essay:'VI', recs:'VI', interview:'VI', extracurricular:'VI', talent:'VI', character:'VI', firstGen:'I', alumni:'C', geo:'C', stateRes:'NC', religion:'NC', race:'I', volunteer:'I', work:'C', interest:'NC' },
    awardsEmphasis:'★★★', awardsNote:'학문·연구 수상이 강력. Princeton은 학부 Thesis 문화라 연구 경쟁력을 증명하는 수상이 특히 유효',
    sourceUrl:'https://ir.princeton.edu/cds' },
  { school:'Columbia', tier:'상1', year:'2023-24', satPolicy:'필수',
    factors:{ rigor:'VI', classRank:'VI', gpa:'VI', testScores:'VI', essay:'VI', recs:'VI', interview:'C', extracurricular:'VI', talent:'VI', character:'VI', firstGen:'I', alumni:'NC', geo:'C', stateRes:'NC', religion:'NC', race:'I', volunteer:'I', work:'C', interest:'NC' },
    awardsEmphasis:'★★', awardsNote:'국가/국제 수준 수상이 도움되지만 Columbia는 에세이·리더십 비중이 더 높음. 수상 단독보단 활동의 깊이가 더 중요',
    sourceUrl:'https://ir.columbia.edu/cds' },
  { school:'U of Chicago', tier:'상1', year:'2023-24', satPolicy:'필수',
    factors:{ rigor:'VI', classRank:'C', gpa:'VI', testScores:'VI', essay:'VI', recs:'VI', interview:'I', extracurricular:'VI', talent:'VI', character:'VI', firstGen:'I', alumni:'NC', geo:'I', stateRes:'NC', religion:'NC', race:'I', volunteer:'I', work:'C', interest:'NC' },
    awardsEmphasis:'★★', awardsNote:'학문적 수상(올림피아드·연구대회)이 도움되지만 UChicago는 독창적 에세이와 지적 호기심이 최우선. 수상보다 사고의 깊이가 핵심',
    sourceUrl:'https://provost.uchicago.edu/cds' },
  { school:'Brown', tier:'상1', year:'2023-24', satPolicy:'필수',
    factors:{ rigor:'VI', classRank:'I', gpa:'VI', testScores:'VI', essay:'VI', recs:'VI', interview:'C', extracurricular:'VI', talent:'I', character:'VI', firstGen:'I', alumni:'C', geo:'C', stateRes:'NC', religion:'NC', race:'I', volunteer:'I', work:'C', interest:'NC' },
    awardsEmphasis:'★★', awardsNote:'Brown은 특정 분야 깊이 있는 열정(Spike)을 중시. 수상 자체보다 수상으로 이어지는 스토리와 열정이 더 중요',
    sourceUrl:'https://www.brown.edu/ir/cds' },
  { school:'Dartmouth', tier:'상2', year:'2023-24', satPolicy:'필수',
    factors:{ rigor:'VI', classRank:'VI', gpa:'VI', testScores:'VI', essay:'VI', recs:'VI', interview:'I', extracurricular:'VI', talent:'VI', character:'VI', firstGen:'C', alumni:'I', geo:'I', stateRes:'NC', religion:'NC', race:'I', volunteer:'I', work:'C', interest:'NC' },
    awardsEmphasis:'★★', awardsNote:'국가/국제 수상이 유효하지만 Dartmouth는 커뮤니티 기여·야외활동·리더십을 더 중시. 학문 수상+커뮤니티 활동 병행 권장',
    sourceUrl:'https://ir.dartmouth.edu/cds' },
  { school:'UPenn', tier:'상2', year:'2023-24', satPolicy:'필수',
    factors:{ rigor:'VI', classRank:'VI', gpa:'VI', testScores:'VI', essay:'VI', recs:'VI', interview:'C', extracurricular:'VI', talent:'VI', character:'VI', firstGen:'I', alumni:'C', geo:'C', stateRes:'NC', religion:'NC', race:'I', volunteer:'I', work:'C', interest:'NC' },
    awardsEmphasis:'★★', awardsNote:'학문·비즈니스·의학 관련 수상이 유효. Wharton 지원 시 비즈니스 경쟁대회(DECA·BPA) 수상도 강점',
    sourceUrl:'https://ir.upenn.edu/cds' },
  { school:'Cornell', tier:'상2', year:'2023-24', satPolicy:'선택',
    factors:{ rigor:'VI', classRank:'I', gpa:'VI', testScores:'I', essay:'VI', recs:'VI', interview:'C', extracurricular:'I', talent:'I', character:'VI', firstGen:'C', alumni:'NC', geo:'I', stateRes:'C', religion:'NC', race:'C', volunteer:'I', work:'C', interest:'NC' },
    awardsEmphasis:'★★', awardsNote:'지원 칼리지별 관련 수상이 유효. Engineering은 STEM 올림피아드, CAS는 학문 수상, Hospitality는 외부 수상보다 경험이 더 중요',
    sourceUrl:'https://irp.dpb.cornell.edu/cds' },
  { school:'Johns Hopkins', tier:'상2', year:'2023-24', satPolicy:'선택',
    factors:{ rigor:'VI', classRank:'C', gpa:'VI', testScores:'I', essay:'VI', recs:'VI', interview:'NC', extracurricular:'VI', talent:'I', character:'VI', firstGen:'I', alumni:'NC', geo:'C', stateRes:'NC', religion:'NC', race:'I', volunteer:'I', work:'C', interest:'NC' },
    awardsEmphasis:'★★★', awardsNote:'Regeneron·ISEF·Intel 수상이 매우 강력. JHU는 연구 대학이라 연구 관련 수상이 거의 결정적 차별화 요소로 작용',
    sourceUrl:'https://oir.jhu.edu/cds' },
  { school:'Duke', tier:'상2', year:'2023-24', satPolicy:'선택',
    factors:{ rigor:'VI', classRank:'VI', gpa:'VI', testScores:'VI', essay:'VI', recs:'VI', interview:'C', extracurricular:'VI', talent:'VI', character:'VI', firstGen:'I', alumni:'C', geo:'C', stateRes:'NC', religion:'NC', race:'I', volunteer:'I', work:'C', interest:'NC' },
    awardsEmphasis:'★★', awardsNote:'학문·운동·예술 등 다양한 수상 유효. Duke는 균형 잡힌 활동을 선호하므로 한 분야 수상보다 복합적 성취 선호',
    sourceUrl:'https://ir.duke.edu/cds' },
  { school:'Northwestern', tier:'하단1', year:'2023-24', satPolicy:'선택',
    factors:{ rigor:'VI', classRank:'C', gpa:'VI', testScores:'I', essay:'VI', recs:'VI', interview:'C', extracurricular:'VI', talent:'VI', character:'VI', firstGen:'I', alumni:'C', geo:'C', stateRes:'NC', religion:'NC', race:'I', volunteer:'I', work:'C', interest:'C' },
    awardsEmphasis:'★★', awardsNote:'지원 전공 관련 수상이 유효. Medill(저널리즘)은 언론상, Bienen(음악)은 콩쿠르 수상, STEM은 올림피아드 수상이 가장 효과적',
    sourceUrl:'https://www.northwestern.edu/ir/cds' },
  { school:'Vanderbilt', tier:'하단1', year:'2023-24', satPolicy:'선택',
    factors:{ rigor:'VI', classRank:'I', gpa:'VI', testScores:'I', essay:'VI', recs:'VI', interview:'C', extracurricular:'VI', talent:'VI', character:'VI', firstGen:'I', alumni:'C', geo:'C', stateRes:'NC', religion:'NC', race:'I', volunteer:'I', work:'C', interest:'C' },
    awardsEmphasis:'★★', awardsNote:'학문 수상이 유효하지만 Vanderbilt는 활동·봉사·균형을 더 중시. National Merit Finalist 등 전국 단위 수상이 특히 장학금 연계에 도움',
    sourceUrl:'https://ir.vanderbilt.edu/cds' },
  { school:'Williams', tier:'하단1', year:'2023-24', satPolicy:'선택',
    factors:{ rigor:'VI', classRank:'I', gpa:'VI', testScores:'C', essay:'VI', recs:'VI', interview:'C', extracurricular:'VI', talent:'VI', character:'VI', firstGen:'I', alumni:'C', geo:'I', stateRes:'NC', religion:'NC', race:'I', volunteer:'I', work:'I', interest:'NC' },
    awardsEmphasis:'★★', awardsNote:'다방면 수상이 유효. Williams는 전인격적 평가라 STEM 올림피아드뿐 아니라 예술·문학·스포츠 수상도 고루 인정',
    sourceUrl:'https://provost.williams.edu/cds' },
  { school:'Amherst', tier:'하단1', year:'2023-24', satPolicy:'선택',
    factors:{ rigor:'VI', classRank:'I', gpa:'VI', testScores:'C', essay:'VI', recs:'VI', interview:'C', extracurricular:'VI', talent:'I', character:'VI', firstGen:'VI', alumni:'NC', geo:'C', stateRes:'NC', religion:'NC', race:'I', volunteer:'I', work:'C', interest:'NC' },
    awardsEmphasis:'★', awardsNote:'수상 자체보다 에세이와 스토리가 더 중요. Amherst는 사회정의·다양성·인성을 최우선으로 보므로 수상이 보조 역할에 그침',
    sourceUrl:'https://www.amherst.edu/aboutamherst/facts/cds' },
  { school:'Pomona', tier:'하단1', year:'2023-24', satPolicy:'선택',
    factors:{ rigor:'VI', classRank:'I', gpa:'VI', testScores:'C', essay:'VI', recs:'VI', interview:'C', extracurricular:'VI', talent:'VI', character:'VI', firstGen:'I', alumni:'NC', geo:'C', stateRes:'NC', religion:'NC', race:'I', volunteer:'I', work:'C', interest:'NC' },
    awardsEmphasis:'★', awardsNote:'수상보다 활동의 깊이와 다양성이 더 중요. LAC 문화 특성상 교내 리더십·커뮤니티 기여가 수상보다 더 큰 비중',
    sourceUrl:'https://www.pomona.edu/ir/cds' },
  { school:'Rice', tier:'하단2', year:'2023-24', satPolicy:'필수',
    factors:{ rigor:'VI', classRank:'C', gpa:'VI', testScores:'VI', essay:'VI', recs:'VI', interview:'NC', extracurricular:'VI', talent:'VI', character:'VI', firstGen:'I', alumni:'NC', geo:'C', stateRes:'NC', religion:'NC', race:'I', volunteer:'I', work:'C', interest:'NC' },
    awardsEmphasis:'★★★', awardsNote:'ISEF·USACO·올림피아드 등 STEM 수상이 매우 강력. Rice-Baylor BS-MD 지원 시 국내외 의학·과학 수상이 실질적 차별화 요소',
    sourceUrl:'https://ir.rice.edu/cds' },
  { school:'Swarthmore', tier:'하단2', year:'2023-24', satPolicy:'선택',
    factors:{ rigor:'VI', classRank:'I', gpa:'VI', testScores:'C', essay:'VI', recs:'VI', interview:'C', extracurricular:'VI', talent:'I', character:'VI', firstGen:'I', alumni:'NC', geo:'C', stateRes:'NC', religion:'NC', race:'I', volunteer:'I', work:'C', interest:'NC' },
    awardsEmphasis:'★★', awardsNote:'학문 수상이 유효하지만 Swarthmore는 사회정의·지적 깊이를 더 중시. 연구 성과·학술 출판이 단순 수상보다 더 강력',
    sourceUrl:'https://www.swarthmore.edu/ir/cds' },
  { school:'Bowdoin', tier:'하단2', year:'2023-24', satPolicy:'미반영',
    factors:{ rigor:'VI', classRank:'C', gpa:'VI', testScores:'NC', essay:'VI', recs:'VI', interview:'C', extracurricular:'VI', talent:'VI', character:'VI', firstGen:'I', alumni:'NC', geo:'I', stateRes:'NC', religion:'NC', race:'I', volunteer:'I', work:'C', interest:'NC' },
    awardsEmphasis:'★', awardsNote:'Bowdoin은 SAT도 안 보는 학교. 수상보다 에세이·추천서·활동의 진정성이 압도적으로 중요. 수상이 있으면 플러스지만 결정적이지 않음',
    sourceUrl:'https://www.bowdoin.edu/ir/cds' },
  { school:'WashU in St. Louis', tier:'하단2', year:'2023-24', satPolicy:'선택',
    factors:{ rigor:'VI', classRank:'C', gpa:'VI', testScores:'I', essay:'VI', recs:'VI', interview:'C', extracurricular:'VI', talent:'I', character:'VI', firstGen:'I', alumni:'NC', geo:'C', stateRes:'NC', religion:'NC', race:'I', volunteer:'I', work:'C', interest:'NC' },
    awardsEmphasis:'★★', awardsNote:'의학·과학 관련 수상이 유효. WashU 의대 연계 Pre-Med 지원 시 연구대회·의학 관련 외부 수상이 실질적 도움',
    sourceUrl:'https://ir.wustl.edu/cds' },
  { school:'Carnegie Mellon', tier:'하단2', year:'2023-24', satPolicy:'선택',
    factors:{ rigor:'VI', classRank:'C', gpa:'VI', testScores:'I', essay:'VI', recs:'VI', interview:'C', extracurricular:'VI', talent:'VI', character:'VI', firstGen:'C', alumni:'NC', geo:'C', stateRes:'NC', religion:'NC', race:'C', volunteer:'C', work:'C', interest:'C' },
    awardsEmphasis:'★★★', awardsNote:'USACO·ICPC·해커톤·AI 경진대회 수상이 CS/Engineering 지원에 매우 강력. 포트폴리오+수상 병행이 이상적',
    sourceUrl:'https://www.cmu.edu/ir/cds' },
  { school:'Notre Dame', tier:'하단2', year:'2023-24', satPolicy:'필수',
    factors:{ rigor:'VI', classRank:'VI', gpa:'VI', testScores:'VI', essay:'VI', recs:'VI', interview:'C', extracurricular:'VI', talent:'VI', character:'VI', firstGen:'C', alumni:'I', geo:'C', stateRes:'NC', religion:'C', race:'C', volunteer:'VI', work:'C', interest:'NC' },
    awardsEmphasis:'★', awardsNote:'Notre Dame은 봉사·인성·가톨릭 가치를 최우선. 학문 수상보다 커뮤니티 봉사·리더십 성과가 더 중요. 수상은 보조 요소',
    sourceUrl:'https://ir.nd.edu/cds' },
  { school:'Harvey Mudd', tier:'하단2', year:'2023-24', satPolicy:'선택',
    factors:{ rigor:'VI', classRank:'C', gpa:'VI', testScores:'C', essay:'VI', recs:'VI', interview:'I', extracurricular:'VI', talent:'VI', character:'VI', firstGen:'C', alumni:'NC', geo:'C', stateRes:'NC', religion:'NC', race:'C', volunteer:'I', work:'C', interest:'I' },
    awardsEmphasis:'★★★', awardsNote:'수학·물리·CS 경시대회 수상이 매우 강력. AMC/AIME, USACO, 물리올림피아드 등 경쟁 수상이 Harvey Mudd 지원에 결정적 차별화',
    sourceUrl:'https://www.hmc.edu/ir/cds' },
  { school:'UCLA', tier:'하단2', year:'2023-24', satPolicy:'미반영',
    factors:{ rigor:'VI', classRank:'C', gpa:'VI', testScores:'NC', essay:'VI', recs:'C', interview:'NC', extracurricular:'VI', talent:'I', character:'I', firstGen:'I', alumni:'NC', geo:'VI', stateRes:'VI', religion:'NC', race:'NC', volunteer:'I', work:'I', interest:'NC' },
    awardsEmphasis:'★★', awardsNote:'UC 시스템은 수상이 PIQ(에세이) 안에 통합 서술. 국가/국제 수상을 에세이에서 스토리텔링으로 활용하는 것이 핵심',
    sourceUrl:'https://ucla.edu/about/administration/ir/cds' },
  { school:'UC Berkeley', tier:'하단2', year:'2023-24', satPolicy:'미반영',
    factors:{ rigor:'VI', classRank:'C', gpa:'VI', testScores:'NC', essay:'VI', recs:'NC', interview:'NC', extracurricular:'VI', talent:'I', character:'I', firstGen:'I', alumni:'NC', geo:'VI', stateRes:'VI', religion:'NC', race:'NC', volunteer:'I', work:'I', interest:'NC' },
    awardsEmphasis:'★★', awardsNote:'UC 시스템으로 수상을 PIQ에서 서술. 전공 관련 외부 수상(STEM·예술·사회활동)을 에세이에 잘 녹이는 것이 중요',
    sourceUrl:'https://opa.berkeley.edu/cds' },
];

const cdsFactorLabels: { key: keyof CdsRow['factors']; label: string; labelKR: string }[] = [
  { key:'rigor',          label:'Rigor of HS record',  labelKR:'고교 커리큘럼 난이도' },
  { key:'classRank',      label:'Class rank',           labelKR:'학급 석차' },
  { key:'gpa',            label:'Academic GPA',         labelKR:'내신 GPA' },
  { key:'testScores',     label:'Standardized tests',   labelKR:'SAT/ACT' },
  { key:'essay',          label:'Application essay',    labelKR:'에세이' },
  { key:'recs',           label:'Recommendations',      labelKR:'추천서' },
  { key:'interview',      label:'Interview',            labelKR:'인터뷰' },
  { key:'extracurricular',label:'Extracurricular',       labelKR:'과외활동' },
  { key:'talent',         label:'Talent/Ability',       labelKR:'특별한 재능' },
  { key:'character',      label:'Character/Personal',   labelKR:'인격/품성' },
  { key:'firstGen',       label:'First generation',     labelKR:'1세대 대학생' },
  { key:'alumni',         label:'Alumni relation',      labelKR:'동문 자녀' },
  { key:'geo',            label:'Geographical residence',labelKR:'지역 다양성' },
  { key:'stateRes',       label:'State residency',      labelKR:'주 거주자 우대' },
  { key:'religion',       label:'Religious affiliation',labelKR:'종교' },
  { key:'race',           label:'Racial/ethnic status', labelKR:'인종/민족 다양성' },
  { key:'volunteer',      label:'Volunteer work',       labelKR:'봉사활동' },
  { key:'work',           label:'Work experience',      labelKR:'직업 경험' },
  { key:'interest',       label:'Level of interest',    labelKR:'지원 관심도' },
];

// ────────────────────────────────────────────────
//  메인 컴포넌트
// ────────────────────────────────────────────────
export default function USCollegeInfo() {
  const [tab, setTab] = useState<Tab>('original');
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const handleBadgeClick = (badge: string) => {
    const key = extractKey(badge);
    setSelectedKey(key);
  };

  const selectedSchool = selectedKey ? schoolDB[selectedKey] : null;

  return (
    <div>
      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(135deg, #38BDF8 0%, #6366F1 50%, #8B5CF6 100%)',
        borderRadius: '16px', padding: '28px 32px', marginBottom: '24px',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(99,102,241,0.25)',
      }}>
        <div style={{ position:'absolute', top:'-50px', right:'-50px', width:'200px', height:'200px', borderRadius:'50%', background:'rgba(255,255,255,0.1)', pointerEvents:'none' }}/>
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.8)', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', marginBottom:'8px' }}>🇺🇸 College Info Center</div>
          <div style={{ fontSize:'24px', fontWeight:900, color:'#FFFFFF', marginBottom:'6px', letterSpacing:'-0.5px' }}>미국 대학 정보 센터</div>
          <div style={{ fontSize:'14px', color:'rgba(255,255,255,0.88)' }}>원본 표 + 국제학생 관점 분석 — 대학 배지를 클릭하면 상세 정보를 볼 수 있어요</div>
        </div>
      </div>

      {/* ── Tab Selector ── */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'24px', background:'#F0EFFE', borderRadius:'12px', padding:'6px' }}>
        {([['original','📋 원본 표 (수정 없음)'],['intl','🌏 국제학생 관점 분석'],['cds','📊 CDS 원본 (C7)']] as [Tab,string][]).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key as Tab)} style={{
            flex:1, padding:'10px 20px', borderRadius:'8px', border:'none', cursor:'pointer',
            fontWeight:700, fontSize:'13px', transition:'all 0.2s',
            background: tab === key ? '#FFFFFF' : 'transparent',
            color: tab === key ? '#4F46E5' : '#6B7280',
            boxShadow: tab === key ? '0 2px 8px rgba(79,70,229,0.15)' : 'none',
          }}>{label}</button>
        ))}
      </div>

      {/* ── TAB 1: 원본 표 ── */}
      {tab === 'original' && (
        <div>
          {/* Legend */}
          <div className="card" style={{ marginBottom:'20px', padding:'16px 20px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
              <div style={{ fontSize:'13px', fontWeight:700, color:'var(--text-primary)' }}>📌 범례</div>
              <div style={{ fontSize:'11.5px', color:'#6366F1', fontWeight:600 }}>💡 대학 배지를 클릭하면 상세 정보가 나와요</div>
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'16px', fontSize:'12.5px', color:'var(--text-body)' }}>
              <span><b style={{color:'#4F46E5'}}>T</b> = Test Required (SAT 필수)</span>
              <span><b style={{color:'#4F46E5'}}>숫자</b> = U.S. News National Ranking</span>
              <span><b style={{color:'#4F46E5'}}>N</b> = International Need Blind (외국인 재정지원 가능)</span>
              <span><b style={{color:'#4F46E5'}}>L숫자</b> = Liberal Arts College 랭킹 (별도 체계)</span>
            </div>
          </div>

          {/* Groups */}
          {originalGroups.map((g) => (
            <div key={g.group} className="card" style={{ marginBottom:'20px', padding:'0', overflow:'hidden' }}>
              <div style={{ background: g.color.bg, borderBottom: `1px solid ${g.color.border}`, padding:'14px 20px', display:'flex', alignItems:'center', gap:'12px' }}>
                <span style={{ background: g.color.badge, color:'#FFF', fontSize:'11px', fontWeight:800, padding:'3px 10px', borderRadius:'100px' }}>{g.group}</span>
                <span style={{ fontSize:'14px', fontWeight:700, color: g.color.label }}>{g.range}</span>
              </div>
              <div style={{ padding:'12px 16px', display:'flex', flexDirection:'column', gap:'10px' }}>
                {g.tiers.map((t, ti) => (
                  <div key={ti} style={{ display:'flex', gap:'12px', alignItems:'flex-start', padding:'10px 12px', background:'#FAFAF9', borderRadius:'10px', border:'1px solid #E5E7EB' }}>
                    <div style={{ minWidth:'72px', textAlign:'center' }}>
                      <div style={{ fontSize:'11px', fontWeight:800, color: g.color.label, background: g.color.bg, border:`1px solid ${g.color.border}`, borderRadius:'6px', padding:'3px 6px', marginBottom:'3px' }}>{t.tier}</div>
                      {t.range && <div style={{ fontSize:'10px', color:'#9CA3AF' }}>{t.range}</div>}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                        {t.schools.map((s, si) => {
                          const key = extractKey(s);
                          const hasData = !!schoolDB[key];
                          const isNeedBlind = s.includes(', N)') || s.endsWith(', N)') || / N\)$/.test(s);
                          const baseBg    = isNeedBlind ? '#FFFBEB' : '#FFFFFF';
                          const baseBorder = isNeedBlind
                            ? '1.5px solid #F59E0B'
                            : hasData ? `1.5px solid ${g.color.badge}` : `1px solid ${g.color.border}`;
                          const baseColor = isNeedBlind ? '#92400E' : hasData ? g.color.badge : '#1E1B4B';
                          return (
                            <button
                              key={si}
                              onClick={() => handleBadgeClick(s)}
                              style={{
                                fontSize:'12.5px',
                                background: baseBg,
                                border: baseBorder,
                                color: baseColor,
                                padding:'3px 10px', borderRadius:'100px', fontWeight: hasData ? 700 : 500,
                                cursor: hasData ? 'pointer' : 'default',
                                transition:'all 0.15s',
                                position:'relative',
                              }}
                              onMouseEnter={e => {
                                if (hasData) {
                                  (e.currentTarget as HTMLButtonElement).style.background = isNeedBlind ? '#F59E0B' : g.color.badge;
                                  (e.currentTarget as HTMLButtonElement).style.color = '#FFFFFF';
                                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
                                }
                              }}
                              onMouseLeave={e => {
                                if (hasData) {
                                  (e.currentTarget as HTMLButtonElement).style.background = baseBg;
                                  (e.currentTarget as HTMLButtonElement).style.color = baseColor;
                                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                                }
                              }}
                              title={hasData ? `${key} 상세 정보 보기` : '준비 중'}
                            >
                              {s}{hasData ? ' ↗' : ''}
                            </button>
                          );
                        })}
                      </div>
                      {t.note && <div style={{ marginTop:'6px', fontSize:'11.5px', color:'#6B7280', fontStyle:'italic' }}>💬 {t.note}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB 2: 국제학생 관점 ── */}
      {tab === 'intl' && (
        <div>
          <div style={{ background:'linear-gradient(135deg,#EEF2FF,#E0E7FF)', border:'1px solid #C7D2FE', borderRadius:'12px', padding:'16px 20px', marginBottom:'20px', display:'flex', gap:'12px' }}>
            <span style={{ fontSize:'22px' }}>🌏</span>
            <div>
              <div style={{ fontSize:'13px', fontWeight:700, color:'#3730A3', marginBottom:'4px' }}>국제학생(International Student) 기준 재분석</div>
              <div style={{ fontSize:'12.5px', color:'#4338CA', lineHeight:1.6 }}>
                꾸미는 파나마 거주 한국인 국제학생입니다. <b>전체 합격률 ≠ 국제학생 합격률</b>임을 반드시 확인해야 합니다.
                특히 Public 대학은 국제학생 합격률이 전체의 1/3~1/5 수준입니다.
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom:'20px', background:'linear-gradient(135deg,#FEF3C7,#FDE68A)', border:'1px solid #FCD34D', padding:'20px' }}>
            <div style={{ fontSize:'14px', fontWeight:800, color:'#92400E', marginBottom:'12px' }}>🏥 BS-MD 직행 프로그램 (꾸미 Pre-Med 목표에 핵심)</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'10px' }}>
              {bsMdPrograms.map((p, i) => (
                <div key={i} style={{ background:'rgba(255,255,255,0.7)', borderRadius:'10px', padding:'12px 14px', border:'1px solid #FCD34D' }}>
                  <div style={{ fontWeight:700, fontSize:'13px', color:'#78350F', marginBottom:'3px' }}>{p.school}</div>
                  <div style={{ display:'flex', gap:'8px', alignItems:'center', marginBottom:'4px' }}>
                    <span style={{ fontSize:'11px', background:'#92400E', color:'#FFF', padding:'2px 8px', borderRadius:'100px', fontWeight:700 }}>{p.program}</span>
                    <span style={{ fontSize:'11px', color:'#92400E', fontWeight:600 }}>{p.duration}</span>
                    <span style={{ fontSize:'11px', color:'#EF4444', fontWeight:700 }}>합격률 {p.intlRate}</span>
                  </div>
                  <div style={{ fontSize:'11.5px', color:'#78350F' }}>{p.note}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'180px 70px 90px 70px 70px 1fr', gap:'8px', padding:'8px 12px', background:'#EEF2FF', borderRadius:'8px', marginBottom:'8px', fontSize:'11px', fontWeight:700, color:'#3730A3' }}>
            <span>대학명</span><span>랭킹</span><span>국제학생 합격률</span><span>Need Blind</span><span>BS-MD</span><span>비고 / 주의사항</span>
          </div>

          {intlGroups.map((g, gi) => (
            <div key={gi} style={{ marginBottom:'20px' }}>
              <div style={{ background:g.color.bg, border:`1px solid ${g.color.border}`, borderRadius:'10px', padding:'10px 16px', marginBottom:'8px', display:'flex', alignItems:'center', gap:'10px' }}>
                <span style={{ width:'10px', height:'10px', borderRadius:'50%', background:g.color.dot, display:'inline-block', flexShrink:0 }}/>
                <span style={{ fontWeight:800, fontSize:'14px', color:g.color.label }}>난이도: {g.tier}</span>
                <span style={{ fontSize:'12px', color:g.color.label, opacity:0.8 }}>— {g.desc}</span>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
                {g.schools.map((s, si) => (
                  <div key={si} style={{
                    display:'grid', gridTemplateColumns:'180px 70px 90px 70px 70px 1fr',
                    gap:'8px', alignItems:'center', padding:'10px 12px',
                    background: s.warning ? 'rgba(254,226,226,0.5)' : '#FFFFFF',
                    border: s.warning ? '1px solid #FCA5A5' : '1px solid #E5E7EB',
                    borderRadius:'8px',
                  }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:'13px', color:'#1E1B4B' }}>{s.name}</div>
                      <div style={{ fontSize:'10px', color:'#9CA3AF', marginTop:'1px' }}>원본: {s.originalTier}</div>
                    </div>
                    <div style={{ fontSize:'12px', color:'#374151' }}>{s.rank}</div>
                    <div style={{ fontWeight:700, fontSize:'13px', color: si < 3 ? '#DC2626' : '#059669' }}>{s.intlRate}</div>
                    <div style={{ fontSize:'12px', textAlign:'center' }}>
                      {s.needBlind ? <span style={{ color:'#16A34A', fontWeight:700 }}>✅ Yes</span> : <span style={{ color:'#9CA3AF' }}>—</span>}
                    </div>
                    <div style={{ fontSize:'12px', textAlign:'center' }}>
                      {s.bsMd ? <span style={{ color:'#D97706', fontWeight:700 }}>🏥 있음</span> : <span style={{ color:'#9CA3AF' }}>—</span>}
                    </div>
                    <div>
                      {s.warning && <div style={{ fontSize:'11px', color:'#DC2626', fontWeight:600, marginBottom:'2px' }}>{s.warning}</div>}
                      <div style={{ fontSize:'11.5px', color:'#6B7280' }}>{s.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ background:'linear-gradient(135deg,#F0EFFE,#E0E7FF)', border:'1px solid #C7D2FE', borderRadius:'12px', padding:'20px', marginTop:'8px' }}>
            <div style={{ fontSize:'14px', fontWeight:700, color:'#3730A3', marginBottom:'10px' }}>📌 꾸미를 위한 핵심 요약</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', fontSize:'12.5px', color:'#4338CA' }}>
              {[
                { t:'🎯 현실적 전략', d:'Dream 2~3개 + Reach 4~5개 + Target 4~5개 + 국제 친화 Safety 2~3개로 구성 권장' },
                { t:'🏥 BS-MD 목표라면', d:'Brown PLME / Rice-Baylor / BU MMEDIC / Case Western PPSP 4곳 모두 지원 검토' },
                { t:'💰 재정지원 고려시', d:'Need-Blind 학교 우선: Harvard, Princeton, MIT, Yale, Dartmouth, Amherst, Bowdoin' },
                { t:'🚨 Public 대학 주의', d:'Michigan, UNC, UT Austin, Florida, UVA — 국제학생 합격률 & 재정지원 별도 확인 필수' },
              ].map((item, i) => (
                <div key={i} style={{ background:'rgba(255,255,255,0.6)', borderRadius:'8px', padding:'12px' }}>
                  <div style={{ fontWeight:700, marginBottom:'4px' }}>{item.t}</div>
                  {item.d}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: CDS 원본 ── */}
      {tab === 'cds' && (
        <div>
          {/* 헤더 안내 */}
          <div style={{ background:'linear-gradient(135deg,#F0FDF4,#DCFCE7)', border:'1px solid #86EFAC', borderRadius:'12px', padding:'16px 20px', marginBottom:'20px' }}>
            <div style={{ fontSize:'15px', fontWeight:800, color:'#14532D', marginBottom:'6px' }}>📊 Common Data Set (CDS) — Section C7</div>
            <div style={{ fontSize:'12.5px', color:'#166534', lineHeight:1.7 }}>
              CDS는 미국 대학들이 <b>매년 공개하는 공식 표준 데이터</b>입니다. Section C7은 <b>"Factors Used in Admission Decisions"</b>로,
              사정관이 각 항목을 얼마나 중요하게 보는지를 4단계로 공식 공개합니다.<br/>
              아래 표는 <b>2023-24년 CDS 기준</b>이며, 각 학교 공식 출처 링크를 함께 제공합니다.
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginTop:'12px' }}>
              {[['VI','Very Important','#DC2626','#FEF2F2','#FCA5A5'],['I','Important','#D97706','#FEF9C3','#FDE68A'],['C','Considered','#2563EB','#EFF6FF','#BFDBFE'],['NC','Not Considered','#9CA3AF','#F3F4F6','#E5E7EB']].map(([code,label,tc,bg,border])=>(
                <span key={code} style={{ display:'inline-flex', alignItems:'center', gap:'6px', background:bg, border:`1px solid ${border}`, borderRadius:'100px', padding:'3px 10px' }}>
                  <b style={{ fontSize:'11px', color:tc }}>{code}</b>
                  <span style={{ fontSize:'11px', color:'#374151' }}>{label}</span>
                </span>
              ))}
            </div>
          </div>

          {/* ── 수상이력 가이드 ── */}
          <div style={{ marginBottom:'20px', border:'1px solid #FDE68A', borderRadius:'12px', overflow:'hidden' }}>
            {/* 헤더 */}
            <div style={{ background:'linear-gradient(135deg,#78350F,#92400E)', padding:'14px 20px', display:'flex', alignItems:'center', gap:'10px' }}>
              <span style={{ fontSize:'20px' }}>🏆</span>
              <div>
                <div style={{ fontSize:'14px', fontWeight:800, color:'#FEF9C3' }}>수상이력 (Awards & Honors) — 실제로 얼마나 중요한가?</div>
                <div style={{ fontSize:'11.5px', color:'#FDE68A', marginTop:'2px' }}>수상의 "레벨"에 따라 입시 효과가 완전히 달라집니다</div>
              </div>
            </div>

            <div style={{ background:'#FFFBEB', padding:'20px' }}>
              {/* 피라미드 레벨 */}
              <div style={{ marginBottom:'20px' }}>
                <div style={{ fontSize:'12px', fontWeight:800, color:'#78350F', marginBottom:'10px', letterSpacing:'0.5px', textTransform:'uppercase' }}>📐 수상 레벨 피라미드</div>
                {[
                  {
                    level: 'Lv.5 국제 대회 수상',
                    color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE',
                    badge: '최강 차별화',
                    badgeBg: '#7C3AED',
                    examples: ['IMO (국제수학올림피아드) 수상', 'IPhO·IChO (국제물리·화학올림피아드)', 'Regeneron ISEF 1~3등', 'Google Code Jam 결선', 'ICPC 세계 결선'],
                    effect: '★★★ — MIT·Caltech·Harvard 지원 시 사정관 눈에 즉시 "이 학생은 다르다" 신호. 합격에 결정적',
                  },
                  {
                    level: 'Lv.4 전국 대회 상위 입상',
                    color: '#DC2626', bg: '#FEF2F2', border: '#FCA5A5',
                    badge: '강력한 강점',
                    badgeBg: '#DC2626',
                    examples: ['AMC 12 → AIME 고득점 (120점+)', 'USACO Gold/Platinum', 'National Merit Finalist', 'Intel STS / Regeneron STS 준결선 이상', 'AP Scholar with Distinction', 'Science Olympiad 전국 결선'],
                    effect: '★★★ — 전국 수준임을 증명. Top 10-20위권 대학 지원 시 실질적 플러스 요소. 단독보다 에세이와 연계하면 훨씬 강력',
                  },
                  {
                    level: 'Lv.3 주(State) / 지역 수준 수상',
                    color: '#D97706', bg: '#FEF9C3', border: '#FDE68A',
                    badge: '유효한 플러스',
                    badgeBg: '#D97706',
                    examples: ['주(State) 올림피아드 수상', 'Regional Science Fair 1위', 'DECA / FBLA State 수상', '콩쿠르 지역 1위 (음악·예술)', 'Speech & Debate 주 수준 입상'],
                    effect: '★★ — 좋은 플러스 요소지만 Top 10교는 전국 이상을 기대. Vanderbilt·Emory·Georgetown 수준에서 실질적 강점',
                  },
                  {
                    level: 'Lv.2 교외 / 학교 간 대회 수상',
                    color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE',
                    badge: '보조 역할',
                    badgeBg: '#2563EB',
                    examples: ['도시/카운티 수준 대회 수상', '학교 간 토론·에세이 대회 입상', '예술제 지역 수상', 'Scholastic Art & Writing Awards'],
                    effect: '★ — 있으면 좋지만 최상위권 대학에서는 차별화 요소가 되기 어려움. 활동 포트폴리오의 보조 역할',
                  },
                  {
                    level: 'Lv.1 교내 수상 (In-School)',
                    color: '#6B7280', bg: '#F3F4F6', border: '#D1D5DB',
                    badge: '거의 영향 없음',
                    badgeBg: '#6B7280',
                    examples: ['학교 내 최우수 학생상', '교내 에세이 대회 1위', 'Honor Roll / 학교 GPA 표창', '학교 내 음악·예술 공연상'],
                    effect: '— — Top 30위권 대학에서는 사실상 영향 없음. GPA와 중복 의미. 서류에 포함하려면 다른 활동과 묶어서 맥락 제시 필요',
                  },
                ].map((row, i) => (
                  <div key={i} style={{
                    display:'flex', gap:'12px', padding:'12px 14px', marginBottom:'6px',
                    background: row.bg, border: `1px solid ${row.border}`, borderRadius:'10px',
                    alignItems:'flex-start',
                  }}>
                    {/* 레벨 배지 */}
                    <div style={{ flexShrink:0, width:'130px' }}>
                      <div style={{ fontSize:'11px', fontWeight:800, color: row.color, marginBottom:'4px' }}>{row.level}</div>
                      <span style={{ fontSize:'10px', fontWeight:700, background: row.badgeBg, color:'#FFF', padding:'2px 8px', borderRadius:'100px' }}>{row.badge}</span>
                    </div>
                    {/* 예시 */}
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:'4px', marginBottom:'5px' }}>
                        {row.examples.map((ex,j) => (
                          <span key={j} style={{ fontSize:'11px', background:'rgba(255,255,255,0.7)', border:`1px solid ${row.border}`, borderRadius:'6px', padding:'2px 8px', color: row.color, fontWeight:600 }}>{ex}</span>
                        ))}
                      </div>
                      <div style={{ fontSize:'11.5px', color:'#374151', lineHeight:1.5 }}>{row.effect}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 꾸미 현실 가이드 */}
              <div style={{ background:'linear-gradient(135deg,#FEF3C7,#FDE68A)', border:'2px solid #F59E0B', borderRadius:'10px', padding:'14px 16px' }}>
                <div style={{ fontSize:'13px', fontWeight:800, color:'#78350F', marginBottom:'10px' }}>🎯 꾸미(파나마 국제학교 G11)에게 현실적인 수상 목표</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', fontSize:'12px' }}>
                  {[
                    {
                      icon: '🧪',
                      title: 'Pre-Med·화학 특화',
                      items: ['Regeneron STS 준결선 (고3)', 'Science Fair 지역→주 수준', 'AMC 12 → AIME 진출', '화학 올림피아드 학교 대표'],
                      note: 'JHU·Rice·WashU·Emory에 직접 효과',
                      color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE',
                    },
                    {
                      icon: '💡',
                      title: '현실적 단기 목표 (G11)',
                      items: ['AMC 10/12 응시 → AIME 도전', 'AP Chemistry/Biology 5점', 'USABO (생물올림피아드) 응시', 'Science Olympiad 팀 참가'],
                      note: 'G11에 지금 시작할 수 있는 것들',
                      color: '#059669', bg: '#ECFDF5', border: '#6EE7B7',
                    },
                    {
                      icon: '⭐',
                      title: '파나마 희소성 활용',
                      items: ['파나마·중미 지역 대회 수상', '라틴아메리카 과학 경진대회', '국제학교 대회 (PAUSD 등)', '한국 과학재단 해외 지원 프로그램'],
                      note: '파나마 출신이라 경쟁자가 거의 없음',
                      color: '#D97706', bg: '#FEF9C3', border: '#FDE68A',
                    },
                  ].map((box, i) => (
                    <div key={i} style={{ background:'rgba(255,255,255,0.7)', border:`1px solid ${box.border}`, borderRadius:'8px', padding:'10px 12px' }}>
                      <div style={{ fontSize:'16px', marginBottom:'4px' }}>{box.icon}</div>
                      <div style={{ fontSize:'11.5px', fontWeight:800, color: box.color, marginBottom:'6px' }}>{box.title}</div>
                      <div style={{ display:'flex', flexDirection:'column', gap:'2px', marginBottom:'6px' }}>
                        {box.items.map((item,j) => (
                          <div key={j} style={{ fontSize:'11px', color:'#374151' }}>• {item}</div>
                        ))}
                      </div>
                      <div style={{ fontSize:'10.5px', color: box.color, fontWeight:700, background: box.bg, borderRadius:'4px', padding:'3px 6px' }}>{box.note}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:'10px', fontSize:'11px', color:'#92400E', fontStyle:'italic' }}>
                  ※ 수상 자체보다 "왜 이 수상을 했는가 + 그 이후 무엇을 배웠는가"를 에세이에서 연결하는 것이 훨씬 중요합니다.
                </div>
              </div>
            </div>
          </div>

          {/* 테이블 — 가로 스크롤 */}
          <div style={{ background:'#FFFFFF', borderRadius:'12px', border:'1px solid #E5E7EB', overflow:'hidden' }}>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'11.5px' }}>
                <thead>
                  <tr style={{ background:'linear-gradient(135deg,#1E1B4B,#312E81)' }}>
                    <th style={{ padding:'10px 12px', textAlign:'left', color:'#C7D2FE', fontWeight:700, whiteSpace:'nowrap', position:'sticky', left:0, background:'#1E1B4B', zIndex:1, minWidth:'130px' }}>대학</th>
                    <th style={{ padding:'10px 8px', textAlign:'center', color:'#A5B4FC', fontWeight:600, whiteSpace:'nowrap', fontSize:'10px', minWidth:'44px' }}>티어</th>
                    {cdsFactorLabels.map(f=>(
                      <th key={f.key} style={{ padding:'6px 4px', textAlign:'center', color:'#C7D2FE', fontWeight:600, fontSize:'10px', minWidth:'44px', lineHeight:1.3, whiteSpace:'nowrap' }}>
                        <div>{f.labelKR}</div>
                        <div style={{ color:'#818CF8', fontSize:'9px', fontWeight:400 }}>{f.label.split(' ')[0]}</div>
                      </th>
                    ))}
                    <th style={{ padding:'10px 8px', textAlign:'center', color:'#A5B4FC', fontWeight:600, fontSize:'10px', minWidth:'52px' }}>SAT 정책</th>
                    <th style={{ padding:'10px 8px', textAlign:'center', color:'#FDE68A', fontWeight:700, fontSize:'10px', minWidth:'80px', borderLeft:'2px solid rgba(253,230,138,0.3)' }}>
                      ★ 수상이력<br/>
                      <span style={{ fontSize:'9px', fontWeight:400, color:'#A5B4FC' }}>(비공식 보조)</span>
                    </th>
                    <th style={{ padding:'10px 8px', textAlign:'center', color:'#A5B4FC', fontWeight:600, fontSize:'10px', minWidth:'52px' }}>출처</th>
                  </tr>
                </thead>
                <tbody>
                  {cdsGroup1.map((row, ri) => {
                    const tierColors: Record<string,{bg:string;text:string}> = {
                      '최상1': {bg:'#F5F3FF', text:'#5B21B6'},
                      '최상2': {bg:'#EEF2FF', text:'#3730A3'},
                      '상1':   {bg:'#DBEAFE', text:'#1E40AF'},
                      '상2':   {bg:'#E0F2FE', text:'#0369A1'},
                      '하단1': {bg:'#ECFDF5', text:'#065F46'},
                      '하단2': {bg:'#F0FDF4', text:'#14532D'},
                    };
                    const tc = tierColors[row.tier] || {bg:'#F9FAFB', text:'#374151'};
                    const cellStyle = (rating: CdsRating) => {
                      const map: Record<CdsRating,{bg:string;color:string;fw:number}> = {
                        'VI': {bg:'#FEE2E2',  color:'#DC2626', fw:800},
                        'I':  {bg:'#FEF9C3',  color:'#B45309', fw:700},
                        'C':  {bg:'#DBEAFE',  color:'#1D4ED8', fw:600},
                        'NC': {bg:'transparent', color:'#D1D5DB', fw:400},
                      };
                      return map[rating];
                    };
                    return (
                      <tr key={ri} style={{ background: ri%2===0 ? '#FFFFFF' : '#FAFAF9', borderBottom:'1px solid #F3F4F6' }}
                        onMouseEnter={e=>(e.currentTarget as HTMLTableRowElement).style.background='#F0EFFE'}
                        onMouseLeave={e=>(e.currentTarget as HTMLTableRowElement).style.background=ri%2===0 ? '#FFFFFF' : '#FAFAF9'}
                      >
                        <td style={{ padding:'8px 12px', fontWeight:700, color:'#1E1B4B', position:'sticky', left:0, background:'inherit', zIndex:1, borderRight:'1px solid #E5E7EB', whiteSpace:'nowrap' }}>
                          {row.school}
                        </td>
                        <td style={{ padding:'6px 4px', textAlign:'center' }}>
                          <span style={{ fontSize:'10px', fontWeight:700, color:tc.text, background:tc.bg, padding:'2px 6px', borderRadius:'100px', whiteSpace:'nowrap' }}>{row.tier}</span>
                        </td>
                        {cdsFactorLabels.map(f => {
                          const rating = row.factors[f.key];
                          const s = cellStyle(rating);
                          return (
                            <td key={f.key} style={{ padding:'6px 4px', textAlign:'center' }}>
                              <span style={{
                                display:'inline-block', fontSize:'10px', fontWeight:s.fw,
                                color: s.color, background: s.bg,
                                borderRadius:'4px', padding:'2px 5px',
                                minWidth:'28px', textAlign:'center',
                              }}>{rating}</span>
                            </td>
                          );
                        })}
                        <td style={{ padding:'6px 8px', textAlign:'center' }}>
                          <span style={{
                            fontSize:'10px', fontWeight:700,
                            color: row.satPolicy==='필수' ? '#DC2626' : row.satPolicy==='미반영' ? '#6B7280' : '#D97706',
                            background: row.satPolicy==='필수' ? '#FEE2E2' : row.satPolicy==='미반영' ? '#F3F4F6' : '#FEF9C3',
                            padding:'2px 6px', borderRadius:'100px',
                          }}>{row.satPolicy}</span>
                        </td>
                        <td style={{ padding:'6px 8px', textAlign:'center', borderLeft:'2px solid #FEF9C3' }}>
                          <div style={{ position:'relative', display:'inline-block' }}>
                            <span
                              title={row.awardsNote}
                              style={{
                                fontSize:'13px', fontWeight:800, cursor:'help',
                                color: row.awardsEmphasis==='★★★' ? '#B45309'
                                     : row.awardsEmphasis==='★★' ? '#6B7280'
                                     : row.awardsEmphasis==='★' ? '#9CA3AF' : '#D1D5DB',
                              }}
                            >{row.awardsEmphasis}</span>
                          </div>
                        </td>
                        <td style={{ padding:'6px 8px', textAlign:'center' }}>
                          <a href={row.sourceUrl} target="_blank" rel="noreferrer"
                            style={{ fontSize:'10px', color:'#4F46E5', fontWeight:600, textDecoration:'none' }}
                          >CDS↗</a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 주석 */}
          <div style={{ marginTop:'16px', background:'#F9FAFB', border:'1px solid #E5E7EB', borderRadius:'10px', padding:'14px 16px', fontSize:'11.5px', color:'#6B7280', lineHeight:1.7 }}>
            <b style={{ color:'#374151' }}>📌 출처 및 주의사항</b><br/>
            · 위 데이터는 각 대학이 공식 공개한 <b>2023-2024 Common Data Set</b> Section C7 기준입니다.<br/>
            · VI = Very Important / I = Important / C = Considered / NC = Not Considered<br/>
            · CDS 링크(↗)는 각 대학 IR(Institutional Research) 공식 페이지로 연결됩니다. 연도별 CDS PDF에서 정확한 수치를 확인하세요.<br/>
            · 실제 입시에서 각 요소의 상대적 가중치는 공개되지 않으며, 사정관 재량에 따라 적용됩니다.<br/>
            · <b style={{ color:'#B45309' }}>★ 수상이력 콼럼</b>은 CDS 공식 항목이 <b>아닙니다</b> — 입시 커다이즘/컨설팅 경험치 기반 비공식 보조 지표. ★★★ = 수상 매우 강력, ★★ = 유효, ★ = 보조 역할. <b>수상 셀에 마우스를 올리면 상세 설명이 표시</b>됩니다.
          </div>
        </div>
      )}

      {/* ── 모달: 학교 상세 정보 ── */}
      {selectedKey && (
        <div
          onClick={() => setSelectedKey(null)}
          style={{
            position:'fixed', inset:0, background:'rgba(15,10,40,0.55)',
            backdropFilter:'blur(4px)', zIndex:1000,
            display:'flex', alignItems:'center', justifyContent:'center',
            padding:'24px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              display:'flex', width:'100%', maxWidth:'780px',
              maxHeight:'88vh', borderRadius:'20px', overflow:'hidden',
              boxShadow:'0 24px 64px rgba(0,0,0,0.35)',
              animation:'modalIn 0.22s ease',
            }}
          >
            {selectedSchool ? (
              <>
                {/* ─ 왼쪽 패널 ─ */}
                <div style={{
                  width:'200px', flexShrink:0,
                  background: `linear-gradient(160deg, ${selectedSchool.color1}, ${selectedSchool.color2})`,
                  padding:'28px 20px',
                  display:'flex', flexDirection:'column', alignItems:'center',
                  justifyContent:'center', gap:'12px',
                }}>
                  <div style={{ fontSize:'52px', lineHeight:1 }}>{selectedSchool.emoji}</div>
                  <div style={{ fontSize:'18px', fontWeight:900, color:'#FFFFFF', textAlign:'center', lineHeight:1.3 }}>{selectedKey}</div>
                  <div style={{ fontSize:'11.5px', color:'rgba(255,255,255,0.8)', textAlign:'center', lineHeight:1.5 }}>{selectedSchool.fullName}</div>
                  <div style={{ width:'40px', height:'1px', background:'rgba(255,255,255,0.3)' }}/>
                  <div style={{ background:'rgba(255,255,255,0.2)', borderRadius:'100px', padding:'4px 12px', fontSize:'12px', fontWeight:700, color:'#FFF' }}>
                    {selectedSchool.applyTypes.join(' / ')}
                  </div>
                  {selectedSchool.needBlindIntl && (
                    <div style={{ background:'rgba(255,255,255,0.2)', borderRadius:'8px', padding:'6px 10px', fontSize:'11px', fontWeight:700, color:'#FFF', textAlign:'center' }}>
                      ✅ Need-Blind (국제학생)
                    </div>
                  )}
                  {selectedSchool.bsMd && (
                    <div style={{ background:'rgba(255,200,0,0.3)', borderRadius:'8px', padding:'6px 10px', fontSize:'11px', fontWeight:700, color:'#FFF', textAlign:'center' }}>
                      🏥 BS-MD 있음
                    </div>
                  )}
                </div>

                {/* ─ 오른쪽 패널 ─ */}
                <div style={{ flex:1, background:'#FFFFFF', overflowY:'auto', display:'flex', flexDirection:'column' }}>
                  {/* Header */}
                  <div style={{ padding:'20px 24px 16px', borderBottom:'1px solid #E5E7EB', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, background:'#FFF', zIndex:1 }}>
                    <div>
                      <div style={{ fontSize:'18px', fontWeight:800, color:'#1E1B4B' }}>{selectedSchool.fullName}</div>
                      <div style={{ fontSize:'12px', color:'#6B7280', marginTop:'2px' }}>📍 {selectedSchool.location} · {selectedSchool.type} · {selectedSchool.founded}</div>
                    </div>
                    <button onClick={() => setSelectedKey(null)} style={{ background:'#F3F4F6', border:'none', borderRadius:'50%', width:'32px', height:'32px', cursor:'pointer', fontSize:'16px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>✕</button>
                  </div>

                  {/* Content */}
                  <div style={{ padding:'20px 24px', display:'flex', flexDirection:'column', gap:'16px' }}>

                    {/* 위치 지도 */}
                    <Section title="📍 위치">
                      <USMapDot
                        x={selectedSchool.mapX}
                        y={selectedSchool.mapY}
                        label={selectedSchool.location}
                        color={selectedSchool.color1}
                      />
                    </Section>

                    {/* 기본 정보 */}
                    <Section title="🏫 기본 정보">
                      <InfoGrid items={[
                        { label:'학생 수', value: selectedSchool.size },
                        { label:'유형', value: selectedSchool.type },
                        { label:'설립', value: selectedSchool.founded },
                        { label:'지역', value: selectedSchool.location },
                      ]}/>
                    </Section>

                    {/* 입시 정보 */}
                    <Section title="🎯 입시 정보">
                      <div style={{ marginBottom:'8px', display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap' }}>
                        <span style={{
                          fontSize:'12px', fontWeight:700, padding:'4px 12px', borderRadius:'100px',
                          background: selectedSchool.satPolicy === '필수 제출' ? '#FEE2E2' : selectedSchool.satPolicy === '선택 제출' ? '#FEF3C7' : '#F3F4F6',
                          color: selectedSchool.satPolicy === '필수 제출' ? '#991B1B' : selectedSchool.satPolicy === '선택 제출' ? '#92400E' : '#6B7280',
                          border: `1px solid ${selectedSchool.satPolicy === '필수 제출' ? '#FCA5A5' : selectedSchool.satPolicy === '선택 제출' ? '#FCD34D' : '#D1D5DB'}`,
                        }}>
                          📝 SAT: {selectedSchool.satPolicy}
                        </span>
                      </div>
                      <InfoGrid items={[
                        { label:'전체 합격률', value: selectedSchool.acceptRate, highlight: true },
                        { label:'국제학생 합격률', value: selectedSchool.intlRate, highlight: true },
                        ...(selectedSchool.satPolicy !== '점수 미반영' ? [
                          { label:'SAT 범위 (공식)', value: selectedSchool.satRange },
                          { label:'SAT 범위 🇰🇷 (비공식 추정)', value: selectedSchool.satRangeKR, highlight: true as const },
                        ] : []),
                      ]}/>
                      {selectedSchool.satPolicy !== '점수 미반영' && (
                        <div style={{ marginTop:'6px', fontSize:'11px', color:'#6B7280', fontStyle:'italic', padding:'0 2px' }}>※ 비공식 추정치 — 국적별 합격자 SAT는 공개 데이터 없음. 한국 유학 커뮤니티·컨설턴트 경험 기반 경쟁력 권장 범위</div>
                      )}
                      {selectedSchool.satPolicy === '점수 미반영' && (
                        <div style={{ marginTop:'6px', fontSize:'12px', color:'#6B7280', background:'#F9FAFB', borderRadius:'8px', padding:'10px 12px', border:'1px solid #E5E7EB' }}>
                          ⚫ 이 학교는 SAT/ACT 점수를 입시 평가에 전혀 사용하지 않습니다. 제출 여부와 관계없이 점수가 합불에 영향 없음.
                        </div>
                      )}
                      <div style={{ marginTop:'4px', fontSize:'11.5px', color:'#374151', background:'#F0EFFE', borderRadius:'6px', padding:'6px 10px' }}>📌 지원 방식: <b>{selectedSchool.applyTypes.join(' / ')}</b></div>
                    </Section>


                    {/* 비용 & 재정 */}
                    <Section title="💰 비용 & 재정지원">
                      <InfoGrid items={[
                        { label:'연간 학비', value: selectedSchool.tuition },
                        { label:'연간 총 비용 (COA)', value: selectedSchool.coa },
                        { label:'Need-Blind (국제학생)', value: selectedSchool.needBlindIntl ? '✅ Yes — 합격 후 소득 기반 지원' : '❌ No (Need-Aware)' },
                        { label:'평균 재정지원 (전체 학생)', value: selectedSchool.avgAid },
                      ]}/>
                      <div style={{ marginTop:'8px', background:'linear-gradient(135deg,#FEF3C7,#FDE68A)', borderRadius:'8px', padding:'10px 12px', border:'1px solid #FCD34D' }}>
                        <div style={{ fontSize:'11px', fontWeight:700, color:'#92400E', marginBottom:'4px' }}>🇰🇷 한국 중산층 가정 추정 재정지원</div>
                        <div style={{ fontSize:'13px', fontWeight:700, color:'#78350F' }}>{selectedSchool.avgAidKR}</div>
                        <div style={{ fontSize:'10.5px', color:'#92400E', marginTop:'4px' }}>※ 연 소득 $100~150K + 한국 주거 자산 보유 기준 추정값. CSS Profile 제출 후 실제 산정됨</div>
                      </div>
                    </Section>

                    {/* Pre-Med */}
                    <Section title="🏥 Pre-Med 환경">
                      <div style={{ marginBottom:'8px', display:'flex', alignItems:'center', gap:'8px' }}>
                        <span style={{ fontSize:'12px', fontWeight:700, background: preMedColors[selectedSchool.preMedRating] + '20', color: preMedColors[selectedSchool.preMedRating], padding:'3px 10px', borderRadius:'100px', border:`1px solid ${preMedColors[selectedSchool.preMedRating]}40` }}>
                          Pre-Med 환경: {selectedSchool.preMedRating}
                        </span>
                        {selectedSchool.bsMd && (
                          <span style={{ fontSize:'12px', fontWeight:700, background:'#FEF3C7', color:'#92400E', padding:'3px 10px', borderRadius:'100px', border:'1px solid #FCD34D' }}>
                            🏥 BS-MD: {selectedSchool.bsMdProgram}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize:'12.5px', color:'#374151', lineHeight:1.7, background:'#F9FAFB', borderRadius:'8px', padding:'12px 14px' }}>
                        {selectedSchool.preMedNote}
                      </div>
                    </Section>

                    {/* 꾸미 한줄평 */}
                    <Section title="⭐ 꾸미를 위한 분석">
                      <div style={{
                        fontSize:'13px', color:'#1E1B4B', lineHeight:1.8,
                        background: `linear-gradient(135deg, ${selectedSchool.color1}15, ${selectedSchool.color2}10)`,
                        border: `1px solid ${selectedSchool.color1}30`,
                        borderRadius:'10px', padding:'14px 16px',
                      }}>
                        {selectedSchool.kkumiNote}
                      </div>
                    </Section>

                    {/* 파나마 포지셔닝 */}
                    <Section title="🌎 파나마 포지셔닝 효과">
                      <div style={{
                        fontSize:'13px', lineHeight:1.8,
                        background: 'linear-gradient(135deg,#ECFDF5,#D1FAE5)',
                        border: '2px solid #6EE7B7',
                        borderRadius:'10px', padding:'14px 16px',
                        color:'#064E3B',
                      }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px' }}>
                          <span style={{ fontSize:'10px', fontWeight:800, background:'#059669', color:'#FFF', padding:'2px 8px', borderRadius:'100px', letterSpacing:'0.5px' }}>PANAMA ADVANTAGE</span>
                          <span style={{ fontSize:'11px', color:'#065F46', fontWeight:600 }}>한국 국적 · 파나마 국제학교 출신 기준</span>
                        </div>
                        {selectedSchool.panamaNote}
                      </div>
                      <div style={{ marginTop:'6px', fontSize:'11px', color:'#6B7280', fontStyle:'italic', padding:'0 2px' }}>※ 국적(여권) = 한국 → 재정지원 CSS Profile 한국 기준 적용 / 학교 소재지 = 파나마 → 라틴아메리카 지역 사정관 평가</div>
                    </Section>

                    {/* 사정관 평가 기준 */}
                    <Section title="🎓 사정관이 중점적으로 보는 것">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {selectedSchool.evalCriteria.map((c, i) => {
                          const weightConfig = {
                            '핵심': { bg: '#FEF2F2', border: '#FCA5A5', badgeBg: '#DC2626', text: '#991B1B' },
                            '높음': { bg: '#FEF3C7', border: '#FCD34D', badgeBg: '#D97706', text: '#92400E' },
                            '중간': { bg: '#EFF6FF', border: '#BFDBFE', badgeBg: '#2563EB', text: '#1E40AF' },
                            '참고': { bg: '#F3F4F6', border: '#D1D5DB', badgeBg: '#6B7280', text: '#4B5563' },
                          }[c.weight];
                          return (
                            <div key={i} style={{
                              display: 'flex', alignItems: 'flex-start', gap: '10px',
                              background: weightConfig.bg, border: `1px solid ${weightConfig.border}`,
                              borderRadius: '8px', padding: '9px 12px',
                            }}>
                              <span style={{
                                fontSize: '10px', fontWeight: 800, whiteSpace: 'nowrap',
                                background: weightConfig.badgeBg, color: '#FFF',
                                padding: '2px 8px', borderRadius: '100px', marginTop: '1px', flexShrink: 0,
                              }}>{c.weight}</span>
                              <div>
                                <div style={{ fontSize: '12.5px', fontWeight: 700, color: weightConfig.text, marginBottom: '2px' }}>{c.label}</div>
                                <div style={{ fontSize: '11.5px', color: '#374151', lineHeight: 1.5 }}>{c.note}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ marginTop: '8px', fontSize: '11px', color: '#9CA3AF', fontStyle: 'italic' }}>
                        ※ Common App 기반 일반적 평가 가중치 — 실제 비율은 학교별·연도별 상이
                      </div>
                    </Section>

                    {/* 화학 섹션 */}
                    <Section title="⚗️ 화학 & 꾸미 적합도">
                      <div style={{
                        fontSize:'13px', color:'#064E3B', lineHeight:1.8,
                        background: 'linear-gradient(135deg,#D1FAE5,#ECFDF5)',
                        border: '1px solid #6EE7B7',
                        borderRadius:'10px', padding:'14px 16px',
                      }}>
                        {selectedSchool.chemNote}
                      </div>
                    </Section>
                  </div>
                </div>
              </>
            ) : (
              /* 데이터 없는 학교 */
              <div style={{ background:'#FFFFFF', borderRadius:'20px', padding:'40px', textAlign:'center', width:'100%' }}>
                <div style={{ fontSize:'48px', marginBottom:'16px' }}>🚧</div>
                <div style={{ fontSize:'18px', fontWeight:800, color:'#1E1B4B', marginBottom:'8px' }}>{selectedKey}</div>
                <div style={{ fontSize:'14px', color:'#6B7280', marginBottom:'20px' }}>이 학교의 상세 정보는 아직 준비 중입니다</div>
                <button onClick={() => setSelectedKey(null)} style={{ background:'#4F46E5', color:'#FFF', border:'none', borderRadius:'10px', padding:'10px 24px', fontWeight:700, cursor:'pointer' }}>닫기</button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ── 헬퍼 컴포넌트 ──
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize:'12px', fontWeight:800, color:'#6B7280', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:'8px' }}>{title}</div>
      {children}
    </div>
  );
}

function USMapDot({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return (
    <div style={{ borderRadius:'10px', overflow:'hidden', border:'1px solid #E5E7EB', position:'relative' }}>
      <div style={{
        position:'relative', width:'100%', paddingBottom:'62%',
        backgroundImage:'url(/us-map.png)',
        backgroundSize:'cover', backgroundPosition:'center',
        backgroundColor:'#F8FAFC',
      }}>
        {/* 도트 */}
        <div style={{
          position:'absolute',
          left: `${x}%`, top: `${y}%`,
          transform:'translate(-50%, -50%)',
          zIndex:2,
        }}>
          {/* 파동 효과 */}
          <div style={{
            position:'absolute', width:'24px', height:'24px',
            borderRadius:'50%', background: color + '40',
            top:'50%', left:'50%', transform:'translate(-50%,-50%)',
            animation:'ripple 1.8s ease-out infinite',
          }}/>
          {/* 도트 */}
          <div style={{
            width:'12px', height:'12px', borderRadius:'50%',
            background: color, border:'2.5px solid #FFFFFF',
            boxShadow:`0 2px 8px ${color}80`,
            position:'relative', zIndex:3,
          }}/>
        </div>
      </div>
      {/* 라벨 */}
      <div style={{ padding:'8px 12px', background:'#F9FAFB', borderTop:'1px solid #E5E7EB', display:'flex', alignItems:'center', gap:'8px' }}>
        <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:color, flexShrink:0 }}/>
        <span style={{ fontSize:'12px', fontWeight:600, color:'#374151' }}>{label}</span>
      </div>
      <style>{`
        @keyframes ripple {
          0%   { transform: translate(-50%,-50%) scale(0.8); opacity: 0.8; }
          100% { transform: translate(-50%,-50%) scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function InfoGrid({ items }: { items: { label: string; value: string; highlight?: boolean }[] }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
      {items.map((item, i) => (
        <div key={i} style={{ background:'#F9FAFB', borderRadius:'8px', padding:'10px 12px', border:'1px solid #E5E7EB' }}>
          <div style={{ fontSize:'10.5px', color:'#9CA3AF', fontWeight:600, marginBottom:'3px' }}>{item.label}</div>
          <div style={{ fontSize:'13.5px', fontWeight:700, color: item.highlight ? '#DC2626' : '#1E1B4B' }}>{item.value}</div>
        </div>
      ))}
    </div>
  );
}
