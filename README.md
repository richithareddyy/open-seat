# Open Seat

There’s a pickup game on campus with room for two more, but you don’t want to be the only newcomer. Someone else feels the same way. Open Seat gives each student a private agent that helps find a plan they can both join.

Built by **Charith Kutikuppala and Richitha Rekula**, Team Southside, for DevHacks S3 / the Cubbie Hackathon’s agent-to-agent coordination track.

[Try the website](https://open-seat-asu.vercel.app) · [Watch the demo](https://open-seat-asu.vercel.app/demo) · [Add the Discord bot](https://discord.com/oauth2/authorize?client_id=1563729007642677338&scope=bot&permissions=68608)

## An example

A group is playing 3v3 and could switch to 4v4. Two students want to join, but one needs to leave early. The agents look for a plan with both newcomers and a substitute for the early departure. Everyone involved must confirm before the arrangement is final.

In Discord, a group mentions the bot with its plan. A student can DM something like:

> basketball, beginner, free till 2:30, not if I’m the only new one

## How it works

Claude reads the message into structured preferences. TypeScript code checks availability, group size, newcomer preferences, and substitutions. The model doesn’t choose the arrangement.

Agents exchange availability and conditional offers. Names are shared after everyone confirms; personal reasons and skill levels are kept out of those exchanges. Unanswered requests expire, and a cancellation can reopen a seat.

The app uses **Next.js, TypeScript, discord.js, and the Anthropic SDK**. The website includes a demo; Discord runs the conversation flow.

## Run locally

```sh
npm ci
cp .env.example .env.local
npm run dev
npm test
```

Add `ANTHROPIC_API_KEY` and `DISCORD_BOT_TOKEN` to `.env.local`. The website opens at http://localhost:3000, alongside the Discord bot. Tests cover matching and conversation behavior.

State is held in memory. Persistent storage, verified campus identities, and real campus activity feeds are future work.

[Full example, architecture, and hackathon rubric](GUIDE.md) · [Architecture diagram](docs/architecture.svg) · [MIT license](LICENSE)
