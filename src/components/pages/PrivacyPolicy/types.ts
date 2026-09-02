export type PolicyPart = {
    id: string;
    tabTitle: string;
    fullTitle: string;
    content: string;
}

export const DEFAULT_PARTS: PolicyPart[] = [
    {
        id: "part-1",
        tabTitle: "Part 1",
        fullTitle: "Introduction, Scope & Information We Collect",
        content: ""
    },
    {
        id: "part-2",
        tabTitle: "Part 2",
        fullTitle: "How We Use Information, Cookies & Legal Bases",
        content: ""
    },
    {
        id: "part-3",
        tabTitle: "Part 3",
        fullTitle: "Part 3 — Sharing, International Transfers, Security & Retention",
        content: ""
    },
    {
        id: "part-4",
        tabTitle: "Part 4",
        fullTitle: "Part 4 — Privacy Rights, Regional Disclosures & Contact",
        content: ""
    }
];
