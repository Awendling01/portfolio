import type { CaseStudy } from "./index";
import {
  Diagram,
  DiagramBox,
  DiagramArrow,
  DiagramRow,
  DiagramStep,
  DiagramCode,
  DiagramHeading,
} from "@/components/case-study/diagram";

export const events: CaseStudy = {
  slug: "events",
  number: "04",
  title: "Event-driven architecture",
  shortTitle: "Event-Driven Architecture",
  oneLiner:
    "45 events, 61 listeners, auto-discovered by Laravel 12. Every listener with side effects guards itself with idempotency keys backed by a UNIQUE database index. Queue tier separation keeps audit writes flowing when SMS is backed up.",
  lede:
    "A canonical Laravel event/listener architecture, with three details that move it past textbook: auto-discovery (no listener map), idempotency at the listener boundary (a unique-index DB row, not Redis), and queue tier separation so a flooded SMS queue can't slow audit writes.",
  prelaunchNote:
    "Pre-launch — wired into MONISCOPE's dev environment. The pattern is ship-ready: domain Actions emit events, queued listeners cascade work without coupling business logic to background-job concerns. Designed to support staff workflows once tenants are onboarded.",
  whereSection: {
    tag: "By the numbers",
    heading: "What auto-discovery and the unique-index pattern give you",
  },
  whereItShowsUp: {
    kind: "stats",
    entries: [
      { value: "45", label: "Domain events", color: "accent" },
      { value: "61", label: "Listeners auto-wired", color: "accent2" },
      { value: "0", label: "Manual map entries", color: "green" },
    ],
  },
  whySection: {
    tag: "The engineering \"why\"",
    heading: "Six things beyond textbook events",
  },
  whyTiles: [
    {
      number: 1,
      title: "Auto-discovery, no $listen map",
      body: "Laravel 12 scans `app/Listeners/` at boot. Any class with `handle…(EventClass $event)` is auto-wired. New event = no map edit, just a new listener.",
      ref: "snippet 01",
    },
    {
      number: 2,
      title: "Idempotency keys at the listener boundary",
      body: "Every listener with side effects calls `Idempotency::claim(\"audit:rental_created:{id}\", 3600)` first. Duplicate event delivery hits a unique-index violation and silently no-ops.",
      ref: "snippet 02",
    },
    {
      number: 3,
      title: "Idempotency uses a unique index, not Redis",
      body: "A row in `idempotency_keys` with a unique `key` column. Atomic via the database — no second store, no second consistency model.",
      ref: "snippet 02",
    },
    {
      number: 4,
      title: "Queue tier separation",
      body: "Notifications go to the `notifications` queue with [10, 60, 300]s backoff. Audit writes use the default queue with shorter backoff. A flooded SMS queue doesn't slow audit writes.",
      ref: "snippet 03",
    },
    {
      number: 5,
      title: "Listeners with failed() recover gracefully",
      body: "Critical listeners (rental confirmations, lien notices, payment receipts) implement a `failed()` method that logs to disk and creates a staff task. Silent triple-failure isn't acceptable for those flows.",
      ref: "snippet 03",
    },
    {
      number: 6,
      title: "Events broadcast for real-time UI",
      body: "`RentalCreated implements ShouldBroadcast` over the `facility.{id}` private channel. Admins see new rentals appear in real time without polling.",
      ref: "in full case study",
    },
  ],
  architectureSection: {
    tag: "Architecture",
    heading: "One Action call, multiple cascades, off-thread",
  },
  architectureDiagram: (
    <Diagram>
      <DiagramRow>
        <DiagramBox label="HTTP request" tone="accent">
          <DiagramStep>Controller calls Action</DiagramStep>
          <DiagramStep>
            <DiagramCode>Action::run()</DiagramCode>
            <div className="pl-3 mt-0.5 text-[var(--text)]">
              DB writes (transactional)
            </div>
          </DiagramStep>
          <DiagramStep>
            <DiagramCode>EventName::dispatch($model)</DiagramCode>
          </DiagramStep>
          <DiagramStep>Response returned (event work runs off-thread)</DiagramStep>
        </DiagramBox>
        <DiagramBox label="Job worker · queue:work" tone="accent2">
          <div className="text-[var(--text)] mb-1">
            Auto-discovery wires <em>every</em> queued listener:
          </div>
          <DiagramStep>
            <DiagramCode>LogXAudit</DiagramCode> →{" "}
            <DiagramCode>Idempotency::claim()</DiagramCode> →{" "}
            <DiagramCode>AuditLog::log()</DiagramCode>
          </DiagramStep>
          <DiagramStep>
            <DiagramCode>SendXNotifications</DiagramCode> → idempotency-claim →
            email + SMS
          </DiagramStep>
          <DiagramStep>
            <DiagramCode>SyncXOnRental</DiagramCode> → external API call
          </DiagramStep>
          <DiagramStep>
            <DiagramCode>FireAutomationTrigger</DiagramCode> →{" "}
            <DiagramCode>AutomationEngine::fire()</DiagramCode>
          </DiagramStep>
        </DiagramBox>
      </DiagramRow>

      <DiagramArrow label="ShouldBroadcast — Reverb / Pusher" />

      <DiagramBox label="Browser (Echo)" tone="green">
        <DiagramStep>
          <DiagramCode>private-facility.{"{id}"}</DiagramCode> ◀ events:{" "}
          <DiagramCode>RentalCreated</DiagramCode>,{" "}
          <DiagramCode>PaymentRecorded</DiagramCode>, …
        </DiagramStep>
        <DiagramStep>Admin dashboard reflows live (no polling)</DiagramStep>
      </DiagramBox>

      <DiagramHeading>
        Idempotency · queue tier separation · auto-discovery — three things
        that move this past textbook
      </DiagramHeading>
    </Diagram>
  ),
  snippetsSection: {
    tag: "The Code · how it flows",
    heading: "Three snippets, in execution order",
    intro:
      "Auto-discovered listeners → idempotency claim at the entry point → graceful failure recovery. Real excerpts from `app/Providers/EventServiceProvider.php`, `app/Support/Idempotency.php`, and `app/Listeners/SendRentalNotifications.php`.",
  },
  snippets: [
    {
      filename: "EventServiceProvider.php · LogRentalAudit.php",
      lang: "php",
      stepLabel: "Step 1 · How listeners get wired",
      stepHeading: "Auto-discovery — EventServiceProvider is empty by design",
      stepBlurb:
        "Laravel 12 walks `app/Listeners/` at boot and registers every type-hinted `handle…()` method. New event = new listener file. No registration map.",
      code: `// ── EventServiceProvider — empty by design ─────────────────────
namespace App\\Providers;

use Illuminate\\Foundation\\Support\\Providers\\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * Laravel 12 auto-discovers all handle* methods on listeners in app/Listeners.
     * No explicit $listen array, no Event::listen() calls.
     */
}


// ── A listener wired by type-hint, handling TWO events ─────────
namespace App\\Listeners;

use App\\Events\\RentalCancelled;
use App\\Events\\RentalCreated;
use App\\Models\\AuditLog;
use App\\Support\\Idempotency;
use Illuminate\\Contracts\\Queue\\ShouldQueue;
use Illuminate\\Support\\Facades\\Log;

class LogRentalAudit implements ShouldQueue
{
    public int $tries   = 3;
    public int $backoff = 60;

    // Auto-wired to RentalCreated event purely by the type-hint.
    public function handleCreated(RentalCreated $event): void
    {
        if (!Idempotency::claim("audit:rental_created:{$event->rental->id}", 3600)) {
            return;  // duplicate delivery → silent no-op
        }

        AuditLog::log(
            'rental_created',
            "{$event->user->name} rented Unit {$event->rental->unit_number}",
            $event->user,
            $event->user,
            [
                'rental_id'    => $event->rental->id,
                'monthly_rate' => (float) $event->rental->monthly_rate,
            ],
        );
    }

    // Auto-wired to RentalCancelled by the type-hint.
    public function handleCancelled(RentalCancelled $event): void
    {
        if (!Idempotency::claim("audit:rental_cancelled:{$event->rental->id}", 3600)) {
            return;
        }

        AuditLog::log(
            'rental_cancelled',
            "Rental cancelled for Unit {$event->rental->unit_number}",
            $event->cancelledBy,
            $event->rental->user,
            ['rental_id' => $event->rental->id],
        );
    }

    public function failed(object $event, \\Throwable $exception): void
    {
        Log::error('LogRentalAudit failed', ['exception' => $exception->getMessage()]);
    }
}`,
    },
    {
      filename: "app/Support/Idempotency.php",
      lang: "php",
      stepLabel: "Step 2 · The first line of every listener",
      stepHeading: "Idempotency::claim() — race inside the database",
      stepBlurb:
        "The classic mistake is checking `Cache::has` then `Cache::put` — two workers can both pass `has`, both `put`, both run. The fix: race INSIDE the database. `idempotency_keys.key` has a UNIQUE constraint. The first INSERT wins; the second throws SQLSTATE 23000.",
      code: `namespace App\\Support;

use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Support\\Facades\\Log;

class Idempotency
{
    /**
     * Claim a key for the given TTL. First caller wins.
     *
     * @return bool True if claimed (proceed). False if already in flight (skip).
     */
    public static function claim(string $key, int $ttlSeconds = 3600): bool
    {
        // Opportunistic cleanup — 1% of calls prune expired rows.
        if (random_int(1, 100) === 1) {
            static::pruneExpired();
        }

        try {
            // Race here. UNIQUE INDEX on \`key\` guarantees one winner.
            DB::table('idempotency_keys')->insert([
                'key'        => $key,
                'expires_at' => now()->addSeconds($ttlSeconds),
                'created_at' => now(),
            ]);

            return true;

        } catch (\\Illuminate\\Database\\QueryException $e) {
            // 23000 = SQL standard "integrity constraint violation" (duplicate key).
            if ($e->getCode() === '23000') {
                $existing = DB::table('idempotency_keys')->where('key', $key)->first();

                // Reclaim if the prior claim has expired.
                // Optimistic lock on expires_at: if another worker reclaimed
                // between our SELECT and UPDATE, our UPDATE matches 0 rows.
                if ($existing && now()->greaterThan($existing->expires_at)) {
                    $updated = DB::table('idempotency_keys')
                        ->where('key', $key)
                        ->where('expires_at', $existing->expires_at)  // optimistic lock
                        ->update([
                            'expires_at' => now()->addSeconds($ttlSeconds),
                            'created_at' => now(),
                        ]);

                    return $updated > 0;
                }

                // Active claim by someone else — caller should skip.
                return false;
            }

            // Any other DB error — log + fail closed (don't double-process).
            Log::error('Idempotency claim failed unexpectedly', [
                'key'   => $key,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    public static function release(string $key): void
    {
        DB::table('idempotency_keys')->where('key', $key)->delete();
    }

    public static function pruneExpired(): int
    {
        return DB::table('idempotency_keys')->where('expires_at', '<', now())->delete();
    }
}`,
    },
    {
      filename: "SendRentalNotifications.php",
      lang: "php",
      stepLabel: "Step 3 · When everything goes wrong",
      stepHeading: "Queued listener — separate queue, retry, failed() escalation",
      stepBlurb:
        "Notifications run on a dedicated queue. `$backoff` arrays mean the gap between retries grows: 10s, 60s, 5min — gives transient outages time to settle. After all retries are exhausted, `failed()` creates a StaffTask so a human follows up.",
      code: `namespace App\\Listeners;

use App\\Events\\RentalCreated;
use App\\Services\\NotificationService;
use App\\Services\\TemplateNotificationService;
use App\\Support\\Idempotency;
use Illuminate\\Contracts\\Queue\\ShouldQueue;
use Illuminate\\Support\\Facades\\Log;

class SendRentalNotifications implements ShouldQueue
{
    /** Run on a separate queue from audit writes — tier separation. */
    public $queue = 'notifications';

    /** Total attempts. */
    public int $tries = 3;

    /** Per-attempt backoff. 10s → 60s → 5min — transient processor outages settle in minutes. */
    public array $backoff = [10, 60, 300];

    public function handle(RentalCreated $event): void
    {
        // Always idempotency-guard at the entry point.
        if (!Idempotency::claim("notify:rental_instructions:{$event->rental->id}", 3600)) {
            return;
        }

        $rental = $event->rental;
        $user   = $event->user;

        // Two delivery channels: NotificationService for in-app + email,
        // TemplateNotificationService for templated SMS.
        NotificationService::rentalConfirmed($rental);
        TemplateNotificationService::send('rental_instructions', $user, $rental);
    }

    /**
     * Called by Laravel after $tries attempts have all failed.
     * Don't let critical confirmations vanish — log + escalate to a human.
     */
    public function failed(object $event, \\Throwable $exception): void
    {
        Log::error('SendRentalNotifications failed permanently', [
            'rental_id' => $event->rental?->id,
            'exception' => $exception->getMessage(),
        ]);

        // The full build creates a StaffTask here so a human follows up
        // with the customer — they paid for a rental, the confirmation never
        // reached them. We can't let that go quiet.
    }
}`,
    },
  ],
  sourceFooter:
    "Excerpts from `app/Providers/EventServiceProvider.php`, `app/Listeners/LogRentalAudit.php`, `app/Listeners/SendRentalNotifications.php`, and `app/Support/Idempotency.php` in MONISCOPE (pre-launch). The full build also includes `ShouldBroadcast` events on a private `facility.{id}` channel — happy to walk through the broadcast layer too.",
};
