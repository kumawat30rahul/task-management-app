import { dateFormater } from "@/components/common/common-functions";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@mui/material";
import { format } from "date-fns";

const TaskCard = ({
  task,
  key,
  updateTaskStatusLoader,
  setTaskType,
  setIsOpen,
  setTaskId,
  taskCardButtonLoaders,
  isSearch,
}) => {
  const taskCardButtonHandler = (type, taskId) => {
    if (type === "Delete") {
      setTaskType("Delete");
    } else if (type === "Edit") {
      setTaskType("Edit");
    } else {
      setTaskType("View");
    }
    setTaskId(taskId);
    // setIsOpen(true);
  };

  return (
    <div
      className={`w-full flex gap-1 border rounded-lg cursor-pointer bg-white ${
        task?.status === "CLOSED"
          ? "border-red-500 hover:bg-red-500/10"
          : task?.status === "INPROGRESS"
          ? "border-yellow-500 hover:bg-yellow-500/10"
          : "border-blue-500 hover:bg-blue-500/10"
      }`}
      key={key}
    >
      {updateTaskStatusLoader?.loader &&
      updateTaskStatusLoader?.taskId === task?.id ? (
        <div className="h-24 w-full flex items-center justify-center">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div
            className={`w-2 max-w-2  rounded-s-lg ${
              task?.status === "CLOSED"
                ? "bg-red-500"
                : task?.status === "INPROGRESS"
                ? "bg-yellow-500"
                : "bg-blue-500"
            }`}
          ></div>
          <div className="p-2 w-full">
            <div className="flex flex-col items-start gap-2">
              <span className="text-lg md:text-xl font-bold">
                {task?.taskName || "NA"}
              </span>
              <span className="text-sm md:text-md text-start">
                {task?.taskDescription || "NA"}
              </span>
              <span className="text-xs text-gray-500">
                {dateFormater(task?.createdAt, "dd MMMM yyyy, hh:mm a")}
              </span>
            </div>
            <div className="w-full flex items-center justify-between mt-2">
              <span className="text-xs">
                Due Date:{" "}
                {dateFormater(task?.expiryDate, "dd MMMM yyyy") || "NA"}
              </span>
            </div>
            <div className="w-full flex items-center justify-between gap-2 mt-2">
              <div>
                <span
                  className={`${
                    task?.severity === "Low"
                      ? "custom-severity-low"
                      : task?.severity === "Medium"
                      ? "custom-severity-medium"
                      : "custom-severity-high"
                  }`}
                >
                  {task?.severity || "NA"}
                </span>
              </div>
              <div className="flex gap-2">
                {!isSearch && (
                  <>
                    <Button
                      className="bg-red-500 px-2 h-8"
                      onClick={() => taskCardButtonHandler("Delete", task?.id)}
                    >
                      {taskCardButtonLoaders?.loader &&
                      task?.id === taskCardButtonLoaders?.taskId &&
                      taskCardButtonLoaders.taskType === "Delete" ? (
                        <CircularProgress
                          sx={{ color: "white !important" }}
                          size={18}
                        />
                      ) : (
                        "Delete"
                      )}
                    </Button>
                    <Button
                      className="bg-blue-500 px-2 h-8"
                      onClick={() => taskCardButtonHandler("Edit", task?.id)}
                    >
                      {taskCardButtonLoaders?.loader &&
                      task?.id === taskCardButtonLoaders?.taskId &&
                      taskCardButtonLoaders.taskType === "Edit" ? (
                        <CircularProgress
                          sx={{ color: "white !important" }}
                          size={18}
                        />
                      ) : (
                        "Edit"
                      )}
                    </Button>
                  </>
                )}
                <Button
                  className="bg-blue-700 px-2 h-8"
                  onClick={() => taskCardButtonHandler("View", task?.id)}
                >
                  {taskCardButtonLoaders?.loader &&
                  task?.id === taskCardButtonLoaders?.taskId &&
                  taskCardButtonLoaders.taskType === "View" ? (
                    <CircularProgress
                      sx={{ color: "white !important" }}
                      size={18}
                    />
                  ) : (
                    "View"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskCard;
