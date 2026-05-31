# Extra varied lessons + 2 speaking topics. Run with:
#   python manage.py shell -c "exec(open('seed_extra.py', encoding='utf-8').read())"
# Run this AFTER seed_speaking.py (so the 2 topics here are not wiped).
from lessons.models import Lesson, Question, AnswerOption
from speaking.models import SpeakingTopic, SpeakingQuestion

# Idempotent: clear this script's own data before recreating
Lesson.objects.filter(order__gte=13, order__lte=18).delete()
SpeakingTopic.objects.filter(title__in=['Music', 'A Book or Film You Enjoyed']).delete()

# ============ READING ============

r8 = Lesson.objects.create(
    title="The History of the Olympic Games",
    lesson_type="reading", level="Intermediate", tag="Sports",
    image="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500",
    duration="6 min", is_recommended=True, order=13,
    reading_text="The Olympic Games are the world's most famous sporting event, but their history goes back thousands of years. The ancient Olympics began in Olympia, Greece, around 776 BC. They were held every four years in honour of Zeus, the king of the Greek gods. Athletes competed in running, wrestling, and chariot racing, and winners were given a crown of olive leaves.\n\nThe ancient Games continued for nearly twelve centuries until they were banned in 393 AD. For over 1,500 years, the Olympics disappeared. Then, in 1896, a Frenchman named Pierre de Coubertin revived the tradition, organising the first modern Olympic Games in Athens. Only 14 countries and about 240 athletes took part.\n\nToday, the modern Olympics are very different. More than 200 countries participate, and thousands of athletes compete in summer and winter events. The Games are watched by billions of people around the world and are seen as a symbol of peace and friendship between nations.")

q = Question.objects.create(lesson=r8, text="Where and when did the ancient Olympics begin?", order=1)
AnswerOption.objects.create(question=q, text="Rome, around 500 BC", order=1)
AnswerOption.objects.create(question=q, text="Olympia, Greece, around 776 BC", is_correct=True, order=2)
AnswerOption.objects.create(question=q, text="Athens, in 1896", order=3)

q = Question.objects.create(lesson=r8, text="Who revived the modern Olympic Games?", order=2)
AnswerOption.objects.create(question=q, text="Pierre de Coubertin", is_correct=True, order=1)
AnswerOption.objects.create(question=q, text="Zeus", order=2)
AnswerOption.objects.create(question=q, text="A group of athletes", order=3)

q = Question.objects.create(lesson=r8, text="What do the modern Olympics symbolise?", order=3)
AnswerOption.objects.create(question=q, text="War between nations", order=1)
AnswerOption.objects.create(question=q, text="Peace and friendship between nations", is_correct=True, order=2)
AnswerOption.objects.create(question=q, text="Greek religion only", order=3)


r9 = Lesson.objects.create(
    title="Why Reading Books Matters",
    lesson_type="reading", level="Beginner", tag="Education",
    image="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500",
    duration="4 min", is_recommended=False, order=14,
    reading_text="Reading books is one of the best habits you can have. Many successful people say that reading every day has helped them learn and grow. But why is reading so important?\n\nFirst, reading helps you learn new words. When you read, you see words used in real sentences, which helps you remember their meaning. This is a great way to improve your vocabulary in any language.\n\nSecond, reading makes you smarter. Books give you new information and new ideas. Whether you read about history, science, or other cultures, you learn something every time you open a book.\n\nThird, reading is good for your brain. Studies show that reading can improve your memory and help you focus better. It is like exercise for your mind.\n\nFinally, reading can be relaxing. After a busy day, reading a good story can help you forget your worries and feel calm. So pick up a book today and start enjoying the many benefits of reading.")

q = Question.objects.create(lesson=r9, text="How does reading help with vocabulary?", order=1)
AnswerOption.objects.create(question=q, text="You see words used in real sentences", is_correct=True, order=1)
AnswerOption.objects.create(question=q, text="It makes you sleepy", order=2)
AnswerOption.objects.create(question=q, text="It costs a lot of money", order=3)

q = Question.objects.create(lesson=r9, text="According to the text, reading is compared to:", order=2)
AnswerOption.objects.create(question=q, text="Eating food", order=1)
AnswerOption.objects.create(question=q, text="Exercise for your mind", is_correct=True, order=2)
AnswerOption.objects.create(question=q, text="Watching television", order=3)

q = Question.objects.create(lesson=r9, text="Why can reading be relaxing?", order=3)
AnswerOption.objects.create(question=q, text="It helps you forget your worries", is_correct=True, order=1)
AnswerOption.objects.create(question=q, text="It is always very short", order=2)
AnswerOption.objects.create(question=q, text="It requires no thinking", order=3)


r10 = Lesson.objects.create(
    title="The Journey to Mars",
    lesson_type="reading", level="Advanced", tag="Science",
    image="https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=500",
    duration="8 min", is_recommended=True, order=15,
    reading_text="For decades, humans have dreamed of travelling to Mars, the red planet. While we have sent many robotic missions to study its surface, sending humans presents enormous challenges that scientists are still working to overcome.\n\nThe first challenge is distance. Mars is, on average, about 225 million kilometres from Earth. A one-way journey would take roughly seven to nine months with current technology. During this long voyage, astronauts would be exposed to dangerous levels of cosmic radiation, which can harm the human body.\n\nAnother major problem is supplies. A crew would need enough food, water, and oxygen to survive for years, since they cannot simply return whenever they wish. Scientists are researching ways to grow food in space and to recycle water and air efficiently.\n\nFinally, the environment on Mars is extremely harsh. The temperature can drop to minus 125 degrees Celsius, the atmosphere is thin and mostly carbon dioxide, and dust storms can cover the entire planet. Despite these obstacles, space agencies and private companies hope to land humans on Mars within the coming decades, a step that could change the future of humanity.")

q = Question.objects.create(lesson=r10, text="How long would a one-way trip to Mars take with current technology?", order=1)
AnswerOption.objects.create(question=q, text="A few days", order=1)
AnswerOption.objects.create(question=q, text="About seven to nine months", is_correct=True, order=2)
AnswerOption.objects.create(question=q, text="Exactly one year", order=3)

q = Question.objects.create(lesson=r10, text="Why are supplies a major problem?", order=2)
AnswerOption.objects.create(question=q, text="Astronauts cannot easily return, so they need years of food, water and oxygen", is_correct=True, order=1)
AnswerOption.objects.create(question=q, text="Food is too heavy to carry at all", order=2)
AnswerOption.objects.create(question=q, text="There are shops on Mars", order=3)

q = Question.objects.create(lesson=r10, text="What is true about the environment on Mars?", order=3)
AnswerOption.objects.create(question=q, text="It is warm and comfortable", order=1)
AnswerOption.objects.create(question=q, text="It is very cold with a thin atmosphere and dust storms", is_correct=True, order=2)
AnswerOption.objects.create(question=q, text="It has the same air as Earth", order=3)


# ============ LISTENING (có transcript -> gTTS đọc được) ============

l6 = Lesson.objects.create(
    title="Shopping at the Supermarket",
    lesson_type="listening", level="Beginner", tag="Daily Life",
    image="https://images.unsplash.com/photo-1542838132-92c53300491e?w=500",
    duration="4 min", is_recommended=False, order=16,
    reading_text="Going shopping at the supermarket is something most people do every week. Let me explain how it usually works. When you arrive, you take a shopping cart or a basket near the entrance. Then you walk through the different sections of the store. The fruit and vegetable section is often near the front. The dairy section has milk, cheese, and yoghurt, while the bakery has fresh bread and cakes. When you have everything you need, you go to the checkout. The cashier will scan your items and tell you the total price. You can pay with cash or a card. Finally, you put your shopping into bags and carry it home. Remember to bring your own bags, because many supermarkets now charge for plastic bags to help protect the environment.")

q = Question.objects.create(lesson=l6, text="What do you take near the entrance?", order=1)
AnswerOption.objects.create(question=q, text="A shopping cart or basket", is_correct=True, order=1)
AnswerOption.objects.create(question=q, text="A menu", order=2)
AnswerOption.objects.create(question=q, text="A boarding pass", order=3)

q = Question.objects.create(lesson=l6, text="What can you find in the dairy section?", order=2)
AnswerOption.objects.create(question=q, text="Milk, cheese, and yoghurt", is_correct=True, order=1)
AnswerOption.objects.create(question=q, text="Bread and cakes", order=2)
AnswerOption.objects.create(question=q, text="Fruit and vegetables", order=3)

q = Question.objects.create(lesson=l6, text="Why should you bring your own bags?", order=3)
AnswerOption.objects.create(question=q, text="Many supermarkets charge for plastic bags to protect the environment", is_correct=True, order=1)
AnswerOption.objects.create(question=q, text="Bags are not available", order=2)
AnswerOption.objects.create(question=q, text="It is required by law everywhere", order=3)


l7 = Lesson.objects.create(
    title="A Phone Job Interview",
    lesson_type="listening", level="Intermediate", tag="Business",
    image="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=500",
    duration="5 min", is_recommended=True, order=17,
    reading_text="Hello, thank you for taking the time to speak with me today. My name is Sarah, and I am calling from the human resources department about the marketing position you applied for. I would like to ask you a few questions over the phone before we invite candidates for a face-to-face interview. First, could you tell me a little about your previous work experience? Second, why are you interested in working for our company? And finally, what do you think are your greatest strengths? Please take your time to answer. There are no right or wrong answers; we simply want to get to know you better. After our call, we will review all the applications and contact successful candidates within one week to arrange the next stage of the interview process.")

q = Question.objects.create(lesson=l7, text="Which department is the caller from?", order=1)
AnswerOption.objects.create(question=q, text="Human resources", is_correct=True, order=1)
AnswerOption.objects.create(question=q, text="Marketing only", order=2)
AnswerOption.objects.create(question=q, text="Finance", order=3)

q = Question.objects.create(lesson=l7, text="What is the purpose of this phone call?", order=2)
AnswerOption.objects.create(question=q, text="To ask questions before a face-to-face interview", is_correct=True, order=1)
AnswerOption.objects.create(question=q, text="To offer the job immediately", order=2)
AnswerOption.objects.create(question=q, text="To sell a product", order=3)

q = Question.objects.create(lesson=l7, text="When will successful candidates be contacted?", order=3)
AnswerOption.objects.create(question=q, text="Within one week", is_correct=True, order=1)
AnswerOption.objects.create(question=q, text="The same day", order=2)
AnswerOption.objects.create(question=q, text="After one month", order=3)


l8 = Lesson.objects.create(
    title="A Museum Tour",
    lesson_type="listening", level="Intermediate", tag="Culture",
    image="https://images.unsplash.com/photo-1565060169187-5284a3b7f1aa?w=500",
    duration="6 min", is_recommended=False, order=18,
    reading_text="Good afternoon, ladies and gentlemen, and welcome to the National History Museum. My name is David, and I will be your guide for today's tour. Before we begin, let me give you some important information. The tour will last about ninety minutes and will cover three main galleries. Please stay with the group and do not touch any of the exhibits, as many of them are very old and fragile. Photography is allowed, but please turn off your camera flash. Our first stop is the ancient civilisations gallery, where you can see artefacts that are over three thousand years old. After that, we will visit the natural history section, which features dinosaur skeletons and rare minerals. Finally, we will end in the modern art gallery. If you have any questions during the tour, please feel free to ask. The gift shop and café are located near the main entrance and will be open until six o'clock. Now, let's begin our journey through history.")

q = Question.objects.create(lesson=l8, text="How long will the tour last?", order=1)
AnswerOption.objects.create(question=q, text="About ninety minutes", is_correct=True, order=1)
AnswerOption.objects.create(question=q, text="Three hours", order=2)
AnswerOption.objects.create(question=q, text="Thirty minutes", order=3)

q = Question.objects.create(lesson=l8, text="What are visitors NOT allowed to do?", order=2)
AnswerOption.objects.create(question=q, text="Touch the exhibits", is_correct=True, order=1)
AnswerOption.objects.create(question=q, text="Take photos without flash", order=2)
AnswerOption.objects.create(question=q, text="Ask questions", order=3)

q = Question.objects.create(lesson=l8, text="What can be seen in the natural history section?", order=3)
AnswerOption.objects.create(question=q, text="Dinosaur skeletons and rare minerals", is_correct=True, order=1)
AnswerOption.objects.create(question=q, text="Modern paintings", order=2)
AnswerOption.objects.create(question=q, text="Ancient pottery only", order=3)


# ============ SPEAKING (thêm chủ đề) ============

s1 = SpeakingTopic.objects.create(title="Music", part="Part 1", description="Questions about music and your preferences", order=5)
SpeakingQuestion.objects.create(topic=s1, question_text="What kind of music do you like to listen to?", order=1)
SpeakingQuestion.objects.create(topic=s1, question_text="Do you play any musical instruments?", order=2)
SpeakingQuestion.objects.create(topic=s1, question_text="Has the music you enjoy changed since you were younger?", order=3)

s2 = SpeakingTopic.objects.create(title="A Book or Film You Enjoyed", part="Part 2", description="Describe a book or film that made an impression on you", order=4)
SpeakingQuestion.objects.create(topic=s2, question_text="Describe a book or film you really enjoyed. You should say: what it was, what it was about, when you read or watched it, and explain why you enjoyed it.", order=1)
SpeakingQuestion.objects.create(topic=s2, question_text="Would you recommend it to other people? Why?", order=2)


print("Extra seed data created!")
print(f"  Total: {Lesson.objects.count()} lessons, {Question.objects.count()} questions, {SpeakingTopic.objects.count()} speaking topics")
