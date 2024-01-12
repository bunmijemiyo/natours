/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

console.log('Fine...Login');
export const login = async (email, password) => {
  console.log(email, password);
  console.log('Finest...');
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      // alert('Logged in successfully');
      showAlert('success', 'Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
    // console.log(res);
  } catch (err) {
    // console.log(err.response.data.message);
    // alert(err.response.data.message);
    showAlert('error', err.response.data.message);
  }
};
console.log('Done...Login');

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout',
    });

    if (res.data.status === 'success') {
      console.log('I got here');
      location.reload(true);
      console.log('I got here also');
    }
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again');
  }
};
