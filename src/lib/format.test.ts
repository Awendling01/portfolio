import { describe, expect, it, vi } from "vitest";
import {
  formatDuration,
  formatDwell,
  formatGap,
  formatPct,
  timeAgo,
} from "./format";

// Pure formatters — easy to lock down. These ship in every admin table
// cell so a regression here would visibly break the dashboards.

describe("timeAgo", () => {
  it("renders seconds when under a minute", () => {
    const now = new Date("2026-01-01T12:00:00Z");
    vi.useFakeTimers();
    vi.setSystemTime(now);
    expect(timeAgo(new Date(now.getTime() - 12_000))).toBe("12s ago");
    vi.useRealTimers();
  });

  it("renders minutes between 60s and 60m", () => {
    const now = new Date("2026-01-01T12:00:00Z");
    vi.useFakeTimers();
    vi.setSystemTime(now);
    expect(timeAgo(new Date(now.getTime() - 5 * 60_000))).toBe("5m ago");
    vi.useRealTimers();
  });

  it("renders hours between 1h and 24h", () => {
    const now = new Date("2026-01-01T12:00:00Z");
    vi.useFakeTimers();
    vi.setSystemTime(now);
    expect(timeAgo(new Date(now.getTime() - 3 * 60 * 60_000))).toBe("3h ago");
    vi.useRealTimers();
  });

  it("renders days between 1d and 30d", () => {
    const now = new Date("2026-01-15T12:00:00Z");
    vi.useFakeTimers();
    vi.setSystemTime(now);
    expect(timeAgo(new Date(now.getTime() - 2 * 24 * 60 * 60_000))).toBe(
      "2d ago",
    );
    vi.useRealTimers();
  });

  it("falls back to ISO date past 30d", () => {
    const now = new Date("2026-01-01T12:00:00Z");
    vi.useFakeTimers();
    vi.setSystemTime(now);
    expect(timeAgo(new Date("2025-01-01T00:00:00Z"))).toBe("2025-01-01");
    vi.useRealTimers();
  });
});

describe("formatGap", () => {
  it("renders seconds with a + prefix", () => {
    expect(formatGap(7_000)).toBe("+7s");
  });

  it("renders minutes-only when seconds are 0", () => {
    expect(formatGap(5 * 60_000)).toBe("+5m");
  });

  it("renders minutes + seconds when both are non-zero", () => {
    expect(formatGap(2 * 60_000 + 30_000)).toBe("+2m 30s");
  });

  it("renders hours + minutes past 60m", () => {
    expect(formatGap(75 * 60_000)).toBe("+1h 15m");
  });
});

describe("formatDwell", () => {
  it("returns an em-dash for null", () => {
    expect(formatDwell(null)).toBe("—");
  });

  it("returns an em-dash for under 1 second", () => {
    expect(formatDwell(800)).toBe("—");
  });

  it("renders raw seconds under a minute", () => {
    expect(formatDwell(45_000)).toBe("45s");
  });

  it("renders minutes + seconds when both are non-zero", () => {
    expect(formatDwell(2 * 60_000 + 30_000)).toBe("2m 30s");
  });

  it("renders minutes-only when seconds round to 0", () => {
    expect(formatDwell(5 * 60_000)).toBe("5m");
  });
});

describe("formatDuration", () => {
  it("treats sub-second the same as formatDwell (em-dash)", () => {
    expect(formatDuration(800)).toBe("—");
  });

  it("renders seconds under a minute", () => {
    expect(formatDuration(30_000)).toBe("30s");
  });

  it("renders minutes + seconds", () => {
    expect(formatDuration(90_000)).toBe("1m 30s");
  });
});

describe("formatPct", () => {
  it("converts a decimal to a one-decimal percentage", () => {
    expect(formatPct(0.856)).toBe("85.6%");
  });

  it("handles 0 cleanly", () => {
    expect(formatPct(0)).toBe("0.0%");
  });

  it("handles 1 cleanly", () => {
    expect(formatPct(1)).toBe("100.0%");
  });
});
