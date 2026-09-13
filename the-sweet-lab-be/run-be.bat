@echo off
chcp 65001 > nul
echo ===================================================
echo   Khởi chạy The Sweet Lab - Spring Boot Backend
echo ===================================================

:: Kiểm tra và thiết lập JDK 21
if exist "C:\Program Files\Java\jdk-21" (
    set "JAVA_HOME=C:\Program Files\Java\jdk-21"
    set "PATH=C:\Program Files\Java\jdk-21\bin;%PATH%"
    echo [OK] Đã chọn JDK 21 tại: C:\Program Files\Java\jdk-21
) else (
    echo [INFO] Sử dụng JAVA_HOME hiện tại: %JAVA_HOME%
)

:: Kiểm tra Docker containers
echo [INFO] Kiểm tra các dịch vụ cơ sở dữ liệu Docker...
docker ps --filter "name=sweet_lab_postgres" --format "{{.Names}}: {{.Status}}"

echo [INFO] Đang khởi chạy Spring Boot...
.\mvnw.cmd spring-boot:run
