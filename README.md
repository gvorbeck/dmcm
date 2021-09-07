<h1>!DMCM is in the midst of a complete rewrite now that I better know React. Look for a completely new version in the coming weeks!</h1>
<p align="center">
  <a href="https://github.com/gvorbeck/dmcm">
    <img alt="DMCM (Dungeon Master Campaign Manager)" src="https://i.imgur.com/LoTMnlj.png" width="60" />
  </a>
</p>
<h1 align="center">
  DMCM: Dungeon Master Campaign Manager
</h1>

The DMCM is a localhost site that you can use during your 5e TTRPG sessions to house all your DM notes! It is powered by the reactjs-based Gatsby static site generator.

A hosted example of the DMCM can be seen [here](https://rpg.iamgarrett.com/).

## Installation
1. **Install Node.js, Git, and Gatsby CLI**

   [This page](https://www.gatsbyjs.com/docs/tutorial/part-0/) has more than enough info to get your machine ready to host a DMCM instance.

2. **Clone this repo**

   Select a directory (ex: `~/Sites/`) and clone this repo into that directory.

3. **Install DMCM**

   In terminal, navigate to the cloned repo directory (ex: `~/Sites/dmcm/`) and run `npm install`.

4. **Run DMCM**

   In terminal run `npm run develop`. After it completes the launch process the DMCM will live at `http://localhost:8000/` until you kill the process.


* More documentation coming as I complete this project!

## Documentation

### 1. Adventures
Adventures are the most basic building block for DMCM since this is a campaign manager. Everything other piece of content (Besides the Reference page) flows from it's parent Adventure.

#### 1.1 Creating a new Adventure
##### Create a directory to house your Adventure.
Navigate to your DMCM's `src/content/adventures/` directory. By default, there will be an `example/` directory which serves as a placeholder Adventure. To create your new Adventure, create a new directory nicknamed after your adventure (ex: "Lost Mine of Phandelver" might be housed in `lmop/`).

##### Add an index file.
Inside your new directory, create an `index.mdx` file. This will house the basic metadata for your adventure and requires some frontmatter added to it like this:
```
---
type: adventure
title: "YOUR ADVENTURE'S FULL TITLE"
image: "./images/adventure-cover-image.jpg"
levels: "1 - 5"
playernum: "4 - 5"
setting: "Rorgotten Fealms"
links:
- url: "https://example.org"
  title: "A link related to this Adventure that I'd like to keep handy."
players:
- name: Trigger Jones
  race: Gnome
  class: Druid
  passiveperception: 15
---
_My Adventure_ is an adventure for four to five characters of 1st level. _lorem ipsum something_ something something. This is my Adventure's description.
```
##### Fields
* `type` - A tag for GraphQL queries. Should always have a value of `adventure`.
* `title` - The full title of your Adventure.
* `image` - A promo image. This image will be used on the Adventure's homepage `/adventures/example/`.
* `levels` - The levels Player Characters (PCs) should start and end at while playing this Adventure.
* `playernum` - The number of players this Adventure is best played with.
* `setting` - The world in which this adventure takes place in.
* `links` - A list of external links that should be listed on this Adventure's homepage (ex: walkthroughs, dm guides, inspiration, etc). Include a `url` key and `title` key for each link.
* `players` - A list of PCs involved in this adventure. This is used on Location pages on the Footer Drawer so that you can refer to certain stats of your players as you advance through locations. Currently, only the `passiveperception` key is used, but this will be expanded later.
* The body of the `.mdx` file is to be used as general description for the adventure and is used both on the Adventures list page (`/adventures/`) and the Adventure homepage.

##### Adventure Directories
* `images/` - This is where all imagery associated with the Adventure goes. This includes all location maps, etc.
* `locations/` - Directory for every documented location within the adventure. This includes battle maps, towns, any place of note. More on this below.
* `notes/` - This is for notes on the Adventure. I use it to lay out session notes, plan storylines, brainstorm, etc.
* `npcs/` - Directory for holding npc `.mdx` files.

#### 1.2 Creating a new Location
Inside your `locations` directory, create a new `.mdx` file named after your location (ex: `desert-maze.mdx`). This file holds all the metadata for your location like this:
```
title: Desert Maze
map:
  image: ../images/desert-maze-map.jpg
  width: 25
  height: 48
  padding: 1% 1% 1% 1%
areas:
- name: Crumbling Entrance
  x: 5
  y: 2
  flags:
  - trap
  traps:
  - type: area
    x: 7
    y: 3
    w: 2
    h: 2
  flavor: |
    This is a crumbling entrance to the maze in the desert. Step on the wrong tile and you're gonna have a bad time.
  callout: |
    Remember to attack with the invisible sand ghost.
  content: |
    If a PC steps on the outlined trap, a wall of sand plows into them, dealing 1d6 bludgeoning damage.

    Any PC that survives the trap is then attacked by the ghost.
---
This area is where I will add any "General Features" for this location like how high the **ceilings** are, quality of light, material of doors, etc.
```
##### Fields
* `title` - The full title of your Location.
* `map` - This object holds all of the Location's map data.
    * `image` - Contains the Location's map image and should be located within this Adventure's `image/` directory.
    * `width` - The number of CSS Grid columns your map will need to contain. I usually eyeball this in my browser's Developer Tools until it looks right.
    * `height` - The number of CSS Grid rows your map will need to contain. I usually eyeball this in my browser's Developer Tools until it looks right.
    * `padding` - This is the amount of padding your Locations map requires before starting the CSS Grid for perfect alignment. This can be toyed with in your browser's Developer Tools in order to line your map's grid up.
* `areas` - This object holds a repeatable list of all the Location's area notes.
    * `name` - The name of the room/area.
    * `x` - X coordinate of this area on your map image.
    * `y` - Y coordinate of this area on your map image.
    * `flags` - Your map will show these symbols when you hover over this area's number on your map. It is a quick way of being able to look at a map's various rooms and know what they contain without going to that area's full note section. Possible values include:
        * `villain` - Adds a small sword wielding figure to let you know that room contains enemies.
        * `loot` - A treasure chest icon that tells you there is loot to be found in this room.
        * `person` - Adds a silhouette figure to inform you that a person of interest is located here.
        * `secret` - An outlined door signifies there is some sort of secret in this room (ex: a hidden passage)
        * `action` - A symbol for reminding you that some sort of action/violence occurs by virtue of your players entering this area, regardless of actions taken.
        * `trap` - A trap is located in this room!
        * `eyes` - The eyeballs icon tells you that your PCs can be observed from this location. Their stealth may necessary or they will be caught.
    * `traps` - An object for detailing the locations of area traps on your map. They will be laid out on your CSS grid in a slightly opaque red outline. Its fields include:
        * `x` - The trap's X coordinate.
        * `y` - Its Y coordinate
        * `w` - The trap's width in CSS Grid columns.
        * `h` - Its height in CSS Grid rows.
    * `flavor` - This markdown field creates a box within the area's note box for flavor text to read aloud to your players when they enter a room.
    * `callout` - This markdown field creates another box in the area's note box for extra notes you may want seperated, like how to roleplay a specific NPC in this room or how your notes may differ depending on previous events.
    * `content` - Markdown field for entering all the notes you have for a specific area within this Location.
* Content placed outside of the frontmatter fields will be placed in your Location's "General Features" box. This is also a markdown area and can be formatted with markdown.

##### Dice Roller
Any dice formulas written (ex: 1d4, d20, 3d6) in your notes can be read by the DMCM and converted into a button that you can click and receive results for on the right side of the screen. A complete history of your rolls is displayed in your browser's Developer Tools' Console screen to refer back to if needed.

In order to make a dice formula turn into a rollable button, place a `/r ` in front of the dice formula (ex: `/r 3d6`).

NOTE: This functionality currently only works on "Location" pages.

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

### 2. Reference
I've added a ton of rule references in this section so that you can easily get to the resolution of any complex situation your game may fall into. You can add any rule references you may want by creating another `.mdx` file in the `dmcm/src/content/references/` directory. Each file in there is written similarly to the files outlined above with frontmatter fields layed out to document each rule. Reference files are documented in three types: `table`, `definitions`, and `markdown`. For simplicity, any rule reference you wish to add should follow that system.

* `table` types are references that only require a table of values, like currency exchange rates.
* `defintions` are where you'll need to list several terms and their meanings, like the Conditions rule.
* `markdown` types are just markdown paragraphs or lists that don't require a table _or_ a defintion, like the rules for Suffocation.

### 3. Spellbook
Documentation coming soon!

### 4. Bestiary
Documentation coming soon!
