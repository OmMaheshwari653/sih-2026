import { type Instrument, instruments } from "@/lib/data";

/**
 * A sticker in the field encodes the public verification URL, but printers,
 * older batches and hand-typed entries all show up as a bare id. Reduce every
 * shape to the identifier the record is looked up by.
 */
export const extractQrId = (payload: string): string => {
  const text = payload.trim();
  if (!text) {
    return "";
  }

  try {
    const url = new URL(text);
    const segments = url.pathname.split("/").filter(Boolean);
    const verifyAt = segments.lastIndexOf("verify");
    const id =
      verifyAt >= 0 ? segments[verifyAt + 1] : segments[segments.length - 1];
    return decodeURIComponent(id ?? "");
  } catch {
    // Not a URL — the payload is the identifier itself.
    return decodeURIComponent(text);
  }
};

/** Matches an instrument by its id, serial number or certificate number. */
export const resolveInstrument = (raw: string): Instrument | null => {
  const key = extractQrId(raw).toUpperCase();
  if (!key) {
    return null;
  }

  return (
    instruments.find(
      (item) =>
        item.id.toUpperCase() === key ||
        item.serial.toUpperCase() === key ||
        item.certificateId?.toUpperCase() === key,
    ) ?? null
  );
};
