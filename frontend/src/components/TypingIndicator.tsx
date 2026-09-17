interface TypingIndicatorProps {
  typerName: string | null;
}

export function TypingIndicator({ typerName }: TypingIndicatorProps) {
  if (!typerName) return null;

  return (
    <div className="typing-indicator" aria-live="polite">
      <div className="typing-dots">
        <span /><span /><span />
      </div>
      <span className="typing-text">{typerName} is typing…</span>
    </div>
  );
}
