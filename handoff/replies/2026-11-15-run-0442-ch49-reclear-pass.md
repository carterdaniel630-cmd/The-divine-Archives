# Chapter 49 (Sacred Kingship) — fresh clearance pass (report only)

**Run:** 2026-11-15 ~04:42–05:25 UTC, build loop. **Order:** `handoff/order-2026-11-09-reclear-ch49.md`.
**What was read:** `docs/chapters/ch49.html` exactly as live on `main` `f92ab8d7`, end to end (opening, five body
sections, believer's and skeptic's lenses, symbology, connections, evidence verdict, sources, Pantheon and Vault
blocks). Nothing was changed on any branch: this is the pass and its report. Clearing the pending tag, and any
content change beyond plain fixes, is Carter's.

## Verdict
**Not ready to re-clear as it stands: 1 accuracy finding (F1) and 3 small honesty-wording findings (F2–F4), each
with an exact fix below. 1 label finding (F5) is site-wide.** Everything else checked passes. The images pass.

## Findings, with exact fixes

**F1 — Japan: the 1946 declaration did not renounce the descent from Amaterasu (accuracy, live text).**
The evidence verdict says "the Japanese imperial descent-claim (renounced in 1946)". The 1 January 1946 rescript
never mentions Amaterasu; it rejects the idea that the emperor is *akitsumikami* (a "manifest god"). Whether it
touched the descent is disputed, and in December 1945 the emperor himself called it impermissible to describe the
divine descent as "chimerical" (Wikipedia, "Humanity Declaration", citing Dower and Bix).
- *Well-supported*, replace "the Japanese imperial descent-claim (renounced in 1946)" with
  "the Japanese emperor as descendant of Amaterasu and living god (the 1946 rescript rejected his status as a
  'manifest god', *akitsumikami*, but did not mention the descent, and how much it gave up is disputed)".
- *The king as god* bullet: "until 1945" → "until 1946". *Skeptical lens*: "Japan until the emperor renounced
  divinity in 1946" → "Japan until the emperor's 1946 rescript rejected his status as a living god".
- Sources: add "Humanity Declaration," Wikipedia, https://en.wikipedia.org/wiki/Humanity_Declaration .

**F2 — Royal touch end date understated for France (honesty wording).**
"…performed by English and French monarchs into the 18th century." England ended with Queen Anne (last touching
1712, d. 1714); France kept it a century longer and Charles X revived it in the 1820s (Britannica "king's evil";
Hektoen International 2024). Fix: "…a rite performed in England until Queen Anne in the early 18th century, and in
France as late as Charles X in the 1820s."

**F3 — "Christ" is a translation, not a derivation (honesty wording).**
"…māshîaḥ, gives us both Messiah and, through Greek, Christ" → "…māshîaḥ, gives us Messiah, and its Greek
translation, *christos*, gives us Christ". No new source needed (ch07/ch16 sources).

**F4 — Akitu as re-creation is a contested reading (contested claim not flagged).**
Symbology, "Coronation as re-creation": the Akitu reading as cosmic renewal is argued over (J. Z. Smith read the
festival as political rectification of the king; Benjamin Sommer, "The Babylonian Akitu Festival: Rectifying the
King or Renewing the Cosmos?", JANES 27, 2000, pp. 81–95, defends the cosmic reading). Fix: after "(Babylon's Akitu
festival, ch46, renewed the king's rule together with the cosmos" add ", on one scholarly reading; others see the
rite as mainly political". Sources: add Sommer 2000,
https://janes.scholasticahq.com/article/2432-the-babylonian-akitu-festival-rectifying-the-king-or-renewing-the-cosmos.pdf .

**F5 — Pantheon block says "discussed here" for figures the chapter never mentions (label, site-wide).**
Ten figures are listed under "Gods, spirits and mythic figures discussed here". Six of them do not appear in the
chapter text: Ahura Mazda, Di/Shangdi, Samuel, Ṣàngó, Solomon, Sun Goddess of Arinna. The list comes from the
Pantheon directory's chapter tags (`tools/build-chapters.js` `figuresFor`), and the same sentence is on every
chapter page. Two possible fixes, for Carter: **a** change the label on all chapters to "connected with this
chapter" (label fix, class (c)); **b** keep the label and add a sentence on each of the six to ch49 (content
change, per item). The Vault block's "objects and texts from this tradition" has the same small problem on a
theme page ("connected with this theme" would fit).

## Images (the reason for this re-clear)
- 13 Vault cards. **11 carry the museum's own 3D rendition** with the credit "Museum rendition · not a photograph"
  and alt text "The museum's 3D rendition of …, not a photograph"; the block's intro says the same. Correct.
- **Piprahwa Relics and the Sacred Tooth Relic show no picture**, correctly: both are held for Carter's
  sensitivity decision D2 in `tools/data/relic-stills.json`.
- Atlas's four (Pyramid Texts, Merneptah Stele, Tel Dan Stele, oracle bones) are present. They sit in the Vault
  block, not beside a passage. The chapter text never names Merneptah, Tel Dan or the oracle bones. Not a fault,
  but a one-line tie-in each would anchor them (pharaoh's victory hymn; the "House of David"; Shang kings asking
  their ancestors). That would be a content change, so it is for Carter.
- Headless, 390 px, `main` checkout: 0 script errors, no sideways scroll, the six images in view loaded (the rest
  load as they scroll in). Screenshot and probe: `handoff/previews/ch49-reclear/`.

## Checked and passing
Nemi and the Rex Nemorensis; *The Golden Bough* 1890–1915, twelve volumes in the 3rd edition. Pharaoh as Horus,
son of Ra, Osiris in death (Britannica). Sapa Inca as son of Inti (Britannica). The touched objects kept in chests
and burned "at the appointed time of year" is one conquistador account of Atahualpa (Przekrój, "Descendants of the
Sun"). "Each year" is fair, but naming it as a Spanish eyewitness report would be better (optional). Roman
apotheosis and the eagle. Mandate of Heaven. Hammurabi and Shamash: the relief shows rod and ring, but "receives his
law" is the common reading (Smarthistory). Shilluk reth as Nyikang. The sacred stool and spears are in Graeber's
HAU article. Graeber argues some reths were killed and Evans-Pritchard doubted it, which "complicated but not
dismissed" covers. Mesopotamian substitute king. Kantorowicz 1957. The Japanese regalia. Sources: the Graeber
citation is right (HAU 1(1), 2011, pp. 1–62, LSE eprint 50577), and "Sacred Kingship: The African Case" exists
(Claessen, *Social Evolution & History* 14(1), March 2015). Evidence section present with all three verdicts
(headings unified 2026-11-08).

## Not checked (honest gaps)
- The cited uchicago DOI link could not be opened from this run. The citation was confirmed through LSE's
  eprint record, but the link itself is unchecked. Britannica and sociostudies were opened and match.
- The Vault card summaries (e.g. "283 spells" for Unas) belong to the Vault entries and were not re-cleared here.
