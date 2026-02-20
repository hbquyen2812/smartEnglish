from django.db import models
from django.contrib.auth.models import User


class SpeakingTopic(models.Model):
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=50, blank=True)
    prompt_question = models.TextField()
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title


class SpeakingAttempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='speaking_attempts')
    topic = models.ForeignKey(SpeakingTopic, on_delete=models.CASCADE, null=True, blank=True)
    audio_file = models.FileField(upload_to='speaking_recordings/')
    transcript = models.TextField(blank=True)
    score = models.FloatField(default=0)
    fluency = models.IntegerField(default=0)
    pronunciation = models.IntegerField(default=0)
    grammar = models.IntegerField(default=0)
    feedback = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.score}"
