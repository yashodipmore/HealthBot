"""
HealthBot Monitor - Main FastAPI Application
Complete AI Health Assistant with Datadog Observability
"""
import os
import time
import uuid
from datetime import datetime
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import our modules
from models import (
    ChatRequest, ChatResponse, HealthCheckResponse, 
    ErrorResponse, HealthMetrics, DashboardData, MetricData
)
from datadog_config import datadog_metrics
from gemini_service import gemini_service

# Optional: Enable Datadog APM tracing if ddtrace is available
try:
    from ddtrace import patch_all, tracer
    # Patch all supported libraries
    patch_all()
    TRACING_ENABLED = True
except ImportError:
    TRACING_ENABLED = False


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler"""
    # Startup
    print("🚀 HealthBot Monitor starting up...")
    print(f"📊 Datadog connected: {datadog_metrics.is_connected()}")
    print(f"🤖 Gemini connected: {gemini_service.is_connected()}")
    print(f"🔍 APM Tracing: {'Enabled' if TRACING_ENABLED else 'Disabled'}")
    
    datadog_metrics.log_event("app_startup", {
        "gemini_connected": gemini_service.is_connected(),
        "datadog_connected": datadog_metrics.is_connected()
    })
    
    yield
    
    # Shutdown
    print("👋 HealthBot Monitor shutting down...")
    datadog_metrics.log_event("app_shutdown", {
        "total_requests": datadog_metrics.request_count
    })


# Create FastAPI app
app = FastAPI(
    title="HealthBot Monitor",
    description="AI Health Assistant with Complete Datadog Observability",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        os.getenv("FRONTEND_URL", "http://localhost:3000")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request timing middleware
@app.middleware("http")
async def add_timing_header(request: Request, call_next):
    """Add response timing header and log requests"""
    start_time = time.time()
    
    # Log incoming request
    datadog_metrics.log_event("request_received", {
        "path": request.url.path,
        "method": request.method
    })
    
    response = await call_next(request)
    
    # Calculate processing time
    process_time = (time.time() - start_time) * 1000
    response.headers["X-Process-Time-Ms"] = str(round(process_time, 2))
    
    return response


# Exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    datadog_metrics.track_request(
        response_time_ms=0,
        tokens_used=0,
        success=False,
        error_type=type(exc).__name__
    )
    
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error="Internal Server Error",
            detail=str(exc)
        ).model_dump()
    )


# ============ API ENDPOINTS ============

@app.get("/", tags=["Root"])
async def root():
    """Root endpoint - API info"""
    return {
        "name": "HealthBot Monitor",
        "version": "1.0.0",
        "description": "AI Health Assistant with Datadog Observability",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health", response_model=HealthCheckResponse, tags=["Health"])
async def health_check():
    """Health check endpoint for monitoring"""
    return HealthCheckResponse(
        status="healthy",
        version="1.0.0",
        gemini_connected=gemini_service.is_connected(),
        datadog_connected=datadog_metrics.is_connected()
    )


@app.post("/chat", response_model=ChatResponse, tags=["Chat"])
async def chat(request: ChatRequest):
    """
    Main chat endpoint - Ask health-related questions
    
    This endpoint:
    1. Accepts user health queries
    2. Processes them with Gemini AI
    3. Tracks metrics with Datadog
    4. Returns AI-generated response
    """
    start_time = time.time()
    
    try:
        # Generate or use existing conversation ID
        conversation_id = request.conversation_id or f"conv_{uuid.uuid4().hex[:12]}"
        
        # Get AI response from Gemini
        response_text, tokens_used, ai_response_time = await gemini_service.generate_response(
            message=request.message,
            conversation_id=conversation_id
        )
        
        # Calculate total response time
        total_response_time = (time.time() - start_time) * 1000
        
        # Track metrics in Datadog
        datadog_metrics.track_request(
            response_time_ms=total_response_time,
            tokens_used=tokens_used,
            success=True
        )
        
        # Log the interaction
        datadog_metrics.log_event("chat_completed", {
            "conversation_id": conversation_id,
            "message_length": len(request.message),
            "response_length": len(response_text),
            "tokens_used": tokens_used,
            "response_time_ms": round(total_response_time, 2)
        })
        
        return ChatResponse(
            response=response_text,
            conversation_id=conversation_id,
            tokens_used=tokens_used,
            response_time_ms=round(total_response_time, 2)
        )
        
    except Exception as e:
        response_time = (time.time() - start_time) * 1000
        
        # Track error
        datadog_metrics.track_request(
            response_time_ms=response_time,
            tokens_used=0,
            success=False,
            error_type=type(e).__name__
        )
        
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process chat request: {str(e)}"
        )


@app.get("/metrics", response_model=HealthMetrics, tags=["Monitoring"])
async def get_metrics():
    """
    Get current system metrics
    
    Returns aggregated metrics including:
    - Total requests
    - Success/failure counts
    - Average response time
    - Token usage
    - Uptime
    """
    summary = datadog_metrics.get_metrics_summary()
    
    return HealthMetrics(
        total_requests=summary["total_requests"],
        successful_requests=summary["successful_requests"],
        failed_requests=summary["failed_requests"],
        average_response_time_ms=summary["average_response_time_ms"],
        total_tokens_used=summary["total_tokens_used"],
        uptime_seconds=summary["uptime_seconds"]
    )


@app.get("/dashboard", response_model=DashboardData, tags=["Monitoring"])
async def get_dashboard_data():
    """
    Get data for the frontend monitoring dashboard
    
    Returns comprehensive data including:
    - Current metrics
    - Response time history
    - Recent alerts (if any)
    """
    summary = datadog_metrics.get_metrics_summary()
    response_times = datadog_metrics.get_response_time_history()
    
    # Create response time history data points
    response_time_history = [
        MetricData(
            name="response_time",
            value=rt,
            timestamp=datetime.utcnow()
        )
        for rt in response_times
    ]
    
    # Calculate error rate for history
    error_rate = summary["error_rate_percent"]
    
    return DashboardData(
        metrics=HealthMetrics(
            total_requests=summary["total_requests"],
            successful_requests=summary["successful_requests"],
            failed_requests=summary["failed_requests"],
            average_response_time_ms=summary["average_response_time_ms"],
            total_tokens_used=summary["total_tokens_used"],
            uptime_seconds=summary["uptime_seconds"]
        ),
        recent_alerts=[],
        response_time_history=response_time_history
    )


@app.delete("/conversation/{conversation_id}", tags=["Chat"])
async def clear_conversation(conversation_id: str):
    """Clear a specific conversation's history"""
    success = gemini_service.clear_conversation(conversation_id)
    
    if success:
        return {"message": f"Conversation {conversation_id} cleared"}
    else:
        raise HTTPException(
            status_code=404,
            detail=f"Conversation {conversation_id} not found"
        )


@app.get("/stats", tags=["Monitoring"])
async def get_detailed_stats():
    """Get detailed statistics for debugging and monitoring"""
    return {
        "metrics": datadog_metrics.get_metrics_summary(),
        "gemini": {
            "connected": gemini_service.is_connected(),
            "active_conversations": gemini_service.get_conversation_count()
        },
        "datadog": {
            "connected": datadog_metrics.is_connected(),
            "buffered_metrics": len(datadog_metrics.metrics_buffer)
        },
        "tracing_enabled": TRACING_ENABLED
    }


@app.get("/alerts", tags=["Monitoring"])
async def get_alerts():
    """
    Get current alert status based on metrics thresholds
    
    Returns active warnings and critical alerts
    """
    alerts = datadog_metrics.get_alerts_status()
    return {
        "alerts": alerts,
        "total_alerts": len(alerts),
        "critical_count": len([a for a in alerts if a["type"] == "critical"]),
        "warning_count": len([a for a in alerts if a["type"] == "warning"])
    }


@app.post("/alerts/setup", tags=["Monitoring"])
async def setup_datadog_alerts(email: str = None):
    """
    Setup Datadog monitoring alerts
    
    Creates default monitors in Datadog:
    - High Response Time (> 5s)
    - High Error Rate (> 5%)
    - Token Usage Spike
    - Service Health Check
    
    Args:
        email: Optional email for alert notifications
    """
    if not datadog_metrics.is_connected():
        raise HTTPException(
            status_code=503,
            detail="Datadog is not connected. Please configure DD_API_KEY and DD_APP_KEY"
        )
    
    monitors = datadog_metrics.setup_default_alerts(notification_email=email)
    
    return {
        "message": "Datadog alerts configured successfully",
        "monitors_created": len(monitors),
        "monitors": monitors
    }


# Run with: python main.py or uvicorn main:app --reload
if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    debug = os.getenv("DEBUG", "true").lower() == "true"
    
    print(f"""
    ╔══════════════════════════════════════════════════╗
    ║       🏥 HealthBot Monitor - API Server          ║
    ╠══════════════════════════════════════════════════╣
    ║  Running on: http://{host}:{port}                 ║
    ║  API Docs:   http://localhost:{port}/docs         ║
    ║  Debug Mode: {debug}                              ║
    ╚══════════════════════════════════════════════════╝
    """)
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=debug,
        log_level="info"
    )
