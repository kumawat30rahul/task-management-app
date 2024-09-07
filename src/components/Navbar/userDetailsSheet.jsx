import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SheetDemo({ triggerButton, children }) {
  return (
    <Sheet>
      <SheetTrigger asChild>{triggerButton}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>User profile</SheetTitle>
          <div>{children}</div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
