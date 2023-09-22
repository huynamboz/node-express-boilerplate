const httpStatus = require('http-status');
const {OAuth2Client} = require('google-auth-library');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const { sendNotifyToTelegram } = require('../utils/telegram');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  const dateFormat = new Date(user.createdAt);
  const dateConverted = `${dateFormat.getDate()
  }/${dateFormat.getMonth()+1
  }/${dateFormat.getFullYear()} - ${dateFormat.getHours()}h:${dateFormat.getMinutes()}p:${dateFormat.getSeconds()}s`;
  sendNotifyToTelegram(`<b>Người mới</b>
  <b>id:</b> <pre>${user._id}</pre>
  <b>Tên:</b>  <pre>${user.name} </pre>
  <b>email:</b> <pre>${user.email}</pre>
  <b>role:</b> <pre>${user.role}</pre>
  <b>Số dư:</b> <pre>${user.balance}</pre>
  <b>Tạo lúc:</b> <pre>${dateConverted}</pre>`);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const loginGG = catchAsync(async (req, res) => {
  let decode = null;
  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
        idToken: req.body.credential,
        audience: process.env.CLIENT_ID_GG,  // Specify the CLIENT_ID of the app that accesses the backend
    });
    decode = ticket.getPayload();
  }
  await verify().catch(
    () => {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect token');
    }
  );
  const user = await authService.loginUserWithCredential(decode);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
})

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.send({
	message: 'Đã gửi email đến địa chỉ email của bạn. Vui lòng kiểm tra email để đặt lại mật khẩu.',
  });
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  loginGG,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
