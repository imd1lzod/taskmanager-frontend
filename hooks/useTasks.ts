import {useQuery} from "@tanstack/react-query"
import { getAllTasks } from "../api/task/task.api"
 
export function useGetAllTask () {
        return useQuery({
                queryKey: ['tasks'],
                queryFn: getAllTasks
        })
}