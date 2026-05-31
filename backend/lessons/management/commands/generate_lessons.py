"""Generate many lessons automatically using Gemini AI.

Examples:
    python manage.py generate_lessons --type reading --count 50 --delay 2
    python manage.py generate_lessons --type listening --count 50 --delay 2 --audio

Notes:
- Needs GEMINI_API_KEY in .env and an internet connection.
- The free Gemini tier has rate limits; use --delay (seconds between calls) to avoid 429 errors.
"""
import time
from django.core.management.base import BaseCommand
from lessons.models import Lesson, Question, AnswerOption
from ai_services.gemini_client import GeminiClient
from ai_services.tts import generate_lesson_audio

LEVELS = ['Beginner', 'Intermediate', 'Advanced']

READING_TOPICS = [
    'Travel and tourism', 'Healthy food and nutrition', 'Modern technology', 'The environment',
    'Famous scientists', 'World history', 'Sports and exercise', 'Music and art',
    'Money and the economy', 'Animals and wildlife', 'Education and learning', 'Space and astronomy',
    'Daily routines', 'Friendship and family', 'Books and reading', 'Climate and weather',
    'Jobs and careers', 'Festivals and traditions', 'Cities and architecture', 'The human body',
]

LISTENING_TOPICS = [
    'At a restaurant', 'A phone conversation', 'At the doctor', 'Booking a trip',
    'A job interview', 'Shopping for clothes', 'Asking for directions', 'A weather forecast',
    'A radio advertisement', 'Making plans with a friend', 'At the bank', 'A short news report',
    'Ordering coffee', 'A hotel check-in', 'A university lecture', 'A train announcement',
    'A cooking show', 'Talking about hobbies', 'A museum guide', 'Customer service call',
]


class Command(BaseCommand):
    help = 'Generate reading/listening lessons using Gemini AI.'

    def add_arguments(self, parser):
        parser.add_argument('--type', choices=['reading', 'listening'], required=True)
        parser.add_argument('--count', type=int, default=10, help='Number of lessons to create')
        parser.add_argument('--delay', type=float, default=2.0, help='Seconds to wait between AI calls (avoid rate limit)')
        parser.add_argument('--audio', action='store_true', help='Also generate TTS audio (listening only)')

    def handle(self, *args, **options):
        lesson_type = options['type']
        count = options['count']
        delay = options['delay']
        make_audio = options['audio']

        try:
            client = GeminiClient()
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Cannot init Gemini: {e}'))
            return

        topics = READING_TOPICS if lesson_type == 'reading' else LISTENING_TOPICS
        # Tiếp tục order từ giá trị lớn nhất hiện có, tránh trùng
        base_order = Lesson.objects.order_by('-order').values_list('order', flat=True).first() or 0

        created = 0
        for i in range(count):
            topic = topics[i % len(topics)]
            level = LEVELS[i % len(LEVELS)]
            try:
                data = client.generate_lesson_content(lesson_type, level, topic)

                lesson = Lesson.objects.create(
                    title=str(data.get('title', topic))[:255],
                    lesson_type=lesson_type,
                    level=level,
                    tag=str(data.get('tag', ''))[:50],
                    duration=str(data.get('duration', ''))[:20],
                    reading_text=data.get('passage', ''),
                    order=base_order + i + 1,
                )

                for q_order, q in enumerate(data.get('questions', []), start=1):
                    question = Question.objects.create(lesson=lesson, text=q.get('text', ''), order=q_order)
                    options = q.get('options', [])
                    # An toàn: đảm bảo có đúng 1 đáp án đúng
                    if not any(o.get('is_correct') for o in options) and options:
                        options[0]['is_correct'] = True
                    for o_order, opt in enumerate(options, start=1):
                        AnswerOption.objects.create(
                            question=question,
                            text=str(opt.get('text', ''))[:500],
                            is_correct=bool(opt.get('is_correct')),
                            order=o_order,
                        )

                if lesson_type == 'listening' and make_audio:
                    try:
                        generate_lesson_audio(lesson)
                    except Exception as e:
                        self.stdout.write(self.style.WARNING(f'    (audio failed: {e})'))

                created += 1
                self.stdout.write(self.style.SUCCESS(f'  [{created}/{count}] {lesson.title}  ({level} / {topic})'))
            except Exception as e:
                msg = str(e)
                # Hết quota theo ngày -> dừng hẳn, không cố thêm
                if '429' in msg or 'RESOURCE_EXHAUSTED' in msg:
                    self.stdout.write(self.style.WARNING(
                        '\n  Het quota Gemini (free tier ~20 request/ngay). '
                        'Da tao duoc {} bai. Hay thu lai vao ngay mai, hoac dung lenh seed offline.'.format(created)
                    ))
                    break
                self.stdout.write(self.style.ERROR(f'  FAIL ({topic}): {e}'))

            if delay:
                time.sleep(delay)

        self.stdout.write(self.style.SUCCESS(f'Done. Created {created} {lesson_type} lessons.'))
