"""
Seed data script - Run after migrate:
    python manage.py shell < seed_data.py
"""
from lessons.models import Lesson, Question, AnswerOption
from speaking.models import SpeakingTopic

# Idempotent: clear this script's own lessons (order 1-6) before recreating
Lesson.objects.filter(order__gte=1, order__lte=6).delete()

# ===== LESSONS =====

# Reading lessons
r1 = Lesson.objects.create(
    title="The Future of Remote Work",
    lesson_type="reading",
    level="Intermediate",
    tag="Business",
    image="https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=500",
    duration="5 min",
    reading_text="""The COVID-19 pandemic has fundamentally changed how we think about work. Companies around the world were forced to adopt remote work policies almost overnight, and many discovered that their employees could be just as productive — if not more so — working from home.

Companies have discovered numerous benefits to remote work arrangements. Reduced overhead costs, access to a global talent pool, and improved employee satisfaction are just a few of the advantages. Studies show that remote workers often report higher job satisfaction and better work-life balance.

However, challenges remain, including maintaining company culture, ensuring effective communication across time zones, and preventing employee burnout. The future likely lies in hybrid models that combine the flexibility of remote work with the collaborative benefits of in-person interaction.

As technology continues to evolve, tools for virtual collaboration will become increasingly sophisticated, making remote work even more seamless. The key for organizations is to find the right balance that works for their unique needs and culture.""",
    is_recommended=True,
    order=1,
)

q1 = Question.objects.create(lesson=r1, text="What is the main idea of the passage?", order=1)
AnswerOption.objects.create(question=q1, text="Remote work is always better than office work", order=1)
AnswerOption.objects.create(question=q1, text="The pandemic changed work culture and remote work has both benefits and challenges", is_correct=True, order=2)
AnswerOption.objects.create(question=q1, text="Companies should never allow remote work", order=3)

q2 = Question.objects.create(lesson=r1, text="Which is NOT mentioned as a benefit of remote work?", order=2)
AnswerOption.objects.create(question=q2, text="Reduced overhead costs", order=1)
AnswerOption.objects.create(question=q2, text="Higher salaries for employees", is_correct=True, order=2)
AnswerOption.objects.create(question=q2, text="Access to global talent pool", order=3)

q3 = Question.objects.create(lesson=r1, text="What does the author suggest about the future of work?", order=3)
AnswerOption.objects.create(question=q3, text="Everyone should work from home permanently", order=1)
AnswerOption.objects.create(question=q3, text="Hybrid models combining remote and in-person work", is_correct=True, order=2)
AnswerOption.objects.create(question=q3, text="Remote work will completely disappear", order=3)


r2 = Lesson.objects.create(
    title="Climate Change and Its Impact",
    lesson_type="reading",
    level="Advanced",
    tag="Science",
    image="https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=500",
    duration="8 min",
    reading_text="""Climate change represents one of the most pressing challenges facing humanity today. The scientific consensus is clear: human activities, particularly the burning of fossil fuels, are driving unprecedented changes in Earth's climate system.

Global temperatures have risen by approximately 1.1 degrees Celsius since the pre-industrial era. This seemingly small increase has triggered a cascade of environmental effects, including more frequent and intense heatwaves, rising sea levels, and shifting weather patterns that affect agriculture worldwide.

The Paris Agreement, signed in 2015, set ambitious goals to limit global warming to 1.5 degrees Celsius above pre-industrial levels. Achieving this target requires rapid and far-reaching changes in energy, land use, and industrial systems.

Renewable energy sources such as solar and wind power have seen dramatic cost reductions in recent years, making the transition to clean energy increasingly economically viable. Many countries are now investing heavily in green infrastructure and sustainable technologies.""",
    is_recommended=True,
    order=2,
)

q4 = Question.objects.create(lesson=r2, text="How much have global temperatures risen since the pre-industrial era?", order=1)
AnswerOption.objects.create(question=q4, text="0.5 degrees Celsius", order=1)
AnswerOption.objects.create(question=q4, text="1.1 degrees Celsius", is_correct=True, order=2)
AnswerOption.objects.create(question=q4, text="2.0 degrees Celsius", order=3)

q5 = Question.objects.create(lesson=r2, text="What is the Paris Agreement's temperature goal?", order=2)
AnswerOption.objects.create(question=q5, text="Limit warming to 1.5°C above pre-industrial levels", is_correct=True, order=1)
AnswerOption.objects.create(question=q5, text="Reduce temperatures by 2 degrees", order=2)
AnswerOption.objects.create(question=q5, text="Stop all fossil fuel use by 2030", order=3)


r3 = Lesson.objects.create(
    title="Coffee Shop Conversations",
    lesson_type="reading",
    level="Beginner",
    tag="Daily Life",
    image="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500",
    duration="3 min",
    reading_text="""Going to a coffee shop is a common daily activity for many people around the world. Whether you need a quick morning coffee or a quiet place to study, coffee shops offer a welcoming environment.

When you enter a coffee shop, you will usually see a menu board with different drinks. Common options include espresso, latte, cappuccino, and americano. Many shops also offer tea, juice, and pastries.

To order, you can say: "Can I have a large latte, please?" or "I'd like a medium cappuccino." The barista will then prepare your drink. You can choose to sit inside the shop or take your drink to go.

Tipping is common in some countries. In the United States, people often leave a small tip for the barista. A typical tip is one or two dollars.""",
    is_recommended=True,
    order=3,
)

q6 = Question.objects.create(lesson=r3, text="What can you find at a coffee shop?", order=1)
AnswerOption.objects.create(question=q6, text="Only coffee", order=1)
AnswerOption.objects.create(question=q6, text="Coffee, tea, juice, and pastries", is_correct=True, order=2)
AnswerOption.objects.create(question=q6, text="Only food", order=3)


# Listening lessons
l1 = Lesson.objects.create(
    title="Job Interview Basics",
    lesson_type="listening",
    level="Intermediate",
    tag="Business",
    image="https://images.unsplash.com/photo-1565688534245-05d6b5be184a?w=500",
    duration="5 min",
    reading_text="A job interview is your chance to make a good impression on a future employer, so good preparation is very important. Before the interview, you should research the company. Learn about what they do, their products, and their values. This shows the interviewer that you are genuinely interested in the job. You should also prepare answers to common questions, such as why you want the job and what your strengths are. However, do not memorise a script word for word, because it will sound unnatural. On the day of the interview, dress neatly and arrive about ten minutes early. During the interview, listen carefully, speak clearly, and make eye contact. At the end, it is a good idea to ask a question of your own, which shows enthusiasm. Finally, remember to thank the interviewer for their time.",
    is_recommended=False,
    order=4,
)

q7 = Question.objects.create(lesson=l1, text="What should you do before a job interview?", order=1)
AnswerOption.objects.create(question=q7, text="Research the company", is_correct=True, order=1)
AnswerOption.objects.create(question=q7, text="Do nothing special", order=2)
AnswerOption.objects.create(question=q7, text="Memorize a script word for word", order=3)

q7b = Question.objects.create(lesson=l1, text="When should you arrive for the interview?", order=2)
AnswerOption.objects.create(question=q7b, text="About ten minutes early", is_correct=True, order=1)
AnswerOption.objects.create(question=q7b, text="Exactly on time to the second", order=2)
AnswerOption.objects.create(question=q7b, text="Thirty minutes late", order=3)

q7c = Question.objects.create(lesson=l1, text="Why is asking your own question a good idea?", order=3)
AnswerOption.objects.create(question=q7c, text="It shows enthusiasm and interest", is_correct=True, order=1)
AnswerOption.objects.create(question=q7c, text="It wastes the interviewer's time", order=2)
AnswerOption.objects.create(question=q7c, text="It is not allowed", order=3)

l2 = Lesson.objects.create(
    title="Travel Vocabulary",
    lesson_type="listening",
    level="Beginner",
    tag="Travel",
    image="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=500",
    duration="3 min",
    reading_text="When you travel to a new country, knowing some basic vocabulary can make your trip much easier. Let's learn a few important words. A passport is the document you need to enter another country. A visa is special permission to visit or stay in a country for a period of time. When you arrive, you go through customs, where officers may check your bags. If you need a place to sleep, you can book a room at a hotel or a cheaper hostel. To move around the city, you can take public transport such as a bus, a train, or the subway. If you get lost, you can ask a local for directions, or use a map on your phone. Remember to keep your money and documents safe at all times.",
    is_recommended=False,
    order=5,
)

q8 = Question.objects.create(lesson=l2, text="What document do you need to enter another country?", order=1)
AnswerOption.objects.create(question=q8, text="A hotel key", order=1)
AnswerOption.objects.create(question=q8, text="A passport", is_correct=True, order=2)
AnswerOption.objects.create(question=q8, text="A bus ticket", order=3)

q9 = Question.objects.create(lesson=l2, text="Where do officers check your bags when you arrive?", order=2)
AnswerOption.objects.create(question=q9, text="At customs", is_correct=True, order=1)
AnswerOption.objects.create(question=q9, text="At the hotel", order=2)
AnswerOption.objects.create(question=q9, text="On the subway", order=3)

q10 = Question.objects.create(lesson=l2, text="What is a cheaper alternative to a hotel?", order=3)
AnswerOption.objects.create(question=q10, text="A passport", order=1)
AnswerOption.objects.create(question=q10, text="A hostel", is_correct=True, order=2)
AnswerOption.objects.create(question=q10, text="A visa", order=3)


l3 = Lesson.objects.create(
    title="Academic Lecture: Psychology",
    lesson_type="listening",
    level="Advanced",
    tag="Science",
    image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
    duration="10 min",
    reading_text="Good morning, everyone. Today we will discuss the concept of memory in cognitive psychology. Memory is not a single system but rather consists of several different types. First, we have sensory memory, which holds information for a very short time, usually less than a second. Next is short-term memory, sometimes called working memory, which can hold about seven items for around twenty seconds. Finally, long-term memory can store information for years, or even a lifetime. An important process is consolidation, in which short-term memories are gradually transformed into long-term memories, often during sleep. Researchers have also found that information is easier to remember when it is meaningful and connected to what we already know. This is why simply repeating facts is less effective than understanding them deeply.",
    is_recommended=False,
    order=6,
)

q11 = Question.objects.create(lesson=l3, text="How long does sensory memory typically hold information?", order=1)
AnswerOption.objects.create(question=q11, text="Less than a second", is_correct=True, order=1)
AnswerOption.objects.create(question=q11, text="Twenty seconds", order=2)
AnswerOption.objects.create(question=q11, text="Several years", order=3)

q12 = Question.objects.create(lesson=l3, text="What process turns short-term memories into long-term memories?", order=2)
AnswerOption.objects.create(question=q12, text="Repetition", order=1)
AnswerOption.objects.create(question=q12, text="Consolidation", is_correct=True, order=2)
AnswerOption.objects.create(question=q12, text="Sensation", order=3)

q13 = Question.objects.create(lesson=l3, text="According to the lecture, information is easier to remember when it is:", order=3)
AnswerOption.objects.create(question=q13, text="Meaningful and connected to prior knowledge", is_correct=True, order=1)
AnswerOption.objects.create(question=q13, text="Repeated many times without understanding", order=2)
AnswerOption.objects.create(question=q13, text="Completely new and unfamiliar", order=3)

# ===== SPEAKING TOPICS =====
# LƯU Ý: Chủ đề Speaking được seed RIÊNG ở file seed_speaking.py (đúng field part/description).
# Chạy sau file này:  python manage.py shell < seed_speaking.py

print("Seed data created successfully!")
print(f"  - {Lesson.objects.count()} lessons")
print(f"  - {Question.objects.count()} questions")
print(f"  - {AnswerOption.objects.count()} answer options")
print(f"  - {SpeakingTopic.objects.count()} speaking topics (run seed_speaking.py to create)")
