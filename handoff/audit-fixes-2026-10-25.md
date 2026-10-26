# Site-audit fixes — handoff to the build loop

**Source:** complete site audit delivered 2026-10-25 ~20:40 ET (fresh crawl the same evening: 205 pages, all status 200, nothing on the site broken). This file carries ONLY the fix items from that audit. It is staging instructions, not a merge approval — nothing here goes live without Carter's per-item merge approval, and every fix still needs its own independent review with all checks green.

**Audit headline to respect:** the live site is healthy. Vault takedown is clean (87 objects, honest absence page), Pilgrimage is honest (3 sites open), the 12 games check out, the "Ouija" truth flags were false alarms (two factual historical mentions only), and server speed is healthy. Do not re-litigate those; fix only what is listed below.

## Fix 1 — README is stale (owner: build loop; integrity, paperwork only)

File: `README.md` (repo root). Three things in it are wrong:

1. **Pending-chapter list is wrong.** Its list (Batch IV ch75–ch83 plus ch45/ch46) does not match the live site. The REAL pending set is 18 chapters: **ch02, ch08, ch11, ch12, ch19, ch20, ch21, ch42, ch44, ch47, ch50, ch51, ch52, ch53, ch60, ch61, ch69, ch74**. The README's pending list must be replaced with exactly this set. Note: pending chapters carry a visible "Recently added · pending review" banner on the live page — that banner system is correct and stays; only the README's list is wrong.
2. **Vault count is wrong.** The README says 88 Vault entries. Live count is **87** after the Tjurunga takedown went live 2026-10-24 (PR #73). Correct to 87.
3. **Pilgrimage count is wrong.** The README says 1 pilgrimage site open. Live count is **3** open. Correct to 3.
4. **Share-image sentence is wrong.** The README says every page has a share image. Six pages do not (see "NOT in this package" below). Correct the sentence to say share images are still being picked — do NOT invent or add share images yourself.

## Fix 2 — ch19 closing honesty section skips two sections (owner: build loop)

Page: ch19, Rabbinic Judaism. Its closing honesty section never assesses the claims of its own **Seder** section and its own **Karaite** section. Extend the closing section so it assesses those two sections' claims the same way it assesses the rest of the chapter. Nothing else in the chapter changes under this fix.

## Fix 3 — ch19 typo (owner: build loop; rides with Fix 2)

Page: ch19. Fix the stray space in **"cross- references"** — it must read **"cross-references"**.

## Fix 4 — ch19 leans on Wikipedia (owner: build loop; loop's judgment call, NOT a hidden error)

Page: ch19. Six Wikipedia links sit among roughly 20+ sources, on load-bearing topics (Oral Torah, Judah ha-Nasi). The chapter already discloses this itself, and it also cites Britannica, books, and primary sources. This is a quality note, not a concealed mistake: use the loop's judgment on whether and how to lighten the Wikipedia reliance (stronger non-Wikipedia sourcing on those topics where available). Do not silently strip sources or claims.

## Fix 5 — Era pages list every cross-era theme (owner: build loop)

Pages: the era pages under `eras/` (confirmed on Prehistory and Late Antiquity; check all era pages, not just those two). Each era page's section labelled "comparative themes" lists every cross-era theme, so it reads as "themes of this age" even though nothing stated is false. Fix = a clearer label for that section, making plain that these are comparative themes from across eras, not themes belonging to this age. Wording fix only; no theme is removed or reassigned.

## Fix 6 — Games sourcing claim could be misread (owner: build loop; optional, not urgent)

Page: homepage. The claim "every fact sourced to a chapter" is literally true and holds. The wrinkle: the trivia game draws from the whole archive, so some of its questions come from pending chapters. Optional wording clarification only (for example, noting the trivia game draws archive-wide, including pending chapters). Do not change the games themselves, and do not treat this as an error.

## Fix 7 — Graphify data is stale (owner: backstage upkeep, no Carter decision needed)

The Graphify data file is from 2026-10-19–20 and is stale: Vault 88 → 87, Pilgrimage 1 → 3 open, and the pending-chapter list has changed completely since (see Fix 1 for the real pending set). Refresh the data before anyone leans on it for decisions. The Graphify tool itself is sound; only its data needs refreshing.

## Fix 8 — Repo default-branch note (owner: build loop, hygiene; FLAGGED, UNVERIFIED)

The README itself says the default branch is still an old session branch while production is `main`. This is flagged but NOT verified — confirm it before any workflow plans depend on it. Hygiene only.

## NOT in this package (do not build these)

- **Share images for 6 pages are Carter's pick, not the loop's.** Pages with no og:image: `museum.html`, `random.html`, `pilgrimage.html`, `pilgrimage/great-pyramid.html`, `pilgrimage/library-of-alexandria.html`, `pilgrimage/qumran-caves.html`. Pages with no og:description: the same list minus `pilgrimage.html`. Carter picks those images himself; the loop must not invent, generate, or assign them.
- **Browser-walk items from the audit** (nav/footer differences between pages, wording inside the Alexandria + Qumran 3D models' info points, browser-side speed since speed fix A, Pantheon 199 / Museum 83 recounts, secondary watchdogs last run Oct 19) were offered to Carter for a real-browser walk and are NOT part of this package unless he says so.

## Order of work

Fix 1 first (it is the integrity item — the README is what other readers trust). Fixes 2 + 3 together (same chapter). Fix 5 next. Fixes 4 and 6 at the loop's judgment. Fix 7 as backstage upkeep alongside. Fix 8 whenever hygiene is next touched. Each fix: own branch, full checks, independent review, then Carter's per-item merge approval — no fix goes live on this handoff alone.
