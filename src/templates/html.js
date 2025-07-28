exports.accountCreationEmail = (name, data) => {
  return `<table width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100%!important">
    <tbody>
      <tr>
        <td align="center">
          <table style="border:1px solid #eaeaea;border-radius:5px;margin:40px 0" width="600" border="0" cellspacing="0" cellpadding="40">
            <tbody>
              <tr>
                <td align="center">
                  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;text-align:left;width:465px">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100%!important">
                      <tbody>
                        <tr>
                          <td align="center">
                            <div>
                              <img src="https://majors3bucket042.s3.us-east-1.amazonaws.com/cbexlogo.jpeg" width="155" height="65" alt="logo">
                            </div>
                            <h1 style="color:#000;font-size:18px;font-weight:normal;margin:30px 0;padding:0">
                              Welcome to <b>STANLEY MEAL VOUCHER SYSTEM</b>
                            </h1>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <p style="color:#000;font-size:16px;line-height:24px">Hi <b>${name}</b>,</p>
                    <p style="color:#000;font-size:16px;line-height:24px">Your account has been successfully created. You can now log in using the credentials below:</p>
                    <div style="margin:20px 0;padding:20px;border:1px solid #eaeaea;border-radius:5px;background-color:#f9f9f9">
                      <p><strong>Email:</strong> ${data.email}</p>
                      <p><strong>Staff ID:</strong> ${
                        data.staffId || data.vendorId
                      }</p>
                      <p><strong>Password:</strong> <span style="color:#3FBD98;font-weight:bold">${
                        data.password
                      }</span></p>
                    </div>
                    <p style="color:#000;font-size:16px;line-height:24px">You can log in using either your <b>email</b> or <b>staff ID</b> with the password above. Please change your password once logged in.</p>
                    <hr style="border:none;border-top:1px solid #eaeaea;margin:26px 0;width:100%">
                    <p style="color:#666666;font-size:14px;line-height:24px">If you have any questions or encounter any issues, feel free to contact our support team.</p>
                    <p style="color:#666666;font-size:14px;line-height:24px">Best regards,<br>Stanley and Coo</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>`;
};

exports.passwordOTP = (name, data) => {
  return `<table width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100%!important">
    <tbody>
      <tr>
        <td align="center">
          <table style="border:1px solid #eaeaea;border-radius:5px;margin:40px 0" width="600" border="0" cellspacing="0" cellpadding="40">
            <tbody>
              <tr>
                <td align="center">
                  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;text-align:left;width:465px">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100%!important">
                      <tbody>
                        <tr>
                          <td align="center">
                            <div>
                              <img src="https://majors3bucket042.s3.us-east-1.amazonaws.com/cbexlogo.jpeg" width="155" height="65" alt="logo">
                            </div>
                            <h1 style="color:#000;font-size:18px;font-weight:normal;margin:30px 0;padding:0">
                              <b>Reset Your Password</b>
                            </h1>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <p style="color:#000;font-size:16px;line-height:24px">Hi <b>${name}</b>,</p>
                    <p style="color:#000;font-size:16px;line-height:24px">
                      You requested to reset your password. Use the OTP below to proceed:
                    </p>
                    <div style="margin:20px 0;padding:20px;border:1px solid #eaeaea;border-radius:5px;background-color:#f9f9f9;text-align:center">
                      <p style="font-size:28px;font-weight:bold;color:#3FBD98;letter-spacing:4px;">${data}</p>
                    </div>
                    <p style="color:#000;font-size:16px;line-height:24px">
                      This OTP is valid for a limited time. If you didn’t request a password reset, please ignore this email.
                    </p>
                    <hr style="border:none;border-top:1px solid #eaeaea;margin:26px 0;width:100%">
                    <p style="color:#666666;font-size:14px;line-height:24px">
                      Need help? Contact our support team.
                    </p>
                    <p style="color:#666666;font-size:14px;line-height:24px">Best regards,<br>Stanley and Coo</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>`;
};

exports.giftVoucherEmail = (name, data) => {
  const { numberOfVouchers, isPurchased, from } = data;

  const plural = numberOfVouchers > 1 ? "s" : "";
  const statusMessage = isPurchased
    ? `<p style="color:#000;font-size:16px;line-height:24px">
         These voucher${plural} have already been purchased for you by <b>${from}</b>. 
         You can use them immediately. Enjoy your meal! 🍽️
       </p>`
    : `<p style="color:#000;font-size:16px;line-height:24px">
         You need to claim these voucher${plural} before they expire. Kindly log in to your dashboard and purchase them. ⏳
       </p>`;

  return `<table width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100%!important">
    <tbody>
      <tr>
        <td align="center">
          <table style="border:1px solid #eaeaea;border-radius:5px;margin:40px 0" width="600" border="0" cellspacing="0" cellpadding="40">
            <tbody>
              <tr>
                <td align="center">
                  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif;text-align:left;width:465px">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="width:100%!important">
                      <tbody>
                        <tr>
                          <td align="center">
                            <div>
                              <img src="https://majors3bucket042.s3.us-east-1.amazonaws.com/cbexlogo.jpeg" width="155" height="65" alt="logo">
                            </div>
                            <h1 style="color:#000;font-size:18px;font-weight:normal;margin:30px 0;padding:0">
                              🎁 You've Been Gifted Meal Voucher${plural}
                            </h1>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <p style="color:#000;font-size:16px;line-height:24px">
                      Hi <b>${name}</b>,
                    </p>

                    <p style="color:#000;font-size:16px;line-height:24px">
                      <b>${from}</b> just gifted you <b>${numberOfVouchers}</b> meal voucher${plural} through the Stanley Meal Voucher System.
                    </p>

                    ${statusMessage}

                    <div style="margin:20px 0;padding:20px;border:1px solid #eaeaea;border-radius:5px;background-color:#f9f9f9;text-align:center">
                      <a href="https://yourdomain.com/login" style="background-color:#3FBD98;color:#fff;padding:10px 20px;border-radius:4px;text-decoration:none;font-weight:bold;display:inline-block">
                        Log in to view
                      </a>
                    </div>

                    <hr style="border:none;border-top:1px solid #eaeaea;margin:26px 0;width:100%">
                    <p style="color:#666666;font-size:14px;line-height:24px">
                      If you believe this was a mistake, you may ignore this message or contact support.
                    </p>
                    <p style="color:#666666;font-size:14px;line-height:24px">
                      Best regards,<br>Stanley and Coo
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>`;
};
