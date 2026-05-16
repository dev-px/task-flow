import { cn } from "@/lib/utils";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TabsCompo({ tabs, activeTab }) {
  return (
    <div className="overflow-x-auto hide-scrollbar bg-gray-100 rounded-xl">
      <TabsList className="flex justify-between items-center transition-all w-full">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab}
            className={cn(
              "px-4 py-2 text-base font-medium transition cursor-pointer rounded-xl capitalize",
              activeTab === tab
                ? " text-black tracking-wide"
                : "border-transparent text-muted-foreground hover:text-black",
            )}
          >
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
}
