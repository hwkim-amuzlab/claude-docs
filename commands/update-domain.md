Apply targeted changes to an existing domain's layers without regenerating the whole domain.

## Usage

/update-domain <domain-name>

---

## Step 0 — Understand What Changed

Ask the user what needs to change before touching any file.

---

## Step 1 — Classify and Confirm

Read `.claude/rules/update-patterns.md` and identify which case applies. If the change spans multiple cases, combine the affected layers.

Report to the user: the change type, layers that will be modified, and layers that will not be touched. Wait for confirmation before editing.

---

## Step 2 — Read Before Editing

Read every file that will be modified before making any changes. This prevents accidental overwrites of existing logic.

---

## Step 3 — Apply Changes

Follow the layer order defined in `update-patterns.md` for the identified case. Read the relevant rule file before editing each layer. Only touch layers listed in Step 1.

---

## Step 4 — Update Tests

Update the corresponding skeleton test file for each modified layer. If a skeleton test file does not exist yet, create one following the guidelines in `commands/build-domain.md` Phase 3.

---

## Step 5 — Verify

Run `npm run typecheck` and `npm run test`. Fix all errors before finishing.

Print a brief summary: change type, files modified with a one-line description each, and layers left untouched.
