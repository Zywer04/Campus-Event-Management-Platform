@echo off
echo 启动校园活动管理平台...

echo.
echo 1. 启动后端服务...
cd backend
start "Backend Server" cmd /k "uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo.
echo 2. 等待后端服务启动...
timeout /t 3 /nobreak > nul

echo.
echo 3. 启动前端服务...
cd ..
start "Frontend Server" cmd /k "npm run dev"

echo.
echo 服务启动完成！
echo 前端地址: http://localhost:5173
echo 后端地址: http://localhost:8000
echo API文档: http://localhost:8000/docs
echo.
echo 按任意键退出...
pause > nul 