from django.db import models
from django.contrib.auth.models import User


class SpeakingTopic(models.Model):
    PART_CHOICES = [
        ('Part 1', 'Part 1 - Introduction & Interview'),
        ('Part 2', 'Part 2 - Long Turn'),
        ('Part 3', 'Part 3 - Discussion'),
    ]

    title = models.CharField(max_length=255)
    part = models.CharField(max_length=10, choices=PART_CHOICES, default='Part 1')
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['part', 'order']

    def __str__(self):
        return f"[{self.part}] {self.title}"


class SpeakingQuestion(models.Model):
    topic = models.ForeignKey(SpeakingTopic, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.question_text[:60]}"


class SpeakingAttempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='speaking_attempts')
    topic = models.ForeignKey(SpeakingTopic, on_delete=models.CASCADE, null=True, blank=True)
    question = models.ForeignKey(SpeakingQuestion, on_delete=models.SET_NULL, null=True, blank=True)
    audio_file = models.FileField(upload_to='speaking_recordings/')
    transcript = models.TextField(blank=True)
    score = models.FloatField(default=0)
    fluency = models.IntegerField(default=0)
    pronunciation = models.IntegerField(default=0)
    grammar = models.IntegerField(default=0)
    lexical_resource = models.IntegerField(default=0)
    feedback = models.TextField(blank=True)
    fluency_feedback = models.TextField(blank=True)
    pronunciation_feedback = models.TextField(blank=True)
    grammar_feedback = models.TextField(blank=True)
    lexical_feedback = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.score}"
