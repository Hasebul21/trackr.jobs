// Information page — Master Application Profile.
//
// Server component shell: keeps `metadata` SEO friendly while delegating
// the interactive sidebar + per-section rendering to the client view.

import type { Metadata } from "next";
import { InformationView } from "./view";

export const metadata: Metadata = {
    title: "Information — Trackr.jobs",
    description:
        "Master application profile: contact, education, experience, publications, certifications, and references.",
};

export default function InformationPage() {
    return <InformationView />;
}
