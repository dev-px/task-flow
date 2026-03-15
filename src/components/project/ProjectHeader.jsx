import { Pencil, Plus } from "lucide-react";

export default function ProjectHeader({ pTitle, pDescription, pButton, type }) {

    const Icon = type === "create" ? Plus : Pencil

    return (
        <div className="flex justify-between items-center">

            <div className="flex flex-col gap-2">
                <h1 className="font-bold text-xl">{pTitle}</h1>
                <p className="text-gray-500">{pDescription}</p>
            </div>

            <button className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-sm hover:bg-gray-700 transition">
                <Icon size={18} />
                {pButton}
            </button>

        </div>
    )
}