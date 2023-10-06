const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

passport.use(
	new GoogleStrategy(
		{
			clientID: '773038401951-gpsi2mab8frjtv6ih38oo6s2vqqhkdur.apps.googleusercontent.com',
			clientSecret: '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',
			callbackURL: "/auth/google/callback",
			scope: ["profile", "email"],
		},
		function (accessToken, refreshToken, profile, callback) {
			callback(null, profile);
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});