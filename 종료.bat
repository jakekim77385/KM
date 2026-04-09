@echo off
title 꾸미 대학 플랫폼 종료
echo 꾸미 대학 플랫폼 서버를 종료합니다...

:: 포트 3000을 사용 중인 프로세스 찾아서 종료
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000 "') do (
    taskkill /PID %%a /F >nul 2>&1
)

echo 서버가 종료되었습니다.
timeout /t 2 >nul
