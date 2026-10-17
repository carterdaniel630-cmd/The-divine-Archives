/* ==========================================================================
   THE DIVINE ARCHIVES — the games catalog (one list of the twelve games)

   This is the archive's CONTENT for the games layer: which games exist, what
   they are called, and which chapters they belong to. The shared shell
   (archive-games.js) and the game modules read it; they hold no titles or
   chapter ids of their own.

     id        the game id used by ArchiveGames.register / #play=<id>
     title     the title shown in the game overlay
     fullTitle (optional) the longer title the museum shows, when it has one
     subtitle  the line under the title in the overlay
     chapter   the chapter the game draws on: its symbol in the overlay and
               the "Read …" link on its end screen
     hiddenIn  the chapter whose symbol on the Symbols page is the game's
               "Playable" trigger (and the chapter the arcade lists it under)
     eggs      chapters whose symbols may hide the game as a random easter egg

   `chapter` and `hiddenIn` differ for four games on purpose: the game is
   hidden in one chapter's symbol but its facts come from another.

   Other places list the games in their own words (the home page cards,
   pilgrimage/arcade.html, the 3D arcade's site.js). tools/verify-games-catalog.js
   fails if any of them disagree with this file on ids, titles or chapters.
   ========================================================================== */
window.ARCHIVE_GAMES = [
  { id: "reliquary", title: "The Reliquary",
    subtitle: "Trivia drawn entirely from the archive's own chapters.",
    chapter: "ch22", hiddenIn: "ch22", eggs: ["ch16", "ch30", "ch19"] },
  { id: "ouroboros", title: "Ouroboros",
    subtitle: "The serpent that devours its own tail. Swallow the symbols; uncover the archive.",
    chapter: "ch37", hiddenIn: "ch37", eggs: ["ch20", "ch09", "ch17"] },
  { id: "ziggurat", title: "Ziggurat Builder",
    subtitle: "Lay the courses of a temple-mountain. Every course you raise uncovers the archive.",
    chapter: "ch03", hiddenIn: "ch03", eggs: ["ch23", "ch42", "ch05"] },
  { id: "chess", title: "Archive Chess",
    subtitle: "A board of gods — Olympian, Egyptian, or Aesir. Facts fall with every capture.",
    chapter: "ch02", hiddenIn: "ch02", eggs: ["ch12", "ch18", "ch13"] },
  { id: "seeker", title: "The Seeker's Path",
    subtitle: "The gatekeeper opens the way — follow the clues into the chapters.",
    chapter: "ch40", hiddenIn: "ch40", eggs: ["ch11", "ch34", "ch27"] },
  { id: "fighter", title: "Divine Casualties", fullTitle: "Divine Casualties — War of the Gods",
    subtitle: "War of the Gods — Zeus, Poseidon, Athena and Hades duel, drawn from real myth.",
    chapter: "ch08", hiddenIn: "ch08", eggs: ["ch24", "ch14", "ch43"] },
  { id: "pong", title: "Antithesis", fullTitle: "Antithesis — The Eternal Contest",
    subtitle: "The Eternal Contest — two cosmic principles volley the sacred orb.",
    chapter: "ch06", hiddenIn: "ch06", eggs: ["ch44", "ch25", "ch10"] },
  { id: "minesweeper", title: "The Excavation",
    subtitle: "Clear the buried grid without striking a hazard — each mark you deduce turns up a find.",
    chapter: "ch03", hiddenIn: "ch04", eggs: ["ch29", "ch41", "ch07"] },
  { id: "pacman", title: "The Labyrinth",
    subtitle: "Thread the maze of the dead — gather the offerings, outrun the shades.",
    chapter: "ch47", hiddenIn: "ch29", eggs: [] },
  { id: "pinball", title: "The Firmament",
    subtitle: "Launch the soul-spark through the ordered heavens; ring the celestial bumpers.",
    chapter: "ch46", hiddenIn: "ch46", eggs: [] },
  { id: "risk", title: "Dominion of the Ancients",
    subtitle: "A three-way war for the ancient world — outlast two empires, uncover their gods.",
    chapter: "ch03", hiddenIn: "ch13", eggs: [] },
  { id: "treasure", title: "The Tomb Robber",
    subtitle: "An expedition across the ancient world — outrun the traps and the tigers, solve the old doors, finish the journal.",
    chapter: "ch02", hiddenIn: "ch43", eggs: [] }
];
