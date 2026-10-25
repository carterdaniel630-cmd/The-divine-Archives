# 2026-10-25 ~22:00 UTC — Carter: GitHub "Automatically delete head branches" turned ON

Carter turned on the repo setting (Settings → General → Pull Requests) himself, from his phone, after the loop
explained it could not delete branches. Effect: from now on a PR's head branch is removed by GitHub when the PR is
merged. Runs should expect merged `loop/*` branches to disappear and not write "branch kept" for them.
The 68 already-merged branches (`handoff/archive/branches-merged-2026-10-25.txt`) are NOT affected; deleting them is
still Carter's to do by hand. The loop's own "never delete branches" limit is unchanged.
(Recorded by the loop from Carter's message "its done"; the setting itself could not be checked from this session.)
