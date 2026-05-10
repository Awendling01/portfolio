import type { CaseStudy } from "./index";
import {
  Diagram,
  DiagramBox,
  DiagramArrow,
  DiagramStep,
  DiagramCode,
  DiagramHeading,
} from "@/components/case-study/diagram";

export const automation: CaseStudy = {
  slug: "automation",
  number: "03",
  title: "Automation engine — WHEN / IF / THEN",
  shortTitle: "Automation Engine (WHEN / IF / THEN)",
  oneLiner:
    "User-built rules dispatched through a condition / action registry with dry-run support. Triggers, conditions, and actions are first-class rows — sortable, configurable, no schema migration to add a new condition.",
  lede:
    "A small business-rules engine purpose-built for self-storage operators. Triggers, conditions, and actions are first-class rows in `automation_rules` — sortable, configurable, dry-runnable. Adding a new condition or action is one private method plus one entry in a dispatcher.",
  prelaunchNote:
    "Automations are built and tested in dev; no production tenant has subscribed yet. The engine is wired through the same event bus that the rest of the application uses.",
  whereSection: {
    tag: "What an admin builds in the UI",
    heading: "A real example, in plain English",
  },
  whereItShowsUp: {
    kind: "rule-example",
    example:
      "WHEN payment_failed\nIF amount > $100 AND customer_type = commercial\nTHEN create_task(\"Call commercial tenant\") AND send_sms(\"…\")",
  },
  whySection: {
    tag: "The engineering \"why\"",
    heading: "Six things that make this an engine, not a switch",
  },
  whyTiles: [
    {
      number: 1,
      title: "Triggers / conditions / actions are data, not code",
      body: "Rows in `automation_rules` with `type`, `key`, JSON `config`, `sort_order`. A new condition is one private method + one match arm — no schema migration.",
      ref: "snippet 01",
    },
    {
      number: 2,
      title: "Same dispatcher pattern for actions",
      body: "10 action keys, one match. Each returns a status string (\"sent\", \"skipped:no_email\", \"applied:25.00\") so the AutomationLog row reads like an audit trail.",
      ref: "snippet 02",
    },
    {
      number: 3,
      title: "testRun() is a real dry-run",
      body: "Pulls a real sample model from the DB matching the trigger type, evaluates each condition INDEPENDENTLY (no short-circuit), returns per-condition pass/fail. The admin can debug a rule without waiting for a real event.",
      ref: "snippet 03",
    },
    {
      number: 4,
      title: "Variable interpolation with safe fallbacks",
      body: "`{{customer.name}}`, `{{rental.monthly_rate}}`, `{{payment.days_overdue}}`. Built from resolved User + Rental + Payment with formatting; unrecognized vars stay as literals so typos surface in preview, not as empty strings.",
      ref: "in full case study",
    },
    {
      number: 5,
      title: "update_field is fenced behind a whitelist",
      body: "The action looks safe but is dangerous — admins could otherwise overwrite arbitrary columns through the rule engine. `UPDATABLE_FIELDS` caps what it can touch (notes, tags, two columns per model).",
      ref: "in full case study",
    },
    {
      number: 6,
      title: "One broken automation doesn't stop the queue",
      body: "Each automation runs in its own try/catch. Each execution writes an `AutomationLog` row regardless of outcome. `send_webhook` is bounded by `Http::timeout(10)`.",
      ref: "in full case study",
    },
  ],
  architectureSection: {
    tag: "Architecture",
    heading: "Trigger → Conditions → Actions → Log",
  },
  architectureDiagram: (
    <Diagram>
      <DiagramBox
        label="Event listener / scheduled command / model observer"
        tone="accent"
      >
        <DiagramStep>
          <DiagramCode>
            AutomationEngine::fire(&apos;payment_failed&apos;, $payment)
          </DiagramCode>
        </DiagramStep>
      </DiagramBox>

      <DiagramArrow />

      <DiagramBox tone="neutral">
        <DiagramStep>
          <DiagramCode>
            Automation::forTrigger(&apos;payment_failed&apos;)-&gt;where(&apos;is_template&apos;,
            false)-&gt;with(&apos;rules&apos;)-&gt;get()
          </DiagramCode>
        </DiagramStep>
      </DiagramBox>

      <DiagramArrow label="for each automation" />

      <DiagramBox label="evaluateConditions() · AND across all rules" tone="accent2">
        <DiagramStep>
          <DiagramCode>
            evaluateCondition($key, $config) → strategy match
          </DiagramCode>
        </DiagramStep>
        <div className="pl-3 mt-1 grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-0.5 text-[var(--text)] text-[11.5px]">
          <span>unit_size</span>
          <span>unit_type</span>
          <span>amount_threshold</span>
          <span>customer_type</span>
          <span>days_since</span>
          <span>has_autopay</span>
          <span>rental_duration</span>
          <span>lien_stage</span>
        </div>
      </DiagramBox>

      <DiagramArrow label="if all pass" />

      <DiagramBox label="executeActions() · sorted by sort_order" tone="green">
        <DiagramStep>
          <DiagramCode>executeAction($key, $config) → strategy match</DiagramCode>
        </DiagramStep>
        <div className="pl-3 mt-1 grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-0.5 text-[var(--text)] text-[11.5px]">
          <span>send_email</span>
          <span>send_sms</span>
          <span>create_task</span>
          <span>apply_fee</span>
          <span>change_rental_status</span>
          <span>change_unit_status</span>
          <span>send_webhook</span>
          <span>add_note</span>
          <span>send_in_app</span>
          <span>update_field (whitelisted)</span>
        </div>
      </DiagramBox>

      <DiagramArrow />

      <DiagramBox tone="neutral">
        <DiagramStep>
          <DiagramCode>
            logExecution(automation, status, actions, error, timing)
          </DiagramCode>
        </DiagramStep>
      </DiagramBox>

      <DiagramHeading>Dry run · admin clicks &ldquo;Test&rdquo; in builder UI</DiagramHeading>
      <DiagramBox label="AutomationEngine::testRun($automation)" tone="amber">
        <DiagramStep>
          <DiagramCode>resolveSampleModel(triggerKey, facilityId)</DiagramCode>{" "}
          — pulls a real row matching the trigger type
        </DiagramStep>
        <DiagramStep>
          evaluates each condition <em>individually</em> (not
          short-circuit)
        </DiagramStep>
        <DiagramStep>lists every action that WOULD run</DiagramStep>
        <DiagramStep>
          returns structured preview to UI — no DB writes, no emails, no
          webhooks fired
        </DiagramStep>
      </DiagramBox>
    </Diagram>
  ),
  snippetsSection: {
    tag: "The Code · how it flows",
    heading: "Three snippets, in execution order",
    intro:
      "Conditions evaluate first → actions execute on pass → testRun mirrors the same code path without side effects. Real excerpts from `app/Services/AutomationEngine.php`.",
  },
  snippets: [
    {
      filename: "AutomationEngine.php · evaluateCondition + 3 evaluators",
      lang: "php",
      stepLabel: "Step 1 · Decide whether to fire",
      stepHeading:
        "Condition dispatcher (AND across all conditions, short-circuiting)",
      stepBlurb:
        "Three representative evaluators below. Each reads its own config shape — no shared schema, no over-abstraction. Adding `evalUnitFloor` is one method + one match arm.",
      code: `private function evaluateConditions(Automation $automation, Model $model, array $context): bool
{
    // AND across all conditions. Short-circuits on first false.
    $conditions = $automation->rules->where('type', 'condition');
    foreach ($conditions as $condition) {
        if (!$this->evaluateCondition($condition->key, $condition->config, $model, $context)) {
            return false;
        }
    }
    return true;
}

private function evaluateCondition(string $key, array $config, Model $model, array $context): bool
{
    return match ($key) {
        'unit_size'        => $this->evalUnitSize($config, $model, $context),
        'unit_type'        => $this->evalUnitType($config, $model, $context),
        'amount_threshold' => $this->evalAmountThreshold($config, $model, $context),
        'customer_type'    => $this->evalCustomerType($config, $model, $context),
        'days_since'       => $this->evalDaysSince($config, $model, $context),
        'has_autopay'      => $this->evalHasAutopay($config, $model, $context),
        'rental_duration'  => $this->evalRentalDuration($config, $model, $context),
        'lien_stage'       => $this->evalLienStage($config, $model, $context),
        default            => true,  // unknown condition = pass (don't break old rules)
    };
}

// ── Three representative evaluators ──────────────────────────────
private function evalAmountThreshold(array $config, Model $model, array $context): bool
{
    // Pulls the "amount" off whatever subject the trigger fired on.
    $amount = match (true) {
        $model instanceof Payment => (float) $model->amount,
        $model instanceof Rental  => (float) $model->monthly_rate,
        default                   => null,
    };
    if ($amount === null) return true;  // no amount → pass

    $op        = $config['operator'] ?? 'gt';
    $threshold = (float) ($config['value'] ?? 0);

    return match ($op) {
        'gt'    => $amount > $threshold,
        'lt'    => $amount < $threshold,
        'gte'   => $amount >= $threshold,
        'lte'   => $amount <= $threshold,
        'eq'    => abs($amount - $threshold) < 0.01,
        default => true,
    };
}

private function evalCustomerType(array $config, Model $model, array $context): bool
{
    $user = $this->resolveUser($model, $context);
    if (!$user) return true;

    $target = $config['value'] ?? null;

    // "commercial" is a flag, not a role — handle separately.
    if ($target === 'commercial') {
        return $user->is_commercial ?? false;
    }

    // Otherwise compare against User::role.
    return $user->role === $target;
}`,
    },
    {
      filename: "AutomationEngine.php · executeAction + 2 executors",
      lang: "php",
      stepLabel: "Step 2 · If conditions pass",
      stepHeading:
        "Action dispatcher (executes sorted, returns audit-friendly status strings)",
      stepBlurb:
        "Same pattern as conditions. Each action returns a short status (\"created\", \"applied:25.00\", \"skipped:no_rental\") that lands in the AutomationLog row.",
      code: `private function executeAction(string $key, array $config, Model $model, array $context): string
{
    return match ($key) {
        'send_email'           => $this->executeSendEmail($config, $model, $context),
        'send_sms'             => $this->executeSendSms($config, $model, $context),
        'create_task'          => $this->executeCreateTask($config, $model, $context),
        'apply_fee'            => $this->executeApplyFee($config, $model, $context),
        'change_rental_status' => $this->executeChangeRentalStatus($config, $model, $context),
        'change_unit_status'   => $this->executeChangeUnitStatus($config, $model, $context),
        'send_webhook'         => $this->executeSendWebhook($config, $model, $context),
        'add_note'             => $this->executeAddNote($config, $model, $context),
        'send_in_app'          => $this->executeSendInApp($config, $model, $context),
        'update_field'         => $this->executeUpdateField($config, $model, $context),
        'wait'                 => 'skipped:wait_not_supported_in_sync',
        default                => 'skipped:unknown_action',
    };
}

// ── Two representative executors ─────────────────────────────────
private function executeApplyFee(array $config, Model $model, array $context): string
{
    $rental = $this->resolveRental($model, $context);
    if (!$rental) return 'skipped:no_rental';

    $amount = (float) ($config['amount'] ?? 0);

    // FeeItem rows are pre-defined facility fees — admin picks from a dropdown,
    // amount looked up at execution time. Avoids hardcoding amounts in rules.
    if (!empty($config['fee_item_id'])) {
        $feeItem = FeeItem::find($config['fee_item_id']);
        if ($feeItem) {
            $amount = (float) $feeItem->amount;
        }
    }

    if ($amount <= 0) return 'skipped:zero_amount';

    Payment::create([
        'facility_id'  => FacilityContext::id(),
        'rental_id'    => $rental->id,
        'user_id'      => $rental->user_id,
        'amount'       => $amount,
        'status'       => 'pending',
        'method'       => 'manual',
        'due_date'     => now(),
        'description'  => $this->interpolate($config['description'] ?? 'Automated fee', $model, $context),
    ]);

    return 'applied:' . number_format($amount, 2);
}

private function executeChangeRentalStatus(array $config, Model $model, array $context): string
{
    $rental = $this->resolveRental($model, $context);
    if (!$rental) return 'skipped:no_rental';

    $newStatus = $config['status'] ?? null;
    if (!$newStatus) return 'skipped:no_status';

    $oldStatus = $rental->status;
    $rental->update(['status' => $newStatus]);

    AuditLog::log(
        'automation_rental_status_change',
        "Automation changed rental #{$rental->id} status from {$oldStatus} to {$newStatus}",
        null,
        $rental,
    );

    return "changed:{$oldStatus}->{$newStatus}";
}`,
    },
    {
      filename: "AutomationEngine.php · testRun()",
      lang: "php",
      stepLabel: "Step 3 · Without firing for real",
      stepHeading: "testRun() — real data, every condition evaluated, no side effects",
      stepBlurb:
        "Two important details: it pulls a real sample model matching the trigger type (so \"is the customer commercial?\" returns a real answer), and it does NOT short-circuit on first failed condition — every condition is evaluated independently so the admin sees which condition is blocking the rule.",
      code: `public function testRun(Automation $automation): array
{
    $automation->loadMissing('rules');

    $triggerRule = $automation->rules->where('type', 'trigger')->first();
    $triggerKey  = $triggerRule?->key ?? 'unknown';

    // Pick a REAL sample subject from the DB — matching the trigger type.
    $sampleModel = $this->resolveSampleModel($triggerKey, $automation->facility_id);

    $context = ['trigger_key' => $triggerKey];
    $user    = $this->resolveUser($sampleModel, $context);
    $rental  = $this->resolveRental($sampleModel, $context);
    if ($user)   $context['user']   = $user;
    if ($rental) $context['rental'] = $rental;

    // Evaluate every condition INDEPENDENTLY — no short-circuit — so the
    // UI can show the admin which condition blocked the rule.
    $conditionResults = [];
    $allPass          = true;
    foreach ($automation->rules->where('type', 'condition') as $cond) {
        $passed = $this->evaluateCondition($cond->key, $cond->config, $sampleModel, $context);
        $conditionResults[] = [
            'key'    => $cond->key,
            'config' => $cond->config,
            'passed' => $passed,
        ];
        if (!$passed) {
            $allPass = false;
        }
    }

    // List actions that WOULD run, but don't run them.
    $actionsWouldRun = [];
    foreach ($automation->rules->where('type', 'action')->sortBy('sort_order') as $action) {
        $actionsWouldRun[] = [
            'key'           => $action->key,
            'config'        => $action->config,
            'would_execute' => $allPass,
        ];
    }

    return [
        'would_trigger'     => $allPass,
        'trigger_key'       => $triggerKey,
        'conditions_met'    => $conditionResults,
        'actions_would_run' => $actionsWouldRun,
        'sample_subject'    => [
            'type'  => class_basename($sampleModel),
            'id'    => $sampleModel->getKey(),
            'label' => $sampleModel->name ?? $sampleModel->unit_number ?? ('ID ' . $sampleModel->getKey()),
        ],
    ];
}`,
    },
  ],
  sourceFooter:
    "Excerpts from `app/Services/AutomationEngine.php` in MONISCOPE (pre-launch). The full build also includes the `{{var}}` interpolation helper, the `UPDATABLE_FIELDS` whitelist for `update_field`, per-automation try/catch isolation, and the bounded webhook timeout — happy to walk through any of them.",
};
