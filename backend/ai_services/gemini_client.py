import os
import json
import re
from groq import Groq
from dotenv import load_dotenv

load_dotenv()


def _parse_json_response(text):
    """Extract JSON from Gemini response, handling markdown code blocks."""
    cleaned = re.sub(r'^```(?:json)?\s*', '', text.strip())
    cleaned = re.sub(r'\s*```$', '', cleaned)
    return json.loads(cleaned)


class GeminiClient:
    """Tên giữ nguyên cho tương thích, nhưng động cơ AI nay là Groq
    (miễn phí, nhanh, hạn mức cao hơn Gemini rất nhiều)."""

    def __init__(self):
        api_key = os.getenv('GROQ_API_KEY')
        if not api_key:
            raise ValueError("GROQ_API_KEY is not configured. Get one free at https://console.groq.com")
        self.client = Groq(api_key=api_key)
        self.model = 'llama-3.3-70b-versatile'

    def _generate(self, prompt):
        """Call Groq API and return the response text (ép trả JSON thuần)."""
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{'role': 'user', 'content': prompt}],
            response_format={'type': 'json_object'},
            temperature=0.6,
        )
        return response.choices[0].message.content

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

    def speaking_chat(self, history, topic=None):
        """Chatbot hội thoại: AI đóng vai giám khảo IELTS, trả lời theo lượt
        và sửa lỗi ngữ pháp/từ vựng trong câu vừa rồi của người dùng.

        history: list các dict {"role": "user"|"assistant", "content": "..."}
        """
        # Ghép lịch sử hội thoại thành text
        convo = '\n'.join([
            f'{"Student" if m["role"] == "user" else "Examiner"}: {m["content"]}'
            for m in history
        ])
        last_user = next((m['content'] for m in reversed(history) if m['role'] == 'user'), '')

        prompt = f"""You are a friendly IELTS Speaking examiner having a natural conversation with a student.
Topic of this session: {topic or 'free conversation / getting to know each other'}

Conversation so far:
{convo}

Your job:
1. Reply naturally as the examiner: keep it SHORT (1-3 sentences), be encouraging, and ALWAYS end with a follow-up question to keep the conversation going.
2. Instantly check the student's LAST message for grammar/vocabulary/word-choice mistakes.

Return ONLY a JSON object:
{{
    "reply": "<your short conversational reply ending with a question>",
    "has_error": <true if the student's last message had any mistake, else false>,
    "correction": "<if has_error: the corrected version of their sentence; else empty string>",
    "note": "<if has_error: 1 short sentence explaining the fix; else empty string>"
}}

The student's last message was: "{last_user}"
Return ONLY the JSON, no other text."""

        try:
            data = _parse_json_response(self._generate(prompt))
            return {
                'reply': data.get('reply', "Let's continue. Can you tell me more?"),
                'has_error': bool(data.get('has_error', False)),
                'correction': data.get('correction', ''),
                'note': data.get('note', ''),
            }
        except Exception:
            return {
                'reply': "Sorry, I had trouble responding. Could you say that again?",
                'has_error': False,
                'correction': '',
                'note': '',
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

    def generate_lesson_content(self, lesson_type, level, topic):
        """Sinh nội dung 1 bài học (Reading hoặc Listening) bằng AI.
        Trả về dict: {title, tag, duration, passage, questions:[{text, options:[{text,is_correct}]}]}
        """
        kind = (
            'a short reading passage in article style'
            if lesson_type == 'reading'
            else 'a natural spoken transcript (as if a person is speaking), for a listening exercise'
        )
        prompt = f"""Create one English learning lesson for a {level}-level learner.
Topic: {topic}

Write {kind} of about 120-180 words, appropriate for {level} learners.
Then write EXACTLY 3 multiple-choice comprehension questions. Each question has EXACTLY 3 options,
and EXACTLY ONE option is correct.

Return ONLY this JSON (no extra text):
{{
    "title": "<short lesson title>",
    "tag": "<one or two word category, e.g. Travel, Science>",
    "duration": "<e.g. 4 min>",
    "passage": "<the passage or transcript text>",
    "questions": [
        {{"text": "<question>", "options": [
            {{"text": "<option>", "is_correct": true}},
            {{"text": "<option>", "is_correct": false}},
            {{"text": "<option>", "is_correct": false}}
        ]}}
    ]
}}"""
        return _parse_json_response(self._generate(prompt))
