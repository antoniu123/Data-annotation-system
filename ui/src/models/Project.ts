import {ProjectDetail} from "./ProjectDetail";

export interface Project{
    id: number
    name: string
    description: string
    ownerUsername: string
    projectDetails: ProjectDetail[]
}