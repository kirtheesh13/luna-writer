import json
import logging
import re
import urllib.request
import uuid
from typing import Dict, Any, List

from backend.app.config import settings
from backend.app.models.review import (
    ReviewResponse,
    ReviewObservations,
    CategoryObservation,
    SentenceSuggestion,
)

logger = logging.getLogger("luna_writer.evaluator")

# CEFR connectors across levels
A1_CONNECTORS = {"and", "then", "or", "but"}
A2_CONNECTORS = {"and", "but", "so", "because", "then", "or", "also", "after", "before"}
B1_CONNECTORS = {
    "however", "although", "even though", "in addition", "furthermore", "moreover",
    "on the other hand", "firstly", "secondly", "finally", "in conclusion", "as a result",
    "therefore", "for instance", "for example", "because of", "despite", "whereas"
}
B2_CONNECTORS = {
    "nonetheless", "nevertheless", "subsequently", "consequently", "conversely",
    "provided that", "as long as", "in spite of", "due to", "in contrast"
}
C1_C2_CONNECTORS = {
    "notwithstanding", "inasmuch as", "hitherto", "whereupon", "albeit",
    "predominantly", "invariably", "paradoxically", "conversely"
}

B1_PHRASAL_VERBS = {
    "look forward to", "find out", "give up", "set off", "carry on", "get along",
    "turn up", "run out of", "come across", "look after", "take off", "grow up",
    "put off", "deal with", "break down", "catch up"
}

ADVANCED_C1_C2_WORDS = {
    "ubiquitous", "ephemeral", "quintessential", "juxtaposition", "clandestine",
    "paradigm", "obsequious", "myriad", "plethora", "surreptitious", "fastidious",
    "pernicious", "esoteric", "equivocal", "ameliorate", "dichotomy", "indefatigable",
    "perspicacious", "magnanimous", "serendipity", "meticulous", "comprehensive"
}

B1_GRAMMAR_PATTERNS = [
    (r"\b(have|has|had)\s+\w+ed\b", "Present/Past Perfect"),
    (r"\b(was|were)\s+\w+ing\b", "Past Continuous"),
    (r"\bif\b.+?\b(will|would|can|could)\b", "Conditional sentence"),
    (r"\b(should|must|ought to|might|could)\b", "Modal verb for advice/obligation/possibility"),
    (r"\b(is|are|was|were)\s+(\w+ed|built|made|written|done|seen)\b", "Passive voice structure"),
    (r"\b(which|who|whom|whose|where)\b", "Relative clause")
]

C1_C2_PATTERNS = [
    (r"\b(had\s+I|were\s+we|should\s+you)\b", "Inversion"),
    (r"\b(having\s+\w+ed|not\s+only\b.+?\bbut\s+also)\b", "Advanced participle/correlative clause"),
    (r"\b(would\s+have\s+been|could\s+have\s+\w+ed)\b", "Third/Mixed conditional")
]

def split_sentences(text: str) -> List[str]:
    raw = re.split(r'(?<=[.!?])\s+', text.strip())
    sentences = [s.strip() for s in raw if len(s.strip()) > 3]
    return sentences

def analyze_linguistics(text: str, category: str = "stories") -> Dict[str, Any]:
    words = re.findall(r'\b[A-Za-z\'-]+\b', text.lower())
    total_words = len(words)
    if total_words == 0:
        return {}

    sentences = split_sentences(text)
    total_sentences = max(len(sentences), 1)
    avg_sentence_len = total_words / total_sentences

    paragraphs = [p for p in text.split("\n\n") if p.strip()]
    total_paragraphs = max(len(paragraphs), 1)

    found_a1 = [c for c in A1_CONNECTORS if re.search(r'\b' + re.escape(c) + r'\b', text.lower())]
    found_b1 = [c for c in B1_CONNECTORS if re.search(r'\b' + re.escape(c) + r'\b', text.lower())]
    found_b2 = [c for c in B2_CONNECTORS if re.search(r'\b' + re.escape(c) + r'\b', text.lower())]
    found_c1 = [c for c in C1_C2_CONNECTORS if re.search(r'\b' + re.escape(c) + r'\b', text.lower())]
    found_phrasals = [pv for pv in B1_PHRASAL_VERBS if pv in text.lower()]
    found_advanced = [w for w in ADVANCED_C1_C2_WORDS if w in words]

    detected_grammar = []
    for pattern, name in B1_GRAMMAR_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            detected_grammar.append(name)
    for pattern, name in C1_C2_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            detected_grammar.append(name)

    syllable_count = sum(max(1, len(re.findall(r'[aeiouy]+', w))) for w in words)
    asl = avg_sentence_len
    asw = syllable_count / total_words
    fre = 206.835 - (1.015 * asl) - (84.6 * asw)

    return {
        "total_words": total_words,
        "total_sentences": total_sentences,
        "total_paragraphs": total_paragraphs,
        "avg_sentence_length": round(avg_sentence_len, 1),
        "flesch_reading_ease": round(fre, 1),
        "b1_connectors": found_b1,
        "b2_connectors": found_b2,
        "c1_connectors": found_c1,
        "phrasal_verbs": found_phrasals,
        "advanced_words": found_advanced,
        "grammar_features": detected_grammar,
        "sentences": sentences,
    }

async def evaluate_b1(content: str, title: str = "Untitled", category: str = "stories", writing_id: str = None, target_level: str = "B1") -> ReviewResponse:
    target_level = (target_level or "B1").upper()
    metrics = analyze_linguistics(content, category)
    
    if not metrics or metrics.get("total_words", 0) < 15:
        return ReviewResponse(
            id=f"rev-{uuid.uuid4().hex[:8]}",
            writing_id=writing_id,
            title=title,
            category=category,
            target_level=target_level,
            estimated_level="A1",
            suitability_verdict=f"Below {target_level} (Text too brief for full assessment)",
            is_suitable_b1=False,
            suitability_score=35,
            overall_explanation="The submitted text is too short to provide a reliable CEFR evaluation. Write at least 40-50 words.",
            observations=ReviewObservations(
                vocabulary=CategoryObservation(score=40, rating="Below Target", summary="Insufficient sample size to assess lexical range."),
                grammar=CategoryObservation(score=40, rating="Below Target", summary="Write more sentences to evaluate tense usage."),
                sentence_length=CategoryObservation(score=40, rating="Below Target", summary="Sentence patterns could not be measured accurately."),
                organization=CategoryObservation(score=40, rating="Below Target", summary="Needs at least one structured paragraph.")
            ),
            encouraging_suggestions=["Add more details and descriptions to reach at least 60-100 words."],
            sentence_suggestions=[],
            is_demo=True,
            ai_engine_used="Luna Linguistic Evaluator"
        )

    # 1. Live Gemini model evaluation
    if settings.GEMINI_API_KEY:
        try:
            logger.info(f"Evaluating CEFR (Target: {target_level}) via live Gemini model...")
            return await _evaluate_with_gemini(content, title, category, writing_id, target_level, metrics)
        except Exception as e:
            logger.warning(f"Gemini evaluation failed: {e}. Falling back to linguistic engine.")

    # 2. Live OpenAI model evaluation
    if settings.OPENAI_API_KEY:
        try:
            logger.info(f"Evaluating CEFR (Target: {target_level}) via live OpenAI model...")
            return await _evaluate_with_openai(content, title, category, writing_id, target_level, metrics)
        except Exception as e:
            logger.warning(f"OpenAI evaluation failed: {e}. Falling back to linguistic engine.")

    # 3. Fallback to heuristic CEFR analysis
    return _evaluate_heuristic_all_levels(content, title, category, writing_id, target_level, metrics)

def _evaluate_heuristic_all_levels(content: str, title: str, category: str, writing_id: str, target_level: str, m: Dict[str, Any]) -> ReviewResponse:
    asl = m["avg_sentence_length"]
    fre = m["flesch_reading_ease"]
    b1_conns = m["b1_connectors"]
    b2_conns = m["b2_connectors"]
    c1_conns = m["c1_connectors"]
    phrasals = m["phrasal_verbs"]
    grammar_feats = m["grammar_features"]
    advanced = m["advanced_words"]
    sentences = m["sentences"]

    # Calculate CEFR points
    cefr_points = 0
    if asl < 8:
        cefr_points += 1 # A1
    elif asl < 12:
        cefr_points += 2 # A2
    elif asl <= 19:
        cefr_points += 3 # B1
    elif asl <= 25:
        cefr_points += 4 # B2
    else:
        cefr_points += 5 # C1/C2

    if len(b1_conns) >= 2: cefr_points += 2
    if len(b2_conns) >= 1: cefr_points += 3
    if len(c1_conns) >= 1: cefr_points += 4
    if len(phrasals) >= 1: cefr_points += 2
    if len(advanced) >= 1: cefr_points += 3 * len(advanced)
    if len(grammar_feats) >= 3: cefr_points += 3

    # Level classification
    if cefr_points <= 3:
        estimated_level = "A1"
    elif cefr_points <= 6:
        estimated_level = "A2"
    elif cefr_points <= 11:
        estimated_level = "B1"
    elif cefr_points <= 16:
        estimated_level = "B2"
    elif cefr_points <= 22:
        estimated_level = "C1"
    else:
        estimated_level = "C2"

    level_order = ["A1", "A2", "B1", "B2", "C1", "C2"]
    est_idx = level_order.index(estimated_level)
    target_idx = level_order.index(target_level) if target_level in level_order else 2

    # Suitability relative to target_level
    if est_idx == target_idx:
        suitability_score = 88
        suitability_verdict = f"Broadly suitable for Cambridge {target_level} learners"
        is_suitable = True
        explanation = f"Your text aligns strongly with CEFR {target_level} benchmarks. The vocabulary, sentence pacing, and grammatical structures match the expected standards."
    elif est_idx > target_idx:
        suitability_score = 82
        suitability_verdict = f"Above {target_level} (Currently at {estimated_level} level)"
        is_suitable = True
        explanation = f"Your text demonstrates language characteristic of {estimated_level}, which is more advanced than the target {target_level} level. It is fluent and sophisticated."
    else:
        suitability_score = 55
        suitability_verdict = f"Below {target_level} (Currently at {estimated_level} level)"
        is_suitable = False
        explanation = f"This writing matches CEFR {estimated_level}. To reach {target_level}, try introducing more varied sentence structures and level-appropriate transition words."

    # Specific observations
    obs = ReviewObservations(
        vocabulary=CategoryObservation(
            score=min(95, max(45, 60 + cefr_points * 2)),
            rating=f"Matches {estimated_level}",
            summary=f"Lexical range reflects CEFR {estimated_level}.",
            strengths=[f"Appropriate {estimated_level} topic vocabulary."],
            areas_for_growth=[f"Aim for {target_level} lexical variety."] if est_idx < target_idx else ["Maintain natural word collocations."]
        ),
        grammar=CategoryObservation(
            score=min(95, max(45, 60 + len(grammar_feats) * 8)),
            rating=f"Matches {estimated_level}",
            summary=f"Grammar demonstrates {estimated_level} control.",
            strengths=[f"Accurate structures: {', '.join(grammar_feats[:2]) or 'basic clause agreement'}"],
            areas_for_growth=[f"Incorporate grammar structures characteristic of {target_level}."]
        ),
        sentence_length=CategoryObservation(
            score=75,
            rating=f"{asl} words/sentence",
            summary=f"Average sentence length is {asl} words.",
            strengths=["Sentence flow is readable."],
            areas_for_growth=["Vary sentence rhythms."]
        ),
        organization=CategoryObservation(
            score=75,
            rating=f"Matches {estimated_level}",
            summary=f"Paragraph and cohesion organization aligns with {estimated_level}.",
            strengths=[f"Clear structure with {m['total_paragraphs']} paragraphs."],
            areas_for_growth=[f"Use {target_level} linking devices."]
        )
    )

    # Sentence suggestions
    sentence_suggestions: List[SentenceSuggestion] = []
    for idx, s in enumerate(sentences[:2]):
        words_in_s = len(s.split())
        if words_in_s > 26:
            sentence_suggestions.append(SentenceSuggestion(
                id=f"sug-{idx}",
                original=s,
                suggested=s.replace(", and ", ". In addition, "),
                reason=f"Splitting long sentences enhances readability for CEFR {target_level}.",
                category="length"
            ))

    return ReviewResponse(
        id=f"rev-{uuid.uuid4().hex[:8]}",
        writing_id=writing_id,
        title=title,
        category=category,
        target_level=target_level,
        estimated_level=estimated_level,
        suitability_verdict=suitability_verdict,
        is_suitable_b1=(estimated_level == "B1"),
        suitability_score=suitability_score,
        overall_explanation=explanation,
        observations=obs,
        encouraging_suggestions=[
            f"Your writing effectively communicates your ideas at the {estimated_level} level.",
            f"To excel at {target_level}, focus on expanding cohesive linkers and topic adjectives."
        ],
        sentence_suggestions=sentence_suggestions,
        metrics={"avg_sentence_length": asl, "total_words": m["total_words"]},
        is_demo=True,
        ai_engine_used="Luna CEFR Linguistic Engine (Demonstration Mode)"
    )

def _sanitize_ai_response(parsed: dict, writing_id: str, title: str, category: str, target_level: str, engine_name: str) -> ReviewResponse:
    parsed["id"] = f"rev-{uuid.uuid4().hex[:8]}"
    parsed["writing_id"] = writing_id
    parsed["title"] = title
    parsed["category"] = category
    parsed["target_level"] = target_level
    parsed["is_demo"] = False
    parsed["ai_engine_used"] = engine_name
    parsed["disclaimer"] = (
        "Educational estimate based on Cambridge CEFR benchmarks (A1–C2); "
        "not an official Cambridge Assessment English exam result or guarantee."
    )
    parsed["data_privacy_note"] = (
        f"Your text was evaluated securely via {engine_name}. Submissions are processed without "
        "being used for public training, and stored only in your private Luna review history."
    )

    obs_data = parsed.get("observations", {})
    for k in ["vocabulary", "grammar", "sentence_length", "organization"]:
        if k not in obs_data or not isinstance(obs_data[k], dict):
            obs_data[k] = {
                "score": 80,
                "rating": "Solid Match",
                "summary": f"Appropriate {k.replace('_', ' ')} consistency.",
                "strengths": ["Clear expression."],
                "areas_for_growth": [],
                "key_examples": []
            }
        else:
            obs_data[k].setdefault("score", 80)
            obs_data[k].setdefault("rating", "Solid Match")
            obs_data[k].setdefault("summary", f"{k.capitalize()} analysis.")
            obs_data[k].setdefault("strengths", [])
            obs_data[k].setdefault("areas_for_growth", [])
            obs_data[k].setdefault("key_examples", [])
    parsed["observations"] = obs_data

    sugs = []
    for i, s in enumerate(parsed.get("sentence_suggestions", [])):
        if isinstance(s, dict) and "original" in s and "suggested" in s:
            sugs.append({
                "id": s.get("id") or f"sug-{i+1}",
                "original": s.get("original", ""),
                "suggested": s.get("suggested", ""),
                "reason": s.get("reason", "Enhances sentence quality."),
                "category": s.get("category", "clarity")
            })
    parsed["sentence_suggestions"] = sugs
    parsed["encouraging_suggestions"] = parsed.get("encouraging_suggestions") or [
        "Your writing conveys your ideas in a clear and engaging manner.",
        "Continue practicing a variety of cohesive discourse markers to connect sentences."
    ]

    return ReviewResponse(**parsed)

async def _evaluate_with_gemini(content: str, title: str, category: str, writing_id: str, target_level: str, m: Dict[str, Any]) -> ReviewResponse:
    prompt = f"""You are a Cambridge Assessment English CEFR expert evaluator.
Evaluate the following English text across the complete CEFR spectrum: A1, A2, B1, B2, C1, or C2.
The user's chosen target level is: {target_level}.

Category: {category}
Title: {title}

Text:
\"\"\"{content}\"\"\"

Determine:
1. "estimated_level": Exact CEFR level (must be one of: "A1", "A2", "B1", "B2", "C1", "C2").
2. "suitability_verdict": Clear indication whether the text is suitable for target level {target_level} (e.g. "Suitable for Cambridge {target_level}", "Above target {target_level}", "Below target {target_level}").
3. "suitability_score": Score 0-100 indicating how well it matches {target_level}.
4. "overall_explanation": A concise explanation of the assessment and how it compares to CEFR {target_level} benchmarks.
5. "observations": Specific details for vocabulary, grammar, sentence_length, organization.
6. "encouraging_suggestions": 2-3 practical tips for this writer to progress.
7. "sentence_suggestions": Optional list of actionable sentence edits with "original", "suggested", "reason", and "category".

Output valid JSON matching this exact structure:
{{
  "estimated_level": "{target_level}",
  "suitability_verdict": "Broadly suitable for Cambridge {target_level} learners",
  "is_suitable_b1": true,
  "suitability_score": 85,
  "overall_explanation": "...",
  "observations": {{
    "vocabulary": {{"score": 85, "rating": "Solid Match", "summary": "...", "strengths": ["..."], "areas_for_growth": ["..."], "key_examples": ["..."]}},
    "grammar": {{"score": 85, "rating": "Solid Match", "summary": "...", "strengths": ["..."], "areas_for_growth": ["..."], "key_examples": ["..."]}},
    "sentence_length": {{"score": 80, "rating": "Balanced", "summary": "...", "strengths": ["..."], "areas_for_growth": ["..."], "key_examples": ["..."]}},
    "organization": {{"score": 85, "rating": "Structured", "summary": "...", "strengths": ["..."], "areas_for_growth": ["..."], "key_examples": ["..."]}}
  }},
  "encouraging_suggestions": ["..."],
  "sentence_suggestions": [
    {{"id": "sug-1", "original": "exact sentence from text", "suggested": "improved sentence", "reason": "why this helps", "category": "clarity"}}
  ]
}}
Do not include markdown wrappers or anything outside the JSON.
"""
    model_name = settings.AI_MODEL_NAME if "gemini" in settings.AI_MODEL_NAME else "gemini-3-flash-preview"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={settings.GEMINI_API_KEY}"
    payload = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.2, "responseMimeType": "application/json"}
    }).encode("utf-8")
    
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
    import time
    for attempt in range(2):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                res_data = json.loads(resp.read().decode("utf-8"))
                text_out = res_data["candidates"][0]["content"]["parts"][0]["text"]
                parsed = json.loads(text_out)
                return _sanitize_ai_response(parsed, writing_id, title, category, target_level, f"Google Gemini ({model_name})")
        except urllib.error.HTTPError as e:
            if e.code in (500, 503) and attempt == 0:
                time.sleep(1.5)
                continue
            raise

async def _evaluate_with_openai(content: str, title: str, category: str, writing_id: str, target_level: str, m: Dict[str, Any]) -> ReviewResponse:
    prompt = f"""You are a Cambridge Assessment English CEFR expert evaluator.
Evaluate the following English text across the complete CEFR spectrum: A1, A2, B1, B2, C1, or C2.
The user's target level is: {target_level}.

Category: {category}
Title: {title}

Text:
\"\"\"{content}\"\"\"

Output valid JSON matching this exact structure:
{{
  "estimated_level": "{target_level}",
  "suitability_verdict": "Broadly suitable for Cambridge {target_level} learners",
  "is_suitable_b1": true,
  "suitability_score": 85,
  "overall_explanation": "...",
  "observations": {{
    "vocabulary": {{"score": 85, "rating": "Solid Match", "summary": "...", "strengths": ["..."], "areas_for_growth": ["..."], "key_examples": ["..."]}},
    "grammar": {{"score": 85, "rating": "Solid Match", "summary": "...", "strengths": ["..."], "areas_for_growth": ["..."], "key_examples": ["..."]}},
    "sentence_length": {{"score": 80, "rating": "Balanced", "summary": "...", "strengths": ["..."], "areas_for_growth": ["..."], "key_examples": ["..."]}},
    "organization": {{"score": 85, "rating": "Structured", "summary": "...", "strengths": ["..."], "areas_for_growth": ["..."], "key_examples": ["..."]}}
  }},
  "encouraging_suggestions": ["..."],
  "sentence_suggestions": [
    {{"id": "sug-1", "original": "exact sentence from text", "suggested": "improved sentence", "reason": "why this helps", "category": "clarity"}}
  ]
}}
Do not include markdown wrappers or anything outside the JSON.
"""
    model_name = settings.AI_MODEL_NAME if "gpt" in settings.AI_MODEL_NAME else "gpt-4o-mini"
    url = "https://api.openai.com/v1/chat/completions"
    payload = json.dumps({
        "model": model_name,
        "messages": [
            {"role": "system", "content": "You are a Cambridge Assessment English CEFR evaluator. You output pure JSON only."},
            {"role": "user", "content": prompt}
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.2
    }).encode("utf-8")

    req = urllib.request.Request(
        url,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {settings.OPENAI_API_KEY}"
        }
    )

    with urllib.request.urlopen(req, timeout=20) as resp:
        res_data = json.loads(resp.read().decode("utf-8"))
        text_out = res_data["choices"][0]["message"]["content"]
        parsed = json.loads(text_out)
        return _sanitize_ai_response(parsed, writing_id, title, category, target_level, f"OpenAI ({model_name})")
