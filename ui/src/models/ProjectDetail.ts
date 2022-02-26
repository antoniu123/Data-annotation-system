import {User} from "./User";
import {Document as File} from "./Document"

export interface ProjectDetail{
    id: number
    document: File
    name: string
    description: string
    subscriberUsername: string
}