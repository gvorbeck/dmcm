<p align="center">
  <a href="https://github.com/gvorbeck/dmcm">
    <img alt="DMCM (Dungeon Master Campaign Manager)" src="https://i.imgur.com/LoTMnlj.png" width="60" />
  </a>
</p>
<h1 align="center">
  DMCM: Dungeon Master's Campaign Manager
</h1>

The DMCM is a React-based localhost app that you can use during your 5e TTRPG sessions to house all your DM notes, references, and homebrew stats & spells! It is powered by the Gatsby site generator tool. Not enough? Throw it in [Electron](https://www.electronjs.org/) and turn it into a desktop app!

A hosted example of the DMCM can be seen [here](https://rpg.iamgarrett.com/).

## Installation
1. **Install Node.js, Git, and Gatsby CLI**

   [This page](https://www.gatsbyjs.com/docs/tutorial/part-0/) has more than enough info to get your machine ready to host a DMCM instance.

2. **Clone this repo**

  `git clone https://github.com/gvorbeck/dmcm.git`

   Select a directory (ex: `~/Sites/`) and clone this repo into that directory.

3. **Install DMCM**

  `cd dmcm && npm install`

   In terminal, navigate to the cloned repo directory (ex: `~/Sites/dmcm/`) and run `npm install`.

4. **Run DMCM**

  `gatsby develop`

   In terminal run `gatsby develop`. After it completes the launch process the DMCM will live at `http://localhost:8000/` until you kill the process in your terminal.

## Documentation

### 1. Adventures
Adventures are one of the most basic building blocks for DMCM since this is a campaign manager. Everything flows from your TTRPG's adventure.

#### 1.1 Creating a new Adventure
##### Create a directory to house your Adventure.
Navigate to your DMCM's `src/content/adventures/` directory. By default, there will be an `example/` directory which serves as a placeholder Adventure. To create your new Adventure, create a new directory nicknamed after your adventure (ex: "Lost Mine of Phandelver" might be housed in `lmop/`). Keep it short and unique.

##### Add an index file.
Inside your new directory, create an `index.mdx` file. This will house the basic metadata for your adventure and requires some frontmatter added to it like this:
```
---
title: "The Mountain that Disappeared"
icon: "game-icon-spiked-dragon-head"
levels: "1-5"
playernum: "4-5"
setting: "The Pocket Universe"
links:
- url: "https://example.org"
  title: "A link related to this Adventure that I'd like to keep handy."
players:
- name: Traveller Jones
  race: Gnome
  class: Druid
  passiveperception: 15
---
_My Adventure_ is an adventure for four to five characters of 1st level. _lorem ipsum something_ something something. This is my Adventure's description.
```
##### Fields
* `title` - [REQUIRED] The full title of your Adventure.
* `icon` - An icon that will represent your adventure. Must start with `game-icon-`. (source: [Game Icons Font](https://seiyria.com/gameicons-font/))
* `levels` - The levels Player Characters (PCs) should start and end at while playing this Adventure.
* `playernum` - The number of players this Adventure is best played with.
* `setting` - The world in which this adventure takes place in.
* `links` - A list of external links that should be listed on this Adventure's homepage (ex: walkthroughs, dm guides, inspiration, etc). Include a `url` key and `title` key for each link.
* `players` - A list of PCs involved in this adventure. This is used on Location pages on the Footer Drawer so that you can refer to certain stats of your players as you advance through locations. Currently, only the `passiveperception` key is used, but this will be expanded later.
* The body of the `.mdx` file is to be used as general description for the adventure and is used both on the Adventures list page (`/adventures/`) and the Adventure homepage.

Once you have your `index.mdx` file created, it's time to create the directories your adventure will need:

##### Adventure Directories
* `images/` - This is where all the image files associated with your Adventure goes. This includes all location maps.
* `locations/` - Place all your location files for your adventure within this directory. This includes dungeons, towns, or any place of note. More on this below.
* `notes/` - This is for notes on your Adventure. I use it to lay out session notes, plan storylines, brainstorm, etc.
* `npcs/` - Directory for holding NPC `.mdx` files.

#### 1.2 Creating a new Location
Inside your `locations/` directory, create a new `.mdx` file named after your location (ex: `desert-maze.mdx`). This file holds all the metadata for your location like this:
```
---
title: Example Location
map:
  image: ../images/examplia-hills-barrow.png
  width: 21
  height: 27
  padding: 8% 8% 8% 8%
areas:
- name: Entrance
  x: 10
  y: 4
  flags:
  - six-eyes
  - wolf-trap
  - person
  traps:
  - x: 8
    y: 5
    w: 2
    h: 2
  flavor: |
    This is **flavor text** written in markdown. Wow, that's a _scary_ entrance. Dust and spiders lurk here where adventurers are seldom seen.
  content: |
    #### Occupants
    * 2 <MonsterLink>Example Monster</MonsterLink>s with spellcasting ability. They can cast <SpellLink>Example Spell</SpellLink>.

    #### Environment
    * The main gates, made of bronze-covered wood, have corroded and collapsed.
    * Any dice formulas in text can be turned into buttons to roll from!
        * example: <Dice>d20</Dice>, <Dice>5d6</Dice>, it's so easy - <Dice>3d12+3</Dice>! Just wrap them in Dice tags (ex: `<Dice>2d6</Dice>`).
    #### Developments
    * Hover your mouse over the PLAYER STATS bar at the bottom of your screen. Your players' info will be displayed. Right now it's just their Passive Perception, but I'll put more here soon.
    * Any loud noises here attract attention from Goblins in **area 7**.
    #### Treasure
    * A single **MacGuffin** is located in the southeast corner.
    #### XP
    * The party splits 5,000 xp for being great. And defeating the goblins.
---
This area is where I will add any "General Features" for this location like how high the **ceilings** are, quality of light, material of doors, etc.
```
##### Fields
* `title` - [REQUIRED] The full title of your Location.
* `map` - This object holds all of the Location's map data.
    * `image` - Contains the Location's map image and should be located within this Adventure's `image/` directory.
    * `width` - The number of CSS Grid columns your map will need to contain. I usually eyeball this in my browser's Developer Tools until it looks right or you can count the columns in your image.
    * `height` - The number of CSS Grid rows your map will need to contain. I usually eyeball this in my browser's Developer Tools until it looks right or you can count the rows in your image.
    * `padding` - This is the amount of padding your Locations map requires before starting the CSS Grid for perfect alignment. This can be toyed with in your browser's Developer Tools in order to line your map's grid up.
* `areas` - This object holds a repeatable list of all the Location's area notes.
    * `name` - The name of the room/area.
    * `x` - X coordinate of this area on your map image.
    * `y` - Y coordinate of this area on your map image.
    * `flags` - Your map will show these symbols when you hover over this area's number on your map. It is a quick way of being able to look at a map's various rooms and know what they contain without going to that area's full note section. This can be any icon you find at [Game Icons Font](https://seiyria.com/gameicons-font/). Just type the icon's name into the repeatable list.
    * `traps` - An object for detailing the locations of area traps on your map. They will be laid out on your CSS grid in a slightly opaque red outline. Its fields include:
        * `x` - The trap's X coordinate.
        * `y` - Its Y coordinate
        * `w` - The trap's width in CSS Grid columns.
        * `h` - Its height in CSS Grid rows.
    * `flavor` - This markdown field creates a box within the area's note box for flavor text to read aloud to your players when they enter a room.
    * `callout` - This markdown field creates another box in the area's note box for extra notes you may want separated, like how to roleplay a specific NPC in this room or how your notes may differ depending on previous events.
    * `content` - Markdown field for entering all the notes you have for a specific area within this Location.
* Content placed outside of the frontmatter fields will be placed in your Location's "General Features" box. This is also a markdown area and can be formatted with markdown.

There are several custom tags shown here that you can use in this file and others. Their documentation can be read below.

Content below here may be out of date.

##### Character stats
At the bottom of any Location page is a tray containing your PC's stats, just hover over the yellow strip at the bottom of the screen. Right now, only the passive perception score is listed, but will show more in the future.

##### Location Note Navigation
Clicking on any numbered area on the map will send you to the place on your page where that area's full notes are located.

On the left side of the screen is your Location's navigation panel. From top to bottom, the buttons are:
* **Back button**. This will return you to the Adventure's landing page.
* **Map button**. This will return you to the map image of this Location.
* **General Features button**. This will return you to this Location's General Features box.
* **Up button**. This will navigate you to the next highest room box.
* **Down button**. This will navigate you to the next lowest room box. It will loop back to the top if you reach the bottom.

#### 1.3 Creating a new Note
Notes are exactly what they sound like. Every DM needs to be able to plan and take notes on how their Adventure will progress and this is a place for you to do exactly that. It is the simplest of the files DMCM contains, needing only a title and markdown content, formatted like this:
```
---
title: 1. Entering the sand dunes of Eternal Desert
---
The PCs enter the desert and say, "_wow_, it sure is dry."
```
##### Fields
* `title` - Just the title of the note. The notes are sorted, so I like to have my titles start with a number so that I can easily determine where they are in the list.
* Content placed outside of the frontmatter block is your note's content. It is all in markdown, allowing you to easily format it as you like. Additionally, you can use Gatsby's `<Link/>` component to create **internal** links to locations, a rule reference, etc. You can also type HTML in here and the classes `.flavor` and `.callout` will work here to create boxes similar to Location area notes in case you would like to document your notes similarly.

#### 1.4 NPCs
Your adventure may include a cast of NPCs your PCs will need to interract with throughout their quests. Keeping track of those characters and their subtle differences can be quite difficult, especially if a particular character has not been present for a while. To make this as simple as possible, your Adventure's landing page includes an NPC table with their various details listed. Each `.mdx` file in your Adventure's `npcs/` directory will create another entry on this table. You should format your NPC `.mdx` files like this:
```
---
name: Hugo the Snake
race: Dragonborn male
age: "300"
motive: hostile
stats: https://urlto.your/stat/block/
emotion: jealous
location: Eternal Desert Oasis
occupation: Bandit
voice: lispy snake-like
---
* He is eager to rob the PCs
* Calling him a "**snake**" is an easy pay to anger Hugo.
```
##### Fields
* `name` - Name of your NPC.
* `race` - I use this to put race/species and gender info here.
* `age` - Age of NPC.
* `motive` - NPC may be hostile, neutral, or friendly to my PCs and here's where I document that.
* `stats` - Got a stat-block for your NPC? Put a URL to that here. I use DNDBeyond's content here.
* `emotion` - This helps me roleplay my NPCs. I want to remember the prevailing emotion this character exhibits so their personality is familiar each time they interract.
* `location` - Where is this NPC located? Remind yourself here.
* `occuptation` - Easily remember how this NPC works by documenting it here.
* `voice` - Give yourself some keywords about their vocal tendencies here.
* Any content placed outside of the frontmatter block is initially hidden on the NPC table. Click the icon in the Detail column and your table will expand to show this content. You can format anything you like here in markdown so that you can keep extra notes about this particular NPC handy.

Note: The `age` value needs to be wrapped in quotation marks. In fact, it's a good idea to wrap all your values in double quotation marks so that values with apostraphes don't mess up the formatting of your `.mdx` files. Any errors you're likely to encounter will be usually be from needing quotation marks or improper indentation of your frontmatter.

### 2. Custom Tags

#### 2.1 Dice
`<Dice/>`
Example: `The punch causes <Dice>3d8+3</Dice> bludgeoning damage.`
DMCM can roll dice for you! Got a dice formula (ex: 3d8+5)? Throw some `<Dice>` tags around it and DMCM will turn that formula into a button that will roll those dice for you. Furthermore, it will record those results into your browser's Developer Tools' Console so that you can refer back to them if needed.

#### 2.2 MonsterLink
`<MonsterLink/>`
Example: `Here, there are three <MonsterLink>Example Monster</MonsterLink>s lurking.`
Want to link directly to one of your monsters within the Bestiary? If you wrap its name with `<Monster>` tags. **Note**, it does not accept plurals of whatever a monster is named - the tags *must* be wrapped around the monster's exact name. Capitalization is unimportant.

#### 2.3 SpellLink
`<SpellLink/>`
Example: `Tav casts <SpellLink>Example Spell</SpellLink> at anyone approaching.`
Much like `<MonsterLink/>`, this tag will llink to one of your spells within the Spellbook. Same rule on plurals as above.

#### 2.4 Attack
`<Attack/>`
Example:
```
Greatsword
Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 28 (6d6 + 7) slashing damage.
<Attack>Greatsword|+11|6d6+7|slashing</Attack>
```
Only on Monster stat sheets (for actions, traits, reactions, legendary actions), there is an `<Attack/>` tag. This allows you to set up all the rolls needed to execute the action within a single button. It rolls first to see whether the action hits, accounts for both critical hits **and** misses, and then rolls to find any damage that occurs. On a critical hit, the damage dice are doubled; on a critical miss, it is an automatic miss and does not roll for damage (as per the *PHB*). It gives a full account of all these rolls on screen also recording them in your browser's Developer Tools' Console.

The formatting is Action Name, Hit Modifier, Damage Formula, Damage Type - all separated by `|` characters.

### 3. Reference
I've added a ton of rule references in this section so that you can easily get to the resolution of any complex situation your game may fall into. You can add any rule references you may want by creating another `.mdx` file in the `dmcm/src/content/references/` directory. Each file in there is written similarly to the files outlined above with frontmatter fields layed out to document each rule. Reference files are documented in three types: `table`, `definitions`, and `markdown`. For simplicity, any rule reference you wish to add should follow that system.

* `table` types are references that only require a table of values, like currency exchange rates.
* `defintions` are where you'll need to list several terms and their meanings, like the Conditions rule.
* `markdown` types are just markdown paragraphs or lists that don't require a table _or_ a defintion, like the rules for Suffocation.

### 3. Spellbook
Documentation coming soon!

### 4. Bestiary
Documentation coming soon!
