export function format_message_time(data: string) {
  return new Date(data).toLocaleDateString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
