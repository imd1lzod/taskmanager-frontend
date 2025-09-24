import api from "../base.api";

export async function getAllTasks () {
        const res = await api.get(`/tasks`)
        return res.data
}