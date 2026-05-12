import { timeAgo } from "@/lib/format";
import {
  markMessageRead,
  toggleMessageResponded,
  softDeleteMessage,
  restoreMessage,
} from "@/app/(site)/admin/messages/actions";

// Per-message card on the /admin/messages page. Wraps the row of
// metadata + body + action buttons that branched on three booleans
// (isUnread / isResponded / isDeleted) into a single component so
// the page reads as a list of cards rather than 100 lines of nested
// conditional JSX.
//
// Server actions are imported here so the <form action={...}> wiring
// stays attached to the rendered cards without prop-threading.

type Message = {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: Date | string;
  readAt: Date | string | null;
  respondedAt: Date | string | null;
  deletedAt: Date | string | null;
};

type Props = {
  message: Message;
};

export default function MessageCard({ message: m }: Props) {
  const created = new Date(m.createdAt);
  const isUnread = !m.readAt && !m.deletedAt;
  const isResponded = !!m.respondedAt;
  const isDeleted = !!m.deletedAt;

  return (
    <div
      className={`rounded-2xl border p-5 sm:p-6 transition-colors ${
        isDeleted
          ? "border-[var(--border)]/60 bg-[var(--surface)]/40 opacity-70"
          : isUnread
            ? "border-[var(--accent)]/30 bg-[var(--surface)]/80"
            : "border-[var(--border)] bg-[var(--surface)]/80"
      }`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="text-base font-semibold text-white tracking-tight">
            {m.name}
          </span>
          <a
            href={`mailto:${m.email}`}
            className="text-sm text-[var(--accent)] hover:underline break-all"
          >
            {m.email}
          </a>
          {isUnread ? (
            <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)] bg-[var(--accent)]/[0.12] px-2 py-0.5 rounded">
              New
            </span>
          ) : null}
          {isResponded ? (
            <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--green)] bg-[var(--green)]/[0.10] px-2 py-0.5 rounded">
              Responded
            </span>
          ) : null}
        </div>
        <span
          className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--text)]"
          title={created.toISOString()}
        >
          {timeAgo(created)}
        </span>
      </div>
      <p className="mt-3 text-sm text-[var(--text2)] leading-relaxed whitespace-pre-wrap break-words">
        {m.message}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 mono text-[11px] text-[var(--text)]">
        <span>#{m.id}</span>
        <a
          href={`mailto:${m.email}?subject=Re: your message via andrewwendling.info`}
          className="hover:text-[var(--accent)] transition-colors"
        >
          Reply →
        </a>

        {!isDeleted && isUnread ? (
          <form action={markMessageRead} className="contents">
            <input type="hidden" name="id" value={m.id} />
            <button
              type="submit"
              className="hover:text-white transition-colors cursor-pointer"
            >
              Mark read
            </button>
          </form>
        ) : null}

        {!isDeleted ? (
          <form action={toggleMessageResponded} className="contents">
            <input type="hidden" name="id" value={m.id} />
            <button
              type="submit"
              className={`transition-colors cursor-pointer ${
                isResponded
                  ? "text-[var(--green)] hover:text-white"
                  : "hover:text-[var(--green)]"
              }`}
            >
              {isResponded ? "Mark unresponded" : "Mark responded"}
            </button>
          </form>
        ) : null}

        {isDeleted ? (
          <form action={restoreMessage} className="contents">
            <input type="hidden" name="id" value={m.id} />
            <button
              type="submit"
              className="hover:text-white transition-colors cursor-pointer"
            >
              Restore
            </button>
          </form>
        ) : (
          <form action={softDeleteMessage} className="contents">
            <input type="hidden" name="id" value={m.id} />
            <button
              type="submit"
              className="hover:text-[var(--rose)] transition-colors cursor-pointer"
            >
              Delete
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
