import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function TaskFooter({
  currentIndex,
  prevTab,
  nextTab,
  len,
  projectId,
  onSave,
}) {
  const router = useRouter();
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 mt-8 shrink-0">
      <Button variant="outline" onClick={prevTab} disabled={currentIndex === 0}>
        Previous
      </Button>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          onClick={() => router.push(`/projects/${projectId}`)}
        >
          Cancel
        </Button>
        <Button onClick={() => onSave()}>Save</Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button onClick={nextTab} disabled={currentIndex === len - 1}>
          Next
        </Button>
      </div>
    </div>
  );
}
