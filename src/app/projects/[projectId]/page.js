"use client";

import { useParams } from "next/navigation";

export default function kanBanPage() {
    const { projectId } = useParams();
    console.log(projectId)
    return (
        <div></div>
    )
}