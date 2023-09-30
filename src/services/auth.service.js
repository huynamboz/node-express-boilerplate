const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const { sendNotifyToTelegram } = require('../utils/telegram');
/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (user.provider !== 'local') {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please login with google');
  }
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

const loginUserWithCredential = async (body) => {
  let user = await userService.getUserByEmail(body.email);
  if (!user) {
    user = await userService.createUser({
      email: body.email,
      name: body.name,
      role: 'USER',
      isEmailVerified: true,
      balance: 0,
      avatar: body.picture,
      provider: 'google'
    });
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
  }
  return user;
}
/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(resetPasswordToken, tokenTypes.RESET_PASSWORD);
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  loginUserWithCredential,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};
