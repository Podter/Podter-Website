import { Button } from "@/components/ui/button";
import { Command } from "lucide-react";
import { isCmdkOpen } from "@/lib/stores";

export default function CmdkToggle() {
  return (
    <Button
      size="xs"
      variant="outline"
      onClick={() => isCmdkOpen.set(true)}
      className="hidden sm:inline-flex"
    >
      <Command size={16} />
      <span className="sr-only">Open command menu</span>
    </Button>
  );
}