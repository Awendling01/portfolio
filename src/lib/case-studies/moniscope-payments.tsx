import type { CaseStudy } from "./index";
import {
  Diagram,
  DiagramBox,
  DiagramArrow,
  DiagramRow,
  DiagramStep,
  DiagramCode,
  DiagramHeading,
  DiagramHint,
} from "@/components/case-study/diagram";

export const payments: CaseStudy = {
  slug: "payments",
  number: "02",
  title: "Multi-processor payment abstraction",
  shortTitle: "Multi-Processor Payments",
  oneLiner:
    "One Action class routes monthly recurring charges across Stripe, Authorize.Net, Square, and ACH. Distributed locks prevent double-charges. Every webhook is signed and idempotent. Failures create staff tasks, not silent logs.",
  lede:
    "One Action class — `ProcessAutopayCharge` — routes monthly recurring charges across four processors. Per-rental distributed locks prevent double-charges, every webhook is signed and idempotent, and every failure path creates a staff task instead of vanishing into a log.",
  prelaunchNote:
    "Wired against Stripe, Authorize.Net, and Square sandboxes — no real cards have been charged in production yet. Native ACH talks to a real bank-rail integration on a sandbox endpoint.",
  whereSection: {
    tag: "The four processors",
    heading: "One Action, four sub-handlers, one return shape",
  },
  whereItShowsUp: {
    kind: "table",
    intro:
      "Every sub-handler returns 'charged' | 'skipped' | 'failed'. The orchestrator never branches on processor — it just records the outcome. Adding a fifth processor is one new private method, not a refactor.",
    columns: ["Processor", "Method", "Stored credential", "Surcharge"],
    rows: [
      [
        "Stripe",
        "stripe_card",
        "Stripe pm_… payment-method ID",
        "per-method %",
      ],
      [
        "Authorize.Net",
        "authorize_net_card",
        "CIM customer profile ID",
        "per-method %",
      ],
      [
        "Square",
        "square_card",
        "Square customer + saved card ID",
        "per-method %",
      ],
      [
        "Native ACH",
        "native_ach",
        "Verified AchAccount row",
        "flat fee (toggled)",
      ],
    ],
  },
  whySection: {
    tag: "The engineering \"why\"",
    heading: "Six things this solves that \"just call Stripe\" doesn't",
  },
  whyTiles: [
    {
      number: 1,
      title: "Per-rental distributed locking",
      body: "Two queue workers (or admin + cron) could otherwise both pass the \"already paid?\" check before either inserts. `Cache::lock(\"autopay:rental:{$id}\", 120)` forces exactly one charge per rental per cycle.",
      ref: "snippet 01",
    },
    {
      number: 2,
      title: "Processor-routed dispatch",
      body: "A single switch on `$rental->payment_method` picks the right private handler. Caller doesn't care which processor ran.",
      ref: "snippet 02",
    },
    {
      number: 3,
      title: "Three-flavor signature verification",
      body: "Stripe's `Webhook::constructEvent`, Authorize.Net's `hash_hmac('sha512', …, hex2bin($key))`, Square's HMAC-SHA256 over `notificationUrl + body`. All three timing-safe.",
      ref: "in full case study",
    },
    {
      number: 4,
      title: "Idempotent webhook processing",
      body: "Every webhook logs to `webhook_logs`, then deduplicates by event ID before any DB write. The Stripe handler probes 3 tables to find the matching record.",
      ref: "snippet 03",
    },
    {
      number: 5,
      title: "ACH return-code state machine",
      body: "R01 (NSF) → retry queue. R02–R04 (account closed) → suspend. R07/R08/R29 (auth revoked) → halt all future debits. R10 → flag for review. Each path triggers a different staff task.",
      ref: "in full case study",
    },
    {
      number: 6,
      title: "Atomic settlement guard",
      body: "`UPDATE … WHERE status IN ('initiated','processing')` + affected-row check. Two workers race? Exactly one commits, the other gets `false` and silently skips — no exception.",
      ref: "in full case study",
    },
  ],
  architectureSection: {
    tag: "Architecture",
    heading: "Where the call goes",
  },
  architectureDiagram: (
    <Diagram>
      <DiagramBox label="Schedule: 8:30 daily · America/Chicago" tone="accent">
        <DiagramStep>
          <DiagramCode>payments:process-autopay</DiagramCode>
        </DiagramStep>
        <DiagramStep>
          for each rental with{" "}
          <DiagramCode>autopay=1 AND payment_due ≤ today</DiagramCode>:{" "}
          <DiagramCode>ProcessAutopayCharge::run($rental)</DiagramCode> →{" "}
          <DiagramCode>charged | skipped | failed</DiagramCode>
        </DiagramStep>
      </DiagramBox>

      <DiagramArrow label="per-rental distributed lock" />

      <DiagramBox tone="neutral">
        <DiagramStep>
          <DiagramCode>Cache::lock(&quot;autopay:rental:{"{id}"}&quot;, 120)</DiagramCode>{" "}
          <DiagramHint>← prevents double-charges</DiagramHint>
        </DiagramStep>
        <DiagramStep>
          <DiagramCode>match($rental-&gt;payment_method)</DiagramCode>
        </DiagramStep>
      </DiagramBox>

      <DiagramArrow label="four sub-handlers, one return shape" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <DiagramBox label="native_ach" tone="green">
          <DiagramCode>AchService::initiateDebit</DiagramCode>
        </DiagramBox>
        <DiagramBox label="authorize_net_card" tone="accent">
          <DiagramCode>AuthorizeNetService::chargeProfile</DiagramCode>
        </DiagramBox>
        <DiagramBox label="square_card" tone="accent2">
          <DiagramCode>SquareService::chargeSavedCard</DiagramCode>
        </DiagramBox>
        <DiagramBox label="stripe_card" tone="amber">
          <DiagramCode>ChargeStripeCard::run</DiagramCode>
        </DiagramBox>
      </div>

      <DiagramArrow />

      <DiagramRow>
        <DiagramBox label="On success" tone="green">
          <DiagramCode>RecordPayment::run([…])</DiagramCode>
        </DiagramBox>
        <DiagramBox label="On failure" tone="rose">
          <DiagramCode>PaymentFailed::dispatch()</DiagramCode>
          <div className="pl-3 mt-0.5 text-[var(--text)]">
            listeners create staff task, notify customer, log audit
          </div>
        </DiagramBox>
      </DiagramRow>

      <DiagramHeading>Webhooks (async, processor → us)</DiagramHeading>
      <DiagramBox tone="neutral">
        <DiagramStep>
          <DiagramCode>/webhooks/stripe</DiagramCode> ·{" "}
          <DiagramCode>/webhooks/authorize-net</DiagramCode> ·{" "}
          <DiagramCode>/webhooks/square</DiagramCode>
        </DiagramStep>
        <DiagramStep n={1}>verify HMAC signature (timing-safe)</DiagramStep>
        <DiagramStep n={2}>
          dedupe by <DiagramCode>event_id</DiagramCode> in{" "}
          <DiagramCode>webhook_logs</DiagramCode>
        </DiagramStep>
        <DiagramStep n={3}>
          <DiagramCode>match()</DiagramCode> event type → handler
        </DiagramStep>
        <DiagramStep n={4}>
          handler updates <DiagramCode>Payment</DiagramCode> |{" "}
          <DiagramCode>Rental</DiagramCode> |{" "}
          <DiagramCode>Order</DiagramCode>, dispatches events
        </DiagramStep>
        <DiagramStep n={5}>
          errors caught + logged to{" "}
          <DiagramCode>webhook_logs.error</DiagramCode>
        </DiagramStep>
      </DiagramBox>
    </Diagram>
  ),
  snippetsSection: {
    tag: "The Code · how it flows",
    heading: "Three snippets, in execution order",
    intro:
      "Lock the rental → route to the right processor → on success, processor calls back via webhook → dedupe + match the record. Real excerpts from `app/Actions/Payment/ProcessAutopayCharge.php` and `app/Http/Controllers/StripeWebhookController.php`.",
  },
  snippets: [
    {
      filename: "ProcessAutopayCharge.php · run() + processWithLock()",
      lang: "php",
      stepLabel: "Step 1 · Before any work happens",
      stepHeading: "Per-rental distributed lock + re-check inside the lock",
      stepBlurb:
        "The lock alone isn't enough — a previous run could have already charged this billing period and released. The \"already paid?\" check inside the lock is the source of truth; the lock just serializes the attempt.",
      code: `public static function run(Rental $rental): string
{
    $user = $rental->user;
    if (!$user) {
        return 'skipped';
    }

    // Per-rental lock — 120s TTL is generous; a charge usually takes <2s.
    // Auto-released on TTL even if the worker dies mid-charge.
    $lock = Cache::lock("autopay:rental:{$rental->id}", 120);

    if (!$lock->get()) {
        Log::info("Autopay: skipping rental #{$rental->id} — already being processed");
        return 'skipped';
    }

    try {
        return static::processWithLock($rental, $user);
    } finally {
        $lock->release();  // always release, even on exception
    }
}

private static function processWithLock(Rental $rental, $user): string
{
    // Inside the lock, re-check the DB. The lock alone is not enough —
    // a previous run could have already charged this billing period and
    // released. The "already paid?" check is the source of truth; the
    // lock just serializes the *attempt*.
    $alreadyPaid = Payment::where('rental_id', $rental->id)
        ->where('due_date', $rental->payment_due_date)
        ->whereIn('status', ['completed', 'pending'])
        ->exists();

    if ($alreadyPaid) {
        return 'skipped';
    }

    $amount  = (float) $rental->monthly_rate;
    $lateFee = $rental->late_fee_applied ? (float) $rental->late_fee_amount : 0;

    // Dispatch to the right processor (next snippet)...
    return static::dispatchByMethod($rental, $user, $amount, $lateFee);
}`,
    },
    {
      filename: "ProcessAutopayCharge.php · dispatch + processAuthorizeNetAutopay()",
      lang: "php",
      stepLabel: "Step 2 · Pick the right processor",
      stepHeading: "Routing dispatch + a representative sub-handler",
      stepBlurb:
        "Every sub-handler returns the same shape. Adding a fifth processor means one new private method and one arm in the switch. Below: the router, then Authorize.Net's full handler with surcharge calc, success path, and failure path.",
      code: `// ── Router ──────────────────────────────────────────────────────
private static function dispatchByMethod(Rental $rental, $user, float $amount, float $lateFee): string
{
    if ($rental->payment_method === 'native_ach') {
        return static::processAchAutopay($rental, $user, $amount, $lateFee);
    }
    if ($rental->payment_method === 'authorize_net_card') {
        return static::processAuthorizeNetAutopay($rental, $user, $amount, $lateFee);
    }
    if ($rental->payment_method === 'square_card') {
        return static::processSquareAutopay($rental, $user, $amount, $lateFee);
    }
    // Default: Stripe (the most-used path)
    return static::processStripeAutopay($rental, $user, $amount, $lateFee);
}

// ── Representative sub-handler: Authorize.Net ───────────────────
private static function processAuthorizeNetAutopay(Rental $rental, $user, float $amount, float $lateFee): string
{
    if (!$user->anet_customer_profile_id || !AuthorizeNetService::isConfigured()) {
        // No profile / processor disabled — surface to staff, don't silently skip.
        CreateStaffTask::run(
            title: "Authorize.Net Autopay failed — Unit {$rental->unit_number} ({$user->name})",
            description: "No Authorize.Net profile on file or processor not configured.",
            relatedUserId: $user->id,
        );
        return 'skipped';
    }

    $total          = $amount + $lateFee;
    $surcharge      = Payment::calculateSurcharge($total, 'authorize_net_card');
    $surchargeCents = (int) round($surcharge * 100);

    try {
        $txnId = AuthorizeNetService::chargeProfile(
            $user,
            '', // empty = default payment profile
            (int) round($total * 100) + $surchargeCents,
            "Autopay — Unit {$rental->unit_number}",
        );

        RecordPayment::run([
            'rental_id'           => $rental->id,
            'user_id'             => $user->id,
            'amount'              => $amount,
            'late_fee'            => $lateFee,
            'processing_fee'      => $surcharge,
            'paid_at'             => now(),
            'status'              => 'completed',
            'payment_method'      => 'authorize_net_card',
            'anet_transaction_id' => $txnId,
        ]);

        return 'charged';

    } catch (\\Exception $e) {
        // Failure path: record the failed payment, schedule a retry, fire event.
        $payment = Payment::create([
            'rental_id'      => $rental->id,
            'user_id'        => $user->id,
            'amount'         => $amount,
            'late_fee'       => $lateFee,
            'status'         => 'failed',
            'payment_method' => 'authorize_net_card',
            'notes'          => "Authorize.Net autopay failed: {$e->getMessage()}",
        ]);

        // Configurable retry intervals: [1, 3, 7, 14] days by default.
        $retryIntervals = config('facility.payments.retry_intervals', [1, 3, 7, 14]);
        $payment->update(['next_retry_at' => now()->addDays($retryIntervals[0])]);

        // PaymentFailed triggers ~6 listeners: notice, task, audit log, ...
        PaymentFailed::dispatch($payment, $rental, $user, $e->getMessage());

        return 'failed';
    }
}`,
    },
    {
      filename: "StripeWebhookController.php",
      lang: "php",
      stepLabel: "Step 3 · When the processor calls back",
      stepHeading: "Idempotent webhook + multi-table record probe",
      stepBlurb:
        "Stripe (and every other major processor) re-delivers events if they don't get a fast 200. We dedupe by `webhook_logs.event_id` before any work happens, and a `payment_intent.succeeded` probes Payment, Rental, and Order in priority order — a real autopay span all three once MONISCOPE goes live.",
      code: `public function handleWebhook(Request $request)
{
    // (signature verification above — Stripe's Webhook::constructEvent
    //  with tolerance window. Throws on bad sig, before we get here.)

    // ── Dedupe by event ID — Stripe retries up to 3 days ──────────
    $eventId = $event->id ?? null;
    if (
        $eventId &&
        WebhookLog::where('event_id', $eventId)->where('status', 'processed')->exists()
    ) {
        return response('Already processed', 200);
    }

    // ── Log first — even if the handler throws, we have evidence ──
    $log = WebhookLog::create([
        'provider'   => 'stripe',
        'event_id'   => $eventId,
        'event_type' => $event->type ?? 'unknown',
        'payload'    => json_decode($payload, true) ?: [],
        'status'     => 'received',
    ]);

    // ── Route to handler ──────────────────────────────────────────
    try {
        match ($event->type) {
            'payment_intent.succeeded'      => $this->handlePaymentIntentSucceeded($event->data->object, $log),
            'payment_intent.payment_failed' => $this->handlePaymentIntentFailed($event->data->object, $log),
            'charge.refunded'               => $this->handleChargeRefunded($event->data->object, $log),
            default                         => $log->update(['status' => 'ignored']),
        };
    } catch (\\Exception $e) {
        $log->update(['status' => 'failed', 'error' => $e->getMessage()]);
    }

    return response('OK', 200);
}

// ── The matching record could live in 3 different tables ────────
private function handlePaymentIntentSucceeded(object $paymentIntent, WebhookLog $log): void
{
    $piId = $paymentIntent->id;

    // 1) Payment records (autopay / billing modal)
    $payment = Payment::where('stripe_payment_intent_id', $piId)
        ->where('status', '!=', 'completed')
        ->first();
    if ($payment) {
        $payment->update(['status' => 'completed', 'paid_at' => now()]);
        $payment->rental?->advanceBillingState();   // state machine on Rental
        $log->update(['status' => 'processed', 'notes' => "Payment #{$payment->id} confirmed"]);
        return;
    }

    // 2) Rental records (initial checkout — no Payment row yet at PI creation)
    $rental = Rental::where('stripe_payment_intent', $piId)->where('payment_status', '!=', 'completed')->first();
    if ($rental) {
        $rental->update(['payment_status' => 'completed']);
        $log->update(['status' => 'processed', 'notes' => "Rental #{$rental->id} confirmed"]);
        return;
    }

    // 3) Order records (storefront / magic-link payments)
    $order = Order::where('stripe_payment_intent', $piId)->where('status', '!=', 'completed')->first();
    if ($order) {
        $order->update(['status' => 'completed']);
        $log->update(['status' => 'processed', 'notes' => "Order #{$order->id} confirmed"]);
        return;
    }

    // No match — log for investigation. Don't throw — Stripe will keep
    // retrying for 3 days, and we don't want them to.
    $log->update(['status' => 'no_match', 'notes' => "No matching record for PI {$piId}"]);
}`,
    },
  ],
  sourceFooter:
    "Excerpts from `app/Actions/Payment/ProcessAutopayCharge.php` and `app/Http/Controllers/StripeWebhookController.php` in MONISCOPE (pre-launch — wired against processor sandboxes, no real cards charged). The full build also includes signature verification across all three processors, the ACH return-code state machine, and the atomic settlement guard for native ACH — happy to walk through any of them.",
};
