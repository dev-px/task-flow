import { cn } from "@/lib/utils";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TabsCompo({ tabs, activeTab }) {
  return (
    <div className="overflow-x-auto hide-scrollbar border-b">
      <TabsList className="flex justify-between items-center transition-all w-full bg-transparent p-0">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab}
            className={cn(
              "px-4 py-2 text-base font-medium transition",
              activeTab === tab
                ? "border-black text-black tracking-wide"
                : "border-transparent text-muted-foreground hover:text-black",
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  );
}
