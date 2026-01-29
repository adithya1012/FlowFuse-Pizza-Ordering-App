#!/bin/bash

# Pizza Ordering Application - Quick Start Script
# This script helps you start the application with Docker Compose

set -e  # Exit on error

echo "🍕 Pizza Ordering Application - Docker Deployment"
echo "=================================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running"
    echo "Please start Docker Desktop and try again"
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: docker-compose is not installed"
    echo "Please install Docker Compose and try again"
    exit 1
fi

echo "✅ docker-compose is available"
echo ""

# Parse command line arguments
COMMAND="${1:-up}"

case $COMMAND in
    up)
        echo "🚀 Starting Pizza Ordering Application..."
        echo ""
        echo "This will:"
        echo "  1. Build frontend and backend Docker images"
        echo "  2. Pull MySQL image"
        echo "  3. Create network and volumes"
        echo "  4. Start all services"
        echo ""
        read -p "Press Enter to continue..."
        echo ""
        
        docker-compose up --build -d
        
        echo ""
        echo "⏳ Waiting for services to be healthy..."
        echo ""
        
        # Wait for services to be healthy
        sleep 5
        
        echo "📊 Service Status:"
        docker-compose ps
        
        echo ""
        echo "✅ Application is running!"
        echo ""
        echo "🌐 Access the application:"
        echo "   http://localhost:8080"
        echo ""
        echo "📝 View logs:"
        echo "   docker-compose logs -f"
        echo ""
        echo "🛑 Stop the application:"
        echo "   ./start.sh down"
        echo ""
        ;;
        
    down)
        echo "🛑 Stopping Pizza Ordering Application..."
        docker-compose down
        echo "✅ Application stopped"
        echo ""
        echo "💡 To remove all data (including database):"
        echo "   docker-compose down -v"
        echo ""
        ;;
        
    restart)
        echo "🔄 Restarting Pizza Ordering Application..."
        docker-compose restart
        echo "✅ Application restarted"
        ;;
        
    logs)
        echo "📋 Showing application logs (Ctrl+C to exit)..."
        echo ""
        docker-compose logs -f
        ;;
        
    clean)
        echo "🧹 Cleaning up Pizza Ordering Application..."
        echo ""
        echo "⚠️  WARNING: This will remove:"
        echo "   - All containers"
        echo "   - All volumes (DATABASE DATA WILL BE DELETED)"
        echo "   - All images"
        echo "   - Network"
        echo ""
        read -p "Are you sure? (yes/no): " CONFIRM
        
        if [ "$CONFIRM" == "yes" ]; then
            docker-compose down -v
            docker rmi flowfuse-pizza-ordering-app-frontend flowfuse-pizza-ordering-app-backend 2>/dev/null || true
            echo "✅ Cleanup complete"
        else
            echo "❌ Cleanup cancelled"
        fi
        ;;
        
    status)
        echo "📊 Application Status:"
        echo ""
        docker-compose ps
        echo ""
        echo "📊 Resource Usage:"
        docker stats --no-stream pizza_frontend pizza_backend pizza_database
        ;;
        
    *)
        echo "Usage: ./start.sh [command]"
        echo ""
        echo "Commands:"
        echo "  up        - Build and start all services (default)"
        echo "  down      - Stop all services"
        echo "  restart   - Restart all services"
        echo "  logs      - View application logs"
        echo "  status    - Show service status and resource usage"
        echo "  clean     - Remove all containers, volumes, and images"
        echo ""
        echo "Examples:"
        echo "  ./start.sh up       # Start the application"
        echo "  ./start.sh logs     # View logs"
        echo "  ./start.sh down     # Stop the application"
        echo ""
        exit 1
        ;;
esac
