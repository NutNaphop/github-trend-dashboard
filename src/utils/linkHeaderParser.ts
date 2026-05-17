// params in linkedHeader finds the `rel="last"` segment and extracts the `page=XX` value from its URL.
export function parseLinkHeader(linkHeader: string | undefined): number {
    if (!linkHeader) return 1;

    const lastMatch = linkHeader.match(/<[^>]*[?&]page=(\d+)[^>]*>;\s*rel="last"/);
    return lastMatch ? parseInt(lastMatch[1], 10) : 1;
}
