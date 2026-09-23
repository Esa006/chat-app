/**
 * Web Audio API synthesised notification chime sound (no external file needed)
 */
export function playNotificationSound() {
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    // First note (High G6)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1567.98, ctx.currentTime); // G6
    gain1.gain.setValueAtTime(0.15, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.25);

    // Second note (High C7 - 0.1s delay)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(2093.00, ctx.currentTime + 0.1); // C7
    gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.1);
    osc2.stop(ctx.currentTime + 0.4);
  } catch (e) {
    console.warn('Could not play notification sound:', e);
  }
}

/**
 * Request Browser Desktop Notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

/**
 * Show a WhatsApp-style Browser Desktop Notification
 */
export function showDesktopNotification(senderName: string, messageBody: string) {
  playNotificationSound();

  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      const notification = new Notification(`💬 ${senderName}`, {
        body: messageBody.length > 80 ? messageBody.substring(0, 80) + '...' : messageBody,
        icon: '/favicon.ico',
        tag: 'chatflow-message',
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto close after 5 seconds
      setTimeout(() => notification.close(), 5000);
    } catch (e) {
      console.warn('Failed to display notification:', e);
    }
  }
}
