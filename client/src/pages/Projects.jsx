import { useContext, useEffect, useState } from "react";
import { MyContext } from "./Mycontext";
import { useNavigate } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdModeEdit, MdDelete } from "react-icons/md";
import StatusBadge from "../components/StatusBadge";
import PriorityBadge from "../components/PriorityBadge";
import ProgressBar from "../components/ProgressBar";
import ProjectModal from "../components/ProjectModal";

const Projects = () => {
  const { projects, fetchProjects, hasRole, openAlertBox, projectsLoading } =
    useContext(MyContext);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects(); 
  }, []);

  const handleAddProject = () => {
    setSelectedProject(null);
    setShowModal(true);
  };
  const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-IN");
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      openAlertBox("success", "Project deleted successfully!");
      fetchProjects();
    } catch (error) {
      console.error(error);
      openAlertBox("error", "Failed to delete project");
    }
  };

  
  if (projectsLoading) {
    return (
      <div className="p-8 bg-light text-center">
        Loading projects...
      </div>
    );
  }

  return (
    <div className="p-8 bg-light" style={{ marginTop: '80px' }}>
      <div className={`table-responsive ${projects.length > 0 ? 'bg-white shadow-sm rounded' : ''}`}>
        <table className="table table-hover table-bordered mb-0">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Project</th>
              
              <th>Tasks</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Deadline</th>
              <th>Progress</th>
              <th>Last Updated</th>
              <th style={{ width: "120px" }}>
                Actions{" "}
                {hasRole(["Admin", "Project Manager"]) && (
                  <IoIosAddCircleOutline
                    size={20}
                    style={{ cursor: "pointer" }}
                    onClick={handleAddProject}
                    title="Add Project"
                  />
                )}
              </th>
            </tr>
          </thead>

          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-3">
                  No projects found
                </td>
              </tr>
            ) : (
              projects.map((item, index) => {
                const progress = item.totaltasks
                  ? Math.round((item.completedtasks / item.totaltasks) * 100)
                  : 0;

                return (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    
                    <td
                      style={{ cursor: "pointer", textAlign: "center" }}
                      onClick={() => navigate(`/tasks/${item._id}`)}
                    >
                      {item.totaltasks > 0 ? (
                        <span style={{ color: "green", fontWeight: "bold" }}>
                          check
                        </span>
                      ) : (
                        <IoIosAddCircleOutline size={20} title="Add Task" />
                      )}
                    </td>



                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                    <td>
                      <PriorityBadge priority={item.priority} />
                    </td>
                    <td>{formatDate(item.deadline)}</td>
                    <td>
                      <ProgressBar progress={progress} />
                    </td>
                    <td>{formatDate(item.updatedAt)}</td>

                    <td className="text-center">
                      {hasRole(["Admin", "Project Manager"]) && (
                        <MdModeEdit
                          size={18}
                          style={{ cursor: "pointer", marginRight: "10px" }}
                          onClick={() => handleEditProject(item)}
                          title="Edit Project"
                        />
                      )}
                      {hasRole(["Admin"]) && (
                        <MdDelete
                          size={18}
                          style={{ cursor: "pointer", color: "red" }}
                          onClick={() => handleDeleteProject(item._id)}
                          title="Delete Project"
                        />
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <ProjectModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        project={selectedProject}
      />
    </div>
  );
};

export default Projects;
