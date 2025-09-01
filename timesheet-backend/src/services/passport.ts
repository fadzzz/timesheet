import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { supabase } from './supabase';
import { User, SessionUser } from '../types';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error('No email found'), undefined);
        }

        // Check if user exists
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('google_id', profile.id)
          .single();

        if (existingUser) {
          // Update last login
          await supabase
            .from('users')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', existingUser.id);

          const sessionUser: SessionUser = {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            avatar_url: existingUser.avatar_url,
          };
          return done(null, sessionUser);
        }

        // Create new user
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            email,
            name: profile.displayName || email.split('@')[0],
            google_id: profile.id,
            avatar_url: profile.photos?.[0]?.value,
          })
          .select()
          .single();

        if (createError) {
          return done(createError, undefined);
        }

        // Initialize default clients for new user
        const defaultClients = [
          'LGS Migration',
          'Bruce Power',
          'Alberta Health',
          'Bombardier'
        ];

        await Promise.all(
          defaultClients.map(name =>
            supabase.from('user_clients').insert({
              name,
              user_id: newUser.id,
            })
          )
        );

        const sessionUser: SessionUser = {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          avatar_url: newUser.avatar_url,
        };
        
        return done(null, sessionUser);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: SessionUser, done) => {
  done(null, user);
});

export default passport;