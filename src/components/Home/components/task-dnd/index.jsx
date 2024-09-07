import { CircularProgress, Grid } from "@mui/material";
import TaskCard from "../task-card";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useEffect, useState } from "react";
import {
  getAllTasks,
  getTaskById,
  sortTasks,
  updateTaskStatus,
} from "@/Config/services";
import { useToast } from "@/components/ui/use-toast";

let initialData = {
  tasks: {},
  columns: {
    TODO: {
      id: "TODO",
      title: "TO DO",
      taskIds: [],
    },
    INPROGRESS: {
      id: "INPROGRESS",
      title: "INPROGRESS",
      taskIds: [],
    },
    CLOSED: {
      id: "CLOSED",
      title: "CLOSED",
      taskIds: [],
    },
  },
  columnOrder: ["TODO", "INPROGRESS", "CLOSED"],
};

const TaskDragAndDrop = ({
  fetchTasksAgain,
  setFetchTasksAgain,
  setTaskType,
  setIsOpen,
  setTaskId,
  taskCardButtonLoaders,
  tasksDetails,
  taskUpdated,
  setTaskUpdated,
  searchTerm,
}) => {
  const [state, setState] = useState(initialData);
  const { toast } = useToast();
  const [updateTaskStatusLoader, setUpdateTaskStatusLoader] = useState({
    loader: false,
    taskId: "",
  });
  const [fetchAllTasksLoader, setFetchAllTasksLoader] = useState(false);
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    //if user drops the task outside the droppable area
    if (!destination) return;

    //if user drops the task in the same droppable area
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    //if user drops the task in the same droppable area but different position
    if (destination.droppableId === source.droppableId) {
      const column = state.columns[source.droppableId];
      const newTaskIds = Array.from(column.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...column,
        taskIds: newTaskIds,
      };

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      };
      setState(newState);
      return;
    }

    //if user drops the task in the different droppable area
    const start = state.columns[source.droppableId];
    const finish = state.columns[destination.droppableId];

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };
    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    setState(newState);
    updatingStatus(draggableId, destination.droppableId);
  };

  const settingDndData = (allTasks) => {
    const allTaskData = allTasks?.reduce((acc, task) => {
      acc[task?.taskId] = {
        id: task?.taskId,
        taskName: task?.taskName,
        taskDescription: task?.taskDescription,
        createdAt: task?.createdAt,
        severity: task?.severity,
        status: task?.taskStatus,
        expiryDate: task?.expiryDate,
      };
      return acc;
    }, {});

    const sepearatedColumnId = seperatingTasks(allTasks);
    const newInitialData = {
      ...initialData,
      tasks: allTaskData,
      columns: {
        ...initialData.columns,
        TODO: {
          ...initialData.columns.TODO,
          taskIds: sepearatedColumnId.TODO,
        },
        INPROGRESS: {
          ...initialData.columns.INPROGRESS,
          taskIds: sepearatedColumnId.INPROGRESS,
        },
        CLOSED: {
          ...initialData.columns.CLOSED,
          taskIds: sepearatedColumnId.CLOSED,
        },
      },
    };
    initialData = newInitialData;
    return newInitialData;
  };

  const fetchingAllTasks = async (searchTerm) => {
    setFetchAllTasksLoader(true);
    try {
      let response;
      if (searchTerm) {
        response = await getAllTasks(searchTerm);
      } else {
        response = await getAllTasks();
      }
      if (response.status === "ERROR") {
        toast({
          variant: "destructive",
          title: response?.message,
        });
        setFetchAllTasksLoader(false);
        return;
      }
      const newData = settingDndData(response?.data);
      setState(newData);
      setFetchTasksAgain(false);
      setFetchAllTasksLoader(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: error?.message,
      });
      setFetchTasksAgain(false);
      setFetchAllTasksLoader(false);
    }
  };

  const seperatingTasks = (allTasks) => {
    const todoTasks = allTasks
      ?.filter((task) => task?.taskStatus === "TODO")
      .map((task) => task?.taskId);
    const inprogressTasks = allTasks
      ?.filter((task) => task?.taskStatus === "INPROGRESS")
      .map((task) => task.taskId);
    const closedTasks = allTasks
      ?.filter((task) => task?.taskStatus === "CLOSED")
      .map((task) => task.taskId);

    return {
      TODO: todoTasks,
      INPROGRESS: inprogressTasks,
      CLOSED: closedTasks,
    };
  };

  const updatingStatus = async (taskId, status) => {
    try {
      setUpdateTaskStatusLoader({
        loader: true,
        taskId: taskId,
      });
      const payload = {
        taskId,
        taskStatus: status,
      };
      const response = await updateTaskStatus(payload);
      if (response.status === "ERROR") {
        toast({
          variant: "destructive",
          title: response?.message,
        });
        setUpdateTaskStatusLoader({
          loader: false,
          taskId: "",
        });
        return;
      }
      await fetchUpdatedTask(taskId);
      setUpdateTaskStatusLoader({
        loader: false,
        taskId: "",
      });
    } catch (error) {
      setUpdateTaskStatusLoader({
        loader: false,
        taskId: "",
      });
      toast({
        variant: "destructive",
        title: error?.message,
      });
    }
  };

  const sortingFunction = async () => {
    setFetchAllTasksLoader(true);

    try {
      const payload = {
        sort: tasksDetails?.sort,
      };
      const response = await sortTasks(payload);
      if (response.status === "ERROR") {
        toast({
          variant: "destructive",
          title: response?.message,
        });
        return;
      }

      const newData = settingDndData(response?.data);
      setState(newData);
      setFetchAllTasksLoader(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: error?.message,
      });
      setFetchAllTasksLoader(false);
    }
  };

  const fetchUpdatedTask = async (taskId) => {
    try {
      const updatedTaskDetails = await getTaskById(taskId);
      const taskData = updatedTaskDetails?.data;
      setState((prev) => ({
        ...prev,
        tasks: {
          ...prev?.tasks,
          [taskId]: {
            ...prev?.tasks[taskId],
            expiryDate: taskData?.expiryDate,
            severity: taskData?.severity,
            status: taskData?.taskStatus,
            taskDescription: taskData?.taskDescription,
            taskName: taskData?.taskName,
          },
        },
      }));
      if (taskUpdated?.status) {
        setTaskUpdated({
          status: false,
          taskId: "",
        });
        setUpdateTaskStatusLoader({
          loader: false,
          taskId: "",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        message: "Could not fetch updated details please refresh the page",
      });
    }
  };

  useEffect(() => {
    if (tasksDetails?.sort) {
      sortingFunction();
    }
  }, [tasksDetails?.sort]);

  useEffect(() => {
    if (taskUpdated?.status) {
      setUpdateTaskStatusLoader({
        loader: true,
        taskId: taskUpdated?.taskId,
      });
      fetchUpdatedTask(taskUpdated?.taskId);
    }
  }, [taskUpdated?.status]);

  useEffect(() => {
    if (searchTerm) {
      fetchingAllTasks(searchTerm);
    } else {
      fetchingAllTasks();
    }
  }, [fetchTasksAgain, searchTerm]);

  return (
    <div className="p-4 w-full">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold">All Tasks</span>
        {fetchAllTasksLoader && <CircularProgress size={20} />}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="w-full mt-8 h-[400px] md:h-[600px]">
          <Grid container spacing={2} className="h-full">
            {state.columnOrder.map((columnId) => {
              const column = state.columns[columnId];
              const tasks = column?.taskIds?.map(
                (taskId) => state.tasks[taskId]
              );
              return (
                <Grid item lg={4} md={6} sm={12} xs={12} className="h-full">
                  <div className="flex flex-col items-center justify-start gap-2 rounded-xl  bg-gray-500/20 h-full ">
                    <span
                      className={`h-8 flex items-center justify-center w-full  text-center text-white font-bold rounded-full ${
                        column?.title === "TO DO"
                          ? "bg-blue-500"
                          : column?.title === "INPROGRESS"
                          ? "bg-yellow-500"
                          : column?.title === "CLOSED" && "bg-red-500"
                      }`}
                    >
                      {column?.title}
                    </span>
                    <Droppable droppableId={column?.id}>
                      {(provided, snapshot) => (
                        <div
                          className="p-4 w-full flex flex-col gap-2 h-full  overflow-y-scroll"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {tasks?.map((task, index) => (
                            <Draggable
                              draggableId={`${task.id}`}
                              index={index}
                              key={task.id}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    key={task.id}
                                  >
                                    <TaskCard
                                      task={task}
                                      updateTaskStatusLoader={
                                        updateTaskStatusLoader
                                      }
                                      setTaskType={setTaskType}
                                      setIsOpen={setIsOpen}
                                      setTaskId={setTaskId}
                                      taskCardButtonLoaders={
                                        taskCardButtonLoaders
                                      }
                                    />
                                  </div>
                                );
                              }}
                            </Draggable>
                          ))}
                        </div>
                      )}
                    </Droppable>
                  </div>
                </Grid>
              );
            })}
          </Grid>
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskDragAndDrop;
