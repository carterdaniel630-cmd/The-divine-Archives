# Sources — Museum ritual: the Weighing of the Heart (Egypt room, V20)

The guided walk-through "Walk through the scene" on the case of the Papyrus of Ani (Vault V20) in the museum's
Egypt room (ch02). Data: `docs/museum/rituals.js` (id `weighing-of-the-heart`, tier 1, pending review); the
rendition it turns the camera to: `docs/museum/relics.js`, `CAT.v20`. Plan: `plans/games-modern.md` §4–§5
(on branch `claude/games-modern`), approved by Carter on 2026-10-11. Logged 2026-10-11.

**How the sources were checked.** This build session could not download the pages directly (the sandbox's
network policy refused direct connections to sacred-texts.com, gutenberg.org, archive.org and wikisource.org).
The pages below were read through a web-fetch tool that returns the page's text in answer to questions. Every
quotation below was requested exactly, character for character, and the Negative Confession lines were requested
in two separate fetches, which returned the same wording both times. **At review, re-read each quotation against
the page itself (or a scan of the 1895 edition) before clearing.** Nothing was taken from memory.

## Primary text: Budge's 1895 translation (public domain)

E. A. Wallis Budge, *The Book of the Dead: The Papyrus of Ani in the British Museum* (London: British Museum,
1895). Title page, with the date given as [1895]: https://sacred-texts.com/book/the-book-of-the-dead/title-page
(the transcription says it was scanned at sacred-texts.com in Oct–Dec 2000).

### Step 1 — the Hall of the Two Truths
- Plates XXIX and XXX, https://sacred-texts.com/book/the-book-of-the-dead/plates-xxix-and-xxx — the opening of
  Chapter CXXV (Spell 125), its title quoted on the step: "THE CHAPTER OF ENTERING INTO THE HALL OF DOUBLE RIGHT
  AND TRUTH: A HYMN OF PRAISE TO OSIRIS, THE DWELLER IN AMENTET." (shown in sentence case on the step).
- Plate III, https://sacred-texts.com/book/the-book-of-the-dead/plate-iii — the vignette: "Ani and his wife enter
  the Hall of Double Law or Truth"; "Above, twelve gods, each holding a sceptre are seated upon thrones before a
  table of offerings."
- "Hall of the Two Truths" is the usual modern name for Budge's "Hall of Double Right and Truth"; the step gives
  both.

### Step 2 — the Declaration of Innocence (quoted exactly)
Plates XXXI and XXXII, https://sacred-texts.com/book/the-book-of-the-dead/plates-xxxi-and-xxxii — under the heading
"[THE NEGATIVE CONFESSION.]"; the vignette is described there as "The Hall of Double Right and Truth, wherein Ani
has to address severally the forty-two gods". Seven of the forty-two declarations, with Budge's numbers:

- (2) Hail, thou who art embraced by flame, who comest forth from Kheraba, I have not robbed with violence.
- (3) Hail, Fentiu, who comest forth from Khemennu, I have not stolen.
- (4) Hail, Devourer of the Shade, who comest forth from Qernet, I have done no murder; I have done no harm.
- (8) Hail, thou Flame, which comest and goest, I have spoken no lies.
- (12) Hail, thou whose face is turned back, who comest forth from thy hiding place, I have not caused shedding of tears.
- (13) Hail, Bast, who comest forth from the secret place, I have not dealt deceitfully.
- (19) Hail, Sertiu, who comest forth from Annu, I have not been angry and wrathful except for a just cause.

Chosen to match the five denials the V20 entry and ch02 already name (robbery, killing, stealing, lies, causing
weeping), plus two more. Declaration 11 was not used: the transcription prints its first word as "Hall" (a scanning
error for "Hail"), and we do not correct a quotation.

### Steps 3 and 4 — the scales; Thoth and Ammit
Plate III, https://sacred-texts.com/book/the-book-of-the-dead/plate-iii:
- "The god Anubis, jackal-headed, tests the tongue of the balance."
- Thoth: "The heart of Osiris hath in very truth been weighed, and his soul hath stood as a witness for him;" and
  the heart "hath been found true by trial in the Great Balance." (the second is quoted on step 3).
- The Devourer: "the female monster Amam, the 'Devourer,' or Am-mit, the eater of the Dead"; in the footnote, "the
  fore-part of a crocodile; her hind-quarters are those of a hippopotamus; her middle part [is that] of a lion."
- The gods' answer, quoted on step 4: "Let it not be given to the devourer Amemet to prevail over him."

### Step 5 — Horus presents Ani to Osiris
Plate IV, https://sacred-texts.com/book/the-book-of-the-dead/plate-iv:
- "Ani, found just, is led into the presence of Osiris."; Horus, "the son of Isis", "takes Ani by the hand and leads
  him forward towards" Osiris, "who is enthroned on the right within a shrine in the form of a funereal chest."
- "The god wears the *atef* crown with plumes"; "he holds in his hands the crook, sceptre, and flail".
- "Behind him stand Nephthys on his right hand and Isis on his left."
- "In the centre Ani kneels before the god upon a reed mat, raising his right hand in adoration" (not drawn in our
  rendition; see below).
- Horus's words, quoted on step 5: "I have come unto thee, O Unnefer, and I have brought the Osiris Ani unto thee."

## The holding museum

British Museum collection records, read through the same web-fetch tool:
- EA 10470/3, https://www.britishmuseum.org/collection/object/Y_EA10470-3 — "the scene is the Hall of Judgment";
  Ani "accompanied by his wife Tutu", entering "from the left, bending forward in proper humility"; the balance
  "holding in its two pans Ani's heart (on the left) and a feather (on the right)"; the gods "formally seated on
  thrones, waiting to deliver judgment"; a monster that "sits on a mat behind Thoth", "ready to spring forward to
  consume Ani's heart if he fails to pass the test" (quoted on step 4), with "the head of a crocodile, the forepart
  of a lion, and the hindquarters of a hippopotamus" (the record's associated names list "Representation of:
  Ammit"). Frame 43.1 cm high, 66.2 cm long.
- EA 10470/4, https://www.britishmuseum.org/collection/object/Y_EA10470-4 — "Vignette showing the conclusion of the
  judgement, with Ani introduced to Osiris" (quoted on step 5). Frame 65 cm long, 42 cm wide.

## The archive's own pages

- Vault entry V20, `vault/v20-papyrus-of-ani.md` (sources in `sources/v20-papyrus-of-ani.md`): the heart as "the seat
  of thought, memory and will" (step 3 says "thought and memory"); the justified dead passing on "to the realm of
  Osiris" (step 5).
- Chapter 2, `eras/02-bronze-age/ch02-egypt-bronze-age.md` (sources in `sources/ch02-egypt.md`); its evidence section
  is linked from step 5.

## What was left out, and why

- **Anubis leading the dead in (plan §5, step 1).** In the Papyrus of Ani, Ani and Tutu walk into the hall
  themselves (Plate III; BM EA 10470/3). Budge's footnote mentions Anubis holding the deceased by the hand only in a
  different vignette. Step 1 follows Ani's papyrus and does not show Anubis leading him.
- **What became of a heart that failed, beyond the sources above.** The step says only what the British Museum
  record and Budge's text say (the monster waits to consume the heart; the gods ask that she not prevail). The
  further belief that this meant a "second death" (ch02's wording) is not repeated in the walk-through, because no
  source for it was opened in this session.
- **In the rendition of sheet 4:** the kneeling Ani, the four sons of Horus on the lotus and the offerings are left
  out (simplified). Osiris's colouring is not given by the sources read, so he is drawn in white wrappings.
- **The rendition of sheet 3** is the existing one (visual pass, 2026-10-06), placed in the left half of a longer
  scroll so that sheet 4 can sit beside it. Its known simplification stays: the British Museum describes Anubis
  as kneeling; the rendition draws him standing.

## Note for the reviewer (not changed here)

`docs/museum/english.js`, entry `v20`, quotes "Hail, Usekh-nemmt, who comest forth from Anu, I have not committed
sin." and attributes it to Budge's 1895 *Papyrus of Ani*. The 1895 Plates XXXI–XXXII transcription read in this
session gives declaration 1 as "Hail, thou whose strides are long, who comest forth from Annu, I have not done
iniquity." The "Usekh-nemmt" wording appears to come from a different Budge translation. Flagged for review; not
changed in this branch.
