@echo off
REM Start the backend using Java 17 even if the system java points to Java 8.
set "JAVA_HOME=C:\Program Files\Java\jdk-17"
if not exist "%JAVA_HOME%\bin\java.exe" (
  echo ERROR: Java 17 not found at %JAVA_HOME%
  echo Please install JDK 17 or update this script to the correct JDK path.
  exit /b 1
)
set "PATH=%JAVA_HOME%\bin;%PATH%"
cd /d "%~dp0"
call mvnw.cmd spring-boot:run
