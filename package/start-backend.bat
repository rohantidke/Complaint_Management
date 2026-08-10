@echo off
title Complaint Management - Backend

echo ==========================================
echo   Complaint Management System - Backend
echo ==========================================
echo.

cd /d "%~dp0backend"

echo Starting Spring Boot backend...
echo.

java -jar management-system-0.0.1-SNAPSHOT.jar

pause