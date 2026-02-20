from django.db import models


class Lesson(models.Model):
    LESSON_TYPE_CHOICES = [
        ('listening', 'Listening'),
        ('reading', 'Reading'),
    ]
    LEVEL_CHOICES = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ]

    title = models.CharField(max_length=255)
    lesson_type = models.CharField(max_length=20, choices=LESSON_TYPE_CHOICES)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='Beginner')
    tag = models.CharField(max_length=50, blank=True)
    image = models.URLField(blank=True, null=True)
    duration = models.CharField(max_length=20, blank=True)
    reading_text = models.TextField(blank=True)
    audio_file = models.FileField(upload_to='lesson_audio/', blank=True, null=True)
    is_recommended = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"[{self.lesson_type}] {self.title}"


class Question(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Q{self.order}: {self.text[:50]}"


class AnswerOption(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    text = models.CharField(max_length=500)
    is_correct = models.BooleanField(default=False)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.text[:50]
