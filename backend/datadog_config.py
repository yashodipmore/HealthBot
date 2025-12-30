"""
HealthBot Monitor - Datadog Integration
Complete observability with APM, metrics, and logging
"""
import os
import time
from datetime import datetime
from typing import Optional, Dict, Any
from functools import wraps
import structlog

from datadog_api_client import ApiClient, Configuration
from datadog_api_client.v1.api.metrics_api import MetricsApi
from datadog_api_client.v1.api.monitors_api import MonitorsApi
from datadog_api_client.v1.model.metrics_payload import MetricsPayload
from datadog_api_client.v1.model.series import Series
from datadog_api_client.v1.model.point import Point
from datadog_api_client.v1.model.monitor import Monitor
from datadog_api_client.v1.model.monitor_type import MonitorType
from datadog_api_client.v1.model.monitor_options import MonitorOptions
from datadog_api_client.v1.model.monitor_thresholds import MonitorThresholds

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger(__name__)


class DatadogMetrics:
    """
    Datadog Metrics Manager
    Handles custom metrics, APM integration, and logging
    """
    
    def __init__(self):
        self.api_key = os.getenv("DD_API_KEY")
        self.app_key = os.getenv("DD_APP_KEY")
        self.site = os.getenv("DD_SITE", "datadoghq.com")
        self.service = os.getenv("DD_SERVICE", "healthbot-monitor")
        self.env = os.getenv("DD_ENV", "development")
        
        # Initialize metrics storage (in-memory for demo)
        self.metrics_buffer: list = []
        self.request_count = 0
        self.error_count = 0
        self.total_tokens = 0
        self.response_times: list = []
        self.start_time = time.time()
        
        # Configure Datadog client
        self.configuration = None
        self.metrics_api = None
        self._initialize_client()
        
        logger.info("DatadogMetrics initialized", service=self.service, env=self.env)
    
    def _initialize_client(self):
        """Initialize Datadog API client"""
        if self.api_key and self.app_key:
            self.configuration = Configuration()
            self.configuration.api_key = {
                "apiKeyAuth": self.api_key,
                "appKeyAuth": self.app_key
            }
            self.configuration.server_variables["site"] = self.site
            logger.info("Datadog client configured successfully")
        else:
            logger.warning("Datadog API keys not configured - running in mock mode")
    
    def is_connected(self) -> bool:
        """Check if Datadog is properly configured"""
        return self.api_key is not None and self.app_key is not None
    
    def _get_current_timestamp(self) -> int:
        """Get current Unix timestamp"""
        return int(datetime.utcnow().timestamp())
    
    def _create_series(self, metric_name: str, value: float, tags: list = None) -> Series:
        """Create a Datadog metric series"""
        if tags is None:
            tags = []
        
        default_tags = [
            f"service:{self.service}",
            f"env:{self.env}",
            "source:healthbot"
        ]
        all_tags = default_tags + tags
        
        return Series(
            metric=f"healthbot.{metric_name}",
            type="gauge",
            points=[Point([self._get_current_timestamp(), value])],
            tags=all_tags
        )
    
    def send_metric(self, metric_name: str, value: float, tags: list = None):
        """Send a custom metric to Datadog"""
        if not self.is_connected():
            # Store locally if not connected
            self.metrics_buffer.append({
                "name": metric_name,
                "value": value,
                "tags": tags,
                "timestamp": datetime.utcnow().isoformat()
            })
            logger.debug("Metric buffered (Datadog not connected)", 
                        metric=metric_name, value=value)
            return
        
        try:
            with ApiClient(self.configuration) as api_client:
                metrics_api = MetricsApi(api_client)
                series = self._create_series(metric_name, value, tags)
                payload = MetricsPayload(series=[series])
                metrics_api.submit_metrics(body=payload)
                
            logger.info("Metric sent to Datadog", metric=metric_name, value=value)
        except Exception as e:
            logger.error("Failed to send metric to Datadog", 
                        metric=metric_name, error=str(e))
            # Buffer the metric for retry
            self.metrics_buffer.append({
                "name": metric_name,
                "value": value,
                "tags": tags,
                "timestamp": datetime.utcnow().isoformat()
            })
    
    def track_request(self, response_time_ms: float, tokens_used: int, 
                     success: bool = True, error_type: str = None):
        """Track a chat request with all metrics"""
        self.request_count += 1
        self.response_times.append(response_time_ms)
        
        if success:
            self.total_tokens += tokens_used
        else:
            self.error_count += 1
        
        # Send metrics to Datadog
        tags = ["endpoint:chat"]
        if error_type:
            tags.append(f"error_type:{error_type}")
        
        # Response time metric
        self.send_metric("response_time_ms", response_time_ms, tags)
        
        # Token usage metric
        if tokens_used > 0:
            self.send_metric("tokens_used", float(tokens_used), tags)
        
        # Request count
        self.send_metric("request_count", float(self.request_count), tags)
        
        # Error tracking
        if not success:
            self.send_metric("error_count", float(self.error_count), 
                           tags + [f"error:{error_type or 'unknown'}"])
        
        # Calculate and send error rate
        error_rate = (self.error_count / self.request_count * 100) if self.request_count > 0 else 0
        self.send_metric("error_rate", error_rate, tags)
        
        logger.info("Request tracked",
                   response_time_ms=response_time_ms,
                   tokens_used=tokens_used,
                   success=success,
                   total_requests=self.request_count)
    
    def get_metrics_summary(self) -> Dict[str, Any]:
        """Get summary of all tracked metrics"""
        avg_response_time = (sum(self.response_times) / len(self.response_times)) \
            if self.response_times else 0
        
        return {
            "total_requests": self.request_count,
            "successful_requests": self.request_count - self.error_count,
            "failed_requests": self.error_count,
            "average_response_time_ms": round(avg_response_time, 2),
            "total_tokens_used": self.total_tokens,
            "uptime_seconds": round(time.time() - self.start_time, 2),
            "error_rate_percent": round(
                (self.error_count / self.request_count * 100) if self.request_count > 0 else 0, 2
            ),
            "buffered_metrics": len(self.metrics_buffer)
        }
    
    def get_response_time_history(self, limit: int = 50) -> list:
        """Get recent response time history"""
        return self.response_times[-limit:]
    
    def log_event(self, event_name: str, data: Dict[str, Any] = None):
        """Log a custom event"""
        log_data = {
            "event_name": event_name,
            "service": self.service,
            "env": self.env,
            "timestamp": datetime.utcnow().isoformat()
        }
        if data:
            log_data.update(data)
        
        logger.info(msg=event_name, **log_data)
    
    def create_monitor(self, name: str, query: str, message: str, 
                       threshold_critical: float, threshold_warning: float = None) -> Optional[Dict]:
        """
        Create a Datadog Monitor (Alert)
        
        Args:
            name: Monitor name
            query: Datadog query for the monitor
            message: Alert message (can include @email for notifications)
            threshold_critical: Critical threshold value
            threshold_warning: Warning threshold value (optional)
        
        Returns:
            Monitor details or None if failed
        """
        if not self.is_connected():
            logger.warning("Cannot create monitor - Datadog not connected")
            return None
        
        try:
            with ApiClient(self.configuration) as api_client:
                monitors_api = MonitorsApi(api_client)
                
                thresholds = MonitorThresholds(critical=threshold_critical)
                if threshold_warning:
                    thresholds.warning = threshold_warning
                
                monitor = Monitor(
                    name=name,
                    type=MonitorType("metric alert"),
                    query=query,
                    message=message,
                    tags=[f"service:{self.service}", f"env:{self.env}", "source:healthbot"],
                    options=MonitorOptions(
                        thresholds=thresholds,
                        notify_no_data=False,
                        renotify_interval=60,
                    )
                )
                
                result = monitors_api.create_monitor(body=monitor)
                logger.info("Monitor created", monitor_name=name, monitor_id=result.id)
                return {"id": result.id, "name": name, "status": "created"}
                
        except Exception as e:
            logger.error("Failed to create monitor", error=str(e), monitor_name=name)
            return None
    
    def setup_default_alerts(self, notification_email: str = None) -> list:
        """
        Setup default monitoring alerts for HealthBot
        
        Args:
            notification_email: Email to send alerts to (optional)
        
        Returns:
            List of created monitors
        """
        created_monitors = []
        notify = f"@{notification_email}" if notification_email else ""
        
        # Alert 1: High Response Time (> 5 seconds)
        result = self.create_monitor(
            name="HealthBot - High Response Time Alert",
            query=f"avg(last_5m):avg:healthbot.response_time_ms{{service:{self.service}}} > 5000",
            message=f"🚨 HealthBot response time is too high! Average > 5 seconds.\n\nPlease investigate immediately. {notify}",
            threshold_critical=5000,
            threshold_warning=3000
        )
        if result:
            created_monitors.append(result)
        
        # Alert 2: High Error Rate (> 5%)
        result = self.create_monitor(
            name="HealthBot - High Error Rate Alert",
            query=f"avg(last_5m):avg:healthbot.error_rate{{service:{self.service}}} > 5",
            message=f"⚠️ HealthBot error rate is above 5%!\n\nCheck logs for errors. {notify}",
            threshold_critical=5,
            threshold_warning=2
        )
        if result:
            created_monitors.append(result)
        
        # Alert 3: Token Usage Spike
        result = self.create_monitor(
            name="HealthBot - Token Usage Spike Alert",
            query=f"avg(last_5m):avg:healthbot.tokens_used{{service:{self.service}}} > 10000",
            message=f"📊 HealthBot token usage is spiking!\n\nMonitor for cost implications. {notify}",
            threshold_critical=10000,
            threshold_warning=5000
        )
        if result:
            created_monitors.append(result)
        
        # Alert 4: Service Down (No requests)
        result = self.create_monitor(
            name="HealthBot - Service Health Check",
            query=f"avg(last_10m):avg:healthbot.request_count{{service:{self.service}}} < 1",
            message=f"🔴 HealthBot may be down! No requests in last 10 minutes.\n\nCheck service status. {notify}",
            threshold_critical=1
        )
        if result:
            created_monitors.append(result)
        
        logger.info("Default alerts setup complete", monitors_created=len(created_monitors))
        return created_monitors
    
    def get_alerts_status(self) -> list:
        """Get local alert status based on current metrics"""
        summary = self.get_metrics_summary()
        alerts = []
        
        # Check response time
        if summary["average_response_time_ms"] > 5000:
            alerts.append({
                "type": "critical",
                "name": "High Response Time",
                "message": f"Average response time is {summary['average_response_time_ms']:.0f}ms (> 5000ms)",
                "value": summary["average_response_time_ms"]
            })
        elif summary["average_response_time_ms"] > 3000:
            alerts.append({
                "type": "warning",
                "name": "Elevated Response Time",
                "message": f"Average response time is {summary['average_response_time_ms']:.0f}ms (> 3000ms)",
                "value": summary["average_response_time_ms"]
            })
        
        # Check error rate
        if summary["error_rate_percent"] > 5:
            alerts.append({
                "type": "critical",
                "name": "High Error Rate",
                "message": f"Error rate is {summary['error_rate_percent']:.1f}% (> 5%)",
                "value": summary["error_rate_percent"]
            })
        elif summary["error_rate_percent"] > 2:
            alerts.append({
                "type": "warning",
                "name": "Elevated Error Rate",
                "message": f"Error rate is {summary['error_rate_percent']:.1f}% (> 2%)",
                "value": summary["error_rate_percent"]
            })
        
        return alerts


def track_performance(datadog: DatadogMetrics):
    """
    Decorator to track function performance
    Usage: @track_performance(datadog_instance)
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            start_time = time.time()
            success = True
            error_type = None
            tokens = 0
            
            try:
                result = await func(*args, **kwargs)
                # Try to extract tokens from result
                if hasattr(result, 'tokens_used'):
                    tokens = result.tokens_used
                elif isinstance(result, dict) and 'tokens_used' in result:
                    tokens = result['tokens_used']
                return result
            except Exception as e:
                success = False
                error_type = type(e).__name__
                raise
            finally:
                elapsed_ms = (time.time() - start_time) * 1000
                datadog.track_request(
                    response_time_ms=elapsed_ms,
                    tokens_used=tokens,
                    success=success,
                    error_type=error_type
                )
        
        return wrapper
    return decorator


# Global instance
datadog_metrics = DatadogMetrics()
