import { sleep } from 'k6';
import { Options } from 'k6/options';

import { getRandomUser } from '../generators/user';
import { getRandomString } from "../generators/random";
import { getRandomMailMessage } from '../generators/email';
import { login } from '../requests/postSignIn';
import { register } from '../requests/postSignUp';
import { getUsers } from '../requests/getAllUsers';
import { getUser } from '../requests/getUser';
import { postEmail } from '../requests/postEmail';

// @ts-ignore
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
// @ts-ignore
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
import { edit } from '../requests/putUser';
import { repeatNTimes, executeWithProbability } from '../utils/executors';
import { SharedArray } from 'k6/data';

// Performance test
export let options: Options = {
    vus: 10,
    iterations: 10,
    duration: '20m'
};


export function setup() {
  return "hello" + getRandomString()
}


// Functional test
export default (journeyId: string) => {
    // given
    let token: string
    const user = getRandomUser()

    // when
    register(user)
    sleep(3)
    token = login(user)
    sleep(2)
    repeatNTimes(() => getUsers(token), 3.5)
    sleep(2)
    executeWithProbability(() => getUser(token, user.username), 0.5)
    sleep(2)
    executeWithProbability(() => edit(token, user), 0.5)

//     generowanie usera
//     wysyłka maila

    repeatNTimes(() => {
        const message = getRandomMailMessage(journeyId, user.email)
        console.log(journeyId)
        postEmail(token, message)
    }, 2)

//     :8025/api/v2/messages
};



export function handleSummary(data: any) {
    return {
        "result.html": htmlReport(data),
        stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
}
