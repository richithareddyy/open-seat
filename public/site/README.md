# Open Seat website

The public website for Open Seat, by Team Southside. Plain HTML, CSS and JavaScript: no build step and no login.

From the repository root:

```sh
npm ci
npm run dev
```

Open http://localhost:3000, which redirects here. The demo calls `/api/try`, so it needs the Next.js server. Served as static files, the page loads but the demo can't answer. Fonts load from Google Fonts, with system fallbacks.

## What's on the page

- The idea in one line, an illustrated hero, the research behind the walk-up problem, and a scroll-driven walkthrough of one arrangement (two solo students, a game that needs exactly two more, a sub on the sideline).
- "Want in? You're Alex": type your terms (Claude reads them, or simple rules without an API key) or use the controls, and take your seat. The what-ifs show the agents reshaping the game. It calls `/api/try`, the same engine as the Discord bot, on a fresh board for each request.
- How to add the bot to any Discord server, and what to type.

All people in the demo are fictional. The page stores nothing in the browser. The server keeps recent IP addresses in memory for its rate limit, and the text Claude reads goes to Anthropic's API.
