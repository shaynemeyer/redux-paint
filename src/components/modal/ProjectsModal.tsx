import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hide } from '../../modules/modals/slice';
import {
  getProjectsList,
  projectsListSelector,
} from '../../modules/projectList/slice';
import { loadProject, useAppDispatch } from '../../modules/strokes/slice';

export const ProjectsModal = () => {
  const dispatch = useDispatch();
  const projectsList = useSelector(projectsListSelector);
  const appDispatch = useAppDispatch();

  useEffect(() => {
    appDispatch(getProjectsList());
  }, [appDispatch]);

  const onLoadProject = (projectId: string) => {
    appDispatch(loadProject(projectId));
    dispatch(hide());
  };

  return (
    <div className="window modal-panel">
      <div className="title-bar">
        <div className="title-bar-text">Load Project</div>
        <div className="title-bar-controls">
          <button aria-label="Close" onClick={() => dispatch(hide())}></button>
        </div>
      </div>
      <div className="projects-container">
        {(projectsList || []).map((project) => {
          return (
            <div
              className="project-card"
              key={project.id}
              onClick={() => onLoadProject(project.id)}
            >
              <img src={project.image} alt="thumbnail" />
              <div>{project.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
