import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import { UsersRepository } from "../repositories/index.js";
import { createHash, isValidPassword } from "../utils/bcryptPassword.js";

const LocalStrategy = local.Strategy;

export const initializaPassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const { confirmPassword } = req.body;

          if (password !== confirmPassword) {
            return done(null, false);
          }

          // const user = await getUserEmail(username);
          const user = await UsersRepository.getUserByEmail(username);

          if (user) {
            return done(null, false);
          }

          req.body.password = createHash(password);

          // const newUser = await registerUser({ ...req.body });
          const newUser = await UsersRepository.registerUser({ ...req.body });

          if (newUser) return done(null, newUser);

          return done(null, false);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          // const user = await getUserEmail(username);
          const user = await UsersRepository.getUserByEmail(username);

          if (!user) {
            done(null, false);
          }

          if (isValidPassword(password, user.password)) {
            return done(null, false);
          }

          return done(done, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    // const user = await getUserById(id);
    const user = await UsersRepository.getUserById(id);
    done(null, user);
  });

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile._json.email;
          // const user = await getUserEmail(email);
          const user = await UsersRepository.getUserByEmail(email);

          if (user) return done(null, user);

          const newUser = {
            name: profile._json.name,
            email,
            password: ".$",
            image: profile._json.avatar_url,
            github: true,
          };

          // const result = await registerUser({ ...newUser });
          const result = await UsersRepository.registerUser({ ...newUser });
          return done(null, result);
        } catch (error) {
          done(error);
        }
      }
    )
  );
};
