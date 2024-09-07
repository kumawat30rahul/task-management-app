import { useCallback, useEffect, useState } from "react";
import CommonDialog from "../common/common-dialog";
import SelectCommon from "../common/Common-select";
import Navbar from "../Navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { DatePicker } from "../ui/datePicker";
import TaskDragAndDrop from "./components/task-dnd";
import {
  createTask,
  deleteTask,
  editTask,
  getTaskById,
} from "@/Config/services";
import { CircularProgress } from "@mui/material";
import { dateFormater } from "../common/common-functions";
import { SearchSheet } from "./components/searchDetails";
import { useToast } from "../ui/use-toast";
import { debounce } from "lodash";

const HomePage = () => {
  const { toast } = useToast();
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const [tasksDetails, setTasksDetails] = useState();
  const [taskId, setTaskId] = useState("");
  const [taskCreationLoader, setTaskCreationLoader] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [fetchTasksAgain, setFetchTasksAgain] = useState(false);
  const [taskType, setTaskType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { userName } = userDetails;
  const [taskCardButtonLoaders, setTaskCardButtonLoaders] = useState({
    loader: false,
    taskType: "",
    taskId: "",
  });
  const [taskUpdated, setTaskUpdated] = useState({
    status: false,
    taskId: "",
  });

  const sortingOptions = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
  ];

  const severityOptions = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
  ];

  const debouncedSearch = useCallback(
    debounce((term) => {
      setSearchTerm(term);
    }, 200),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    debouncedSearch(value); // Call the debounced function
  };

  const taskDetailsHandler = (value, name) => {
    setTasksDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createTaskFunction = async () => {
    setTaskCreationLoader(true);
    try {
      const payload = {
        taskName: tasksDetails?.taskName,
        taskDescription: tasksDetails?.taskDescription,
        severity: tasksDetails?.taskSeverity,
        expiryDate: tasksDetails?.expiryDate,
        createdBy: userName,
        createdByUserId: userDetails?.userId,
      };

      const response = await createTask(payload);
      if (response?.status === "ERROR") {
        toast({
          variant: "destructive",
          title: response?.message,
        });
        setTaskCreationLoader(false);
        return;
      }
      setFetchTasksAgain(true);
      setTaskCreationLoader(false);
      setIsOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: response?.message,
      });
      setTaskCreationLoader(false);
    }
  };

  const handleClose = () => {
    setTaskType("");
    setIsOpen(false);
  };

  const dialogContent = () => {
    if (taskType === "Add" || taskType === "Edit") {
      return (
        <div className="flex flex-col items-start justify-start gap-3 w-full">
          <div className="w-full flex flex-col items-start">
            <label htmlFor="name">Title</label>
            <Input
              placeholder="Type Here..."
              value={tasksDetails?.taskName}
              name="name"
              className="custom-input"
              onChange={(e) => taskDetailsHandler(e.target.value, "taskName")}
            />
          </div>
          <div className="w-full flex flex-col items-start">
            <label htmlFor="desc">Task Description</label>
            <Input
              placeholder="Type Here..."
              value={tasksDetails?.taskDescription}
              name="desc"
              className="custom-input"
              onChange={(e) =>
                taskDetailsHandler(e.target.value, "taskDescription")
              }
            />
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 w-full">
            <div className="w-full">
              <SelectCommon
                defaultPlaceHolder="Severity"
                options={severityOptions}
                setTasksDetails={setTasksDetails}
                tasksDetails={tasksDetails}
                isCreateTask={true}
              />
            </div>
            <div className="w-full">
              <DatePicker
                setTasksDetails={setTasksDetails}
                tasksDetails={tasksDetails}
              />
            </div>
          </div>
          <div>
            <Button
              className="bg-blue-500"
              onClick={
                taskType === "Edit" ? editingTaskFunction : createTaskFunction
              }
            >
              {taskCreationLoader ? (
                <CircularProgress
                  size={18}
                  sx={{ color: "white !important" }}
                />
              ) : taskType === "Edit" ? (
                "Update"
              ) : (
                "Create Task"
              )}
            </Button>
          </div>
        </div>
      );
    } else if (taskType === "View") {
      return (
        <div className="flex flex-col gap-3 mt-3">
          <div className="flex flex-col items-start">
            <span>Title</span>
            <span className="text-xl font-bold text-black">
              {tasksDetails?.taskName || "NA"}
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span>Description</span>
            <span className="text-lg text-black text-start">
              {tasksDetails?.taskDescription || "NA"}
            </span>
          </div>
          <div className="flex items-start justify-between">
            <div className="flex flex-col items-start">
              <span>Created At</span>
              <span className="text-lg text-black">
                {dateFormater(
                  tasksDetails?.createdAt,
                  "dd MMMM yyyy, hh:mm a"
                ) || "NA"}
              </span>
            </div>
            <div>
              <span className="custom-severity-todo">
                {tasksDetails?.taskStatus}
              </span>
            </div>
          </div>
          <Button className="bg-blue-500 w-max" onClick={handleClose}>
            Close
          </Button>
        </div>
      );
    } else if (taskType === "Delete") {
      return (
        <div className="flex flex-col items-start relativ">
          <span className="text-start">
            Are you sure you want to delete this task?
          </span>
          <div className="flex items-center justify-start md:justify-end gap-2 mt-4 w-full">
            <Button className="bg-red-500 w-max" onClick={deleteTaskFunction}>
              Yes
            </Button>
            <Button className="bg-blue-500 w-max" onClick={handleClose}>
              No
            </Button>
          </div>
        </div>
      );
    }
  };

  const getTasksByIdFunction = async (taskId) => {
    setTaskCardButtonLoaders({
      loader: true,
      taskType: taskType,
      taskId: taskId,
    });
    try {
      const response = await getTaskById(taskId);
      if (response.status === "ERROR") {
        toast({
          variant: "destructive",
          title: response?.message,
        });
        return;
      }
      const res = response?.data;
      setTasksDetails({
        taskName: res?.taskName,
        taskDescription: res?.taskDescription,
        taskSeverity: res?.severity,
        expiryDate: res?.expiryDate,
        createdAt: res?.createdAt,
        taskStatus: res?.taskStatus,
      });
      setIsOpen(true);
      setTaskCardButtonLoaders({
        loader: false,
        taskType: "",
        taskId: "",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch task details",
      });
      setTaskCardButtonLoaders({
        loader: false,
        taskType: "",
        taskId: "",
      });
    }
  };
  const editingTaskFunction = async () => {
    setTaskCreationLoader(true);
    try {
      const payload = {
        taskId,
        taskName: tasksDetails?.taskName,
        taskDescription: tasksDetails?.taskDescription,
        severity: tasksDetails?.taskSeverity,
        expiryDate: tasksDetails?.expiryDate,
        updatedAt: new Date(),
        updatedBy: userName,
        updatedByUserId: userDetails?.userId,
      };

      const response = await editTask(payload);
      if (response?.status === "ERROR") {
        toast({
          variant: "destructive",
          title: response?.message,
        });
        setTaskCreationLoader(false);
        return;
      }
      setTaskCreationLoader(false);
      setTaskUpdated({
        status: true,
        taskId: taskId,
      });
      setTaskType("");
      setIsOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: error?.message,
      });
      setTaskCreationLoader(false);
    }
  };

  const deleteTaskFunction = async () => {
    const payload = {
      taskId,
    };
    try {
      const response = await deleteTask(payload);
      if (response?.status === "ERROR") {
        toast({
          variant: "destructive",
          title: response?.message,
        });
        return;
      }
      setFetchTasksAgain(true);
      setTaskType("");
      setIsOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: error?.message,
      });
    }
  };

  useEffect(() => {
    if (taskType !== "Add" && taskId && taskType !== "") {
      getTasksByIdFunction(taskId);
    }
  }, [taskType]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col gap-3 items-start justify-start">
        <div className="flex flex-col gap-4 w-full bg-gradient-to-r from-blue-500 to-blue-800  items-center justify-center p-8 pt-14">
          <span className="text-3xl md:text-5xl font-bold text-white text-center">
            Welcome!! {userName}
          </span>
          <span className="text-white text-center">
            Take the first step - start adding tasks and watch your progress
            unfold!
          </span>
          <CommonDialog
            title={`${
              taskType === "Add"
                ? "Add Task"
                : taskType === "View"
                ? "Task Details"
                : taskType === "Edit"
                ? "Edit Task"
                : "Delete Task"
            }`}
            isOpen={isOpen}
            setIsOpen={() => {
              setIsOpen(true);
              setTaskType("Add");
              setTasksDetails({});
            }}
            setIsClose={handleClose}
            dialogContent={dialogContent()}
          >
            <Button className="bg-white text-black hover:text-white rounded-full box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25)">
              Add Task
            </Button>
          </CommonDialog>
        </div>
        <div className="h-14 p-4  w-full rounded-full flex flex-col gap-2 sm:flex-row sm:items-center justify-between">
          <div className="w-full sm:w-2/4 lg:w-1/4 rounded-lg">
            {/* <SearchSheet
              setTaskType={setTaskType}
              setTaskId={setTaskId}
              taskCardButtonLoaders={taskCardButtonLoaders} */}
            {/* > */}
            <div>
              <Input
                className="rounded-full w-full"
                placeholder="Search Here..."
                onChange={handleInputChange}
              />
            </div>
            {/* </SearchSheet> */}
          </div>
          <div>
            <SelectCommon
              defaultPlaceHolder="Sort By"
              options={sortingOptions}
              selectLabel={"Sort By Severity"}
              setTasksDetails={setTasksDetails}
            />
          </div>
        </div>
        <Separator orientation="horizontal" className="mt-10 sm:mt-0" />
        <TaskDragAndDrop
          fetchTasksAgain={fetchTasksAgain}
          setFetchTasksAgain={setFetchTasksAgain}
          setTaskType={setTaskType}
          setIsOpen={setIsOpen}
          setTaskId={setTaskId}
          taskCardButtonLoaders={taskCardButtonLoaders}
          tasksDetails={tasksDetails}
          taskUpdated={taskUpdated}
          setTaskUpdated={setTaskUpdated}
          searchTerm={searchTerm}
        />
      </div>
    </>
  );
};

export default HomePage;
