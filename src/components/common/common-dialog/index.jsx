import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { XIcon } from "lucide-react";

const CommonDialog = ({
  children,
  title,
  dialogContent,
  isOpen,
  setIsOpen,
  setIsClose,
}) => {
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center justify-between">
                <div>{title}</div>
                <div onClick={setIsClose}>
                  <XIcon className="cursor-pointer" />
                </div>
              </div>
            </DialogTitle>
            <DialogDescription>{dialogContent}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommonDialog;
