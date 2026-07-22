# Repository Working Agreement

These instructions apply to the entire repository.

## Language

- Use English for all repository content, including source code, comments, documentation, commit messages, branch names, pull requests, and issues.
- Do not add Chinese or other non-English prose to tracked files.

## Git workflow

- Never commit directly to `main`.
- Create work branches from the latest `origin/main`.
- Codex-authored branches must use the `codex/` prefix.
- Keep each branch focused on one concern.
- Commit only files that belong to the current change.
- Open a draft pull request for review before merging.
- Merge only after required checks pass and the user explicitly approves the merge.

## Quality gates

- Run `npm test -- --ci`, `npm run typecheck`, and `npm run build:web` before publishing frontend changes.
- Add or update behavior-focused tests when authentication, API access, navigation, or screen state changes.
- Do not call production services from automated tests.
- Do not claim that iOS, Android, or production behavior was verified unless it was actually tested.

## Dependencies and security

- Use `npm ci` for reproducible verification from `package-lock.json`.
- Review dependency updates and their transitive changes before committing them.
- Do not run `npm audit fix --force` without reviewing the proposed breaking upgrades.
- Track unresolved dependency findings in GitHub Issues.

## Documentation and handoff

- Update README or operational documentation when commands or required configuration change.
- Track unfinished, actionable work in GitHub Issues rather than relying on chat history or personal memory.
- Document validation, deployment impact, rollback, and follow-up work in each pull request.
