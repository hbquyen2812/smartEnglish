import os
import json
import re
from google import genai
from dotenv import load_dotenv

load_dotenv()


def _parse_json_response(text):
    """Extract JSON from Gemini response, handling markdown code blocks."""
    cleaned = re.sub(r'^```(?:json)?\s*', '', text.strip())
    cleaned = re.sub(r'\s*```$', '', cleaned)
    return json.loads(cleaned)


class GeminiClient:
    def __init__(self):
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key or api_key == 'your_gemini_api_key_here':
            raise ValueError("GEMINI_API_KEY is not configured. Get one from https://aistudio.google.com/apikey")
        self.client = genai.Client(api_key=api_key)
        self.model = 'gemini-2.5-flash'

    def _generate(self, prompt):
        """Call Gemini API and return the response text."""
        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
        )
        return response.text

    def assess_speaking(self, transcript, topic_question=None):
        prompt = f"""You are an IELTS speaking examiner. Evaluate the following spoken response.

Topic question: {topic_question or 'General speaking'}
Student's response transcript: "{transcript}"

Provide your assessment as a JSON object with EXACTLY these fields:
{{
    "score": <float 0-9, overall band score>,
    "fluency": <int 1-9>,
    "pronunciation": <int 1-9>,
    "grammar": <int 1-9>,
    "feedback": "<2-3 sentences of constructive feedback>"
}}

Return ONLY the JSON, no other text."""

        try:
            return _parse_json_response(self._generate(prompt))
        except Exception:
            return {
                'score': 5.0, 'fluency': 5, 'pronunciation': 5, 'grammar': 5,
                'feedback': 'AI assessment temporarily unavailable. Please try again.',
            }

    def summarize_and_extract_vocab(self, text):
        prompt = f"""Analyze this English text for a language learner:

Text: "{text}"

Return a JSON object with:
{{
    "summary": "<3-4 sentence summary>",
    "vocabulary": [
        {{"word": "...", "definition": "...", "example_sentence": "...", "part_of_speech": "..."}},
        ... (exactly 10 words)
    ]
}}

Return ONLY the JSON, no other text."""

        try:
            return _parse_json_response(self._generate(prompt))
        except Exception:
            return {
                'summary': 'Could not process the text. Please try again.',
                'vocabulary': [],
            }

    def assess_writing(self, essay, topic=""):
        prompt = f"""You are an IELTS writing examiner. Assess this essay.

Topic: {topic or 'General topic'}
Essay: "{essay}"

Score on these 4 IELTS criteria (each 1-9):
1. Task Achievement
2. Coherence and Cohesion
3. Lexical Resource
4. Grammatical Range and Accuracy

Return JSON:
{{
    "overall_score": <float>,
    "task_achievement": <int 1-9>,
    "coherence_cohesion": <int 1-9>,
    "lexical_resource": <int 1-9>,
    "grammar_accuracy": <int 1-9>,
    "feedback": "<detailed feedback paragraph>",
    "corrections": [
        {{"original": "...", "corrected": "...", "explanation": "..."}}
    ]
}}

Return ONLY the JSON."""

        try:
            return _parse_json_response(self._generate(prompt))
        except Exception:
            return {
                'overall_score': 0,
                'task_achievement': 0, 'coherence_cohesion': 0,
                'lexical_resource': 0, 'grammar_accuracy': 0,
                'feedback': 'AI assessment temporarily unavailable. Please try again.',
                'corrections': [],
            }

    def grammar_correction(self, text):
        prompt = f"""Check this English text for grammar errors:

Text: "{text}"

Return JSON:
{{
    "corrected_text": "...",
    "errors": [
        {{"original": "...", "correction": "...", "rule": "..."}}
    ],
    "is_correct": true/false
}}

Return ONLY the JSON."""

        try:
            return _parse_json_response(self._generate(prompt))
        except Exception:
            return {
                'corrected_text': text,
                'errors': [],
                'is_correct': True,
            }
