"""Sinh audio đọc tiếng Anh từ văn bản bằng Google Text-to-Speech (gTTS).
Miễn phí, không cần API key. Dùng cho các bài Listening: lấy transcript
trong reading_text -> tạo file mp3 -> gán vào lesson.audio_file.
"""
from pathlib import Path
from django.conf import settings


def generate_lesson_audio(lesson, lang='en', force=False):
    """Tạo file audio cho 1 bài học Listening.

    - lesson: đối tượng Lesson
    - lang: ngôn ngữ giọng đọc (mặc định 'en')
    - force: True = tạo lại dù đã có audio

    Trả về tên file (relative) nếu tạo thành công, None nếu bỏ qua.
    """
    text = (lesson.reading_text or '').strip()
    # Bỏ qua nếu không có transcript thật (placeholder cũ bắt đầu bằng '[')
    if not text or text.startswith('['):
        return None
    # Đã có audio và không ép tạo lại -> bỏ qua
    if lesson.audio_file and not force:
        return lesson.audio_file.name

    from gtts import gTTS

    audio_dir = Path(settings.MEDIA_ROOT) / 'lesson_audio'
    audio_dir.mkdir(parents=True, exist_ok=True)

    filename = f'lesson_{lesson.id}.mp3'
    filepath = audio_dir / filename

    tts = gTTS(text=text, lang=lang, slow=False)
    tts.save(str(filepath))

    # Gán đường dẫn tương đối vào field (file đã nằm đúng thư mục upload_to)
    lesson.audio_file.name = f'lesson_audio/{filename}'
    lesson.save(update_fields=['audio_file'])
    return lesson.audio_file.name
