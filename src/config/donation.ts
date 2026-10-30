import type { DonationConfig } from '~/lib/donation';

/**
 * Where donations go. The `khqr` payload string alone decides which account
 * receives the money, so this file is the site's single trust anchor for
 * donations: every change needs review by SKO's named approver.
 *
 * Changing a QR:
 * 1. In SKO's ABA Mobile, save the ABA QR for the account.
 * 2. Decode it to text (`zbarimg --raw qr.png`, or any QR reader).
 * 3. Paste the text into `khqr` and build. If the build reports `QR pays "X"`
 *    and X is genuinely SKO, set `khqrName` to X.
 *
 * Never commit QR images, only the decoded text.
 *
 * null until SKO sends its details: local and preview builds then show clearly
 * marked placeholder QRs that cannot be paid, and production builds fail.
 */
export const donation: DonationConfig | null = null;
