from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

# get Path to data
data_path = Path("/home/vanandrew/Data/MEDIC_test")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    # loop through data for projects
    projects = [str(p.stem) for p in data_path.iterdir() if p.is_dir()]
    project_paths = [str(p.absolute()) for p in data_path.iterdir() if p.is_dir()]
    return {"projects": [{"name": name, "path": path} for name, path in zip(projects, project_paths)]}


@app.get("/project/{project_name}")
async def project(project_name: str):
    # loop through data for projects
    project_path = data_path / project_name
    subjects = [str(s.stem) for s in project_path.iterdir() if s.is_dir()]
    subject_paths = [str(s.absolute()) for s in project_path.iterdir() if s.is_dir() and "sub-" in s.stem]
    return {"subjects": [{"name": name, "path": path} for name, path in zip(subjects, subject_paths)]}


@app.get("/project/{project_name}/subject/{subject_name}")
async def subject(project_name: str, subject_name: str):
    # loop through data for projects
    subject_path = data_path / project_name / subject_name
    sessions = [str(s.stem) for s in subject_path.iterdir() if s.is_dir()]
    session_paths = [str(s.absolute()) for s in subject_path.iterdir() if s.is_dir() and "ses-" in s.stem]
    return {"sessions": [{"name": name, "path": path} for name, path in zip(sessions, session_paths)]}
