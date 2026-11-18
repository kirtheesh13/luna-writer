from datetime import datetime, timedelta

def get_sample_writings():
    base_time = datetime.utcnow()
    
    return [
        # ================= STORIES =================
        {
            "id": "story-001",
            "title": "The Forgotten Camera at St. Ives",
            "category": "stories",
            "topic": "Mystery & Travel",
            "level": "B1",
            "status": "published",
            "visibility": "public",
            "author_name": "Oliver Finch",
            "description": "During a weekend holiday in a quiet seaside town, Leo discovers an old film camera left on a cafe table.",
            "tags": ["Travel", "Mystery", "Friendship", "Seaside"],
            "word_count": 348,
            "reading_time_minutes": 2,
            "is_sample": True,
            "created_at": base_time - timedelta(days=12),
            "updated_at": base_time - timedelta(days=12),
            "content": """Last summer, Leo decided to take a short holiday by himself. He chose St. Ives, a small coastal town famous for its bright beaches and artists' studios. The weather was unusually warm, and the sea breeze smelled of salt and fresh pastries from the bakeries along the harbour.

On Saturday afternoon, Leo sat outside a busy café overlooking the bay. While he was drinking his tea, he noticed a leather bag underneath the wooden bench opposite him. Inside was an old mechanical camera, heavy and scratched, but clearly well-loved. There was no name tag or phone number, only a small silver badge engraved with the year 1984.

Leo asked the café waiter if anyone had asked for a lost bag, but the waiter shook his head. "People come and go all day," he said with a friendly shrug. Leo felt that he could not just leave it there. He decided to visit the local photo shop near the harbour clock tower. 

The shop owner, an elderly woman named Martha, looked carefully at the serial number. Her eyes widened with surprise. "This belongs to Arthur Davies," she whispered. "He was taking photos of the regatta this morning. He lives just two streets away!"

Ten minutes later, Leo knocked on Arthur's green front door. When the retired sailor opened it and saw his camera, his face lit up with genuine joy. He explained that the camera had belonged to his late wife, and he had carried it to every harbour in Europe. Arthur invited Leo inside for biscuits and told him fascinating stories about sailing across the Atlantic. What began as an ordinary afternoon turned into a friendship Leo would never forget."""
        },
        {
            "id": "story-002",
            "title": "A Rainy Afternoon in the Old Bookstore",
            "category": "stories",
            "topic": "Slice of Life",
            "level": "B1",
            "status": "published",
            "visibility": "public",
            "author_name": "Elena Rostova",
            "description": "A sudden thunderstorm forces Clara to take shelter in an antiquarian bookstore with unexpected treasures.",
            "tags": ["Books", "Rainy Day", "Cozy", "Discoveries"],
            "word_count": 294,
            "reading_time_minutes": 2,
            "is_sample": True,
            "created_at": base_time - timedelta(days=8),
            "updated_at": base_time - timedelta(days=8),
            "content": """The rain started without warning. Clara was walking through the city centre when dark clouds suddenly covered the sun, and heavy drops began splashing against the shop windows. Because she had forgotten her umbrella at home, she hurried into the nearest open doorway.

The sign above the door read 'Pendleton’s Paper & Ink'. Inside, the noise of traffic immediately disappeared, replaced by the comforting smell of old paper and polished wood. Tall wooden shelves stretched from the floor to the high ceiling, crowded with thousands of second-hand books.

Clara wandered down a narrow corridor between history and poetry. In the corner, next to an antique armchair, sat a large orange cat who opened one green eye, purred quietly, and went back to sleep. Behind the desk, an elderly gentleman with round glasses smiled warmly. "Take your time," he said. "The rain will probably last another hour."

Clara ran her fingers along the book spines until one caught her eye: an illustrated guide to botanical gardens from 1950. As she turned the pages, a dried pressed violet fell out from between the chapters. On the back of the page, someone had written in neat handwriting: 'Remember our picnic under the oak tree, June 1958.'

Holding that small piece of someone else's memory made Clara feel connected to the past. She purchased the book for just four pounds. When she finally stepped outside into the fresh, rain-washed air, the streets were sparkling under the afternoon sun, and she felt completely refreshed."""
        },
        {
            "id": "story-003",
            "title": "The Bicycle Journey Across Green Valley",
            "category": "stories",
            "topic": "Adventure",
            "level": "A2",
            "status": "published",
            "visibility": "public",
            "author_name": "Samir Khan",
            "description": "Two best friends embark on a 20-kilometre bike ride to see the famous ancient windmill before sunset.",
            "tags": ["Cycling", "Nature", "Friendship", "Weekend"],
            "word_count": 224,
            "reading_time_minutes": 1,
            "is_sample": True,
            "created_at": base_time - timedelta(days=4),
            "updated_at": base_time - timedelta(days=4),
            "content": """On Sunday morning, Mark and his friend Toby decided to go on a bicycle adventure. The weather was sunny and warm. They packed two water bottles, sandwiches, and an apple in their backpacks. Their goal was to reach the old wooden windmill at the top of Green Valley before sunset.

The path followed a sparkling river for the first five kilometres. Birds were singing in the tall trees, and sheep were eating grass in the green fields. Mark felt happy because he had repaired his bicycle tires the day before, so the ride was very smooth.

However, after two hours, the road became steeper. Toby stopped and drank some water. "My legs are getting tired," he said with a laugh. "Can we rest for ten minutes?" Mark agreed, and they sat under a big chestnut tree to eat their cheese sandwiches.

When they reached the hill at four o'clock, the view was wonderful. The sun was golden, and they could see their whole village in the distance. The old windmill stood tall and proud against the blue sky. Toby took a nice photo of both of them. They rode back home downhill with the wind in their faces, feeling proud of their achievement."""
        },
        {
            "id": "story-004",
            "title": "The Clockmaker's Secret Diary",
            "category": "stories",
            "topic": "Historical Fiction",
            "level": "B2",
            "status": "published",
            "visibility": "public",
            "author_name": "Beatrice Campbell",
            "description": "An apprentice restorer discovers a coded journal hidden inside an eighteenth-century grandfather clock.",
            "tags": ["History", "Crafts", "Mystery", "Art"],
            "word_count": 412,
            "reading_time_minutes": 3,
            "is_sample": True,
            "created_at": base_time - timedelta(days=2),
            "updated_at": base_time - timedelta(days=2),
            "content": """As an apprentice at the Museum of Horology, Hannah spent countless hours examining delicate brass gears and pendulums. Her mentor, Master Higgins, frequently reminded her that clocks were not merely instruments for measuring time; they were mechanical reflections of human ingenuity.

One morning in November, an eighteenth-century longcase clock arrived from an estate in Yorkshire. The mahogany exterior was damaged by dampness, but the internal movement remained surprisingly intact. While carefully disassembling the weight chambers, Hannah noticed a small wooden panel that seemed slightly thicker than usual. When she pressed the brass corner ornament, the panel clicked open, revealing a hidden compartment.

Inside lay a notebook bound in worn green cloth. The pages were filled with intricate sketches of astronomical clocks, accompanied by notes written in a mixture of English and Latin. Hannah realized that the author was not just documenting pendulum lengths; he was recording observations of comet movements that had never been published.

Over the following weeks, Hannah collaborated with university researchers to transcribe the diary. The findings demonstrated that the provincial craftsman had independently calculated planetary orbits decades before more famous scholars. For Hannah, this discovery was a powerful reminder that history often conceals its most brilliant contributors in quiet corners."""
        },

        # ================= LETTERS =================
        {
            "id": "letter-001",
            "title": "Letter of Complaint Regarding Noise and Recycling",
            "category": "letters",
            "topic": "Formal Complaint",
            "level": "B1",
            "status": "published",
            "visibility": "public",
            "author_name": "David Miller",
            "description": "A polite but firm formal letter to the local municipal council regarding irregular rubbish collection.",
            "tags": ["Formal", "Community", "Complaint", "Environment"],
            "word_count": 268,
            "reading_time_minutes": 2,
            "is_sample": True,
            "created_at": base_time - timedelta(days=15),
            "updated_at": base_time - timedelta(days=15),
            "content": """Dear Members of the Town Council,

I am writing to express my concern regarding the recent changes to the recycling collection schedule in the Oakwood residential area. Over the past four weeks, bins have been emptied irregularly, leading to significant inconvenience for local residents.

According to the official calendar published on your website, paper and plastic collections should take place every Tuesday morning. However, during the last two weeks, collection trucks did not arrive until Friday afternoon. Because our bins were already full, several bags had to be left on the pavement. Unfortunately, foxes tore open some bags during the night, scattering plastic packaging across our street.

In addition, the collection team now operates at 5:30 a.m., which causes a great deal of noise and disturbs families with young children who are still sleeping. While we fully support recycling and appreciate the hard work of council employees, we believe that the current timetable is unsuitable for a quiet neighbourhood.

I would be grateful if you could investigate this situation and inform residents whether the timetable can be adjusted to regular morning hours. Furthermore, providing larger bins could prevent waste from overflowing onto the pavement.

Thank you for your time and attention to this matter. I look forward to receiving your prompt reply.

Yours sincerely,  
David Miller  
Representative of the Oakwood Residents Association"""
        },
        {
            "id": "letter-002",
            "title": "Letter of Gratitude to a Former English Teacher",
            "category": "letters",
            "topic": "Personal Reflection",
            "level": "B1",
            "status": "published",
            "visibility": "public",
            "author_name": "Maria Santos",
            "description": "A heartfelt semi-formal letter thanking a teacher whose encouragement inspired a university degree.",
            "tags": ["Gratitude", "Education", "Inspiration", "Life Journey"],
            "word_count": 272,
            "reading_time_minutes": 2,
            "is_sample": True,
            "created_at": base_time - timedelta(days=10),
            "updated_at": base_time - timedelta(days=10),
            "content": """Dear Mrs Harrison,

I hope this letter finds you well. I am writing to share some exciting news and to thank you for the tremendous impact you had on my life during my years at Highfield Secondary School.

Last week, I officially graduated from university with a degree in International Relations and Modern Languages. As I walked onto the stage to receive my diploma, I thought about our English classes five years ago. At that time, I was extremely shy and lacked confidence when speaking English in front of others. I still remember the afternoon when you encouraged me to enter the school essay competition. You told me that having a unique voice was far more important than making occasional grammar mistakes.

Your patience, creative lessons, and belief in my abilities changed the way I thought about learning. Because of your guidance, I decided to study abroad for a semester in Bristol, which was one of the most rewarding experiences of my life.

I am starting a position next month at an educational charity that supports young refugees with language learning. I hope to inspire my students with the same kindness and enthusiasm that you demonstrated every single day in your classroom.

Thank you once again for being such an extraordinary teacher.

Warmest regards,  
Maria Santos"""
        },
        {
            "id": "letter-003",
            "title": "Inquiry Letter for a Language Immersion Course",
            "category": "letters",
            "topic": "Formal Inquiry",
            "level": "B1",
            "status": "published",
            "visibility": "public",
            "author_name": "Kenji Takahashi",
            "description": "A formal inquiry regarding accommodation, placement tests, and fees for a four-week English course.",
            "tags": ["Inquiry", "Study Abroad", "Language", "Formal"],
            "word_count": 238,
            "reading_time_minutes": 2,
            "is_sample": True,
            "created_at": base_time - timedelta(days=6),
            "updated_at": base_time - timedelta(days=6),
            "content": """Dear Admissions Director,

I am writing to inquire about the Intensive B1-B2 English Course advertised in your summer programme brochure. I am planning to visit the UK for four weeks in July to improve my spoken English and prepare for the Cambridge B2 First examination.

Could you please provide additional details regarding the following points?

1. Placement Test: Does the school conduct an online assessment before arrival, or is the test administered on the first morning of the course?
2. Class Sizes: What is the maximum number of students per class during the summer term?
3. Accommodation Options: Could you send information about host families located within walking distance of the campus? I would prefer a single room with half-board meals included.
4. Social Activities: Are weekend cultural excursions to Oxford and London included in the tuition fee, or are they charged separately?

I have attached my current educational certificates for your reference. If there are any early registration discounts available, please let me know before the deadline.

Thank you very much for your assistance. I look forward to hearing from you soon.

Yours faithfully,  
Kenji Takahashi"""
        },

        # ================= ARTICLES =================
        {
            "id": "article-001",
            "title": "Why Learning to Cook is the Best Habit for Students",
            "category": "articles",
            "topic": "Lifestyle & Health",
            "level": "B1",
            "status": "published",
            "visibility": "public",
            "author_name": "Chloe Bennett",
            "description": "How basic cooking skills can save money, boost energy, and bring friends together at university.",
            "tags": ["Food", "Healthy Living", "Student Life", "Money"],
            "word_count": 362,
            "reading_time_minutes": 2,
            "is_sample": True,
            "created_at": base_time - timedelta(days=14),
            "updated_at": base_time - timedelta(days=14),
            "content": """When young people move away from home for university or their first job, they face many new responsibilities. Between attending lectures, doing homework, and managing a tight budget, preparing healthy meals is often the first thing they neglect. Many rely on frozen pizzas or expensive takeaway food. However, learning to cook simple meals is one of the most rewarding habits you can develop.

First and foremost, cooking at home saves an astonishing amount of money. A single takeaway meal often costs as much as three days of fresh groceries from the supermarket. Basic ingredients such as pasta, eggs, rice, seasonal vegetables, and canned beans are inexpensive and easy to store. With a few herbs and spices, you can turn these simple ingredients into delicious, nutritious dinners without spending a fortune.

Secondly, home-cooked food is much healthier than restaurant meals. Fast food often contains excessive amounts of salt, sugar, and saturated fat. When you prepare your own dishes, you know exactly what is on your plate. Eating balanced meals gives you steady energy throughout the day, which helps you concentrate better during study sessions and exam periods.

Finally, cooking is a wonderful social activity. Inviting flatmates or classmates over to prepare a curry or homemade tacos is far more memorable than sitting in a crowded café. It builds teamwork and provides a relaxing break from computer screens.

You do not need to become a master chef overnight. Start by learning three straightforward recipes—such as vegetable stir-fry, tomato pasta, and vegetable soup. Once you master those, you will realize that cooking is not a chore, but an enjoyable creative hobby."""
        },
        {
            "id": "article-002",
            "title": "Cycling vs Public Transport: Which is Better for Your Town?",
            "category": "articles",
            "topic": "Environment & City Life",
            "level": "B1",
            "status": "published",
            "visibility": "public",
            "author_name": "Marcus Aurel",
            "description": "An analysis of urban mobility comparing bicycles with buses and metro systems for daily commutes.",
            "tags": ["Environment", "Cities", "Transport", "Green Living"],
            "word_count": 384,
            "reading_time_minutes": 2,
            "is_sample": True,
            "created_at": base_time - timedelta(days=7),
            "updated_at": base_time - timedelta(days=7),
            "content": """As cities grow increasingly crowded, municipal leaders around the world are asking the same question: how can we encourage citizens to leave their private cars at home? The two most popular green alternatives are cycling and public transport. While both options reduce air pollution, each has unique advantages and challenges.

Cycling has become extremely popular over the last five years, especially in European capitals. The primary benefit of riding a bicycle is independence. Cyclists never have to wait at bus stops or worry about delayed trains. Furthermore, cycling provides daily cardiovascular exercise, helping commuters stay fit and reduce stress before arriving at work. It is also practically free after the initial purchase of the bicycle and safety equipment.

On the other hand, public transport remains essential for longer journeys and inclement weather. Not everyone is able to cycle ten kilometres in heavy rain or freezing winter temperatures. Buses, trams, and underground trains allow elderly citizens, families with strollers, and people with disabilities to travel comfortably across entire metropolitan regions. Moreover, riding a bus allows passengers to read books, listen to podcasts, or catch up on emails while someone else does the driving.

However, both systems require modern infrastructure to succeed. Cyclists need safe, separated bike lanes so they do not have to compete with large delivery lorries. Meanwhile, public transport must be frequent, punctual, and reasonably priced; otherwise, commuters will return to their private vehicles.

In conclusion, the most livable towns do not choose between cycling and public transport. Instead, they combine both. When train stations provide secure bike parking and allow bicycles on board during quiet hours, residents enjoy the best of both worlds."""
        },
        {
            "id": "article-003",
            "title": "How Podcasts Can Supercharge Your Language Learning",
            "category": "articles",
            "topic": "Education & Technology",
            "level": "B1",
            "status": "published",
            "visibility": "public",
            "author_name": "Amina Touré",
            "description": "Practical strategies for using audio podcasts to enhance listening comprehension and everyday vocabulary.",
            "tags": ["Podcasts", "Language Tips", "Technology", "Learning"],
            "word_count": 326,
            "reading_time_minutes": 2,
            "is_sample": True,
            "created_at": base_time - timedelta(days=3),
            "updated_at": base_time - timedelta(days=3),
            "content": """Listening is often the most challenging skill for intermediate English learners. Native speakers speak quickly, connect words together, and use slang expressions that you rarely find in standard grammar textbooks. Fortunately, the explosion of free podcasts has made natural listening practice more accessible than ever before.

Why are podcasts so effective for language learners? First, they fit seamlessly into your everyday routine. You do not need to sit at a desk with a notebook. You can listen while washing the dishes, walking the dog, or commuting on the train. By replacing empty moments with English audio, you can easily practice for thirty minutes every day without disrupting your schedule.

Second, podcasts cover every topic imaginable. Whether you are interested in space exploration, cinema, psychology, or football, you can find hundreds of shows discussing your favourite subject. When you genuinely care about the topic, your brain stays focused, and you acquire new vocabulary naturally rather than through boring memorization.

To get the most out of your listening sessions, here are three simple tips:

1. **Slow down the speed:** Most podcast apps allow you to adjust playback speed to 0.8x or 0.9x if the speakers talk too fast.
2. **Listen twice:** Listen once without reading to test your general comprehension, then listen a second time while reading the transcript.
3. **Repeat aloud:** Pause the episode after an interesting sentence and repeat it, imitating the speaker's rhythm and pronunciation.

Consistent practice will soon make English conversations feel natural and effortless."""
        },

        # ================= EMAILS =================
        {
            "id": "email-001",
            "title": "Catching Up and Planning Our Weekend Trip",
            "category": "emails",
            "topic": "Informal Friendship",
            "level": "B1",
            "status": "published",
            "visibility": "public",
            "author_name": "Sophie Turner",
            "description": "A warm, informal email to an old friend proposing dates, hiking routes, and accommodation in the Lake District.",
            "tags": ["Informal", "Travel", "Friends", "Weekend"],
            "word_count": 218,
            "reading_time_minutes": 1,
            "is_sample": True,
            "created_at": base_time - timedelta(days=9),
            "updated_at": base_time - timedelta(days=9),
            "content": """Hi Jessica,

How are things going with your new job? I hope you are settling in well and that your colleagues are friendly!

It feels like ages since we last met for coffee. I am writing because I was thinking about our plan to visit the Lake District for a hiking weekend. Are you still interested? 

I checked the train timetable, and we could leave on Friday afternoon, May 14th, right after work. I found a lovely little bed-and-breakfast near Keswick that has great reviews and includes a full English breakfast. It is only a ten-minute walk from the lake, and they even lend walking poles and maps to guests.

On Saturday, we could do the hike around Derwentwater, which is about sixteen kilometres and relatively flat. Afterwards, we can have dinner at that traditional pub you recommended last year. If the weather is nice on Sunday, we could rent a rowing boat before heading back to London.

Let me know if that weekend works for your schedule. If not, the following weekend (May 21st-23rd) is also completely fine with me.

Can’t wait to catch up properly!

Lots of love,  
Sophie"""
        },
        {
            "id": "email-002",
            "title": "Apology and Rescheduling of the Project Review Meeting",
            "category": "emails",
            "topic": "Semi-formal Work",
            "level": "B1",
            "status": "published",
            "visibility": "public",
            "author_name": "Liam Davies",
            "description": "A polite business email apologizing for an urgent conflict and proposing two alternative meeting slots.",
            "tags": ["Workplace", "Polite", "Scheduling", "Professional"],
            "word_count": 178,
            "reading_time_minutes": 1,
            "is_sample": True,
            "created_at": base_time - timedelta(days=5),
            "updated_at": base_time - timedelta(days=5),
            "content": """Dear Alex,

I hope you are having a productive week.

I am writing to apologize, but I will unfortunately need to reschedule our project review meeting originally scheduled for tomorrow, Thursday at 2:00 p.m. An urgent client presentation has been called by senior management for the exact same time slot, and my attendance is mandatory.

I am very sorry for any inconvenience this late change may cause to your schedule. Our discussion regarding the website relaunch is very important to me, and I would like to meet as soon as possible.

Would either of the following times suit you?

- Friday, November 14th at 10:30 a.m.
- Monday, November 17th at 2:00 p.m.

If neither of these options is convenient, please suggest a time that works better for you, and I will do my best to accommodate it.

Thank you very much for your understanding.

Best regards,  
Liam Davies  
Digital Communications Lead"""
        },
        {
            "id": "email-003",
            "title": "Invitation to the Annual Summer Street Barbecue",
            "category": "emails",
            "topic": "Community & Social",
            "level": "B1",
            "status": "published",
            "visibility": "public",
            "author_name": "Claremont Residents Team",
            "description": "A friendly community email inviting neighbourhood families to a potluck barbecue with activities.",
            "tags": ["Community", "Social", "Invitation", "Neighbours"],
            "word_count": 214,
            "reading_time_minutes": 1,
            "is_sample": True,
            "created_at": base_time - timedelta(days=1),
            "updated_at": base_time - timedelta(days=1),
            "content": """Dear Neighbours,

Summer is finally here, and it is time for our annual Claremont Crescent Street Barbecue! 

The event will take place on Saturday, June 26th from 1:00 p.m. to 6:00 p.m. in the communal garden behind building number 12. As in previous years, the street association will provide the barbecue grills, charcoal, paper plates, and soft drinks. 

To make the afternoon enjoyable for everyone, we kindly ask each household to bring a dish to share:

- Even-numbered flats: Please bring a salad, appetizers, or side dish (e.g. potato salad, garlic bread, chips and dips).
- Odd-numbered flats: Please bring a dessert or fresh fruit (e.g. brownies, cupcakes, sliced watermelon).

We will also have face-painting and fun outdoor games for children, as well as a friendly trivia quiz for adults at 3:30 p.m. Feel free to bring your own camping chairs or picnic blankets.

In order to help us estimate quantities for drinks and burgers, please reply to this email by Wednesday, June 23rd with the number of people attending from your home.

We look forward to seeing both familiar faces and welcoming new residents!

Warm wishes,  
The Claremont Street Social Committee"""
        },

        # ================= A1, C1 & C2 EXPANSIONS =================
        {
            "id": "story-005",
            "title": "A Morning in the Green Park",
            "category": "stories",
            "topic": "Daily Life",
            "level": "A1",
            "status": "published",
            "visibility": "public",
            "author_name": "Anna Green",
            "description": "A very simple story about a girl and her friendly brown dog walking in the sun.",
            "tags": ["Nature", "Pets", "Morning", "Simple"],
            "word_count": 112,
            "reading_time_minutes": 1,
            "is_sample": True,
            "created_at": base_time - timedelta(days=1),
            "updated_at": base_time - timedelta(days=1),
            "content": """My name is Anna. Today is Saturday. The sun is in the sky, and it is a warm morning.

I walk to the green park with my dog, Bruno. Bruno is a big brown dog with happy eyes. He runs on the green grass. I throw a small red ball, and Bruno catches it. Many children are in the park. They laugh and ride small bikes.

At ten o'clock, we sit under a tall tree. I drink cold water, and Bruno drinks water from his blue bowl. We are very happy."""
        },
        {
            "id": "story-006",
            "title": "The Cartographer of Saint-Malo",
            "category": "stories",
            "topic": "Literary Fiction",
            "level": "C1",
            "status": "published",
            "visibility": "public",
            "author_name": "Julian Vane",
            "description": "An intricate narrative examining memory, coastal tides, and hand-drawn maritime navigational charts.",
            "tags": ["Maritime", "Philosophy", "Art", "Intricate"],
            "word_count": 418,
            "reading_time_minutes": 3,
            "is_sample": True,
            "created_at": base_time - timedelta(days=1),
            "updated_at": base_time - timedelta(days=1),
            "content": """In the granite-walled citadel of Saint-Malo, Monsieur Laurent preserved an art that the modern world had deemed antiquated. His atelier was cluttered with brass dividers, vellum scrolls, and copperplate engravings depicting coastal shoals and deceptive tidal currents. To Laurent, a map was not merely a pragmatic navigational instrument; it was a philosophical dialogue between terrestrial permanence and maritime volatility.

One evening in late October, a tempest battered the Brittany coastline. The howling Atlantic gale rattled the leaded glass panes of the workshop, extinguishing the oil lamps. In the dim flickering candlelight, an enigmatic young sailor presented Laurent with a fragmented sea chart salvaged from an eighteenth-century frigate. The ink was faded, yet the meticulous precision of the subterranean reef bathymetry was unmistakable.

Laurent examined the parchment under his magnifying lens. The anonymous draughtsman had incorporated esoteric symbols signifying subterranean magnetic anomalies and shifts in abyssal topography. "This was charted by someone who did not merely observe the seabed," Laurent murmured, his voice steeped in reverence, "but who comprehended its primordial rhythm."

Collaborating through the long winter nights, Laurent and the maritime scholar reconstructed the coordinates. Their scholarly enterprise culminated in an exquisite exhibition at the Regional Maritime Archive. For Laurent, the chart affirmed his lifelong conviction: true cartography does not subjugate the ocean; rather, it yields humility before its unfathomable mysteries."""
        },
        {
            "id": "letter-004",
            "title": "A Friendly Postcard to My Friend Tom",
            "category": "letters",
            "topic": "Holiday Greeting",
            "level": "A1",
            "status": "published",
            "visibility": "public",
            "author_name": "Lucas Diaz",
            "description": "A short, easy postcard greeting describing beach weather and family holidays.",
            "tags": ["Holiday", "Friend", "Postcard", "Simple"],
            "word_count": 78,
            "reading_time_minutes": 1,
            "is_sample": True,
            "created_at": base_time - timedelta(days=1),
            "updated_at": base_time - timedelta(days=1),
            "content": """Dear Tom,

Greetings from Brighton! 

I am here with my parents and my sister. The beach is very nice and the sea is blue. We eat fish and chips every day. Yesterday, we visited the big pier and played fun games. 

The weather is sunny. I hope you are having a good week at school. See you next Monday!

Best wishes,  
Lucas"""
        },
        {
            "id": "letter-005",
            "title": "Formal Petition to the Historical Architectural Trust",
            "category": "letters",
            "topic": "Civic Advocacy",
            "level": "C2",
            "status": "published",
            "visibility": "public",
            "author_name": "Evelyn Montgomery, PhD",
            "description": "An eloquent, sophisticated academic appeal arguing for the preservation of nineteenth-century ironworks.",
            "tags": ["Heritage", "Civic", "Architecture", "Mastery"],
            "word_count": 365,
            "reading_time_minutes": 3,
            "is_sample": True,
            "created_at": base_time - timedelta(days=1),
            "updated_at": base_time - timedelta(days=1),
            "content": """To the Board of Trustees,  
The Royal Architectural Preservation Trust

It is with an acute sense of urgency and profound civic responsibility that I submit this formal petition concerning the impending demolition of the Victorian foundry complex situated on St. Jude’s Wharf.

While commercial imperatives frequently dictate urban reconfiguration, to raze these seminal structures would constitute an irreparable act of cultural vandalism. Erected in 1868, the foundry represents an extraordinary manifestation of industrial vernacular design, characterized by soaring cast-iron trusses, polychromatic brickwork, and an ingenious natural ventilation paradigm that prefigured contemporary sustainable architecture by over a century.

Furthermore, the site is indelibly intertwined with the socio-economic evolution of the municipality. It stands as an eloquent testament to the working-class artisans whose collective industriousness propelled this region into global prominence. To dismantle this edifice in favour of generic residential monoliths would be to sever our collective consciousness from the physical hallmarks of our heritage.

I implore the Trust to exercise its statutory prerogative by initiating an expedited preservation audit. Adaptive reuse proposals developed by civic architects demonstrate unequivocally that the foundry can be conscientiously repurposed into thriving cultural ateliers and community archives while preserving its structural integrity.

I remain entirely at your disposal should the Board wish to review our comprehensive historiographical dossier.

Yours with utmost esteem,  
Dr. Evelyn Montgomery, FSA  
Honorary Chair of the Heritage Antiquarian Society"""
        },
        {
            "id": "article-004",
            "title": "My Weekend Morning Routine",
            "category": "articles",
            "topic": "Daily Habits",
            "level": "A1",
            "status": "published",
            "visibility": "public",
            "author_name": "Maya Patel",
            "description": "Simple sentences describing breakfast, music, and quiet mornings.",
            "tags": ["Routine", "Breakfast", "Weekend", "Simple"],
            "word_count": 96,
            "reading_time_minutes": 1,
            "is_sample": True,
            "created_at": base_time - timedelta(days=1),
            "updated_at": base_time - timedelta(days=1),
            "content": """Sunday is my favorite day of the week. 

I wake up at eight o'clock in the morning. I do not wear my school uniform. I put on warm clothes and drink hot tea with milk. My father makes eggs and toast in the kitchen. The kitchen smells good.

After breakfast, I listen to quiet music in my room and read a picture book. Later, my brother and I clean our desks. It is a calm and peaceful day."""
        },
        {
            "id": "article-005",
            "title": "The Epistemic Nuances of Urban Acoustic Ecology",
            "category": "articles",
            "topic": "Environment & Philosophy",
            "level": "C1",
            "status": "published",
            "visibility": "public",
            "author_name": "Dr. Sterling Thorne",
            "description": "An advanced exploration of soundscapes, anthropogenic noise pollution, and sensory design in twenty-first-century cities.",
            "tags": ["Acoustics", "Ecology", "Urban Design", "Advanced"],
            "word_count": 412,
            "reading_time_minutes": 3,
            "is_sample": True,
            "created_at": base_time - timedelta(days=1),
            "updated_at": base_time - timedelta(days=1),
            "content": """The auditory dimension of urban habitability has long languished in the periphery of municipal planning discourse. While contemporary planners demonstrate commendable vigilance regarding air particulates and carbon metrics, the acoustic tapestry of the metropolis is predominantly treated as an inevitable, albeit regrettable, byproduct of human concentration. However, emerging disciplines within psychoacoustics and environmental phenomenology argue persuasively that the sonic landscape constitutes a vital determinant of neurological well-being and social cohesion.

Anthropogenic noise—characterized by the pervasive hum of combustion engines, pneumatic ventilation shafts, and relentless infrastructural construction—exerts a corrosive, chronic stress response upon urban inhabitants. Far from merely presenting a superficial nuisance, sustained auditory overstimulation impairs cognitive development in children, disrupts circadian homeostasis, and diminishes empathetic interpersonal engagement.

Conversely, acoustic ecologists advocate for the intentional integration of biophonic sound sanctuaries. Incorporating cascading water features, dense botanical windbreaks, and resonant stone colonnades does not merely attenuate decibel spikes; it reintroduces harmonic equilibrium into the civic arena. When city residents are granted moments to perceive the rustle of deciduous leaves or the melodic cadence of avian calls, their sensory faculties experience a quantifiable restorative respite.

Ultimately, reimagining the urban acoustic environment necessitates an ideological transition. We must cease construing silence as an empty void to be colonized by mechanical dissonance, and instead cultivate acoustic biodiversity as an indispensable public commons."""
        }
    ]
