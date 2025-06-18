@echo off
echo ========================================
echo 校园活动管理系统启动脚本
echo ========================================
echo.

echo 正在启动后端服务器...
cd backend
start "Backend Server" cmd /k "python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"
cd ..

echo 等待后端服务器启动...
timeout /t 3 /nobreak > nul

echo 正在启动前端开发服务器...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo 系统启动完成！
echo ========================================
echo.
echo 前端地址: http://localhost:5173
echo 后端地址: http://localhost:8000
echo API文档: http://localhost:8000/docs
echo.
echo 请保持这两个窗口打开，关闭窗口将停止服务。
echo.
pause 