/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51OFdIuLeLcVG8ejDQubqUCL3Sfgn71ZMLe7RMNnFfZ6SpLhulNf1nwXrCcQPCHcHIqW7hiBUtn72E1Byw88pAXSn00jsHGxtlu'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);

    const sessionID = session.data.session.id;
    console.log(sessionID);
    // 2) Create checkout form + check credit card
    await stripe.redirectToCheckout({
      // sessionId: session.data.session.id,
      sessionId: sessionID,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};

/*
export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const response = await axios.get(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );

    // Check the response structure and data
    console.log(response);

    // Assuming the session ID is directly in response.data.session.id
    const sessionId = response.data.session.id;

    // 2) Create checkout form + check credit card
    await stripe.redirectToCheckout({
      sessionId: sessionId,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
*/
