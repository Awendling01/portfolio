import type { CaseStudy } from "./index";
import {
  Diagram,
  DiagramBox,
  DiagramArrow,
  DiagramRow,
  DiagramStep,
  DiagramCode,
  DiagramHint,
} from "@/components/case-study/diagram";

export const reporting: CaseStudy = {
  slug: "reporting",
  number: "05",
  title: "Reporting engine",
  shortTitle: "Reporting Engine",
  oneLiner:
    "Database-driven multi-month aggregations behind a single query builder. Six saved-report types, one return shape, PDF + CSV export. Aggregation runs in SQL; PHP only handles formatting.",
  lede:
    "A standardized report builder designed to support six saved-report types with a single return shape: { headers, rows, totals, generated_at, row_count }. Aggregation runs in SQL (not PHP). PDF and CSV exports consume the same shape. Adding a new report type is one method plus one dispatcher arm.",
  prelaunchNote:
    "Pre-launch — reports query seeded data in dev. The patterns (SQL-first aggregation, hard row caps, RFC-4180 CSV) are ship-ready and shared with the larger `ReportService` (~1,400 LOC) that drives the interactive admin UI.",
  whereSection: {
    tag: "The six report types",
    heading: "All run through one builder, one return shape",
  },
  whereItShowsUp: {
    kind: "report-grid",
    entries: [
      { name: "occupancy", desc: "Unit counts by size + occupancy %" },
      { name: "revenue", desc: "Multi-month revenue with drill-downs" },
      { name: "delinquency", desc: "Overdue tenants by lien stage" },
      { name: "movement", desc: "Move-ins / move-outs by period" },
      { name: "aging", desc: "AR aging buckets, total in SQL" },
      { name: "autopay", desc: "Autopay attempts, success / fail" },
    ],
  },
  whySection: {
    tag: "The engineering \"why\"",
    heading: "Six things that keep this fast and consistent",
  },
  whyTiles: [
    {
      number: 1,
      title: "Standardized return shape",
      body: "Every builder returns { headers, rows, totals }. The Vue table, PDF export, and CSV writer all consume it identically. Adding a new report = one method + one dispatcher arm.",
      ref: "snippet 01",
    },
    {
      number: 2,
      title: "Aggregation in SQL, not in PHP",
      body: "`selectRaw('COUNT/SUM/AVG')`, `CASE WHEN ... THEN 1 ELSE 0`. The naive PHP version pulls every unit into memory; this version runs one indexed query.",
      ref: "snippet 02",
    },
    {
      number: 3,
      title: "Hard row caps with grand total in SQL",
      body: "Detail reports cap at `->limit(10000)`. The displayed rows are capped, but the grand total uses an independent `SUM()` query so the operator sees the true universe of overdue debt.",
      ref: "snippet 03",
    },
    {
      number: 4,
      title: "Database-portable raw expressions",
      body: "Month bucketing uses `DATE_FORMAT(...)` on MySQL and `strftime(...)` on SQLite, picked at runtime via `DB::getDriverName()`. Tests run SQLite; the deploy target runs MySQL — one builder, two DBs.",
      ref: "in full case study",
    },
    {
      number: 5,
      title: "Eager-load with column projection",
      body: "`with('user:id,name,email')` only loads the three columns we'll display. No SELECT *. Saves bandwidth on 10K-row reports.",
      ref: "snippet 03",
    },
    {
      number: 6,
      title: "PDF is data-only, CSV is RFC-4180-correct",
      body: "PDF passes the standardized shape to a Blade view — no queries, no aggregation in the template. CSV is hand-rolled with doublequote-escaping + CRLF terminators (no fputcsv).",
      ref: "in full case study",
    },
  ],
  architectureSection: {
    tag: "Architecture",
    heading: "One builder, three exporters",
  },
  architectureDiagram: (
    <Diagram>
      <DiagramBox
        label="Admin → Reports → &ldquo;Run&rdquo; on a SavedReport"
        tone="accent"
      >
        <DiagramStep>
          <DiagramCode>ReportController::run($id)</DiagramCode>
        </DiagramStep>
        <DiagramStep>
          <DiagramCode>ReportBuilder::run($savedReport)</DiagramCode>
        </DiagramStep>
      </DiagramBox>

      <DiagramArrow label="match($report->report_type)" />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <DiagramBox label="occupancy" tone="neutral">
          <DiagramCode>buildOccupancyReport()</DiagramCode>
        </DiagramBox>
        <DiagramBox label="revenue" tone="neutral">
          <DiagramCode>buildRevenueReport()</DiagramCode>
        </DiagramBox>
        <DiagramBox label="delinquency" tone="neutral">
          <DiagramCode>buildDelinquencyReport()</DiagramCode>
        </DiagramBox>
        <DiagramBox label="movement" tone="neutral">
          <DiagramCode>buildMovementReport()</DiagramCode>
        </DiagramBox>
        <DiagramBox label="aging" tone="neutral">
          <DiagramCode>buildAgingReport()</DiagramCode>
        </DiagramBox>
        <DiagramBox label="autopay" tone="neutral">
          <DiagramCode>buildAutopayReport()</DiagramCode>
        </DiagramBox>
      </div>

      <DiagramArrow label="every builder returns the same shape" />

      <DiagramBox tone="green">
        <DiagramStep>
          <DiagramCode>{`{ headers, rows, totals, generated_at, row_count }`}</DiagramCode>
        </DiagramStep>
        <DiagramHint tone="green">
          aggregation runs in SQL, PHP only formats
        </DiagramHint>
      </DiagramBox>

      <DiagramArrow />

      <DiagramRow>
        <DiagramBox label="Vue table (shared component)" tone="accent">
          renders <DiagramCode>{"{ headers, rows, totals }"}</DiagramCode>
        </DiagramBox>
        <DiagramBox label="exportToPdf" tone="accent2">
          spatie/laravel-pdf
        </DiagramBox>
        <DiagramBox label="exportToCsv" tone="amber">
          RFC-4180, hand-rolled
        </DiagramBox>
      </DiagramRow>
    </Diagram>
  ),
  snippetsSection: {
    tag: "The Code · how it flows",
    heading: "Three snippets, in execution order",
    intro:
      "Dispatch by report_type → build each report with SQL-first aggregation → cap rows but compute the true total independently. Real excerpts from `app/Services/ReportBuilder.php`.",
  },
  snippets: [
    {
      filename: "ReportBuilder.php · run()",
      lang: "php",
      stepLabel: "Step 1 · Dispatch",
      stepHeading: "One run() method, six builders, one shape",
      stepBlurb:
        "Every consumer — Vue table, PDF view, CSV writer — sees the same fields. Forward-compatible: a SavedReport row referencing a removed report type returns an empty shape, not an exception.",
      code: `namespace App\\Services;

use App\\Models\\SavedReport;
use Illuminate\\Support\\Facades\\DB;

class ReportBuilder
{
    /**
     * Run a SavedReport (parameters stored on the row) and return the
     * standardized data shape used by every downstream consumer.
     */
    public function run(SavedReport $report): array
    {
        $params     = $report->parameters ?? [];
        $facilityId = $report->facility_id;

        $data = match ($report->report_type) {
            'occupancy'   => $this->buildOccupancyReport($params, $facilityId),
            'revenue'     => $this->buildRevenueReport($params, $facilityId),
            'delinquency' => $this->buildDelinquencyReport($params, $facilityId),
            'movement'    => $this->buildMovementReport($params, $facilityId),
            'aging'       => $this->buildAgingReport($params, $facilityId),
            'autopay'     => $this->buildAutopayReport($params, $facilityId),
            // Unknown report type → empty shape, not an exception.
            // Forward-compatible if a SavedReport references a removed type.
            default       => ['headers' => [], 'rows' => [], 'totals' => []],
        };

        // Stamp metadata that every consumer expects.
        $data['generated_at'] = now()->toIso8601String();
        $data['row_count']    = count($data['rows'] ?? []);

        return $data;
    }
}`,
    },
    {
      filename: "ReportBuilder.php · buildOccupancyReport()",
      lang: "php",
      stepLabel: "Step 2 · A representative builder",
      stepHeading: "Occupancy report — pure SQL aggregation",
      stepBlurb:
        "The naive PHP version pulls every unit into memory and groups by size. With 50 facilities × 800 units that adds up. The SQL version computes the same six counts (total, occupied, available, reserved, maintenance, occupancy %) in ONE query against an indexed status column. PHP only does the percentage formatting.",
      code: `public function buildOccupancyReport(array $params, int $facilityId): array
{
    // Aggregate in the database. One query, indexed scan on units.status.
    // CASE WHEN ... THEN 1 ELSE 0 / SUM is a portable conditional count —
    // works on MySQL, SQLite, Postgres without a CASE-by-driver.
    $rows = Unit::selectRaw("
            ui.unit_size,
            COUNT(*) as total,
            SUM(CASE WHEN units.status = 'occupied'    THEN 1 ELSE 0 END) as occupied,
            SUM(CASE WHEN units.status = 'available'   THEN 1 ELSE 0 END) as available,
            SUM(CASE WHEN units.status = 'reserved'    THEN 1 ELSE 0 END) as reserved,
            SUM(CASE WHEN units.status = 'maintenance' THEN 1 ELSE 0 END) as maintenance
        ")
        ->join('unit_inventories as ui', 'units.unit_inventory_id', '=', 'ui.id')
        ->groupBy('ui.unit_size')
        ->orderBy('ui.unit_size')
        ->get()
        // PHP only does the percentage formatting — heavy lifting is done.
        ->map(fn ($row) => [
            $row->unit_size,
            $row->total,
            (int) $row->occupied,
            (int) $row->available,
            (int) $row->reserved,
            (int) $row->maintenance,
            $row->total > 0
                ? round(($row->occupied / $row->total) * 100, 1) . '%'
                : '0%',
        ])
        ->toArray();

    // Roll-up totals — second small query, also aggregated.
    $totals = Unit::selectRaw("
            COUNT(*) as total,
            SUM(CASE WHEN units.status = 'occupied' THEN 1 ELSE 0 END) as occupied
        ")
        ->join('unit_inventories as ui', 'units.unit_inventory_id', '=', 'ui.id')
        ->first();

    return [
        'headers' => ['Unit Size', 'Total', 'Occupied', 'Available', 'Reserved', 'Maintenance', 'Occupancy %'],
        'rows'    => $rows,
        'totals'  => [
            'Total Units'    => $totals->total ?? 0,
            'Total Occupied' => (int) ($totals->occupied ?? 0),
            'Overall Rate'   => ($totals->total ?? 0) > 0
                ? round(((int) $totals->occupied / $totals->total) * 100, 1) . '%'
                : '0%',
        ],
    ];
}`,
    },
    {
      filename: "ReportBuilder.php · buildAgingReport()",
      lang: "php",
      stepLabel: "Step 3 · A larger detail report",
      stepHeading: "AR aging — bucketed in PHP, capped at 10K rows, total in SQL",
      stepBlurb:
        "The bucket label ('1-30', '31-60', '61-90', '90+') is computed in PHP because it's cheap and presentational. The grand total — across the entire universe of overdue debt — is a separate SQL `SUM(amount + late_fee)` query, so the displayed rows can be capped without losing the true total.",
      code: `public function buildAgingReport(array $params, int $facilityId): array
{
    $rows = Payment::where('type', 'charge')
        ->where('status', 'pending')
        ->where('due_date', '<', now())
        ->with([
            // Column projection on relations — avoid SELECT *.
            'user:id,name,email',
            'rental:id,unit_number',
        ])
        ->select('id', 'user_id', 'rental_id', 'amount', 'late_fee', 'due_date')
        ->limit(10000)  // hard cap — backstop, not a feature
        ->get()
        ->map(function ($p) {
            $days   = (int) Carbon::parse($p->due_date)->diffInDays(now());
            $bucket = match (true) {
                $days <= 30 => '1-30',
                $days <= 60 => '31-60',
                $days <= 90 => '61-90',
                default     => '90+',
            };

            return [
                $p->user->name  ?? 'Unknown',
                $p->user->email ?? '',
                $p->rental->unit_number ?? '',
                '$' . number_format((float) $p->amount, 2),
                '$' . number_format((float) $p->late_fee, 2),
                '$' . number_format((float) $p->amount + (float) $p->late_fee, 2),
                $p->due_date?->format('Y-m-d'),
                $days,
                $bucket,
            ];
        });

    return [
        'headers' => ['Customer', 'Email', 'Unit', 'Amount', 'Late Fee', 'Total Owed', 'Due Date', 'Days Overdue', 'Bucket'],
        'rows'    => $rows->toArray(),
        'totals'  => [
            'Total Records' => $rows->count(),

            // Total computed in SQL — independent of the 10K cap above.
            // If 10,001 records exist, the displayed rows are capped, but the
            // grand total still represents the true universe of overdue debt.
            'Total Owed' => '$' . number_format(
                Payment::where('type', 'charge')
                    ->where('status', 'pending')
                    ->where('due_date', '<', now())
                    ->sum(DB::raw('amount + late_fee')),
                2
            ),
        ],
    ];
}`,
    },
  ],
  sourceFooter:
    "Excerpts from `app/Services/ReportBuilder.php` in MONISCOPE (pre-launch). The larger `ReportService` (~1,400 LOC) is designed to support 30+ ad-hoc admin reports using the same patterns. The full build also includes the cross-database month-format helper, RFC-4180 CSV writer, and Spatie Laravel-PDF export — happy to walk through any of them.",
};
