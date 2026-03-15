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
        self.model = 'gemini-2.5-flash-lite'

    def _generate(self, prompt):
        """Call Gemini API and return the response text."""
        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
        )
        return response.text

    def assess_speaking(self, transcript, topic_question=None):
        prompt = f"""You are an IELTS speaking examiner. Evaluate the following spoken response based on the 4 official IELTS Speaking criteria.

Topic question: {topic_question or 'General speaking'}
Student's response transcript: "{transcript}"

Provide your assessment as a JSON object with EXACTLY these fields:
{{
    "score": <float 0-9, overall band score>,
    "fluency": <int 1-9>,
    "pronunciation": <int 1-9>,
    "grammar": <int 1-9>,
    "lexical_resource": <int 1-9>,
    "fluency_feedback": "<1-2 sentences about fluency & coherence>",
    "pronunciation_feedback": "<1-2 sentences about pronunciation>",
    "grammar_feedback": "<1-2 sentences about grammatical range & accuracy>",
    "lexical_feedback": "<1-2 sentences about lexical resource / vocabulary usage>",
    "feedback": "<2-3 sentences of overall constructive feedback>"
}}

Return ONLY the JSON, no other text."""

        try:
            return _parse_json_response(self._generate(prompt))
        except Exception:
            return {
                'score': 5.0, 'fluency': 5, 'pronunciation': 5, 'grammar': 5, 'lexical_resource': 5,
                'fluency_feedback': '', 'pronunciation_feedback': '', 'grammar_feedback': '', 'lexical_feedback': '',
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

    def explain_answers(self, passage, questions_answers):
        """Generate explanations for quiz answers with evidence from the passage."""
        qa_text = '\n'.join([
            f'{i}. Q: {qa["question"]} -> Correct: {qa["correct_answer"]}'
            for i, qa in enumerate(questions_answers)
        ])

        prompt = f"""You are an English teacher. For each question below, explain WHY the correct answer is right.
Quote the relevant evidence/sentence from the passage to support your explanation.

Passage: "{passage}"

Questions and correct answers:
{qa_text}

Return a JSON object where keys are the question index (as string) and values are explanation strings.
Each explanation should:
1. State why the answer is correct
2. Quote the relevant part from the passage as evidence (use quotation marks)

Example format:
{{
    "0": "The answer is correct because the passage states: \\"quote from passage\\". This shows that...",
    "1": "According to the passage: \\"relevant quote\\". Therefore..."
}}

Return ONLY the JSON, no other text."""

        try:
            return _parse_json_response(self._generate(prompt))
        except Exception:
            return {}

    def grammar_correction(self, text):
        prompt = f"""You are a strict English grammar teacher. Carefully check EVERY word in this text for ALL types of errors including:
- Subject-verb agreement (e.g. "i goes" should be "I go")
- Capitalization (e.g. "i" should be "I")
- Spelling mistakes
- Wrong word usage (e.g. "everyday" vs "every day")
- Tense errors
- Article errors
- Punctuation errors

Text: "{text}"

Be very thorough. Even small errors like lowercase "i" or wrong verb forms MUST be caught.

Return JSON:
{{
    "corrected_text": "<the fully corrected text>",
    "errors": [
        {{"original": "<exact wrong word/phrase>", "correction": "<correct version>", "rule": "<brief grammar rule explanation>"}}
    ],
    "is_correct": <true ONLY if there are absolutely zero errors, false otherwise>
}}

Return ONLY the JSON, no other text."""

        try:
            return _parse_json_response(self._generate(prompt))
        except Exception as e:
            error_msg = str(e)
            if '429' in error_msg or 'RESOURCE_EXHAUSTED' in error_msg:
                return {
                    'corrected_text': text,
                    'errors': [],
                    'is_correct': False,
                    'error': 'AI rate limit reached. Please try again in a minute.',
                }
            return {
                'corrected_text': text,
                'errors': [],
                'is_correct': False,
                'error': 'AI service temporarily unavailable. Please try again.',
            }
