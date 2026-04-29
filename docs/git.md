# Git commits

Short **imperative** subject line, optional prefix:

- `docs` — documentation only  
- `feat` — user-visible behavior  
- `fix` — bugfixes  
- `chore` — tooling, deps, formatting  
- `test` — tests only  

Enable this repo’s commit template once per clone:

```bash
git config commit.template .gitmessage
```

That opens the template when you run `git commit` with no `-m`. You can still use `git commit -m "docs: …"` anytime.
