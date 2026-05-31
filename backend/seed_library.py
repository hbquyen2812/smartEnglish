# Extra library lessons (12). Run with:
#   python manage.py shell -c "exec(open('seed_library.py', encoding='utf-8').read())"
# Then: python manage.py generate_audio
from lessons.models import Lesson, Question, AnswerOption

# Idempotent: clear this script's own lessons (order >= 19) before recreating
Lesson.objects.filter(order__gte=19).delete()


def add(lesson, qa_list):
    """qa_list: [(question, [(text, is_correct), ...]), ...]"""
    for order, (qtext, options) in enumerate(qa_list, start=1):
        q = Question.objects.create(lesson=lesson, text=qtext, order=order)
        for o_order, (otext, correct) in enumerate(options, start=1):
            AnswerOption.objects.create(question=q, text=otext, is_correct=correct, order=o_order)


IMG = "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500"

# ================= READING =================

r = Lesson.objects.create(
    title="Smart Ways to Save Money", lesson_type="reading", level="Beginner", tag="Finance",
    image="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500", duration="4 min", order=19,
    reading_text="Saving money is an important skill that everyone should learn. The first step is to make a budget. A budget shows how much money you earn and how much you spend each month. When you know where your money goes, it is easier to control your spending. A good idea is to save a small amount every month, even if it is not much. Many people follow the rule of saving at least ten percent of their income. You should also try to avoid buying things you do not really need. Before you buy something, ask yourself if it is a need or just a want. Over time, these small habits can help you build a strong financial future.")
add(r, [
    ("What is the first step to saving money?", [("Make a budget", True), ("Buy more things", False), ("Borrow money", False)]),
    ("What rule do many people follow?", [("Save at least 10% of income", True), ("Spend all their money", False), ("Never make a budget", False)]),
])

r = Lesson.objects.create(
    title="Inventions That Changed the World", lesson_type="reading", level="Intermediate", tag="History",
    image="https://images.unsplash.com/photo-1518770660439-4636190af475?w=500", duration="6 min", order=20,
    reading_text="Throughout history, certain inventions have completely changed the way humans live. The printing press, invented by Johannes Gutenberg in the fifteenth century, made it possible to produce books quickly and cheaply. This spread knowledge to ordinary people for the first time. Later, the steam engine powered the Industrial Revolution, allowing factories and trains to operate. In the twentieth century, the invention of the computer and later the internet transformed communication and work. Today, almost everyone carries a smartphone, a device more powerful than the computers used to send astronauts to the Moon. Each of these inventions built on the ideas of the past, showing how human progress is a continuous journey.")
add(r, [
    ("What did the printing press make possible?", [("Producing books quickly and cheaply", True), ("Flying to the Moon", False), ("Building trains", False)]),
    ("What powered the Industrial Revolution?", [("The steam engine", True), ("The smartphone", False), ("The internet", False)]),
])

r = Lesson.objects.create(
    title="The Internet of Things", lesson_type="reading", level="Advanced", tag="Technology",
    image="https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=500", duration="8 min", order=21,
    reading_text="The Internet of Things, often shortened to IoT, refers to the growing network of everyday objects that are connected to the internet. These devices can collect and share data without human help. A smart thermostat, for example, can learn your daily routine and adjust the temperature of your home automatically. Smart watches monitor your heart rate and sleep, while connected fridges can tell you when you are running low on food. In cities, IoT sensors can manage traffic lights, reduce energy use, and detect pollution. However, this technology also raises serious concerns about privacy and security. Because so many devices are connected, a single weakness could allow hackers to access personal information. As the IoT continues to expand, finding the right balance between convenience and safety will be a major challenge.")
add(r, [
    ("What does IoT stand for?", [("Internet of Things", True), ("Input of Technology", False), ("Internal Office Tools", False)]),
    ("What concern does the IoT raise?", [("Privacy and security", True), ("Higher food prices", False), ("Slower internet only", False)]),
])

r = Lesson.objects.create(
    title="Protecting Wild Animals", lesson_type="reading", level="Beginner", tag="Nature",
    image="https://images.unsplash.com/photo-1474314881477-04c4aac40a0e?w=500", duration="4 min", order=22,
    reading_text="Many wild animals around the world are in danger of disappearing forever. This is called extinction. Animals such as tigers, elephants, and pandas are losing their homes because forests are being cut down. Some animals are also hunted illegally for their skin, horns, or tusks. To protect these animals, governments create national parks where hunting is not allowed. Scientists also study animals to understand how to keep them safe. Ordinary people can help too. We can support organisations that protect animals, avoid buying products made from endangered species, and learn more about nature. If we all work together, we can make sure that future generations will still be able to see these wonderful animals.")
add(r, [
    ("Why are some animals losing their homes?", [("Forests are being cut down", True), ("They move to cities", False), ("There is too much rain", False)]),
    ("What do governments create to protect animals?", [("National parks", True), ("More factories", False), ("Bigger roads", False)]),
])

r = Lesson.objects.create(
    title="Tips for Better Time Management", lesson_type="reading", level="Intermediate", tag="Self-help",
    image="https://images.unsplash.com/photo-1501139083538-0139583c060f?w=500", duration="5 min", order=23,
    reading_text="Time management is the ability to use your time wisely so that you can get more done with less stress. One of the best techniques is to make a to-do list at the start of each day. Writing down your tasks helps you remember them and gives you a sense of direction. Next, you should prioritise your tasks, doing the most important ones first. Many successful people also avoid multitasking, because switching between tasks wastes mental energy. Taking short breaks is just as important as working, since the brain needs rest to stay focused. Finally, learn to say no to activities that are not important. By managing your time well, you can achieve your goals and still have time to relax.")
add(r, [
    ("What should you do at the start of each day?", [("Make a to-do list", True), ("Start with the easiest task", False), ("Avoid planning", False)]),
    ("Why do successful people avoid multitasking?", [("Switching tasks wastes mental energy", True), ("It is against the rules", False), ("It is too slow to start", False)]),
])

r = Lesson.objects.create(
    title="Festivals Around the World", lesson_type="reading", level="Intermediate", tag="Culture",
    image="https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=500", duration="6 min", order=24,
    reading_text="Festivals are special celebrations that bring people together and reflect the culture of a place. In India, Diwali is known as the festival of lights, when families light small lamps and set off fireworks to celebrate the victory of light over darkness. In Brazil, the Rio Carnival fills the streets with music, dancing, and colourful costumes for several days. In Spain, the famous Tomatina festival sees thousands of people throw tomatoes at each other for fun. Meanwhile, in many Asian countries, the Lunar New Year is a time for family reunions, traditional food, and giving gifts. Although these festivals are very different, they all share a common purpose: to celebrate life, tradition, and the joy of being together.")
add(r, [
    ("What is Diwali known as?", [("The festival of lights", True), ("The festival of tomatoes", False), ("The festival of music", False)]),
    ("What do these festivals share in common?", [("Celebrating life and being together", True), ("Throwing tomatoes", False), ("Lighting fireworks only", False)]),
])

# ================= LISTENING (có transcript -> gTTS) =================

r = Lesson.objects.create(
    title="Ordering at a Restaurant", lesson_type="listening", level="Beginner", tag="Daily Life",
    image="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500", duration="4 min", order=25,
    reading_text="Good evening, and welcome to our restaurant. My name is Tom and I will be your waiter tonight. Here are your menus. Can I get you something to drink while you decide? We have water, juice, soft drinks, and a selection of teas and coffees. Our special today is grilled salmon with vegetables, which is very popular. When you are ready to order, just let me know. If you have any food allergies, please tell me and I will check with the kitchen. After your meal, you can choose from several desserts, including chocolate cake and fresh fruit. Please enjoy your evening, and do not hesitate to ask if you need anything else.")
add(r, [
    ("What is the special today?", [("Grilled salmon with vegetables", True), ("Chocolate cake", False), ("Fresh fruit", False)]),
    ("What should you do if you have a food allergy?", [("Tell the waiter", True), ("Leave the restaurant", False), ("Order dessert first", False)]),
])

r = Lesson.objects.create(
    title="A Doctor's Appointment", lesson_type="listening", level="Beginner", tag="Health",
    image="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500", duration="4 min", order=26,
    reading_text="Hello, please come in and take a seat. So, what seems to be the problem today? I see. How long have you been feeling unwell? Have you had a fever or a cough? Let me check your temperature and listen to your breathing. Please take a deep breath. It looks like you have a common cold, nothing serious. I recommend that you rest at home, drink plenty of water, and take this medicine twice a day after meals. If your symptoms do not improve in five days, please come back to see me. Try to avoid cold drinks and get plenty of sleep. Take care of yourself and you should feel better soon.")
add(r, [
    ("What does the doctor say is wrong with the patient?", [("A common cold", True), ("A broken leg", False), ("A serious disease", False)]),
    ("How often should the patient take the medicine?", [("Twice a day after meals", True), ("Once a week", False), ("Only when in pain", False)]),
])

r = Lesson.objects.create(
    title="Booking a Hotel Room", lesson_type="listening", level="Beginner", tag="Travel",
    image="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500", duration="4 min", order=27,
    reading_text="Thank you for calling the Sunrise Hotel. How can I help you today? You would like to book a room? Certainly. For which dates would you like to stay? We have single rooms and double rooms available. A double room costs eighty dollars per night and includes breakfast. The hotel also has free wifi, a swimming pool, and a car park. Check-in time is from two o'clock in the afternoon, and check-out is before eleven in the morning. May I have your name and a contact number to confirm the booking? We look forward to welcoming you to the Sunrise Hotel. Have a pleasant day.")
add(r, [
    ("How much does a double room cost per night?", [("Eighty dollars", True), ("Eleven dollars", False), ("Two dollars", False)]),
    ("What time is check-out?", [("Before eleven in the morning", True), ("At two in the afternoon", False), ("At midnight", False)]),
])

r = Lesson.objects.create(
    title="Train Station Announcements", lesson_type="listening", level="Beginner", tag="Daily Life",
    image="https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=500", duration="3 min", order=28,
    reading_text="Attention please, ladies and gentlemen. The train to Central City will depart from platform four at ten thirty. Passengers are kindly asked to have their tickets ready for inspection. Please mind the gap between the train and the platform when boarding. The next train to the Airport will arrive in approximately fifteen minutes at platform two. We remind all passengers to keep their luggage with them at all times and to report any unattended bags to a member of staff. Smoking is not allowed anywhere in the station. Thank you for travelling with us, and we wish you a pleasant journey.")
add(r, [
    ("From which platform does the train to Central City depart?", [("Platform four", True), ("Platform two", False), ("Platform ten", False)]),
    ("What should passengers do with unattended bags?", [("Report them to a member of staff", True), ("Take them home", False), ("Leave them on the train", False)]),
])

r = Lesson.objects.create(
    title="A Business Meeting", lesson_type="listening", level="Intermediate", tag="Business",
    image="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=500", duration="6 min", order=29,
    reading_text="Good morning everyone, and thank you for joining today's meeting. Let's begin by reviewing the agenda. First, we will look at last month's sales results, which were higher than expected thanks to our new marketing campaign. Second, we need to discuss the budget for the next quarter. Third, I would like to hear your ideas for improving customer service. Please feel free to share your opinions; every idea is welcome. Before we finish, we will agree on the action points and decide who is responsible for each task. Let's try to keep the meeting to one hour so that everyone can get back to their work. Alright, let's get started with the sales figures.")
add(r, [
    ("Why were last month's sales higher than expected?", [("A new marketing campaign", True), ("Lower prices only", False), ("A longer meeting", False)]),
    ("What does the speaker want to keep the meeting to?", [("One hour", True), ("One day", False), ("Ten minutes", False)]),
])

r = Lesson.objects.create(
    title="University Lecture: Basic Economics", lesson_type="listening", level="Advanced", tag="Science",
    image="https://images.unsplash.com/photo-1543286386-713bdd548da4?w=500", duration="8 min", order=30,
    reading_text="Welcome to today's lecture on basic economics. We will begin with one of the most fundamental concepts: supply and demand. Demand refers to how much of a product consumers are willing to buy, while supply refers to how much producers are willing to sell. When demand is high but supply is low, prices tend to rise. On the other hand, when supply is high but demand is low, prices usually fall. This relationship helps explain why the price of goods changes over time. Another key idea is opportunity cost, which is the value of what you give up when you make a choice. For example, if you spend money on one thing, you cannot spend it on another. Understanding these principles is the foundation for studying more complex economic theories later in this course.")
add(r, [
    ("What happens when demand is high but supply is low?", [("Prices tend to rise", True), ("Prices fall", False), ("Nothing changes", False)]),
    ("What is opportunity cost?", [("The value of what you give up when making a choice", True), ("The total price of all goods", False), ("A type of tax", False)]),
])

print("Library seed created!")
print(f"  Total: {Lesson.objects.count()} lessons, {Question.objects.count()} questions")
