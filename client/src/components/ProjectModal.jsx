import { useState, useEffect, useContext } from "react";
import { MyContext } from "../pages/Mycontext";
import { postData, putData } from "../utils/api";

const ProjectModal = ({ isOpen, onClose, project }) => {
  const { openAlertBox, fetchProjects, hasRole } = useContext(MyContext);

  const [formFields, setFormFields] = useState({
    name: "",
    status: "Active",
    priority: "Medium",
    deadline: "",
    
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
  setFormFields({
    ...project,
    deadline: project.deadline
      ? project.deadline.split("T")[0]
      : "",
  });
}
    else
      setFormFields({
        name: "",
        status: "Active",
        priority: "Medium",
        deadline: "",
        role: "",
      });
  }, [project]);

  const handleChange = (e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (project) {
        await putData(`/projects/${project._id}`, formFields);
        openAlertBox("success", "Project updated!");
      } else {
        await postData("/projects", formFields);
        openAlertBox("success", "Project created!");
      }
      fetchProjects();
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
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        style={{ zIndex: 1050 }}
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div
        className="modal fade show"
        style={{ display: "block", zIndex: 1051 }}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">{project ? "Edit Project" : "Add Project"}</h5>
              <button
                type="button"
                className="close"
                onClick={onClose}
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            {/* Body */}
            <div className="modal-body">
              {/* Project Name */}
              <label htmlFor="name" className="form-label">Project Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control mb-3"
                placeholder="Enter project name"
                value={formFields.name}
                onChange={handleChange}
              />

              {/* Status */}
              <label htmlFor="status" className="form-label">Status:</label>
              <select
                id="status"
                name="status"
                className="form-control mb-3"
                value={formFields.status}
                onChange={handleChange}
              >
                <option>Active</option>
                <option>Completed</option>
                <option>On Hold</option>
              </select>

              {/* Priority */}
              <label htmlFor="priority" className="form-label">Priority:</label>
              <select
                id="priority"
                name="priority"
                className="form-control mb-3"
                value={formFields.priority}
                onChange={handleChange}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              {/* Deadline */}
              <label htmlFor="deadline" className="form-label">Deadline:</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                className="form-control mb-3"
                value={formFields.deadline}
                onChange={handleChange}
              />
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Saving..." : project ? "Update" : "Add"}
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectModal;
