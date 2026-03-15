export default function StatusCards({ Icon, title, value }) {
    return (
        <div className="rounded-sm border p-4">
            <div className="flex justify-between gap-2 items-center">
                <div className="flex items-center justify-center p-2 rounded-lg transition bg-gray-200">
                    <Icon size={35} className="text-gray-700" />
                </div>
                <div>
                    <h3 className="text-base">{title}</h3>
                    <p className="text-xl font-bold">{value}</p>
                </div>
            </div>
        </div>
    )
}