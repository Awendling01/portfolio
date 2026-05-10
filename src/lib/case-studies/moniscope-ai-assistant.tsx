import type { CaseStudy } from "./index";
import {
  Diagram,
  DiagramBox,
  DiagramArrow,
  DiagramStep,
  DiagramCode,
  DiagramHeading,
  DiagramHint,
} from "@/components/case-study/diagram";

export const aiAssistant: CaseStudy = {
  slug: "ai-assistant",
  number: "01",
  title: "AI assistant: deterministic brain, AI as fallback",
  shortTitle: "AI Assistant",
  oneLiner:
    "Most user questions are answered by a PHP intent classifier + handler registry. Anthropic only fires for unrecognized free-form queries — and then sandboxed to a PolicyGuard-filtered FactPack.",
  lede:
    "Most user questions are answered by deterministic PHP — never reach the LLM. An intent classifier (30+ intents, regex + keyword scoring with negative patterns) routes to a handler registry that builds answers from a curated, RBAC-filtered FactPack of database rows. Anthropic only fires for unrecognized queries — and then sandboxed to \"answer ONLY using the data provided below,\" no tools. ~3,400 LOC of AI-specific PHP across 30+ files, behind a provider-swappable `AiProviderInterface` (OpenAI swap is one binding line).",
  pullQuote:
    "The default LLM-app pattern is \"wrap a model and hope.\" This pipeline does the opposite: classify deterministically, answer deterministically, and keep the LLM in a sandbox where it can paraphrase but can't fabricate or act.",
  prelaunchNote:
    "MONISCOPE is pre-launch — no live tenants yet. The assistant is designed to support staff and tenants once onboarded. Anthropic API integration is fully wired; the product surface is dev-seeded.",
  whereSection: {
    tag: "How a message resolves",
    heading: "Three answer types, recorded per message",
  },
  whereItShowsUp: {
    kind: "answer-types",
    intro:
      "Every assistant message lands in `ai_chat_messages` with one of three `answer_type` values. The split is the architecture's KPI — measure it, and you measure how often the deterministic path is winning.",
    types: [
      {
        ic: "∅",
        iconColor: "green",
        name: "brain_deterministic",
        desc: "Handler returned an answer from the FactPack. Zero LLM tokens. Most messages.",
      },
      {
        ic: "⌁",
        iconColor: "accent2",
        name: "brain_ai_fallback",
        desc: "Handler returned null. Anthropic called with a sandboxed prompt — FactPack only, no tools.",
      },
      {
        ic: "!",
        iconColor: "rose",
        name: "escalated",
        desc: "Hard-block matched (liability, security, prompt injection). Canned safe response, audit row, never reached LLM.",
      },
    ],
  },
  whySection: {
    tag: "The engineering \"why\"",
    heading: "Six things that make this more than a chat wrapper",
  },
  whyTiles: [
    {
      number: 1,
      title: "Deterministic-first inverts the usual LLM stack",
      body: "Most \"what are your hours?\" / \"what do I owe?\" questions resolve in <1ms with zero tokens, full output control, and same-input-same-output testability. The LLM is plan B, not the centerpiece.",
      ref: "snippet 01",
    },
    {
      number: 2,
      title: "The intent classifier earns its keep",
      body: "Keyword + regex scoring with NEGATIVE patterns. \"code review\" doesn't classify as `facility.reviews`; \"locked out\" doesn't classify as `facility.access`. Calibrated, debuggable, no model.",
      ref: "snippet 02",
    },
    {
      number: 3,
      title: "PolicyGuard is the trust layer",
      body: "RBAC happens at the data layer, not the prompt. Sections of the FactPack the caller can't see are stripped before any handler — or any LLM — touches them. Even a jailbroken prompt can't leak what isn't there.",
      ref: "in full case study",
    },
    {
      number: 4,
      title: "The AI fallback is a sandbox",
      body: "When the model runs, the system prompt is: \"Answer ONLY using the data provided below.\" No tools. The FactPack is the entire universe of facts. The model can paraphrase; it can't fabricate or act.",
      ref: "snippet 03",
    },
    {
      number: 5,
      title: "Tools reserved for one specific path",
      body: "The 3-turn agentic loop with 8 DB-backed tools only fires when staff ask something the classifier doesn't recognize. Permission allowlist is checked BEFORE the owner-role bypass — hallucinated tool names are denied even for the highest-tier user. Tenants and prospects never reach this path.",
      ref: "in full case study",
    },
    {
      number: 6,
      title: "Hard-blocks short-circuit before any of this runs",
      body: "Eight categories (liability, security, structural, pest, flood, camera footage, guarantees, prompt injection) route straight to a canned response with a `hard_block_matched` audit key. Saves tokens, removes liability surface area, creates an audit trail in one move.",
      ref: "in full case study",
    },
  ],
  architectureSection: {
    tag: "Architecture",
    heading: "The pipeline, top to bottom",
  },
  architectureDiagram: (
    <Diagram>
      <DiagramBox label="Browser (Vue)" tone="neutral">
        <DiagramStep>
          <DiagramCode>fetch(&apos;/admin/ai-chat/stream&apos;)</DiagramCode>{" "}
          → reads SSE
        </DiagramStep>
      </DiagramBox>

      <DiagramArrow />

      <DiagramBox label="Laravel" tone="neutral">
        <DiagramStep>
          <DiagramCode>AiPiiRedactionMiddleware</DiagramCode>{" "}
          <DiagramHint>← scrub PII (in + out + persistence)</DiagramHint>
        </DiagramStep>
        <DiagramStep>
          <DiagramCode>AiChatController</DiagramCode> →{" "}
          <DiagramCode>BrainService::stream(user, message, context)</DiagramCode>
        </DiagramStep>
      </DiagramBox>

      <DiagramArrow />

      <DiagramBox label="BrainService::stream — pipeline" tone="accent">
        <DiagramStep n={1}>
          <DiagramCode>checkHardBlocks</DiagramCode> — matched? canned
          response, audit, done
        </DiagramStep>
        <DiagramStep n={2}>
          rate limit + token-budget check — over hard? abort
        </DiagramStep>
        <DiagramStep n={3} hint="pure PHP · ~0.1ms">
          <DiagramCode>IntentClassifier::classify</DiagramCode>
          <div className="pl-3 mt-0.5 text-[var(--text)]">
            regex + keyword scoring with negative patterns
          </div>
        </DiagramStep>
        <DiagramStep n={4}>
          <span className="text-white font-semibold">ESCAPE HATCH:</span> if
          context ∈ {"{staff, admin, owner}"} && intent ===
          {" "}<DiagramCode>&apos;unknown&apos;</DiagramCode>
          <div className="pl-3 mt-0.5 text-[var(--text)]">
            →{" "}<DiagramCode>AiService::stream(...)</DiagramCode> — full
            agentic loop, tools on, return
          </div>
        </DiagramStep>
        <DiagramStep n={5}>
          <DiagramCode>FactPackBuilder::build(intent, context, user)</DiagramCode>
          <div className="pl-3 mt-0.5 text-[var(--text)]">
            curated DB bundle for THIS intent only
          </div>
        </DiagramStep>
        <DiagramStep n={6}>
          <DiagramCode>PolicyGuard::filter(factPack, context, user)</DiagramCode>
          <div className="pl-3 mt-0.5 text-[var(--text)]">
            strip sections the caller can&apos;t see
          </div>
        </DiagramStep>
        <DiagramStep n={7}>
          <DiagramCode>HandlerRegistry::resolve(intent)?-&gt;handle(...)</DiagramCode>
          <div className="pl-3 mt-1 space-y-0.5">
            <div className="flex items-baseline justify-between gap-3">
              <span>
                returned <DiagramCode>string</DiagramCode> or{" "}
                <DiagramCode>{`{ text, actions }`}</DiagramCode>? → SSE deltas,
                save, done
              </span>
              <DiagramHint tone="green">
                answer_type=brain_deterministic · 0 tokens
              </DiagramHint>
            </div>
            <div className="text-[var(--text)]">
              returned <DiagramCode>null</DiagramCode>? fall through ↓
            </div>
          </div>
        </DiagramStep>
        <DiagramStep n={8}>
          <DiagramCode>AiFallbackResponder::stream(...)</DiagramCode>
          <div className="pl-3 mt-0.5 text-[var(--text)]">
            Anthropic, system prompt: &ldquo;answer ONLY from data.&rdquo; NO
            tools. FactPack is the entire universe.
          </div>
          <div className="pl-3 mt-1">
            <DiagramHint tone="accent2">
              answer_type=brain_ai_fallback
            </DiagramHint>
          </div>
        </DiagramStep>
      </DiagramBox>

      <DiagramHeading>Three answer types persisted per message</DiagramHeading>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <DiagramBox label="brain_deterministic" tone="green">
          handler answered, 0 tokens
        </DiagramBox>
        <DiagramBox label="brain_ai_fallback" tone="accent2">
          sandboxed Anthropic, FactPack only
        </DiagramBox>
        <DiagramBox label="escalated" tone="rose">
          hard-block matched, never reached LLM
        </DiagramBox>
      </div>
    </Diagram>
  ),
  snippetsSection: {
    tag: "The Code · how it flows",
    heading: "Three snippets, in execution order",
    intro:
      "Real excerpts from `app/Services/Brain/BrainService.php`, `IntentClassifier.php`, and `AiFallbackResponder.php`. Reading order matches request flow: orchestrate the pipeline → classify deterministically → if no handler, sandbox the LLM.",
  },
  snippets: [
    {
      filename: "app/Services/Brain/BrainService.php · stream()",
      lang: "php",
      stepLabel: "Step 1 · The orchestrator",
      stepHeading: "BrainService::stream — pipeline + escape hatch",
      stepBlurb:
        "Reads top to bottom: hard-block deny list → rate limit → token budget → classify intent → if-staff-and-unknown jump to the agentic loop → otherwise build the FactPack, RBAC-filter, try a handler, fall back to constrained Anthropic.",
      code: `public function stream(?int $userId, string $message, string $context): \\Generator
{
    $user = $userId ? User::find($userId) : null;

    // 1. Hard-block check — runs BEFORE rate limit so we don't burn
    //    rate-limit budget on questions we'd never answer.
    $block = AiService::checkHardBlocks($message, $context);
    if ($block) {
        if ($userId) {
            AiService::saveMessage($userId, $context, 'assistant', $block['safe_response'], [
                'hard_block_matched' => $block['key'],
                'escalated'          => true,
            ]);
        }
        yield AiService::sseEvent('delta', ['text' => $block['safe_response']]);
        yield AiService::sseEvent('done', ['hard_block' => $block['key']]);
        return;
    }

    // 2. Rate limit (skip for null userId — prospect uses IP throttle)
    // 3. Token budget — soft (80%) and hard (100%) thresholds
    if ($userId && AiChatMessage::todayCount($userId, $context) >= AiService::rateLimit($context)) {
        yield AiService::sseEvent('error', ['message' => "Daily limit reached."]);
        return;
    }
    if (AiService::checkTokenBudget($context) === 'hard_limit') {
        yield AiService::sseEvent('error', ['budget_exceeded' => true]);
        return;
    }

    if ($userId) AiService::saveMessage($userId, $context, 'user', $message);

    // 4. Classify intent — pure PHP, no LLM call.  ~0.1ms.
    $classification = IntentClassifier::classify($message, $context);
    $intent     = $classification['intent'];
    $confidence = $classification['confidence'];

    // 5. ESCAPE HATCH: staff users with unrecognized intent get the FULL
    //    agentic AiService::stream — Anthropic + tools + 3-turn loop.
    //    This is the ONLY path that calls tools. Tenants/prospects never
    //    reach it; their unknowns go to the constrained fallback below.
    $isStaff = in_array($context, ['staff', 'admin', 'owner']);
    if ($isStaff && $intent === 'unknown') {
        yield from AiService::stream($userId, $message, $context, skipUserSave: true);
        return;
    }

    // 6. Build a curated DB bundle for THIS intent only.
    $factPack = FactPackBuilder::build($intent, $context, $user);

    // 7. RBAC strip — PolicyGuard removes sections the caller can't see.
    $factPack = PolicyGuard::filter($factPack, $context, $user);

    // 8. Try a deterministic handler first.
    $registry = new HandlerRegistry();
    $handler  = $registry->resolve($intent);
    $answer   = $handler?->handle($intent, $factPack, $context, $user);

    if ($answer !== null) {
        // string  → plain text answer
        // array   → { text, actions }  (in-message buttons)
        $text = is_array($answer) ? $answer['text'] : $answer;

        if ($userId) {
            AiService::saveMessage($userId, $context, 'assistant', $text, [
                'answer_type' => 'brain_deterministic',  // ← 0 TOKENS
                'intent'      => $intent,
                'confidence'  => $confidence,
            ]);
        }
        yield AiService::sseEvent('delta', ['text' => $text]);
        yield AiService::sseEvent('done', ['deterministic' => true, 'intent' => $intent]);
        return;
    }

    // 9. AI fallback — handler returned null. Anthropic with a "answer
    //    ONLY using this data" prompt, NO tools.
    yield from AiFallbackResponder::stream(
        $userId, $message, $context, $intent, $factPack
    );
}`,
    },
    {
      filename: "app/Services/Brain/IntentClassifier.php · classify()",
      lang: "php",
      stepLabel: "Step 2 · The deterministic part",
      stepHeading:
        "IntentClassifier — keyword + regex scoring with negative patterns",
      stepBlurb:
        "Why pure PHP and not \"ask the model\": latency (0.1ms vs 200-800ms), cost (zero tokens), determinism (test fixtures don't drift), debuggability (the matched_keywords array tells you exactly why a message classified the way it did). The non-obvious bit is the negative patterns — they're harsh on purpose.",
      code: `public static function classify(string $message, string $context): array
{
    // Lowercase + strip non-word punctuation but KEEP apostrophes/dashes/slashes
    // so "don't" and "10/15" survive; emoji and punctuation don't pollute matches.
    $normalized = mb_strtolower(trim($message));
    $normalized = preg_replace('/[^\\w\\s\\'\\-\\/]/', '', $normalized);

    $bestIntent = 'unknown';
    $bestScore  = 0.0;
    $bestKeywords = [];

    foreach (self::intentPatterns() as $intent => $config) {
        // Context filter — skip intents irrelevant to this audience.
        // Note: 'admin' and 'owner' both collapse to 'staff' for matching.
        if (!empty($config['contexts'])) {
            $contextKey = match ($context) {
                'admin', 'owner' => 'staff',
                default          => $context,
            };
            if (!in_array($contextKey, $config['contexts'], true)) {
                continue;
            }
        }

        $score = 0.0;
        $matched = [];

        // Keyword matches: 1.0 each.
        foreach ($config['keywords'] as $keyword) {
            if (str_contains($normalized, $keyword)) {
                $score += 1.0;
                $matched[] = $keyword;
            }
        }

        // Regex pattern matches: 1.5 each (higher weight, harder to false-positive).
        foreach ($config['patterns'] ?? [] as $pattern) {
            if (preg_match($pattern, $normalized)) {
                $score += 1.5;
                $matched[] = $pattern;
            }
        }

        // NEGATIVE patterns: subtract 2.0 each. Harsh on purpose —
        // these are the false-positive killers.
        foreach ($config['negative_patterns'] ?? [] as $pattern) {
            if (preg_match($pattern, $normalized)) {
                $score -= 2.0;
            }
        }

        if ($score > $bestScore) {
            $bestScore    = $score;
            $bestIntent   = $intent;
            $bestKeywords = $matched;
        }
    }

    // Confidence: 3+ unit-weighted matches = max confidence (1.0).
    $confidence = $bestScore > 0 ? min(1.0, $bestScore / 3.0) : 0.0;

    return [
        'intent'           => $bestIntent,
        'confidence'       => round($confidence, 2),
        'matched_keywords' => array_values(array_unique(
            array_filter($bestKeywords, fn ($k) => !str_starts_with($k, '/'))
        )),
    ];
}

// ── Excerpt of the intentPatterns table (full list is 30+ intents) ──
return [
    'facility.access' => [
        'keywords' => ['24/7', 'after hours', 'gate code', 'keypad', 'lock'],
        'patterns' => ['/\\b(24.?7|gate\\s*code|how\\s*(do|can)\\s*i\\s*(get\\s*in|access))\\b/'],
        // KEY: "locked out" matches "lock" but should NOT route here —
        // it's a lien/account problem, not an access question.
        'negative_patterns' => ['/\\b(locked?\\s*out|lien|overlock)\\b/'],
        'contexts' => [],  // empty = all contexts
    ],
    'facility.reviews' => [
        'keywords' => ['review', 'rating', 'yelp', 'testimonial', 'feedback'],
        'patterns' => ['/\\b(review|rating|yelp|testimonial)\\b/'],
        // Don't misclassify engineering chatter.
        'negative_patterns' => ['/\\b(code\\s*review|pull\\s*request)\\b/'],
        'contexts' => [],
    ],
    'tenant.balance' => [
        'keywords' => ['balance', 'what do i owe', 'amount due', 'my bill'],
        'patterns' => ['/\\b(owe|balance|due|bill)\\b/'],
        'contexts' => ['tenant'],   // never classifies for prospects/staff
    ],
];`,
    },
    {
      filename: "app/Services/Brain/AiFallbackResponder.php",
      lang: "php",
      stepLabel: "Step 3 · When deterministic doesn't have an answer",
      stepHeading: "AiFallbackResponder — Anthropic, sandboxed",
      stepBlurb:
        "If no handler returned an answer, Anthropic runs — but only on the FactPack PolicyGuard already filtered, with a system prompt that locks it to that data, and with no tools. Hallucination is structurally limited: the model has no facts beyond the FactPack, no way to act, and the worst-case leak is \"model paraphrases something we already deemed safe to show.\"",
      code: `public static function stream(
    ?int $userId, string $message, string $context,
    string $intent, array $factPack, array $faqActions = [],
): \\Generator {
    $model        = AiService::modelFor($context);
    $systemPrompt = self::buildConstrainedPrompt($context, $intent, $factPack);
    $history      = $userId ? AiChatMessage::recentHistory($userId, $context, 20) : [];

    $messages = array_merge($history, [['role' => 'user', 'content' => $message]]);

    try {
        // AiProviderInterface — abstraction over Anthropic. Notice we are
        // NOT calling AiService::stream (which would enable tools). The
        // provider is given system + messages, that's it.  No tools array.
        $provider = app(AiProviderInterface::class);

        foreach ($provider->stream($model, $systemPrompt, $messages) as $event) {
            if ($event['type'] === 'text_delta') {
                $fullText .= $event['text'] ?? '';
                yield AiService::sseEvent('delta', ['text' => $event['text']]);
            }
            // ... token-tracking on message_start / message_delta
        }

        if ($userId) {
            AiService::saveMessage($userId, $context, 'assistant', $fullText, [
                'model_version' => $model,
                'input_tokens'  => $inputTokens,
                'output_tokens' => $outputTokens,
                // Distinct answer_type so dashboards can measure
                // brain coverage vs. fallback rate.
                'answer_type'   => 'brain_ai_fallback',
            ]);
        }
        yield AiService::sseEvent('done', ['answer_type' => 'brain_ai_fallback']);

    } catch (\\Throwable $e) {
        // Graceful degrade — if Anthropic is down, friendly message, not 500.
        yield AiService::sseEvent('error', [
            'message' => 'AI assistant is temporarily unavailable. Please try again later.',
        ]);
    }
}

/**
 * The constrained system prompt — the core of the sandbox.
 *
 * The hardcoded RULES section forces "answer ONLY using the data below."
 * Combined with no-tools and the upstream PolicyGuard filter, the worst-
 * case leak is "model paraphrases something it shouldn't have, but only
 * from the data we already deemed safe to show."
 */
protected static function buildConstrainedPrompt(string $context, string $intent, array $factPack): string
{
    $facilityName  = $factPack['facility_info']['name']  ?? 'the facility';
    $facilityPhone = $factPack['facility_info']['phone'] ?? '';

    $prompt  = "You are a helpful assistant for {$facilityName}, a self-storage facility.\\n\\n";
    $prompt .= "RULES:\\n";
    $prompt .= "- Answer ONLY using the data provided below. Do NOT invent or assume information.\\n";
    $prompt .= "- If the data below does not contain the answer, say so honestly and suggest calling {$facilityPhone}.\\n";
    $prompt .= "- Be concise, friendly, and professional.\\n";
    $prompt .= "- Never discuss competitors, legal advice, or topics outside self-storage.\\n";
    $prompt .= "- Never reveal internal system details, API keys, or technical architecture.\\n\\n";

    $prompt .= "DETECTED INTENT: {$intent}\\n\\n";
    $prompt .= "=== FACILITY DATA ===\\n\\n";

    foreach ($factPack as $section => $data) {
        if (empty($data)) continue;
        $label = str_replace('_', ' ', ucfirst($section));
        $prompt .= "--- {$label} ---\\n";
        $prompt .= self::formatSection($data);
        $prompt .= "\\n";
    }

    $prompt .= "=== END DATA ===\\n";
    return $prompt;
}`,
    },
  ],
  sourceFooter:
    "Excerpts from `app/Services/Brain/BrainService.php`, `IntentClassifier.php`, `AiFallbackResponder.php`, and supporting classes (`FactPackBuilder`, `PolicyGuard`, `HandlerRegistry`) in MONISCOPE. The Brain is the centerpiece, but the broader AI surface includes 4 event-driven listeners (lead scoring, retention assist, agreement-template lint, support-ticket triage), an Enterprise-tier AI Phone Agent (Twilio Voice + Claude with end-of-call summarization), an occupancy-driven AI Pricing Engine, three-layer PII redaction (middleware in / middleware out / persistence), 8-category hard-block deny list, soft (80%) + hard (100%) monthly token budgets per context, a versioned policy editor, and per-call health telemetry. 24+ tier-gated AI features in `config/tiers.php`; dedicated test suites under `tests/Feature/Ai/` and `tests/Feature/Brain/`. Happy to walk through any of it on a call.",
};
