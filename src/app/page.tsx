'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
import Profile from '@/components/Profile';
import USCollegeInfo from '@/components/USCollegeInfo';
import CollegeList from '@/components/CollegeList';
import KoreanColleges from '@/components/KoreanColleges';
import Timeline from '@/components/Timeline';
import EssayManager from '@/components/EssayManager';
import ApplicationTracker from '@/components/ApplicationTracker';
import Financial from '@/components/Financial';
import ActivityPortfolio from '@/components/ActivityPortfolio';

type PageKey = 'dashboard' | 'profile' | 'activities' | 'usinfo' | 'colleges' | 'korean' | 'timeline' | 'essays' | 'tracker' | 'financial';

const navItems = [
  { key: 'dashboard' as PageKey, icon: '🏠', label: '홈 대시보드', section: 'MAIN' },
  { key: 'profile' as PageKey, icon: '👩‍🎓', label: '내 프로필', section: 'ACADEMICS' },
  { key: 'activities' as PageKey, icon: '🌟', label: '활동 포트폴리오', section: 'ACADEMICS' },
  { key: 'usinfo' as PageKey, icon: '🔍', label: '대학 정보 센터', section: 'US_INFO' },
  { key: 'colleges' as PageKey, icon: '🏛️', label: '미국 대학 리스트', section: 'US_INFO' },
  { key: 'timeline' as PageKey, icon: '📅', label: '타임라인', section: 'PLANNING' },
  { key: 'essays' as PageKey, icon: '✍️', label: '에세이 매니저', section: 'PLANNING' },
  { key: 'tracker' as PageKey, icon: '📊', label: '지원 현황', section: 'PLANNING' },
  { key: 'financial' as PageKey, icon: '💰', label: '재정 & 장학금', section: 'RESOURCES' },
  { key: 'korean' as PageKey, icon: '🇰🇷', label: '한국 특례 (의대)', section: 'MISC' },
];

const sectionOrder = ['MAIN', 'ACADEMICS', 'US_INFO', 'PLANNING', 'RESOURCES', 'MISC'];
const sectionLabels: Record<string, string> = {
  MAIN: '메인',
  ACADEMICS: '학업',
  US_INFO: '미국 대학 정보',
  PLANNING: '플래닝',
  RESOURCES: '리소스',
  MISC: '기타',
};

const pageTitles: Record<PageKey, { title: string; subtitle: string }> = {
  dashboard: { title: '🏠 대시보드', subtitle: '꾸미의 대학 진학 여정 한눈에 보기' },
  profile:   { title: '👩‍🎓 내 프로필', subtitle: 'Kim Jiyun · Balboa Academy · 11th Grade' },
  usinfo:    { title: '🔍 미국 대학 정보 센터', subtitle: '합격률 · 학비 · BS-MD 트랙 등 심층 분석' },
  colleges:  { title: '🏛️ 미국 대학 리스트', subtitle: 'BS/MD 직행 + STEM Pre-Med 관심 대학' },
  activities: { title: '🌟 활동 포트폴리오', subtitle: 'Heartitude 프로젝트 · 학문 대회 · Pre-Med 경험 관리' },
  korean:    { title: '🇰🇷 한국 특례 입시', subtitle: '재외국민 특별전형 3년 특례 — 의대 / 이공계' },
  timeline:  { title: '📅 타임라인', subtitle: '2025 ~ 2027 입시 로드맵' },
  essays:    { title: '✍️ 에세이 매니저', subtitle: 'Common App & Supplemental Essays' },
  tracker:   { title: '📊 지원 현황 트래커', subtitle: '학교별 지원 상태 및 서류 체크' },
  financial: { title: '💰 재정 & 장학금', subtitle: '학비 비교 및 장학금 정보' },
};

export default function Home() {
  const router = useRouter();
  const [activePage, setActivePage] = useState<PageKey>('dashboard');
  const [currentDate, setCurrentDate] = useState('');

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now.toLocaleDateString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
    }));
  }, []);

  const grouped = sectionOrder.map(section => ({
    section,
    label: sectionLabels[section],
    items: navItems.filter(n => n.section === section),
  }));

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard onNavigate={setActivePage} />;
      case 'profile':   return <Profile />;
      case 'activities': return <ActivityPortfolio />;
      case 'usinfo':    return <USCollegeInfo />;
      case 'colleges':  return <CollegeList />;
      case 'korean':    return <KoreanColleges />;
      case 'timeline':  return <Timeline />;
      case 'essays':    return <EssayManager />;
      case 'tracker':   return <ApplicationTracker />;
      case 'financial': return <Financial />;
      default:          return <Dashboard onNavigate={setActivePage} />;
    }
  };

  const pageInfo = pageTitles[activePage];

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-title">꾸미의 대학 플래너</div>
          <div className="logo-subtitle">College Journey 2027</div>
        </div>

        <div className="sidebar-profile">
          <div className="profile-avatar">꾸</div>
          <div className="profile-info">
            <div className="profile-name">김지윤 (꾸미)</div>
            <div className="profile-grade">Balboa Academy · G11</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {grouped.map(({ section, label, items }) => (
            <div key={section}>
              <div className="nav-section-label">{label}</div>
              {items.map(item => (
                <button
                  key={item.key}
                  className={`nav-item ${activePage === item.key ? 'active' : ''}`}
                  onClick={() => setActivePage(item.key)}
                  id={`nav-${item.key}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div style={{ color: 'var(--indigo-600)', fontWeight: 600, fontSize: '12px', marginBottom: '4px' }}>
            ⭐ SAT 1570 · GPA 4.0
          </div>
          <div style={{ color: 'var(--text-muted)' }}>Class of 2027 Applicant</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="page-header">
          <div>
            <div className="page-header-title">{pageInfo.title}</div>
            <div className="page-header-subtitle">{pageInfo.subtitle}</div>
          </div>
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-body)', fontWeight: 500 }}>
                {currentDate}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--indigo-600)', marginTop: '2px', fontWeight: 600 }}>
                🎯 지원까지 D-{Math.ceil((new Date('2026-11-01').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}일 (EA 기준)
              </div>
            </div>
            <button
              id="logout-btn"
              onClick={handleLogout}
              style={{
                padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)',
                fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.15s', whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = 'rgba(239,68,68,0.12)'; (e.target as HTMLButtonElement).style.color = '#FCA5A5'; (e.target as HTMLButtonElement).style.borderColor = 'rgba(239,68,68,0.3)'; }}
              onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; (e.target as HTMLButtonElement).style.color = 'var(--text-muted)'; (e.target as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)'; }}
            >
              🔓 로그아웃
            </button>
          </div>
        </header>

        <div className="page-body">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
