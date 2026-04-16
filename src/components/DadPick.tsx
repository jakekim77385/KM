'use client';

import { useState } from 'react';

// ============================================================
// 아빠선정 — 아빠가 직접 고른 꾸미 추천 대학 리스트
// ============================================================

type Priority = 'top' | 'strong' | 'backup';
type Reason = string;

type DadCollege = {
  id: string;
  name: string;
  shortName: string;
  location: string;
  priority: Priority;
  dadReason: Reason;
  dadMemo: string;
  estimatedCost: string;
  targetDeadline: string;
  badge: { label: string; color: string; bg: string; border: string };
  tags: string[];
};

const dadColleges: DadCollege[] = [
  // ─── Need-Blind 국제학생 — 노란색 마킹 순서 ───────────────────────────
  // 최상 1
  {
    id: 'mit',
    name: 'Massachusetts Institute of Technology',
    shortName: 'MIT',
    location: 'Cambridge, MA',
    priority: 'top',
    dadReason: 'STEM + Pre-Med 세계 최고. Need-blind. EA 도전 필수.',
    dadMemo: 'EA 11월 1일. 연구·창의성 차별화 없으면 어려움. 도전 가치 있음.',
    estimatedCost: '$83,000/년 (장학금 후 대폭 ↓)',
    targetDeadline: '11월 1일 (EA)',
    badge: { label: 'Need-Blind', color: '#34D399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)' },
    tags: ['Need-Blind 🌐', 'STEM 세계 1위', '드림'],
  },
  // 최상 2
  {
    id: 'yale',
    name: 'Yale University',
    shortName: 'Yale',
    location: 'New Haven, CT',
    priority: 'top',
    dadReason: 'Need-blind 국제학생. Yale Med 연계. 인문·과학 융합 교육.',
    dadMemo: 'REA(제한 EA) 11월 1일. 에세이 Why Yale 중요.',
    estimatedCost: '$83,000/년 (장학금 후 대폭 ↓)',
    targetDeadline: '11월 1일 (REA)',
    badge: { label: 'Need-Blind', color: '#34D399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)' },
    tags: ['Need-Blind 🌐', 'Yale Med 연계', '드림'],
  },
  {
    id: 'harvard',
    name: 'Harvard University',
    shortName: 'Harvard',
    location: 'Cambridge, MA',
    priority: 'top',
    dadReason: 'Pre-Med 진학률 85%+. Need-blind. 꾸미 SAT·GPA 조건 충족.',
    dadMemo: 'EA 11월 1일. 독보적 스토리가 당락 결정.',
    estimatedCost: '$83,000/년 (장학금 후 대폭 ↓)',
    targetDeadline: '11월 1일 (EA)',
    badge: { label: 'Need-Blind', color: '#34D399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)' },
    tags: ['Need-Blind 🌐', 'Pre-Med 최강', '드림'],
  },
  {
    id: 'princeton',
    name: 'Princeton University',
    shortName: 'Princeton',
    location: 'Princeton, NJ',
    priority: 'top',
    dadReason: '세계 랭킹 1위. Need-blind 국제학생. 합격하면 실질 부담 가장 낮을 수 있음.',
    dadMemo: '지원서 한 줄 한 줄이 차별화 포인트. RD Only — 1월 1일 마감.',
    estimatedCost: '$83,000/년 (장학금 후 대폭 ↓)',
    targetDeadline: '1월 1일 (RD)',
    badge: { label: 'Need-Blind', color: '#34D399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)' },
    tags: ['Need-Blind 🌐', '세계 1위', '드림'],
  },
  // 상 1
  {
    id: 'brown',
    name: 'Brown University (+ PLME 옵션)',
    shortName: 'Brown / PLME',
    location: 'Providence, RI',
    priority: 'strong',
    dadReason: 'Need-blind(2025~). PLME 지원 시 의대 보장. 인문의학 융합.',
    dadMemo: 'PLME = ED1 11월 1일. 일반 Brown = RD 1월 1일. 두 트랙 검토.',
    estimatedCost: '$85,000/년 (장학금 후 ↓)',
    targetDeadline: '11월 1일 (ED/PLME)',
    badge: { label: 'Need-Blind', color: '#34D399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)' },
    tags: ['Need-Blind 🌐', 'BS/MD 보장(PLME)', '강력추천'],
  },
  // 상 2
  {
    id: 'dartmouth',
    name: 'Dartmouth College',
    shortName: 'Dartmouth',
    location: 'Hanover, NH',
    priority: 'strong',
    dadReason: 'Need-blind. 아이비 중 Pre-Med 비율 높음. Geisel Med 연계.',
    dadMemo: 'ED 11월 1일. 소규모 아이비, 인간관계 네트워크 강점.',
    estimatedCost: '$83,000/년 (장학금 후 ↓)',
    targetDeadline: '11월 1일 (ED)',
    badge: { label: 'Need-Blind', color: '#34D399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)' },
    tags: ['Need-Blind 🌐', '아이비리그', 'Geisel Med'],
  },
  // 하단 1
  {
    id: 'amherst',
    name: 'Amherst College',
    shortName: 'Amherst',
    location: 'Amherst, MA',
    priority: 'backup',
    dadReason: 'Need-blind. 리버럴아츠 Top 2. 소수정예 Pre-Med 환경 우수.',
    dadMemo: 'ED 11월 1일. 리버럴아츠이므로 의대 진학 경로 확인 필요.',
    estimatedCost: '$83,000/년 (장학금 후 ↓)',
    targetDeadline: '11월 1일 (ED)',
    badge: { label: 'Need-Blind', color: '#34D399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)' },
    tags: ['Need-Blind 🌐', '리버럴아츠 2위', '소수정예'],
  },
  // 하단 2
  {
    id: 'bowdoin',
    name: 'Bowdoin College',
    shortName: 'Bowdoin',
    location: 'Brunswick, ME',
    priority: 'backup',
    dadReason: 'Need-blind. 리버럴아츠 Top 5. Pre-Med 지원 강력. 아름다운 캠퍼스.',
    dadMemo: 'ED 11월 15일. 소규모 밀착 교육. 안전 옵션으로 적합.',
    estimatedCost: '$83,000/년 (장학금 후 ↓)',
    targetDeadline: '11월 15일 (ED)',
    badge: { label: 'Need-Blind', color: '#34D399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.3)' },
    tags: ['Need-Blind 🌐', '리버럴아츠 5위', '안전'],
  },
  // ─── BS/MD 특별 프로그램 ───────────────────────────────────────
  {
    id: 'wcm-qatar',
    name: 'Weill Cornell Medicine — Qatar',
    shortName: 'WCM-Q',
    location: 'Doha, Qatar',
    priority: 'strong',
    dadReason: 'Qatar 재단 전액지원. 6년 통합 MD 프로그램. 학비·생활비 전액 무료. Cornell 학위 취득.',
    dadMemo: '미국 의대(Cornell Weill MD) 학위. USMLE 응시 가능. 중동 네트워크 + Cornell 브랜드.',
    estimatedCost: '전액 무료 (Qatar 재단 지원)',
    targetDeadline: '2월 1일 (RD)',
    badge: { label: 'BS/MD', color: '#818CF8', bg: 'rgba(129,140,248,0.12)', border: 'rgba(129,140,248,0.3)' },
    tags: ['6년 통합 MD', 'Cornell 학위', 'USMLE 가능', '학비 무료'],
  },
  {
    id: 'cwru-ppsp',
    name: 'Case Western Reserve University — PPSP',
    shortName: 'CWRU PPSP',
    location: 'Cleveland, OH',
    priority: 'strong',
    dadReason: 'BS/MD 8년 직행. CWRU Med 보장. Merit 장학금 $20K+ 가능. 국제학생 지원 확인됨.',
    dadMemo: 'ED 11월 1일. admission@case.edu에 PPSP 국제학생 조건 문의 필수. Merit 장학금으로 실납부 ↓',
    estimatedCost: '~$55,000/년 (Merit 후)',
    targetDeadline: '11월 1일 (ED)',
    badge: { label: 'BS/MD', color: '#818CF8', bg: 'rgba(129,140,248,0.12)', border: 'rgba(129,140,248,0.3)' },
    tags: ['BS/MD 8년 보장', 'Merit 장학금', '국제학생 지원 가능'],
  },
];


const priorityConfig: Record<Priority, { label: string; color: string; bg: string; border: string }> = {
  top:    { label: '⭐ 최우선', color: '#F59E0B', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.25)' },
  strong: { label: '🚀 강력추천', color: '#A78BFA', bg: 'rgba(167,139,250,0.09)', border: 'rgba(167,139,250,0.22)' },
  backup: { label: '🛡️ 백업', color: '#60A5FA', bg: 'rgba(96,165,250,0.09)', border: 'rgba(96,165,250,0.22)' },
};


export default function DadPick() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div>
      {/* 헤더 배너 */}
      <div className="card card-gold animate-in" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', flexShrink: 0,
          }}>👨</div>
          <div>
            <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--gold-400)' }}>아빠 검토중 대학 리스트</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              꾸미를 위해 아빠가 검토 중인 대학 & 전략 메모
            </div>
          </div>
        </div>


      </div>


      {/* 카드 목록 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {dadColleges.map(college => {
          const pc = priorityConfig[college.priority];
          const isOpen = expandedId === college.id;
          return (
            <div
              key={college.id}
              id={`dadpick-card-${college.id}`}
              className="card animate-in"
              style={{
                border: `1px solid ${pc.border}`,
                background: pc.bg,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onClick={() => setExpandedId(isOpen ? null : college.id)}
            >
              {/* 카드 헤더 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                  {/* 뱃지 */}
                  <div style={{
                    padding: '3px 9px', borderRadius: '6px', fontSize: '11px', fontWeight: 700,
                    color: college.badge.color, background: college.badge.bg,
                    border: `1px solid ${college.badge.border}`, flexShrink: 0,
                    letterSpacing: '0.01em',
                  }}>
                    {college.badge.label}
                  </div>

                  {/* 이름 */}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {college.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>
                      📍 {college.location} · 마감 {college.targetDeadline}
                    </div>
                  </div>
                </div>

                {/* 화살표 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                  <div style={{
                    width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-muted)', transition: 'transform 0.2s',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                  }}>▾</div>
                </div>
              </div>

              {/* 태그 */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' }}>
                {college.tags.map((tag, i) => (
                  <span key={i} style={{
                    fontSize: '10px', padding: '2px 8px', borderRadius: '100px', fontWeight: 600,
                    background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)',
                    border: '1px solid rgba(255,255,255,0.09)',
                  }}>
                    {tag}
                  </span>
                ))}
                <span style={{
                  fontSize: '10px', padding: '2px 8px', borderRadius: '100px', fontWeight: 600,
                  background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)',
                  border: '1px solid rgba(255,255,255,0.09)',
                }}>
                  💰 {college.estimatedCost}
                </span>
              </div>

              {/* 확장 영역 */}
              {isOpen && (
                <div
                  className="animate-in"
                  style={{ marginTop: '14px', paddingTop: '14px', borderTop: `1px solid ${pc.border}` }}
                  onClick={e => e.stopPropagation()}
                >
                  {/* 아빠 선정 이유 */}
                  <div style={{
                    padding: '12px', borderRadius: '8px', marginBottom: '10px',
                    background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.18)',
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#F59E0B', marginBottom: '6px' }}>
                      💬 아빠가 이 학교를 고른 이유
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {college.dadReason}
                    </div>
                  </div>

                  {/* 아빠 메모 */}
                  <div style={{
                    padding: '12px', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                      📝 아빠 메모
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {college.dadMemo}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 하단 아빠 메시지 */}
      <div style={{
        marginTop: '20px', padding: '16px 18px',
        background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(167,139,250,0.06))',
        borderRadius: '12px', border: '1px solid rgba(245,158,11,0.2)',
      }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#F59E0B', marginBottom: '8px' }}>
          👨 아빠의 한마디
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          꾸미야, 아빠가 고른 학교들은 전부 <strong style={{ color: '#F59E0B' }}>국제학생 Need-Blind</strong>야 —
          합격하면 재정지원을 제대로 받을 수 있는 학교들이야. MIT · Yale · Harvard · Princeton은
          드림이지만 충분히 도전할 SAT·GPA야. Brown PLME는 의대 보장 + Need-blind 최고의 조합이고,
          Amherst · Bowdoin은 안전하게 장학금 받을 수 있는 백업이야. 아빠는 믿어. 💛
        </div>
      </div>
    </div>
  );
}
