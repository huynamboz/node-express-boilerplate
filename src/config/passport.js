const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');
const { tokenTypes } = require('./tokens');
const { User } = require('../models');

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtGGVerify = async (payload, done) => {
  try {
    const user = await User.findOne({ email: payload.email });
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
}
const jwtGGOptions = {
  secretOrKey: "GOCSPX-CDIxNMJu2GEiXpqeSfspe7R2vre",
  jwtFromRequest: ExtractJwt.fromBodyField('credential'),
  // alogorithms: ['RS256']
  algorithms: ['RS256']
};
const jwtGGStrategy = new JwtStrategy(jwtGGOptions, jwtGGVerify);
const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
  jwtGGStrategy
};
