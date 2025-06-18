#!/bin/bash

echo "启动校园活动管理平台..."

echo ""
echo "1. 启动后端服务..."
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

echo ""
echo "2. 等待后端服务启动..."
sleep 3

echo ""
echo "3. 启动前端服务..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo ""
echo "服务启动完成！"
echo "前端地址: http://localhost:5173"
echo "后端地址: http://localhost:8000"
echo "API文档: http://localhost:8000/docs"
echo ""
echo "按 Ctrl+C 停止服务..."

# 等待用户中断
trap "echo '正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait 