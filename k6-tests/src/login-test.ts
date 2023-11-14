import { sleep, check } from 'k6';
import { Options } from 'k6/options';

/* @ts-ignore */
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.1.0/index.js';
import http from 'k6/http';
import {baseUrl} from  '../config/constants'
// performance test
export let options:Options = {
  vus: 1,
  duration: '1s'
};

// functional test
export default () => {
    const loginRequest = {
        username: 'admin',
        password: 'admin',
    }

  let res = http.post(`${baseUrl}/users/signin` , JSON.stringify(loginRequest), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, {
    'status is 400': () => res.status === 200,
  });
};
