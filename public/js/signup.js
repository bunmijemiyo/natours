/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

console.log('Fine...Login');
export const signup = async (name, email, password, confirmPassword) => {
  // console.log(name, email, password, confirmPassword);
  // console.log('Finest...');
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        confirmPassword,
      },
    });
    // console.log(res.data);
    window.location.href = '/Login'; // Redirect to login page immediately

    if (res.data.status === 'success') {
      // alert('Logged in successfully');
      showAlert('success', 'Signed up successfully');
      window.setTimeout(() => {
        location.assign('/Login');
      }, 1500);
    }
    // console.log(res);
  } catch (err) {
    // console.log(err.response.data.message);
    // alert(err.response.data.message);
    showAlert('error', err.response.data.message);
  }
};
