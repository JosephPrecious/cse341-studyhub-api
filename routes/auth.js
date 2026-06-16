const express = require("express");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const mongodb = require("../data/database");

const router = express.Router();

const hasGitHubConfig =
  process.env.GITHUB_CLIENT_ID &&
  process.env.GITHUB_CLIENT_SECRET &&
  process.env.GITHUB_CALLBACK_URL;

if (hasGitHubConfig) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const db = mongodb.getDb();
          const email =
            profile.emails && profile.emails.length > 0
              ? profile.emails[0].value
              : "";

          const userData = {
            githubId: profile.id,
            username: profile.username || profile.displayName,
            email,
            profileImage:
              profile.photos && profile.photos.length > 0
                ? profile.photos[0].value
                : "",
            updatedAt: new Date()
          };

          const result = await db.collection("users").findOneAndUpdate(
            { githubId: profile.id },
            {
              $set: userData,
              $setOnInsert: { createdAt: new Date() }
            },
            {
              upsert: true,
              returnDocument: "after"
            }
          );

          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}

passport.serializeUser((user, done) => {
  done(null, user._id ? user._id.toString() : user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const ObjectId = require("mongodb").ObjectId;
    const db = mongodb.getDb();
    const user = await db.collection("users").findOne({ _id: new ObjectId(id) });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

const requireGitHubConfig = (req, res, next) => {
  if (!hasGitHubConfig) {
    return res.status(503).json({
      message:
        "GitHub OAuth is not configured. Add GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, and GITHUB_CALLBACK_URL to .env."
    });
  }

  return next();
};

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Start GitHub login
 *     responses:
 *       302:
 *         description: Redirects to GitHub OAuth
 */
router.get("/login", requireGitHubConfig, passport.authenticate("github"));

/**
 * @swagger
 * /auth/github:
 *   get:
 *     summary: Start GitHub OAuth
 *     responses:
 *       302:
 *         description: Redirects to GitHub OAuth
 */
router.get("/auth/github", requireGitHubConfig, passport.authenticate("github"));

/**
 * @swagger
 * /auth/github/callback:
 *   get:
 *     summary: GitHub OAuth callback
 *     responses:
 *       302:
 *         description: Redirects after authentication
 */
router.get(
  "/auth/github/callback",
  requireGitHubConfig,
  passport.authenticate("github", {
    failureRedirect: "/"
  }),
  (req, res) => {
    res.redirect("/current");
  }
);

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Log out current user
 *     responses:
 *       200:
 *         description: Logged out
 */
router.get("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }

    req.session.destroy(() => {
      res.status(200).json({
        message: "Logged out successfully"
      });
    });
  });
});

/**
 * @swagger
 * /current:
 *   get:
 *     summary: Get current authenticated user
 *     responses:
 *       200:
 *         description: Current user state
 */
router.get("/current", (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(200).json({
      authenticated: false,
      user: null
    });
  }

  return res.status(200).json({
    authenticated: true,
    user: req.user
  });
});

module.exports = router;
