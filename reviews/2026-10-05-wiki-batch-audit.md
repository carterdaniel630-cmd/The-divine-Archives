Audit: 2026-10-05
Reports checked: reviews/2026-10-05-wiki-batch.md (Wikipedia-replacement batch, PRs #16 to #30)
Sample: seed `2026-10-05/2026-10-05-wiki-batch` -> ch75, ch79 (draw order ch75 ch79 ch66 ch68; the first two gave 28 source–claim pairs, so ch66 and ch68 were not needed)

How the sample was drawn. Auto-pass is off, so the reviewer's report has no PASSED or FIXED section and the
standard sampler would find nothing to draw from. I drew instead from the 12 chapters the reviewer marked
"would pass" (ch66, 67, 68, 69, 72, 75, 76, 78, 79, 80, 81, 82), as listed in the audit request, using the
sampler's own random generator and the seed above. 28 new sources were re-checked, about 15% of the
batch's new sources. Order note: before recording these verdicts I saw only the one-line subject of the
reviewer's commit ("0 passed, 0 fixed, 15 need Carter"); I did not open the report or any PR comment.

How the sources were checked. Publisher, journal, archive and UNESCO pages are blocked from this sandbox, so
no page could be opened. Every source below was "confirmed via search results": author, title, venue, year
and, where shown, the URL itself appeared in search results, along with what the work covers.

## My verdicts (recorded before reading the reviewer's)

### ch75, Siberian & Arctic Shamanism: branch claude/wiki-ch75 at b46009b

- ch75: **pass**. 10 new sources, all real and matching the claims they are attached to. Only the Sources
  list and the source log changed; no sentence of the chapter body changed. `review-checks --build` and all
  14 verify scripts pass; `pending: true` is kept.
  1. Vitebsky, *The Reindeer People* (Houghton Mifflin 2005) -> reindeer as spirit mounts, sacrifices and
     headdress antlers. Confirmed: Eveny fieldwork on reindeer and shamans; the URL (publishersweekly.com/9780618211883) appears in results. Note: the book is about the Eveny; the source log says "Eveny and Evenki".
  2. Wasson, *Soma: Divine Mushroom of Immortality* (Harcourt Brace Jovanovich 1968) -> Wasson's 1968 Soma
     theory. Confirmed, including the Wellcome record y4c24mvh.
  3. Brough, "Soma and *Amanita muscaria*", BSOAS 34 (1971) 331–362 -> the critique of Soma as fly agaric
     based on pressing and filtering. Confirmed: venue, pages and the Cambridge URL; it argues from the
     pressing ritual.
  4. Rydving, "The Saami drums and the religious encounter in the 17th and 18th centuries", *Scripta Inst.
     Donneriani Aboensis* 14 (1991) 28–51 -> criminalization and confiscation of Sami drums. Confirmed,
     DOI 10.30674/scripta.67195. (The 1728 fire still rests on the Wikipedia pointer, as the log says.)
  5. Rasmussen, *Intellectual Culture of the Iglulik Eskimos* (Fifth Thule Expedition vol. VII no. 1,
     trans. Worster, Gyldendal 1929) -> Aua's testimony and Uvavnuk's song. Confirmed. Note: the Internet
     Archive item is catalogued under the volume title *Intellectual culture of the Hudson Bay Eskimos*,
     which contains the Iglulik part, so it is the right book.
  6. Harner, *The Way of the Shaman* (Harper & Row 1980) -> "core shamanism" taught in workshops. Confirmed.
  7. Foundation for Shamanic Studies, "The History and Work of the FSS" -> core shamanism and its
     workshops. Confirmed, URL as cited.
  8. Dick, "'Pibloktoq' (Arctic Hysteria): A Construction of European-Inuit Relations?", *Arctic
     Anthropology* 32.2 (1995) -> "a supposed syndrome whose existence later studies question". Confirmed:
     Dick argues it is a "phantom phenomenon" built on about eight cases.
  9. Eliade, *Shamanism: Archaic Techniques of Ecstasy* (trans. Trask, Princeton, Bollingen LXXVI, 1964;
     Payot 1951) -> the Eliade thesis and its 1951 date. Confirmed. Note: the exact Princeton URL
     (press.princeton.edu/node/50487) did not appear in results; the book itself is certain.
  10. Kehoe, *Shamans and Religion* (Waveland 2000) -> Kehoe argued "shaman" should be kept for the Siberian
      peoples. Confirmed: exactly the book's argument.

### ch79, The First Christian Kingdoms: branch claude/wiki-ch79 at dd912b6

- ch79: **pass**. 18 new sources, all real and matching their claims. One body sentence changed (the Garima
  Gospels), which is one of the five date rulings; its new wording (three gospel books, two illustrated,
  about 390–570 for Garima 2 and 530–660 for Garima 1) matches the ruling in the source log and the
  published study. Nothing else in the body changed. `review-checks --build` and all 14 verify scripts pass;
  `pending: true` is kept.
  1. Agathangelos, *History of the Armenians*, trans. Thomson (SUNY 1976) -> Gregory, Tiridates, Hripsime
     and Gayane. Confirmed, SUNY URL as cited.
  2. Encyclopaedia Iranica, "Agathangelos" -> same. Confirmed, URL as cited.
  3. UNESCO WHC 1011, Echmiatsin and Zvartnots (inscribed 2000) -> Etchmiadzin. Confirmed.
  4. Koriun, *The Life of Mashtots*, trans. Norehad (AGBU 1964) -> Mashtots and the alphabet. Confirmed.
  5. Ełišē, *History of Vardan and the Armenian War*, trans. Thomson (Harvard 1982, HATS 5) -> Avarayr and
     Vardan. Confirmed.
  6. UNESCO ICH 00434, khachkars (Representative List 2010) -> the chapter's "(2010)". Confirmed.
  7. Rufinus, *Church History* 10.11, trans. Amidon (OUP 1997) -> earliest account of the Iberian
     conversion, which does not name Nino. Book confirmed; the content of 10.11 is well known but did not
     appear in search snippets.
  8. Thomson, *Rewriting Caucasian History* (Clarendon 1996) -> the Georgian chronicle tradition. Book
     confirmed. Note: the OUP URL (academic.oup.com/book/49745) did not appear in results.
  9. Toumanoff, *Studies in Christian Caucasian History* (Georgetown 1963) -> "334–337 in Cyril
     Toumanoff's dating". Book confirmed; results report conversion 334 and state religion 337 on
     Toumanoff's corrected chronology, but only from secondary pages. The builder's log already asks for a
     re-read in Toumanoff. Not a failure.
  10. UNESCO WHC 708, Historical Monuments of Mtskheta (inscribed 1994) -> Svetitskhoveli. Confirmed.
  11. UNESCO ICH, three writing systems of the Georgian alphabet (2016) -> the Georgian alphabet. Listing
      confirmed. Note: the cited URL is the UNESCO Silk Roads copy, which did not appear in results; the
      ich.unesco.org entry did.
  12. Munro-Hay, *Aksum* (Edinburgh 1991) -> Ezana and his coins. Confirmed.
  13. Met Museum essay, "Foundations of Aksumite Civilization..." -> Ezana's crescent-and-disc replaced by
      the cross. Confirmed: the essay says exactly this. (Its title now reads "1st–8th century".)
  14. Phillipson, *Ancient Churches of Ethiopia* (Yale 2009) -> the Nine Saints. Confirmed.
  15. McKenzie & Watson, *The Garima Gospels* (Manar al-Athar 2016), via the *Aethiopica* review URL -> three
      manuscripts; c. 390–570 and 530–660. Confirmed: both ranges and the URL (Bausi's review, *Aethiopica*
      20, 2017) appear in results.
  16. UNESCO ICH 01491, Ethiopian epiphany (2019) -> Timkat and the tabot procession. Confirmed.
  17. Cowley, "The Biblical Canon of the Ethiopian Orthodox Church Today", *Ostkirchliche Studien* 23
      (1974) 318–323 -> "81 books". Confirmed.
  18. UNESCO WHC 18, Lalibela -> eleven churches as a "New Jerusalem". Confirmed.

Sources searched (all via search results; no page could be opened from the sandbox):
publishersweekly.com/9780618211883; wellcomecollection.org/works/y4c24mvh; the Cambridge BSOAS article
98BFF929…; journal.fi/scripta/article/view/67195; archive.org/details/intellectualcult00rasm;
shamanism.org/articles/the-history-and-work-of-the-fss/; the Arctic Anthropology 32.2 record; the Princeton
and Waveland catalogue records; sunypress.edu Agathangelos; iranicaonline.org/articles/agathangelos;
whc.unesco.org/en/list/1011, /708, /18; ich.unesco.org RL 00434, 01491, 01205; the Koriun, Ełišē, Rufinus,
Thomson, Toumanoff, Munro-Hay, Phillipson and Cowley catalogue records; the metmuseum.org Aksum essay;
journals.sub.uni-hamburg.de/aethiopica/article/view/1089.

Tally: 28 source–claim pairs, 28 hold up. Small notes, none a failure: three exact URLs not seen in
results (Princeton, OUP, UNESCO Silk Roads); Toumanoff's exact range confirmed only at second hand.
