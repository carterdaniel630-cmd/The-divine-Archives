Batch: Chapter images, tranche 1 (branch loop/chapter-images-t1)
Reviewed: 2026-11-08 (independent review; nothing edited or committed)
Auto-pass: SUSPENDED ("no baseline test batch yet", reviews/status.json) - every item below is for Carter
Covers: loop/chapter-images-t1@327fdda4 (one commit on origin/main b3188230)
Summary: 0 passed, 0 fixed, 6 need you (would-pass items listed below).

Automatic checks: review-checks --base origin/main --build: 9/9 PASS, committed output matches a fresh build.
All tools/verify-*.js pass. Working tree clean after the run.

WOULD PASS
- site:vault-card-build: tools/build-chapters.js:99-114 correct; withdrawn cards (V68) never call still();
  190 pictures on 55 pages, 82 distinct stills, every one followed by "Museum rendition - not a photograph";
  alt text also says "not a photograph". No still for V68, V16, V17, V74, V76 in the folder or in any page.
- site:layout: ch01, ch10, ch16, ch21, ch34, ch43, ch49 at 390 px and 1280 px: no horizontal scroll, no element
  past the edge, no script or console errors, no broken images. Phone: picture beside the words, as specified.
- site:perf: every image loading=lazy, decoding=async, width/height set; none fetched before scrolling to the
  Vault section. Heaviest page ch49 adds 182 KB (13 stills); folder 1.2 MB total; stills 2-30 KB each.
- site:linkage-claim: TRUE on origin/main - ch21 (black-stone, birmingham-quran, sanaa-palimpsest), ch25 kojiki,
  ch26 (zohar-mantua, sefer-yetzirah), ch34 kartarpur-bir, ch53 bardo-thodol, ch32 malleus-maleficarum,
  ch06 behistun-inscription, ch20 diamond-sutra each link their Vault page once. Live site not checked.
- site:intro-wording: accurate for existing objects.

NEEDS CARTER / FINDINGS
1. MEDIUM (sensitivity, REVIEWER.md 4.6). New placement of stills for the nine objects held under decision
   D2 (plans/museum-visual-pass.md:70, 287-298): V26 Black Stone (ch21 and others), V27 Tooth Relic casket,
   V28 Birmingham Qur'an, V29 Sana'a Palimpsest, V33 Kartarpur Bir, V46 Piprahwa relics, V64 Benin Bronzes,
   V77 Vèvè (V88 has no rendition). D2 is undecided; the order excluded only V68/V16/V17/V74. Also revered-person
   faces: holy-mandylion, veil-of-veronica, tilma-of-guadalupe. Scenario: the Black Stone and the Kartarpur Bir
   (a living Guru to Sikhs) appear as card thumbnails on chapter pages before Carter rules on them.
2. LOW-MEDIUM (honesty). build-chapters.js:109 "3D renditions of the objects" and alt "rendition of X" for
   objects with no extant or verified original (V07 Ark, V14 Holy Grail - card says "Legend", V75 Golden Plates).
   Scenario: a reader takes the gold cup as the Grail's look; suggest "or of their descriptions" wording.
3. MEDIUM (guard). The exclusion lives only in tools/build-relic-stills.js:25; build-chapters.js:101 shows any
   <slug>.webp it finds, and no verify script or CI check fails on an excluded still. Scenario: a hand-copied
   or older-branch james-ossuary.webp lands in the folder and goes live on ch10/ch16 with every check green.
4. LOW. V76 (Báb) is safe only because relics.js has no CAT.v76; the builder ignores NO_IMAGE in
   tools/build-museum.js:60. Scenario: a future CAT.v76 placeholder yields a still on its chapter.
5. LOW. tools/build-relic-stills.js:14 says "Deterministic"; a re-run changed ark-of-the-covenant.webp and
   gobekli-tepe.webp (pixel diff up to 76/255). Scenario: every re-run churns committed binaries.
6. LOW (framing). gobekli-tepe.webp (2 KB) is a thin pillar in a large empty frame; diwan-abatur, diamond-sutra
   scrolls are thin strips; Birmingham Qur'an and Sana'a show blank blurred leaves. Readable, not misleading.

Needs your decision
- Show stills of the nine D2-held objects (and the Christ/Guadalupe faces) on chapter pages, or hold them?
- Reword the intro for objects whose original is lost or legendary?
