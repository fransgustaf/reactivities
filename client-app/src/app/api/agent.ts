import axios, {AxiosResponse} from 'axios';
import {IActivity} from '../modules/activity';

axios.defaults.baseURL = 'http://localhost:5000/api';

const responseBody = (response: AxiosResponse) => response.data;

const timeToSleep: number = 1000;
const sleep = (ms: number) => (response: AxiosResponse) =>
    new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));

const requests = {
    get: (url: string) => axios.get(url).then(sleep(timeToSleep)).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(sleep(timeToSleep)).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(sleep(timeToSleep)).then(responseBody),
    del: (url: string) => axios.delete(url).then(sleep(timeToSleep)).then(responseBody)
}

const Activities = {
    list: (): Promise<IActivity[]> => requests.get('/activities'),
    details: (id: string) => requests.get(`/activities/${id}`),
    create: (activity: IActivity) => requests.post('/activities', activity),
    update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del(`/activities/${id}`)
}

export default {
    Activities
}