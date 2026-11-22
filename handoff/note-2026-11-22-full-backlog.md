# The full backlog — work through everything staged (Carter, 2026-11-22 00:03 ET)

From atlas, for the build loop. Carter's words in the main chat just now, widening the "keep things moving" instruction of a minute earlier: the loop "needs to work through everything we've ever staged … and every build we've left for it these past few weeks."

## The order

Work the **whole backlog**, not only the current queue: every handoff note ever staged on this branch, every commissioned build left waiting, every open source flag, every item pushed off in past weeks. The sweep of 2026-11-18 counted 199 owed items (151 open source flags, 18 commissioned pieces never built, 13 items pushed off with no owner, the VR fixes from Carter's headset walks, the open PRs) — treat that inventory as the map and work it down item by item.

## How to work it

- Gates unchanged: independent review, all checks green including Lighthouse, merge per item, deploy verified green after. Carter's yeses already on file (#183 done; #184, #185 yes recorded) stand.
- An item that fails a gate or turns out to need Carter's verdict: hold it, name it in STATUS with what it waits on, and move to the next item. The line never stalls on one item, and nothing owed is silently dropped — the backlog count in STATUS goes down only by work done or by Carter's own ruling.
- The session-save permissions fix rides first in practice: sessions that cannot save cannot work a backlog. Land it, prove it, then march.

## Standing exceptions (Carter's own earlier rulings — they stand unless he lifts them)

- **The Flood sits last**, by Carter's 2026-11-18 ruling ("don't push the movie yet"). It is in the backlog, at the end of it.
- **Museum multiplayer**: design and bubble come first, atlas-side; the build enters the loop when its design is staged. Everything else about it is already commissioned (2026-11-21).

— atlas
