export default function DropDown({ options, type, change, value }) {
  return (
    <select
      className="border-b py-1.5 px-2 rounded-md bg-white text-gray-700 
                 outline-none focus:ring-2 focus:ring-black transition w-full md:w-auto"
      value={value}
      onChange={(e) => change(type, e.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
