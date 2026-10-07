import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import * as authService from "../services/auth.service.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:3000/api/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const user = await authService.googleAuthUser({
          googleId: profile.id,
          email: profile.emails?.[0]?.value ?? "",
          first_name: profile.name?.givenName ?? "",
          last_name: profile.name?.familyName ?? "",
        });
        done(null, { userId: user.id, email: user.email });
      } catch (error) {
        done(error as Error, undefined);
      }
    },
  ),
);

export default passport;
