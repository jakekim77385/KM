'use client';

import { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import Profile from '@/components/Profile';
import CollegeList from '@/components/CollegeList';
import KoreanColleges from '@/components/KoreanColleges';
import Timeline from '@/components/Timeline';
import EssayManager from '@/components/EssayManager';
import ApplicationTracker from '@/components/ApplicationTracker';
import Financial from '@/components/Financial';

type PageKey = 'dashboard' | 'profile' | 'colleges' | 'korean' | 'timeline' | 'essays' | 'tracker' | 'financial';

const navItems = [
  { key: 'dashboard' as PageKey, icon: '🏠', label: '홈 대시보드', section: 'MAIN' },
  { key: 'profile' as PageKey, icon: '👩‍🎓', label: '내 프로필', section: 'ACADEMICS' },
  { key: 'colleges' as PageKey, icon: '🏛️', label: '미국 대학 리스트', section: 'ACADEMICS' },
  { key: 'korean' as PageKey, icon: '🇰🇷', label: '한국 특례 (의대)', section: 'ACADEMICS' },
  { key: 'timeline' as PageKey, icon: '📅', label: '타임라인', section: 'PLANNING' },
  { key: 'essays' as PageKey, icon: '✍️', label: '에세이 매니저', section: 'PLANNING' },
  { key: 'tracker' as PageKey, icon: '📊', label: '지원 현황', section: 'PLANNING' },
  { key: 'financial' as PageKey, icon: '💰', label: '재정 & 장학금', section: 'RESOURCES' },
];

const sectionOrder = ['MAIN', 'ACADEMICS', 'PLANNING', 'RESOURCES'];
const sectionLabels: Record<string, string> = {
  MAIN: '메인',
  ACADEMICS: '학업',
  PLANNING: '플래닝',
  RESOURCES: '리소스',
};

const pageTitles: Record<PageKey, { title: string; subtitle: string }> = {
  dashboard: { title: '🏠 대시보드', subtitle: '꾸미의 대학 진학 여정 한눈에 보기' },
  profile:   { title: '👩‍🎓 내 프로필', subtitle: 'Kim Jiyun · Balboa Academy · 11th Grade' },
  colleges:  { title: '🏛️ 미국 대학 리스트', subtitle: 'BS/MD 직행 + STEM Pre-Med 관심 대학' },
  korean:    { title: '🇰🇷 한국 특례 입시', subtitle: '재외국민 특별전형 3년 특례 — 의대 / 이공계' },
  timeline:  { title: '📅 타임라인', subtitle: '2025 ~ 2027 입시 로드맵' },
  essays:    { title: '✍️ 에세이 매니저', subtitle: 'Common App & Supplemental Essays' },
  tracker:   { title: '📊 지원 현황 트래커', subtitle: '학교별 지원 상태 및 서류 체크' },
  financial: { title: '💰 재정 & 장학금', subtitle: '학비 비교 및 장학금 정보' },
};

export default function Home() {
  const [activePage, setActivePage] = useState<PageKey>('dashboard');
  const [currentDate, setCurrentDate] = useState('');

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
          <div style={{ color: 'var(--gold-400)', fontWeight: 600, fontSize: '12px', marginBottom: '4px' }}>
            ⭐ SAT 1570 · GPA 4.0
          </div>
          <div>Class of 2027 Applicant</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="page-header">
          <div>
            <div className="page-header-title">{pageInfo.title}</div>
            <div className="page-header-subtitle">{pageInfo.subtitle}</div>
          </div>
          <div className="header-actions">
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {currentDate}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--gold-400)', marginTop: '2px' }}>
                🎯 지원까지 D-{Math.ceil((new Date('2026-11-01').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}일 (EA 기준)
              </div>
            </div>
          </div>
        </header>

        <div className="page-body">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
