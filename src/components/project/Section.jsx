export default function Section({ title, children }) {
    return (
        <section className="my-8 bg-gray-50 border relative">
            <h2 className="font-semibold text-base md:text-lg p-4 border-b">
                {title}
            </h2>

            <div className="p-5">
                {children}
            </div>

            {/* fade effect only on right side */}
            <div className="pointer-events-none h-full w-12 bg-linear-to-r from-gray-50 to-transparent" />
        </section>
    )
}