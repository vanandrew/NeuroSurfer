import React from 'react';
import { Classes, Colors, NonIdealState, Spinner } from '@blueprintjs/core';
import { ProjectBrowser, IProject, ISubject, ISession } from './ProjectBrowser';

interface IAppState {
  projects: Array<IProject>;
  active_project: IProject | null;
  subjects: Array<ISubject> | null;
  active_subject: ISubject | null;
  sessions: Array<ISession> | null;
  active_session: ISession | null;
}

class App extends React.Component<{}, IAppState> {
  constructor(props: {}) {
    super(props);
    this.get_project = this.get_project.bind(this);
    this.get_subject = this.get_subject.bind(this);
  }

  get_project(project: IProject, callback: (appstate: IAppState) => void) {
    // fetch subjects
    fetch(`http://127.0.0.1:8000/project/${project.name}`)
      .then((response) => response.json()).then((data: IAppState) => {
        this.setState(
          {
            ...data,
            active_project: project,
          }, () => callback(this.state)
        );
      });
  }

  get_subject(subject: ISubject, callback: (appstate: IAppState) => void) {
    // ensure that the active project is set
    if (this.state.active_project === null)
      return;
    // fetch sessions
    fetch(`http://127.0.0.1:8000/project/${this.state.active_project.name}/subject/${subject.name}`)
      .then((response) => response.json()).then((data: IAppState) => {
        this.setState({
          ...data,
          active_subject: subject,
        }, () => callback(this.state));
      });
  }

  componentDidMount(): void {
    fetch('http://127.0.0.1:8000/').then((response) => response.json()).then((data: IAppState) => {
      this.setState(data);
    });
  }

  render() {
    return (
      <div className={`${Classes.DARK} app-main`} style={{ backgroundColor: Colors.DARK_GRAY3 }}>
        {this.state === null ?
          <NonIdealState title="Loading..." icon={<Spinner />} /> :
          <ProjectBrowser
            appstate={this.state}
            get_project={this.get_project}
            get_subject={this.get_subject}
          />}
      </div>);
  }
}

export default App;

export type {
  IAppState,
}
