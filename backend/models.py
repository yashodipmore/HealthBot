"""
HealthBot Monitor - Pydantic Models
Data validation and serialization for the API
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class ChatMessage(BaseModel):
    """Single chat message"""
    role: MessageRole
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ChatRequest(BaseModel):
    """Request body for chat endpoint"""
    message: str = Field(..., min_length=1, max_length=2000, description="User's health query")
    conversation_id: Optional[str] = Field(None, description="Optional conversation ID for context")
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "What are the symptoms of common cold?",
                "conversation_id": "conv_123"
            }
        }


class ChatResponse(BaseModel):
    """Response body for chat endpoint"""
    response: str = Field(..., description="AI generated health response")
    conversation_id: str = Field(..., description="Conversation ID for follow-up")
    tokens_used: int = Field(..., description="Number of tokens used")
    response_time_ms: float = Field(..., description="Response time in milliseconds")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_schema_extra = {
            "example": {
                "response": "Common cold symptoms include runny nose, sore throat...",
                "conversation_id": "conv_123",
                "tokens_used": 150,
                "response_time_ms": 1234.56,
                "timestamp": "2024-01-15T10:30:00Z"
            }
        }


class HealthMetrics(BaseModel):
    """System health metrics"""
    total_requests: int
    successful_requests: int
    failed_requests: int
    average_response_time_ms: float
    total_tokens_used: int
    uptime_seconds: float
    last_updated: datetime = Field(default_factory=datetime.utcnow)


class MetricData(BaseModel):
    """Single metric data point"""
    name: str
    value: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    tags: Optional[dict] = None


class AlertStatus(str, Enum):
    OK = "ok"
    WARNING = "warning"
    CRITICAL = "critical"


class Alert(BaseModel):
    """Alert information"""
    id: str
    name: str
    status: AlertStatus
    message: str
    triggered_at: Optional[datetime] = None


class DashboardData(BaseModel):
    """Data for frontend dashboard"""
    metrics: HealthMetrics
    recent_alerts: List[Alert] = []
    response_time_history: List[MetricData] = []
    error_rate_history: List[MetricData] = []
    token_usage_history: List[MetricData] = []


class HealthCheckResponse(BaseModel):
    """Health check response"""
    status: str = "healthy"
    version: str = "1.0.0"
    gemini_connected: bool
    datadog_connected: bool
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ErrorResponse(BaseModel):
    """Error response body"""
    error: str
    detail: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
