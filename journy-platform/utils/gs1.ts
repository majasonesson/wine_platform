/**
 * GS1 Digital Link Generator
 * Format: {domain}/01/{gtin}/10/{batch}/21/{serial}?17={expiry}
 * 
 * Logic:
 * - 01: GTIN (Mandatory)
 * - 10: Batch/Lot (Optional)
 * - 21: Serial (Optional)
 * - 17: Expiry Date in YYMMDD format (Optional)
 *   - If day is missing, use '00'.
 */

export function generateDigitalLink(params: {
    gtin: string;
    domain?: string;
    batch?: string;
    serial?: string;
    expiryDate?: string | Date;
    alcoholPercent?: number;
}): string {
    const domain = params.domain || (typeof window !== 'undefined' ? window.location.origin : 'https://journy.wine');

    // 1. Base URL with GTIN (AI 01)
    let url = `${domain}/01/${params.gtin}`;

    // 2. Batch (AI 10)
    if (params.batch) {
        url += `/10/${params.batch}`;
    }

    // 3. Serial (AI 21)
    if (params.serial) {
        url += `/21/${params.serial}`;
    }

    // 4. Expiry (AI 17) - Mandatory for wines < 10% alcohol
    if (params.expiryDate && params.alcoholPercent !== undefined && params.alcoholPercent < 10) {
        const d = new Date(params.expiryDate);
        if (!isNaN(d.getTime())) {
            const yy = String(d.getFullYear()).slice(-2);
            const mm = String(d.getMonth() + 1).padStart(2, '0');

            // Default to '00' as requested if day isn't specified (e.g. YYYY-MM)
            let dd = '00';
            if (typeof params.expiryDate === 'string' && params.expiryDate.split('-').length === 3) {
                dd = String(d.getDate()).padStart(2, '0');
            }

            url += `?17=${yy}${mm}${dd}`;
        }
    }

    return url;
}
