# Open Seat

There’s a pickup game on campus with room for two more, but you don’t want to be the only newcomer. Someone else feels the same way. Open Seat gives each student a private agent, their own DM thread with a Discord bot, that helps find a plan they can both join.

Built by **Charith Kutikuppala and Richitha Rekula**, Team Southside, for DevHacks S3 / the Cubbie Hackathon’s agent-to-agent coordination track.

[Try the website](https://open-seat-asu.vercel.app) · [Watch the demo](https://open-seat-asu.vercel.app/demo) · [Add the Discord bot](https://discord.com/oauth2/authorize?client_id=1563729007642677338&scope=bot&permissions=68608)

## An example

A group is playing 3v3 and could switch to 4v4. Two students want to join, but one needs to leave early. Open Seat looks for a plan with both newcomers and a substitute for the early departure. The substitute is asked first, and only if someone has to leave early. Then the captain and every newcomer must say yes before the arrangement is final.

In Discord, someone in the group mentions the bot with the plan and becomes its captain. A student can DM something like:

> basketball, beginner, free till 2:30, not if I’m the only new one

The bot repeats the terms back, and they count once the student replies yes.

## How it works

Claude reads DMs and group posts into structured terms. If it’s unavailable, a rule-based reader takes over. TypeScript code then checks the activity, times, skill level, exact group size, newcomer preferences, and substitutions. The model doesn’t choose the arrangement.

The agents aren’t separate models. One engine on the server compares everyone’s approved terms and records the steps as availability and conditional offers, leaving out students’ words, reasons, and skill levels. Newcomers’ names are shared with the people in the plan once the captain and every newcomer confirm. The captain, the substitute, and the place are already visible in the group’s post.

Unanswered Discord requests expire after about 10 minutes. If a newcomer or substitute cancels, the engine looks for a new arrangement.

On the website you play Alex against fictional people who answer automatically.

The app uses **Next.js, TypeScript, discord.js, Zod, and the Anthropic SDK**. The website is on Vercel. The Discord bot runs inside the Next.js server process and needs a host that stays running.

## Run locally

Needs Node 20.19+, 22.12+, or 24+.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

The website runs at http://localhost:3000. Every setting in `.env.local` is optional:

- `ANTHROPIC_API_KEY`: without it, messages are read by the rules.
- `ANTHROPIC_MODEL`: the model that reads messages, `claude-haiku-5-5` by default.
- `DISCORD_BOT_TOKEN`: without it, the Discord bot stays off.

Run `npm test` for the matching, conversation, message reading, and rate limit tests.

## Limits and privacy

- The website reads 8 messages per IP address per minute, counted separately on each server instance. Discord reads 6 DMs per person per minute.
- Plans are for the same day, in Arizona time. A plan fills a group’s seats exactly and allows at most one early departure, covered by a substitute.
- Terms and groups are held in memory, so a restart clears them. The text Claude reads goes to Anthropic’s API.
- Persistent storage, verified campus identities, and real campus activity feeds are future work.

[Full example, architecture, and hackathon rubric](GUIDE.md) · [Architecture diagram](docs/architecture.svg) · [MIT license](LICENSE)
