const config = require("./config");

const paystack = (request) => {
  const initializePayment = (body) => {
    const options = {
      url: config.paystackInitializeUrl,
      headers: {
        Authorization: `Bearer ${config.paystackSecretKey}`,
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    };
    return request.post(options.url, body, { headers: options.headers });
  };

  const verifyPayment = (ref) => {
    const url = `${config.paystackVerifyUrl}${ref}`;
    return request.get(url, {
      headers: {
        Authorization: `Bearer ${config.paystackSecretKey}`,
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });
  };

  return { initializePayment, verifyPayment };
};

module.exports = paystack;
