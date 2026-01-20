import { useContext, useEffect, useState } from "react";
import { MyContext } from "./Mycontext";
import { useParams } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import TaskModal from "../components/TaskModal";
import { FiPlus, FiEdit, FiTrash } from "react-icons/fi";
import { deleteData, putData } from "../utils/api.js";
import { useNavigate } from "react-router-dom";
import Projects from "./Projects.jsx";
import { FiArrowLeft } from "react-icons/fi";

const Tasks = () => {
  const { projectId } = useParams();
  const { projects, tasks, fetchTasks, hasRole, user, openAlertBox } = useContext(MyContext);

  const project = projects.find(p => p._id === projectId);

  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    if (projectId) {
      fetchTasks(projectId);
    }
  }, [projectId, fetchTasks]);

  const projectTasks = tasks.filter(
  task => task.projectId?._id?.toString() === projectId || task.projectId?.toString() === projectId
);

  const handleAddTask = () => {
    setSelectedTask(null);
    setShowModal(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await deleteData(`/tasks/${taskId}`);
      openAlertBox("success", "Task deleted");
      await fetchTasks(projectId); 
    } catch (error) {
      console.error(error);
      openAlertBox("error", error.message);
    }
  };

  const handleUpdateStatus = async (task, newStatus) => {
    try {
      await putData(`/tasks/${task._id}`, { ...task, status: newStatus });
      openAlertBox("success", "Task status updated");
      await fetchTasks(projectId);
    } catch (error) {
      console.error(error);
      openAlertBox("error", error.message);
    }
  };
  const navigate = useNavigate();



  return (
    <div className="p-8 bg-light" style={{ marginTop: '80px' }}>
      <div className="position-relative mb-4">
        <h2 className="text-center mb-0">
          Tasks for Project:{" "}
          <strong
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate("/projects")}
            title="Go back to Projects"
          >
            {project?.name || "Loading..."}
          </strong>
        </h2>


        

      </div>

      <table className={`table table-bordered ${projectTasks.length > 0 ? 'bg-white' : ''}`}>
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Description</th>
            <th>Assigned To</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>
              Actions{" "}
              {hasRole(["Admin", "Project Manager"]) && (
                <FiPlus
                  style={{ cursor: "pointer", marginLeft: "8px" }}
                  onClick={handleAddTask}
                  title="Add Task"
                />
              )}
            </th>

          </tr>
        </thead>
        <tbody>
          {projectTasks.map((task, idx) => (
            <tr key={task._id}>
              <td>{idx + 1}</td>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.assignedTo?.name || "Unassigned"}</td>

              <td>
                <StatusBadge status={task.status} />
                {/* Team Member can update their own task status */}
                {user?._id === task.assignedTo?._id && hasRole(["Team Member"]) && (
                  <select
                    value={task.status}
                    onChange={(e) => handleUpdateStatus(task, e.target.value)}
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                )}
              </td>
              <td>
                <PriorityBadge priority={task.priority} />
              </td>
              <td>
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "-"}
              </td>
              <td>
                {hasRole(["Admin", "Project Manager"]) && (
                  <FiEdit
                    style={{ cursor: "pointer", marginRight: "10px" }}
                    onClick={() => handleEditTask(task)}
                    title="Edit Task"
                  />
                )}

                {hasRole(["Admin"]) && (
                  <FiTrash
                    style={{ cursor: "pointer", color: "red" }}
                    onClick={() => handleDeleteTask(task._id)}
                    title="Delete Task"
                  />
                )}
              </td>

            </tr>
          ))}
          {projectTasks.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center py-3 text-muted">
                No tasks found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <TaskModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        task={selectedTask}
        projectId={projectId}
      />
    </div>
  );
};

export default Tasks;
