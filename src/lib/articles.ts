import type { Article, ArticleSummary } from "@/types/article";

/**
 * Data-access layer for articles. Every page / API route should import from
 * here instead of reading files or hitting a DB directly. This keeps the
 * source swappable (MDX on disk -> CMS -> database) without touching UI.
 *
 * All functions are async on purpose so they can later be backed by I/O
 * (`fs`, `fetch`, ORM) without changing call sites. The current data is
 * an in-memory stub used for the launch design.
 */

const articles: Article[] = [
  {
    slug: "first-principles-product-growth-loops",
    title: "The First Principles of Product Growth Loops",
    subtitle:
      "Why the best compounding products don't rely on funnels — they rely on loops.",
    description:
      "A practical re-derivation of the growth-loop thesis, with worked examples from Notion, Figma, and Canva, and a checklist to audit your own loops.",
    category: "Strategy",
    publishedAt: "2026-03-18",
    author: {
      name: "Mira Khanna",
      role: "Growth Editor",
      bio: "Former Head of Growth at two consumer SaaS companies. Writes about compounding mechanics and the math behind durable products.",
    },
    readingTime: 11,
    tags: ["Growth", "Loops", "Strategy"],
    hueSeed: 262,
    featured: true,
    keyTakeaways: [
      "Funnels are linear; loops reinvest their own output.",
      "Every durable loop has four parts: input, action, reward, reinvestment.",
      "Audit a loop by asking what breaks if you remove each step.",
    ],
    content: `
      <p>Most product teams inherit a funnel. A funnel is a convenient fiction — a way to slice a messy user journey into tidy stages so the team can argue about conversion rates at each one. Funnels are fine. They are also, structurally, the opposite of what you want.</p>
      <p>A <strong>loop</strong> is a system where the output of one cycle is invested as the input of the next. It compounds. A funnel, by contrast, leaks — each stage loses users, and once they're out, they're out. The difference matters more than any growth hack your team will try this quarter.</p>

      <h2>What makes a loop a loop</h2>
      <p>Every durable product growth loop has four structural components. You can map your own loops onto this skeleton and see immediately what's missing.</p>
      <ul>
        <li><strong>Input</strong> — the user or artifact that enters the system.</li>
        <li><strong>Action</strong> — what the user does that creates value.</li>
        <li><strong>Reward</strong> — what the user gets back.</li>
        <li><strong>Reinvestment</strong> — how the reward becomes new input.</li>
      </ul>

      <blockquote>If removing any of the four steps doesn't kill the loop, you're looking at a funnel dressed up in loop clothing.</blockquote>

      <h2>A worked example: Figma</h2>
      <p>Consider the collaboration loop in Figma. The <code>multiplayer</code> primitive turns every file into a recruitment artifact. An engineer opens a design; to comment, they create an account; to iterate, they invite their PM; the PM invites their team. The reward (faster, cleaner handoff) creates the reinvestment (new accounts).</p>
      <p>Notice the step nobody talks about: <em>the artifact itself</em> is the input. Figma's loop works because the file is the unit of work, not the user. This generalises.</p>

      <h2>Auditing your own loops</h2>
      <p>Sit with your team for an hour. Draw every mechanism you believe is a loop. For each one, ask:</p>
      <ol>
        <li>What is the input? If you can't name it, it isn't a loop.</li>
        <li>What is the user getting? If it's "they feel good," keep digging.</li>
        <li>How does the output re-enter as input? If the answer is "we email them," that's a funnel.</li>
      </ol>
      <p>The loops you can't defend are the ones you'll cut. The ones you can defend become the axis around which the next roadmap is built.</p>
    `,
  },
  {
    slug: "technical-debt-is-product-debt",
    title: "Why Your Technical Debt Is Actually Product Debt",
    subtitle:
      "The engineering team is not wrong about velocity. They're naming the wrong problem.",
    description:
      "Most 'tech debt' shows up in the codebase but lives in the product decisions that shaped it. A framework for naming the real debt before you refactor the wrong thing.",
    category: "Engineering",
    publishedAt: "2026-02-27",
    author: {
      name: "Daniel Osei",
      role: "Contributing Editor",
      bio: "Staff engineer turned PM. Writes about the fuzzy membrane between product decisions and architectural consequences.",
    },
    readingTime: 8,
    tags: ["Engineering", "Debt", "Architecture"],
    hueSeed: 210,
    keyTakeaways: [
      "Most tech debt is product debt with better lighting.",
      "Refactors that don't rename the product assumption always return.",
      "Name the product decision first. Then decide whether to pay.",
    ],
    content: `
      <p>Every quarter, some engineer stands up in planning and uses the phrase <em>technical debt</em>. What they mean, almost always, is that a decision made somewhere upstream — by a product manager, a designer, a founder — has metastasised into a constraint the code can't work around anymore.</p>
      <p>Calling it technical debt is polite. It puts the problem inside the codebase, where engineers can solve it without anyone having to admit the product was wrong. This politeness is expensive.</p>

      <h2>The two kinds of debt</h2>
      <p>Real technical debt exists — shortcuts taken because it was Friday, abstractions that aged badly, dependencies that went stale. Call this <code>code debt</code>. It's real; it's fixable; a refactor makes it go away.</p>
      <p>The other kind — the kind that keeps coming back after each refactor — is <strong>product debt</strong>. It's the residue of a decision: "we'll assume every user has exactly one workspace," "we'll treat invoices as immutable," "we'll ship without a concept of roles." The code expresses the decision. The decision is the debt.</p>

      <h2>How to tell the difference</h2>
      <p>Ask the question that makes PMs uncomfortable: <em>if we rewrote this module from scratch, knowing what we know now, would we write it the same way?</em></p>
      <ul>
        <li>If yes — it's code debt. Refactor it.</li>
        <li>If no — it's product debt. The refactor will be wasted unless you name and revisit the product assumption first.</li>
      </ul>

      <blockquote>A refactor is a promise to your future team that you'll let them pay the debt once. Paying it twice is on you.</blockquote>

      <h2>What to do on Monday</h2>
      <p>Make a list of the three most painful areas of your codebase. Next to each, write a sentence that starts with "We decided…" If you can't finish the sentence, you have code debt. If you can, you have product debt and a conversation to have with your team.</p>
    `,
  },
  {
    slug: "managing-executive-stakeholders",
    title: "The Art of Saying No to Executive Stakeholders",
    subtitle:
      "Most PMs think their job is to ship what leadership asks for. Their job is to ship what leadership <em>meant</em>.",
    description:
      "A field guide to disagreeing upward without becoming the person who always says no. Includes the three questions to ask before you agree to anything.",
    category: "Leadership",
    publishedAt: "2026-02-09",
    author: {
      name: "Priya Anand",
      role: "Leadership Editor",
      bio: "Two-time VP of Product. Coaches PM leaders on the part of the job that isn't written down.",
    },
    readingTime: 7,
    tags: ["Leadership", "Stakeholders", "Influence"],
    hueSeed: 320,
    content: `
      <p>Your CEO walks over. She has An Idea. She wants it in the roadmap. You have two options and you already know them: you can say yes and resent it, or you can say no and be branded as The Person Who Doesn't Get It.</p>
      <p>There is, thankfully, a third option. It requires you to stop treating the request as a binary.</p>

      <h2>What they are actually asking for</h2>
      <p>Executives almost never ask for the thing they want. They ask for a proxy for the thing they want, because the real thing is harder to articulate. The request is the surface; your job is to surface the outcome underneath it.</p>
      <ul>
        <li><strong>Ask once:</strong> "What would it unlock if we shipped this?"</li>
        <li><strong>Ask twice:</strong> "If we couldn't ship that specific thing — what's the next best way to unlock that outcome?"</li>
        <li><strong>Ask thrice:</strong> "What would make you confident we got there, even if the solution looked different?"</li>
      </ul>

      <blockquote>A great PM doesn't ship what they're asked for. They ship what was meant — and make the stakeholder feel heard in the process.</blockquote>

      <h2>Saying no without saying no</h2>
      <p>The word "no" is rarely useful with executives. What works is <em>reframing</em>: "Yes, and here are three ways to get there — here's the one I'd bet on, and why." You haven't disagreed. You've raised the resolution of the conversation.</p>
    `,
  },
  {
    slug: "github-agent-as-threat-actor",
    title: "How GitHub Treats Its Own AI Agent as a Threat Actor",
    subtitle:
      "Inside the security model that assumes your coding agent will try to exfiltrate your repo.",
    description:
      "GitHub's product security team built Copilot Agent on the assumption it could be compromised on any given prompt. A tour of the assumptions, the controls, and why every AI-native product team should borrow them.",
    category: "Security",
    publishedAt: "2026-01-21",
    author: {
      name: "Hiro Tanaka",
      role: "Security Editor",
      bio: "Former staff security engineer. Writes about the widening surface area where product and security decisions overlap.",
    },
    readingTime: 9,
    tags: ["AI", "Security", "Product"],
    hueSeed: 150,
    keyTakeaways: [
      "Treat agents as semi-trusted — neither user nor attacker.",
      "Scope, don't sanctify: every capability needs a blast radius.",
      "The product surface is now the threat surface.",
    ],
    content: `
      <p>In the room where GitHub's Copilot Agent was hardened, the working assumption was simple and uncomfortable: <strong>the agent is a threat actor</strong>. Not malicious. Not adversarial. But compromiseable — by a prompt injection, a poisoned README, a cleverly-named dependency — and therefore, on any given task, capable of the things a real threat actor would do.</p>
      <p>That framing changes everything about how you build the product.</p>

      <h2>The three assumptions</h2>
      <ol>
        <li><strong>Any prompt can be hostile.</strong> Not just the user's — any string the agent ingests, including the contents of a pull request, a Jira ticket, or a file it opens.</li>
        <li><strong>Any tool call can be weaponised.</strong> The agent's ability to run commands is a capability, and capabilities have blast radii.</li>
        <li><strong>The product surface is the threat surface.</strong> Every new feature the agent can invoke is a new way an attacker can reach through the agent to touch your infrastructure.</li>
      </ol>

      <blockquote>If you wouldn't let a contractor with an unknown background run this command unsupervised, don't let the agent do it either.</blockquote>

      <h2>What this means for PMs</h2>
      <p>If you ship AI-native features, your product reviews now include a threat model. Not as a separate step run by a separate team — as a step you run, because the capabilities you approve are the attack surface you authorise.</p>
      <p>This is the new shape of the job.</p>
    `,
  },
];

export async function getAllArticles(): Promise<ArticleSummary[]> {
  return [...articles]
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    .map(({ content: _content, ...summary }) => summary);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return articles.find((a) => a.slug === slug) ?? null;
}

export async function getAllArticleSlugs(): Promise<string[]> {
  return articles.map((a) => a.slug);
}

export async function getRelatedArticles(
  slug: string,
  limit = 3,
): Promise<ArticleSummary[]> {
  const all = await getAllArticles();
  return all.filter((a) => a.slug !== slug).slice(0, limit);
}
