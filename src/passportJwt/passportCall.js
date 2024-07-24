const passport = require("passport");

const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user)
        return res.status(401).send({
          status: "error",
          error: info.message ? info.message : info.toString(),
        });
      req.user = user;
      next();
    })(req, res, next);
  };
};

const passportCallUrl = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) return next(err);
      if (!user) return res.redirect("/login/recover-password");
      req.user = user;
      next();
    })(req, res, next);
  };
};

module.exports = {
  passportCall,
  passportCallUrl,
};
