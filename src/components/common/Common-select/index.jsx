import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SelectCommon = ({
  options,
  setTasksDetails,
  defaultPlaceHolder,
  tasksDetails,
  selectLabel,
  isCreateTask = false,
}) => {
  const handleChange = (value) => {
    if (!isCreateTask) {
      setTasksDetails((prev) => ({
        ...prev,
        sort: value,
      }));
    } else {
      setTasksDetails((prev) => ({
        ...prev,
        taskSeverity: value,
      }));
    }
  };

  return (
    <div>
      <Select
        onValueChange={handleChange}
        defaultValue={tasksDetails?.taskSeverity}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder={defaultPlaceHolder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup label={selectLabel}>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectCommon;
