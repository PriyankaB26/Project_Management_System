import { useState, useEffect, useContext } from "react";
import { MyContext } from "../pages/Mycontext";
import { postData, putData, fetchDataFromApi } from "../utils/api";

const TaskModal = ({ isOpen, onClose, task, projectId }) => {
  const { openAlertBox, fetchTasks } = useContext(MyContext);

  const [formFields, setFormFields] = useState({
    title: "",
    description: "",
    assignedTo: "",
    status: "Pending",
    priority: "Medium",
    dueDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetchDataFromApi("/api/users");

        if (res.success) setUsers(res.data);
      } catch (error) {
        console.error("Fetch users error:", error);
      }
    };

    fetchUsers();
  }, []);

 
  useEffect(() => {
    if (task) {
      setFormFields({
        ...task,
        assignedTo: task.assignedTo?._id || task.assignedTo
      });
    }
  }, [task]);


  const handleChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formFields.title.trim()) {
      openAlertBox("error", "Title is required");
      return;
    }
    if (!formFields.assignedTo) {
      openAlertBox("error", "Assigned To is required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formFields,
        projectId,
        deadline: formFields.deadline
          ? new Date(formFields.deadline)
          : null,
      };


      if (task) {
        await putData(`/api/tasks/${task._id}`, payload);
        openAlertBox("success", "Task updated!");
      } else {
        await postData("/api/tasks", payload);
        openAlertBox("success", "Task created!");
      }

      fetchTasks();
      onClose();
    } catch (error) {
      console.error(error);
      openAlertBox("error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5>{task ? "Edit Task" : "Add Task"}</h5>
            <button className="close" onClick={onClose}>×</button>
          </div>

          <div className="modal-body">
            <label>Title</label>
            <input className="form-control mb-2" name="title" value={formFields.title} onChange={handleChange} />

            <label>Description</label>
            <textarea className="form-control mb-2" name="description" value={formFields.description} onChange={handleChange} />

            <label>Assigned To</label>
            <select className="form-control mb-2" name="assignedTo" value={formFields.assignedTo} onChange={handleChange}>
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>

            <label>Status</label>
            <select className="form-control mb-2" name="status" value={formFields.status} onChange={handleChange}>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>

            <label>Priority</label>
            <select className="form-control mb-2" name="priority" value={formFields.priority} onChange={handleChange}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <label>Due Date</label>
            <input
              type="date"
              className="form-control"
              name="dueDate"
              value={
                formFields.dueDate
                  ? new Date(formFields.dueDate).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleChange}
            />

          </div>

          <div className="modal-footer">
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
