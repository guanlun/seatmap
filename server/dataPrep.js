const MongoClient = require('mongodb').MongoClient;
const keywordExtractor = require('keyword-extractor');

const DUMMY_NAMES = [
    'Fabian Button',
    'Ami Branner',
    'Lashaun Trostle',
    'Nolan Coppock',
    'Jaimee Averitt',
    'Bianca Blossom',
    'Tarsha Foutch',
    'Cathi Hensler',
    'Alia Dupont',
    'Gaynell Rueter',
    'Maribel Redington',
    'Hwa Coakley',
    'Ofelia Lakes',
    'Ellie Bernhard',
    'Johana Minelli',
    'Jae Eggert',
    'Deedra Hoehne',
    'Harris Canady',
    'Reginald Starks',
    'Despina Zollinger',
];

const DUMMY_TOPICS = [
    'Foodwebs',
    'Adaptation',
    'CO2',
    'Inherited traits',
];

const DUMMY_CONTEXT = [
    'Home',
    'Museum',
    'Park',
];

const WRITINGS = [
    "Today I went to a ranch as we were driving to the main house we saw some cows. They were eating grass. We also saw some mounds of dirt with some worms sticking out. I know that in the story grass is the producers because it makes it's own food. i know that cows are the consumer because they were eating the grass and I know that worms are the decomposers because in the story they were most likely the only decomposer that are in the fields. That since I went to the ranch i know those three things.",
    "To adapt to an environment is to change the way you do things. How you look, how you hunt, everything. On where you are. What hunts you or what you eat. A chameleon camoflauges by changing color into whatever it's near or on that way it does not get eaten and it can not be seen by things it is trying to eat. So i think adapting to your environment is to change along with your environment so that you can fit the needs of living in that environment. A chameleon is a prime example of adaptation.",
    "A raven is a prime example of adaptation it can adapt to whatever ecosystem it is in, whether it's in the Northern snowstorm or down in Texas with the sun beating on it's wings. When i think of the word adapt i think raven or i picture a raven, that's just what I do because I know that ravens are really good adaptors. If someone asked me to come up with my own definition of adapt that wasn't in the dictionary then I think it would be to change stuff about you to fit in to your environment. Like for example, changing the way you protect yourself from prey because of where you live. That is what i think of when i think adapt.",
    "I think that to adapt is to change the way you do things to fit in with the characteristics of your environment. I think otters are great examlpes of this because they adapted many different ways. Like, for example, they use rocks to break open nuts and they use wood around them to build a dam for them to live in. That is why otters are a good example of my definition of adaptation.",
    "Most animals use camoflauge whether it is their primary defense mechanism to stay away from predators or their 20th, most animals use it. A good example of camoflauge is the stick bug. The stick bug just looks like a stick. Whether it is in a bundle of sticks or it's just laying on the ground predators don't think that there is a bug there they just think \"Oh it's a stick\". Stick bugs are very VERY good examples of camoflauge they camoflauge really well.",
    "Another animal that is good at camoflauge is the snake. Because most snakes are the color of leaves then they can just slither into leaves, predator and prey don't notice them. They can hide from predator and lunge at prety giving them an easy breakfast, lunch or dinner. THere are many things animals can do for camoflauge. They can cover themselves up or use their natural skin they just have to find the right background although you can't deny that some animals do have it easier than others. Like stick bugs and snakes, they have it way easier than others ones like tigers maybe? Tigers can totally still camoflauge they just have to try harder to find the right spot.",
    "Another animal that is good at camoflauge is the leaf bug. The leaf bug can pretty much crawl over to any producer and just sit there. Seems pretty good right? All animals can camoflauge they just have to find the right background, it's easier for some than others. For some you just have to crawl five inches to the nearest tree, like the leafe bug. To camoflauge is to blend in with your surroundings and I have to admit some do it better than others. Some can even change the way they look to blend into their surrounds they dont' have to go crawl off and find one that just happens to match their skin tone. That's pretty awesome.",
    "Co-starring with me is my brown labrador retriever dog Zelda. And so Zelda wants to talk to us today about inherited traits that she believe she has as a dog. She thinks the main one is her brown fur and so she thinks that is an inherited trait because it comes from her parents. Now since Zelda was dumped on the side of the road with her three siblings we can't know for certain if her parents were brown or not but we can assume that at least one of them was. Even though her three siblings were all black. So we can probably assume that her parents were black and brown. That's probably it. And so that's why Zelda thinks it is an inherited trait because it most likely got passed on from her parents. And as for me, I agree with her I think that is an inherited trait. And that's what Zelda says.",
    "I believe las ttime I introduced you to my dog Zelda. So after thinking about it for a while Zelda thought of another inherited trait that she has as a dog. She says that this inherited trait is being able to get milk form her mother right after she's born. She thinks it's amazing that some animals are able to do actions just off instinct. She thinks that's amazing she likes to research that in her spare time whenever she's not napping or watching tv with me she likes to research that, she's a scientist dog. Well anyway, she thinks it's an inherited trait because all dogs can do it and she also gets it from her mother and father because they could do it too. What do you think Zelda? Were your parents born in like what? 2005 do you think? I don't know well that must be a long time ago for you. Well anyway that's what Zelda thinks, I agree with her. And I'm not just cheating off of Zelda's answers, I actually agree with that. These are straight Zelda's words not mine, goodbye. 1 1 2",
    "So I was talking to Zelda again today and she said she thought of another inherited trait and she says that it was her hazel eye color. She thinks that it's pretty cool that you can get things from your parents and even though we haven't seen her parents she's pretty certain that one of them had the eye color of hazel. So yeah that's pretty cool, right Zelda? I agree with her and I know I say that all the time but she's good. I mean I have a reason to agree with her. So Zelda why don't you tell them that you're really saying this and I'm not just putting words in your mouth. *pause* And that was Zelda confirming, so right now she's telling me to tell you bye. Why don't you tell them by instead Zelda here. Did you hear that? That was a great long speech.",
    "I believe you've already been introduced to my dog Zelda. And Zelda is here to talk to us today about learned behaviors that she believes she has as a dog. She thinks one of her learned behaviors is fetching and she thinks that's a good accomplishment. I guess that's a good accomlishment because you have to let her sniff it before you throw it and someties the ball falls out of her mouth as she's running back to me so it only ends up getting back to me about 1/8th of the time. So, I guess that's a pretty good accomplishment for her. 1/8th of the balls thrown have come back to me. And when the ball doesn't fall out of her mouth she's usually pretty good at it. Anyway she thinks that fetching is a learned behavior and not an inherited trait because even though her parents probably knew how to do she didn't know how to do when she was little so she would have learned how to do it, and trust me it took a long time for her to learn how to do it.",
    "Zelda thinks one of her other learned behaviors is the ability to sit on a command and that's a good ability to have. You can make her sit when you want her to rather than just her running wild and even though that's not a special dog ability it's still a good one to have to keep control of your dog and Zelda needs it so I'm glad we taught her that one. She thinks it's a learned behavior because she learned how to do it. Trust me, before we got her she didn't know how to sit on command. She didn't know how to do anything on command. So that's what Zelda thinks is another one of her learned behaviors. I agree with her too, I mean I don't think there's really a time I disagree with Zelda except when it's an opinion but she's pretty good at sitting, that is as long as you give her a treat. She doesn't really do free labor *sigh* and that's why Zelda thinks it's a learned behavior and not an inherited trait.",
];

const seats = [];
let seatIdx = 0;
for (let x = 0; x < 5; x++) {
    for (let y = 0; y < 3; y++) {
        seats.push({
            id: seatIdx,
            position: {
                x: 20 + x * 150,
                y: 20 + y * 80,
            },
        });
        seatIdx++;
    }
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function randArrayOfValues(length, values) {
    const arr = [];
    const vCount = values.length;
    for (let i = 0; i < length; i++) {
        arr.push(values[Math.floor(Math.random() * vCount)]);
    }

    return arr;
}

function generateRandomStudentPerformance() {
    return {
        attendance: randArrayOfValues(10, [true, false]),
    }
}

function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const shuffledSeats = shuffle(seats);
const shuffledWritings = shuffle(WRITINGS);
const students = [];
for (let i = 0; i < 12; i++) {
    const keywords = keywordExtractor.extract(shuffledWritings[i], { language: 'english', remove_duplicates: true });
    const processedKeywords = keywords.map(w => w.replace(/\W+/g, ''));
    students.push({
        username: `test_${i}`,
        password: `test_${i}`,
        name: DUMMY_NAMES[i],
        performance: generateRandomStudentPerformance(),
        seatId: shuffledSeats[i].id,
        homeworks: [{
            topic: randomItem(DUMMY_TOPICS),
            context: randomItem(DUMMY_CONTEXT),
            writing: shuffledWritings[i],
            keywords: processedKeywords,
        }],
        // storyTopic: randomItem(DUMMY_TOPICS),
        // storyContext: randomItem(DUMMY_CONTEXT),
        // storyText: loremIpsum({
        //     count: 5,
        // })
    });
}

MongoClient.connect('mongodb://localhost:27017/', (err, client) => {
    const db = client.db('seatmap');

    const studentCollection = db.collection('students');
    studentCollection.remove({});
    studentCollection.insertMany(students);
})