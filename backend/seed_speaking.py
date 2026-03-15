"""
Run: python manage.py shell < seed_speaking.py
"""
from speaking.models import SpeakingTopic, SpeakingQuestion

# Clear old data
SpeakingTopic.objects.all().delete()

# ===== PART 1 - Introduction & Interview =====

t1 = SpeakingTopic.objects.create(title="Daily Routine", part="Part 1", description="Questions about your everyday activities", order=1)
SpeakingQuestion.objects.create(topic=t1, question_text="What do you usually do in the morning?", order=1)
SpeakingQuestion.objects.create(topic=t1, question_text="Do you prefer to get up early or stay up late? Why?", order=2)
SpeakingQuestion.objects.create(topic=t1, question_text="Has your daily routine changed much in recent years?", order=3)

t2 = SpeakingTopic.objects.create(title="Hobbies & Free Time", part="Part 1", description="Questions about what you enjoy doing", order=2)
SpeakingQuestion.objects.create(topic=t2, question_text="What do you enjoy doing in your free time?", order=1)
SpeakingQuestion.objects.create(topic=t2, question_text="How often do you spend time on your hobbies?", order=2)
SpeakingQuestion.objects.create(topic=t2, question_text="Is there a hobby you would like to try in the future?", order=3)

t3 = SpeakingTopic.objects.create(title="Food & Cooking", part="Part 1", description="Questions about food preferences", order=3)
SpeakingQuestion.objects.create(topic=t3, question_text="What kind of food do you like to eat?", order=1)
SpeakingQuestion.objects.create(topic=t3, question_text="Do you prefer eating at home or eating out?", order=2)
SpeakingQuestion.objects.create(topic=t3, question_text="Can you cook? What is your favorite dish to make?", order=3)

t4 = SpeakingTopic.objects.create(title="Hometown", part="Part 1", description="Questions about where you live", order=4)
SpeakingQuestion.objects.create(topic=t4, question_text="Where are you from? Tell me about your hometown.", order=1)
SpeakingQuestion.objects.create(topic=t4, question_text="What do you like most about your hometown?", order=2)
SpeakingQuestion.objects.create(topic=t4, question_text="Has your hometown changed much since you were a child?", order=3)

# ===== PART 2 - Long Turn (Cue Card) =====

t5 = SpeakingTopic.objects.create(title="A Memorable Trip", part="Part 2", description="Describe a trip that you remember well", order=1)
SpeakingQuestion.objects.create(topic=t5, question_text="Describe a trip you took that was memorable. You should say: where you went, who you went with, what you did there, and explain why it was memorable.", order=1)
SpeakingQuestion.objects.create(topic=t5, question_text="Would you like to go on that trip again? Why or why not?", order=2)

t6 = SpeakingTopic.objects.create(title="A Person You Admire", part="Part 2", description="Describe someone who has influenced you", order=2)
SpeakingQuestion.objects.create(topic=t6, question_text="Describe a person you admire. You should say: who this person is, how you know them, what they do, and explain why you admire them.", order=1)
SpeakingQuestion.objects.create(topic=t6, question_text="Do you think this person has changed your life in any way?", order=2)

t7 = SpeakingTopic.objects.create(title="A Skill You Learned", part="Part 2", description="Describe a useful skill you have learned", order=3)
SpeakingQuestion.objects.create(topic=t7, question_text="Describe a skill you learned that you find useful. You should say: what the skill is, when you learned it, how you learned it, and explain why it is useful.", order=1)
SpeakingQuestion.objects.create(topic=t7, question_text="Would you recommend others to learn this skill?", order=2)

# ===== PART 3 - Discussion =====

t8 = SpeakingTopic.objects.create(title="Education & Technology", part="Part 3", description="Discussion about how technology affects education", order=1)
SpeakingQuestion.objects.create(topic=t8, question_text="How has technology changed the way people learn?", order=1)
SpeakingQuestion.objects.create(topic=t8, question_text="Do you think online learning is as effective as classroom learning?", order=2)
SpeakingQuestion.objects.create(topic=t8, question_text="What role should AI play in education in the future?", order=3)

t9 = SpeakingTopic.objects.create(title="Environment & Sustainability", part="Part 3", description="Discussion about environmental issues", order=2)
SpeakingQuestion.objects.create(topic=t9, question_text="What can individuals do to help protect the environment?", order=1)
SpeakingQuestion.objects.create(topic=t9, question_text="Should governments do more to fight climate change?", order=2)
SpeakingQuestion.objects.create(topic=t9, question_text="Do you think people are becoming more environmentally aware?", order=3)

t10 = SpeakingTopic.objects.create(title="Work & Career", part="Part 3", description="Discussion about work-life balance and careers", order=3)
SpeakingQuestion.objects.create(topic=t10, question_text="What factors are important when choosing a career?", order=1)
SpeakingQuestion.objects.create(topic=t10, question_text="Do you think work-life balance is achievable in modern society?", order=2)
SpeakingQuestion.objects.create(topic=t10, question_text="How will jobs change in the next 20 years due to automation?", order=3)

print("Speaking seed data created!")
for t in SpeakingTopic.objects.all():
    print(f"  [{t.part}] {t.title} - {t.questions.count()} questions")
