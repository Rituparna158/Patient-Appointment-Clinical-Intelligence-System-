export function formatTime(time: string) {
  return new Date(`1970-0-01T${time}`).toLocaleDateString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}
