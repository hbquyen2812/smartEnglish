"""Management command: sinh audio TTS cho tất cả bài Listening.

Dùng:
    python manage.py generate_audio          # chỉ tạo cho bài chưa có audio
    python manage.py generate_audio --force  # tạo lại toàn bộ
"""
from django.core.management.base import BaseCommand
from lessons.models import Lesson
from ai_services.tts import generate_lesson_audio


class Command(BaseCommand):
    help = 'Sinh audio đọc (Google TTS) cho các bài Listening từ transcript reading_text.'

    def add_arguments(self, parser):
        parser.add_argument('--force', action='store_true', help='Tạo lại audio kể cả khi đã có')

    def handle(self, *args, **options):
        force = options['force']
        lessons = Lesson.objects.filter(lesson_type='listening')
        if not lessons:
            self.stdout.write('Không có bài Listening nào.')
            return

        count = 0
        for lesson in lessons:
            try:
                result = generate_lesson_audio(lesson, force=force)
                if result:
                    count += 1
                    self.stdout.write(self.style.SUCCESS(f'  OK   {lesson.title} -> {result}'))
                else:
                    self.stdout.write(f'  SKIP {lesson.title} (chưa có transcript hoặc đã có audio)')
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'  FAIL {lesson.title}: {e}'))

        self.stdout.write(self.style.SUCCESS(f'Hoàn tất. Đã tạo {count} file audio.'))
