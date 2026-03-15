"""
Run: python manage.py shell < seed_more.py
"""
from lessons.models import Lesson, Question, AnswerOption

# === NEW READING LESSONS ===

r4 = Lesson.objects.create(
    title="The Psychology of Social Media",
    lesson_type="reading", level="Intermediate", tag="Technology",
    image="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500",
    duration="6 min", is_recommended=True, order=7,
    reading_text="Social media has become an integral part of modern life, with billions of people worldwide using platforms like Instagram, TikTok, and Twitter daily. But what drives our constant need to check notifications and scroll through feeds?\n\nPsychologists have identified several key factors that make social media so addictive. The variable reward system, similar to slot machines, keeps users engaged because they never know what content they will find next. Each like, comment, or share triggers a small release of dopamine in the brain.\n\nFear of Missing Out, commonly known as FOMO, is another powerful motivator. People feel anxious when they believe others are having experiences without them. Social media amplifies this feeling by constantly showing highlights of other people's lives.\n\nResearch has also shown that excessive social media use can lead to increased anxiety, depression, and feelings of loneliness. Paradoxically, the platforms designed to connect people can sometimes make users feel more isolated.\n\nHowever, social media is not entirely negative. It can be a valuable tool for maintaining long-distance relationships, finding communities of shared interest, and spreading important information quickly.")

q = Question.objects.create(lesson=r4, text="What makes social media addictive according to psychologists?", order=1)
AnswerOption.objects.create(question=q, text="Beautiful design and colors", order=1)
AnswerOption.objects.create(question=q, text="The variable reward system, similar to slot machines", is_correct=True, order=2)
AnswerOption.objects.create(question=q, text="Free access to the internet", order=3)
AnswerOption.objects.create(question=q, text="Government regulations", order=4)

q = Question.objects.create(lesson=r4, text="What does FOMO stand for?", order=2)
AnswerOption.objects.create(question=q, text="Focus On My Objectives", order=1)
AnswerOption.objects.create(question=q, text="Fear of Missing Out", is_correct=True, order=2)
AnswerOption.objects.create(question=q, text="Freedom of Media Online", order=3)
AnswerOption.objects.create(question=q, text="Fact or Myth Opinion", order=4)

q = Question.objects.create(lesson=r4, text="What is a positive aspect of social media mentioned?", order=3)
AnswerOption.objects.create(question=q, text="It always makes people happier", order=1)
AnswerOption.objects.create(question=q, text="It replaces face-to-face communication", order=2)
AnswerOption.objects.create(question=q, text="It helps maintain long-distance relationships", is_correct=True, order=3)
AnswerOption.objects.create(question=q, text="It eliminates loneliness completely", order=4)


r5 = Lesson.objects.create(
    title="Healthy Eating Habits",
    lesson_type="reading", level="Beginner", tag="Health",
    image="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500",
    duration="4 min", is_recommended=False, order=8,
    reading_text="Eating healthy food is very important for your body and mind. A balanced diet gives you energy and helps you stay strong. But what does healthy eating really mean?\n\nFirst, you should eat plenty of fruits and vegetables every day. Doctors recommend at least five portions per day. Fruits and vegetables contain vitamins and minerals that your body needs to work properly.\n\nSecond, drink enough water. Most adults need about 8 glasses of water per day. Water helps your body stay hydrated and removes waste. Try to avoid drinking too many sugary drinks like soda and juice.\n\nThird, try to eat less processed food. Processed foods often contain too much salt, sugar, and unhealthy fats. Instead, choose whole grains, lean meats, and fresh foods when possible.\n\nFinally, do not skip breakfast. Breakfast is the most important meal of the day because it gives your body energy after sleeping all night. A good breakfast might include oatmeal, eggs, or whole-grain toast with fruit.")

q = Question.objects.create(lesson=r5, text="How many portions of fruits and vegetables should you eat daily?", order=1)
AnswerOption.objects.create(question=q, text="At least 3", order=1)
AnswerOption.objects.create(question=q, text="At least 5", is_correct=True, order=2)
AnswerOption.objects.create(question=q, text="At least 10", order=3)
AnswerOption.objects.create(question=q, text="At least 1", order=4)

q = Question.objects.create(lesson=r5, text="Why is breakfast important?", order=2)
AnswerOption.objects.create(question=q, text="It helps you lose weight", order=1)
AnswerOption.objects.create(question=q, text="It gives your body energy after sleeping", is_correct=True, order=2)
AnswerOption.objects.create(question=q, text="It is the cheapest meal", order=3)
AnswerOption.objects.create(question=q, text="Doctors require it", order=4)

q = Question.objects.create(lesson=r5, text="What should you avoid drinking too much of?", order=3)
AnswerOption.objects.create(question=q, text="Water", order=1)
AnswerOption.objects.create(question=q, text="Tea", order=2)
AnswerOption.objects.create(question=q, text="Sugary drinks like soda", is_correct=True, order=3)
AnswerOption.objects.create(question=q, text="Milk", order=4)


r6 = Lesson.objects.create(
    title="Artificial Intelligence in Daily Life",
    lesson_type="reading", level="Advanced", tag="Technology",
    image="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500",
    duration="8 min", is_recommended=True, order=9,
    reading_text="Artificial intelligence has quietly become a part of our everyday lives, often in ways we do not even notice. From the moment you unlock your phone with facial recognition to the personalized recommendations on your streaming service, AI is working behind the scenes.\n\nNatural Language Processing, or NLP, powers virtual assistants like Siri, Alexa, and Google Assistant. These systems can understand human speech, interpret meaning, and generate relevant responses. The technology has improved dramatically in recent years, with large language models capable of writing essays, translating languages, and even coding software.\n\nIn healthcare, AI algorithms can analyze medical images with accuracy that sometimes exceeds that of human doctors. Machine learning models are being used to predict disease outbreaks, accelerate drug discovery, and personalize treatment plans based on individual patient data.\n\nThe transportation industry is being transformed by self-driving technology. Companies like Tesla, Waymo, and Cruise are developing autonomous vehicles that use computer vision, sensor fusion, and deep learning to navigate roads safely.\n\nHowever, the rise of AI also raises important ethical questions. Issues of bias in training data, job displacement, privacy concerns, and the potential for misuse must be carefully addressed.")

q = Question.objects.create(lesson=r6, text="What does NLP stand for?", order=1)
AnswerOption.objects.create(question=q, text="New Learning Platform", order=1)
AnswerOption.objects.create(question=q, text="Natural Language Processing", is_correct=True, order=2)
AnswerOption.objects.create(question=q, text="Network Logic Protocol", order=3)
AnswerOption.objects.create(question=q, text="Neural Link Program", order=4)

q = Question.objects.create(lesson=r6, text="How is AI used in healthcare?", order=2)
AnswerOption.objects.create(question=q, text="Only for scheduling appointments", order=1)
AnswerOption.objects.create(question=q, text="Analyzing medical images and predicting disease outbreaks", is_correct=True, order=2)
AnswerOption.objects.create(question=q, text="Replacing all doctors completely", order=3)
AnswerOption.objects.create(question=q, text="Making hospitals cheaper", order=4)

q = Question.objects.create(lesson=r6, text="What ethical concern about AI is mentioned?", order=3)
AnswerOption.objects.create(question=q, text="AI costs too much money", order=1)
AnswerOption.objects.create(question=q, text="AI is too slow", order=2)
AnswerOption.objects.create(question=q, text="Bias in training data and job displacement", is_correct=True, order=3)
AnswerOption.objects.create(question=q, text="AI cannot learn new things", order=4)


r7 = Lesson.objects.create(
    title="My Favorite Hobby",
    lesson_type="reading", level="Beginner", tag="Daily Life",
    image="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500",
    duration="3 min", is_recommended=False, order=12,
    reading_text="Everyone has hobbies that they enjoy doing in their free time. Hobbies make us happy and help us relax after a long day of work or school.\n\nSome people like outdoor activities such as hiking, cycling, or gardening. These hobbies are great for your health because they keep your body active. Hiking in nature is especially popular because it combines exercise with beautiful scenery.\n\nOther people prefer indoor hobbies like reading, cooking, painting, or playing video games. Reading is one of the most popular hobbies in the world. It helps you learn new things, improve your vocabulary, and use your imagination.\n\nMusic is another common hobby. Some people enjoy listening to music, while others like to play instruments such as the guitar, piano, or drums. Playing music is not only fun but also good for your brain.\n\nPhotography has become very popular with smartphones. People take photos of food, nature, friends, and interesting places. Many people share their photos on social media platforms like Instagram.\n\nThe most important thing about hobbies is that they should make you happy.")

q = Question.objects.create(lesson=r7, text="Why are outdoor hobbies good for you?", order=1)
AnswerOption.objects.create(question=q, text="They are free", order=1)
AnswerOption.objects.create(question=q, text="They keep your body active", is_correct=True, order=2)
AnswerOption.objects.create(question=q, text="They make you popular", order=3)
AnswerOption.objects.create(question=q, text="They are easier than indoor hobbies", order=4)

q = Question.objects.create(lesson=r7, text="What benefit of reading is mentioned?", order=2)
AnswerOption.objects.create(question=q, text="It makes you rich", order=1)
AnswerOption.objects.create(question=q, text="It helps improve vocabulary and imagination", is_correct=True, order=2)
AnswerOption.objects.create(question=q, text="It replaces school", order=3)
AnswerOption.objects.create(question=q, text="It is the easiest hobby", order=4)

q = Question.objects.create(lesson=r7, text="What is the most important thing about hobbies?", order=3)
AnswerOption.objects.create(question=q, text="They should be expensive", order=1)
AnswerOption.objects.create(question=q, text="They should make you famous", order=2)
AnswerOption.objects.create(question=q, text="They should make you happy", is_correct=True, order=3)
AnswerOption.objects.create(question=q, text="They should be difficult", order=4)


# === NEW LISTENING LESSONS ===

l4 = Lesson.objects.create(
    title="At the Airport",
    lesson_type="listening", level="Beginner", tag="Travel",
    image="https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=500",
    duration="4 min", is_recommended=False, order=10,
    reading_text="Welcome to the airport. Before you fly, there are several important steps you need to follow. First, you need to check in. You can check in online before you arrive, or you can go to the check-in counter at the airport. You will need your passport and your booking confirmation.\n\nAfter checking in, you will receive your boarding pass. The boarding pass shows your seat number, gate number, and boarding time. Keep this document safe because you will need it to get on the plane.\n\nNext, you must go through security. At the security checkpoint, you need to put your bags on the conveyor belt and walk through the metal detector. Remember to remove your laptop from your bag and take off your belt and shoes.\n\nAfter security, you can go to the departure area. Here you will find shops, restaurants, and your gate. Check the departure screens to make sure your gate has not changed.\n\nOn the plane, find your seat and store your carry-on luggage in the overhead compartment. Fasten your seatbelt and listen to the safety demonstration before takeoff.")

q = Question.objects.create(lesson=l4, text="What do you need for check-in?", order=1)
AnswerOption.objects.create(question=q, text="Only your phone", order=1)
AnswerOption.objects.create(question=q, text="Passport and booking confirmation", is_correct=True, order=2)
AnswerOption.objects.create(question=q, text="A credit card", order=3)
AnswerOption.objects.create(question=q, text="Your luggage only", order=4)

q = Question.objects.create(lesson=l4, text="What should you remove at security?", order=2)
AnswerOption.objects.create(question=q, text="Your passport", order=1)
AnswerOption.objects.create(question=q, text="Your jacket only", order=2)
AnswerOption.objects.create(question=q, text="Laptop from bag, belt and shoes", is_correct=True, order=3)
AnswerOption.objects.create(question=q, text="Nothing", order=4)

q = Question.objects.create(lesson=l4, text="Where should you store carry-on luggage?", order=3)
AnswerOption.objects.create(question=q, text="Under your seat only", order=1)
AnswerOption.objects.create(question=q, text="In the overhead compartment", is_correct=True, order=2)
AnswerOption.objects.create(question=q, text="On your lap", order=3)
AnswerOption.objects.create(question=q, text="At the back of the plane", order=4)


l5 = Lesson.objects.create(
    title="How to Give a Great Presentation",
    lesson_type="listening", level="Intermediate", tag="Business",
    image="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=500",
    duration="6 min", is_recommended=True, order=11,
    reading_text="Giving a presentation can be nerve-wracking, but with the right preparation and techniques, anyone can become an effective speaker. Here are some key strategies for delivering a great presentation.\n\nFirst, know your audience. Before creating your presentation, think about who will be listening. What do they already know about your topic? What do they want to learn? Tailoring your content to your audience makes your presentation more relevant and engaging.\n\nSecond, structure your presentation clearly. Start with a strong opening that grabs attention. You might begin with a surprising statistic, a thought-provoking question, or a brief story. Then organize your main points logically, and finish with a memorable conclusion.\n\nThird, practice is essential. Rehearse your presentation several times, ideally in front of a mirror or with a friend. Time yourself to make sure you stay within the allocated time.\n\nDuring the presentation, maintain eye contact with your audience. Do not just read from your slides. Use visual aids to support your points, not replace them. Speak clearly and at a moderate pace.\n\nFinally, be prepared for questions. Think about what questions your audience might ask and prepare thoughtful answers in advance.")

q = Question.objects.create(lesson=l5, text="What should you do FIRST before creating a presentation?", order=1)
AnswerOption.objects.create(question=q, text="Design beautiful slides", order=1)
AnswerOption.objects.create(question=q, text="Know your audience", is_correct=True, order=2)
AnswerOption.objects.create(question=q, text="Memorize your speech", order=3)
AnswerOption.objects.create(question=q, text="Buy new clothes", order=4)

q = Question.objects.create(lesson=l5, text="How should you start a presentation?", order=2)
AnswerOption.objects.create(question=q, text="With an apology for being nervous", order=1)
AnswerOption.objects.create(question=q, text="With a strong opening like a surprising statistic or story", is_correct=True, order=2)
AnswerOption.objects.create(question=q, text="By reading your resume", order=3)
AnswerOption.objects.create(question=q, text="By introducing everyone in the room", order=4)

q = Question.objects.create(lesson=l5, text="What should you NOT do during a presentation?", order=3)
AnswerOption.objects.create(question=q, text="Maintain eye contact", order=1)
AnswerOption.objects.create(question=q, text="Speak clearly", order=2)
AnswerOption.objects.create(question=q, text="Just read from your slides", is_correct=True, order=3)
AnswerOption.objects.create(question=q, text="Pause occasionally", order=4)


print("Done! New lessons added.")
for l in Lesson.objects.all():
    print(f"  [{l.lesson_type}] {l.title} - {l.questions.count()} questions")
