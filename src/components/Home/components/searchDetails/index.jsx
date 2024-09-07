import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { searchTasks } from "@/Config/services";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import TaskCard from "../task-card";
import { CircularProgress } from "@mui/material";

export function SearchSheet({
  children,
  setTaskType,
  setTaskId,
  taskCardButtonLoaders,
}) {
  const [searchedValue, setSearchedValue] = useState(null);
  const [taskDetails, setTaskDetails] = useState();
  const [debouncedValue, setValue] = useDebounceValue(searchedValue, 500);
  const [searchLoader, setSearchLoader] = useState(false);

  useEffect(() => {
    if (debouncedValue !== null) {
      setSearchLoader(true);
      searchTasks(debouncedValue)
        .then((response) => {
          const data = response?.data?.map((task) => ({
            id: task?.taskId,
            taskName: task?.taskName,
            taskDescription: task?.taskDescription,
            status: task?.taskStatus,
            severity: task?.severity,
            expiryDate: task?.expiryDate,
            createdAt: task?.createdAt,
          }));
          setTaskDetails(data);
          setSearchLoader(false);
        })
        .catch((error) => {
          setTaskDetails([]);
        });
    }
  }, [debouncedValue]);

  return (
    <Sheet key="left">
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Search Tasks</SheetTitle>
          <div>
            <Input
              placeholder="Search"
              onChange={(e) => setSearchedValue(e.target.value)}
            />
          </div>
          <div className="h-screen w-full">
            <div className="flex flex-col items-start gap-3 h-5/6 overflow-y-scroll w-full p-1">
              {taskDetails?.length === 0 && (
                <div>
                  <span>No Results Found</span>
                </div>
              )}
              {searchLoader ? (
                <div className="h-20 flex items-center justify-center w-full">
                  <CircularProgress />
                </div>
              ) : (
                taskDetails?.map((task) => (
                  <TaskCard
                    task={task}
                    setTaskType={setTaskType}
                    setTaskId={setTaskId}
                    taskCardButtonLoaders={taskCardButtonLoaders}
                    isSearch={true}
                  />
                ))
              )}
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
