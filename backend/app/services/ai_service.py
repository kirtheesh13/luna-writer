import json
import logging
import re
from typing import Any, Dict, List, Optional
import google.generativeai as genai

from backend.app.config import settings

logger = logging.getLogger("luna_writer.ai")

if settings.GEMINI_API_KEY:
    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
    except Exception as e:
        logger.warning(f"Failed to configure Gemini AI: {e}")

CEFR_LEVELS = ["Pre-A1", "A1", "A2", "B1", "B2", "C1", "C2"]

def heuristic_evaluate_writing(title: str, content: str, category: str) -> Dict[str, Any]:
    """Heuristic assessment adhering to CEFR standards when Gemini is offline or fallback is needed."""
    words = re.findall(r"\b[a-zA-Z']+\b", content)
    word_count = len(words)
    sentences = [s.strip() for s in re.split(r"[.!?]+", content) if s.strip()]
    sentence_count = max(len(sentences), 1)
    
    unique_words = set(w.lower() for w in words)
    lexical_diversity = round((len(unique_words) / max(word_count, 1)) * 100, 1)
    avg_sentence_length = round(word_count / sentence_count, 1)

    # Level heuristic
    if word_count < 20 or lexical_diversity < 20:
        level = "Pre-A1"
        overall_score = 35
        can_publish = False
    elif word_count < 60:
        level = "A1"
        overall_score = 62
        can_publish = True
    elif word_count < 140:
        level = "A2"
        overall_score = 74
        can_publish = True
    elif word_count < 280:
        level = "B1"
        overall_score = 83
        can_publish = True
    elif word_count < 500:
        level = "B2"
        overall_score = 89
        can_publish = True
    else:
        level = "C1"
        overall_score = 94
        can_publish = True

    # Identify vocabulary gems
    sophisticated_words = [w for w in unique_words if len(w) >= 7 and w not in {"because", "through", "another", "without", "between", "something"}]
    vocab_gems = sophisticated_words[:5] if sophisticated_words else ["expressive", "journey", "deliberate"]

    if can_publish:
        verdict_message = f"Congratulations! Your {category.rstrip('s')} meets the {level} standard and is eligible to be published to the community showcase!"
    else:
        verdict_message = "Sorry, your writing is not up to the mark yet, but you can save it in your private folder to keep practicing!"

    return {
        "cefr_level": level,
        "score": overall_score,
        "can_publish": can_publish,
        "verdict_message": verdict_message,
        "word_count": word_count,
        "lexical_diversity": f"{lexical_diversity}%",
        "avg_sentence_length": avg_sentence_length,
        "strengths": [
            f"Good clarity in expressing ideas across {sentence_count} sentences.",
            f"Vibrant vocabulary variety ({lexical_diversity}% unique words).",
            f"Appropriate flow and structure for a {category.rstrip('s')}."
        ],
        "vocabulary_gems": vocab_gems,
        "improvement_tips": [
            "Experiment with varied transition words (e.g., 'Furthermore', 'Consequently', 'On the other hand').",
            "Try replacing basic adjectives with evocative synonyms.",
            "Combine shorter sentences with relative clauses to enrich rhythm."
        ]
    }

async def evaluate_writing_with_ai(title: str, content: str, category: str) -> Dict[str, Any]:
    """Evaluate user writing using Gemini AI with seamless heuristic fallback."""
    words = re.findall(r"\b[a-zA-Z']+\b", content)
    if len(words) < 15:
        return {
            "cefr_level": "Pre-A1",
            "score": 30,
            "can_publish": False,
            "verdict_message": "Sorry, your writing is not up to the mark yet, but you can save it in your private folder to keep practicing!",
            "word_count": len(words),
            "lexical_diversity": "N/A",
            "avg_sentence_length": len(words),
            "strengths": ["You have made a beginning draft."],
            "vocabulary_gems": [],
            "improvement_tips": ["Add more details, descriptions, and complete sentences (aim for at least 30-50 words)."]
        }

    if not settings.GEMINI_API_KEY:
        return heuristic_evaluate_writing(title, content, category)

    prompt = f"""You are a master English writing tutor and CEFR examiner.
Analyze the following user-submitted {category.rstrip('s')} titled "{title}":

\"\"\"{content}\"\"\"

Provide your evaluation in strict JSON format with these exact keys:
{{
  "cefr_level": "<one of: Pre-A1, A1, A2, B1, B2, C1, C2>",
  "score": <integer from 20 to 100>,
  "can_publish": <boolean, true ONLY IF cefr_level is A1 or higher and coherent; false otherwise>,
  "verdict_message": "<If can_publish is true, give a motivating congratulatory message. If can_publish is false, MUST output: 'Sorry, your writing is not up to the mark yet, but you can save it in your private folder to keep practicing!'>",
  "word_count": <number of words>,
  "lexical_diversity": "<percentage string e.g. '68%'>",
  "avg_sentence_length": <average words per sentence>,
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "vocabulary_gems": ["<rich word 1>", "<rich word 2>", "<rich word 3>"],
  "improvement_tips": ["<practical actionable tip 1>", "<practical actionable tip 2>", "<practical actionable tip 3>"]
}}
Return only valid JSON. Do not include markdown code block syntax if possible."""

    try:
        model = genai.GenerativeModel(settings.AI_MODEL_NAME)
        response = await model.generate_content_async(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        data = json.loads(text.strip())
        
        # Ensure publish gate logic adheres strictly
        if data.get("cefr_level") in ["Pre-A1"] or data.get("score", 0) < 50:
            data["can_publish"] = False
            data["verdict_message"] = "Sorry, your writing is not up to the mark yet, but you can save it in your private folder to keep practicing!"
        elif data.get("cefr_level") in ["A1", "A2", "B1", "B2", "C1", "C2"]:
            data["can_publish"] = True
            
        return data
    except Exception as e:
        logger.warning(f"Gemini API call failed, falling back to heuristic engine: {e}")
        return heuristic_evaluate_writing(title, content, category)

async def generate_reading_highlights(title: str, content: str, category: str) -> Dict[str, Any]:
    """Generate in-depth story breakdown, CEFR level evaluation, highlights, and writer learning takeaways for the reader view."""
    heuristic = heuristic_evaluate_writing(title, content, category)
    detected_cefr = heuristic.get("cefr_level", "B1")

    fallback_response = {
        "title": title,
        "category": category,
        "cefr_level": detected_cefr,
        "cefr_explanation": f"Demonstrates {detected_cefr} proficiency with well-balanced sentence structures, nuanced vocabulary, and clear syntactic progression.",
        "breakdown": f"This well-crafted {category.rstrip('s')} effectively establishes tone, pacing, and engaging narrative progression.",
        "highlights": [
            "Compelling opening that immediately engages the reader's curiosity.",
            "Thoughtful sensory details that bring the setting and characters alive.",
            "Pacing balances descriptive passages with action or reflective dialogue."
        ],
        "learning_takeaways": [
            {"technique": "Sensory Descriptions", "explanation": "Notice how visual and auditory descriptions immerse the reader without slowing down the story."},
            {"technique": "Sentence Variety", "explanation": "Alternates between short, punchy statements and flowing complex sentences to regulate pacing."},
            {"technique": "Evocative Vocabulary", "explanation": "Selects precise verbs and adjectives instead of relying on generic words like 'good' or 'nice'."}
        ],
        "key_vocabulary": [
            {"word": "ingenuity", "definition": "The quality of being clever, original, and inventive.", "sample": "Reflections of human ingenuity."},
            {"word": "inclement", "definition": "(Of weather) unpleasantly cold or wet.", "sample": "Inclement weather in the mountains."}
        ]
    }

    if not settings.GEMINI_API_KEY:
        return fallback_response

    prompt = f"""You are a master literary analyst and CEFR English language mentor.
Analyze this {category.rstrip('s')} titled "{title}":

\"\"\"{content}\"\"\"

Generate an inspiring reading breakdown, CEFR proficiency assessment, and actionable learning guide for an aspiring writer.
Return ONLY valid JSON matching this schema:
{{
  "title": "{title}",
  "category": "{category}",
  "cefr_level": "<One of: A1, A2, B1, B2, C1, C2>",
  "cefr_explanation": "<A concise 1-2 sentence explanation of why this piece represents this CEFR level based on grammar complexity and vocabulary>",
  "breakdown": "<A 2-3 sentence overview of why this piece is effective and its core theme>",
  "highlights": [
    "<Engaging narrative/structural highlight 1>",
    "<Stylistic highlight 2>",
    "<Character or thematic highlight 3>"
  ],
  "learning_takeaways": [
    {{"technique": "<Name of writing technique>", "explanation": "<How the reader can apply this technique to their own writing>"}},
    {{"technique": "<Name of writing technique>", "explanation": "<How the reader can apply this technique to their own writing>"}},
    {{"technique": "<Name of writing technique>", "explanation": "<How the reader can apply this technique to their own writing>"}}
  ],
  "key_vocabulary": [
    {{"word": "<Advanced word from text>", "definition": "<Clear definition>", "sample": "<How it was used in the piece>"}},
    {{"word": "<Advanced word from text>", "definition": "<Clear definition>", "sample": "<How it was used in the piece>"}},
    {{"word": "<Advanced word from text>", "definition": "<Clear definition>", "sample": "<How it was used in the piece>"}}
  ]
}}"""

    try:
        model = genai.GenerativeModel(settings.AI_MODEL_NAME)
        response = await model.generate_content_async(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        data = json.loads(text.strip())
        if not data.get("cefr_level"):
            data["cefr_level"] = detected_cefr
        if not data.get("cefr_explanation"):
            data["cefr_explanation"] = f"Text is classified at CEFR {data['cefr_level']} level based on lexical diversity and syntactic range."
        return data
    except Exception as e:
        logger.warning(f"Gemini API highlight call failed, using fallback: {e}")
        return fallback_response
