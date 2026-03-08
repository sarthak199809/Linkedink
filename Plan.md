

# Linkinify — Complete Development Plan

## Tech Stack Decision

| Layer | Choice | Why |
| :-- | :-- | :-- |
| IDE | Google Antigravity | Agent-first, Gemini-native, VS Code fork [^1] |
| Frontend | Next.js 14 (App Router) | Full-stack, SSR, API routes in one repo |
| Backend | Next.js API Routes | Keeps it simple, no separate FastAPI needed |
| Auth | NextAuth.js (Email+Password) | Lightweight, session-based, easy to self-host |
| Primary DB | PostgreSQL (via Docker) | Users, frameworks metadata, posts history |
| Vector DB | **Qdrant** (Docker) | Fastest queries, best filtering, production-ready, Apache 2.0 [^2] |
| LLM | Gemini 1.5 Pro (user's own key) | Matches user's existing workflow |
| Containerization | Docker Compose | All services wired together |

**Why Qdrant over Chroma?** Qdrant runs natively in Docker, has proper multi-tenancy (critical since users are separate), supports metadata filtering (filter frameworks by `user_id`), and is 2-3x faster than Chroma in production. Chroma is better for prototyping but not for a multi-user app.[^2][^3]

***

## Docker Compose Architecture

```yaml
# docker-compose.yml
services:
  app:          # Next.js frontend + API
    port: 3000
  postgres:     # Users, frameworks, post history
    port: 5432
  qdrant:       # Vector embeddings
    port: 6333
```

Three containers. One `docker compose up` and everything runs.

***

## Database Tables (PostgreSQL)

### `users`

```sql
id            UUID PRIMARY KEY
email         TEXT UNIQUE NOT NULL
password_hash TEXT NOT NULL
created_at    TIMESTAMPTZ DEFAULT now()
```


### `api_keys`

```sql
id          UUID PRIMARY KEY
user_id     UUID REFERENCES users(id)
provider    TEXT DEFAULT 'gemini'       -- future-proof
api_key     TEXT NOT NULL               -- encrypted at rest
is_valid    BOOLEAN DEFAULT false       -- updated after connection test
tested_at   TIMESTAMPTZ
created_at  TIMESTAMPTZ DEFAULT now()
```


### `frameworks`

```sql
id              UUID PRIMARY KEY
user_id         UUID REFERENCES users(id)
title           TEXT NOT NULL
summary         TEXT NOT NULL           -- what gets embedded
best_for        TEXT
tags            TEXT[]
tone_profile    TEXT[]
full_data       JSONB NOT NULL          -- complete framework JSON
qdrant_point_id UUID                    -- reference to vector in Qdrant
source_post_url TEXT                    -- original LinkedIn URL if any
source_post_text TEXT                   -- raw pasted text
created_at      TIMESTAMPTZ DEFAULT now()
updated_at      TIMESTAMPTZ DEFAULT now()
```


### `generated_posts`

```sql
id               UUID PRIMARY KEY
user_id          UUID REFERENCES users(id)
framework_id     UUID REFERENCES frameworks(id)
idea_input       TEXT NOT NULL
generated_post   TEXT NOT NULL
match_score      FLOAT                  -- cosine similarity score used
was_edited       BOOLEAN DEFAULT false
final_post       TEXT                   -- post after user edits
created_at       TIMESTAMPTZ DEFAULT now()
```


### `reverse_engineer_prompt` *(system-level, not per-user)*

```sql
id          UUID PRIMARY KEY
prompt_text TEXT NOT NULL               -- the master RE prompt
version     INT DEFAULT 1
is_active   BOOLEAN DEFAULT true
created_at  TIMESTAMPTZ DEFAULT now()
```


***

## Screens \& User Flows

### Screen 1 — Login / Signup

```
┌─────────────────────────────────┐
│  ██ LINKINIFY                   │
│  Make your LinkedIn posts hit.  │
│                                 │
│  [email field]                  │
│  [password field]               │
│                                 │
│  [LOGIN ██████]                 │
│  — or —                         │
│  [CREATE ACCOUNT]               │
└─────────────────────────────────┘
```

- Email + password only. No OAuth.
- On first login → redirect to **Settings** to add Gemini API key
- Empty state: "Add your Gemini API key in Settings before you start →"

***

### Screen 2 — Dashboard (Home)

```
┌──────────────────────────────────────────────────────┐
│  LINKINIFY          [Frameworks] [Generate] [Settings]│
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌─────────────────┐   ┌─────────────────┐          │
│  │ FRAMEWORKS      │   │ POSTS GENERATED │          │
│  │     12          │   │      47         │          │
│  └─────────────────┘   └─────────────────┘          │
│                                                      │
│  RECENT POSTS                                        │
│  ┌──────────────────────────────────────────┐       │
│  │ "Working in Tier-2 cities..."            │       │
│  │ Framework: Contrarian Parable · 94% match│       │
│  │ 2 hours ago              [VIEW] [COPY]   │       │
│  └──────────────────────────────────────────┘       │
└──────────────────────────────────────────────────────┘
```

**Empty state (no frameworks yet):**

```
┌──────────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                  │
│  YOU HAVE NO FRAMEWORKS YET.     │
│  Start by adding a LinkedIn post │
│  to reverse-engineer.            │
│                                  │
│  [+ ADD YOUR FIRST FRAMEWORK]    │
└──────────────────────────────────┘
```


***

### Screen 3 — Frameworks Library

```
┌──────────────────────────────────────────────────────┐
│  FRAMEWORKS                    [+ ADD NEW FRAMEWORK] │
├──────────────────────────────────────────────────────┤
│  🔍 [search frameworks...]                           │
│                                                      │
│  ┌────────────────────────────────────────────┐     │
│  │ ██ CONTRARIAN PARABLE FRAMEWORK            │     │
│  │ Best for: Defending unpopular opinions     │     │
│  │ Tags: [contrarian] [storytelling] [career] │     │
│  │ Added: March 7, 2026                       │     │
│  │                    [VIEW] [EDIT] [DELETE]  │     │
│  └────────────────────────────────────────────┘     │
│                                                      │
│  ┌────────────────────────────────────────────┐     │
│  │ ██ HOOK-INSIGHT-CTA FRAMEWORK              │     │
│  │ ...                                        │     │
│  └────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────┘
```


***

### Screen 4 — Add New Framework (The Reverse Engineer Flow)

This is the most important screen. Two input modes:

```
┌──────────────────────────────────────────────────────┐
│  ADD NEW FRAMEWORK                                   │
├──────────────────────────────────────────────────────┤
│  HOW DO YOU WANT TO ADD?                            │
│                                                      │
│  [PASTE URL]          [PASTE POST TEXT]             │
│   ─────────────────    ──────────────────           │
│   LinkedIn post URL    Raw post content             │
│                                                      │
│  ┌──────────────────────────────────────────┐       │
│  │ Paste LinkedIn URL here...               │       │
│  └──────────────────────────────────────────┘       │
│                                                      │
│  [⚡ REVERSE ENGINEER THIS POST]                    │
└──────────────────────────────────────────────────────┘
```

**Loading state:**

```
┌──────────────────────────────┐
│                              │
│   ◉ Fetching post content    │  ← step 1
│   ◉ Running reverse engine   │  ← step 2 (animated dots)
│   ○ Structuring framework    │  ← step 3 (pending)
│   ○ Saving to library        │  ← step 4 (pending)
│                              │
└──────────────────────────────┘
```

**After processing — Review Screen:**

```
┌──────────────────────────────────────────────────────┐
│  REVIEW BEFORE SAVING                                │
├──────────────────────────────────────────────────────┤
│  TITLE        [Contrarian Parable Framework    ]     │
│  SUMMARY      [Two-archetype story that...     ]     │
│  BEST FOR     [Defending unpopular choices     ]     │
│  TAGS         [contrarian] [+add tag]                │
│                                                      │
│  FULL FRAMEWORK  ▼ (expandable JSON viewer)          │
│  ┌────────────────────────────────────────────┐     │
│  │ {                                          │     │
│  │   "macro_structure": {...},                │     │
│  │   "micro_techniques": {...},               │     │
│  │   ...                                      │     │
│  │ }                                          │     │
│  └────────────────────────────────────────────┘     │
│                                                      │
│  [DISCARD]              [SAVE FRAMEWORK ██████]     │
└──────────────────────────────────────────────────────┘
```


***

### Screen 5 — Generate Post

```
┌──────────────────────────────────────────────────────┐
│  GENERATE A POST                                     │
├──────────────────────────────────────────────────────┤
│  YOUR IDEA                                           │
│  ┌────────────────────────────────────────────┐     │
│  │ Working in Tier-2 cities is actually       │     │
│  │ better for long-term wealth than moving    │     │
│  │ to Bangalore...                            │     │
│  └────────────────────────────────────────────┘     │
│                                                      │
│  FRAMEWORK SELECTION    ● Auto-pick  ○ Manual       │
│                                                      │
│  [⚡ FIND BEST FRAMEWORK & GENERATE]                │
└──────────────────────────────────────────────────────┘
```

**Loading state:**

```
┌──────────────────────────────┐
│   ◉ Embedding your idea...   │
│   ◉ Matching framework...    │
│   ○ Generating post...       │
└──────────────────────────────┘
```

**Result Screen:**

```
┌──────────────────────────────────────────────────────┐
│  ✓ FRAMEWORK MATCHED                                 │
│  Contrarian Parable Framework  ·  94% confidence    │
│  ──────────────────────────────────────────────────  │
│                                                      │
│  GENERATED POST                                      │
│  ┌────────────────────────────────────────────┐     │
│  │ Arjun moved to Indore in 2021.             │     │
│  │ Priya moved to Bangalore.                  │     │
│  │                                            │     │
│  │ Everyone called Priya brave.               │     │
│  │ Everyone called Arjun comfortable.         │     │
│  │ ...                                        │     │
│  └────────────────────────────────────────────┘     │
│                                                      │
│  [EDIT]  [COPY TO CLIPBOARD]  [REGENERATE]          │
│                                                      │
│  ⚠ Low confidence? [Pick a different framework]     │
└──────────────────────────────────────────────────────┘
```

**Low match empty state (score < 0.60):**

```
┌───────────────────────────────────┐
│  ⚠ NO GOOD FRAMEWORK MATCH       │
│  Best score: 41%                  │
│                                   │
│  Your idea might need a new       │
│  framework style. Options:        │
│                                   │
│  [PICK MANUALLY FROM LIBRARY]     │
│  [ADD A NEW FRAMEWORK FIRST]      │
└───────────────────────────────────┘
```


***

### Screen 6 — Settings Panel

```
┌──────────────────────────────────────────────────────┐
│  SETTINGS                                            │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ██ GEMINI API KEY                                   │
│  ┌──────────────────────────────────────────┐       │
│  │ AIzaSy••••••••••••••••••••••••••••••••  │       │
│  └──────────────────────────────────────────┘       │
│  [UPDATE KEY]         [⚡ TEST CONNECTION]          │
│                                                      │
│  Connection status:  ✓ CONNECTED  (tested 2hr ago)  │
│                                                      │
│  ────────────────────────────────────────────────   │
│                                                      │
│  ██ ACCOUNT                                         │
│  Email: sarthak@example.com                         │
│  [CHANGE PASSWORD]        [DELETE ACCOUNT]          │
│                                                      │
│  ────────────────────────────────────────────────   │
│                                                      │
│  ██ DANGER ZONE                                     │
│  [DELETE ALL FRAMEWORKS]  [DELETE ALL POSTS]        │
└──────────────────────────────────────────────────────┘
```

**Test Connection loading:**

```
[⚡ TESTING...]  →  ✓ CONNECTED. Model: gemini-1.5-pro
                 →  ✗ INVALID KEY. Check and retry.
```


***

## Complete Data Flow Diagrams

### Flow A — Reverse Engineering a Post

```
User pastes URL or text
        ↓
[IF URL] → API route scrapes LinkedIn URL 
           (Playwright in Docker or Firecrawl API)
        ↓
Raw post text sent to Gemini with master RE prompt
        ↓
Gemini returns structured JSON framework
        ↓
Show user Review Screen (editable)
        ↓
User confirms → 
  ├─ INSERT into PostgreSQL `frameworks` table
  ├─ Concatenate (title + summary + best_for + tags)
  ├─ Call Gemini Embeddings API → get vector[^768]
  └─ UPSERT into Qdrant with {user_id, framework_id} as payload
```


### Flow B — Generating a Post

```
User types idea + clicks Generate
        ↓
Call Gemini Embeddings API on the idea text → vector
        ↓
Query Qdrant: 
  filter by payload.user_id = current_user
  cosine similarity search → top 2 results + scores
        ↓
If score > 0.82 → auto-select top result
If 0.60-0.82   → show both options, user confirms
If < 0.60      → show "no match" empty state
        ↓
Fetch full framework JSON from PostgreSQL by framework_id
        ↓
Build LLM prompt:
  SYSTEM: [strict framework injection]
  USER: [idea + step-by-step instruction]
        ↓
Stream Gemini response to UI
        ↓
INSERT into `generated_posts` table
  (user_id, framework_id, idea, output, match_score)
```


### Flow C — Settings / API Key Test

```
User enters Gemini API key → clicks Test
        ↓
API route makes a minimal Gemini call (single token generation)
        ↓
Success → encrypt key → UPSERT into `api_keys` table
          set is_valid=true, tested_at=now()
Failure → show error, do not save
        ↓
All subsequent LLM calls fetch the key from `api_keys` 
for the authenticated user_id — never exposed to frontend
```


***

## Neo Brutalism UI System

Apply these rules consistently across all screens:[^1]

- **Background**: `#F5F0E8` (off-white/cream)
- **Cards**: White fill, `3px solid #000000` border, `4px 4px 0px #000000` box shadow
- **Primary buttons**: `#000000` background, white text, no border radius, hover → shift shadow
- **Accent buttons**: `#FFE500` (yellow), black border, black text
- **Danger buttons**: `#FF3B30` background, white text
- **Typography**: `Space Grotesk` (headings) + `Inter` (body)
- **Input fields**: `2px solid #000` border, `0px` border radius, focus → `3px solid #000`
- **Tags/badges**: Colored fill, `1.5px solid #000`, slight rotation (`rotate: -1deg`) on hover
- **Loading states**: Chunky animated progress bars (not spinners), black fill progressing left to right

***

## Antigravity Development Prompts (How to Build This)

Since you're using Google Antigravity, here are the agent prompts to use in sequence:[^4]

1. **"Set up a Next.js 14 project with Docker Compose including PostgreSQL and Qdrant containers. Create the docker-compose.yml and all connection configs."**
2. **"Create NextAuth.js email/password authentication with a PostgreSQL adapter. Create the users and sessions tables."**
3. **"Create all PostgreSQL tables: users, api_keys, frameworks, generated_posts, reverse_engineer_prompt with the exact schemas I'll provide."**
4. **"Build the Settings page with Gemini API key input, test connection button, and encrypted storage in the api_keys table."**
5. **"Build the Add Framework screen with URL/text input, Gemini reverse-engineering call, review screen, and Qdrant embedding + upsert pipeline."**
6. **"Build the Generate Post screen with idea input, Qdrant cosine similarity search filtered by user_id, framework selection logic, and Gemini generation with full framework injection."**
7. **"Apply Neo Brutalism styling across all components using the color system and typography specified."**

Each prompt builds on the last — Antigravity's agent will read the existing code and extend it correctly.[^5]
<span style="display:none">[^10][^11][^12][^13][^14][^15][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://en.wikipedia.org/wiki/Google_Antigravity

[^2]: https://getathenic.com/blog/pinecone-vs-weaviate-vs-qdrant-vs-chroma-vector-search

[^3]: https://www.linkedin.com/posts/anaranje_vectordatabases-rag-llm-activity-7426277623917518848-Vazm

[^4]: https://www.codecademy.com/article/how-to-set-up-and-use-google-antigravity

[^5]: https://www.infoworld.com/article/4096113/a-first-look-at-googles-new-antigravity-ide.html

[^6]: https://antigravity.google

[^7]: https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/

[^8]: https://codelabs.developers.google.com/getting-started-google-antigravity

[^9]: https://www.youtube.com/watch?v=JzazqN-pUUE

[^10]: https://localaimaster.com/blog/vector-databases-comparison

[^11]: https://www.youtube.com/watch?v=XIiHfo1WIxM

[^12]: https://liquidmetal.ai/casesAndBlogs/vector-comparison/

[^13]: https://www.youtube.com/watch?v=_G00r4phw-Y

[^14]: https://www.firecrawl.dev/blog/best-vector-databases

[^15]: https://www.youtube.com/watch?v=vjMqV5awh80

