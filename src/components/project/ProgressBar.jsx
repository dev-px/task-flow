import { useEffect, useState } from "react";

export default function ProgressBar({ progress }) {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            setWidth(progress);
        }, 100);
    }, [progress]);

    return (
        <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
            <div
                className="h-full bg-linear-to-r from-gray-400 via-gray-600 to-gray-800 transition-all duration-800 ease-out rounded-lg"
                style={{ width: `${width}%` }}
            />
        </div>
    )
}