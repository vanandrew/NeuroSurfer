import React from 'react';
import {
  Button,
  Classes,
  Navbar,
  NonIdealState,
  Icon,
  PanelStack2,
  PanelProps,
  Panel,
  Spinner
} from '@blueprintjs/core';
import { IAppState } from './App';

interface IProject {
  name: string;
  path: string;
}

interface ISubject {
  name: string;
  path: string;
}

interface ISession {
  name: string;
  path: string;
}

interface IProjectBrowser {
  appstate: IAppState;
  get_project: (p: IProject, c: (appstate: IAppState) => void) => void;
  get_subject: (s: ISubject, c: (appstate: IAppState) => void) => void;
}

const ProjectBrowser: React.FC<IProjectBrowser> = (props) => {
  const [panelStack, setPanelStack] = React.useState<Array<Panel<IProjectBrowser>>>([{
    props: {
      appstate: props.appstate,
      get_project: props.get_project,
      get_subject: props.get_subject,
    },
    renderPanel: ProjectPanel,
    title: "Projects",
  }])

  // the typing for panel doesn't work for some reason so we have to use any
  const open_panel = React.useCallback((panel: Panel<any>) => {
    setPanelStack(stack => [...stack, panel]);
  }, []);

  const close_panel = React.useCallback(() => {
    setPanelStack(stack => stack.slice(0, stack.length - 1));
  }, []);

  return (
    <>
      <Navbar>
        <Navbar.Group>
          <Navbar.Heading><Icon icon="predictive-analysis" /> NeuroSurfer<sup>&alpha;</sup></Navbar.Heading>
          <Navbar.Divider />
        </Navbar.Group>
      </Navbar>
      <PanelStack2
        className={`${Classes.PANEL_STACK2} panel-stack`}
        onOpen={open_panel}
        onClose={close_panel}
        showPanelHeader={true}
        stack={panelStack} />
    </>
  );
}

const ProjectPanel: React.FC<PanelProps<IProjectBrowser>> = (props) => {
  return (
    <table className={`${Classes.HTML_TABLE} ${Classes.HTML_TABLE_STRIPED} project-panel`}>
      <thead>
        <tr>
          <th>Project</th>
          <th>Path</th>
          <th><Icon icon="folder-open" style={{ padding: "0px 5px" }} /></th>
        </tr>
      </thead>
      <tbody>
        {props.appstate.projects.map((p) => (
          <tr key={p.path}>
            <td>{p.name}</td>
            <td>{p.path}</td>
            <td><Button icon="folder-open" minimal={true}
              onClick={() => props.get_project(p, (appstate) => {
                props.openPanel({
                  props: {
                    appstate: appstate,
                    get_project: props.get_project,
                    get_subject: props.get_subject,
                  },
                  renderPanel: SubjectPanel,
                  title: "Subjects",
                });
              })} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const SubjectPanel: React.FC<PanelProps<IProjectBrowser>> = (props) => {
  return (
    <>
      {props.appstate.subjects === null ?
        <NonIdealState title="Loading..." icon={<Spinner />} /> :
        <table className={`${Classes.HTML_TABLE} ${Classes.HTML_TABLE_STRIPED} project-panel`}>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Path</th>
              <th><Icon icon="folder-open" style={{ padding: "0px 5px" }} /></th>
            </tr>
          </thead>
          <tbody>
            {props.appstate.subjects.map((s) => (
              <tr key={s.path}>
                <td>{s.name}</td>
                <td>{s.path}</td>
                <td><Button icon="folder-open" minimal={true}
                  onClick={() => props.get_subject(s, (appstate) => {
                    props.openPanel({
                      props: {
                        appstate: appstate,
                        get_project: props.get_project,
                        get_subject: props.get_subject,
                      },
                      renderPanel: SessionPanel,
                      title: "Sessions",
                    });
                  })} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </>
  );
};

const SessionPanel: React.FC<PanelProps<IProjectBrowser>> = (props) => {
  return (
    <>
      {props.appstate.sessions === null ?
        <NonIdealState title="Loading..." icon={<Spinner />} /> :
        <table className={`${Classes.HTML_TABLE} ${Classes.HTML_TABLE_STRIPED} project-panel`}>
          <thead>
            <tr>
              <th>Session</th>
              <th>Path</th>
              <th><Icon icon="folder-open" style={{ padding: "0px 5px" }} /></th>
            </tr>
          </thead>
          <tbody>
            {props.appstate.sessions.map((s) => (
              <tr key={s.path}>
                <td>{s.name}</td>
                <td>{s.path}</td>
                <td><Button icon="folder-open" minimal={true} onClick={() => {}} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </>
  );
};

export {
  ProjectBrowser,
};

export type {
  IProject,
  ISubject,
  ISession,
};
