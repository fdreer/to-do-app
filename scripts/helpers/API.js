const URL = 'http://todo-api.ctd.academy:3000/v1';
const createUser = `${URL}/users`;
const loginUser = `${createUser}/login`;
const getMe = `${createUser}/getMe`;
const tasks = `${URL}/tasks`;
const taskId = `${tasks}`;

export default {
    URL,
    createUser,
    loginUser,
    getMe,
    tasks,
    taskId
}