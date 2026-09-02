export type TermsPart = {
    id: string;
    tabTitle: string;
    fullTitle: string;
    content: string;
}

export const DEFAULT_TERMS_PARTS: TermsPart[] = [
    {
        id: "part-1",
        tabTitle: "Part 1",
        fullTitle: "Introduction & Accounts",
        content: ""
    },
    {
        id: "part-2",
        tabTitle: "Part 2",
        fullTitle: "Credits & Payments",
        content: ""
    },
    {
        id: "part-3",
        tabTitle: "Part 3",
        fullTitle: "Responsibilities & Safety",
        content: ""
    },
    {
        id: "part-4",
        tabTitle: "Part 4",
        fullTitle: "Intellectual Property, Suspension & Liability",
        content: ""
    },
    {
        id: "part-5",
        tabTitle: "Part 5",
        fullTitle: "Legal Provisions",
        content: ""
    }
];
