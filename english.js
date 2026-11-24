/* english.js — Practice Lab's curated English content: Daily words (3 Tier-2 "book words" a day,
 * each with a short story, a guess-from-context question, a bilingual explanation, examples,
 * synonyms/antonyms and review data) and Daily skills (grammar + reading-skill cards).
 * Self-authored for this app (no copyrighted text). NZ English spelling.
 * Loaded as a classic <script>; also require()-able in Node for tests. The DATA block between the
 * BEGIN/END markers is STRICT JSON so the printable-workbook generator (Python) can read it.
 */
(function (root) {
  'use strict';
  /*BEGIN-DATA*/
  var DATA = {
    "version": 1,
    "days": [
      {
        "day": 1,
        "theme": "storm at the lighthouse",
        "type": "narrative",
        "title": "The Lighthouse on the Point",
        "words": [
          "steadfast",
          "ramshackle",
          "relish"
        ],
        "passage": "For three days the storm roared along the coast. Huge waves crashed over the rocks. The **ramshackle** sheds by the beach, already old and falling apart, blew away in pieces. Even the tall pine trees bent low. But the little lighthouse on the point stood **steadfast**. Every night its light kept turning, guiding the boats safely home. When the storm finally passed, the lighthouse keeper, Aroha, sat outside with a hot cup of cocoa. She **relished** every sip, enjoying it slowly as she watched the calm, shining sea.",
        "qs": [
          {
            "skill": "vocab",
            "q": "Which word from the story means ‘old and falling apart’?",
            "opts": [
              "steadfast",
              "shining",
              "ramshackle",
              "calm"
            ],
            "a": 2,
            "why": "The sheds were ‘already old and falling apart’ — that is what **ramshackle** means. Steadfast means the opposite: standing firm.",
            "whyZh": "故事里说这些小屋“已经又旧又快散架了”，这正是 ramshackle 的意思。steadfast 恰恰相反，意思是稳稳地站住。"
          },
          {
            "skill": "inference",
            "q": "Why did Aroha most likely relish her cocoa so much?",
            "opts": [
              "She had never tasted cocoa before.",
              "The storm was over and she could relax.",
              "The cocoa was very cold.",
              "She wanted to fix the sheds."
            ],
            "a": 1,
            "why": "She sat outside ‘when the storm finally passed’ and watched the calm sea. After three hard days, she could finally relax. Nothing in the story supports the other answers, and the cocoa was hot.",
            "whyZh": "她是在“暴风雨终于过去后”坐在外面看着平静的大海。辛苦了三天，她终于可以放松了。其他选项在文中找不到依据，而且可可是热的。"
          }
        ]
      },
      {
        "day": 2,
        "theme": "a treasure in the museum",
        "type": "report",
        "title": "The Museum Crown",
        "words": [
          "encase",
          "fragile",
          "gleam"
        ],
        "passage": "The Old Crown is the most famous treasure in the city museum. It is more than 300 years old and very **fragile**, so even a small bump could break its thin gold leaves. To keep it safe, the crown is **encased** in a thick glass box that covers it completely. Visitors cannot touch it, but they can walk all the way around it. Bright lights shine down from above, making the jewels **gleam** like tiny stars. The museum says more than 2000 people come to see the crown every week.",
        "qs": [
          {
            "skill": "vocab",
            "q": "Which word from the report tells you the crown breaks easily?",
            "opts": [
              "famous",
              "thick",
              "bright",
              "fragile"
            ],
            "a": 3,
            "why": "‘Even a small bump could break’ the crown, so it is **fragile** — easily broken. Famous, thick and bright do not mean breaking easily.",
            "whyZh": "“哪怕轻轻一碰也可能碰坏”这顶王冠，所以它是 fragile 的——很容易坏。famous、thick、bright 都没有“容易坏”的意思。"
          },
          {
            "skill": "main-idea",
            "q": "What is this report mostly about?",
            "opts": [
              "how to make a gold crown",
              "a famous crown and how it is protected",
              "why museums need bright lights",
              "the best day to visit the museum"
            ],
            "a": 1,
            "why": "Most sentences are about the Old Crown: how old and fragile it is, how it is kept safe and how people see it. The lights are only one small detail, and the other choices are not in the report.",
            "whyZh": "大部分句子都在讲这顶古老的王冠：它多古老、多易碎，怎样保护它，人们怎样参观它。灯光只是一个小细节，其他选项文中根本没有提到。"
          }
        ]
      },
      {
        "day": 3,
        "theme": "training a wild puppy",
        "type": "narrative",
        "title": "Biscuit Goes to Puppy School",
        "words": [
          "obedient",
          "boisterous",
          "reluctant"
        ],
        "passage": "Biscuit was a **boisterous** puppy. He barked loudly, jumped on visitors and raced around the house, knocking over chairs. So Ben took him to puppy school. On the first day, Biscuit was **reluctant** to go inside. He sat down at the door and would not move until Ben offered him a treat. The teacher showed Ben how to reward good behaviour. After six weeks, Biscuit was much more **obedient**. When Ben said ‘Sit!’, Biscuit sat. When he said ‘Stay!’, Biscuit stayed. Ben was very proud of him.",
        "qs": [
          {
            "skill": "vocab",
            "q": "Which word is the OPPOSITE of **reluctant**?",
            "opts": [
              "eager",
              "unwilling",
              "sleepy",
              "angry"
            ],
            "a": 0,
            "why": "**Reluctant** means not wanting to do something. **Eager** means really wanting to do it, so it is the opposite. ‘Unwilling’ means the same as reluctant.",
            "whyZh": "reluctant 的意思是不愿意做某事。eager 的意思是非常想做，所以它是反义词。unwilling 和 reluctant 意思相同。"
          },
          {
            "skill": "character",
            "q": "Why did Ben take Biscuit to puppy school?",
            "opts": [
              "Biscuit wanted to make friends.",
              "Ben wanted to become a teacher.",
              "Biscuit was wild and hard to control.",
              "Biscuit was too quiet."
            ],
            "a": 2,
            "why": "The story says Biscuit barked, jumped on visitors and knocked over chairs. Then it says ‘So Ben took him to puppy school’ — ‘so’ tells us this was the reason.",
            "whyZh": "故事说 Biscuit 乱叫、扑到客人身上、撞翻椅子。接着说“So Ben took him to puppy school”——so（所以）告诉我们这就是原因。"
          }
        ]
      },
      {
        "day": 4,
        "theme": "a review of a school art show",
        "type": "review",
        "title": "The Art Show",
        "words": [
          "complement",
          "vivid",
          "exquisite"
        ],
        "passage": "Room 9’s art show opened on Friday in the school hall, and it is a must-see. The paintings are full of **vivid** colours: bright reds, deep blues and sunny yellows that seem to jump off the paper. My favourite is Priya’s painting of a tūī. It is **exquisite**: every tiny feather is drawn with great care, so the bird looks almost real. Plain wooden frames **complement** the bold paintings; the simple frames make the colours look even brighter. The show is open until Thursday. I give it five stars!",
        "qs": [
          {
            "skill": "vocab",
            "q": "Which word from the review means ‘very beautiful and carefully made’?",
            "opts": [
              "vivid",
              "plain",
              "bold",
              "exquisite"
            ],
            "a": 3,
            "why": "Priya’s painting is exquisite: every feather is drawn with great care, so the bird looks almost real. **Exquisite** means very beautiful and carefully made. Vivid and bold describe strong colours; plain means simple.",
            "whyZh": "Priya 的画很 exquisite：每一根羽毛都画得非常用心，这只鸟看起来几乎和真的一样。exquisite 的意思是非常精美、做得很用心。vivid 和 bold 形容颜色鲜艳；plain 的意思是朴素。"
          },
          {
            "skill": "fact-opinion",
            "q": "Which sentence from the review is a FACT, not an opinion?",
            "opts": [
              "It is a must-see.",
              "The show is open until Thursday.",
              "My favourite is Priya’s painting.",
              "I give it five stars!"
            ],
            "a": 1,
            "why": "A fact can be checked and is true for everyone: you can check when the show is open. ‘Must-see’, ‘my favourite’ and ‘five stars’ are the writer’s opinions.",
            "whyZh": "事实是可以核实、对每个人都成立的：展览开放到星期四，这可以查证。“必看”“我最喜欢的”“五颗星”都是作者的观点。"
          }
        ]
      },
      {
        "day": 5,
        "theme": "climbing a mountain",
        "type": "narrative",
        "title": "The Long Climb",
        "words": [
          "trudge",
          "summit",
          "weary"
        ],
        "passage": "At six o’clock, Tama and his dad began to climb the mountain. At first the track was easy, but soon it became steep and rocky. Their legs grew heavy, and they **trudged** slowly up the path, one tired step at a time. By midday they were hot and **weary**, and Tama wanted to give up. ‘Just a little further,’ said Dad. At last they reached the **summit**, the very top of the mountain. Far below, the whole valley lay spread out like a map. Tama forgot how tired he was.",
        "qs": [
          {
            "skill": "vocab",
            "q": "Which word is the OPPOSITE of **weary**?",
            "opts": [
              "lively",
              "tired",
              "sleepy",
              "slow"
            ],
            "a": 0,
            "why": "**Weary** means very tired. **Lively** means full of energy, so it is the opposite. ‘Tired’ and ‘sleepy’ mean nearly the same as weary.",
            "whyZh": "weary 的意思是非常累。lively 的意思是精力充沛，所以是反义词。tired 和 sleepy 和 weary 意思差不多。"
          },
          {
            "skill": "sequence",
            "q": "What happened just BEFORE Tama and his dad reached the summit?",
            "opts": [
              "They looked down at the valley.",
              "Dad said, ‘Just a little further.’",
              "Tama forgot how tired he was.",
              "They started climbing at six o’clock."
            ],
            "a": 1,
            "why": "Put the events in order: they started at six, the track got steep, they grew weary, Dad said ‘Just a little further’ and THEN they reached the summit. The valley view came after.",
            "whyZh": "按顺序排列：六点出发，山路变陡，他们累了，爸爸说“再走一点点”，然后才到达山顶。看山谷的景色是在到达之后。"
          }
        ]
      },
      {
        "day": 6,
        "theme": "a night walk in the bush",
        "type": "narrative",
        "title": "Into the Bush at Night",
        "words": [
          "murky",
          "cautious",
          "tremble"
        ],
        "passage": "The bush was very dark when Hana and Sione went looking for glow-worms with their uncle. They had to cross a stream, but the water was **murky**, so they could not see the bottom. Sione was **cautious**. He tested every rock with his foot before he stepped on it. Suddenly something rustled in the ferns. Hana’s hands began to **tremble**, and the torchlight shook on the path. Then a little bird hopped out. They laughed and kept walking. Soon they saw hundreds of tiny blue lights glowing on the bank.",
        "qs": [
          {
            "skill": "vocab",
            "q": "Which word could replace **murky** in the story?",
            "opts": [
              "muddy",
              "sparkling",
              "shallow",
              "frozen"
            ],
            "a": 0,
            "why": "They ‘could not see the bottom’, so the water was dark and dirty. **Muddy** is closest. In sparkling or shallow water they could have seen the bottom.",
            "whyZh": "他们“看不到水底”，说明水又暗又脏。muddy（浑浊的）最接近。清澈闪亮或很浅的水都能看到底。"
          },
          {
            "skill": "evidence",
            "q": "Which words show that Hana felt scared?",
            "opts": [
              "‘The bush was very dark’",
              "‘Hana’s hands began to tremble’",
              "‘They laughed and kept walking’",
              "‘Sione was cautious’"
            ],
            "a": 1,
            "why": "Our bodies shake when we are frightened, so her trembling hands are the evidence. The dark bush is the setting, not a feeling, and they laughed after the fright was over.",
            "whyZh": "人害怕的时候身体会发抖，所以她发抖的手就是证据。黑漆漆的丛林是环境描写，不是感受；大笑是在惊吓过去之后。"
          }
        ]
      },
      {
        "day": 7,
        "theme": "bargaining at the market",
        "type": "narrative",
        "title": "Market Day",
        "words": [
          "bustling",
          "haggle",
          "lavish"
        ],
        "passage": "On Saturday the market by the harbour was **bustling**. Crowds of people hurried between the stalls, and sellers shouted out their prices. Mia had saved $30 for her mum’s birthday. She found a woven basket for $30, but she also wanted flowers. So she **haggled** with the seller. ‘Would you take $18?’ she asked. ‘How about $25?’ he replied. In the end they agreed on $22. Because she saved $8, Mia could buy two big bunches of daisies too. That night Mum smiled at her **lavish** present: a basket piled high with flowers.",
        "qs": [
          {
            "skill": "vocab",
            "q": "Which word from the story describes a place full of busy people?",
            "opts": [
              "woven",
              "lavish",
              "saved",
              "bustling"
            ],
            "a": 3,
            "why": "Crowds hurried between the stalls and sellers shouted — the market was full of busy, noisy activity. That is **bustling**.",
            "whyZh": "人群在摊位之间匆匆走动，摊主大声叫卖——市场里人来人往、非常热闹。这就是 bustling。"
          },
          {
            "skill": "cause-effect",
            "q": "Why could Mia buy daisies as well as the basket?",
            "opts": [
              "The daisies were free.",
              "Mum gave her more money.",
              "The seller gave her daisies.",
              "She haggled and saved $8."
            ],
            "a": 3,
            "why": "The story says, ‘Because she saved $8, Mia could buy two big bunches of daisies too.’ She saved the $8 by haggling the price down from $30 to $22.",
            "whyZh": "文中说“因为她省下了 8 元，Mia 还能买两大束雏菊”。这 8 元是她把价格从 30 元讲到 22 元省下来的。"
          }
        ]
      },
      {
        "day": 8,
        "theme": "searching for a lost kitten",
        "type": "narrative",
        "title": "Where Is Pepper?",
        "words": [
          "frantic",
          "rummage",
          "relieved"
        ],
        "passage": "When Leo got home from school, his kitten, Pepper, was missing. He searched the whole house, calling her name again and again. By dinner time Leo was **frantic**. He ran from room to room, close to tears and unable to sit still. Then he **rummaged** through the laundry basket, pulling out socks, towels and shirts and throwing them on the floor. At the very bottom, curled up asleep, was Pepper! Leo was so **relieved** that he hugged her and laughed. All his worry had melted away.",
        "qs": [
          {
            "skill": "vocab",
            "q": "Which word from the story means ‘searched by moving things around’?",
            "opts": [
              "calling",
              "curled",
              "hugged",
              "rummaged"
            ],
            "a": 3,
            "why": "Leo pulled out socks, towels and shirts and threw them on the floor while looking for Pepper. Searching by moving things around is **rummaging**.",
            "whyZh": "Leo 为了找 Pepper，把袜子、毛巾、衬衫都拽出来扔在地上。这种翻来翻去地找东西就是 rummage。"
          },
          {
            "skill": "summary",
            "q": "Which is the best summary of the story?",
            "opts": [
              "Leo threw clothes all over the floor.",
              "Kittens love sleeping in laundry baskets.",
              "Leo came home from school one day.",
              "Leo searched for his kitten and found her."
            ],
            "a": 3,
            "why": "A summary tells the WHOLE story in a few words: the kitten was missing, Leo searched and he found her. The other choices are only small parts, or not in the story.",
            "whyZh": "概括要用几句话讲清楚整个故事：小猫不见了，Leo 到处找，最后找到了。其他选项只是故事的一小部分，或者故事里没有。"
          }
        ]
      },
      {
        "day": 9,
        "theme": "an old farm building",
        "type": "narrative",
        "title": "The Old Woolshed",
        "words": [
          "sprawling",
          "crumble",
          "abandoned"
        ],
        "passage": "Behind Grandad’s farmhouse is a **sprawling** paddock that stretches all the way to the hills. In the far corner stands an **abandoned** woolshed. Nobody has used it for forty years, since the farmers built a new shed closer to the house. Now the roof leaks, spiders spin webs in every window and the old concrete steps **crumble** into dust when you stand on them. Grandad says it is too dangerous to go inside, but Sione loves to sketch it from the gate.",
        "qs": [
          {
            "skill": "vocab",
            "q": "Which word could replace **abandoned** in the story?",
            "opts": [
              "deserted",
              "busy",
              "shiny",
              "modern"
            ],
            "a": 0,
            "why": "Nobody has used the woolshed for forty years. It has been left empty, so it is **deserted** — another word for abandoned.",
            "whyZh": "四十年没人用过这个剪毛棚了，它一直空着，所以是 deserted（荒废的）——abandoned 的另一种说法。"
          },
          {
            "skill": "inference",
            "q": "Why does Grandad most likely say it is too dangerous to go inside?",
            "opts": [
              "Wild sheep live inside it.",
              "It is too far from the house.",
              "The old building could fall apart.",
              "Sione might lose his sketchbook."
            ],
            "a": 2,
            "why": "The story doesn’t say why, but it gives clues: the roof leaks and the steps crumble. A building in that condition could break and hurt someone.",
            "whyZh": "文章没有直接说原因，但给了线索：屋顶漏水，台阶一踩就碎。这样的房子可能会坍塌伤人。"
          }
        ]
      },
      {
        "day": 10,
        "theme": "solving a problem at the science fair",
        "type": "narrative",
        "title": "The Science Fair",
        "words": [
          "ponder",
          "ingenious",
          "persist"
        ],
        "passage": "Priya wanted to build a boat that could carry ten marbles without sinking. Her first boat, made of paper, sank straight away. Her second one tipped over. Priya sat at the table and **pondered** the problem for a long time, thinking hard about what was going wrong. Then she had an **ingenious** idea: she would make the boat wide and flat, like a raft, out of foil. It still leaked at first, but she **persisted**, fixing each hole with tape. At the science fair, her boat held fifteen marbles and won first prize.",
        "qs": [
          {
            "skill": "vocab",
            "q": "Which word from the story means ‘thought carefully’?",
            "opts": [
              "leaked",
              "pondered",
              "tipped",
              "won"
            ],
            "a": 1,
            "why": "Priya sat ‘thinking hard about what was going wrong’. **Pondered** means thought about something carefully for a long time.",
            "whyZh": "Priya 坐着“认真思考到底哪里出了问题”。pondered 的意思是长时间仔细地思考。"
          },
          {
            "skill": "character",
            "q": "Which word best describes Priya?",
            "opts": [
              "determined",
              "lazy",
              "rude",
              "forgetful"
            ],
            "a": 0,
            "why": "Her boats sank and tipped over, but she kept thinking and kept fixing until it worked. Someone who doesn’t give up is determined.",
            "whyZh": "她的船沉了、翻了，但她一直思考、一直修补，直到成功。不放弃的人就是 determined（有决心的）。"
          }
        ]
      },
      {
        "day": 11,
        "theme": "farms after a drought",
        "type": "report",
        "title": "After the Drought",
        "words": [
          "parched",
          "dwindle",
          "flourish"
        ],
        "passage": "Last summer, hardly any rain fell on the farms near Taupō for three months. The land became **parched**: the grass turned brown, the soil cracked and the creeks dried up. Water in the farm tanks **dwindled** until only a few centimetres were left, so farmers had to buy water for their animals. Then, in autumn, heavy rain finally arrived and soaked the ground. By spring, the paddocks were green again. Plants began to **flourish**, growing thick and strong, and the creeks filled with water once more.",
        "qs": [
          {
            "skill": "vocab",
            "q": "Which word is the OPPOSITE of **flourish**?",
            "opts": [
              "grow",
              "thrive",
              "wither",
              "bloom"
            ],
            "a": 2,
            "why": "**Flourish** means to grow strongly and well. **Wither** means to dry up and die, so it is the opposite. Grow, thrive and bloom are all close to flourish.",
            "whyZh": "flourish 的意思是茁壮成长。wither 的意思是枯萎、死掉，所以是反义词。grow、thrive、bloom 都和 flourish 意思相近。"
          },
          {
            "skill": "compare",
            "q": "How was the land in spring different from the land in summer?",
            "opts": [
              "It was green instead of brown.",
              "It was even drier.",
              "It had less water.",
              "It looked exactly the same."
            ],
            "a": 0,
            "why": "In summer the grass turned brown and the creeks dried up. By spring the paddocks were green and the creeks were full again.",
            "whyZh": "夏天草变黄了，小溪干了。到了春天，牧场又绿了，小溪又满了。"
          }
        ]
      },
      {
        "day": 12,
        "theme": "a calm morning in Grandma’s garden",
        "type": "poem",
        "title": "Grandma’s Garden",
        "words": [
          "tranquil",
          "linger",
          "cherish"
        ],
        "passage": "At dawn, Grandma’s garden is **tranquil** and still,\nNo traffic, no shouting, just birds on the hill.\nThe bees hum softly from flower to flower,\nAnd nobody hurries for hour after hour.\n\nI **linger** beside the old lemon tree,\nIn no hurry to leave, as slow as can be,\nWhile Grandma tells stories of seeds that she grew\nWhen she was a girl and the garden was new.\n\nI **cherish** these mornings like treasure or gold,\nA gift I will keep, even when I am old.",
        "qs": [
          {
            "skill": "vocab",
            "q": "Which word is the OPPOSITE of **tranquil**?",
            "opts": [
              "noisy",
              "peaceful",
              "calm",
              "still"
            ],
            "a": 0,
            "why": "**Tranquil** means calm and peaceful — the poem says there is ‘no traffic, no shouting’. **Noisy** is the opposite; peaceful, calm and still are similar.",
            "whyZh": "tranquil 的意思是平静、安宁——诗里说“没有车流，没有喊叫声”。noisy（吵闹的）是反义词；peaceful、calm、still 都是近义词。"
          },
          {
            "skill": "purpose",
            "q": "What is the poet’s main purpose?",
            "opts": [
              "to share a special, happy feeling",
              "to teach how to grow lemons",
              "to persuade people to buy roses",
              "to report facts about bees"
            ],
            "a": 0,
            "why": "Poems like this share feelings and memories. The poet tells us how calm the garden is and how much they cherish these mornings. It does not teach, sell or report.",
            "whyZh": "这类诗是用来分享感受和回忆的。诗人告诉我们花园多么安静，自己多么珍惜这些早晨。它不是教人做事、推销东西或报道事实。"
          }
        ]
      },
      {
        "day": 13,
        "theme": "winning and losing a netball final",
        "type": "narrative",
        "title": "The Big Final",
        "words": [
          "jubilant",
          "triumph",
          "dejected"
        ],
        "passage": "The netball final was tied 20–20 with ten seconds left. Then Aroha caught the ball and scored! The Kererū team had won. Aroha’s teammates were **jubilant**. They screamed, hugged and danced around the court. It was their first **triumph** in five years, and the coach held the silver cup high. On the other side of the court, the Tūī players looked **dejected**. They sat with their heads down, and some of them wiped away tears. Aroha walked over and told them, ‘You played really well.’",
        "qs": [
          {
            "skill": "vocab",
            "q": "Which word is the OPPOSITE of **jubilant**?",
            "opts": [
              "dejected",
              "joyful",
              "excited",
              "proud"
            ],
            "a": 0,
            "why": "**Jubilant** means extremely happy. **Dejected** means sad and disappointed — the opposite. The writer uses both words to compare the two teams.",
            "whyZh": "jubilant 的意思是非常高兴。dejected 的意思是沮丧、失望——正好相反。作者用这两个词来对比两支队伍。"
          },
          {
            "skill": "compare",
            "q": "How were the two teams different at the end?",
            "opts": [
              "The Kererū were thrilled; the Tūī were sad.",
              "Both teams were very happy.",
              "Both teams were very sad.",
              "The Tūī were thrilled; the Kererū were sad."
            ],
            "a": 0,
            "why": "The Kererū team screamed, hugged and danced (jubilant), while the Tūī sat with their heads down wiping away tears (dejected). The writer puts opposite feelings side by side.",
            "whyZh": "Kererū 队尖叫、拥抱、跳舞（jubilant 欢欣鼓舞），而 Tūī 队低着头坐着擦眼泪（dejected 垂头丧气）。作者把两种相反的心情放在一起对比。"
          }
        ]
      },
      {
        "day": 14,
        "theme": "a secret note and a treasure hunt",
        "type": "narrative",
        "title": "The Mystery Note",
        "words": [
          "peculiar",
          "conceal",
          "reveal"
        ],
        "passage": "On Monday, Ben found a **peculiar** note in his desk. It was strange: the words were written backwards, and there was no name at the bottom. Ben held it up to a mirror to read it. ‘Look under the third step,’ it said. At lunchtime, Ben and Priya searched the steps. A small box was **concealed** behind a loose board, where nobody could see it. Inside were a key and a second note. When they read it, the note **revealed** the secret at last: it was a treasure hunt for Ben’s birthday!",
        "qs": [
          {
            "skill": "vocab",
            "q": "Which word is the OPPOSITE of **concealed**?",
            "opts": [
              "hidden",
              "covered",
              "buried",
              "revealed"
            ],
            "a": 3,
            "why": "**Concealed** means hidden. **Revealed** means shown or made known — the opposite. Hidden, covered and buried are all close to concealed.",
            "whyZh": "concealed 的意思是被藏起来的。revealed 的意思是显露、揭示——正好相反。hidden、covered、buried 都和 concealed 意思相近。"
          },
          {
            "skill": "inference",
            "q": "Who most likely wrote the notes?",
            "opts": [
              "Ben himself",
              "a robber hiding stolen keys",
              "the principal giving homework",
              "someone planning a birthday surprise for Ben"
            ],
            "a": 3,
            "why": "The second note revealed it was a treasure hunt for Ben’s birthday, so the writer was planning a surprise for him. Ben did not write it — he was the one solving it.",
            "whyZh": "第二张纸条揭示这是为 Ben 生日准备的寻宝游戏，所以写纸条的人是在为他准备惊喜。不会是 Ben 自己写的——他是解谜的人。"
          }
        ]
      },
      {
        "day": 15,
        "theme": "snorkelling in a marine reserve",
        "type": "narrative",
        "title": "Under the Sea",
        "words": [
          "glimpse",
          "dart",
          "vast"
        ],
        "passage": "Hana pulled on her mask and snorkel and slid into the sea at Goat Island, with Mum swimming beside her. Below them, the ocean seemed **vast**, stretching out in every direction further than she could see. Little fish **darted** past her, moving so fast that she could hardly follow them. Then, near a rock, she caught a **glimpse** of something blue. She saw it for only a second before it swam away. Was it a fish or a stingray? Hana tapped Mum’s arm and pointed, and they floated quietly, waiting for it to come back.",
        "qs": [
          {
            "skill": "vocab",
            "q": "Which word from the story means ‘moved suddenly and quickly’?",
            "opts": [
              "pulled",
              "darted",
              "caught",
              "seemed"
            ],
            "a": 1,
            "why": "The fish were ‘moving so fast that she could hardly follow them’. **Darted** means moved suddenly and quickly.",
            "whyZh": "小鱼“游得太快，她几乎跟不上”。darted 的意思是突然快速地移动。"
          },
          {
            "skill": "sequence",
            "q": "Which of these happened FIRST?",
            "opts": [
              "Little fish darted past her.",
              "She caught a glimpse of something blue.",
              "She slid into the sea.",
              "She tapped Mum’s arm and pointed."
            ],
            "a": 2,
            "why": "The story starts when Hana pulls on her mask and slides into the sea. The fish, the glimpse of blue and tapping Mum’s arm all come after.",
            "whyZh": "故事一开始 Hana 戴上面罩滑进海里。小鱼游过、瞥见蓝色的东西、拍妈妈的胳膊，这些都是后来发生的。"
          }
        ]
      },
      {
        "day": 16,
        "theme": "a rainy camping trip",
        "type": "diary",
        "title": "Camping in the Rain",
        "words": [
          "dismal",
          "drenched",
          "endure"
        ],
        "passage": "Dear Diary,\nToday was the most **dismal** day of our camping trip. Dark clouds hid the sun, and it rained without stopping. Our tent leaked, and by lunchtime we were completely **drenched** — even our socks were dripping wet. Dad said we just had to **endure** it until the storm passed, so we played cards and sang songs to stay cheerful. In the evening the rain finally stopped, and a rainbow appeared over the lake. Maybe this trip isn’t so bad after all!\nTama",
        "qs": [
          {
            "skill": "vocab",
            "q": "Which word from the diary means ‘soaking wet’?",
            "opts": [
              "dismal",
              "cheerful",
              "drenched",
              "leaked"
            ],
            "a": 2,
            "why": "They were ‘completely drenched — even our socks were dripping wet’. **Drenched** means soaking wet all over.",
            "whyZh": "他们“全身湿透——连袜子都在滴水”。drenched 的意思是浑身湿透。"
          },
          {
            "skill": "character",
            "q": "How did Tama’s feelings change during the day?",
            "opts": [
              "from happy to angry",
              "from scared to bored",
              "from fed up to more hopeful",
              "they did not change"
            ],
            "a": 2,
            "why": "At first he calls it the most dismal day, but at the end he sees a rainbow and writes, ‘Maybe this trip isn’t so bad after all!’ His mood got better.",
            "whyZh": "一开始他说这是最糟糕的一天，可最后他看到彩虹，写道“也许这次旅行也没那么糟”。他的心情变好了。"
          }
        ]
      },
      {
        "day": 17,
        "theme": "helping a new classmate",
        "type": "letter",
        "title": "The New Kid",
        "words": [
          "timid",
          "hesitate",
          "beam"
        ],
        "passage": "Hi Nana,\nGuess what? A new girl called Mei started at our school today. She was very **timid** at first. She hid behind her bag and spoke so quietly that we could hardly hear her. At lunch she **hesitated** at the door of the library, unsure whether to come in. So I waved and asked her to sit with us. When we showed her how to play our card game, she **beamed** — a huge smile spread across her face. I think we are going to be good friends!\nLove, Hana",
        "qs": [
          {
            "skill": "vocab",
            "q": "Which word is the OPPOSITE of **timid**?",
            "opts": [
              "shy",
              "quiet",
              "nervous",
              "bold"
            ],
            "a": 3,
            "why": "**Timid** means shy and easily scared. **Bold** means brave and confident — the opposite. Shy, quiet and nervous are close to timid.",
            "whyZh": "timid 的意思是胆小、害羞。bold 的意思是大胆、自信——正好相反。shy、quiet、nervous 都和 timid 意思相近。"
          },
          {
            "skill": "purpose",
            "q": "Why did Hana write this letter to Nana?",
            "opts": [
              "to ask Nana for money",
              "to share news about a new friend",
              "to explain how to play cards",
              "to complain about the library"
            ],
            "a": 1,
            "why": "Hana tells Nana about Mei and how she helped her, then says, ‘I think we are going to be good friends!’ She is sharing her news.",
            "whyZh": "Hana 跟奶奶讲了 Mei 的事、自己怎样帮她，还说“我想我们会成为好朋友！”她是在分享自己的新消息。"
          }
        ]
      },
      {
        "day": 18,
        "theme": "a sleeping volcano",
        "type": "report",
        "title": "The Sleeping Volcano",
        "words": [
          "dormant",
          "erupt",
          "devastate"
        ],
        "passage": "Kahu Island is a volcano off the coast. It last **erupted** about 600 years ago, throwing out hot lava and ash that built the island we see today. Since then, Kahu has been **dormant**. It is sleeping, not active, but it could wake up again one day. Scientists check the volcano every week, because if it woke up, it could **devastate** the towns nearby, destroying homes, roads and farms. Today, visitors take a ferry to the island and climb to the top. In my opinion, it has the best view in the country.",
        "qs": [
          {
            "skill": "vocab",
            "q": "Which word is the OPPOSITE of **dormant**?",
            "opts": [
              "sleeping",
              "active",
              "quiet",
              "resting"
            ],
            "a": 1,
            "why": "**Dormant** means sleeping, or not active for a while. The report itself says Kahu is ‘not active’, so **active** is the opposite.",
            "whyZh": "dormant 的意思是处于休眠、暂时不活动的状态。文章自己就说 Kahu “不活跃”，所以 active（活跃的）是反义词。"
          },
          {
            "skill": "fact-opinion",
            "q": "Which sentence is an OPINION?",
            "opts": [
              "Kahu Island is a volcano off the coast.",
              "It last erupted about 600 years ago.",
              "It has the best view in the country.",
              "Scientists check the volcano every week."
            ],
            "a": 2,
            "why": "An opinion is what someone thinks or feels, and others may disagree. ‘The best view’ is the writer’s opinion — the report even says ‘In my opinion’. The others are facts that can be checked.",
            "whyZh": "观点是某人的想法或感受，别人可能不同意。“最好的风景”是作者的观点——文中甚至写了“In my opinion（我认为）”。其他几句都是可以核实的事实。"
          }
        ]
      },
      {
        "day": 19,
        "theme": "how animals prepare for winter",
        "type": "report",
        "title": "Ready for Winter",
        "words": [
          "hoard",
          "scarce",
          "nimble"
        ],
        "passage": "In cold countries, winter is a hard time for animals because food becomes **scarce**. Snow covers the ground, so there are very few nuts, seeds and berries to find. Animals get ready in different ways. Squirrels **hoard** food in autumn. Each squirrel hides hundreds of nuts in secret spots so it can eat them later. Squirrels are **nimble**, too. They leap quickly and easily from branch to branch. Bears do something else: they eat a lot in autumn, then sleep in a den for most of the winter.",
        "qs": [
          {
            "skill": "vocab",
            "q": "Which word from the report means ‘moving quickly and easily’?",
            "opts": [
              "scarce",
              "secret",
              "different",
              "nimble"
            ],
            "a": 3,
            "why": "Squirrels ‘leap quickly and easily from branch to branch’ — they are **nimble**.",
            "whyZh": "松鼠“在树枝间轻快地跳来跳去”——它们很 nimble（敏捷）。"
          },
          {
            "skill": "compare",
            "q": "How do squirrels and bears get ready for winter differently?",
            "opts": [
              "Both animals store nuts.",
              "Both animals sleep all winter.",
              "Squirrels store food; bears eat lots, then sleep.",
              "Bears store food; squirrels sleep."
            ],
            "a": 2,
            "why": "The report says squirrels hide hundreds of nuts to eat later, while bears eat a lot in autumn and then sleep in a den for most of the winter.",
            "whyZh": "文章说松鼠藏起几百颗坚果留着以后吃，而熊在秋天大量进食，然后在洞里睡过大半个冬天。"
          }
        ]
      },
      {
        "day": 20,
        "theme": "a spooky house with a surprise",
        "type": "narrative",
        "title": "The House on the Hill",
        "words": [
          "ominous",
          "creak",
          "bewildered"
        ],
        "passage": "The old house on the hill looked **ominous** in the storm. Black clouds gathered above it, and its dark windows stared down like eyes, as if something bad was about to happen. Leo pushed the front door. It **creaked** open with a long, slow squeak. Inside, he heard tapping upstairs, then a thump. Leo stood in the hall, completely **bewildered**. Where was the noise coming from? Then a grey cat strolled down the stairs, carrying a ball of wool. Leo laughed. The mystery was solved.",
        "qs": [
          {
            "skill": "vocab",
            "q": "Which word could replace **bewildered** in the story?",
            "opts": [
              "pleased",
              "confused",
              "sleepy",
              "angry"
            ],
            "a": 1,
            "why": "Leo did not know where the noise was coming from — he was puzzled. **Bewildered** means very confused.",
            "whyZh": "Leo 不知道声音从哪里来——他很困惑。bewildered 的意思是非常困惑、摸不着头脑。"
          },
          {
            "skill": "inference",
            "q": "What was most likely making the noises upstairs?",
            "opts": [
              "a ghost",
              "Leo’s friends",
              "the cat playing with a ball of wool",
              "the storm breaking the roof"
            ],
            "a": 2,
            "why": "The writer doesn’t say it directly, but the cat appears carrying wool and then ‘the mystery was solved’. So the cat was making the tapping and the thump.",
            "whyZh": "作者没有直接说，但猫叼着毛线球出现了，接着“谜团解开了”。所以发出敲击声和砰的一声的是猫。"
          }
        ]
      }
    ],
    "words": {
      "steadfast": {
        "word": "steadfast",
        "form": "steadfast",
        "pos": "adjective",
        "syll": "stead·fast",
        "zh": "坚定的；不动摇的",
        "def": "firm and loyal; not changing or giving up, even when things are hard",
        "defZh": "坚定、忠诚的；即使遇到困难也不改变、不放弃",
        "parts": "stead (place) + fast (held firmly, as in ‘hold fast’ — not ‘quick’) → staying firmly in place",
        "partsZh": "stead（位置）+ fast（牢牢固定，像 hold fast，不是“快”）→ 牢牢守在原位",
        "note": "",
        "noteZh": "",
        "guess": {
          "q": "In the story, **steadfast** most likely means",
          "opts": [
            "moving quickly",
            "shining very brightly",
            "staying firm and not giving up",
            "falling apart"
          ],
          "a": 2,
          "clue": "Look at the word ‘But’. The sheds blew away and the trees bent, but the lighthouse stood steadfast — it did the opposite and stayed firm.",
          "clueZh": "注意转折词 But。小屋被吹走、大树被压弯，但是灯塔 steadfast——它的情况正好相反：它稳稳地站住了。"
        },
        "ex": [
          "Even when the team lost five games in a row, Mia stayed a steadfast supporter.",
          "Sione was steadfast in his promise to visit his grandma every Sunday."
        ],
        "syn": [
          "loyal",
          "firm",
          "determined"
        ],
        "ant": [
          "unreliable",
          "wavering"
        ],
        "dis": [
          "noisy",
          "sleepy",
          "curious"
        ],
        "cloze": {
          "s": "Through every storm, the old dog stayed ___ by the farmer’s side.",
          "opts": [
            "fragile",
            "vivid",
            "murky",
            "steadfast"
          ],
          "a": 3
        }
      },
      "ramshackle": {
        "word": "ramshackle",
        "form": "ramshackle",
        "pos": "adjective",
        "syll": "ram·shack·le",
        "zh": "摇摇欲坠的；破旧不堪的",
        "def": "badly built or very old, and almost falling apart",
        "defZh": "造得很差或非常旧、几乎要散架的",
        "parts": "",
        "partsZh": "",
        "note": "Memory hook: a ramshackle building often looks like a broken-down shack (a rough little hut).",
        "noteZh": "记忆小窍门：ramshackle 的房子常常像一间破旧的小棚屋（shack）。",
        "guess": {
          "q": "In the story, **ramshackle** most likely means",
          "opts": [
            "brand new and shiny",
            "old and falling apart",
            "painted bright colours",
            "very tall and strong"
          ],
          "a": 1,
          "clue": "The story explains the word straight after it: the sheds were ‘already old and falling apart’. Writers often put the meaning right next to a hard word.",
          "clueZh": "故事在这个词后面马上做了解释：这些小屋“已经又旧又快散架了”。作者经常在难词旁边直接给出意思。"
        },
        "ex": [
          "They camped in a ramshackle hut with a leaking roof.",
          "The ramshackle old bridge wobbled when we walked across it."
        ],
        "syn": [
          "run-down",
          "rickety",
          "shabby"
        ],
        "ant": [
          "sturdy",
          "solid"
        ],
        "dis": [
          "hungry",
          "brave",
          "friendly"
        ],
        "cloze": {
          "s": "Nobody had lived in the ___ cottage for years, and its windows were broken.",
          "opts": [
            "ramshackle",
            "jubilant",
            "boisterous",
            "obedient"
          ],
          "a": 0
        }
      },
      "relish": {
        "word": "relish",
        "form": "relished",
        "pos": "verb",
        "syll": "rel·ish",
        "zh": "尽情享受；津津有味地品尝",
        "def": "to enjoy something very much, often slowly so that it lasts",
        "defZh": "非常享受某样东西，常常是慢慢地享受，让它持续得久一点",
        "parts": "",
        "partsZh": "",
        "note": "Relish is also a noun: a tasty sauce (tomato relish). In ‘she relished every sip’ it is a verb.",
        "noteZh": "relish 也可以是名词，指一种调味酱（例如 tomato relish）。在 she relished every sip 里，它是动词。",
        "guess": {
          "q": "In the story, **relished** most likely means",
          "opts": [
            "spilled quickly",
            "threw away",
            "felt sick about",
            "enjoyed very much"
          ],
          "a": 3,
          "clue": "The words after it explain it: she was ‘enjoying it slowly’. Someone who enjoys every single sip is relishing it.",
          "clueZh": "后面的词解释了它：她“慢慢地享受着”。一口一口地品尝、享受每一口，就是 relish。"
        },
        "ex": [
          "Leo relished the last slice of birthday cake.",
          "Priya relished the quiet morning before her brothers woke up."
        ],
        "syn": [
          "enjoy",
          "savour",
          "love"
        ],
        "ant": [
          "dislike",
          "hate"
        ],
        "dis": [
          "borrow",
          "whisper",
          "climb"
        ],
        "cloze": {
          "s": "The hungry campers ___ every bite of the hot sausages.",
          "opts": [
            "trudged",
            "relished",
            "haggled",
            "rummaged"
          ],
          "a": 1
        }
      },
      "encase": {
        "word": "encase",
        "form": "encased",
        "pos": "verb",
        "syll": "en·case",
        "zh": "把……装进（盒子或外壳）里；包住",
        "def": "to cover or surround something completely, usually to protect it",
        "defZh": "把某物完全包住或围起来，通常是为了保护它",
        "parts": "en- (put into) + case (a box or cover) → put inside a case",
        "partsZh": "en-（放进……里）+ case（盒子、外壳）→ 放进盒子里",
        "note": "",
        "noteZh": "",
        "guess": {
          "q": "In the report, **encased** most likely means",
          "opts": [
            "completely covered or closed in",
            "painted with gold",
            "taken out of the museum",
            "cleaned every day"
          ],
          "a": 0,
          "clue": "The same sentence explains it: the glass box ‘covers it completely’. You can also split the word: en + case = put into a case.",
          "clueZh": "同一句话就解释了它：玻璃盒子“把它完全罩住”。也可以把词拆开：en + case = 放进盒子里。"
        },
        "ex": [
          "The tiny seeds are encased in a hard shell.",
          "In winter, the pond was encased in a thin layer of ice."
        ],
        "syn": [
          "enclose",
          "cover",
          "wrap"
        ],
        "ant": [
          "uncover",
          "expose"
        ],
        "dis": [
          "sing",
          "jump",
          "borrow"
        ],
        "cloze": {
          "s": "To keep the old letter safe, the museum ___ it in clear plastic.",
          "opts": [
            "pondered",
            "trudged",
            "haggled",
            "encased"
          ],
          "a": 3
        }
      },
      "fragile": {
        "word": "fragile",
        "form": "fragile",
        "pos": "adjective",
        "syll": "frag·ile",
        "zh": "易碎的；脆弱的",
        "def": "easily broken, damaged or hurt",
        "defZh": "容易破碎、损坏或受伤的",
        "parts": "From the Latin word for ‘break’ — like fragment, a broken piece.",
        "partsZh": "来自拉丁语的“打破”——和 fragment（碎片）同源。",
        "note": "Boxes that must be carried carefully often have FRAGILE written on them.",
        "noteZh": "需要小心搬运的箱子上常写着 FRAGILE（易碎）。",
        "guess": {
          "q": "In the report, **fragile** most likely means",
          "opts": [
            "very heavy",
            "easily broken or hurt",
            "worth a lot of money",
            "shiny and new"
          ],
          "a": 1,
          "clue": "Look at the cause and effect: it is so fragile that ‘even a small bump could break’ it. Something that breaks easily is fragile.",
          "clueZh": "看因果关系：它太 fragile 了，所以“哪怕轻轻一碰也可能碰坏”。容易坏的东西就是 fragile。"
        },
        "ex": [
          "Be careful with that glass bird — it is very fragile.",
          "Baby birds are fragile, so we must not touch the nest."
        ],
        "syn": [
          "delicate",
          "breakable",
          "flimsy"
        ],
        "ant": [
          "sturdy",
          "strong"
        ],
        "dis": [
          "cheerful",
          "hungry",
          "late"
        ],
        "cloze": {
          "s": "Wrap the ___ teacups in paper so they do not break.",
          "opts": [
            "boisterous",
            "weary",
            "fragile",
            "frantic"
          ],
          "a": 2
        }
      },
      "gleam": {
        "word": "gleam",
        "form": "gleam",
        "pos": "verb",
        "syll": "gleam",
        "zh": "闪闪发光；闪耀",
        "def": "to shine brightly, often by reflecting light",
        "defZh": "明亮地发光，常常是反射出来的光",
        "parts": "",
        "partsZh": "",
        "note": "Gleam can be a noun too: ‘a gleam of light’.",
        "noteZh": "gleam 也可以作名词：a gleam of light（一道微光）。",
        "guess": {
          "q": "In the report, **gleam** most likely means",
          "opts": [
            "fall down",
            "get dusty",
            "change colour",
            "shine brightly"
          ],
          "a": 3,
          "clue": "The lights ‘shine down’ and make the jewels look ‘like tiny stars’. Stars shine, so the jewels gleam — they shine brightly.",
          "clueZh": "灯光“照下来”，让宝石看起来“像小星星一样”。星星会发光，所以宝石在 gleam——闪闪发光。"
        },
        "ex": [
          "The new bike gleamed in the sunshine.",
          "Her eyes gleamed with excitement when she opened the present."
        ],
        "syn": [
          "shine",
          "sparkle",
          "glow"
        ],
        "ant": [],
        "dis": [
          "argue",
          "borrow",
          "swim"
        ],
        "cloze": {
          "s": "After Tama polished the car, its paint began to ___ in the sun.",
          "opts": [
            "haggle",
            "gleam",
            "linger",
            "hoard"
          ],
          "a": 1
        }
      },
      "obedient": {
        "word": "obedient",
        "form": "obedient",
        "pos": "adjective",
        "syll": "o·be·di·ent",
        "zh": "听话的；顺从的",
        "def": "willing to do what you are told to do",
        "defZh": "愿意按照别人说的去做的；听话的",
        "parts": "obey + -ent → obeying; doing what you are told",
        "partsZh": "obey（服从）+ -ent → 服从的；听从吩咐的",
        "note": "Add -ly to make the adverb: Biscuit sat obediently (in an obedient way). The opposite is disobedient.",
        "noteZh": "加 -ly 变成副词：Biscuit sat obediently（听话地坐下）。反义词是 disobedient（不听话的）。",
        "guess": {
          "q": "In the story, **obedient** most likely means",
          "opts": [
            "loud and wild",
            "very sleepy",
            "scared of people",
            "doing what you are told"
          ],
          "a": 3,
          "clue": "The examples after it show the meaning: when Ben said ‘Sit!’, Biscuit sat; when he said ‘Stay!’, Biscuit stayed.",
          "clueZh": "后面的例子说明了意思：Ben 说“坐下！”，Biscuit 就坐下；Ben 说“别动！”，它就不动。"
        },
        "ex": [
          "The obedient sheepdog brought the sheep back as soon as the farmer whistled.",
          "Mia’s little brother was obedient and went to bed when he was asked."
        ],
        "syn": [
          "well-behaved",
          "dutiful"
        ],
        "ant": [
          "disobedient",
          "naughty"
        ],
        "dis": [
          "thirsty",
          "shiny",
          "distant"
        ],
        "cloze": {
          "s": "The ___ dog sat still and waited until it was told to eat.",
          "opts": [
            "obedient",
            "ramshackle",
            "parched",
            "murky"
          ],
          "a": 0
        }
      },
      "boisterous": {
        "word": "boisterous",
        "form": "boisterous",
        "pos": "adjective",
        "syll": "bois·ter·ous",
        "zh": "吵闹又好动的；精力旺盛的",
        "def": "noisy, lively and full of energy, sometimes a bit too rough",
        "defZh": "吵闹、活泼、精力旺盛的，有时有点太闹了",
        "parts": "",
        "partsZh": "",
        "note": "",
        "noteZh": "",
        "guess": {
          "q": "In the story, **boisterous** most likely means",
          "opts": [
            "sleepy and slow",
            "small and cute",
            "shy and quiet",
            "noisy and full of energy"
          ],
          "a": 3,
          "clue": "The next sentence gives examples: he barked loudly, jumped on visitors and raced around knocking over chairs. That is how a boisterous puppy behaves.",
          "clueZh": "下一句举了例子：它大声叫、扑到客人身上、到处乱跑撞翻椅子。这就是吵闹好动（boisterous）的小狗的样子。"
        },
        "ex": [
          "The boisterous crowd cheered and stamped their feet.",
          "Our classroom gets boisterous just before the holidays."
        ],
        "syn": [
          "rowdy",
          "noisy",
          "lively"
        ],
        "ant": [
          "calm",
          "quiet"
        ],
        "dis": [
          "wooden",
          "expensive",
          "square"
        ],
        "cloze": {
          "s": "The ___ children shouted and chased each other around the playground.",
          "opts": [
            "boisterous",
            "fragile",
            "dormant",
            "tranquil"
          ],
          "a": 0
        }
      },
      "reluctant": {
        "word": "reluctant",
        "form": "reluctant",
        "pos": "adjective",
        "syll": "re·luc·tant",
        "zh": "不情愿的；勉强的",
        "def": "not wanting to do something, so you are slow to do it",
        "defZh": "不想做某件事，所以做得很慢、很勉强",
        "parts": "",
        "partsZh": "",
        "note": "The adverb is reluctantly: ‘He reluctantly turned off the TV.’",
        "noteZh": "副词是 reluctantly（不情愿地）：He reluctantly turned off the TV.（他不情愿地关了电视。）",
        "guess": {
          "q": "In the story, **reluctant** most likely means",
          "opts": [
            "happy to do something",
            "very hungry",
            "in a big hurry",
            "not wanting to do something"
          ],
          "a": 3,
          "clue": "Look at what Biscuit did: he sat down at the door and ‘would not move’ until he got a treat. He did not want to go in.",
          "clueZh": "看 Biscuit 的表现：它在门口坐下，“一动不动”，直到拿到零食。它不想进去。"
        },
        "ex": [
          "Hana was reluctant to jump into the cold pool.",
          "The reluctant cat had to be carried to the vet."
        ],
        "syn": [
          "unwilling",
          "hesitant"
        ],
        "ant": [
          "eager",
          "willing"
        ],
        "dis": [
          "purple",
          "heavy",
          "sandy"
        ],
        "cloze": {
          "s": "Sione was ___ to leave the beach because he was having so much fun.",
          "opts": [
            "reluctant",
            "ramshackle",
            "vast",
            "fragile"
          ],
          "a": 0
        }
      },
      "complement": {
        "word": "complement",
        "form": "complement",
        "pos": "verb",
        "syll": "com·ple·ment",
        "zh": "与……相配；使……更好（互补）",
        "def": "to go well with something else and make it look or seem better",
        "defZh": "和另一样东西很相配，让它看起来或显得更好",
        "parts": "Linked to complete: when two things complement each other, together they feel complete.",
        "partsZh": "和 complete（完整）有关：两样东西互相 complement，放在一起就显得完整、更好。",
        "note": "Don’t confuse it with compliment (saying something nice to someone). Trick: complEment and complEte both have E after ‘compl’; complIment has I.",
        "noteZh": "别和 compliment（称赞别人）弄混。记忆窍门：complEment 和 complEte（完整）在 compl 后面都是 e，而 compliment（称赞）是 i。",
        "guess": {
          "q": "In the review, **complement** most likely means",
          "opts": [
            "go well with",
            "break into pieces",
            "hide behind",
            "cost more than"
          ],
          "a": 0,
          "clue": "After the semicolon the writer explains: the simple frames ‘make the colours look even brighter’. Things that make each other look better go well together.",
          "clueZh": "分号后面作者解释了：朴素的画框“让颜色看起来更亮了”。互相衬托、让彼此更好看的东西就是 complement（相配、互补）。"
        },
        "ex": [
          "A glass of cold milk complements a warm chocolate cookie.",
          "The blue cushions complement the grey couch."
        ],
        "syn": [
          "suit",
          "match"
        ],
        "ant": [
          "clash"
        ],
        "dis": [
          "sneeze",
          "climb",
          "whisper"
        ],
        "cloze": {
          "s": "A green scarf would really ___ your red coat.",
          "opts": [
            "persist",
            "dwindle",
            "complement",
            "erupt"
          ],
          "a": 2
        }
      },
      "vivid": {
        "word": "vivid",
        "form": "vivid",
        "pos": "adjective",
        "syll": "viv·id",
        "zh": "鲜艳的；生动的",
        "def": "very bright and strong in colour",
        "defZh": "（颜色）非常鲜艳、强烈的",
        "parts": "From the Latin word for ‘alive’ — vivid colours look full of life.",
        "partsZh": "来自拉丁语的“活的”——vivid 的颜色看起来充满活力。",
        "note": "Vivid can also describe a very clear picture in your mind: ‘a vivid dream’.",
        "noteZh": "vivid 也可以形容脑海里很清楚的画面：a vivid dream（一个很清晰的梦）。",
        "guess": {
          "q": "In the review, **vivid** most likely means",
          "opts": [
            "bright and strong",
            "pale and faded",
            "dark and dull",
            "small and neat"
          ],
          "a": 0,
          "clue": "The writer gives examples after the colon: ‘bright reds, deep blues and sunny yellows that seem to jump off the paper’. Those are vivid colours.",
          "clueZh": "作者在冒号后面举了例子：“鲜红、深蓝、明亮的黄色，好像要从纸上跳出来”。这些就是鲜艳（vivid）的颜色。"
        },
        "ex": [
          "The parrot had vivid green and orange feathers.",
          "The sunset filled the sky with vivid pinks and oranges."
        ],
        "syn": [
          "bright",
          "bold",
          "brilliant"
        ],
        "ant": [
          "dull",
          "pale"
        ],
        "dis": [
          "hungry",
          "lazy",
          "tall"
        ],
        "cloze": {
          "s": "She painted the fire engine a ___ red so everyone would notice it.",
          "opts": [
            "vivid",
            "reluctant",
            "weary",
            "timid"
          ],
          "a": 0
        }
      },
      "exquisite": {
        "word": "exquisite",
        "form": "exquisite",
        "pos": "adjective",
        "syll": "ex·qui·site",
        "zh": "精美的；精致的",
        "def": "very beautiful and delicate, made with great care",
        "defZh": "非常美丽、精致的，做得非常用心的",
        "parts": "",
        "partsZh": "",
        "note": "",
        "noteZh": "",
        "guess": {
          "q": "In the review, **exquisite** most likely means",
          "opts": [
            "rough and quick",
            "strange and scary",
            "old and broken",
            "very fine and beautiful"
          ],
          "a": 3,
          "clue": "After the colon the writer explains: every tiny feather is drawn ‘with great care’, so the bird ‘looks almost real’. Work that fine and beautiful is exquisite.",
          "clueZh": "冒号后面作者解释了：每一根细小的羽毛都画得“非常用心”，所以这只鸟“看起来几乎是真的”。这么精致漂亮的作品就是 exquisite（精美的）。"
        },
        "ex": [
          "Grandma made an exquisite cake decorated with sugar flowers.",
          "The jeweller showed us an exquisite silver necklace."
        ],
        "syn": [
          "beautiful",
          "delicate",
          "fine"
        ],
        "ant": [
          "ugly",
          "rough"
        ],
        "dis": [
          "angry",
          "sleepy",
          "wet"
        ],
        "cloze": {
          "s": "The ___ lace dress had taken months to sew by hand.",
          "opts": [
            "boisterous",
            "parched",
            "ominous",
            "exquisite"
          ],
          "a": 3
        }
      },
      "trudge": {
        "word": "trudge",
        "form": "trudged",
        "pos": "verb",
        "syll": "trudge",
        "zh": "步履沉重地走；艰难地走",
        "def": "to walk slowly with heavy steps, because you are tired or the way is hard",
        "defZh": "因为累了或路很难走，迈着沉重的步子慢慢地走",
        "parts": "",
        "partsZh": "",
        "note": "",
        "noteZh": "",
        "guess": {
          "q": "In the story, **trudged** most likely means",
          "opts": [
            "walked slowly with heavy steps",
            "ran very fast",
            "climbed down quickly",
            "danced happily"
          ],
          "a": 0,
          "clue": "The sentence describes it: their legs were heavy and they went ‘slowly … one tired step at a time’. That is trudging.",
          "clueZh": "这句话描述得很清楚：他们的腿很沉，“慢慢地……一步一步、很累地”往上走。这就是 trudge。"
        },
        "ex": [
          "We trudged home through the mud after the long game.",
          "The children trudged up the hill, carrying their heavy bags."
        ],
        "syn": [
          "plod",
          "tramp"
        ],
        "ant": [
          "skip",
          "dash"
        ],
        "dis": [
          "whisper",
          "count",
          "borrow"
        ],
        "cloze": {
          "s": "Tired after school, Leo ___ up the long driveway with his heavy bag.",
          "opts": [
            "gleamed",
            "trudged",
            "relished",
            "concealed"
          ],
          "a": 1
        }
      },
      "summit": {
        "word": "summit",
        "form": "summit",
        "pos": "noun",
        "syll": "sum·mit",
        "zh": "山顶；顶峰",
        "def": "the highest point, the very top of a mountain or hill",
        "defZh": "山或小山的最高点、最顶端",
        "parts": "",
        "partsZh": "",
        "note": "A summit can also be an important meeting between leaders.",
        "noteZh": "summit 也可以指领导人之间的重要会议（峰会）。",
        "guess": {
          "q": "In the story, **summit** most likely means",
          "opts": [
            "the top of a mountain or hill",
            "the bottom of the valley",
            "a rocky path",
            "a camping hut"
          ],
          "a": 0,
          "clue": "The writer explains it straight after the comma: ‘the very top of the mountain’. This is a definition clue.",
          "clueZh": "作者在逗号后面直接解释了：“山的最顶端”。这叫定义线索（definition clue）。"
        },
        "ex": [
          "From the summit of the hill, we could see the whole town.",
          "We had lunch at the summit before walking back down."
        ],
        "syn": [
          "top",
          "peak"
        ],
        "ant": [
          "bottom",
          "base"
        ],
        "dis": [
          "spoon",
          "blanket",
          "puppy"
        ],
        "cloze": {
          "s": "The climbers planted a flag when they reached the ___.",
          "opts": [
            "glimpse",
            "triumph",
            "hoard",
            "summit"
          ],
          "a": 3
        }
      },
      "weary": {
        "word": "weary",
        "form": "weary",
        "pos": "adjective",
        "syll": "wea·ry",
        "zh": "疲惫的；疲倦的",
        "def": "very tired, especially after working hard for a long time",
        "defZh": "非常疲倦的，尤其是长时间辛苦之后",
        "parts": "",
        "partsZh": "",
        "note": "Don’t mix it up with wary, which means careful and watchful.",
        "noteZh": "别和 wary（小心的、警惕的）弄混。",
        "guess": {
          "q": "In the story, **weary** most likely means",
          "opts": [
            "very cold",
            "very tired",
            "very fast",
            "very proud"
          ],
          "a": 1,
          "clue": "Look for clues around it: their legs ‘grew heavy’, they walked ‘one tired step at a time’ and Tama ‘wanted to give up’. They were very tired.",
          "clueZh": "看周围的线索：他们的腿“越来越沉”，“一步一步很累地”走，Tama“想放弃”。说明他们非常累。"
        },
        "ex": [
          "After the long trip, the weary travellers went straight to bed.",
          "Mum looked weary after working all night at the hospital."
        ],
        "syn": [
          "tired",
          "exhausted",
          "worn out"
        ],
        "ant": [
          "lively",
          "energetic"
        ],
        "dis": [
          "purple",
          "round",
          "honest"
        ],
        "cloze": {
          "s": "After running the cross-country race, Aroha felt ___ and needed a rest.",
          "opts": [
            "vivid",
            "weary",
            "ingenious",
            "ominous"
          ],
          "a": 1
        }
      },
      "murky": {
        "word": "murky",
        "form": "murky",
        "pos": "adjective",
        "syll": "murk·y",
        "zh": "浑浊的；昏暗的",
        "def": "dark and dirty, so it is hard to see through",
        "defZh": "又暗又脏、很难看透的（多指水或空气）",
        "parts": "murk (darkness) + -y → full of darkness",
        "partsZh": "murk（黑暗）+ -y → 充满黑暗的",
        "note": "",
        "noteZh": "",
        "guess": {
          "q": "In the story, **murky** most likely means",
          "opts": [
            "dark and dirty",
            "clear and clean",
            "warm and calm",
            "fast and loud"
          ],
          "a": 0,
          "clue": "Look at the result: the water was murky, ‘so they could not see the bottom’. You cannot see through water that is dark and dirty.",
          "clueZh": "看结果：水很 murky，“所以他们看不到水底”。又暗又脏的水是看不透的。"
        },
        "ex": [
          "After the storm, the river was brown and murky.",
          "The fish hid in the murky water under the jetty."
        ],
        "syn": [
          "muddy",
          "cloudy",
          "gloomy"
        ],
        "ant": [
          "clear",
          "sparkling"
        ],
        "dis": [
          "friendly",
          "hungry",
          "polite"
        ],
        "cloze": {
          "s": "We could not see any fish because the pond water was so ___.",
          "opts": [
            "murky",
            "jubilant",
            "obedient",
            "exquisite"
          ],
          "a": 0
        }
      },
      "cautious": {
        "word": "cautious",
        "form": "cautious",
        "pos": "adjective",
        "syll": "cau·tious",
        "zh": "小心谨慎的",
        "def": "careful to avoid danger or mistakes",
        "defZh": "小心避免危险或错误的；谨慎的",
        "parts": "caution (care, a warning) + -ous → full of care",
        "partsZh": "caution（小心、警告）+ -ous → 充满小心的",
        "note": "Road signs say CAUTION when you need to be careful.",
        "noteZh": "路牌上写 CAUTION 的时候，就是提醒你要小心。",
        "guess": {
          "q": "In the story, **cautious** most likely means",
          "opts": [
            "brave and fast",
            "bored and sleepy",
            "careful to avoid danger",
            "rude and loud"
          ],
          "a": 2,
          "clue": "The next sentence is an example: he tested every rock with his foot before stepping on it. That is what a careful person does.",
          "clueZh": "下一句是例子：他每踩一块石头之前都先用脚试一试。这就是小心谨慎的人会做的事。"
        },
        "ex": [
          "Be cautious when you cross a busy road.",
          "The cautious cat sniffed the new food before eating it."
        ],
        "syn": [
          "careful",
          "wary"
        ],
        "ant": [
          "careless",
          "reckless"
        ],
        "dis": [
          "yellow",
          "famous",
          "noisy"
        ],
        "cloze": {
          "s": "The rocks were slippery, so we were ___ as we climbed down to the beach.",
          "opts": [
            "cautious",
            "jubilant",
            "lavish",
            "vast"
          ],
          "a": 0
        }
      },
      "tremble": {
        "word": "tremble",
        "form": "tremble",
        "pos": "verb",
        "syll": "trem·ble",
        "zh": "发抖；颤抖",
        "def": "to shake slightly, usually because you are scared, cold or excited",
        "defZh": "轻轻地发抖，通常是因为害怕、冷或激动",
        "parts": "",
        "partsZh": "",
        "note": "",
        "noteZh": "",
        "guess": {
          "q": "In the story, **tremble** most likely means",
          "opts": [
            "clap loudly",
            "shake a little",
            "grow bigger",
            "feel warm"
          ],
          "a": 1,
          "clue": "In the same sentence ‘the torchlight shook’. Her hands were shaking because the noise in the ferns frightened her.",
          "clueZh": "同一句里说“手电筒的光在晃动”。她的手在抖，因为蕨丛里的声音吓到了她。"
        },
        "ex": [
          "The puppy trembled during the thunderstorm.",
          "My voice trembled when I read my speech to the class."
        ],
        "syn": [
          "shake",
          "quiver",
          "shiver"
        ],
        "ant": [],
        "dis": [
          "borrow",
          "paint",
          "count"
        ],
        "cloze": {
          "s": "Standing in the icy wind, Ben began to ___ with cold.",
          "opts": [
            "flourish",
            "haggle",
            "conceal",
            "tremble"
          ],
          "a": 3
        }
      },
      "bustling": {
        "word": "bustling",
        "form": "bustling",
        "pos": "adjective",
        "syll": "bus·tling",
        "zh": "熙熙攘攘的；忙碌热闹的",
        "def": "full of people moving about busily",
        "defZh": "人很多、大家忙忙碌碌走来走去的；热闹的",
        "parts": "bustle (to hurry about busily) + -ing",
        "partsZh": "bustle（忙碌地走来走去）+ -ing",
        "note": "",
        "noteZh": "",
        "guess": {
          "q": "In the story, **bustling** most likely means",
          "opts": [
            "empty and silent",
            "busy and full of people",
            "dark and cold",
            "small and tidy"
          ],
          "a": 1,
          "clue": "The next sentence shows it: crowds hurried between the stalls and sellers shouted out their prices. A place like that is busy and lively.",
          "clueZh": "下一句说明了：人群在摊位间匆匆走动，摊主大声叫卖。这样的地方就是热闹繁忙的。"
        },
        "ex": [
          "The bustling airport was full of travellers with suitcases.",
          "Our kitchen is bustling on Christmas morning."
        ],
        "syn": [
          "busy",
          "lively",
          "crowded"
        ],
        "ant": [
          "quiet",
          "deserted"
        ],
        "dis": [
          "honest",
          "wooden",
          "hungry"
        ],
        "cloze": {
          "s": "On Christmas Eve, the shopping mall was ___ with last-minute shoppers.",
          "opts": [
            "fragile",
            "weary",
            "dormant",
            "bustling"
          ],
          "a": 3
        }
      },
      "haggle": {
        "word": "haggle",
        "form": "haggled",
        "pos": "verb",
        "syll": "hag·gle",
        "zh": "讨价还价",
        "def": "to argue about a price until the buyer and seller agree",
        "defZh": "为价钱反复商量争论，直到买卖双方都同意",
        "parts": "",
        "partsZh": "",
        "note": "",
        "noteZh": "",
        "guess": {
          "q": "In the story, **haggled** most likely means",
          "opts": [
            "paid the full price",
            "stole the basket",
            "wrapped the present",
            "argued about the price"
          ],
          "a": 3,
          "clue": "The story shows the haggling: Mia offered $18, the seller said $25 and they agreed on $22. They went back and forth about the price.",
          "clueZh": "故事展示了讨价还价的过程：Mia 出 18 元，摊主说 25 元，最后定在 22 元。他们为价钱来回商量。"
        },
        "ex": [
          "Dad haggled with the man selling the old bike.",
          "At the night market, people haggle over the price of fruit."
        ],
        "syn": [
          "bargain",
          "negotiate"
        ],
        "ant": [],
        "dis": [
          "sneeze",
          "paint",
          "swim"
        ],
        "cloze": {
          "s": "Tama tried to ___ with the seller to get the toy for less money.",
          "opts": [
            "haggle",
            "tremble",
            "gleam",
            "creak"
          ],
          "a": 0
        }
      },
      "lavish": {
        "word": "lavish",
        "form": "lavish",
        "pos": "adjective",
        "syll": "lav·ish",
        "zh": "丰盛的；大方的；奢华的",
        "def": "very generous and plentiful, with much more than you need",
        "defZh": "非常丰富、大方的，远远超过所需要的",
        "parts": "",
        "partsZh": "",
        "note": "",
        "noteZh": "",
        "guess": {
          "q": "In the story, **lavish** most likely means",
          "opts": [
            "generous and plentiful",
            "small and cheap",
            "broken and old",
            "boring and plain"
          ],
          "a": 0,
          "clue": "The present was a basket ‘piled high with flowers’. A present with plenty — more than enough — is lavish.",
          "clueZh": "这份礼物是一个“堆满鲜花”的篮子。满满当当、多得超出所需的东西就是 lavish（丰盛的）。"
        },
        "ex": [
          "The wedding had a lavish feast with ten different desserts.",
          "Nana served lavish helpings of trifle."
        ],
        "syn": [
          "generous",
          "plentiful",
          "grand"
        ],
        "ant": [
          "plain",
          "meagre"
        ],
        "dis": [
          "nervous",
          "sticky",
          "sleepy"
        ],
        "cloze": {
          "s": "For the party, Nana cooked a ___ meal with roast lamb, pavlova and three cakes.",
          "opts": [
            "murky",
            "lavish",
            "timid",
            "parched"
          ],
          "a": 1
        }
      },
      "frantic": {
        "word": "frantic",
        "form": "frantic",
        "pos": "adjective",
        "syll": "fran·tic",
        "zh": "焦急万分的；发狂似的",
        "def": "wildly worried or scared, so you act in a rushed way",
        "defZh": "极度担心或害怕，所以行动慌乱的",
        "parts": "",
        "partsZh": "",
        "note": "The adverb is frantically: ‘He searched frantically.’",
        "noteZh": "副词是 frantically（发疯似地）：He searched frantically.（他发疯似地找。）",
        "guess": {
          "q": "In the story, **frantic** most likely means",
          "opts": [
            "calm and relaxed",
            "very sleepy",
            "wildly worried",
            "quietly happy"
          ],
          "a": 2,
          "clue": "The next sentence describes him: he ran from room to room, close to tears and unable to sit still. That shows wild worry.",
          "clueZh": "下一句描写了他：他从一个房间跑到另一个房间，快哭了，根本坐不住。这表现出他极度着急。"
        },
        "ex": [
          "The frantic mother bird flapped around her fallen chick.",
          "The frantic farmer searched every paddock for his missing lambs."
        ],
        "syn": [
          "panicky",
          "desperate",
          "wild"
        ],
        "ant": [
          "calm",
          "relaxed"
        ],
        "dis": [
          "wooden",
          "tidy",
          "famous"
        ],
        "cloze": {
          "s": "When the fire alarm rang, there was a ___ rush for the doors.",
          "opts": [
            "frantic",
            "tranquil",
            "dormant",
            "exquisite"
          ],
          "a": 0
        }
      },
      "rummage": {
        "word": "rummage",
        "form": "rummaged",
        "pos": "verb",
        "syll": "rum·mage",
        "zh": "翻找；翻箱倒柜地找",
        "def": "to search for something by moving things around in a messy way",
        "defZh": "把东西翻来翻去、乱糟糟地寻找",
        "parts": "",
        "partsZh": "",
        "note": "",
        "noteZh": "",
        "guess": {
          "q": "In the story, **rummaged** most likely means",
          "opts": [
            "folded neatly",
            "washed and dried",
            "sat on quietly",
            "searched by moving things around"
          ],
          "a": 3,
          "clue": "The rest of the sentence shows it: he pulled out socks, towels and shirts and threw them on the floor while searching.",
          "clueZh": "这句话后半部分说明了：他一边找一边把袜子、毛巾、衬衫拽出来扔在地上。"
        },
        "ex": [
          "Mum rummaged in her bag for the car keys.",
          "We rummaged through the old box of toys in the garage."
        ],
        "syn": [
          "search",
          "dig"
        ],
        "ant": [],
        "dis": [
          "sing",
          "whistle",
          "float"
        ],
        "cloze": {
          "s": "Aroha ___ through the drawer until she found her swimming goggles.",
          "opts": [
            "trembled",
            "beamed",
            "dwindled",
            "rummaged"
          ],
          "a": 3
        }
      },
      "relieved": {
        "word": "relieved",
        "form": "relieved",
        "pos": "adjective",
        "syll": "re·lieved",
        "zh": "松了一口气的；宽慰的",
        "def": "happy because a worry or problem has gone away",
        "defZh": "因为担心的事或麻烦没有了，所以感到轻松、高兴",
        "parts": "",
        "partsZh": "",
        "note": "Relief is the noun: ‘What a relief!’",
        "noteZh": "名词是 relief：What a relief!（总算放心了！）",
        "guess": {
          "q": "In the story, **relieved** most likely means",
          "opts": [
            "angry with someone",
            "tired from running",
            "surprised and scared",
            "glad a worry has ended"
          ],
          "a": 3,
          "clue": "The last sentence explains it: ‘All his worry had melted away.’ When a worry goes away, you feel relieved.",
          "clueZh": "最后一句解释了：“他所有的担心都消失了。”担心的事过去了，就会感到 relieved（松了一口气）。"
        },
        "ex": [
          "Hana was relieved when her test result was better than she expected.",
          "We were relieved to see the ferry arrive safely in the storm."
        ],
        "syn": [
          "thankful",
          "glad",
          "reassured"
        ],
        "ant": [
          "worried",
          "anxious"
        ],
        "dis": [
          "square",
          "rusty",
          "salty"
        ],
        "cloze": {
          "s": "The lost hikers were so ___ when they saw the rescue helicopter.",
          "opts": [
            "murky",
            "ramshackle",
            "relieved",
            "dormant"
          ],
          "a": 2
        }
      },
      "sprawling": {
        "word": "sprawling",
        "form": "sprawling",
        "pos": "adjective",
        "syll": "sprawl·ing",
        "zh": "大片延伸的；占地很广的",
        "def": "spreading out over a large area",
        "defZh": "向四周大片延伸、占地很大的",
        "parts": "sprawl (to spread out untidily) + -ing",
        "partsZh": "sprawl（随意地伸展开）+ -ing",
        "note": "Sprawl can also describe lying with your arms and legs spread out: ‘He sprawled on the couch.’",
        "noteZh": "sprawl 也可以形容人手脚摊开躺着：He sprawled on the couch.（他四仰八叉地躺在沙发上。）",
        "guess": {
          "q": "In the story, **sprawling** most likely means",
          "opts": [
            "tiny and neat",
            "covered in rocks",
            "full of sheep",
            "spreading over a large area"
          ],
          "a": 3,
          "clue": "The paddock ‘stretches all the way to the hills’. Something that stretches that far is spread out over a big area.",
          "clueZh": "这片牧场“一直延伸到山边”。能延伸这么远的东西，占地一定很大。"
        },
        "ex": [
          "The sprawling city had dozens of suburbs.",
          "The sprawling old house had twenty rooms."
        ],
        "syn": [
          "spread-out",
          "wide",
          "huge"
        ],
        "ant": [
          "compact",
          "tiny"
        ],
        "dis": [
          "thirsty",
          "polite",
          "noisy"
        ],
        "cloze": {
          "s": "The ___ farm was so big that it took an hour to drive across it.",
          "opts": [
            "timid",
            "sprawling",
            "obedient",
            "weary"
          ],
          "a": 1
        }
      },
      "crumble": {
        "word": "crumble",
        "form": "crumble",
        "pos": "verb",
        "syll": "crum·ble",
        "zh": "碎裂；粉碎；崩塌",
        "def": "to break into lots of small pieces",
        "defZh": "碎成很多小块",
        "parts": "Linked to crumb (a tiny piece of bread or cake).",
        "partsZh": "和 crumb（面包屑、蛋糕屑）有关。",
        "note": "A crumble is also a pudding with a crumbly topping, such as apple crumble.",
        "noteZh": "crumble 也是一种甜点，上面铺着酥碎的顶层，例如 apple crumble（苹果酥）。",
        "guess": {
          "q": "In the story, **crumble** most likely means",
          "opts": [
            "grow taller",
            "break into small pieces",
            "shine brightly",
            "stay very strong"
          ],
          "a": 1,
          "clue": "The steps ‘crumble into dust’ when you stand on them. Turning into dust means breaking into tiny pieces.",
          "clueZh": "人一踩上去，台阶就“碎成粉末”。变成粉末就是碎成很小的碎块。"
        },
        "ex": [
          "The dry biscuit crumbled in my hand.",
          "The old castle walls began to crumble after the earthquake."
        ],
        "syn": [
          "break up",
          "fall apart"
        ],
        "ant": [],
        "dis": [
          "whistle",
          "borrow",
          "paint"
        ],
        "cloze": {
          "s": "If you squeeze the dry cake too hard, it will ___ into crumbs.",
          "opts": [
            "haggle",
            "relish",
            "crumble",
            "conceal"
          ],
          "a": 2
        }
      },
      "abandoned": {
        "word": "abandoned",
        "form": "abandoned",
        "pos": "adjective",
        "syll": "a·ban·doned",
        "zh": "被遗弃的；废弃的",
        "def": "left empty or alone and no longer used or wanted",
        "defZh": "被丢下的、空着没人用或没人要的",
        "parts": "abandon (to leave behind for good) + -ed",
        "partsZh": "abandon（永远丢下）+ -ed",
        "note": "The verb is abandon: ‘Never abandon a pet.’",
        "noteZh": "动词是 abandon：Never abandon a pet.（永远不要遗弃宠物。）",
        "guess": {
          "q": "In the story, **abandoned** most likely means",
          "opts": [
            "left empty and unused",
            "newly built",
            "painted red",
            "full of sheep"
          ],
          "a": 0,
          "clue": "The next sentence explains it: ‘Nobody has used it for forty years’, since the farmers built a new shed.",
          "clueZh": "下一句解释了：“四十年没人用过它了”，因为农民盖了新棚子。"
        },
        "ex": [
          "We found an abandoned bird’s nest in the hedge.",
          "The abandoned car had flat tyres and broken windows."
        ],
        "syn": [
          "deserted",
          "empty",
          "unused"
        ],
        "ant": [
          "occupied",
          "used"
        ],
        "dis": [
          "cheerful",
          "clever",
          "sweet"
        ],
        "cloze": {
          "s": "The ___ house had been empty for years, and weeds grew through the floor.",
          "opts": [
            "jubilant",
            "abandoned",
            "boisterous",
            "nimble"
          ],
          "a": 1
        }
      },
      "ponder": {
        "word": "ponder",
        "form": "pondered",
        "pos": "verb",
        "syll": "pon·der",
        "zh": "仔细思考；琢磨",
        "def": "to think carefully about something for a long time",
        "defZh": "长时间仔细地思考某件事",
        "parts": "",
        "partsZh": "",
        "note": "",
        "noteZh": "",
        "guess": {
          "q": "In the story, **pondered** most likely means",
          "opts": [
            "laughed loudly at",
            "threw away",
            "thought carefully about",
            "forgot about"
          ],
          "a": 2,
          "clue": "The sentence explains it: she sat ‘for a long time, thinking hard about what was going wrong’.",
          "clueZh": "这句话解释了：她坐了“很长时间，认真地想到底哪里出了问题”。"
        },
        "ex": [
          "Ben pondered which book to borrow from the library.",
          "The detective pondered the strange footprints."
        ],
        "syn": [
          "consider",
          "think about",
          "wonder about"
        ],
        "ant": [
          "ignore"
        ],
        "dis": [
          "paint",
          "sneeze",
          "bounce"
        ],
        "cloze": {
          "s": "Hana ___ the hard maths puzzle for ten minutes before she solved it.",
          "opts": [
            "trudged",
            "pondered",
            "drenched",
            "creaked"
          ],
          "a": 1
        }
      },
      "ingenious": {
        "word": "ingenious",
        "form": "ingenious",
        "pos": "adjective",
        "syll": "in·ge·nious",
        "zh": "巧妙的；有独创性的",
        "def": "very clever and new, often solving a problem in a smart way",
        "defZh": "非常聪明、新颖的，常常用巧妙的方法解决问题",
        "parts": "",
        "partsZh": "",
        "note": "Ingenious and engineer come from the same old word for cleverness. Don’t mix it up with genuine (real).",
        "noteZh": "ingenious 和 engineer（工程师）来自同一个表示“聪明才智”的古老词根。别和 genuine（真正的）弄混。",
        "guess": {
          "q": "In the story, **ingenious** most likely means",
          "opts": [
            "very silly",
            "very old",
            "very heavy",
            "very clever"
          ],
          "a": 3,
          "clue": "After her boats failed, she came up with a new plan that solved the problem and won first prize. An idea like that is very clever.",
          "clueZh": "她的船失败后，她想出了一个新办法，解决了问题，还得了第一名。这样的主意就是非常聪明巧妙的。"
        },
        "ex": [
          "Tama’s ingenious invention fed his dog while he was at school.",
          "Using a straw as a tiny funnel was an ingenious trick."
        ],
        "syn": [
          "clever",
          "inventive",
          "brilliant"
        ],
        "ant": [
          "foolish",
          "silly"
        ],
        "dis": [
          "thirsty",
          "muddy",
          "shy"
        ],
        "cloze": {
          "s": "Mia came up with a very ___ way to carry all the shopping in one trip.",
          "opts": [
            "murky",
            "ingenious",
            "ominous",
            "abandoned"
          ],
          "a": 1
        }
      },
      "persist": {
        "word": "persist",
        "form": "persisted",
        "pos": "verb",
        "syll": "per·sist",
        "zh": "坚持；锲而不舍",
        "def": "to keep trying to do something even when it is difficult",
        "defZh": "即使很困难也继续努力去做某件事",
        "parts": "per- (through) + sist (stand) → stand firm all the way through",
        "partsZh": "per-（贯穿）+ sist（站立）→ 一直坚持站到最后",
        "note": "The noun is persistence; the adjective is persistent.",
        "noteZh": "名词是 persistence（毅力）；形容词是 persistent（坚持不懈的）。",
        "guess": {
          "q": "In the story, **persisted** most likely means",
          "opts": [
            "gave up",
            "kept on trying",
            "went home",
            "asked for help"
          ],
          "a": 1,
          "clue": "Look at ‘but’: the boat still leaked, BUT she persisted, fixing each hole. She didn’t stop — she kept going.",
          "clueZh": "注意 but：船还是漏水，但是她 persisted，一个一个地补洞。她没有停下——一直坚持。"
        },
        "ex": [
          "Leo persisted with his piano practice and finally played the whole song.",
          "Although it rained, the team persisted and finished the race."
        ],
        "syn": [
          "continue",
          "keep going",
          "carry on"
        ],
        "ant": [
          "give up",
          "quit"
        ],
        "dis": [
          "whisper",
          "float",
          "sneeze"
        ],
        "cloze": {
          "s": "The first ten tries failed, but Aroha ___ until her kite flew.",
          "opts": [
            "dwindled",
            "persisted",
            "crumbled",
            "glimpsed"
          ],
          "a": 1
        }
      },
      "parched": {
        "word": "parched",
        "form": "parched",
        "pos": "adjective",
        "syll": "parched",
        "zh": "干透的；干裂的；（人）渴极了",
        "def": "very dry because there has been no water for a long time",
        "defZh": "因为很长时间没有水而变得非常干燥的",
        "parts": "",
        "partsZh": "",
        "note": "You can also say ‘I’m parched!’ when you are very thirsty.",
        "noteZh": "非常口渴时也可以说 I’m parched!（我渴死了！）",
        "guess": {
          "q": "In the report, **parched** most likely means",
          "opts": [
            "very wet",
            "very dry",
            "very green",
            "very cold"
          ],
          "a": 1,
          "clue": "After the colon come examples: the grass turned brown, the soil cracked and the creeks dried up. All of these show the land was very dry.",
          "clueZh": "冒号后面举了例子：草变黄、土地裂开、小溪干涸。这些都说明土地非常干。"
        },
        "ex": [
          "After weeks without rain, the parched lawn turned brown and crunchy.",
          "The parched garden needed a good soak."
        ],
        "syn": [
          "dry",
          "dried-out",
          "thirsty"
        ],
        "ant": [
          "wet",
          "soaked"
        ],
        "dis": [
          "clever",
          "polite",
          "noisy"
        ],
        "cloze": {
          "s": "Nothing could grow in the ___ desert sand.",
          "opts": [
            "jubilant",
            "timid",
            "obedient",
            "parched"
          ],
          "a": 3
        }
      },
      "dwindle": {
        "word": "dwindle",
        "form": "dwindled",
        "pos": "verb",
        "syll": "dwin·dle",
        "zh": "逐渐减少；缩小",
        "def": "to become smaller or fewer, little by little",
        "defZh": "一点一点地变少或变小",
        "parts": "",
        "partsZh": "",
        "note": "",
        "noteZh": "",
        "guess": {
          "q": "In the report, **dwindled** most likely means",
          "opts": [
            "got less and less",
            "got warmer",
            "turned green",
            "overflowed"
          ],
          "a": 0,
          "clue": "The water went down ‘until only a few centimetres were left’. That shows it slowly became less and less.",
          "clueZh": "水一直减少，“直到只剩下几厘米”。这说明水在慢慢变少。"
        },
        "ex": [
          "As winter came, the number of tourists dwindled.",
          "Our pile of firewood dwindled during the cold week."
        ],
        "syn": [
          "shrink",
          "decrease",
          "fall"
        ],
        "ant": [
          "grow",
          "increase"
        ],
        "dis": [
          "giggle",
          "paint",
          "bounce"
        ],
        "cloze": {
          "s": "As we kept eating, the huge pile of sandwiches slowly ___.",
          "opts": [
            "flourished",
            "erupted",
            "beamed",
            "dwindled"
          ],
          "a": 3
        }
      },
      "flourish": {
        "word": "flourish",
        "form": "flourish",
        "pos": "verb",
        "syll": "flour·ish",
        "zh": "茁壮成长；繁荣",
        "def": "to grow strongly and healthily",
        "defZh": "长得茁壮、健康",
        "parts": "Linked to flower — it comes from an old French word meaning ‘to bloom’.",
        "partsZh": "和 flower（花）有关——来自古法语中“开花”的意思。",
        "note": "",
        "noteZh": "",
        "guess": {
          "q": "In the report, **flourish** most likely means",
          "opts": [
            "dry up",
            "get cut down",
            "stay small",
            "grow strongly"
          ],
          "a": 3,
          "clue": "The words after it explain: the plants were ‘growing thick and strong’ after the rain.",
          "clueZh": "后面的词解释了：下雨后，植物“长得又密又壮”。"
        },
        "ex": [
          "Tomatoes flourish in a warm, sunny garden.",
          "With a kind teacher, the whole class began to flourish."
        ],
        "syn": [
          "thrive",
          "grow",
          "bloom"
        ],
        "ant": [
          "wither",
          "die"
        ],
        "dis": [
          "borrow",
          "sneeze",
          "count"
        ],
        "cloze": {
          "s": "With plenty of sunshine and water, the new trees will ___.",
          "opts": [
            "dwindle",
            "flourish",
            "crumble",
            "tremble"
          ],
          "a": 1
        }
      },
      "tranquil": {
        "word": "tranquil",
        "form": "tranquil",
        "pos": "adjective",
        "syll": "tran·quil",
        "zh": "宁静的；平静的",
        "def": "calm, quiet and peaceful",
        "defZh": "安静、平和、宁静的",
        "parts": "",
        "partsZh": "",
        "note": "",
        "noteZh": "",
        "guess": {
          "q": "In the poem, **tranquil** most likely means",
          "opts": [
            "busy and loud",
            "hot and dry",
            "calm and peaceful",
            "dark and scary"
          ],
          "a": 2,
          "clue": "The next line tells you: ‘No traffic, no shouting’, and later ‘nobody hurries’. A place like that is calm and peaceful.",
          "clueZh": "下一行告诉你：“没有车流，没有喊叫”，后面还说“没有人匆匆忙忙”。这样的地方就是平静安宁的。"
        },
        "ex": [
          "The lake was tranquil, without a single ripple.",
          "The tranquil music helped the baby fall asleep."
        ],
        "syn": [
          "peaceful",
          "calm",
          "quiet"
        ],
        "ant": [
          "noisy",
          "chaotic"
        ],
        "dis": [
          "hungry",
          "clever",
          "sticky"
        ],
        "cloze": {
          "s": "Early in the morning, before anyone woke up, the beach was ___.",
          "opts": [
            "boisterous",
            "bustling",
            "tranquil",
            "frantic"
          ],
          "a": 2
        }
      },
      "linger": {
        "word": "linger",
        "form": "linger",
        "pos": "verb",
        "syll": "lin·ger",
        "zh": "逗留；徘徊；舍不得离开",
        "def": "to stay somewhere longer than you need to, because you don’t want to leave",
        "defZh": "因为不想离开，在某处待得比需要的时间更久",
        "parts": "",
        "partsZh": "",
        "note": "Smells and feelings can linger too: ‘The smell of smoke lingered.’",
        "noteZh": "气味和感觉也可以 linger（久久不散）：The smell of smoke lingered.（烟味久久不散。）",
        "guess": {
          "q": "In the poem, **linger** most likely means",
          "opts": [
            "run away fast",
            "stay longer",
            "climb up high",
            "fall asleep"
          ],
          "a": 1,
          "clue": "The next line explains it: ‘In no hurry to leave, as slow as can be’. When you are in no hurry to leave, you linger.",
          "clueZh": "下一行解释了：“一点也不急着离开，慢得不能再慢”。不急着走、多待一会儿，就是 linger。"
        },
        "ex": [
          "We lingered at the beach to watch the sunset.",
          "The smell of fresh bread lingered in the kitchen."
        ],
        "syn": [
          "stay",
          "remain",
          "hang around"
        ],
        "ant": [
          "leave",
          "hurry away"
        ],
        "dis": [
          "paint",
          "count",
          "sneeze"
        ],
        "cloze": {
          "s": "The children wanted to ___ at the zoo, but it was time to go home.",
          "opts": [
            "dwindle",
            "erupt",
            "linger",
            "conceal"
          ],
          "a": 2
        }
      },
      "cherish": {
        "word": "cherish",
        "form": "cherish",
        "pos": "verb",
        "syll": "cher·ish",
        "zh": "珍惜；珍爱",
        "def": "to love something and treat it as very precious",
        "defZh": "非常爱惜某样东西，把它当作很宝贵的",
        "parts": "",
        "partsZh": "",
        "note": "",
        "noteZh": "",
        "guess": {
          "q": "In the poem, **cherish** most likely means",
          "opts": [
            "forget quickly",
            "laugh at",
            "treasure and love",
            "complain about"
          ],
          "a": 2,
          "clue": "The poet compares the mornings to ‘treasure or gold’ and says they will keep them forever. We cherish things that are precious to us.",
          "clueZh": "诗人把这些早晨比作“珍宝或黄金”，说会永远珍藏。我们会 cherish（珍惜）对自己很宝贵的东西。"
        },
        "ex": [
          "I cherish the photo of my great-grandparents.",
          "Aroha cherishes the necklace her nana gave her."
        ],
        "syn": [
          "treasure",
          "love",
          "value"
        ],
        "ant": [
          "neglect",
          "ignore"
        ],
        "dis": [
          "borrow",
          "sweep",
          "jump"
        ],
        "cloze": {
          "s": "Leo will always ___ the medal he won at his first swimming race.",
          "opts": [
            "haggle",
            "rummage",
            "cherish",
            "dwindle"
          ],
          "a": 2
        }
      },
      "jubilant": {
        "word": "jubilant",
        "form": "jubilant",
        "pos": "adjective",
        "syll": "ju·bi·lant",
        "zh": "欢欣鼓舞的；兴高采烈的",
        "def": "extremely happy, usually because of a success",
        "defZh": "非常高兴的，通常是因为取得了成功",
        "parts": "",
        "partsZh": "",
        "note": "",
        "noteZh": "",
        "guess": {
          "q": "In the story, **jubilant** most likely means",
          "opts": [
            "very tired",
            "extremely happy",
            "a bit scared",
            "quite bored"
          ],
          "a": 1,
          "clue": "The next sentence shows how they felt: they screamed, hugged and danced around the court after winning.",
          "clueZh": "下一句表现了她们的心情：赢了以后她们尖叫、拥抱，在球场上跳起舞来。"
        },
        "ex": [
          "The jubilant crowd cheered when the home team scored.",
          "Mia was jubilant when she finally learned to ride her bike."
        ],
        "syn": [
          "overjoyed",
          "thrilled",
          "delighted"
        ],
        "ant": [
          "dejected",
          "miserable"
        ],
        "dis": [
          "wooden",
          "rusty",
          "square"
        ],
        "cloze": {
          "s": "The ___ fans danced in the streets after their team won the cup.",
          "opts": [
            "dejected",
            "dormant",
            "parched",
            "jubilant"
          ],
          "a": 3
        }
      },
      "triumph": {
        "word": "triumph",
        "form": "triumph",
        "pos": "noun",
        "syll": "tri·umph",
        "zh": "巨大的胜利；成功",
        "def": "a great win or success",
        "defZh": "一次巨大的胜利或成功",
        "parts": "",
        "partsZh": "",
        "note": "The adjective is triumphant: ‘a triumphant smile’.",
        "noteZh": "形容词是 triumphant（得意洋洋的）：a triumphant smile（胜利的微笑）。",
        "guess": {
          "q": "In the story, **triumph** most likely means",
          "opts": [
            "a long trip",
            "a bad mistake",
            "a hard practice",
            "a great success"
          ],
          "a": 3,
          "clue": "They had just won the final and the coach held up the silver cup, so their ‘first triumph in five years’ was a great success.",
          "clueZh": "她们刚刚赢了决赛，教练高高举起银杯，所以“五年来的第一次 triumph”就是一次巨大的成功。"
        },
        "ex": [
          "Finishing the marathon was a triumph for Grandpa.",
          "The school play was a triumph, and everyone clapped for ages."
        ],
        "syn": [
          "victory",
          "success",
          "win"
        ],
        "ant": [
          "defeat",
          "failure"
        ],
        "dis": [
          "pillow",
          "carrot",
          "window"
        ],
        "cloze": {
          "s": "Climbing to the top of the rock wall was a real ___ for Ben, who used to be scared of heights.",
          "opts": [
            "glimpse",
            "hoard",
            "creak",
            "triumph"
          ],
          "a": 3
        }
      },
      "dejected": {
        "word": "dejected",
        "form": "dejected",
        "pos": "adjective",
        "syll": "de·ject·ed",
        "zh": "沮丧的；垂头丧气的",
        "def": "sad and disappointed, often after losing or failing",
        "defZh": "伤心、失望的，常常是在输了或失败之后",
        "parts": "de- (down) + ject (throw) → thrown down, feeling low",
        "partsZh": "de-（向下）+ ject（扔）→ 被扔下去，情绪低落",
        "note": "",
        "noteZh": "",
        "guess": {
          "q": "In the story, **dejected** most likely means",
          "opts": [
            "proud and pleased",
            "angry and loud",
            "sad and disappointed",
            "calm and relaxed"
          ],
          "a": 2,
          "clue": "The next sentence describes them: after losing, they sat with their heads down and some wiped away tears.",
          "clueZh": "下一句描写了她们：输了以后，她们低着头坐着，有的人在擦眼泪。"
        },
        "ex": [
          "Leo looked dejected when the waves washed his sandcastle away.",
          "The dejected puppy lay by the door after its owner left."
        ],
        "syn": [
          "downhearted",
          "disappointed",
          "glum"
        ],
        "ant": [
          "jubilant",
          "cheerful"
        ],
        "dis": [
          "metal",
          "shiny",
          "early"
        ],
        "cloze": {
          "s": "After missing the bus for the school trip, Hana felt ___ all day.",
          "opts": [
            "jubilant",
            "ingenious",
            "dejected",
            "lavish"
          ],
          "a": 2
        }
      },
      "peculiar": {
        "word": "peculiar",
        "form": "peculiar",
        "pos": "adjective",
        "syll": "pe·cu·liar",
        "zh": "奇怪的；古怪的",
        "def": "strange or unusual, in a way that makes you wonder",
        "defZh": "奇怪、不寻常的，让人觉得纳闷",
        "parts": "",
        "partsZh": "",
        "note": "",
        "noteZh": "",
        "guess": {
          "q": "In the story, **peculiar** most likely means",
          "opts": [
            "boring",
            "strange",
            "short",
            "neat"
          ],
          "a": 1,
          "clue": "The next sentence says it another way: ‘It was strange’ — the words were backwards and there was no name. Peculiar means strange.",
          "clueZh": "下一句换了个说法：“它很奇怪”——字是反着写的，也没有署名。peculiar 就是奇怪的意思。"
        },
        "ex": [
          "There was a peculiar smell coming from the fridge.",
          "Our cat has a peculiar habit of sleeping in the sink."
        ],
        "syn": [
          "strange",
          "odd",
          "weird"
        ],
        "ant": [
          "normal",
          "ordinary"
        ],
        "dis": [
          "thirsty",
          "honest",
          "sporty"
        ],
        "cloze": {
          "s": "The dog made a ___ noise, like a squeaky door, so we took it to the vet.",
          "opts": [
            "tranquil",
            "lavish",
            "peculiar",
            "nimble"
          ],
          "a": 2
        }
      },
      "conceal": {
        "word": "conceal",
        "form": "concealed",
        "pos": "verb",
        "syll": "con·ceal",
        "zh": "隐藏；藏起来",
        "def": "to hide something so that no one can see or find it",
        "defZh": "把东西藏起来，让别人看不到、找不到",
        "parts": "",
        "partsZh": "",
        "note": "",
        "noteZh": "",
        "guess": {
          "q": "In the story, **concealed** most likely means",
          "opts": [
            "broken",
            "painted",
            "hidden",
            "opened"
          ],
          "a": 2,
          "clue": "The box was behind a loose board, ‘where nobody could see it’. Something nobody can see is hidden.",
          "clueZh": "盒子在一块松动的木板后面，“谁也看不到”。别人看不到的东西就是被藏起来的。"
        },
        "ex": [
          "The tiger’s stripes help it conceal itself in the long grass.",
          "Mia concealed the present under her bed."
        ],
        "syn": [
          "hide",
          "cover"
        ],
        "ant": [
          "reveal",
          "show"
        ],
        "dis": [
          "sing",
          "jog",
          "bake"
        ],
        "cloze": {
          "s": "Tama tried to ___ his smile, but everyone could tell he was happy.",
          "opts": [
            "dwindle",
            "conceal",
            "persist",
            "linger"
          ],
          "a": 1
        }
      },
      "reveal": {
        "word": "reveal",
        "form": "revealed",
        "pos": "verb",
        "syll": "re·veal",
        "zh": "揭示；显露；透露",
        "def": "to show something, or let people know something that was hidden or secret",
        "defZh": "让别人看到或知道原本被藏起来或保密的东西",
        "parts": "re- (back) + veal (from ‘veil’) → pull back the veil",
        "partsZh": "re-（向后）+ veal（来自 veil 面纱）→ 揭开面纱",
        "note": "",
        "noteZh": "",
        "guess": {
          "q": "In the story, **revealed** most likely means",
          "opts": [
            "showed or made known",
            "hid away",
            "tore up",
            "forgot"
          ],
          "a": 0,
          "clue": "After they read it, the note told them ‘the secret at last’. To reveal a secret is to make it known.",
          "clueZh": "他们读了以后，纸条“终于说出了秘密”。reveal 一个秘密，就是把它公开、让人知道。"
        },
        "ex": [
          "The magician revealed the card I had picked.",
          "When the curtain opened, it revealed a huge stage."
        ],
        "syn": [
          "show",
          "uncover",
          "disclose"
        ],
        "ant": [
          "conceal",
          "hide"
        ],
        "dis": [
          "swim",
          "sneeze",
          "knit"
        ],
        "cloze": {
          "s": "When the sun came out, the melting snow ___ a path through the forest.",
          "opts": [
            "revealed",
            "pondered",
            "relished",
            "haggled"
          ],
          "a": 0
        }
      },
      "glimpse": {
        "word": "glimpse",
        "form": "glimpse",
        "pos": "noun",
        "syll": "glimpse",
        "zh": "一瞥；看一眼",
        "def": "a very quick look at something, for only a moment",
        "defZh": "很快地看一眼，只看到一瞬间",
        "parts": "",
        "partsZh": "",
        "note": "Glimpse can be a verb too: ‘I glimpsed a whale.’ We often say ‘catch a glimpse of’.",
        "noteZh": "glimpse 也可以作动词：I glimpsed a whale.（我瞥见了一头鲸。）常用说法：catch a glimpse of（瞥见）。",
        "guess": {
          "q": "In the story, **glimpse** most likely means",
          "opts": [
            "a very quick look",
            "a long, careful look",
            "a loud shout",
            "a deep dive"
          ],
          "a": 0,
          "clue": "The next sentence tells you: ‘She saw it for only a second before it swam away.’ A look that short is a glimpse.",
          "clueZh": "下一句告诉你：“她只看到它一秒钟，它就游走了。”这么短暂的一看就是 glimpse。"
        },
        "ex": [
          "From the car window, we caught a glimpse of a deer.",
          "Leo had a glimpse of the present before Mum hid it."
        ],
        "syn": [
          "peek",
          "glance"
        ],
        "ant": [
          "stare"
        ],
        "dis": [
          "blanket",
          "ladder",
          "pencil"
        ],
        "cloze": {
          "s": "Through the gap in the fence, I caught a ___ of the puppies playing.",
          "opts": [
            "summit",
            "triumph",
            "hoard",
            "glimpse"
          ],
          "a": 3
        }
      },
      "dart": {
        "word": "dart",
        "form": "darted",
        "pos": "verb",
        "syll": "dart",
        "zh": "猛冲；飞奔；快速地窜",
        "def": "to move suddenly and quickly in one direction",
        "defZh": "突然快速地朝一个方向移动；猛冲",
        "parts": "",
        "partsZh": "",
        "note": "A dart is also the small pointed arrow you throw at a dartboard — it moves fast too!",
        "noteZh": "dart 也是名词，指投向飞镖盘的小飞镖——它也飞得很快！",
        "guess": {
          "q": "In the story, **darted** most likely means",
          "opts": [
            "floated very slowly",
            "hid under a rock",
            "grew very big",
            "moved suddenly and quickly"
          ],
          "a": 3,
          "clue": "The fish were ‘moving so fast that she could hardly follow them’. That shows they moved quickly and suddenly.",
          "clueZh": "小鱼“游得飞快，她几乎跟不上”。这说明它们移动得又快又突然。"
        },
        "ex": [
          "A rabbit darted across the road in front of our car.",
          "The goalkeeper darted to the left and saved the ball."
        ],
        "syn": [
          "dash",
          "rush",
          "shoot"
        ],
        "ant": [
          "crawl",
          "creep"
        ],
        "dis": [
          "knit",
          "whisper",
          "borrow"
        ],
        "cloze": {
          "s": "When the door opened, the cat ___ out into the garden.",
          "opts": [
            "pondered",
            "darted",
            "cherished",
            "concealed"
          ],
          "a": 1
        }
      },
      "vast": {
        "word": "vast",
        "form": "vast",
        "pos": "adjective",
        "syll": "vast",
        "zh": "广阔的；巨大的",
        "def": "extremely big, especially in area",
        "defZh": "极大的，特别是面积很大的",
        "parts": "",
        "partsZh": "",
        "note": "",
        "noteZh": "",
        "guess": {
          "q": "In the story, **vast** most likely means",
          "opts": [
            "very shallow",
            "quite dirty",
            "extremely big",
            "very warm"
          ],
          "a": 2,
          "clue": "The ocean was ‘stretching out in every direction further than she could see’. Something that big is vast.",
          "clueZh": "大海“向四面八方延伸，远到看不见尽头”。这么大的东西就是 vast。"
        },
        "ex": [
          "Antarctica is a vast land of ice and snow.",
          "A vast crowd filled the stadium."
        ],
        "syn": [
          "huge",
          "enormous",
          "immense"
        ],
        "ant": [
          "tiny",
          "small"
        ],
        "dis": [
          "polite",
          "brave",
          "sticky"
        ],
        "cloze": {
          "s": "From the plane, we looked down on a ___ forest that seemed to go on forever.",
          "opts": [
            "timid",
            "dejected",
            "vast",
            "obedient"
          ],
          "a": 2
        }
      },
      "dismal": {
        "word": "dismal",
        "form": "dismal",
        "pos": "adjective",
        "syll": "dis·mal",
        "zh": "阴沉的；令人沮丧的；糟糕的",
        "def": "gloomy and sad, making you feel miserable",
        "defZh": "阴沉、沉闷的，让人心情低落的",
        "parts": "",
        "partsZh": "",
        "note": "Dismal can also mean very bad: ‘a dismal score’.",
        "noteZh": "dismal 也可以表示“很差的”：a dismal score（很糟糕的分数）。",
        "guess": {
          "q": "In the diary, **dismal** most likely means",
          "opts": [
            "bright and sunny",
            "busy and exciting",
            "short and quick",
            "gloomy and miserable"
          ],
          "a": 3,
          "clue": "The next sentences describe the day: dark clouds hid the sun, it rained without stopping and the tent leaked. That sounds gloomy and miserable.",
          "clueZh": "接下来的句子描写了这一天：乌云遮住太阳，雨下个不停，帐篷还漏水。听起来又阴沉又难受。"
        },
        "ex": [
          "The empty playground looked dismal in the winter fog.",
          "We stayed inside on the dismal, grey afternoon."
        ],
        "syn": [
          "gloomy",
          "dreary",
          "miserable"
        ],
        "ant": [
          "cheerful",
          "bright"
        ],
        "dis": [
          "wooden",
          "hungry",
          "sporty"
        ],
        "cloze": {
          "s": "With grey skies and a cold wind, it was a ___ day for a picnic.",
          "opts": [
            "jubilant",
            "ingenious",
            "nimble",
            "dismal"
          ],
          "a": 3
        }
      },
      "drenched": {
        "word": "drenched",
        "form": "drenched",
        "pos": "adjective",
        "syll": "drenched",
        "zh": "湿透的",
        "def": "completely wet, soaked right through",
        "defZh": "完全湿透的",
        "parts": "drench (to make very wet) + -ed",
        "partsZh": "drench（使湿透）+ -ed",
        "note": "",
        "noteZh": "",
        "guess": {
          "q": "In the diary, **drenched** most likely means",
          "opts": [
            "very hungry",
            "fast asleep",
            "completely wet",
            "a bit cold"
          ],
          "a": 2,
          "clue": "The words after the dash explain it: ‘even our socks were dripping wet’. When even your socks drip, you are wet all over.",
          "clueZh": "破折号后面的话解释了它：“连袜子都在滴水”。连袜子都湿得滴水，说明全身都湿透了。"
        },
        "ex": [
          "We got drenched when the sprinklers suddenly turned on.",
          "The drenched dog shook water all over us."
        ],
        "syn": [
          "soaked",
          "sopping",
          "wet"
        ],
        "ant": [
          "dry",
          "parched"
        ],
        "dis": [
          "clever",
          "tidy",
          "famous"
        ],
        "cloze": {
          "s": "Ben forgot his raincoat and came home ___ from head to toe.",
          "opts": [
            "parched",
            "tranquil",
            "drenched",
            "peculiar"
          ],
          "a": 2
        }
      },
      "endure": {
        "word": "endure",
        "form": "endure",
        "pos": "verb",
        "syll": "en·dure",
        "zh": "忍受；忍耐；挺过去",
        "def": "to put up with something difficult or unpleasant for a long time",
        "defZh": "长时间忍受困难或不愉快的事情",
        "parts": "",
        "partsZh": "",
        "note": "The noun is endurance: the strength to keep going.",
        "noteZh": "名词是 endurance（耐力）。",
        "guess": {
          "q": "In the diary, **endure** most likely means",
          "opts": [
            "run away from",
            "enjoy a lot",
            "put up with",
            "tidy up"
          ],
          "a": 2,
          "clue": "Dad said they had to endure the rain ‘until the storm passed’. They could not stop it, so they had to put up with it.",
          "clueZh": "爸爸说他们得 endure 这场雨，“直到暴风雨过去”。他们没法让雨停，只能忍着。"
        },
        "ex": [
          "The explorers had to endure freezing nights in Antarctica.",
          "Sione endured the long car ride by reading his comics."
        ],
        "syn": [
          "put up with",
          "bear",
          "tolerate"
        ],
        "ant": [
          "give up"
        ],
        "dis": [
          "paint",
          "giggle",
          "fold"
        ],
        "cloze": {
          "s": "The marathon runners had to ___ the hot sun for three hours.",
          "opts": [
            "conceal",
            "haggle",
            "endure",
            "reveal"
          ],
          "a": 2
        }
      },
      "timid": {
        "word": "timid",
        "form": "timid",
        "pos": "adjective",
        "syll": "tim·id",
        "zh": "胆小的；羞怯的",
        "def": "shy and easily frightened; not confident",
        "defZh": "害羞、容易害怕的；不自信的",
        "parts": "",
        "partsZh": "",
        "note": "",
        "noteZh": "",
        "guess": {
          "q": "In the letter, **timid** most likely means",
          "opts": [
            "loud and bossy",
            "shy and easily scared",
            "tall and strong",
            "funny and silly"
          ],
          "a": 1,
          "clue": "The next sentence gives examples: she hid behind her bag and spoke so quietly they could hardly hear her. That is how a shy person acts.",
          "clueZh": "下一句举了例子：她躲在书包后面，说话声音小得几乎听不见。这就是害羞的人的样子。"
        },
        "ex": [
          "The timid kitten hid under the bed when visitors came.",
          "Leo was timid about speaking in assembly, but he did it anyway."
        ],
        "syn": [
          "shy",
          "nervous",
          "fearful"
        ],
        "ant": [
          "bold",
          "confident"
        ],
        "dis": [
          "metal",
          "salty",
          "square"
        ],
        "cloze": {
          "s": "The ___ deer ran away as soon as it heard our footsteps.",
          "opts": [
            "vast",
            "lavish",
            "timid",
            "ramshackle"
          ],
          "a": 2
        }
      },
      "hesitate": {
        "word": "hesitate",
        "form": "hesitated",
        "pos": "verb",
        "syll": "hes·i·tate",
        "zh": "犹豫；迟疑",
        "def": "to pause before doing something because you are unsure or nervous",
        "defZh": "因为拿不准或紧张，在做某事之前停下来；犹豫",
        "parts": "",
        "partsZh": "",
        "note": "The noun is hesitation. ‘Without hesitation’ means straight away.",
        "noteZh": "名词是 hesitation（犹豫）。without hesitation 的意思是毫不犹豫、马上。",
        "guess": {
          "q": "In the letter, **hesitated** most likely means",
          "opts": [
            "ran straight in",
            "shouted loudly",
            "paused because of feeling unsure",
            "fell over"
          ],
          "a": 2,
          "clue": "The words after it explain: she stopped at the door, ‘unsure whether to come in’. Stopping because you are unsure is hesitating.",
          "clueZh": "后面的词解释了：她停在门口，“拿不准要不要进来”。因为拿不准而停下来，就是 hesitate。"
        },
        "ex": [
          "Tama hesitated before jumping off the high diving board.",
          "If you need help, don’t hesitate to ask."
        ],
        "syn": [
          "pause",
          "wait",
          "waver"
        ],
        "ant": [
          "rush"
        ],
        "dis": [
          "bake",
          "sneeze",
          "fold"
        ],
        "cloze": {
          "s": "Priya ___ for a moment, then bravely put her hand up to answer.",
          "opts": [
            "flourished",
            "hesitated",
            "dwindled",
            "erupted"
          ],
          "a": 1
        }
      },
      "beam": {
        "word": "beam",
        "form": "beamed",
        "pos": "verb",
        "syll": "beam",
        "zh": "笑容满面；眉开眼笑",
        "def": "to smile with a big, happy smile",
        "defZh": "露出大大的、开心的笑容",
        "parts": "",
        "partsZh": "",
        "note": "A beam is also a ray of light (a torch beam) or a long, heavy piece of wood. A beaming smile seems to shine!",
        "noteZh": "beam 也可以指一道光（手电筒的光束）或一根长长的粗木梁。灿烂的笑容（beaming smile）好像在发光！",
        "guess": {
          "q": "In the letter, **beamed** most likely means",
          "opts": [
            "smiled widely",
            "frowned",
            "cried",
            "yawned"
          ],
          "a": 0,
          "clue": "The words after the dash explain it: ‘a huge smile spread across her face’.",
          "clueZh": "破折号后面的话解释了：“她脸上露出了大大的笑容”。"
        },
        "ex": [
          "Mum beamed with pride when I got my swimming certificate.",
          "The baby beamed at everyone in the room."
        ],
        "syn": [
          "grin",
          "smile"
        ],
        "ant": [
          "frown",
          "scowl"
        ],
        "dis": [
          "borrow",
          "climb",
          "knit"
        ],
        "cloze": {
          "s": "When the coach said he had made the team, Sione ___ from ear to ear.",
          "opts": [
            "concealed",
            "hoarded",
            "drenched",
            "beamed"
          ],
          "a": 3
        }
      },
      "dormant": {
        "word": "dormant",
        "form": "dormant",
        "pos": "adjective",
        "syll": "dor·mant",
        "zh": "休眠的；暂时不活动的",
        "def": "not active now, as if asleep, but able to become active again",
        "defZh": "现在不活动、像睡着了一样，但以后还可能再活动的",
        "parts": "From the French word dormir, ‘to sleep’ — like dormitory, a room for sleeping.",
        "partsZh": "来自法语 dormir（睡觉）——和 dormitory（宿舍）同源。",
        "note": "Seeds and plants can be dormant in winter too.",
        "noteZh": "种子和植物在冬天也可以是 dormant（休眠）的。",
        "guess": {
          "q": "In the report, **dormant** most likely means",
          "opts": [
            "exploding right now",
            "brand new",
            "asleep but could wake up",
            "full of water"
          ],
          "a": 2,
          "clue": "The next sentence explains it: ‘It is sleeping, not active, but it could wake up again one day.’",
          "clueZh": "下一句解释了：“它在沉睡，不活跃，但有一天可能再次醒来。”"
        },
        "ex": [
          "The tulip bulbs stay dormant under the ground until spring.",
          "Some seeds stay dormant in dry soil for years."
        ],
        "syn": [
          "inactive",
          "sleeping",
          "resting"
        ],
        "ant": [
          "active",
          "awake"
        ],
        "dis": [
          "crunchy",
          "polite",
          "yellow"
        ],
        "cloze": {
          "s": "The bear stays ___ in its den all winter and wakes up in spring.",
          "opts": [
            "bustling",
            "jubilant",
            "boisterous",
            "dormant"
          ],
          "a": 3
        }
      },
      "erupt": {
        "word": "erupt",
        "form": "erupted",
        "pos": "verb",
        "syll": "e·rupt",
        "zh": "（火山）爆发；喷发",
        "def": "to burst out suddenly, like a volcano throwing out lava and ash",
        "defZh": "突然爆发；像火山那样喷出岩浆和火山灰",
        "parts": "e- (out) + rupt (burst, break) → burst out",
        "partsZh": "e-（向外）+ rupt（破裂）→ 冲破出来",
        "note": "People can erupt too: ‘The crowd erupted in cheers.’",
        "noteZh": "人也可以 erupt：The crowd erupted in cheers.（人群爆发出欢呼声。）",
        "guess": {
          "q": "In the report, **erupted** most likely means",
          "opts": [
            "fell asleep",
            "burst out suddenly",
            "sank into the sea",
            "grew trees"
          ],
          "a": 1,
          "clue": "The sentence tells you what happened: it was throwing out hot lava and ash. That is what a volcano does when it erupts.",
          "clueZh": "这句话告诉你发生了什么：它喷出滚烫的岩浆和火山灰。这就是火山喷发时的样子。"
        },
        "ex": [
          "The geyser erupted, sending hot water high into the air.",
          "The class erupted with laughter at the funny video."
        ],
        "syn": [
          "explode",
          "burst",
          "blow up"
        ],
        "ant": [],
        "dis": [
          "knit",
          "borrow",
          "whisper"
        ],
        "cloze": {
          "s": "Steam and ash shot into the sky when the volcano ___.",
          "opts": [
            "erupted",
            "lingered",
            "hesitated",
            "cherished"
          ],
          "a": 0
        }
      },
      "devastate": {
        "word": "devastate",
        "form": "devastate",
        "pos": "verb",
        "syll": "dev·as·tate",
        "zh": "摧毁；彻底破坏",
        "def": "to destroy or badly damage something",
        "defZh": "摧毁某物，或把它严重破坏",
        "parts": "",
        "partsZh": "",
        "note": "People can feel devastated (very upset): ‘She was devastated when her dog died.’",
        "noteZh": "人也可以感到 devastated（极度伤心）：She was devastated when her dog died.（她的狗死了，她伤心欲绝。）",
        "guess": {
          "q": "In the report, **devastate** most likely means",
          "opts": [
            "destroy or badly damage",
            "clean up",
            "visit",
            "warm up"
          ],
          "a": 0,
          "clue": "The words after it show the meaning: ‘destroying homes, roads and farms’. To devastate is to destroy or badly damage.",
          "clueZh": "后面的词说明了意思：“摧毁房屋、道路和农场”。devastate 就是摧毁、严重破坏。"
        },
        "ex": [
          "The cyclone devastated the small island’s crops.",
          "A fire can devastate a forest in just a few hours."
        ],
        "syn": [
          "destroy",
          "wreck",
          "ruin"
        ],
        "ant": [
          "rebuild",
          "protect"
        ],
        "dis": [
          "giggle",
          "sing",
          "yawn"
        ],
        "cloze": {
          "s": "The huge flood could ___ the farms along the river.",
          "opts": [
            "cherish",
            "linger",
            "devastate",
            "beam"
          ],
          "a": 2
        }
      },
      "hoard": {
        "word": "hoard",
        "form": "hoard",
        "pos": "verb",
        "syll": "hoard",
        "zh": "囤积；大量储藏",
        "def": "to collect and hide away a large amount of something to use later",
        "defZh": "收集并藏起大量东西，留着以后用",
        "parts": "",
        "partsZh": "",
        "note": "Hoard sounds like horde (a big crowd), but they are different words.",
        "noteZh": "hoard 和 horde（一大群人）读音相同，但是两个不同的词。",
        "guess": {
          "q": "In the report, **hoard** most likely means",
          "opts": [
            "throw away",
            "share out",
            "store up",
            "cook"
          ],
          "a": 2,
          "clue": "The next sentence gives an example: each squirrel hides hundreds of nuts ‘so it can eat them later’. Saving lots of food for later is hoarding.",
          "clueZh": "下一句举了例子：每只松鼠把几百颗坚果藏起来，“这样以后就可以吃”。把很多食物存起来以后用，就是 hoard。"
        },
        "ex": [
          "My little brother hoards his lollies under his pillow.",
          "Before the storm, some people hoarded bottled water."
        ],
        "syn": [
          "store",
          "stockpile",
          "save"
        ],
        "ant": [
          "use up",
          "waste"
        ],
        "dis": [
          "giggle",
          "paint",
          "sneeze"
        ],
        "cloze": {
          "s": "Squirrels ___ acorns in the ground before the cold weather arrives.",
          "opts": [
            "hoard",
            "beam",
            "creak",
            "tremble"
          ],
          "a": 0
        }
      },
      "scarce": {
        "word": "scarce",
        "form": "scarce",
        "pos": "adjective",
        "syll": "scarce",
        "zh": "稀少的；不足的",
        "def": "hard to find because there is not much of it",
        "defZh": "因为数量很少而很难找到的；稀缺的",
        "parts": "",
        "partsZh": "",
        "note": "Scarcely means hardly: ‘I could scarcely see.’",
        "noteZh": "scarcely 的意思是“几乎不”：I could scarcely see.（我几乎看不见。）",
        "guess": {
          "q": "In the report, **scarce** most likely means",
          "opts": [
            "very tasty",
            "too heavy",
            "hard to find",
            "easy to grow"
          ],
          "a": 2,
          "clue": "The next sentence explains it: snow covers the ground, ‘so there are very few nuts, seeds and berries to find’. When there is very little, food is scarce.",
          "clueZh": "下一句解释了：雪盖住了地面，“所以能找到的坚果、种子和浆果非常少”。数量很少，就是 scarce（稀少）。"
        },
        "ex": [
          "Water is scarce in the desert.",
          "Fresh strawberries are scarce in winter."
        ],
        "syn": [
          "rare",
          "short",
          "limited"
        ],
        "ant": [
          "plentiful",
          "common"
        ],
        "dis": [
          "noisy",
          "brave",
          "polite"
        ],
        "cloze": {
          "s": "During the drought, water was so ___ that people could only shower once a week.",
          "opts": [
            "vivid",
            "boisterous",
            "scarce",
            "nimble"
          ],
          "a": 2
        }
      },
      "nimble": {
        "word": "nimble",
        "form": "nimble",
        "pos": "adjective",
        "syll": "nim·ble",
        "zh": "敏捷的；灵活的",
        "def": "able to move quickly, easily and lightly",
        "defZh": "能快速、轻松、轻巧地移动的；敏捷的",
        "parts": "",
        "partsZh": "",
        "note": "A nimble mind thinks quickly too.",
        "noteZh": "nimble 也可以形容头脑灵活：a nimble mind（反应快的头脑）。",
        "guess": {
          "q": "In the report, **nimble** most likely means",
          "opts": [
            "moving quickly and easily",
            "slow and heavy",
            "sleepy and lazy",
            "noisy and rough"
          ],
          "a": 0,
          "clue": "The next sentence describes it: they ‘leap quickly and easily from branch to branch’. Moving like that is nimble.",
          "clueZh": "下一句描写了：它们“在树枝间轻快地跳来跳去”。这样的动作就是 nimble（敏捷）。"
        },
        "ex": [
          "The nimble goat climbed the steep cliff with ease.",
          "Hana’s nimble fingers tied the knot in seconds."
        ],
        "syn": [
          "agile",
          "quick",
          "light-footed"
        ],
        "ant": [
          "clumsy",
          "slow"
        ],
        "dis": [
          "honest",
          "purple",
          "sour"
        ],
        "cloze": {
          "s": "The ___ gymnast flipped across the mat without a single wobble.",
          "opts": [
            "nimble",
            "dismal",
            "parched",
            "ominous"
          ],
          "a": 0
        }
      },
      "ominous": {
        "word": "ominous",
        "form": "ominous",
        "pos": "adjective",
        "syll": "om·i·nous",
        "zh": "不祥的；预示坏事的",
        "def": "making you feel that something bad is going to happen",
        "defZh": "让人觉得要发生坏事的；不祥的",
        "parts": "omen (a sign of what will happen) + -ous → full of a bad sign",
        "partsZh": "omen（预兆）+ -ous → 充满（不好的）预兆的",
        "note": "",
        "noteZh": "",
        "guess": {
          "q": "In the story, **ominous** most likely means",
          "opts": [
            "warm and welcoming",
            "as if something bad will happen",
            "brand new and bright",
            "tiny and cute"
          ],
          "a": 1,
          "clue": "The writer tells you: black clouds gathered and the windows stared like eyes, ‘as if something bad was about to happen’.",
          "clueZh": "作者告诉你：乌云聚集，窗户像眼睛一样盯着人，“好像有什么坏事要发生”。"
        },
        "ex": [
          "The dark clouds looked ominous, so we packed up our picnic.",
          "There was an ominous silence before the teacher announced the test."
        ],
        "syn": [
          "threatening",
          "menacing",
          "scary"
        ],
        "ant": [
          "promising",
          "hopeful"
        ],
        "dis": [
          "juicy",
          "tidy",
          "sporty"
        ],
        "cloze": {
          "s": "We heard a loud, ___ rumble of thunder and ran inside.",
          "opts": [
            "ominous",
            "exquisite",
            "obedient",
            "lavish"
          ],
          "a": 0
        }
      },
      "creak": {
        "word": "creak",
        "form": "creaked",
        "pos": "verb",
        "syll": "creak",
        "zh": "嘎吱作响",
        "def": "to make a long, high squeaking sound, like an old door or floor",
        "defZh": "发出长长的、尖细的嘎吱声，像旧门或旧地板那样",
        "parts": "",
        "partsZh": "",
        "note": "Don’t mix it up with creek (a small stream) — they sound the same.",
        "noteZh": "别和 creek（小溪）弄混——它们读音相同。",
        "guess": {
          "q": "In the story, **creaked** most likely means",
          "opts": [
            "slammed shut",
            "made a squeaking sound",
            "fell off",
            "flew open silently"
          ],
          "a": 1,
          "clue": "The sentence describes the sound: the door opened ‘with a long, slow squeak’. That noise is a creak.",
          "clueZh": "这句话描写了声音：门开的时候发出“长长的、慢慢的吱呀声”。这种声音就是 creak。"
        },
        "ex": [
          "The stairs creaked as we tiptoed down at midnight.",
          "The old rocking chair creaks every time Grandad sits in it."
        ],
        "syn": [
          "squeak",
          "groan"
        ],
        "ant": [],
        "dis": [
          "paint",
          "bake",
          "borrow"
        ],
        "cloze": {
          "s": "The old wooden floor ___ under our feet as we walked across the room.",
          "opts": [
            "pondered",
            "creaked",
            "glimpsed",
            "cherished"
          ],
          "a": 1
        }
      },
      "bewildered": {
        "word": "bewildered",
        "form": "bewildered",
        "pos": "adjective",
        "syll": "be·wil·dered",
        "zh": "困惑的；摸不着头脑的",
        "def": "very confused and not sure what is happening",
        "defZh": "非常困惑，不知道发生了什么的",
        "parts": "",
        "partsZh": "",
        "note": "",
        "noteZh": "",
        "guess": {
          "q": "In the story, **bewildered** most likely means",
          "opts": [
            "very confused",
            "very angry",
            "very sleepy",
            "very proud"
          ],
          "a": 0,
          "clue": "The question in the next sentence shows his thinking: ‘Where was the noise coming from?’ He had no idea, so he was confused.",
          "clueZh": "下一句的问句表现了他的想法：“声音是从哪里来的？”他完全不知道，所以很困惑。"
        },
        "ex": [
          "The bewildered tourist turned the map round and round.",
          "Mia looked bewildered when everyone shouted ‘Surprise!’"
        ],
        "syn": [
          "confused",
          "puzzled",
          "baffled"
        ],
        "ant": [
          "certain",
          "sure"
        ],
        "dis": [
          "rusty",
          "juicy",
          "wooden"
        ],
        "cloze": {
          "s": "The ___ puppy did not understand why its ball had disappeared.",
          "opts": [
            "bewildered",
            "vast",
            "ramshackle",
            "dormant"
          ],
          "a": 0
        }
      }
    },
    "skills": [
      {
        "id": "nouns-verbs",
        "kind": "grammar",
        "title": "Nouns and verbs",
        "titleZh": "名词和动词",
        "idea": "A **noun** names a person, place, thing or idea (girl, beach, kite, happiness). A **verb** is an action or being word (run, think, is). Some words can be either! Look at the job the word does in the sentence.",
        "ideaZh": "**名词**表示人、地点、事物或概念（girl、beach、kite、happiness）。**动词**表示动作或状态（run、think、is）。有些词既能当名词也能当动词！要看这个词在句子里起什么作用。",
        "points": [
          {
            "en": "Noun test: can you put ‘a’, ‘the’ or ‘my’ in front of it? (the beach, my kite)",
            "zh": "名词测试：能在它前面加 a、the 或 my 吗？（the beach、my kite）"
          },
          {
            "en": "Verb test: can you change its time? (I jump → I jumped → I will jump)",
            "zh": "动词测试：能改变它的时间吗？（I jump → I jumped → I will jump）"
          },
          {
            "en": "Proper nouns are the names of particular people and places. They start with a capital letter: Aroha, Wellington.",
            "zh": "专有名词是特定的人名、地名，首字母要大写：Aroha、Wellington。"
          },
          {
            "en": "The same word can change jobs: ‘I fish in the lake’ (verb) / ‘I caught a fish’ (noun).",
            "zh": "同一个词可以换“工作”：I fish in the lake（动词：钓鱼）/ I caught a fish（名词：鱼）。"
          }
        ],
        "examples": [
          {
            "en": "The **dog** chased the **ball** across the **park**.",
            "note": "Dog, ball and park are nouns — things and a place.",
            "noteZh": "dog、ball、park 都是名词——事物和地点。"
          },
          {
            "en": "Mia **laughed** and **ran** home.",
            "note": "Laughed and ran are verbs — they tell what Mia did.",
            "noteZh": "laughed 和 ran 是动词——说明 Mia 做了什么。"
          },
          {
            "en": "We **watch** the game. / My **watch** has stopped.",
            "note": "The first ‘watch’ is a verb (an action); the second is a noun (a thing on your wrist).",
            "noteZh": "第一个 watch 是动词（动作：观看）；第二个是名词（手表）。"
          }
        ],
        "tip": "Ask: is it a THING (noun) or something you DO (verb)? Then try the ‘the’ test or the time test.",
        "tipZh": "问自己：它是一样“东西”（名词）还是一个“动作”（动词）？再用 the 测试或时间测试检验。",
        "qs": [
          {
            "q": "Which word in this sentence is a verb? ‘The kitten slept on the warm mat.’",
            "opts": [
              "kitten",
              "slept",
              "warm",
              "mat"
            ],
            "a": 1,
            "why": "Slept is what the kitten did — an action. Kitten and mat are nouns; warm describes the mat.",
            "whyZh": "slept 是小猫做的事——一个动作。kitten 和 mat 是名词；warm 描述的是 mat。"
          },
          {
            "q": "In which sentence is ‘park’ a noun?",
            "opts": [
              "Dad will park the car.",
              "Please park here.",
              "We played in the park.",
              "They park near the shops."
            ],
            "a": 2,
            "why": "In ‘We played in the park’, park is a place (you can say ‘the park’). In the other sentences, park is an action.",
            "whyZh": "在 We played in the park 里，park 是一个地方（可以说 the park）。其他句子里 park 是一个动作（停车）。"
          },
          {
            "q": "Which word is a proper noun?",
            "opts": [
              "Rotorua",
              "city",
              "river",
              "mountain"
            ],
            "a": 0,
            "why": "Rotorua is the name of one particular place, so it is a proper noun with a capital letter. The others are common nouns.",
            "whyZh": "Rotorua 是一个特定地方的名字，所以是专有名词，要大写。其他是普通名词。"
          }
        ]
      },
      {
        "id": "adjectives-adverbs",
        "kind": "grammar",
        "title": "Adjectives and adverbs",
        "titleZh": "形容词和副词",
        "idea": "An **adjective** describes a noun: what kind or what it is like (a **red** kite, a **tiny** shell). An **adverb** describes a verb: how, when or where something happens (she ran **quickly**, we left **early**). Many adverbs end in -ly.",
        "ideaZh": "**形容词**修饰名词：说明是什么样的（a red kite、a tiny shell）。**副词**修饰动词：怎样、什么时候、在哪里发生（she ran quickly、we left early）。很多副词以 -ly 结尾。",
        "points": [
          {
            "en": "Find the noun, then the word that tells you about it: the tiny shell → tiny is an adjective.",
            "zh": "先找名词，再找描述它的词：the tiny shell → tiny 是形容词。"
          },
          {
            "en": "Find the verb, then ask how, when or where: he spoke softly → softly tells how he spoke, so it is an adverb.",
            "zh": "先找动词，再问“怎样、何时、何地”：he spoke softly → softly 说明他怎样说话，所以是副词。"
          },
          {
            "en": "Add -ly to many adjectives to make adverbs: quiet → quietly, obedient → obediently.",
            "zh": "很多形容词加 -ly 就变成副词：quiet → quietly，obedient → obediently。"
          },
          {
            "en": "Watch out: not every -ly word is an adverb (friendly and lovely are adjectives), and some adverbs have no -ly (fast, soon, here).",
            "zh": "注意：不是所有 -ly 结尾的词都是副词（friendly、lovely 是形容词），有些副词也不带 -ly（fast、soon、here）。"
          }
        ],
        "examples": [
          {
            "en": "The **boisterous** puppy chewed my **new** shoe.",
            "note": "Boisterous and new are adjectives — they describe the puppy and the shoe.",
            "noteZh": "boisterous 和 new 是形容词——分别描述小狗和鞋。"
          },
          {
            "en": "Biscuit sat **obediently** by the door.",
            "note": "Obediently is an adverb — it tells HOW Biscuit sat.",
            "noteZh": "obediently 是副词——说明 Biscuit 是怎样坐的。"
          },
          {
            "en": "We will leave **tomorrow** and walk **slowly**.",
            "note": "Tomorrow tells when and slowly tells how — both are adverbs.",
            "noteZh": "tomorrow 说明何时，slowly 说明怎样——都是副词。"
          }
        ],
        "tip": "Adjective → describes a THING. Adverb → describes an ACTION.",
        "tipZh": "形容词 → 描述“东西”。副词 → 描述“动作”。",
        "qs": [
          {
            "q": "Which word in this sentence is an adverb? ‘The weary hikers walked slowly up the hill.’",
            "opts": [
              "weary",
              "slowly",
              "hikers",
              "hill"
            ],
            "a": 1,
            "why": "Slowly tells HOW the hikers walked, so it is an adverb. Weary is an adjective describing the hikers.",
            "whyZh": "slowly 说明徒步者怎样走，所以是副词。weary 是形容词，描述徒步者。"
          },
          {
            "q": "Which word is an adjective? ‘A gentle breeze blew across the lake.’",
            "opts": [
              "breeze",
              "gentle",
              "blew",
              "across"
            ],
            "a": 1,
            "why": "Gentle describes the breeze (what kind of breeze?), so it is an adjective.",
            "whyZh": "gentle 描述微风（什么样的风？），所以是形容词。"
          },
          {
            "q": "Which word is NOT an adverb?",
            "opts": [
              "friendly",
              "quickly",
              "softly",
              "loudly"
            ],
            "a": 0,
            "why": "Friendly describes a person or thing (a friendly dog), so it is an adjective, even though it ends in -ly.",
            "whyZh": "friendly 描述人或事物（a friendly dog），所以虽然以 -ly 结尾，它是形容词。"
          }
        ]
      },
      {
        "id": "pronouns-determiners",
        "kind": "grammar",
        "title": "Pronouns and determiners",
        "titleZh": "代词和限定词",
        "idea": "A **pronoun** takes the place of a noun so we don’t repeat it (Mia → she, the kites → they). A **determiner** comes before a noun and tells us which one or how many (a, an, the, this, these, some, my, their).",
        "ideaZh": "**代词**代替名词，避免重复（Mia → she，the kites → they）。**限定词**放在名词前面，说明是哪一个或有多少（a、an、the、this、these、some、my、their）。",
        "points": [
          {
            "en": "Pronouns: I, you, he, she, it, we, they, me, him, her, us, them.",
            "zh": "代词：I、you、he、she、it、we、they、me、him、her、us、them。"
          },
          {
            "en": "Use ‘an’ before a vowel SOUND: an apple, an hour; but a unicorn (it starts with a ‘y’ sound).",
            "zh": "元音“发音”前用 an：an apple、an hour；但是 a unicorn（因为它以“y”的音开头）。"
          },
          {
            "en": "this and that go with one thing; these and those go with more than one: this shell, these shells.",
            "zh": "this 和 that 配一个东西；these 和 those 配多个：this shell、these shells。"
          },
          {
            "en": "My, your, his, her, our and their are determiners when a noun follows: their bikes.",
            "zh": "my、your、his、her、our、their 后面跟名词时是限定词：their bikes。"
          }
        ],
        "examples": [
          {
            "en": "Sione found a shell. **He** gave **it** to Nana.",
            "note": "He replaces Sione; it replaces the shell.",
            "noteZh": "He 代替 Sione；it 代替 the shell。"
          },
          {
            "en": "**These** apples are sweeter than **that** one.",
            "note": "These goes with more than one apple; that goes with one.",
            "noteZh": "these 配多个苹果；that 配一个。"
          },
          {
            "en": "We waited **an** hour for **the** bus.",
            "note": "An (not a) because hour starts with a vowel sound: it sounds like ‘our’.",
            "noteZh": "用 an 而不是 a，因为 hour 的发音以元音开头（读起来像 our）。"
          }
        ],
        "tip": "To check a pronoun, ask: which noun is it standing in for?",
        "tipZh": "检查代词时问自己：它代替的是哪个名词？",
        "qs": [
          {
            "q": "Which word is a pronoun? ‘Hana fed the ducks because they looked hungry.’",
            "opts": [
              "Hana",
              "ducks",
              "hungry",
              "they"
            ],
            "a": 3,
            "why": "They replaces ‘the ducks’, so it is a pronoun.",
            "whyZh": "they 代替了 the ducks，所以是代词。"
          },
          {
            "q": "Which word correctly completes the sentence? ‘I ate ___ orange at lunch.’",
            "opts": [
              "a",
              "an",
              "these",
              "those"
            ],
            "a": 1,
            "why": "Orange starts with a vowel sound, so we use an. These and those are for more than one thing.",
            "whyZh": "orange 以元音音开头，所以用 an。these 和 those 用于多个东西。"
          },
          {
            "q": "Which sentence uses the correct determiner?",
            "opts": [
              "Those book is mine.",
              "These puppies are cute.",
              "This shoes are wet.",
              "That apples are red."
            ],
            "a": 1,
            "why": "Puppies means more than one, so ‘these’ is correct. The other sentences mix a word for one thing with a word for many.",
            "whyZh": "puppies 是复数（多于一个），所以用 these 正确。其他句子把表示单数的词和复数的词混在一起了。"
          }
        ]
      },
      {
        "id": "prepositions-conjunctions",
        "kind": "grammar",
        "title": "Prepositions and conjunctions",
        "titleZh": "介词和连词",
        "idea": "A **preposition** shows where or when something is, linking a noun to the rest of the sentence (under the bed, after lunch). A **conjunction** joins words or ideas together (and, but, or, so, because, although, when).",
        "ideaZh": "**介词**表示位置或时间，把名词和句子的其他部分连起来（under the bed、after lunch）。**连词**把词语或想法连接起来（and、but、or、so、because、although、when）。",
        "points": [
          {
            "en": "Common prepositions: in, on, under, behind, between, through, across, before, after, during.",
            "zh": "常见介词：in、on、under、behind、between、through、across、before、after、during。"
          },
          {
            "en": "Joining conjunctions: and (adds), but (contrasts), or (gives a choice), so (shows a result).",
            "zh": "并列连词：and（补充）、but（转折）、or（选择）、so（结果）。"
          },
          {
            "en": "Because, although, when, if and while start a part of a sentence that cannot stand alone.",
            "zh": "because、although、when、if、while 引出的部分不能单独成句。"
          },
          {
            "en": "Conjunctions are reading clues: ‘but’ and ‘although’ warn you that something different is coming.",
            "zh": "连词也是阅读线索：but 和 although 提醒你后面要出现不一样的内容。"
          }
        ],
        "examples": [
          {
            "en": "The cat hid **under** the table **during** the storm.",
            "note": "Under (where) and during (when) are prepositions.",
            "noteZh": "under（哪里）和 during（何时）是介词。"
          },
          {
            "en": "I was tired, **but** I finished my homework.",
            "note": "But joins two ideas that contrast.",
            "noteZh": "but 连接两个相反的意思。"
          },
          {
            "en": "We stayed inside **because** it was raining.",
            "note": "Because tells the reason.",
            "noteZh": "because 说明原因。"
          }
        ],
        "tip": "Prepositions often answer ‘where?’ or ‘when?’. Conjunctions join — think of them as glue.",
        "tipZh": "介词常回答“在哪里？”或“什么时候？”。连词起连接作用——把它们想象成胶水。",
        "qs": [
          {
            "q": "Which word is a preposition? ‘The kite flew over the trees.’",
            "opts": [
              "kite",
              "over",
              "flew",
              "trees"
            ],
            "a": 1,
            "why": "Over shows where the kite flew, linking it to ‘the trees’. It is a preposition.",
            "whyZh": "over 表示风筝飞到哪里，把它和 the trees 连起来。它是介词。"
          },
          {
            "q": "Which conjunction best completes the sentence? ‘Tama was nervous, ___ he still sang on stage.’",
            "opts": [
              "but",
              "because",
              "so",
              "or"
            ],
            "a": 0,
            "why": "Being nervous and still singing are a contrast, so ‘but’ fits.",
            "whyZh": "紧张和仍然上台唱歌是转折关系，所以用 but。"
          },
          {
            "q": "Which conjunction shows a REASON?",
            "opts": [
              "because",
              "and",
              "or",
              "but"
            ],
            "a": 0,
            "why": "Because introduces a reason: ‘We went inside because it was cold.’",
            "whyZh": "because 引出原因：We went inside because it was cold.（因为冷，我们进屋了。）"
          }
        ]
      },
      {
        "id": "clauses",
        "kind": "grammar",
        "title": "Main and subordinate clauses",
        "titleZh": "主句和从句",
        "idea": "A **clause** is a group of words with a subject and a verb. A **main clause** makes sense on its own. A **subordinate clause** starts with a word like because, when, although, if or while. It cannot stand alone — it leaves you waiting.",
        "ideaZh": "**分句**是一组含有主语和动词的词。**主句**自己就能表达完整的意思。**从句**以 because、when、although、if、while 等词开头，不能单独成句——会让人觉得话还没说完。",
        "points": [
          {
            "en": "Cover-half trick: hide one part. Does the other part make a complete sentence by itself? Then it is the main clause.",
            "zh": "遮一半技巧：遮住一部分，剩下的部分自己能成为完整的句子吗？能，就是主句。"
          },
          {
            "en": "A subordinate clause can come first or last: ‘When it rained, we went inside.’ / ‘We went inside when it rained.’",
            "zh": "从句可以放在前面，也可以放在后面：When it rained, we went inside. / We went inside when it rained."
          },
          {
            "en": "When the subordinate clause comes first, put a comma after it.",
            "zh": "从句放在前面时，后面要加逗号。"
          }
        ],
        "examples": [
          {
            "en": "**Although it was raining**, we played outside.",
            "note": "‘We played outside’ works on its own, so it is the main clause. ‘Although it was raining’ leaves you asking ‘then what?’ — it is the subordinate clause.",
            "noteZh": "we played outside 自己就能成句，所以是主句。Although it was raining 让人想问“然后呢？”——它是从句。"
          },
          {
            "en": "**Sam ate his lunch quickly** because he wanted to play soccer.",
            "note": "The main clause is ‘Sam ate his lunch quickly’.",
            "noteZh": "主句是 Sam ate his lunch quickly。"
          },
          {
            "en": "If you finish early, **you can read a book**.",
            "note": "‘You can read a book’ makes sense alone — it is the main clause.",
            "noteZh": "you can read a book 自己能成句——它是主句。"
          }
        ],
        "tip": "Subordinate clauses often begin with: because, when, if, although, while, after, before, until.",
        "tipZh": "从句常以这些词开头：because、when、if、although、while、after、before、until。",
        "qs": [
          {
            "q": "What is the main clause? ‘When the bell rang, the children lined up.’",
            "opts": [
              "the children lined up",
              "When the bell rang",
              "When the bell",
              "rang, the children"
            ],
            "a": 0,
            "why": "‘The children lined up’ makes sense on its own. ‘When the bell rang’ leaves you waiting for more.",
            "whyZh": "the children lined up 自己能成句。When the bell rang 让人等着听后面的话。"
          },
          {
            "q": "Which is a subordinate clause?",
            "opts": [
              "Leo ran to school",
              "the dog barked",
              "because the bus was late",
              "we ate pizza"
            ],
            "a": 2,
            "why": "‘Because the bus was late’ cannot stand alone — it starts with ‘because’ and leaves the idea unfinished.",
            "whyZh": "because the bus was late 不能单独成句——它以 because 开头，意思没说完。"
          },
          {
            "q": "Which sentence has a subordinate clause?",
            "opts": [
              "We swam until it got dark.",
              "The sun is hot.",
              "I like apples and pears.",
              "Mia sings well."
            ],
            "a": 0,
            "why": "‘Until it got dark’ is a subordinate clause added to the main clause ‘We swam’.",
            "whyZh": "until it got dark 是从句，跟在主句 We swam 后面。"
          }
        ]
      },
      {
        "id": "contractions-apostrophes",
        "kind": "grammar",
        "title": "Contractions and apostrophes",
        "titleZh": "缩写和撇号",
        "idea": "An **apostrophe** (’) has two jobs. In a **contraction** it shows where letters are missing (do not → don’t). For **possession** it shows that something belongs to someone (Mia’s bag). Watch out for sound-alike words: it’s/its and they’re/their/there.",
        "ideaZh": "**撇号**（’）有两个作用。在**缩写**里，它表示省略了字母（do not → don’t）。表示**所属**时，它说明某样东西属于某人（Mia’s bag）。注意发音相同的词：it’s/its、they’re/their/there。",
        "points": [
          {
            "en": "Contractions: can’t = cannot, won’t = will not, I’m = I am, we’ll = we will, they’ve = they have.",
            "zh": "常见缩写：can’t = cannot，won’t = will not，I’m = I am，we’ll = we will，they’ve = they have。"
          },
          {
            "en": "it’s = it is or it has. its = belonging to it, with no apostrophe: ‘The dog wagged its tail.’",
            "zh": "it’s = it is 或 it has。its = 它的，没有撇号：The dog wagged its tail."
          },
          {
            "en": "they’re = they are; their = belonging to them; there = a place (over there).",
            "zh": "they’re = they are；their = 他们的；there = 那里（over there）。"
          },
          {
            "en": "One owner: the girl’s hat. More than one owner ending in s: the girls’ hats.",
            "zh": "一个主人：the girl’s hat。以 s 结尾的多个主人：the girls’ hats。"
          }
        ],
        "examples": [
          {
            "en": "**It’s** raining, so the cat is licking **its** paws inside.",
            "note": "It’s = it is. Its = belonging to the cat.",
            "noteZh": "It’s = it is。its = 猫的。"
          },
          {
            "en": "**They’re** putting **their** bags over **there**.",
            "note": "They are / belonging to them / a place.",
            "noteZh": "他们正在 / 他们的 / 那里。"
          },
          {
            "en": "**Hana’s** bike has a flat tyre.",
            "note": "The apostrophe and s show the bike belongs to Hana.",
            "noteZh": "撇号加 s 表示自行车是 Hana 的。"
          }
        ],
        "tip": "Test it’s by saying ‘it is’ or ‘it has’ instead. If the sentence still works, use it’s; if not, use its.",
        "tipZh": "测试 it’s：把它换成 it is 或 it has 读一读。句子还通顺就用 it’s，不通顺就用 its。",
        "qs": [
          {
            "q": "What is the full form of ‘won’t’?",
            "opts": [
              "was not",
              "would not",
              "want not",
              "will not"
            ],
            "a": 3,
            "why": "Won’t is the contraction of will not. (Would not is wouldn’t.)",
            "whyZh": "won’t 是 will not 的缩写。（would not 的缩写是 wouldn’t。）"
          },
          {
            "q": "Which word correctly completes the sentence? ‘The bird built ___ nest in the tree.’",
            "opts": [
              "it’s",
              "its’",
              "it is",
              "its"
            ],
            "a": 3,
            "why": "The nest belongs to the bird, so we need its, with no apostrophe. ‘It is nest’ doesn’t make sense.",
            "whyZh": "鸟巢属于这只鸟，所以用 its（没有撇号）。说 it is nest 不通。"
          },
          {
            "q": "Which sentence is correct?",
            "opts": [
              "Their going to the beach.",
              "They’re going to the beach.",
              "There going to the beach.",
              "Theyre going to the beach."
            ],
            "a": 1,
            "why": "They’re = they are: ‘They are going to the beach.’",
            "whyZh": "They’re = they are：They are going to the beach.（他们要去海滩。）"
          }
        ]
      },
      {
        "id": "tenses-agreement",
        "kind": "grammar",
        "title": "Verb tenses and agreement",
        "titleZh": "动词时态和主谓一致",
        "idea": "Verbs change to show **when** something happens: past (walked), present (walk) or future (will walk). Many past tense verbs end in -ed, but irregular verbs change in other ways (go → went). The verb must also **agree** with its subject: he walks, they walk.",
        "ideaZh": "动词会变化，表示事情**什么时候**发生：过去（walked）、现在（walk）、将来（will walk）。很多过去式以 -ed 结尾，但不规则动词有别的变化（go → went）。动词还要和主语**一致**：he walks，they walk。",
        "points": [
          {
            "en": "Irregular past tense: go → went, see → saw, catch → caught, swim → swam, bring → brought.",
            "zh": "不规则过去式：go → went，see → saw，catch → caught，swim → swam，bring → brought。"
          },
          {
            "en": "Present tense with he, she, it or one person or thing: add -s (Mia runs). With I, you, we or they: no -s (they run).",
            "zh": "一般现在时：主语是 he、she、it 或一个人、一样东西时加 -s（Mia runs）；主语是 I、you、we、they 时不加（they run）。"
          },
          {
            "en": "Keep the same tense in a story unless the time really changes.",
            "zh": "写故事时保持同一个时态，除非时间真的变了。"
          },
          {
            "en": "was and were: I was, he was, we were, they were.",
            "zh": "was 和 were：I was，he was，we were，they were。"
          }
        ],
        "examples": [
          {
            "en": "Yesterday we **caught** three fish.",
            "note": "Caught is the irregular past tense of catch (not ‘catched’).",
            "noteZh": "caught 是 catch 的不规则过去式（不是 catched）。"
          },
          {
            "en": "My brother **plays** guitar, and my sisters **play** drums.",
            "note": "Brother (one) → plays; sisters (more than one) → play.",
            "noteZh": "brother（一个）→ plays；sisters（多个）→ play。"
          },
          {
            "en": "Tomorrow the class **will visit** the museum.",
            "note": "Will + verb shows the future.",
            "noteZh": "will + 动词表示将来。"
          }
        ],
        "tip": "Read the sentence aloud — wrong verb forms often sound odd (‘they was’, ‘he go’).",
        "tipZh": "把句子大声读出来——用错的动词形式往往听起来很别扭（they was、he go）。",
        "qs": [
          {
            "q": "Which word correctly completes the sentence? ‘Last week, Leo ___ a huge fish.’",
            "opts": [
              "caught",
              "catch",
              "catches",
              "catched"
            ],
            "a": 0,
            "why": "‘Last week’ means the past, and the past tense of catch is caught.",
            "whyZh": "Last week 表示过去，catch 的过去式是 caught。"
          },
          {
            "q": "Which sentence is correct?",
            "opts": [
              "The dogs barks loudly.",
              "The dogs bark loudly.",
              "The dog bark loudly.",
              "The dog are barking."
            ],
            "a": 1,
            "why": "Dogs means more than one, so the verb is bark, with no -s.",
            "whyZh": "dogs 是复数，所以动词用 bark，不加 -s。"
          },
          {
            "q": "Which word completes the sentence? ‘We ___ at the beach when it started to rain.’",
            "opts": [
              "was",
              "is",
              "be",
              "were"
            ],
            "a": 3,
            "why": "We takes were in the past: we were.",
            "whyZh": "主语是 we 时，be 动词过去式用 were：we were。"
          }
        ]
      },
      {
        "id": "punctuation",
        "kind": "grammar",
        "title": "Punctuation: commas, speech marks, ? and !",
        "titleZh": "标点：逗号、引号、问号和感叹号",
        "idea": "Punctuation helps readers. **Commas** separate items in a list and follow an opening phrase. **Speech marks** go around the exact words someone says. A **question mark** ends a question, and an **exclamation mark** shows strong feeling.",
        "ideaZh": "标点帮助读者理解。**逗号**隔开列举的项目，也放在开头的短语后面。**引号**括住某人说的原话。**问号**用在问句末尾，**感叹号**表示强烈的感情。",
        "points": [
          {
            "en": "List commas: We packed towels, sunscreen, hats and snacks. (In most NZ writing, there is no comma before ‘and’.)",
            "zh": "列举用逗号：We packed towels, sunscreen, hats and snacks.（新西兰的写法通常在 and 前面不加逗号。）"
          },
          {
            "en": "Speech marks go around the spoken words only. The punctuation of the speech goes inside: ‘Watch out!’ yelled Ben.",
            "zh": "引号只括住说出来的话，说话内容的标点放在引号里面：‘Watch out!’ yelled Ben."
          },
          {
            "en": "Start a new line each time a new person speaks.",
            "zh": "每换一个人说话就另起一行。"
          },
          {
            "en": "A comma follows an opening word or phrase: After lunch, we went swimming.",
            "zh": "开头的词或短语后面加逗号：After lunch, we went swimming."
          }
        ],
        "examples": [
          {
            "en": "**‘Where are my shoes?’** asked Mia.",
            "note": "Mia’s question goes inside the speech marks, together with its question mark.",
            "noteZh": "Mia 问的话放在引号里面，问号也在引号里面。"
          },
          {
            "en": "We saw **kea, tūī, fantails and a kererū**.",
            "note": "Commas separate the birds in the list.",
            "noteZh": "逗号把列举的鸟名隔开。"
          },
          {
            "en": "**What a huge wave!**",
            "note": "The exclamation mark shows surprise or strong feeling.",
            "noteZh": "感叹号表示惊讶或强烈的感情。"
          }
        ],
        "tip": "Read your writing aloud: a short pause often needs a comma, and a question in your voice needs a question mark.",
        "tipZh": "把自己写的读出来：短暂停顿的地方常常需要逗号；读成问句的地方需要问号。",
        "qs": [
          {
            "q": "Which sentence is punctuated correctly?",
            "opts": [
              "‘Can I come too’? asked Leo.",
              "Can I come too? ‘asked Leo.’",
              "‘Can I come too, asked Leo?’",
              "‘Can I come too?’ asked Leo."
            ],
            "a": 3,
            "why": "The spoken words and their question mark go inside the speech marks.",
            "whyZh": "说出来的话和它的问号都要放在引号里面。"
          },
          {
            "q": "Where is the comma needed? ‘After the game we had pizza.’",
            "opts": [
              "after ‘After’",
              "after ‘game’",
              "after ‘had’",
              "after ‘pizza’"
            ],
            "a": 1,
            "why": "‘After the game’ is an opening phrase, so the comma goes after it: ‘After the game, we had pizza.’",
            "whyZh": "After the game 是开头的短语，所以逗号加在它后面：After the game, we had pizza."
          },
          {
            "q": "Which sentence should end with an exclamation mark?",
            "opts": [
              "What time is it",
              "I live in Hamilton",
              "Wow, that was amazing",
              "Please pass the salt"
            ],
            "a": 2,
            "why": "‘Wow, that was amazing’ shows strong feeling, so it needs an exclamation mark. ‘What time is it’ needs a question mark.",
            "whyZh": "Wow, that was amazing 表达强烈的感情，所以要用感叹号。What time is it 需要问号。"
          }
        ]
      },
      {
        "id": "main-idea",
        "kind": "reading",
        "title": "Main idea and summarising",
        "titleZh": "主旨和概括",
        "idea": "The **main idea** is what a whole paragraph or text is mostly about. Details support it. A **summary** retells the most important ideas in a few words and in your own words. It leaves out the small details.",
        "ideaZh": "**主旨**是一段话或一篇文章主要讲什么，细节用来支持主旨。**概括**就是用自己的话、用几句话说出最重要的内容，省略小细节。",
        "points": [
          {
            "en": "Ask: what is this mostly about? Look for the idea that most sentences talk about.",
            "zh": "问自己：这主要在讲什么？找大部分句子都在谈的那个意思。"
          },
          {
            "en": "The first or last sentence of a paragraph often states the main idea.",
            "zh": "一段的第一句或最后一句常常点明主旨。"
          },
          {
            "en": "A good summary answers: who, what happened and how it ended — in one or two sentences.",
            "zh": "好的概括要回答：谁、发生了什么、结果怎样——用一两句话。"
          },
          {
            "en": "Wrong summary answers are often TOO SMALL (only one detail) or NOT IN THE TEXT.",
            "zh": "错误的概括选项往往“太小”（只是一个细节），或者“文中没有”。"
          }
        ],
        "examples": [
          {
            "en": "**Kiwi are unusual birds.** They cannot fly, they have nostrils at the tip of their beaks and they lay huge eggs.",
            "note": "The first sentence is the main idea; the rest are details that prove it.",
            "noteZh": "第一句是主旨；后面都是证明它的细节。"
          },
          {
            "en": "Story: Leo’s kitten was missing, he searched everywhere and he found her asleep in the laundry basket. **Summary: Leo searched for his lost kitten and found her.**",
            "note": "The summary keeps the big events and drops details like the socks and towels.",
            "noteZh": "概括保留主要事件，省略袜子、毛巾这类细节。"
          },
          {
            "en": "Detail: ‘The fair had a Ferris wheel.’ **Main idea: ‘The school fair was full of fun things to do.’**",
            "note": "The detail is one small part; the main idea covers everything.",
            "noteZh": "细节只是一小部分；主旨涵盖全部内容。"
          }
        ],
        "tip": "Try the 10-word challenge: can you say what the text is about in 10 words or fewer?",
        "tipZh": "试试“十个词挑战”：能用十个词以内说出文章讲什么吗？",
        "qs": [
          {
            "q": "Read: ‘Bees are very useful. They make honey, and they carry pollen between flowers so plants can make seeds.’ What is the main idea?",
            "opts": [
              "Bees make honey.",
              "Flowers make seeds.",
              "Pollen is yellow.",
              "Bees are very useful."
            ],
            "a": 3,
            "why": "‘Bees are very useful’ is what the whole text is about. Making honey and carrying pollen are details that show it.",
            "whyZh": "Bees are very useful 是整段话讲的内容。酿蜜和传粉是证明它的细节。"
          },
          {
            "q": "Read: ‘Aroha wanted a puppy. She saved her pocket money for a year, did extra chores and read books about dogs.’ Which is the best summary?",
            "opts": [
              "Aroha read books about dogs.",
              "Aroha did extra chores once.",
              "Aroha worked hard to get a puppy.",
              "Puppies cost a lot of money."
            ],
            "a": 2,
            "why": "This answer covers the whole text: what Aroha wanted and what she did to get it. The other choices are single details or not in the text.",
            "whyZh": "这个选项概括了全文：Aroha 想要什么、为此做了什么。其他选项只是单个细节，或者文中没有。"
          },
          {
            "q": "A good summary should…",
            "opts": [
              "include every small detail",
              "be longer than the text",
              "tell the most important ideas briefly",
              "copy the first sentence only"
            ],
            "a": 2,
            "why": "A summary is short and keeps only the most important ideas.",
            "whyZh": "概括要简短，只保留最重要的内容。"
          }
        ]
      },
      {
        "id": "evidence",
        "kind": "reading",
        "title": "Finding evidence: Question → Find → Prove",
        "titleZh": "找证据：问题 → 查找 → 证明",
        "idea": "In reading tests, never answer from memory. Use three steps: read the **Question** carefully, **Find** the part of the text it is about, then **Prove** your answer with words from the text. Always ask: ‘What in the text proves my answer?’",
        "ideaZh": "做阅读题时，不要凭印象答题。用三步法：仔细读**问题**，回到原文**查找**相关部分，再用原文的话**证明**你的答案。一定要问自己：“文章里的什么内容能证明我的答案？”",
        "points": [
          {
            "en": "Question: underline the key words (who, why, which sentence shows…).",
            "zh": "问题：划出关键词（谁、为什么、哪句话说明……）。"
          },
          {
            "en": "Find: go back to the text and scan for those key words or ideas.",
            "zh": "查找：回到原文，快速寻找这些关键词或相关内容。"
          },
          {
            "en": "Prove: choose the answer you can point to in the text. If you can’t prove it, it is probably wrong.",
            "zh": "证明：选择能在原文里找到依据的答案。如果证明不了，它很可能是错的。"
          },
          {
            "en": "Do this for EVERY question, even near the end of a long test.",
            "zh": "每道题都要这样做，即使是在长长的考试的最后几题。"
          }
        ],
        "examples": [
          {
            "en": "Q: How did Biscuit feel about going into puppy school? Evidence: **‘He sat down at the door and would not move.’**",
            "note": "This sentence proves he did not want to go in.",
            "noteZh": "这句话证明它不想进去。"
          },
          {
            "en": "Q: Was the crown kept safe? Evidence: **‘the crown is encased in a thick glass box’**.",
            "note": "The glass box is the proof that it was protected.",
            "noteZh": "玻璃罩就是它受到保护的证据。"
          },
          {
            "en": "Q: Is ‘Ben was angry with Biscuit’ true? The text says **‘Ben was very proud of him’**.",
            "note": "The evidence shows proud, not angry — so that answer is wrong.",
            "noteZh": "证据显示的是骄傲，不是生气——所以那个答案是错的。"
          }
        ],
        "tip": "Put your finger on the proof. No proof = not the answer.",
        "tipZh": "用手指指出证据。没有证据 = 不是答案。",
        "qs": [
          {
            "q": "Read: ‘Mia walked onto the stage in her blue dress. Her hands shook as she held the microphone.’ Which words prove Mia was nervous?",
            "opts": [
              "‘walked onto the stage’",
              "‘in her blue dress’",
              "‘held the microphone’",
              "‘Her hands shook’"
            ],
            "a": 3,
            "why": "Shaking hands are a sign of nerves. The other words only tell where she was, what she wore and what she held.",
            "whyZh": "手发抖是紧张的表现。其他词只说明她在哪里、穿什么、拿着什么。"
          },
          {
            "q": "What is the FIRST step when you answer a reading question?",
            "opts": [
              "Read the question carefully",
              "Guess quickly",
              "Pick the longest answer",
              "Skip to the next question"
            ],
            "a": 0,
            "why": "Step 1 is the Question: read it carefully and underline the key words. Then Find and Prove.",
            "whyZh": "第一步是读问题：仔细读，划出关键词。然后查找、证明。"
          },
          {
            "q": "Read: ‘The shop opens at 9 am. On Sundays it opens at 10 am.’ Ben says it always opens at 9 am. Which words prove he is wrong?",
            "opts": [
              "‘The shop opens’",
              "‘at 9 am’",
              "‘On Sundays it opens at 10 am’",
              "‘The shop’"
            ],
            "a": 2,
            "why": "This part shows the shop does NOT always open at 9 am — on Sundays it opens at 10 am.",
            "whyZh": "这部分说明商店并不总是 9 点开门——星期天是 10 点。"
          }
        ]
      },
      {
        "id": "inference",
        "kind": "reading",
        "title": "Inference: reading between the lines",
        "titleZh": "推断：读出言外之意",
        "idea": "Writers don’t always tell you everything. An **inference** is a smart guess you make by putting together **clues in the text** and **what you already know**. If a character slams the door and won’t talk, you can infer that they are angry.",
        "ideaZh": "作者不会把所有事情都直接告诉你。**推断**就是把**文中的线索**和**你已经知道的知识**结合起来，做出合理的判断。如果一个人物摔门、不说话，你就能推断他生气了。",
        "points": [
          {
            "en": "Look for clues: actions, words, feelings, the setting and the weather.",
            "zh": "寻找线索：动作、说的话、感受、环境和天气。"
          },
          {
            "en": "Add what you know from real life: what do people usually do when they feel that way?",
            "zh": "加上生活常识：人们有这种感受时通常会怎么做？"
          },
          {
            "en": "Check: is your inference supported by the text? It must be, even though it isn’t stated directly.",
            "zh": "检查：你的推断有文中的依据吗？虽然文中没有直接说，但一定要有依据。"
          },
          {
            "en": "Wrong answers in inference questions are often too extreme or not supported at all.",
            "zh": "推断题的错误选项常常太绝对，或者完全没有依据。"
          }
        ],
        "examples": [
          {
            "en": "Sione’s umbrella dripped on the floor and his shoes squelched. → **It was raining outside.**",
            "note": "The text never says ‘raining’, but the clues prove it.",
            "noteZh": "文中从没说“下雨”，但线索证明了这一点。"
          },
          {
            "en": "Hana checked the clock again and tapped her foot. → **She was impatient, waiting for something.**",
            "note": "Checking the time and tapping are clues for waiting.",
            "noteZh": "一再看时间、用脚打拍子是等待的线索。"
          },
          {
            "en": "Grandad smiled as he read the card, then wiped his eyes. → **He was touched — happy enough to cry.**",
            "note": "Smiling and wiping your eyes together mean happy tears, not sadness.",
            "noteZh": "一边微笑一边擦眼睛，说明是高兴得流泪，不是伤心。"
          }
        ],
        "tip": "Use this sentence frame: ‘I think … because the text says …’",
        "tipZh": "用这个句式：I think …（我认为……）because the text says …（因为文中说……）",
        "qs": [
          {
            "q": "Read: ‘Ben looked at the empty plate and the bits of sausage on the dog’s nose.’ What can you infer?",
            "opts": [
              "Ben ate the sausage.",
              "The plate was broken.",
              "The dog ate the sausage.",
              "The dog was asleep."
            ],
            "a": 2,
            "why": "The plate is empty and there are bits of sausage on the dog’s nose, so the dog most likely ate it.",
            "whyZh": "盘子空了，狗的鼻子上沾着香肠渣，所以很可能是狗吃了。"
          },
          {
            "q": "Read: ‘Priya pulled her coat tighter and watched her breath make little clouds.’ What is the weather most likely like?",
            "opts": [
              "a hot summer day",
              "a cold winter day",
              "a warm spring day",
              "a sunny beach day"
            ],
            "a": 1,
            "why": "Pulling a coat tighter and seeing your breath are clues that it is very cold.",
            "whyZh": "把外套裹紧、能看见自己呼出的白气，都是天气很冷的线索。"
          },
          {
            "q": "Read: ‘When the teacher announced a surprise test, the room went silent and Leo’s face went pale.’ How did Leo most likely feel?",
            "opts": [
              "excited",
              "worried",
              "bored",
              "proud"
            ],
            "a": 1,
            "why": "A pale face and a silent room after hearing about a surprise test show worry.",
            "whyZh": "听说要突击测验，教室一下子安静了，Leo 脸色发白，这些都说明他很担心。"
          }
        ]
      },
      {
        "id": "words-in-context",
        "kind": "reading",
        "title": "Words in context: the clue types",
        "titleZh": "根据上下文猜词：线索类型",
        "idea": "When you meet a hard word, don’t skip it — be a word detective. Look at the words around it for clues. Four common clues are **definition**, **synonym**, **contrast** and **example**. Then put your guess into the sentence to check that it makes sense.",
        "ideaZh": "遇到难词不要跳过——做个“词语侦探”。看看它周围的词有什么线索。四种常见线索是**定义**、**同义词**、**对比**和**举例**。然后把猜的意思放回句子里，检查是否通顺。",
        "points": [
          {
            "en": "Definition clue: the meaning is given right there: ‘the summit, the very top of the mountain’.",
            "zh": "定义线索：意思就直接写在旁边：the summit, the very top of the mountain（顶峰，也就是山的最高处）。"
          },
          {
            "en": "Synonym clue: a word with the same meaning is nearby: ‘It was peculiar. It was strange.’",
            "zh": "同义词线索：附近有意思相同的词：It was peculiar. It was strange."
          },
          {
            "en": "Contrast clue: but, however or although shows the opposite: ‘The sheds blew away, but the lighthouse stood steadfast.’",
            "zh": "对比线索：but、however、although 表示相反：小屋被吹走了，但灯塔 steadfast（屹立不倒）。"
          },
          {
            "en": "Example clue: examples show the meaning: ‘He was boisterous: he barked, jumped and raced around.’",
            "zh": "举例线索：用例子说明意思：He was boisterous: he barked, jumped and raced around."
          },
          {
            "en": "Also try breaking the word into parts: en + case = put into a case.",
            "zh": "还可以拆词：en + case = 放进盒子里。"
          }
        ],
        "examples": [
          {
            "en": "The path was treacherous — **so dangerous that two hikers slipped**.",
            "note": "Definition clue: treacherous means very dangerous.",
            "noteZh": "定义线索：treacherous 的意思是非常危险的。"
          },
          {
            "en": "Mum was frugal, **but Dad liked to spend money**.",
            "note": "Contrast clue: frugal is the opposite of liking to spend — it means careful with money.",
            "noteZh": "对比线索：frugal 和“喜欢花钱”相反——意思是节俭的。"
          },
          {
            "en": "Nocturnal animals, **such as owls, bats and possums**, come out at night.",
            "note": "Example clue: owls, bats and possums are all awake at night.",
            "noteZh": "举例线索：猫头鹰、蝙蝠和负鼠都是晚上活动的。"
          }
        ],
        "tip": "Swap test: put your guessed meaning in place of the hard word. If the sentence still makes sense, you are probably right.",
        "tipZh": "替换测试：把你猜的意思放到难词的位置上。句子仍然通顺，你多半猜对了。",
        "qs": [
          {
            "q": "‘Unlike his gregarious sister, who loved parties, Tom liked to be alone.’ What does gregarious most likely mean?",
            "opts": [
              "liking to be with other people",
              "shy and quiet",
              "very tall",
              "good at maths"
            ],
            "a": 0,
            "why": "‘Unlike’ is a contrast clue. Tom liked to be alone, so his sister, who loved parties, liked being with people.",
            "whyZh": "unlike 是对比线索。Tom 喜欢独处，所以爱参加聚会的姐姐（或妹妹）喜欢和别人在一起。"
          },
          {
            "q": "‘The soup was scalding — so hot that it burnt my tongue.’ Which type of clue helps you?",
            "opts": [
              "a contrast clue",
              "an example clue",
              "a definition clue",
              "there is no clue"
            ],
            "a": 2,
            "why": "The words after the dash tell you exactly what scalding means: so hot that it burns.",
            "whyZh": "破折号后面的话直接说明了 scalding 的意思：烫得能把舌头烫伤。"
          },
          {
            "q": "‘Sione was famished, so he ate three sandwiches and a banana.’ What does famished most likely mean?",
            "opts": [
              "very full",
              "very sleepy",
              "very hungry",
              "very angry"
            ],
            "a": 2,
            "why": "Eating three sandwiches and a banana shows he was very hungry. ‘So’ shows cause and effect.",
            "whyZh": "吃了三个三明治和一根香蕉，说明他非常饿。so 表示因果关系。"
          }
        ]
      },
      {
        "id": "purpose-viewpoint",
        "kind": "reading",
        "title": "Author’s purpose and point of view",
        "titleZh": "作者目的和观点",
        "idea": "Authors write for a **purpose**: to **inform** (give facts), to **persuade** (make you agree or buy), to **entertain** (tell a story or make you laugh) or to **instruct** (tell you how to do something). Their **point of view** is what they think. A **fact** can be checked; an **opinion** is what someone believes.",
        "ideaZh": "作者写作都有**目的**：**告知**（提供事实）、**说服**（让你同意或购买）、**娱乐**（讲故事、逗你笑）或**指导**（告诉你怎样做一件事）。作者的**观点**就是他们的看法。**事实**可以核实；**观点**是某人的看法。",
        "points": [
          {
            "en": "Inform: reports and news — facts, numbers and headings.",
            "zh": "告知：报告、新闻——有事实、数字和小标题。"
          },
          {
            "en": "Persuade: adverts, reviews and letters to the editor — words like best, must, should and amazing.",
            "zh": "说服：广告、评论、读者来信——常用 best、must、should、amazing 这类词。"
          },
          {
            "en": "Entertain: stories, poems and jokes — characters, feelings and surprises.",
            "zh": "娱乐：故事、诗歌、笑话——有人物、感受和惊喜。"
          },
          {
            "en": "Instruct: recipes and how-to guides — steps and commands.",
            "zh": "指导：食谱、操作指南——有步骤和命令句。"
          },
          {
            "en": "Opinion signal words: I think, best, worst, beautiful, should, in my opinion.",
            "zh": "表示观点的信号词：I think、best、worst、beautiful、should、in my opinion。"
          }
        ],
        "examples": [
          {
            "en": "**Buy Rocket Runners — the fastest shoes you will ever wear!**",
            "note": "Purpose: to persuade. ‘The fastest you will ever wear’ is an opinion, not a fact.",
            "noteZh": "目的：说服。“你穿过的最快的鞋”是观点，不是事实。"
          },
          {
            "en": "**Kiwi are flightless birds found only in New Zealand.**",
            "note": "Purpose: to inform. This is a fact you can check.",
            "noteZh": "目的：告知。这是可以核实的事实。"
          },
          {
            "en": "**Pizza is the best food in the world.**",
            "note": "An opinion — other people may disagree.",
            "noteZh": "这是观点——别人可能不同意。"
          }
        ],
        "tip": "Ask: ‘Why did the author write this? What do they want me to do, know or feel?’",
        "tipZh": "问自己：“作者为什么写这个？他想让我做什么、知道什么、感受到什么？”",
        "qs": [
          {
            "q": "‘Come to Sunny Bay Holiday Park — the best place for a family holiday! Book now!’ What is the main purpose?",
            "opts": [
              "to persuade people to book",
              "to inform people about tides",
              "to entertain with a story",
              "to explain how to swim"
            ],
            "a": 0,
            "why": "Words like ‘the best’ and ‘Book now!’ show the writer wants you to do something: book a holiday.",
            "whyZh": "the best 和 Book now! 说明作者想让你做一件事：预订度假。"
          },
          {
            "q": "Which sentence is a fact?",
            "opts": [
              "Cats are the best pets.",
              "Winter is boring.",
              "Netball is more fun than tennis.",
              "A spider has eight legs."
            ],
            "a": 3,
            "why": "You can check that a spider has eight legs. The others are opinions.",
            "whyZh": "蜘蛛有八条腿是可以核实的。其他都是观点。"
          },
          {
            "q": "A made-up story about a talking possum who saves a forest is most likely written to…",
            "opts": [
              "inform",
              "persuade",
              "entertain",
              "give instructions"
            ],
            "a": 2,
            "why": "A made-up story with a talking animal is written mainly to entertain readers.",
            "whyZh": "一个会说话的负鼠的虚构故事，主要是为了娱乐读者。"
          }
        ]
      },
      {
        "id": "characters",
        "kind": "reading",
        "title": "Characters: feelings, motives and change",
        "titleZh": "人物：感受、动机和变化",
        "idea": "Good readers notice what characters **feel**, **why** they act (their **motive**) and **how they change** from the beginning to the end. Writers often show feelings through actions and words instead of telling you directly.",
        "ideaZh": "好的读者会注意人物的**感受**、他们**为什么**这样做（**动机**），以及从开头到结尾**怎样变化**。作者常常通过动作和语言来表现感受，而不是直接告诉你。",
        "points": [
          {
            "en": "Feelings: look at faces, bodies and voices — ‘she slammed the door’ (angry), ‘his voice shook’ (scared).",
            "zh": "感受：看表情、动作和声音——she slammed the door（生气）、his voice shook（害怕）。"
          },
          {
            "en": "Motive: ask ‘Why did the character do that? What did they want?’ Look for because, so and wanted to.",
            "zh": "动机：问“人物为什么这样做？他想要什么？”找 because、so、wanted to 等词。"
          },
          {
            "en": "Change: compare the character at the start and at the end. What made them change?",
            "zh": "变化：比较人物在开头和结尾的样子。是什么让他改变了？"
          },
          {
            "en": "Character traits describe what a person is usually like: brave, kind, determined, selfish.",
            "zh": "性格特点描述一个人通常是什么样的：brave、kind、determined、selfish。"
          }
        ],
        "examples": [
          {
            "en": "Tama **stamped his feet and refused to speak**.",
            "note": "A feeling shown by actions: angry or upset.",
            "noteZh": "用动作表现感受：生气或不高兴。"
          },
          {
            "en": "Priya kept fixing her boat **because she wanted to win the science fair**.",
            "note": "Motive: she wanted to win.",
            "noteZh": "动机：她想赢得科学展。"
          },
          {
            "en": "At first Mei hid behind her bag; **by the end she beamed at her new friends**.",
            "note": "Change: from timid to happy and confident.",
            "noteZh": "变化：从胆小到开心自信。"
          }
        ],
        "tip": "Make a feelings line: write how the character feels at the start, the middle and the end.",
        "tipZh": "画一条“心情线”：写下人物在开头、中间和结尾的感受。",
        "qs": [
          {
            "q": "‘Leo grinned and punched the air when his name was called.’ How did Leo feel?",
            "opts": [
              "scared",
              "thrilled",
              "bored",
              "sleepy"
            ],
            "a": 1,
            "why": "Grinning and punching the air are actions that show great happiness and excitement.",
            "whyZh": "咧嘴笑、挥拳庆祝，这些动作表现出非常高兴和兴奋。"
          },
          {
            "q": "‘Hana gave her lunch to the new boy because he had forgotten his.’ Which word best describes Hana?",
            "opts": [
              "kind",
              "selfish",
              "lazy",
              "rude"
            ],
            "a": 0,
            "why": "Sharing her lunch with someone who had none shows she is kind.",
            "whyZh": "把午饭分给没带饭的人，说明她很善良。"
          },
          {
            "q": "‘At the start of the year, Ben hated reading. Then his teacher gave him a book about sharks. Now he reads every night.’ What changed Ben?",
            "opts": [
              "a book that interested him",
              "a new bike",
              "a scary dream",
              "his best friend moving"
            ],
            "a": 0,
            "why": "The text says his teacher gave him a book about sharks, and after that he read every night.",
            "whyZh": "文章说老师给了他一本关于鲨鱼的书，从那以后他每晚都读书。"
          }
        ]
      },
      {
        "id": "compare-texts",
        "kind": "reading",
        "title": "Comparing two texts",
        "titleZh": "比较两篇文章",
        "idea": "Sometimes a test gives you two texts on the **same topic**. They may have a different **purpose**, **form** or **point of view**. To compare them, ask: What is the same? What is different? Which text gives facts, and which gives opinions or feelings?",
        "ideaZh": "考试有时会给你两篇**同一话题**的文章。它们的**目的**、**体裁**或**观点**可能不同。比较时问自己：哪些相同？哪些不同？哪篇给出事实，哪篇表达观点或感受？",
        "points": [
          {
            "en": "Topic: what are both texts about?",
            "zh": "话题：两篇都在讲什么？"
          },
          {
            "en": "Form and purpose: is one a report (to inform) and the other a poem or letter (to share feelings)?",
            "zh": "体裁和目的：是不是一篇是报告（告知），另一篇是诗或信（分享感受）？"
          },
          {
            "en": "Point of view: do the writers agree or disagree?",
            "zh": "观点：两位作者意见一致还是不同？"
          },
          {
            "en": "Read both texts BEFORE you answer, and check which text each question asks about.",
            "zh": "答题前把两篇都读完，并看清每道题问的是哪一篇。"
          }
        ],
        "examples": [
          {
            "en": "Text A: ‘Tūī are songbirds found in forests and gardens.’ Text B: ‘The tūī’s song is a silver bell that wakes me every morning.’ → **Same topic (tūī); A informs, B shares a feeling.**",
            "note": "A is a fact; B uses a metaphor to describe the song.",
            "noteZh": "A 是事实；B 用暗喻描写鸟鸣。"
          },
          {
            "en": "Review 1: ‘The movie was far too long.’ Review 2: ‘Every minute was exciting!’ → **The writers have different opinions.**",
            "note": "Same film, opposite points of view.",
            "noteZh": "同一部电影，相反的观点。"
          },
          {
            "en": "Both texts say that kākāpō are endangered. → **This is something the texts have in common.**",
            "note": "Look for ideas that appear in both texts.",
            "noteZh": "找两篇文章里都出现的内容。"
          }
        ],
        "tip": "Draw a quick table: Text A | Text B | Same?",
        "tipZh": "画一个简单的表格：文章 A | 文章 B | 相同吗？",
        "qs": [
          {
            "q": "Text 1: ‘Sharks have rows of sharp teeth and can smell blood from far away.’ Text 2: ‘I held my breath as the shark glided past, its eye watching me.’ How are the texts different?",
            "opts": [
              "Both texts are poems.",
              "Text 1 gives facts; Text 2 tells an experience.",
              "Text 1 is about dolphins.",
              "Text 2 gives only numbers."
            ],
            "a": 1,
            "why": "Text 1 lists facts about sharks. Text 2 describes what one person saw and felt.",
            "whyZh": "第一篇列出关于鲨鱼的事实。第二篇描写一个人的所见所感。"
          },
          {
            "q": "Text 1: ‘School uniforms save families money.’ Text 2: ‘Uniforms stop students showing who they are.’ What do the texts disagree about?",
            "opts": [
              "the colour of uniforms",
              "how to wash uniforms",
              "the price of shoes",
              "whether uniforms are a good idea"
            ],
            "a": 3,
            "why": "Text 1 gives a reason for uniforms and Text 2 gives a reason against them, so they disagree about whether uniforms are good.",
            "whyZh": "第一篇给出支持校服的理由，第二篇给出反对的理由，所以它们在“校服好不好”这一点上意见不同。"
          },
          {
            "q": "A test gives you two texts about the same topic. What should you do FIRST?",
            "opts": [
              "Read only the shorter text",
              "Answer from memory",
              "Read only the questions",
              "Read both texts carefully"
            ],
            "a": 3,
            "why": "You need to understand both texts before you can compare them.",
            "whyZh": "要比较两篇文章，必须先把两篇都读懂。"
          }
        ]
      },
      {
        "id": "figurative-texttypes",
        "kind": "reading",
        "title": "Figurative language and text types",
        "titleZh": "修辞手法和文本类型",
        "idea": "Writers use **figurative language** to paint pictures. A **simile** compares using like or as (as brave as a lion). A **metaphor** says something IS something else (the classroom was a zoo). **Personification** gives human actions to things (the wind whispered). Different **text types** have different features.",
        "ideaZh": "作者用**修辞手法**来描绘画面。**明喻**用 like 或 as 作比较（as brave as a lion）。**暗喻**直接说一个东西“是”另一个东西（the classroom was a zoo）。**拟人**让事物做人的动作（the wind whispered）。不同的**文本类型**有不同的特点。",
        "points": [
          {
            "en": "Simile: uses like or as — ‘Her hands were as cold as ice.’",
            "zh": "明喻：用 like 或 as——Her hands were as cold as ice.（她的手像冰一样冷。）"
          },
          {
            "en": "Metaphor: no like or as — ‘The moon was a silver coin.’",
            "zh": "暗喻：不用 like 或 as——The moon was a silver coin.（月亮是一枚银币。）"
          },
          {
            "en": "Personification: ‘The old house groaned in the wind.’",
            "zh": "拟人：The old house groaned in the wind.（老房子在风中呻吟。）"
          },
          {
            "en": "Text types: a review gives opinions and a rating; a poem uses lines and stanzas; a procedure has steps and commands; a report gives facts under headings.",
            "zh": "文本类型：评论给出观点和评分；诗歌分行、分节；说明步骤类文本有步骤和祈使句；报告在小标题下给出事实。"
          }
        ],
        "examples": [
          {
            "en": "The waves crashed **like thunder**.",
            "note": "Simile — it uses ‘like’.",
            "noteZh": "明喻——用了 like。"
          },
          {
            "en": "Dad **is a bear** in the morning.",
            "note": "Metaphor — Dad is not really a bear; it means he is grumpy.",
            "noteZh": "暗喻——爸爸不是真的熊，意思是他早上脾气不好。"
          },
          {
            "en": "The house’s dark windows **stared** down at us.",
            "note": "Personification — windows cannot really stare.",
            "noteZh": "拟人——窗户不会真的盯着人看。"
          }
        ],
        "tip": "See ‘like’ or ‘as’ → simile. Something ‘is’ something it can’t really be → metaphor. A thing acting like a person → personification.",
        "tipZh": "看到 like 或 as → 明喻。说一个东西“是”它不可能是的东西 → 暗喻。东西像人一样做动作 → 拟人。",
        "qs": [
          {
            "q": "‘The sun smiled down on the picnic.’ What is this an example of?",
            "opts": [
              "a simile",
              "a metaphor",
              "a fact",
              "personification"
            ],
            "a": 3,
            "why": "The sun cannot really smile — it is given a human action, so this is personification.",
            "whyZh": "太阳不会真的笑——它被赋予了人的动作，所以是拟人。"
          },
          {
            "q": "Which sentence contains a simile?",
            "opts": [
              "The baby slept all night.",
              "The baby is a little angel.",
              "The baby slept like a log.",
              "The baby slept quietly."
            ],
            "a": 2,
            "why": "It compares the sleeping baby to a log using ‘like’. ‘The baby is a little angel’ is a metaphor.",
            "whyZh": "它用 like 把熟睡的婴儿比作一根木头。The baby is a little angel 是暗喻。"
          },
          {
            "q": "A text has a list of ingredients and numbered steps such as ‘Mix the flour.’ What type of text is it?",
            "opts": [
              "a poem",
              "a review",
              "a procedure",
              "a diary"
            ],
            "a": 2,
            "why": "Ingredients and numbered command steps are features of a procedure, such as a recipe.",
            "whyZh": "配料清单和编号的指令步骤是说明步骤类文本（procedure）的特点，比如食谱。"
          }
        ]
      }
    ],
    "reading": [
      {
        "id": "r01",
        "title": "Nothing to Do",
        "type": "narrative",
        "level": "Y5-6",
        "parts": [
          {
            "title": "Nothing to Do",
            "paras": [
              [
                "When Leo’s family moved from the city to a farm near Waipukurau, Leo was sure his life was over.",
                "There was no skate park, no cinema and no fast internet.",
                "‘There’s nothing to do here,’ he grumbled at dinner every night."
              ],
              [
                "Their neighbour, Aroha, was the same age as Leo.",
                "Every morning she waved to him as she walked past with her dog, Patch.",
                "Leo never waved back.",
                "He just pulled his hood over his head and stared at his phone."
              ],
              [
                "Then one wet Saturday, Aroha’s mum knocked on the door.",
                "A late storm had flooded the bottom paddock, and some newborn lambs were stuck on a muddy bank.",
                "‘We need every pair of hands we can get,’ she said.",
                "Leo’s dad grabbed his raincoat, and Leo **grudgingly** followed."
              ],
              [
                "The rain stung his face, and his sneakers sank deep into the mud.",
                "Aroha showed him how to hold a lamb safely, with one arm under its chest and the other under its back legs.",
                "Together they carried six shivering lambs up to the dry shed, where the adults rubbed them with old towels.",
                "One tiny lamb would not stop trembling, so Leo wrapped it inside his own jacket until it was warm."
              ],
              [
                "By the time the sun came out, Leo was soaked and muddy.",
                "Strangely, he did not mind at all.",
                "‘You’re a natural farmer,’ laughed Aroha’s mum.",
                "Leo felt a warm glow spread through his chest."
              ],
              [
                "The next morning, Aroha walked past with Patch as usual.",
                "This time, Leo was already waiting at the gate in his gumboots.",
                "‘Can I help feed the lambs today?’ he called.",
                "Aroha grinned and waved him over."
              ]
            ]
          }
        ],
        "qs": [
          {
            "skill": "evidence",
            "q": "Why did Aroha’s mum knock on Leo’s door?",
            "opts": [
              "She wanted Leo to play with Aroha.",
              "She needed help to rescue some lambs.",
              "She was looking for her dog, Patch.",
              "She came to borrow a raincoat."
            ],
            "a": 1,
            "ev": [
              8,
              9
            ],
            "why": "The story says a storm had flooded the paddock and lambs were stuck. Then she said, ‘We need every pair of hands we can get.’ She came to ask for help.",
            "whyZh": "文中说暴风雨淹了牧场，小羊被困住了。接着她说“我们需要所有能帮忙的人手”。她是来求助的。"
          },
          {
            "skill": "vocab",
            "q": "Leo ‘grudgingly followed’ his dad. What does ‘grudgingly’ mean?",
            "opts": [
              "happily and eagerly",
              "quietly and secretly",
              "as fast as he could",
              "without really wanting to"
            ],
            "a": 3,
            "ev": [
              2,
              5,
              10
            ],
            "why": "Until then Leo had refused to join in — he ‘never waved back’ and kept saying there was nothing to do. So he followed without really wanting to. That is what ‘grudgingly’ means.",
            "whyZh": "在这之前 Leo 一直不愿意参与——他“从来不挥手回应”，还总说这里没什么可做。所以他是不情愿地跟着去的。这就是 grudgingly（勉强地、不情愿地）的意思。"
          },
          {
            "skill": "character",
            "q": "How did Leo feel about living on the farm at the start of the story?",
            "opts": [
              "unhappy and bored",
              "excited and curious",
              "scared of the animals",
              "proud of his new home"
            ],
            "a": 0,
            "ev": [
              0,
              2
            ],
            "why": "At the start Leo was ‘sure his life was over’ and grumbled, ‘There’s nothing to do here.’ He was unhappy and bored.",
            "whyZh": "故事开头 Leo“确信自己的生活完了”，还抱怨“这里没什么可做的”。他既不开心又觉得无聊。"
          },
          {
            "skill": "compare",
            "q": "How is Leo different at the end of the story?",
            "opts": [
              "He hates the farm even more than before.",
              "He is now scared of the lambs.",
              "He wants to help, instead of ignoring Aroha.",
              "He spends more time on his phone."
            ],
            "a": 2,
            "ev": [
              5,
              20,
              21
            ],
            "why": "At the start ‘Leo never waved back’ and stared at his phone. At the end he is ‘already waiting at the gate in his gumboots’ and asks to help feed the lambs.",
            "whyZh": "开头“Leo 从来不挥手回应”，只顾盯着手机。到了结尾，他已经“穿着雨靴在门口等着”，还主动要求帮忙喂小羊。"
          },
          {
            "skill": "inference",
            "q": "Why did Leo ‘not mind at all’ that he was soaked and muddy?",
            "opts": [
              "He had enjoyed helping and felt proud.",
              "He liked getting wet in the rain.",
              "He knew his clothes were old.",
              "He wanted Aroha to feel sorry for him."
            ],
            "a": 0,
            "ev": [
              17,
              18
            ],
            "why": "The story doesn’t say it straight out, but Leo was praised (‘You’re a natural farmer’) and ‘felt a warm glow spread through his chest’. Helping made him feel good, so the mud didn’t matter.",
            "whyZh": "文章没有直接说，但 Leo 被夸了（“你天生就是个农夫”），而且“心里涌起一股暖意”。帮忙让他感觉很好，所以身上的泥就无所谓了。"
          },
          {
            "skill": "main-idea",
            "q": "What is the story mainly about?",
            "opts": [
              "how to rescue lambs from a flood",
              "a girl who teaches her dog tricks",
              "why the city is better than the country",
              "a boy who starts to enjoy his new life by helping others"
            ],
            "a": 3,
            "ev": [
              0,
              21
            ],
            "why": "At the start Leo thinks ‘his life was over’; by the end he asks, ‘Can I help feed the lambs today?’ The story is about how he changes. Rescuing the lambs is just the event that changes him.",
            "whyZh": "开头 Leo 觉得“自己的生活完了”；到结尾他却问“今天我能帮忙喂小羊吗？”故事讲的是他的转变。救小羊只是让他改变的那件事。"
          }
        ]
      },
      {
        "id": "r02",
        "title": "Kororā: The World’s Smallest Penguin",
        "type": "report",
        "level": "Y5-6",
        "parts": [
          {
            "title": "Kororā: The World’s Smallest Penguin",
            "paras": [
              [
                "The kororā, or little penguin, is the smallest penguin in the world.",
                "An adult stands only about 25 to 30 centimetres tall — about the length of a school ruler.",
                "It weighs around one kilogram.",
                "Kororā live along the coasts of New Zealand and southern Australia."
              ],
              [
                "What do they look like?"
              ],
              [
                "Kororā have slate-blue feathers on their backs and white feathers on their fronts.",
                "This colouring is a clever **disguise**.",
                "From above, a swimming penguin’s dark back blends in with the deep water below.",
                "From below, its white front matches the bright sky.",
                "This helps it hide from seals and sharks that might eat it."
              ],
              [
                "What do they do all day?"
              ],
              [
                "Kororā spend most of the day at sea.",
                "They dive under the water to catch small fish, such as anchovies and pilchards.",
                "After dark, they come ashore in small groups and waddle up the beach to their nests.",
                "A nest might be a burrow in the sand, a gap between rocks or even a space under a boatshed.",
                "The female usually lays two eggs, and both parents take turns to keep them warm.",
                "At night, kororā can be very noisy, calling loudly to their partners."
              ],
              [
                "How can we keep them safe?"
              ],
              [
                "Today, kororā face many dangers on land.",
                "Dogs, cats and stoats attack them, and cars can hit them when they cross coastal roads at night.",
                "People can help by keeping dogs on a lead at the beach, driving slowly near the coast after dark and building safe nesting boxes.",
                "With a little care, these tiny penguins can keep returning to our shores for many years to come."
              ]
            ]
          }
        ],
        "qs": [
          {
            "skill": "evidence",
            "q": "Where do kororā spend most of the day?",
            "opts": [
              "in their burrows",
              "under boatsheds",
              "at sea",
              "on the beach"
            ],
            "a": 2,
            "ev": [
              11
            ],
            "why": "The report says, ‘Kororā spend most of the day at sea.’ They only come ashore after dark.",
            "whyZh": "文中写道“小蓝企鹅白天大部分时间都在海里”，天黑后才上岸。"
          },
          {
            "skill": "vocab",
            "q": "‘This colouring is a clever disguise.’ What does ‘disguise’ mean here?",
            "opts": [
              "a way of hiding by looking like something else",
              "a bright colour that warns enemies",
              "a warm coat for cold water",
              "a special swimming trick"
            ],
            "a": 0,
            "ev": [
              6,
              7,
              8
            ],
            "why": "The next sentences explain it: from above, the dark back ‘blends in with the deep water’, and from below, the white front ‘matches the bright sky’. The penguin hides by looking like what is around it.",
            "whyZh": "后面几句解释了：从上面看，深色的背“和深水融为一体”；从下面看，白色的肚子“和明亮的天空一样”。企鹅靠看起来像周围的环境来隐藏自己。"
          },
          {
            "skill": "structure",
            "q": "What is the job of the headings in this report?",
            "opts": [
              "to tell a funny story",
              "to give the penguins names",
              "to show the writer’s opinion",
              "to show what each section is about"
            ],
            "a": 3,
            "ev": [
              4,
              10,
              17
            ],
            "why": "The headings — ‘What do they look like?’, ‘What do they do all day?’ and ‘How can we keep them safe?’ — tell readers what each part is about, so information is easy to find.",
            "whyZh": "“它们长什么样？”“它们整天都在做什么？”“我们怎样保护它们？”这些小标题告诉读者每一部分讲什么，方便查找信息。"
          },
          {
            "skill": "inference",
            "q": "Why could driving slowly near the coast after dark help kororā?",
            "opts": [
              "Kororā are scared of loud engines.",
              "Kororā cross coastal roads at night.",
              "Kororā hunt for fish near roads.",
              "Kororā build nests in car parks."
            ],
            "a": 1,
            "ev": [
              13,
              19
            ],
            "why": "The report says kororā come ashore ‘after dark’ and that cars hit them ‘when they cross coastal roads at night’. Driving slowly gives drivers time to stop.",
            "whyZh": "文中说小蓝企鹅“天黑后”上岸，汽车会在它们“晚上穿过海边公路时”撞到它们。开慢一点，司机就来得及停车。"
          },
          {
            "skill": "purpose",
            "q": "What is the main purpose of the last section of the report?",
            "opts": [
              "to describe what kororā eat",
              "to explain the dangers and how people can help",
              "to persuade people to buy nesting boxes",
              "to compare kororā with other penguins"
            ],
            "a": 1,
            "ev": [
              18,
              19,
              20
            ],
            "why": "The section first lists dangers (‘Dogs, cats and stoats attack them…’) and then ways ‘People can help’. It explains a problem and what we can do about it.",
            "whyZh": "这一部分先列出危险（“狗、猫和白鼬会攻击它们……”），再说明“人们可以怎样帮忙”。它解释了问题以及我们能做什么。"
          },
          {
            "skill": "summary",
            "q": "Which is the best summary of the whole report?",
            "opts": [
              "Kororā are noisy birds that live under boatsheds.",
              "Kororā eat anchovies and pilchards every day.",
              "Kororā are tiny penguins with interesting habits that need our protection.",
              "Kororā are the largest penguins in New Zealand."
            ],
            "a": 2,
            "ev": [
              0,
              20
            ],
            "why": "A summary covers the whole text: what kororā are (‘the smallest penguin in the world’), how they live, and why they need help (‘People can help…’). The other choices are single details or wrong — they are the smallest, not the largest.",
            "whyZh": "概括要涵盖全文：小蓝企鹅是什么（“世界上最小的企鹅”）、它们怎样生活，以及为什么需要保护（“人们可以帮忙……”）。其他选项只是单个细节，或者是错的——它们是最小的，不是最大的。"
          }
        ]
      },
      {
        "id": "r03",
        "title": "Camp Diary: Day Two",
        "type": "recount",
        "level": "Y5-6",
        "parts": [
          {
            "title": "Camp Diary: Day Two",
            "paras": [
              [
                "Today was the best day of camp so far, even though it started badly.",
                "At six o’clock, Mr Hēnare woke our cabin by playing his guitar very loudly.",
                "Breakfast was lumpy porridge, but I was so hungry that I ate two bowls."
              ],
              [
                "After breakfast, our group walked to the flying fox.",
                "It stretched across a deep gully, and from the top platform it looked about a kilometre long.",
                "My stomach was doing somersaults.",
                "Sam, the camp instructor, checked our helmets and harnesses twice.",
                "‘This wire could hold the weight of a car,’ he told us, ‘so you are perfectly safe.’"
              ],
              [
                "When it was my turn, my legs felt like jelly.",
                "I stood at the edge for ages while everyone cheered.",
                "Finally, I closed my eyes and stepped off.",
                "For a second I was falling, and then I was flying!",
                "The trees rushed past in a green blur, and I screamed the whole way down.",
                "At the bottom, I could not stop grinning."
              ],
              [
                "At lunch, something funny happened.",
                "A weka crept out of the bushes, grabbed Priya’s sandwich and ran off with it.",
                "Mrs Lee said that weka are famous for being **cheeky** thieves.",
                "Priya didn’t think it was funny, so I gave her half of mine."
              ],
              [
                "Tonight we are having a talent show around the campfire, and the teachers will sit in the front row.",
                "We are even allowed to stay up until nine o’clock.",
                "I am going to tell jokes.",
                "I’m nervous, but after the flying fox, I feel like I can do anything."
              ]
            ]
          }
        ],
        "qs": [
          {
            "skill": "sequence",
            "q": "What did the writer’s group do straight after breakfast?",
            "opts": [
              "walked to the flying fox",
              "had a talent show",
              "ate lunch with Priya",
              "listened to Mr Hēnare’s guitar"
            ],
            "a": 0,
            "ev": [
              3
            ],
            "why": "The diary says, ‘After breakfast, our group walked to the flying fox.’ The guitar was before breakfast, and lunch and the talent show came later.",
            "whyZh": "日记里写着“早饭后，我们小组走到了滑索那里”。弹吉他是在早饭前，午饭和才艺表演都在后面。"
          },
          {
            "skill": "figurative",
            "q": "‘My legs felt like jelly.’ This means the writer’s legs…",
            "opts": [
              "were covered in sticky food",
              "were very cold",
              "felt weak and wobbly with fear",
              "were sore from walking"
            ],
            "a": 2,
            "ev": [
              8,
              9
            ],
            "why": "This is a simile. Jelly wobbles, so the writer means their legs were shaky because they were scared — they ‘stood at the edge for ages’ before stepping off.",
            "whyZh": "这是一个明喻。果冻会晃来晃去，作者的意思是害怕得腿发软、发抖——所以作者在边上“站了好久”才敢跳下去。"
          },
          {
            "skill": "vocab",
            "q": "Mrs Lee said weka are ‘cheeky thieves’. What does ‘cheeky’ mean here?",
            "opts": [
              "very shy",
              "bold and a bit rude",
              "extremely fast",
              "very hungry"
            ],
            "a": 1,
            "ev": [
              15,
              16
            ],
            "why": "The weka ‘crept out’, grabbed a sandwich and ran off — bold and a bit naughty. That is what ‘cheeky’ means.",
            "whyZh": "秧鸡“悄悄溜出来”，抢了三明治就跑——胆子大又有点无礼。这就是 cheeky 的意思。"
          },
          {
            "skill": "character",
            "q": "How did the writer feel at the bottom of the flying fox?",
            "opts": [
              "sick and dizzy",
              "angry with Sam",
              "bored and tired",
              "thrilled and proud"
            ],
            "a": 3,
            "ev": [
              13,
              21
            ],
            "why": "At the bottom the writer ‘could not stop grinning’, and later says, ‘I feel like I can do anything.’ They were thrilled and proud.",
            "whyZh": "到了终点，作者“笑得合不拢嘴”，后来还说“我觉得自己什么都能做到”。作者既兴奋又自豪。"
          },
          {
            "skill": "inference",
            "q": "Why did the writer give Priya half of their sandwich?",
            "opts": [
              "because the writer was too full",
              "because Mrs Lee told them to share",
              "to stop the weka coming back",
              "to cheer her up after the weka took hers"
            ],
            "a": 3,
            "ev": [
              15,
              17
            ],
            "why": "The weka stole Priya’s sandwich and ‘Priya didn’t think it was funny’, so the writer shared to make her feel better. The diary never says Mrs Lee asked them to.",
            "whyZh": "秧鸡偷走了 Priya 的三明治，“Priya 一点也不觉得好笑”，所以作者分给她一半，让她心情好一点。日记里没有说是 Mrs Lee 让分的。"
          },
          {
            "skill": "summary",
            "q": "Which sentence BEST sums up the writer’s day?",
            "opts": [
              "A scary challenge turned into a proud moment.",
              "The food at camp was terrible.",
              "A weka spoiled the whole day.",
              "The writer spent the day practising jokes."
            ],
            "a": 0,
            "ev": [
              0,
              21
            ],
            "why": "The writer calls it ‘the best day of camp so far’ and, after facing their fear on the flying fox, feels ‘like I can do anything’. The other choices are small parts of the day or not true.",
            "whyZh": "作者说这是“营地生活到目前为止最棒的一天”，在滑索上战胜恐惧后，觉得“自己什么都能做到”。其他选项只是一天里的小部分，或者不符合事实。"
          }
        ]
      },
      {
        "id": "r04",
        "title": "Game Review: Ruru’s Night Flight",
        "type": "review",
        "level": "Y5-6",
        "parts": [
          {
            "title": "Game Review: Ruru’s Night Flight",
            "paras": [
              [
                "Rating: 4 stars out of 5."
              ],
              [
                "If you like puzzles and adventure, Ruru’s Night Flight is a game you will not want to put down.",
                "You play as Ruru, a young morepork owl who must find her way home through a dark forest before the sun comes up.",
                "Along the way, she meets friendly kiwi, grumpy wētā and a very sleepy kererū.",
                "The game was made by a small team in Dunedin and costs $15."
              ],
              [
                "The best thing about the game is how it looks.",
                "Every level is painted in deep blues and purples, and the glowing mushrooms and glow-worms are **mesmerising**.",
                "I often stopped playing just to stare at the screen.",
                "The music is gentle and calm, which suits the night-time setting perfectly."
              ],
              [
                "The puzzles start easy but quickly get harder.",
                "In one level, you must move stones to block a stream so that a kiwi can cross.",
                "In another, you have to remember the order of owl calls to open a secret door.",
                "I had to restart some levels six or seven times, but I never felt like giving up.",
                "Luckily, there is a hint button for when you get really stuck."
              ],
              [
                "However, the game is not perfect.",
                "There are only twelve levels, so I finished it in one weekend.",
                "The controls can also be slow, which is annoying when you are trying to dodge a hungry stoat."
              ],
              [
                "Overall, Ruru’s Night Flight is beautiful, clever and great value.",
                "I would recommend it to anyone aged eight and over who enjoys a challenge.",
                "I just hope the makers add more levels soon!"
              ]
            ]
          }
        ],
        "qs": [
          {
            "skill": "evidence",
            "q": "What must Ruru do in the game?",
            "opts": [
              "catch a hungry stoat",
              "collect glowing mushrooms",
              "build a nest in a tree",
              "find her way home before the sun comes up"
            ],
            "a": 3,
            "ev": [
              2
            ],
            "why": "The review says Ruru ‘must find her way home through a dark forest before the sun comes up’.",
            "whyZh": "评论里说 Ruru“必须在太阳升起之前穿过黑暗的森林找到回家的路”。"
          },
          {
            "skill": "vocab",
            "q": "The glowing mushrooms and glow-worms are ‘mesmerising’. What does ‘mesmerising’ mean?",
            "opts": [
              "very scary and dangerous",
              "so beautiful you can’t stop looking",
              "too dark to see properly",
              "noisy and annoying"
            ],
            "a": 1,
            "ev": [
              6,
              7
            ],
            "why": "The next sentence explains it: ‘I often stopped playing just to stare at the screen.’ Something mesmerising holds your attention so you can’t look away.",
            "whyZh": "下一句解释了：“我经常停下来，只为了盯着屏幕看。”mesmerising 指美得让人移不开眼睛。"
          },
          {
            "skill": "fact-opinion",
            "q": "Which sentence from the review is a FACT?",
            "opts": [
              "The best thing about the game is how it looks.",
              "The music suits the setting perfectly.",
              "There are only twelve levels.",
              "It is beautiful, clever and great value."
            ],
            "a": 2,
            "ev": [
              15
            ],
            "why": "You can check how many levels a game has, so that is a fact. ‘The best thing’, ‘perfectly’ and ‘beautiful’ are the reviewer’s opinions.",
            "whyZh": "游戏有多少关是可以核实的，所以那是事实。“最好的地方”“完美地”“漂亮”都是评论者的观点。"
          },
          {
            "skill": "structure",
            "q": "What is the job of the paragraph that begins ‘However, the game is not perfect’?",
            "opts": [
              "to describe the game’s problems",
              "to explain how to play the first level",
              "to describe the music",
              "to tell the reader the price"
            ],
            "a": 0,
            "ev": [
              14,
              15,
              16
            ],
            "why": "‘However’ signals a change: after the good points, the reviewer lists the problems — only twelve levels and slow controls.",
            "whyZh": "However（然而）表示转折：说完优点后，评论者开始列出缺点——只有十二关，操作反应慢。"
          },
          {
            "skill": "compare",
            "q": "How does the reviewer feel about the puzzles compared with the controls?",
            "opts": [
              "likes the controls but finds the puzzles boring",
              "dislikes both the puzzles and the controls",
              "likes the puzzles but finds the controls annoying",
              "thinks the puzzles and controls are both perfect"
            ],
            "a": 2,
            "ev": [
              12,
              16
            ],
            "why": "The reviewer restarted hard levels many times ‘but I never felt like giving up’ — they enjoyed the puzzles. The slow controls, though, are called ‘annoying’.",
            "whyZh": "评论者很多关都重来了好几次，“但从没想过放弃”——说明喜欢这些谜题。而反应慢的操作却被说成“很烦人”。"
          },
          {
            "skill": "inference",
            "q": "Which player would the reviewer most likely think will NOT enjoy this game?",
            "opts": [
              "someone who loves adventure games",
              "someone who gets upset by hard puzzles",
              "someone who enjoys a challenge",
              "someone who likes beautiful pictures"
            ],
            "a": 1,
            "ev": [
              9,
              18
            ],
            "why": "The reviewer says the puzzles ‘quickly get harder’ and recommends the game to people who enjoy ‘a challenge’. A player who gets upset by hard puzzles would probably not enjoy it.",
            "whyZh": "评论者说谜题“很快就变难了”，并把游戏推荐给喜欢“挑战”的人。一遇到难题就沮丧的玩家大概不会喜欢。"
          }
        ]
      },
      {
        "id": "r05",
        "title": "Make Your Own Rain Gauge",
        "type": "procedure",
        "level": "Y5-6",
        "parts": [
          {
            "title": "Make Your Own Rain Gauge",
            "paras": [
              [
                "A rain gauge measures how much rain falls in one place.",
                "Farmers, gardeners and weather scientists all use rain gauges to keep track of rainfall.",
                "With this simple one, you can keep your own weather record at home."
              ],
              [
                "You will need:"
              ],
              [
                "• a large, clear plastic bottle with straight sides"
              ],
              [
                "• a handful of small stones"
              ],
              [
                "• a ruler"
              ],
              [
                "• a permanent marker"
              ],
              [
                "• sticky tape"
              ],
              [
                "• scissors and an adult helper"
              ],
              [
                "What to do:"
              ],
              [
                "1. Ask an adult to cut the top off the bottle, about a third of the way down."
              ],
              [
                "2. Put the small stones in the bottom of the bottle.",
                "They will stop the gauge from blowing over in the wind."
              ],
              [
                "3. Pour in water until it just covers the stones.",
                "Draw a line at the top of the water and label it 0."
              ],
              [
                "4. Tape the ruler to the side of the bottle so that its zero lines up with your line."
              ],
              [
                "5. Turn the cut-off top upside down and push it into the bottle like a **funnel**.",
                "This catches the rain and stops leaves from falling in."
              ],
              [
                "6. Place your gauge outside on flat ground, away from trees and buildings.",
                "If it is too close to a tree, drips from the leaves will give you the wrong reading."
              ],
              [
                "7. Check it at the same time every day.",
                "Write down how many millimetres of rain have fallen, then tip out the extra water so the level is back at 0."
              ],
              [
                "Top tip: After a week, make a bar graph of your results to see which day was the wettest.",
                "You can also compare your results with a friend who lives in another part of town."
              ]
            ]
          }
        ],
        "qs": [
          {
            "skill": "sequence",
            "q": "What should you do straight after putting the stones in the bottle?",
            "opts": [
              "tape the ruler to the bottle",
              "pour in water until it covers the stones",
              "cut the top off the bottle",
              "place the gauge outside"
            ],
            "a": 1,
            "ev": [
              12,
              14
            ],
            "why": "Step 2 is putting in the stones, and Step 3 says, ‘Pour in water until it just covers the stones.’",
            "whyZh": "第 2 步是放石头，第 3 步写着“倒水，直到刚好没过石头”。"
          },
          {
            "skill": "evidence",
            "q": "Why do you put small stones in the bottom of the bottle?",
            "opts": [
              "to stop the gauge blowing over",
              "to make the water clean",
              "to measure the rain",
              "to keep insects out"
            ],
            "a": 0,
            "ev": [
              13
            ],
            "why": "Step 2 explains: ‘They will stop the gauge from blowing over in the wind.’",
            "whyZh": "第 2 步解释了：“它们能防止雨量计被风吹倒。”"
          },
          {
            "skill": "vocab",
            "q": "In Step 5, the top is used ‘like a funnel’. What does a funnel do?",
            "opts": [
              "measures how heavy something is",
              "keeps liquid cold",
              "cuts plastic into pieces",
              "guides liquid into a narrow opening"
            ],
            "a": 3,
            "ev": [
              17,
              18
            ],
            "why": "The next sentence says it ‘catches the rain’. A funnel is wide at the top and narrow at the bottom, so it guides the rain into the bottle.",
            "whyZh": "下一句说它能“接住雨水”。漏斗上宽下窄，能把雨水引进瓶子里。"
          },
          {
            "skill": "purpose",
            "q": "Why does the writer include the sentence about drips from leaves?",
            "opts": [
              "to describe how trees drink water",
              "to warn that leaves are poisonous",
              "to explain why the gauge must not be near trees",
              "to show that the gauge needs cleaning"
            ],
            "a": 2,
            "ev": [
              19,
              20
            ],
            "why": "Step 6 says to place the gauge ‘away from trees and buildings’, and the next sentence gives the reason: drips from leaves would give ‘the wrong reading’.",
            "whyZh": "第 6 步说要把雨量计放在“远离树木和建筑物”的地方，下一句给出了原因：树叶滴下的水会让读数“不准确”。"
          },
          {
            "skill": "structure",
            "q": "Why are the instructions numbered?",
            "opts": [
              "because the steps must be done in order",
              "to show how many materials you need",
              "because every step is equally hard",
              "to show how many days the project takes"
            ],
            "a": 0,
            "ev": [
              11,
              15,
              16
            ],
            "why": "The numbers show the order of the steps. For example, you can’t tape the ruler on (Step 4) until you have drawn the 0 line (Step 3).",
            "whyZh": "编号表示步骤的先后顺序。比如，没画好 0 刻度线（第 3 步）之前，就不能贴尺子（第 4 步）。"
          },
          {
            "skill": "inference",
            "q": "Ana forgot to check her gauge for three rainy days. What would her next reading show?",
            "opts": [
              "only the rain from the last day",
              "no rain, because the water would dry up",
              "the wrong amount, because the stones would move",
              "the rain from all three days added together"
            ],
            "a": 3,
            "ev": [
              15,
              22
            ],
            "why": "You are told to tip out the water every day ‘so the level is back at 0’. If Ana forgot, the water would keep building up, so her reading would include the rain from all three days together.",
            "whyZh": "说明里要求每天倒掉多余的水，“让水位回到 0”。如果 Ana 忘了倒，水会一直积累，所以她的读数会把三天的雨量都加在一起。"
          }
        ]
      },
      {
        "id": "r06",
        "title": "Low Tide",
        "type": "poem",
        "level": "Y5-6",
        "parts": [
          {
            "title": "Low Tide",
            "paras": [
              [
                "When the tide slides out at the end of the bay,",
                "the sea pulls back its blanket of blue",
                "and leaves the rocks uncovered, wet and shining,",
                "like a table set for breakfast,",
                "with puddles for cups and seaweed for napkins.",
                "Gulls arrive first, of course, the rudest guests,",
                "shouting and **shoving** for the best seats,",
                "while I follow Dad carefully across the slippery stones."
              ],
              [
                "In every pool there is a tiny world.",
                "Anemones close their red fists when I touch them,",
                "then slowly open again, like flowers waking up.",
                "A crab sidesteps under a ledge,",
                "holding up his claws like a boxer,",
                "daring me to come closer.",
                "I don’t.",
                "Instead I watch a shrimp as clear as glass",
                "zip from shadow to shadow, quick as a thought."
              ],
              [
                "We lose track of time, my dad and I,",
                "lifting seaweed curtains to find hidden starfish,",
                "counting periwinkles as small as peas,",
                "until a cold, foamy wave licks my ankles",
                "and the sea begins to whisper, ‘My turn.’",
                "Dad checks the time and points to the shore.",
                "One by one, the pools disappear",
                "as the ocean takes its table back,",
                "and the gulls fly off to find another feast."
              ],
              [
                "Walking home with sandy toes and an empty bucket,",
                "I don’t mind that we left everything behind.",
                "Our bucket was only for looking, never for keeping.",
                "The crab, the starfish and the sleepy anemones",
                "belong to the sea, not to me.",
                "Tomorrow the tide will go out again,",
                "and the tiny world will be waiting,",
                "as long as we leave it the way we found it."
              ]
            ]
          }
        ],
        "qs": [
          {
            "skill": "evidence",
            "q": "Who is with the speaker at the beach?",
            "opts": [
              "a school friend",
              "Grandma",
              "Dad",
              "nobody"
            ],
            "a": 2,
            "ev": [
              7,
              17
            ],
            "why": "The poem says, ‘I follow Dad carefully across the slippery stones’ and ‘We lose track of time, my dad and I’.",
            "whyZh": "诗里写着“我小心地跟着爸爸走过湿滑的石头”和“我和爸爸都忘了时间”。"
          },
          {
            "skill": "vocab",
            "q": "The gulls are ‘shoving for the best seats’. What does ‘shoving’ mean?",
            "opts": [
              "singing loudly",
              "waiting politely",
              "flying in circles",
              "pushing roughly"
            ],
            "a": 3,
            "ev": [
              5,
              6
            ],
            "why": "The gulls are ‘the rudest guests’, shouting and trying to get ‘the best seats’. Rude guests push each other roughly — that is shoving.",
            "whyZh": "海鸥是“最没礼貌的客人”，一边叫一边抢“最好的座位”。没礼貌的客人会互相推搡——这就是 shoving。"
          },
          {
            "skill": "figurative",
            "q": "The crab is ‘holding up his claws like a boxer’. What does this suggest about the crab?",
            "opts": [
              "It is ready to defend itself.",
              "It is waving hello.",
              "It is very sleepy.",
              "It wants to be picked up."
            ],
            "a": 0,
            "ev": [
              12,
              13
            ],
            "why": "A boxer holds up his fists, ready to fight. The crab holds up its claws and is ‘daring me to come closer’ — it is ready to defend itself.",
            "whyZh": "拳击手举起拳头，随时准备打斗。螃蟹举起钳子，“好像在挑衅我走近一点”——它准备保护自己。"
          },
          {
            "skill": "figurative",
            "q": "Which line gives the sea a human action?",
            "opts": [
              "‘counting periwinkles as small as peas’",
              "‘and the sea begins to whisper’",
              "‘In every pool there is a tiny world’",
              "‘Walking home with sandy toes’"
            ],
            "a": 1,
            "ev": [
              21
            ],
            "why": "Only people whisper and say ‘My turn’, so here the sea is described as if it were a person. This is called personification.",
            "whyZh": "只有人才会低声说话、说“轮到我了”，所以这里把大海写得像人一样。这叫拟人。"
          },
          {
            "skill": "character",
            "q": "Which word best describes the speaker?",
            "opts": [
              "greedy",
              "respectful",
              "bored",
              "careless"
            ],
            "a": 1,
            "ev": [
              27,
              28,
              30
            ],
            "why": "The speaker only looks at the creatures (‘only for looking, never for keeping’) and believes they ‘belong to the sea, not to me’ — that shows respect for nature. The speaker isn’t careless (they walk ‘carefully’) or bored (they ‘lose track of time’).",
            "whyZh": "诗人只看不拿（“只是用来看的，从不用来装走”），并且认为这些小生物“属于大海，不属于我”——这表现出对大自然的尊重。诗人并不粗心（走得“很小心”），也不无聊（玩得“忘了时间”）。"
          },
          {
            "skill": "main-idea",
            "q": "What is the main message of the poem?",
            "opts": [
              "Rock pools are dangerous places.",
              "Gulls are the rudest birds of all.",
              "Enjoy nature, but leave it as you found it.",
              "It is fun to collect sea creatures."
            ],
            "a": 2,
            "ev": [
              28,
              33
            ],
            "why": "The last stanza says the bucket was ‘only for looking, never for keeping’, and the tiny world will be waiting ‘as long as we leave it the way we found it.’",
            "whyZh": "最后一节说桶“只是用来看的，从不用来装走”，而且只要“我们让它保持原样”，这个小世界就会一直在那里。"
          }
        ]
      },
      {
        "id": "r07",
        "title": "The Silver Bracelet",
        "type": "narrative",
        "level": "Y5-6",
        "parts": [
          {
            "title": "The Silver Bracelet",
            "paras": [
              [
                "Mia was building a sandcastle at Ōrewa Beach when her spade struck something hard.",
                "She brushed away the sand and gasped.",
                "It was a silver bracelet, decorated with tiny blue stones that sparkled like drops of seawater."
              ],
              [
                "‘Finders keepers!’ said her brother Sam.",
                "‘You should keep it, Mia.’"
              ],
              [
                "For a moment, Mia imagined wearing the bracelet to school.",
                "Everyone would ask where she got it.",
                "Then she noticed some words engraved on the inside: To June, with love."
              ],
              [
                "Mia’s stomach twisted.",
                "Somewhere, a person called June might be very upset.",
                "She showed the bracelet to Mum, who suggested they ask at the surf club.",
                "Lost things are often handed in there."
              ],
              [
                "When Mia described the bracelet, the lifeguard nodded straight away.",
                "An elderly woman had been in that morning, **retracing** her steps along the beach and searching every patch of sand.",
                "She had left her phone number, just in case.",
                "Mum rang the number, and a shaky voice answered."
              ],
              [
                "That afternoon, June came to collect the bracelet.",
                "When Mia placed it in her hand, June’s eyes filled with tears.",
                "‘My husband gave me this fifty years ago,’ she said softly.",
                "‘I thought it was gone forever.’",
                "She hugged Mia tightly.",
                "‘You are a very honest young lady,’ she said."
              ],
              [
                "On the way home, Sam was quiet for a long time.",
                "Behind them, the sea sparkled in the evening sun.",
                "Then he said, ‘I’m glad you didn’t keep it.’",
                "Mia smiled.",
                "She did not have a bracelet to wear to school, but she felt as if she was glowing all over."
              ]
            ]
          }
        ],
        "qs": [
          {
            "skill": "sequence",
            "q": "What did Mia do after she noticed the words inside the bracelet?",
            "opts": [
              "She showed the bracelet to Mum.",
              "She wore it to school.",
              "She buried it in the sand again.",
              "She gave it to Sam."
            ],
            "a": 0,
            "ev": [
              7,
              10
            ],
            "why": "After she noticed the words ‘To June, with love’, Mia ‘showed the bracelet to Mum’, who suggested asking at the surf club.",
            "whyZh": "Mia 看到“To June, with love”这几个字以后，就“把手镯拿给妈妈看”，妈妈建议去冲浪救生俱乐部问问。"
          },
          {
            "skill": "vocab",
            "q": "The woman had been ‘retracing her steps along the beach’. What does ‘retracing her steps’ mean?",
            "opts": [
              "running as fast as she could",
              "going back the way she had come",
              "drawing pictures in the sand",
              "counting how far she had walked"
            ],
            "a": 1,
            "ev": [
              13
            ],
            "why": "She was ‘searching every patch of sand’ along the beach — going back over the path she had walked, looking for the bracelet. ‘Re-’ means again.",
            "whyZh": "她沿着海滩“仔细搜寻每一片沙地”——顺着自己走过的路再走一遍，寻找手镯。re- 表示“再一次”。"
          },
          {
            "skill": "character",
            "q": "Why did Mia decide not to keep the bracelet?",
            "opts": [
              "Sam told her to give it back.",
              "She did not like the colour.",
              "She realised its owner might be very upset.",
              "Mum said it was too expensive."
            ],
            "a": 2,
            "ev": [
              8,
              9
            ],
            "why": "After reading the words inside, ‘Mia’s stomach twisted’ and she thought, ‘Somewhere, a person called June might be very upset.’ Sam had actually told her to keep it.",
            "whyZh": "看到手镯内侧的字后，“Mia 心里一紧”，她想到“某个叫 June 的人可能正非常难过”。其实 Sam 是叫她留下的。"
          },
          {
            "skill": "evidence",
            "q": "Which sentence BEST shows that the bracelet meant a lot to June?",
            "opts": [
              "‘That afternoon, June came to collect the bracelet’",
              "‘She had left her phone number, just in case’",
              "‘Lost things are often handed in there’",
              "‘My husband gave me this fifty years ago’"
            ],
            "a": 3,
            "ev": [
              17,
              18
            ],
            "why": "It was a gift from her husband that she had kept for fifty years, and her ‘eyes filled with tears’ when she got it back. That shows how special it was.",
            "whyZh": "这是丈夫送她的礼物，她珍藏了五十年，拿回手镯时她“眼里含满了泪水”。这说明手镯对她意义非凡。"
          },
          {
            "skill": "figurative",
            "q": "At the end, Mia ‘felt as if she was glowing all over’. This means she…",
            "opts": [
              "had a fever from the sun",
              "felt very happy and proud inside",
              "was covered in shiny sand",
              "was embarrassed and red-faced"
            ],
            "a": 1,
            "ev": [
              26
            ],
            "why": "Mia wasn’t really glowing. This figurative phrase means that doing the right thing made her feel warm, happy and proud inside.",
            "whyZh": "Mia 并不是真的在发光。这是比喻的说法，意思是做了正确的事，让她心里暖暖的、又开心又自豪。"
          },
          {
            "skill": "inference",
            "q": "What does Sam’s comment at the end suggest?",
            "opts": [
              "He has changed his mind about ‘finders keepers’.",
              "He wanted the bracelet for himself.",
              "He was angry with June.",
              "He thought Mia should have sold it."
            ],
            "a": 0,
            "ev": [
              3,
              24
            ],
            "why": "At the start Sam said, ‘Finders keepers!’ After seeing how much the bracelet meant to June, he says, ‘I’m glad you didn’t keep it.’ He has changed his mind.",
            "whyZh": "一开始 Sam 说“谁捡到就归谁！”看到手镯对 June 这么重要后，他说“我很高兴你没有留下它”。他改变了想法。"
          }
        ]
      },
      {
        "id": "r08",
        "title": "Why Does the Moon Change Shape?",
        "type": "report",
        "level": "Y5-6",
        "parts": [
          {
            "title": "Why Does the Moon Change Shape?",
            "paras": [
              [
                "Have you ever noticed that the Moon seems to change shape?",
                "Some nights it is a thin, curved sliver, and on other nights it is a bright, round circle.",
                "In fact, the Moon does not really change shape at all.",
                "It is always a ball of rock."
              ],
              [
                "Where does moonlight come from?"
              ],
              [
                "Unlike the Sun, the Moon does not make its own light.",
                "We can only see it because sunlight shines on it and bounces off its surface towards Earth.",
                "At any time, the half of the Moon that faces the Sun is lit up, while the other half is dark."
              ],
              [
                "How do the phases work?"
              ],
              [
                "The Moon travels around Earth, and one full trip takes about a month.",
                "As it moves, we see different amounts of its sunlit half.",
                "These different shapes are called the **phases** of the Moon."
              ],
              [
                "At the start of the cycle is the new moon.",
                "The sunlit side faces away from us, so the Moon is almost impossible to see.",
                "Over the next two weeks, more and more of the lit side comes into view.",
                "We say the Moon is waxing, which means growing.",
                "When the whole sunlit side faces Earth, we see a full moon.",
                "After that, the lit part gets smaller night after night, and the Moon is said to be waning.",
                "About 29 and a half days after one new moon, the next new moon arrives and the cycle begins again."
              ],
              [
                "Did you know?"
              ],
              [
                "The Moon spins slowly as it travels around Earth.",
                "Because it spins once in the time it takes to go around us, we always see the same side of the Moon."
              ]
            ]
          }
        ],
        "qs": [
          {
            "skill": "evidence",
            "q": "Why can we see the Moon?",
            "opts": [
              "It makes its own light.",
              "It is covered in glowing rocks.",
              "Earth shines a light on it.",
              "Sunlight bounces off it towards Earth."
            ],
            "a": 3,
            "ev": [
              5,
              6
            ],
            "why": "The report says the Moon ‘does not make its own light’, and that we see it because ‘sunlight shines on it and bounces off its surface towards Earth.’",
            "whyZh": "文中说月亮“自己不会发光”，我们能看见它，是因为“阳光照在它上面，又从表面反射到地球”。"
          },
          {
            "skill": "vocab",
            "q": "‘These different shapes are called the phases of the Moon.’ What are ‘phases’?",
            "opts": [
              "the rocks on the Moon’s surface",
              "times when clouds hide the Moon",
              "the different shapes the Moon seems to have",
              "the different colours of the Moon"
            ],
            "a": 2,
            "ev": [
              10,
              11
            ],
            "why": "The sentence itself tells you: the phases are ‘these different shapes’ — the different amounts of the sunlit half that we see.",
            "whyZh": "这句话本身就告诉你：phases（月相）就是“这些不同的形状”——也就是我们看到的被照亮部分的多少不同。"
          },
          {
            "skill": "structure",
            "q": "What is the purpose of the heading ‘Did you know?’",
            "opts": [
              "to ask the reader a test question",
              "to introduce an extra interesting fact",
              "to explain the meaning of ‘waxing’",
              "to give the writer’s opinion"
            ],
            "a": 1,
            "ev": [
              19,
              21
            ],
            "why": "‘Did you know?’ introduces a bonus fact at the end: the Moon spins, so ‘we always see the same side of the Moon.’",
            "whyZh": "“你知道吗？”引出了文章末尾一个额外的有趣知识：月亮会自转，所以“我们总是看到月亮的同一面”。"
          },
          {
            "skill": "sequence",
            "q": "Starting from a new moon, which order of phases is correct?",
            "opts": [
              "new moon → waxing → full moon → waning",
              "full moon → new moon → waxing → waning",
              "new moon → waning → full moon → waxing",
              "waxing → waning → new moon → full moon"
            ],
            "a": 0,
            "ev": [
              15,
              16,
              17
            ],
            "why": "The report starts with the new moon, then says the Moon is ‘waxing’ as more appears, reaches a ‘full moon’, and after that ‘is said to be waning’.",
            "whyZh": "文章从新月讲起，接着说更多部分出现时月亮在 waxing（渐盈），然后到满月，之后就 waning（渐亏）。"
          },
          {
            "skill": "compare",
            "q": "How is a full moon different from a new moon?",
            "opts": [
              "It is much closer to Earth.",
              "It is lit by the Sun, but a new moon is not.",
              "We see all of its lit side; at a new moon we see almost none.",
              "It is a bigger ball of rock."
            ],
            "a": 2,
            "ev": [
              13,
              16
            ],
            "why": "At a new moon ‘the sunlit side faces away from us’; at a full moon ‘the whole sunlit side faces Earth’. The Moon is always half lit by the Sun, and its size does not change.",
            "whyZh": "新月时“被照亮的一面背对着我们”；满月时“整个被照亮的一面都朝向地球”。月亮总有一半被太阳照亮，它的大小也不会变。"
          },
          {
            "skill": "summary",
            "q": "Which sentence best sums up the main idea of the report?",
            "opts": [
              "The Moon is a ball of rock that spins slowly.",
              "A new moon arrives every 29 and a half days.",
              "The Moon is brighter than the Sun at night.",
              "The Moon seems to change shape because we see different amounts of its lit half."
            ],
            "a": 3,
            "ev": [
              2,
              10
            ],
            "why": "The whole report explains that the Moon ‘does not really change shape’ — as it travels around Earth, ‘we see different amounts of its sunlit half’. The other choices are small details or untrue.",
            "whyZh": "整篇文章都在解释：月亮“其实并没有改变形状”——它绕地球运行时，“我们看到的被照亮部分多少不同”。其他选项只是小细节，或者是错的。"
          }
        ]
      },
      {
        "id": "r09",
        "title": "A Garden for Our School",
        "type": "persuasive",
        "level": "Y5-6",
        "parts": [
          {
            "title": "A Garden for Our School",
            "paras": [
              [
                "By Sione Taufa, Room 12."
              ],
              [
                "I am writing to ask Ms Walker, our principal, to start a vegetable garden at our school.",
                "My classmates and I have been talking about this idea for weeks.",
                "I believe it would be one of the best things that have ever happened to Pōhutukawa School."
              ],
              [
                "Firstly, a garden would help us learn.",
                "We could measure how fast our plants grow, record the weather and work out how much water each bed needs.",
                "That is science and maths in real life, not just in books."
              ],
              [
                "Secondly, a garden would help us eat more healthily.",
                "Children are more likely to try new vegetables if they have grown them themselves.",
                "Last year, Kōwhai School down the road grew more than 100 kilograms of vegetables and used them in its lunch programme.",
                "Why shouldn’t we do the same?"
              ],
              [
                "Thirdly, a garden would bring our school community together.",
                "Students from every class could take turns caring for the plants, and older students could teach the juniors.",
                "We could even hold a harvest lunch for families at the end of the year."
              ],
              [
                "Some people might say that a garden costs too much money and takes too much time.",
                "However, six parents have already offered to help on Saturday mornings, and the garden centre on Main Street has promised to donate seeds and tools.",
                "The space behind the hall is empty and gets sun all day, so it would be **ideal** for a garden."
              ],
              [
                "Ms Walker, please say yes to a school garden.",
                "Our class would love to present our plan at the next school assembly.",
                "Together, we can grow something amazing."
              ]
            ]
          }
        ],
        "qs": [
          {
            "skill": "main-idea",
            "q": "What does Sione want Ms Walker to do?",
            "opts": [
              "visit Kōwhai School",
              "start a vegetable garden at the school",
              "give the class more science lessons",
              "buy seeds from the garden centre"
            ],
            "a": 1,
            "ev": [
              1,
              17
            ],
            "why": "Sione begins, ‘I am writing to ask Ms Walker, our principal, to start a vegetable garden at our school,’ and near the end says, ‘Ms Walker, please say yes to a school garden.’",
            "whyZh": "Sione 一开头就写“我写这篇文章，是想请我们的校长 Walker 女士在学校开辟一个菜园”，快结尾时又说“Walker 女士，请答应建一个学校菜园吧”。"
          },
          {
            "skill": "fact-opinion",
            "q": "Which of these ideas from the text is an OPINION?",
            "opts": [
              "A garden would be one of the best things ever to happen to the school.",
              "Six parents have offered to help.",
              "The space behind the hall gets sun all day.",
              "Kōwhai School grew over 100 kilograms of vegetables."
            ],
            "a": 0,
            "ev": [
              3
            ],
            "why": "‘One of the best things that have ever happened’ is what Sione believes — other people might disagree. The other three can be checked, so they are facts.",
            "whyZh": "“发生过的最好的事情之一”是 Sione 的看法——别人可能不同意。其他三项都可以核实，所以是事实。"
          },
          {
            "skill": "vocab",
            "q": "‘…so it would be ideal for a garden.’ What does ‘ideal’ mean?",
            "opts": [
              "too small",
              "dangerous",
              "perfect",
              "expensive"
            ],
            "a": 2,
            "ev": [
              16
            ],
            "why": "The space ‘is empty and gets sun all day’ — exactly what a garden needs. So ‘ideal’ means perfect for it.",
            "whyZh": "那块地“空着，而且整天都有阳光”——正是菜园需要的条件。所以 ideal 的意思是理想的、完美的。"
          },
          {
            "skill": "evidence",
            "q": "Which part answers people who think a garden costs too much?",
            "opts": [
              "‘Why shouldn’t we do the same?’",
              "‘Together, we can grow something amazing.’",
              "‘That is science and maths in real life’",
              "‘the garden centre … has promised to donate seeds and tools’"
            ],
            "a": 3,
            "ev": [
              14,
              15
            ],
            "why": "Right after saying some people think a garden ‘costs too much money’, Sione points out that seeds and tools will be donated and parents will help, so it will not cost much.",
            "whyZh": "Sione 先提到有人认为菜园“太花钱”，紧接着就指出种子和工具会有人捐，家长也会来帮忙，所以花不了多少钱。"
          },
          {
            "skill": "structure",
            "q": "Why does Sione use the words ‘Firstly’, ‘Secondly’ and ‘Thirdly’?",
            "opts": [
              "to show he is giving separate reasons, one by one",
              "to show the order the vegetables will grow",
              "to tell Ms Walker what to do first",
              "to show which reason matters least"
            ],
            "a": 0,
            "ev": [
              4,
              7,
              11
            ],
            "why": "Each word starts a new reason for the garden — learning, healthy eating and bringing people together. They help the reader follow his argument.",
            "whyZh": "这几个词各自引出一个支持建菜园的理由——学习、健康饮食和凝聚大家。它们帮助读者跟上他的论证。"
          },
          {
            "skill": "purpose",
            "q": "Why does Sione mention Kōwhai School?",
            "opts": [
              "to complain that Kōwhai School is better",
              "to show that a school garden can really work",
              "to ask Ms Walker to visit it",
              "to explain where the garden centre is"
            ],
            "a": 1,
            "ev": [
              9,
              10
            ],
            "why": "He gives Kōwhai School as a real example — it grew ‘more than 100 kilograms of vegetables’ — and then asks, ‘Why shouldn’t we do the same?’ The example proves the idea can work.",
            "whyZh": "他举 Kōwhai 学校作为真实的例子——那所学校种出了“一百多公斤蔬菜”——接着问“我们为什么不能也这样做呢？”这个例子证明这个想法行得通。"
          }
        ]
      },
      {
        "id": "r10",
        "title": "Kate Sheppard: Votes for Women",
        "type": "biography",
        "level": "Y5-6",
        "parts": [
          {
            "title": "Kate Sheppard: Votes for Women",
            "paras": [
              [
                "Today, New Zealanders aged 18 and over can vote in elections.",
                "But in the 1880s, women were not allowed to vote in national elections.",
                "One woman, Kate Sheppard, worked for years to change that."
              ],
              [
                "Kate was born in Liverpool, England, in 1847.",
                "As a young woman, she moved to Christchurch with her family.",
                "She married Walter Sheppard in 1871 and had a son.",
                "She was clever, hard-working and a talented writer.",
                "Kate believed that women were just as able as men to make important decisions about their country."
              ],
              [
                "In the late 1880s, Kate began to campaign for women’s right to vote.",
                "She wrote letters to newspapers, gave speeches and handed out leaflets.",
                "Many people **opposed** the idea.",
                "Some said that women belonged at home and should not be involved in politics.",
                "But Kate refused to give up."
              ],
              [
                "Together with other women, she organised huge petitions, which are written requests signed by many people.",
                "Women travelled from house to house and town to town collecting signatures.",
                "In 1893, petitions signed by nearly 32,000 women were taken to Parliament.",
                "The biggest one was made of sheets glued together into a roll about 270 metres long.",
                "When it was unrolled in Parliament, it stretched the whole length of the debating chamber."
              ],
              [
                "On 19 September 1893, a new law was signed.",
                "New Zealand became the first self-governing country in the world where all women could vote in national elections.",
                "Just ten weeks later, tens of thousands of women voted for the very first time.",
                "Other countries, such as Australia and Britain, followed later."
              ],
              [
                "Kate Sheppard died in 1934.",
                "Today, her face is on the New Zealand ten-dollar note, and she is remembered as one of the country’s great leaders."
              ]
            ]
          }
        ],
        "qs": [
          {
            "skill": "sequence",
            "q": "Which of these happened FIRST?",
            "opts": [
              "The biggest petition was collected.",
              "A new law was signed.",
              "Kate moved to Christchurch.",
              "Women voted for the first time."
            ],
            "a": 2,
            "ev": [
              4
            ],
            "why": "Kate moved to Christchurch ‘as a young woman’, long before the 1893 petition, the new law and the first vote.",
            "whyZh": "Kate 在“年轻的时候”就搬到了基督城，远远早于 1893 年的请愿书、新法律的签署和女性第一次投票。"
          },
          {
            "skill": "vocab",
            "q": "‘Many people opposed the idea.’ What does ‘opposed’ mean?",
            "opts": [
              "were excited about",
              "did not understand",
              "had never heard of",
              "were against"
            ],
            "a": 3,
            "ev": [
              10,
              11
            ],
            "why": "The next sentence explains it: some people said women ‘should not be involved in politics’. People who argue against an idea oppose it.",
            "whyZh": "下一句解释了：有人说女性“不应该参与政治”。反对某个想法的人就是 oppose 它。"
          },
          {
            "skill": "evidence",
            "q": "How long was the roll made from the biggest 1893 petition?",
            "opts": [
              "about 32 metres",
              "about 270 metres",
              "about 18 metres",
              "about 1893 metres"
            ],
            "a": 1,
            "ev": [
              16
            ],
            "why": "The text says the biggest petition was glued together ‘into a roll about 270 metres long’.",
            "whyZh": "文中说最大的那份请愿书被粘成了“一卷大约 270 米长”的纸卷。"
          },
          {
            "skill": "fact-opinion",
            "q": "Which of these is a FACT about Kate Sheppard?",
            "opts": [
              "She died in 1934.",
              "She was the bravest woman who ever lived.",
              "Her campaign was the most exciting time in history.",
              "She deserves to be on every banknote."
            ],
            "a": 0,
            "ev": [
              22
            ],
            "why": "You can check the year someone died, so that is a fact. ‘The bravest’, ‘the most exciting’ and ‘deserves’ are opinions that people could argue about.",
            "whyZh": "一个人去世的年份可以核实，所以是事实。“最勇敢的”“最激动人心的”“应该”都是可以争论的观点。"
          },
          {
            "skill": "purpose",
            "q": "Why does the writer begin with ‘Today, New Zealanders aged 18 and over can vote’?",
            "opts": [
              "to explain how to enrol to vote",
              "to describe Kate’s childhood",
              "to argue that 18 is too young to vote",
              "to show how different things were before Kate’s work"
            ],
            "a": 3,
            "ev": [
              0,
              1
            ],
            "why": "The writer starts with today, then says, ‘But in the 1880s, women were not allowed to vote in national elections.’ The contrast shows how much Kate’s work changed things.",
            "whyZh": "作者先写今天的情况，然后说“但在 19 世纪 80 年代，女性不能在全国选举中投票”。这种对比显示出 Kate 的努力带来了多大的改变。"
          },
          {
            "skill": "summary",
            "q": "Which is the best summary of Kate Sheppard’s life?",
            "opts": [
              "She moved from England and wrote letters to newspapers.",
              "She collected 32,000 signatures all by herself.",
              "She led a long campaign that helped win women the vote.",
              "She was the first woman elected to Parliament."
            ],
            "a": 2,
            "ev": [
              2,
              19
            ],
            "why": "The biography is about how Kate ‘worked for years’ for women’s votes, until New Zealand became ‘the first self-governing country in the world where all women could vote’. She did not collect the signatures alone, and the text never says she was elected.",
            "whyZh": "这篇传记讲的是 Kate 怎样“努力了很多年”为女性争取投票权，直到新西兰成为“世界上第一个所有女性都能投票的自治国家”。签名不是她一个人收集的，文中也没有说她当选过议员。"
          }
        ]
      },
      {
        "id": "r11",
        "title": "The Missing Pavlova",
        "type": "playscript",
        "level": "Y5-6",
        "parts": [
          {
            "title": "The Missing Pavlova",
            "paras": [
              [
                "Characters: Nana, Mia (aged 10), Leo (aged 7) and Dad"
              ],
              [
                "Scene: Nana’s kitchen on Christmas Day.",
                "An empty plate sits on the bench."
              ],
              [
                "NANA: (**wringing** her hands) My pavlova is gone!",
                "I left it right here on the bench, and now there is only a plate.",
                "Everyone is coming for lunch in an hour!"
              ],
              [
                "MIA: Don’t worry, Nana.",
                "I’ll find it."
              ],
              [
                "(Mia pulls a notebook out of her pocket.)"
              ],
              [
                "MIA: Detective Mia is on the case!",
                "First, I need to look for clues."
              ],
              [
                "DAD: (looking up from the newspaper) Maybe it walked away by itself.",
                "I was reading the paper the whole time, so don’t look at me."
              ],
              [
                "MIA: (rolling her eyes) Pavlovas can’t walk, Dad.",
                "Leo, where were you ten minutes ago?"
              ],
              [
                "LEO: (quickly hiding his hands behind his back) Nowhere.",
                "I mean, outside.",
                "I was playing cricket."
              ],
              [
                "MIA: (looking at the window) It has been raining all morning."
              ],
              [
                "LEO: Inside cricket, I mean."
              ],
              [
                "MIA: Then why is there cream on your nose?"
              ],
              [
                "LEO: (wiping his nose) That’s… sunscreen."
              ],
              [
                "MIA: And why are your fingers sticky?"
              ],
              [
                "LEO: (his shoulders drooping) Okay, okay.",
                "I only had a tiny taste.",
                "Then the dog jumped up and knocked the whole thing onto the floor!",
                "I hid it under the table so nobody would see.",
                "I’m sorry, Nana."
              ],
              [
                "NANA: (laughing) Oh, Leo.",
                "Why didn’t you just tell me?"
              ],
              [
                "LEO: I thought you would be cross."
              ],
              [
                "NANA: I would much rather have the truth than a pavlova.",
                "And luckily, I made two."
              ],
              [
                "(Nana opens the fridge and lifts out a second pavlova.)"
              ],
              [
                "LEO: (grinning) Can I have the first piece?"
              ],
              [
                "NANA: Only if you help me set the table."
              ],
              [
                "DAD: Case closed, Detective Mia."
              ]
            ]
          }
        ],
        "qs": [
          {
            "skill": "structure",
            "q": "What do the words in brackets, such as ‘(rolling her eyes)’, tell the actors?",
            "opts": [
              "how to move or act",
              "which words to shout",
              "when the play ends",
              "what the audience should say"
            ],
            "a": 0,
            "ev": [
              13
            ],
            "why": "Words in brackets are stage directions. ‘(rolling her eyes)’ tells the actor playing Mia what to do while she speaks.",
            "whyZh": "括号里的文字是舞台说明。“（翻了个白眼）”告诉演 Mia 的演员说这句话时要做什么动作。"
          },
          {
            "skill": "vocab",
            "q": "Nana is ‘wringing her hands’ when she finds the empty plate. What is she doing?",
            "opts": [
              "washing her hands at the sink",
              "clapping because she is happy",
              "twisting her hands together because she is upset",
              "waving to the children"
            ],
            "a": 2,
            "ev": [
              3,
              5
            ],
            "why": "Nana has just found her pavlova ‘gone’, and everyone is coming ‘in an hour’. People twist their hands together like this when they are worried or upset.",
            "whyZh": "奶奶刚发现她的蛋白霜蛋糕“不见了”，而大家“一小时后”就要来了。人着急或难过的时候，会这样把两只手绞在一起。"
          },
          {
            "skill": "sequence",
            "q": "What happened just after Leo had a taste of the pavlova?",
            "opts": [
              "Nana made a second pavlova.",
              "The dog knocked it onto the floor.",
              "Mia found cream on Leo’s nose.",
              "Leo went outside to play cricket."
            ],
            "a": 1,
            "ev": [
              24,
              25
            ],
            "why": "Leo explains, ‘I only had a tiny taste.’ Then ‘the dog jumped up and knocked the whole thing onto the floor!’",
            "whyZh": "Leo 解释说：“我只尝了一小口。”接着“狗跳了起来，把整个蛋糕撞到了地上！”"
          },
          {
            "skill": "inference",
            "q": "Why does Mia say that it has been raining all morning?",
            "opts": [
              "to tell Dad to bring in the washing",
              "to explain why the pavlova melted",
              "to suggest they eat lunch inside",
              "to show Leo could not have been playing cricket outside"
            ],
            "a": 3,
            "ev": [
              16,
              17,
              18
            ],
            "why": "Leo says he was outside ‘playing cricket’, but Mia points out, ‘It has been raining all morning.’ She is showing that Leo’s story does not add up.",
            "whyZh": "Leo 说他在外面“打板球”，但 Mia 指出“整个上午都在下雨”。她是在说明 Leo 的话对不上。"
          },
          {
            "skill": "character",
            "q": "How does Leo feel just before he tells the truth?",
            "opts": [
              "proud of what he has done",
              "worried that he will get into trouble",
              "angry with Mia",
              "bored with the game"
            ],
            "a": 1,
            "ev": [
              23,
              30
            ],
            "why": "His ‘shoulders drooping’ and his words ‘I thought you would be cross’ show he was afraid of getting into trouble.",
            "whyZh": "他“耷拉着肩膀”，还说“我以为您会生气”，这些都说明他怕挨骂。"
          },
          {
            "skill": "main-idea",
            "q": "What lesson does the play mainly teach?",
            "opts": [
              "It is better to tell the truth than to hide a mistake.",
              "Dogs should not be allowed in kitchens.",
              "Pavlovas are hard to make.",
              "Detectives always solve the case."
            ],
            "a": 0,
            "ev": [
              31
            ],
            "why": "Nana says, ‘I would much rather have the truth than a pavlova.’ Hiding the mistake only made Leo more worried, while telling the truth fixed everything.",
            "whyZh": "奶奶说：“比起蛋白霜蛋糕，我更想听到实话。”隐瞒错误只会让 Leo 更担心，而说出实话让一切都好了。"
          }
        ]
      },
      {
        "id": "r12",
        "title": "Honey: Two Texts",
        "type": "pair",
        "level": "Y5-6",
        "parts": [
          {
            "title": "Text 1: Golden Hills Honey",
            "paras": [
              [
                "Taste the sunshine with Golden Hills Honey!"
              ],
              [
                "Our honey is made by happy bees on the green hills of Northland, where flowers bloom almost all year round.",
                "It is thick, golden and bursting with flavour.",
                "Children and adults love its smooth, creamy taste.",
                "Spread it on hot toast, stir it into yoghurt or drizzle it over pancakes.",
                "It is also perfect in a hot lemon drink on a cold winter night."
              ],
              [
                "Golden Hills Honey is the tastiest honey in New Zealand.",
                "Just ask our customers!",
                "‘It’s the best honey I have ever eaten,’ says Mrs Rangi from Kaitāia."
              ],
              [
                "Every jar is packed by hand, and we never add sugar or water.",
                "Our bees are cared for by beekeepers with more than 30 years of experience.",
                "Our jars come in three sizes: small, medium and family."
              ],
              [
                "SPECIAL OFFER: Buy two jars and get a third jar FREE!",
                "Hurry — this offer ends on Friday.",
                "Find Golden Hills Honey at your local supermarket today."
              ]
            ]
          },
          {
            "title": "Text 2: How Bees Make Honey",
            "paras": [
              [
                "Honey is made by honey bees from the sweet nectar of flowers.",
                "Making it takes a lot of teamwork."
              ],
              [
                "First, worker bees fly from flower to flower, sucking up nectar with their long, tube-like tongues.",
                "They store the nectar in a special part of their body called the honey stomach.",
                "When a bee’s honey stomach is full, it flies back to the hive."
              ],
              [
                "There, it passes the nectar to younger bees, which pass it from mouth to mouth and add natural chemicals called enzymes.",
                "The bees then spread the nectar into the wax cells of the honeycomb.",
                "At first, the nectar is very watery.",
                "To dry it out, the bees fan it with their wings until it becomes thick and sticky.",
                "Finally, they **seal** each cell with a cap of wax to keep the honey clean."
              ],
              [
                "Bees make honey so that the hive has food to eat in winter, when there are few flowers.",
                "One worker bee makes only about one-twelfth of a teaspoon of honey in her whole life.",
                "That means it takes the life’s work of hundreds of bees to fill just one jar."
              ]
            ]
          }
        ],
        "qs": [
          {
            "skill": "evidence",
            "q": "According to Text 2, why do bees make honey?",
            "opts": [
              "so people can eat it on toast",
              "to keep the hive warm",
              "to make wax for the cells",
              "so the hive has food in winter"
            ],
            "a": 3,
            "ev": [
              25
            ],
            "why": "Text 2 says, ‘Bees make honey so that the hive has food to eat in winter, when there are few flowers.’",
            "whyZh": "第二篇文章写道：“蜜蜂酿蜜，是为了让蜂巢在花很少的冬天有东西吃。”"
          },
          {
            "skill": "fact-opinion",
            "q": "Which sentence from Text 1 is an OPINION?",
            "opts": [
              "Our jars come in three sizes: small, medium and family.",
              "Golden Hills Honey is the tastiest honey in New Zealand.",
              "Every jar is packed by hand.",
              "This offer ends on Friday."
            ],
            "a": 1,
            "ev": [
              6
            ],
            "why": "‘The tastiest’ is what the sellers believe — you cannot prove it, and others may disagree. The jar sizes, the packing by hand and the end date can all be checked.",
            "whyZh": "“最好吃的”是卖家的看法——无法证明，别人也可能不同意。罐子的尺寸、手工装罐和优惠截止日期都可以核实。"
          },
          {
            "skill": "vocab",
            "q": "‘Finally, they seal each cell with a cap of wax…’ What does ‘seal’ mean here?",
            "opts": [
              "close up tightly",
              "paint a pattern on",
              "make a hole in",
              "clean out"
            ],
            "a": 0,
            "ev": [
              24
            ],
            "why": "They put ‘a cap of wax’ on each cell ‘to keep the honey clean’ — they close it up so nothing can get in.",
            "whyZh": "它们给每个蜂房盖上“一层蜡盖”，“让蜂蜜保持干净”——就是把它封起来，什么都进不去。"
          },
          {
            "skill": "purpose",
            "q": "What is the main purpose of Text 1?",
            "opts": [
              "to explain how bees make honey",
              "to describe the hills of Northland",
              "to persuade people to buy Golden Hills Honey",
              "to tell a story about Mrs Rangi"
            ],
            "a": 2,
            "ev": [
              12,
              14
            ],
            "why": "Text 1 uses a special offer (‘Buy two jars and get a third jar FREE!’) and tells readers to find the honey ‘at your local supermarket today’. It wants you to buy.",
            "whyZh": "第一篇文章用了促销（“买两罐送一罐！”），还叫读者“今天就去附近的超市买”。它的目的是让你购买。"
          },
          {
            "skill": "compare",
            "q": "How is Text 2 different from Text 1?",
            "opts": [
              "Text 2 tries to sell honey; Text 1 gives facts.",
              "Both texts tell a story about one bee.",
              "Text 2 gives facts; Text 1 tries to sell something.",
              "Text 2 is mostly about pancakes."
            ],
            "a": 2,
            "ev": [
              6,
              17
            ],
            "why": "Text 2 explains the steps bees follow, such as ‘worker bees fly from flower to flower’. Text 1 uses opinions like ‘the tastiest honey in New Zealand’ to sell a product.",
            "whyZh": "第二篇文章解释了蜜蜂酿蜜的步骤，比如“工蜂从一朵花飞到另一朵花”。第一篇用“新西兰最好吃的蜂蜜”这类观点来推销产品。"
          },
          {
            "skill": "compare",
            "q": "Text 1 sells honey. Which fact from Text 2 best helps explain why a jar of honey is valuable?",
            "opts": [
              "Honey is made from the nectar of flowers.",
              "Bees fly back to the hive when they are full.",
              "Nectar is very watery at first.",
              "It takes the life’s work of hundreds of bees to fill one jar."
            ],
            "a": 3,
            "ev": [
              26,
              27
            ],
            "why": "If one bee makes only ‘about one-twelfth of a teaspoon’ in her whole life, then ‘hundreds of bees’ are needed for one jar. All that work helps explain why honey is valuable.",
            "whyZh": "如果一只蜜蜂一生只能酿出“大约十二分之一茶匙”的蜂蜜，那么一罐蜂蜜就需要“几百只蜜蜂”的劳动。这么多的劳动正好说明了蜂蜜为什么珍贵。"
          }
        ]
      }
    ]
  };
  /*END-DATA*/
  var api = { DATA: DATA };
  root.PLEnglish = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
