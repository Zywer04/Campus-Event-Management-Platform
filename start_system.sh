#!/bin/bash

echo "========================================"
echo "校园活动管理系统启动脚本"
echo "========================================"
echo

echo "正在启动后端服务器..."
cd backend
gnome-terminal --title="Backend Server" -- bash -c "python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000; exec bash" &
cd ..

echo "等待后端服务器启动..."
sleep 3

echo "正在启动前端开发服务器..."
gnome-terminal --title="Frontend Server" -- bash -c "npm run dev; exec bash" &

echo
echo "========================================"
echo "系统启动完成！"
echo "========================================"
echo
echo "前端地址: http://localhost:5173"
echo "后端地址: http://localhost:8000"
echo "API文档: http://localhost:8000/docs"
echo
echo "请保持这两个终端窗口打开，关闭窗口将停止服务。"
echo

# 等待用户按任意键退出
read -p "按任意键退出..." -n 1 -r
echo 