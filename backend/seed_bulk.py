# Offline bulk lessons (no AI, no quota). 16 reading + 16 listening.
# Run:
#   python manage.py shell -c "exec(open('seed_bulk.py', encoding='utf-8').read())"
# Then (for listening audio):
#   python manage.py generate_audio
from lessons.models import Lesson, Question, AnswerOption

LESSONS = [
    # ===================== READING =====================
    {"title": "The Benefits of Exercise", "type": "reading", "level": "Beginner", "tag": "Health", "duration": "4 min",
     "text": "Exercise is one of the best things you can do for your body and mind. When you move your body, your heart becomes stronger and your blood flows better. Regular exercise also helps you sleep well and feel happier, because it releases chemicals in the brain that improve your mood. You do not need to go to a gym to stay active. Simple activities like walking, cycling, or dancing are great ways to keep fit. Doctors recommend at least thirty minutes of activity most days of the week.",
     "questions": [
         ("What does exercise do to your heart?", [("Makes it stronger", True), ("Makes it weaker", False), ("Has no effect", False)]),
         ("How much activity do doctors recommend?", [("At least 30 minutes most days", True), ("Five minutes once a week", False), ("Three hours every day", False)]),
     ]},
    {"title": "The Story of Coffee", "type": "reading", "level": "Intermediate", "tag": "Culture", "duration": "5 min",
     "text": "Coffee is one of the most popular drinks in the world, but few people know its interesting history. According to legend, coffee was discovered in Ethiopia when a goat herder noticed his goats became very energetic after eating certain red berries. Later, people learned to roast and grind the beans to make a drink. Coffee spread to the Middle East and then to Europe, where coffee houses became important places for conversation and business. Today, coffee is grown in many countries near the equator and enjoyed by millions every morning.",
     "questions": [
         ("Where was coffee first discovered, according to legend?", [("Ethiopia", True), ("Europe", False), ("China", False)]),
         ("What were European coffee houses important for?", [("Conversation and business", True), ("Growing beans", False), ("Sleeping", False)]),
     ]},
    {"title": "How Bees Help Our Planet", "type": "reading", "level": "Beginner", "tag": "Nature", "duration": "4 min",
     "text": "Bees are small insects that play a very big role in nature. As they fly from flower to flower to collect nectar, they carry pollen with them. This process, called pollination, helps plants produce fruits, vegetables, and seeds. Without bees, many of the foods we eat every day would become rare and expensive. Sadly, the number of bees is falling in many places because of pollution and the loss of flowers. We can help bees by planting flowers and avoiding harmful chemicals in our gardens.",
     "questions": [
         ("What is the process of carrying pollen called?", [("Pollination", True), ("Evaporation", False), ("Migration", False)]),
         ("How can people help bees?", [("Plant flowers and avoid chemicals", True), ("Cut down more trees", False), ("Use more pollution", False)]),
     ]},
    {"title": "The Rise of Electric Cars", "type": "reading", "level": "Intermediate", "tag": "Technology", "duration": "6 min",
     "text": "Electric cars are becoming more and more common on roads around the world. Unlike traditional cars that burn petrol, electric cars run on batteries and produce no exhaust fumes. This makes them much better for the air we breathe and for fighting climate change. Many governments now offer money to people who buy electric cars, and more charging stations are being built. However, some people worry about how far these cars can travel before the battery runs out. As technology improves, batteries are becoming cheaper and able to last much longer.",
     "questions": [
         ("Why are electric cars better for the air?", [("They produce no exhaust fumes", True), ("They are faster", False), ("They are cheaper", False)]),
         ("What do some people worry about?", [("How far the car can travel on one charge", True), ("The colour of the car", False), ("The size of the wheels", False)]),
     ]},
    {"title": "Sleep and Your Health", "type": "reading", "level": "Beginner", "tag": "Health", "duration": "4 min",
     "text": "Sleep is just as important as food and exercise for a healthy life. While you sleep, your body repairs itself and your brain stores the things you learned during the day. Most adults need between seven and nine hours of sleep each night. People who do not get enough sleep often feel tired, find it hard to concentrate, and may become ill more easily. To sleep better, try to go to bed at the same time every night and avoid looking at bright screens before bedtime.",
     "questions": [
         ("How many hours of sleep do most adults need?", [("Between seven and nine", True), ("Two or three", False), ("Twelve or more", False)]),
         ("What is one tip for sleeping better?", [("Avoid bright screens before bed", True), ("Drink coffee at night", False), ("Sleep at different times each day", False)]),
     ]},
    {"title": "The Great Barrier Reef", "type": "reading", "level": "Intermediate", "tag": "Nature", "duration": "6 min",
     "text": "The Great Barrier Reef, located off the coast of Australia, is the largest coral reef system on Earth. It is so big that it can be seen from space. The reef is home to thousands of species of fish, turtles, and other sea creatures, making it one of the most diverse ecosystems in the world. Unfortunately, rising sea temperatures caused by climate change are harming the coral in a process called bleaching. Scientists and governments are working hard to protect this natural wonder for future generations.",
     "questions": [
         ("Where is the Great Barrier Reef located?", [("Off the coast of Australia", True), ("In the Atlantic Ocean", False), ("Near Europe", False)]),
         ("What is harming the coral?", [("Rising sea temperatures", True), ("Too many tourists swimming", False), ("Lack of fish", False)]),
     ]},
    {"title": "The History of the Internet", "type": "reading", "level": "Advanced", "tag": "Technology", "duration": "8 min",
     "text": "The internet, which billions of people use today, began as a small research project in the 1960s. Scientists in the United States wanted to create a network that could share information between computers in different locations. This early network, called ARPANET, connected just a few universities. Over the following decades, the technology improved and spread, and in 1989 a British scientist named Tim Berners-Lee invented the World Wide Web, which made the internet easy to use. Today the internet connects almost every part of human life, from communication and shopping to education and entertainment.",
     "questions": [
         ("What was the name of the early network?", [("ARPANET", True), ("The World Wide Web", False), ("Google", False)]),
         ("Who invented the World Wide Web?", [("Tim Berners-Lee", True), ("A group of goats", False), ("A coffee seller", False)]),
     ]},
    {"title": "Learning a Second Language", "type": "reading", "level": "Intermediate", "tag": "Education", "duration": "5 min",
     "text": "Learning a second language brings many benefits beyond simply being able to talk to more people. Research shows that people who speak more than one language often have better memories and stronger problem-solving skills. Learning a language also opens the door to understanding new cultures and ways of thinking. The best way to learn is through regular practice, even just a few minutes each day. Mistakes are a natural part of the process, so learners should not be afraid to make them.",
     "questions": [
         ("What mental benefit does learning a language bring?", [("Better memory and problem-solving", True), ("Worse concentration", False), ("Less creativity", False)]),
         ("What is the best way to learn a language?", [("Regular daily practice", True), ("Never making mistakes", False), ("Studying once a year", False)]),
     ]},
    {"title": "Volcanoes and How They Form", "type": "reading", "level": "Advanced", "tag": "Science", "duration": "7 min",
     "text": "A volcano is an opening in the Earth's surface through which hot melted rock, called magma, can escape. Deep below the ground, intense heat and pressure melt rock into magma. When this magma rises and reaches the surface, it erupts as lava, ash, and gas. Volcanoes are often found where the giant plates that make up the Earth's crust meet. Although eruptions can be dangerous and destructive, volcanoes also create fertile soil and new land over time, and they have shaped much of our planet's surface.",
     "questions": [
         ("What is melted rock below the ground called?", [("Magma", True), ("Lava", False), ("Ash", False)]),
         ("Where are volcanoes often found?", [("Where the Earth's plates meet", True), ("Only in deserts", False), ("Only in the ocean's centre", False)]),
     ]},
    {"title": "The Importance of Water", "type": "reading", "level": "Beginner", "tag": "Science", "duration": "4 min",
     "text": "Water is essential for all living things. Our bodies are made up of about sixty percent water, and we need it to digest food, control our temperature, and carry nutrients around the body. People can live for weeks without food, but only a few days without water. Besides drinking, we use water for cooking, cleaning, and growing crops. Because clean water is so precious, it is important not to waste it. Simple actions, like turning off the tap while brushing your teeth, can save a lot of water.",
     "questions": [
         ("About how much of our body is water?", [("Sixty percent", True), ("Ten percent", False), ("Ninety-five percent", False)]),
         ("What is one way to save water?", [("Turn off the tap while brushing teeth", True), ("Leave taps running", False), ("Use more water for fun", False)]),
     ]},
    {"title": "Ancient Egypt and the Pyramids", "type": "reading", "level": "Intermediate", "tag": "History", "duration": "6 min",
     "text": "Ancient Egypt was one of the greatest civilisations in human history, lasting for thousands of years along the River Nile. The Egyptians are famous for building the pyramids, enormous stone structures that served as tombs for their kings, known as pharaohs. The largest, the Great Pyramid of Giza, was built around 4,500 years ago and remains a wonder of engineering. The Egyptians also developed a system of writing called hieroglyphics and made important advances in medicine and mathematics.",
     "questions": [
         ("What were the pyramids used for?", [("Tombs for the pharaohs", True), ("Schools for children", False), ("Markets for trade", False)]),
         ("What was the Egyptian writing system called?", [("Hieroglyphics", True), ("The alphabet", False), ("Numbers", False)]),
     ]},
    {"title": "Renewable Energy Sources", "type": "reading", "level": "Advanced", "tag": "Environment", "duration": "7 min",
     "text": "As the world tries to reduce pollution and fight climate change, renewable energy has become increasingly important. Unlike coal and oil, which will eventually run out and release harmful gases, renewable sources are clean and never disappear. Solar panels capture energy from the sun, while wind turbines turn the power of the wind into electricity. Other sources include hydropower from rivers and geothermal energy from heat deep inside the Earth. Although building these systems can be expensive at first, they save money and protect the environment over time.",
     "questions": [
         ("What do wind turbines do?", [("Turn wind into electricity", True), ("Burn coal", False), ("Store water", False)]),
         ("Why is renewable energy better than coal and oil?", [("It is clean and never runs out", True), ("It is always cheaper to build", False), ("It produces more pollution", False)]),
     ]},
    {"title": "The Power of Habits", "type": "reading", "level": "Intermediate", "tag": "Self-help", "duration": "5 min",
     "text": "Habits are the small actions we repeat so often that we do them almost without thinking. Brushing your teeth, checking your phone, and making coffee in the morning are all habits. Scientists have found that habits form through a loop of three steps: a cue that starts the behaviour, the routine itself, and a reward at the end. The good news is that bad habits can be replaced with better ones by changing the routine while keeping the same cue and reward. Building good habits slowly, one at a time, is the key to lasting change.",
     "questions": [
         ("What are the three steps of a habit loop?", [("Cue, routine, and reward", True), ("Sleep, eat, and work", False), ("Start, stop, and repeat", False)]),
         ("How can bad habits be replaced?", [("By changing the routine but keeping the cue and reward", True), ("By ignoring them completely", False), ("By doing them more often", False)]),
     ]},
    {"title": "Understanding Money and Banks", "type": "reading", "level": "Beginner", "tag": "Finance", "duration": "4 min",
     "text": "Money is something we use every day to buy the things we need, but how does it work? Long ago, people traded goods directly, such as exchanging rice for cloth. This was difficult, so people began using coins and later paper money. Today, banks keep our money safe and allow us to pay using cards or phones. Banks also lend money to people who want to buy a house or start a business. When you keep money in a bank, it may even grow a little through something called interest.",
     "questions": [
         ("How did people trade long ago?", [("By exchanging goods directly", True), ("With credit cards", False), ("Using the internet", False)]),
         ("What is one thing banks do?", [("Keep money safe and lend it", True), ("Grow food", False), ("Build cars", False)]),
     ]},
    {"title": "The Amazon Rainforest", "type": "reading", "level": "Intermediate", "tag": "Nature", "duration": "6 min",
     "text": "The Amazon rainforest in South America is the largest tropical forest on Earth. It is often called the lungs of the planet because its millions of trees produce a large amount of the oxygen we breathe and absorb harmful carbon dioxide. The forest is home to an incredible variety of animals and plants, many of which are found nowhere else. Sadly, large areas are being cut down for farming and wood. Protecting the Amazon is important not only for the species that live there but for the health of the entire planet.",
     "questions": [
         ("Why is the Amazon called the lungs of the planet?", [("It produces oxygen and absorbs carbon dioxide", True), ("It is shaped like lungs", False), ("It is very cold", False)]),
         ("What is threatening the Amazon?", [("Being cut down for farming and wood", True), ("Too much rain", False), ("Too many trees", False)]),
     ]},
    {"title": "How Vaccines Work", "type": "reading", "level": "Advanced", "tag": "Science", "duration": "7 min",
     "text": "Vaccines are one of the most important inventions in the history of medicine, saving millions of lives every year. A vaccine works by teaching the body's immune system to recognise and fight a particular disease. It usually contains a weak or harmless part of the germ that causes the illness. When the vaccine is given, the body produces special cells and antibodies that remember the germ. If the real disease ever enters the body later, the immune system can defeat it quickly before the person becomes seriously ill.",
     "questions": [
         ("What does a vaccine teach the body to do?", [("Recognise and fight a disease", True), ("Sleep more", False), ("Grow taller", False)]),
         ("What does the body produce after a vaccine?", [("Special cells and antibodies", True), ("More germs", False), ("Extra blood only", False)]),
     ]},

    # ===================== LISTENING =====================
    {"title": "Ordering Food for Delivery", "type": "listening", "level": "Beginner", "tag": "Daily Life", "duration": "4 min",
     "text": "Thank you for calling Mario's Pizza, how can I help you today? Sure, I can take your order for delivery. Which pizza would you like? The large pepperoni is very popular. Would you like any drinks or a side of garlic bread with that? Can I have your address and phone number, please? Your total comes to eighteen dollars, and the delivery should arrive in about thirty minutes. You can pay with cash or card when the driver arrives. Thank you for your order, and enjoy your meal.",
     "questions": [
         ("How long will the delivery take?", [("About thirty minutes", True), ("Two hours", False), ("Five minutes", False)]),
         ("How can the customer pay?", [("Cash or card when the driver arrives", True), ("Only by cheque", False), ("In advance only", False)]),
     ]},
    {"title": "A Weather Report", "type": "listening", "level": "Beginner", "tag": "Daily Life", "duration": "3 min",
     "text": "Good morning, and here is today's weather report. This morning will be cloudy and cool, with temperatures around fifteen degrees. In the afternoon, the clouds will clear and the sun will come out, making it feel much warmer. However, there is a chance of light rain in the evening, so it is a good idea to take an umbrella if you go out later. Winds will be gentle from the west. Tomorrow looks bright and sunny all day. That is your weather update, have a wonderful day.",
     "questions": [
         ("What will the weather be like in the afternoon?", [("Sunny and warmer", True), ("Snowy and cold", False), ("Stormy", False)]),
         ("Why should people take an umbrella in the evening?", [("There is a chance of light rain", True), ("It will be very hot", False), ("It will be windy only", False)]),
     ]},
    {"title": "At the Library", "type": "listening", "level": "Beginner", "tag": "Education", "duration": "4 min",
     "text": "Welcome to the city library. To borrow books, you first need a library card, which is free for all residents. You can borrow up to ten books at a time, and you may keep them for three weeks. If you need more time, you can renew them online or by phone. Please remember to return books on time, as late returns have a small fine. We also have computers, quiet study rooms, and free wifi for all visitors. Please keep your voice low so that everyone can study comfortably. Enjoy your visit.",
     "questions": [
         ("How many books can you borrow at one time?", [("Up to ten", True), ("Only one", False), ("Twenty", False)]),
         ("How long can you keep the books?", [("Three weeks", True), ("Three days", False), ("Three months", False)]),
     ]},
    {"title": "Joining a Gym", "type": "listening", "level": "Beginner", "tag": "Health", "duration": "4 min",
     "text": "Hello, welcome to FitLife Gym. Are you interested in becoming a member? We have several options for you. The basic membership costs thirty dollars a month and gives you access to all the exercise machines. The premium membership is fifty dollars a month and also includes group classes like yoga and spinning. All new members get a free session with a personal trainer to help you get started. The gym is open from six in the morning until ten at night, seven days a week. Would you like a tour of the facilities?",
     "questions": [
         ("What does the premium membership include?", [("Group classes like yoga and spinning", True), ("Free meals", False), ("A free car", False)]),
         ("What do all new members receive?", [("A free session with a personal trainer", True), ("A free phone", False), ("A month with no payment", False)]),
     ]},
    {"title": "Planning a Birthday Party", "type": "listening", "level": "Beginner", "tag": "Daily Life", "duration": "4 min",
     "text": "Hi Sarah, I'm calling about the birthday party we're planning for Mum. I think we should have it next Saturday afternoon at her favourite restaurant. I've already invited about fifteen people, and most of them can come. Could you order the cake? She loves chocolate. I'll take care of the decorations and the music. Oh, and let's keep it a surprise, so please don't mention anything to her. Let's meet on Friday to make sure everything is ready. Thanks so much for your help.",
     "questions": [
         ("When will the party take place?", [("Next Saturday afternoon", True), ("Tonight", False), ("Next month", False)]),
         ("What is Sarah asked to do?", [("Order the chocolate cake", True), ("Buy a car", False), ("Cook the dinner", False)]),
     ]},
    {"title": "A Flight Announcement", "type": "listening", "level": "Intermediate", "tag": "Travel", "duration": "4 min",
     "text": "Ladies and gentlemen, this is the final boarding call for flight BA 245 to London, now boarding at gate twelve. Please have your boarding pass and passport ready for the staff at the gate. We remind passengers that only one piece of hand luggage is allowed in the cabin; larger bags must be checked in. The flight time today will be approximately two hours and forty minutes. We ask all passengers to switch off their mobile phones during take-off. Thank you for choosing our airline, and we wish you a pleasant flight.",
     "questions": [
         ("What gate is the flight boarding at?", [("Gate twelve", True), ("Gate two", False), ("Gate twenty", False)]),
         ("How much hand luggage is allowed in the cabin?", [("One piece", True), ("Three pieces", False), ("No limit", False)]),
     ]},
    {"title": "A Radio Advertisement", "type": "listening", "level": "Intermediate", "tag": "Business", "duration": "3 min",
     "text": "Are you tired of cooking every night after a long day at work? Then visit Green Garden, the city's freshest new restaurant. We serve healthy, delicious meals made from locally grown vegetables and the finest ingredients. This week only, enjoy twenty percent off all main dishes when you show this advert on your phone. We are open from eleven in the morning until ten at night, and we also offer free delivery within five kilometres. Bring your family and friends to Green Garden, where good food brings people together.",
     "questions": [
         ("What special offer is available this week?", [("Twenty percent off main dishes", True), ("A free holiday", False), ("Free cars", False)]),
         ("What is special about the restaurant's ingredients?", [("They use locally grown vegetables", True), ("Everything is frozen", False), ("They import all food", False)]),
     ]},
    {"title": "Checking into a Clinic", "type": "listening", "level": "Beginner", "tag": "Health", "duration": "4 min",
     "text": "Good morning, do you have an appointment with us today? May I have your full name and date of birth, please? Thank you. Is this your first visit to our clinic? If so, please fill out this form with your medical history and any allergies you have. The doctor is running about ten minutes behind schedule, so please take a seat in the waiting room. We will call your name when the doctor is ready. If you feel worse while waiting, please let the front desk know immediately.",
     "questions": [
         ("What should a first-time patient do?", [("Fill out a form with medical history", True), ("Pay extra money", False), ("Leave and come back", False)]),
         ("How late is the doctor running?", [("About ten minutes", True), ("Two hours", False), ("Not late at all", False)]),
     ]},
    {"title": "A Tour Guide in the Old Town", "type": "listening", "level": "Intermediate", "tag": "Culture", "duration": "5 min",
     "text": "Welcome everyone to our walking tour of the Old Town. My name is Maria and I will show you around for the next two hours. We are now standing in the main square, which is over five hundred years old. To your right is the famous cathedral, built in the fifteenth century. As we walk through these narrow streets, please stay together and watch your step, as the ground is uneven in places. We will stop for a short break at a traditional cafe halfway through. Feel free to take photographs, but please do not touch the old paintings inside the buildings.",
     "questions": [
         ("How old is the main square?", [("Over five hundred years old", True), ("Ten years old", False), ("One hundred years old", False)]),
         ("What are visitors asked not to do?", [("Touch the old paintings", True), ("Take photographs", False), ("Walk together", False)]),
     ]},
    {"title": "A Customer Service Call", "type": "listening", "level": "Intermediate", "tag": "Business", "duration": "4 min",
     "text": "Thank you for calling TechHelp customer service, my name is James. How can I help you today? I'm sorry to hear that your laptop is not turning on. Let me ask you a few questions to understand the problem. Have you tried charging it for at least thirty minutes? And does any light appear when you press the power button? Based on what you've told me, it sounds like the battery may need replacing. I can arrange for a technician to visit your home this week, or you can bring the laptop to our store. Which option would you prefer?",
     "questions": [
         ("What problem is the customer calling about?", [("A laptop that will not turn on", True), ("A broken phone screen", False), ("A late delivery", False)]),
         ("What does James think the problem might be?", [("The battery needs replacing", True), ("The keyboard is dirty", False), ("The internet is slow", False)]),
     ]},
    {"title": "Renting an Apartment", "type": "listening", "level": "Intermediate", "tag": "Daily Life", "duration": "5 min",
     "text": "Hello, I'm calling about the two-bedroom apartment advertised online. Could you tell me more about it? Is the rent of nine hundred dollars per month including bills, or are water and electricity separate? Does the apartment come with any furniture, or is it empty? I'd also like to know whether pets are allowed, as I have a small dog. And how far is it from the nearest bus stop? If everything sounds good, would it be possible to view the apartment this weekend? Thank you very much for your time.",
     "questions": [
         ("How many bedrooms does the apartment have?", [("Two", True), ("One", False), ("Four", False)]),
         ("Why does the caller ask about pets?", [("They have a small dog", True), ("They dislike animals", False), ("They sell pets", False)]),
     ]},
    {"title": "A Cooking Tutorial", "type": "listening", "level": "Beginner", "tag": "Daily Life", "duration": "4 min",
     "text": "Today I'm going to show you how to make a simple tomato pasta. First, boil a large pot of water and add a little salt. While the water is heating, chop two cloves of garlic and an onion. Heat some olive oil in a pan and cook the garlic and onion until they are soft. Next, add a can of chopped tomatoes and let it simmer for ten minutes. When the water is boiling, add the pasta and cook for about nine minutes. Finally, mix the pasta with the sauce, add some fresh basil, and your delicious meal is ready to serve.",
     "questions": [
         ("What do you add to the water before the pasta?", [("A little salt", True), ("Sugar", False), ("Milk", False)]),
         ("How long should the tomato sauce simmer?", [("Ten minutes", True), ("One hour", False), ("Thirty seconds", False)]),
     ]},
    {"title": "A Science Podcast: The Brain", "type": "listening", "level": "Advanced", "tag": "Science", "duration": "7 min",
     "text": "Welcome back to the Science Hour podcast. In today's episode, we explore one of the most fascinating organs in the body: the human brain. Weighing only about one and a half kilograms, the brain contains around eighty-six billion nerve cells called neurons. These neurons communicate with each other using tiny electrical signals, allowing us to think, feel, and remember. Interestingly, the brain uses about twenty percent of the body's energy, even though it is quite small. Scientists are still discovering new things about how memory works and why we need sleep to keep our brains healthy.",
     "questions": [
         ("About how many neurons does the brain contain?", [("Around eighty-six billion", True), ("About one hundred", False), ("Exactly one million", False)]),
         ("How much of the body's energy does the brain use?", [("About twenty percent", True), ("Almost none", False), ("Ninety percent", False)]),
     ]},
    {"title": "A Sports Commentary", "type": "listening", "level": "Intermediate", "tag": "Sports", "duration": "4 min",
     "text": "And we are back for the second half of this exciting match, with the score still level at one goal each. The home team has started strongly, putting pressure on their opponents. Oh, what a pass that was, straight to the striker, who shoots, and it's a goal! The crowd is going wild as the home team takes the lead. There are still twenty minutes left to play, so the other team has time to fight back. The atmosphere in this stadium is absolutely electric tonight. Both teams are giving everything they have.",
     "questions": [
         ("What was the score at the start of the second half?", [("One goal each", True), ("Three to zero", False), ("No goals yet", False)]),
         ("How much time is left after the goal?", [("Twenty minutes", True), ("Five seconds", False), ("One hour", False)]),
     ]},
    {"title": "A Bank Phone Service", "type": "listening", "level": "Intermediate", "tag": "Finance", "duration": "4 min",
     "text": "Thank you for calling City Bank. For your security, please do not share your full password with anyone. To check your account balance, press one. To report a lost or stolen card, press two. To speak to a customer service representative, press three. Please note that our offices are open from nine in the morning until five in the evening, Monday to Friday. If you are calling about a lost card, we will block it immediately to protect your money and send you a new one within five working days. Please hold while we connect your call.",
     "questions": [
         ("What number do you press to report a lost card?", [("Two", True), ("One", False), ("Five", False)]),
         ("How soon will a new card be sent?", [("Within five working days", True), ("The same hour", False), ("After one month", False)]),
     ]},
    {"title": "A History Documentary: Ancient Rome", "type": "listening", "level": "Advanced", "tag": "History", "duration": "8 min",
     "text": "The Roman Empire was one of the largest and most powerful civilisations the world has ever seen. At its height, it stretched across three continents and ruled over millions of people. The Romans were brilliant engineers who built roads, bridges, and aqueducts, many of which still stand today. They also gave us ideas about law and government that continue to influence modern societies. The city of Rome itself was home to grand buildings like the Colosseum, where thousands of spectators watched games and performances. The empire eventually fell, but its legacy lives on in our language, architecture, and laws.",
     "questions": [
         ("What were the Romans skilled at building?", [("Roads, bridges, and aqueducts", True), ("Spaceships", False), ("Computers", False)]),
         ("What was the Colosseum used for?", [("Games and performances", True), ("Storing water", False), ("Growing crops", False)]),
     ]},
]

# Idempotent: remove these lessons by title (does not touch AI-generated ones)
titles = [L["title"] for L in LESSONS]
Lesson.objects.filter(title__in=titles).delete()

base = Lesson.objects.order_by('-order').values_list('order', flat=True).first() or 30
for i, L in enumerate(LESSONS, start=1):
    lesson = Lesson.objects.create(
        title=L["title"], lesson_type=L["type"], level=L["level"],
        tag=L["tag"], duration=L["duration"], reading_text=L["text"],
        order=base + i,
    )
    for q_order, (qtext, options) in enumerate(L["questions"], start=1):
        q = Question.objects.create(lesson=lesson, text=qtext, order=q_order)
        for o_order, (otext, correct) in enumerate(options, start=1):
            AnswerOption.objects.create(question=q, text=otext, is_correct=correct, order=o_order)

reading = sum(1 for L in LESSONS if L["type"] == "reading")
listening = sum(1 for L in LESSONS if L["type"] == "listening")
print(f"Bulk seed done. Added {reading} reading + {listening} listening.")
print(f"  Total now: {Lesson.objects.count()} lessons, {Question.objects.count()} questions")
