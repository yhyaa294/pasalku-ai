"""
AI Model Configuration for PasalKu.ai
Optimized model settings for speed and accuracy
"""

from typing import Dict, Any

# Model configurations for optimal performance
MODEL_CONFIGS = {
    "byteplus_ark": {
        "model_id": "ep-20250830093230-swczp",
        "name": "BytePlus Ark (Enhanced)",
        "description": "Deep reasoning engine optimized for legal analysis",
        "max_tokens": 2000,
        "temperature": {
            "legal_analysis": 0.3,  # Low for accuracy
            "creative_drafting": 0.7,
            "quick_response": 0.5
        },
        "timeout": 60.0,
        "priority": "accuracy",  # Slower but more accurate
        "strengths": ["legal reasoning", "citation accuracy", "complex analysis"],
        "weakness": "response speed"
    },

    "groq_fast": {
        "model_id": "mixtral-8x7b-32768",
        "name": "Groq Mixtral (Fast)",
        "description": "Fast inference optimized for quick responses",
        "max_tokens": 1500,
        "temperature": {
            "legal_analysis": 0.4,
            "creative_drafting": 0.8,
            "quick_response": 0.6
        },
        "timeout": 30.0,
        "priority": "speed",  # Faster but less detailed
        "strengths": ["speed", "general tasks", "simple queries"],
        "weakness": "deep legal reasoning"
    },

    "groq_ultra_fast": {
        "model_id": "llama2-70b-4096",  # Fallback to faster model
        "name": "Groq Llama2 (Ultra Fast)",
        "description": "Lightning fast for instant responses",
        "max_tokens": 1000,
        "temperature": {
            "legal_analysis": 0.5,
            "creative_drafting": 0.9,
            "quick_response": 0.7
        },
        "timeout": 15.0,
        "priority": "ultra_speed",
        "strengths": ["instant responses", "chat", "basic clarification"],
        "weakness": "accuracy and depth"
    }
}

# Consensus strategies for different task types
CONSENSUS_STRATEGIES = {
    "complex_legal": {
        "primary": "byteplus_ark",
        "secondary": "groq_fast",
        "similarity_threshold": 0.75,
        "max_response_time": 90.0,
        "expected_quality": "high"
    },

    "simple_query": {
        "primary": "groq_fast",
        "secondary": "groq_ultra_fast",
        "similarity_threshold": 0.80,
        "max_response_time": 45.0,
        "expected_quality": "medium"
    },

    "quick_chat": {
        "primary": "groq_ultra_fast",
        "fallback_only": True,  # No consensus, just fast response
        "max_response_time": 20.0,
        "expected_quality": "basic"
    }
}

def get_optimal_config(task_type: str, speed_priority: bool = False) -> Dict[str, Any]:
    """
    Get optimal model configuration for task type

    Args:
        task_type: Type of task (complex_legal, simple_query, quick_chat)
        speed_priority: Force speed over accuracy

    Returns:
        Optimized configuration dict
    """
    if speed_priority:
        # Force fastest model configuration
        config = MODEL_CONFIGS["groq_ultra_fast"].copy()
        config.update({
            "consensus_strategy": "speed_first",
            "max_tokens": 800,  # Reduce for speed
            "temperature": 0.4  # More focused and faster
        })
        return config

    strategy = CONSENSUS_STRATEGIES.get(task_type, CONSENSUS_STRATEGIES["simple_query"])
    primary_config = MODEL_CONFIGS[strategy["primary"]]

    return {
        "strategy": strategy,
        "primary_model": primary_config,
        "secondary_model": MODEL_CONFIGS.get(strategy.get("secondary")),
        "task_type": task_type,
        "speed_priority": speed_priority
    }

def get_model_performance_metrics() -> Dict[str, Any]:
    """Get current model performance metrics"""
    return {
        "byteplus_ark": {
            "accuracy": 0.92,
            "speed": 45.0,  # seconds
            "cost_per_token": 0.003,
            "best_for": "deep legal analysis"
        },
        "groq_fast": {
            "accuracy": 0.85,
            "speed": 12.0,
            "cost_per_token": 0.001,
            "best_for": "general responses"
        },
        "groq_ultra_fast": {
            "accuracy": 0.78,
            "speed": 6.0,
            "cost_per_token": 0.0005,
            "best_for": "instant chat"
        },
        "consensus_avg": {
            "accuracy": 0.88,
            "speed": 35.0,
            "cost_per_token": 0.002,
            "best_for": "balanced performance"
        }
    }