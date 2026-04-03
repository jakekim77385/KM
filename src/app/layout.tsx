import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "꾸미의 대학 진학 플래너 | Jiyun Kim College Dashboard",
  description: "김지윤(꾸미)의 미국 대학 진학을 위한 개인 맞춤형 플래너. SAT, GPA, 대학 리스트, 에세이, 타임라인을 한눈에 관리하세요.",
  keywords: "college application, SAT, GPA, Balboa Academy, US university",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
