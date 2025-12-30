"""
HealthBot Monitor - Gemini AI Service
Google Gemini integration for health-related queries using google.genai
"""
import os
import time
from typing import Optional, Tuple
import structlog

# Use the new google.genai library
from google import genai
from google.genai import types

logger = structlog.get_logger(__name__)


# Health-focused system prompt
HEALTH_SYSTEM_PROMPT = """You are HealthBot, a helpful AI health assistant. Your role is to:

1. **Provide General Health Information**: Answer questions about symptoms, conditions, medications, nutrition, and wellness.

2. **Be Empathetic and Supportive**: Respond with care and understanding to health concerns.

3. **Encourage Professional Consultation**: Always remind users to consult healthcare professionals for serious concerns, diagnoses, or treatment decisions.

4. **Stay Within Limits**: 
   - Do NOT diagnose specific conditions
   - Do NOT prescribe medications
   - Do NOT replace professional medical advice
   - Do NOT provide emergency medical guidance

5. **Be Clear and Accurate**: Provide evidence-based information when possible.

6. **Format Responses Well**: Use clear formatting with bullet points and sections when appropriate.

**Important Disclaimer**: Always include a brief reminder that you're an AI assistant and professional medical consultation is recommended for health decisions.

Start each response helpfully and end with appropriate caveats when discussing serious health topics."""


class GeminiService:
    """
    Google Gemini AI Service
    Handles all interactions with the Gemini API using google.genai
    """
    
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        self.client = None
        self.model_name = "gemini-2.5-flash"  # Latest Gemini 2.5 model
        self.conversations = {}  # Store conversation history
        
        self._initialize()
    
    def _initialize(self):
        """Initialize the Gemini client"""
        if not self.api_key:
            logger.warning("Google API key not configured - AI features disabled")
            return
        
        try:
            # Initialize the new client
            self.client = genai.Client(api_key=self.api_key)
            
            logger.info("Gemini service initialized successfully", model=self.model_name)
            
        except Exception as e:
            logger.error("Failed to initialize Gemini", error=str(e))
            self.client = None
    
    def is_connected(self) -> bool:
        """Check if Gemini is properly initialized"""
        return self.client is not None
    
    def _estimate_tokens(self, text: str) -> int:
        """Estimate token count (rough approximation)"""
        # Roughly 4 characters per token for English
        return len(text) // 4
    
    async def generate_response(
        self, 
        message: str, 
        conversation_id: Optional[str] = None
    ) -> Tuple[str, int, float]:
        """
        Generate a health-related response using Gemini
        
        Args:
            message: User's health query
            conversation_id: Optional conversation ID for context
            
        Returns:
            Tuple of (response_text, tokens_used, response_time_ms)
        """
        start_time = time.time()
        
        if not self.is_connected():
            return (
                "I'm sorry, but the AI service is currently unavailable. "
                "Please try again later or contact support.",
                0,
                (time.time() - start_time) * 1000
            )
        
        try:
            # Combine system prompt with user message
            full_prompt = f"{HEALTH_SYSTEM_PROMPT}\n\nUser's health question: {message}\n\nYour helpful response:"
            
            # Generate response using the new API
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=full_prompt,
                config=types.GenerateContentConfig(
                    temperature=0.7,
                    top_p=0.9,
                    top_k=40,
                    max_output_tokens=1024,
                )
            )
            
            # Extract response text
            response_text = response.text
            
            # Calculate metrics
            response_time_ms = (time.time() - start_time) * 1000
            
            # Estimate tokens (input + output)
            input_tokens = self._estimate_tokens(message)
            output_tokens = self._estimate_tokens(response_text)
            total_tokens = input_tokens + output_tokens
            
            # Try to get actual token count if available
            if hasattr(response, 'usage_metadata') and response.usage_metadata:
                prompt_tokens = getattr(response.usage_metadata, 'prompt_token_count', None) or input_tokens
                candidate_tokens = getattr(response.usage_metadata, 'candidates_token_count', None) or output_tokens
                total_tokens = prompt_tokens + candidate_tokens
            
            logger.info(
                "Generated health response",
                conversation_id=conversation_id,
                input_length=len(message),
                output_length=len(response_text),
                tokens=total_tokens,
                response_time_ms=round(response_time_ms, 2)
            )
            
            return response_text, total_tokens, response_time_ms
            
        except Exception as e:
            response_time_ms = (time.time() - start_time) * 1000
            logger.error("Error generating response", error=str(e))
            
            # Return user-friendly error message
            error_response = (
                "I apologize, but I encountered an issue processing your request. "
                "This could be due to content safety filters or a temporary issue. "
                "Please try rephrasing your question or try again later."
            )
            
            return error_response, 0, response_time_ms
    
    def clear_conversation(self, conversation_id: str) -> bool:
        """Clear a conversation's history"""
        if conversation_id in self.conversations:
            del self.conversations[conversation_id]
            logger.info("Conversation cleared", conversation_id=conversation_id)
            return True
        return False
    
    def get_conversation_count(self) -> int:
        """Get number of active conversations"""
        return len(self.conversations)


# Global instance
gemini_service = GeminiService()
