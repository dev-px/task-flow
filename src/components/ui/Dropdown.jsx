export default function DropDown({ options, type, change, value }) {
    return (
        <select className="border-b py-1.5 outline-0 focus:outline-none transition w-full md:w-auto"
            value={value} onChange={(e) => change(type, e.target.value)}>
            {options.map((option) => (
                <option key={option.value} value={option.value} className="bg-gray-100">
                    {option.label}
                </option>
            ))}
        </select>
    )
}