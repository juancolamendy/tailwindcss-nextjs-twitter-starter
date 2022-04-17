import NextAuth from 'next-auth';
import TwitterProvider from 'next-auth/providers/twitter';
import {cloneDeep} from "tailwindcss/lib/util/cloneDeep";

export default NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CONSUMER_KEY,
      clientSecret: process.env.TWITTER_CONSUMER_SECRET,
    })
  ],
  callbacks: {
    // set the required data in session after successful OAuth
    // not expose secrets such as authToken and authSecret to the client-side, so save them in JWT token
    // access the user credential on the server-side using the getToken
    async jwt({token, user, account, profile, isNewUser}) {
      console.log('--- jwt function called - token:', token);
      console.log('--- jwt function called - user:', user);
      console.log('--- jwt function called - account:', account);
      console.log('--- jwt function called - profile:', profile);
      console.log('--- jwt function called - isNewUser:', isNewUser);
      if(profile) {
        token['userProfile'] = {
          followersCount: profile.followers_count,
          twitterHandle: profile.screen_name,
          followingCount: profile.friends_count,
          userID: profile.id
        };
      }
      if(account) {
        token['credentials'] = {
          authToken: account.oauth_token,
          authSecret: account.oauth_token_secret,
        }
      }
      return token
    },
    async session({session, token, user}) {
      // Send properties to the client, like an access_token from a provider.
      console.log('--- session function called - session:', session);
      console.log('--- session function called - token:', token);
      console.log('--- session function called - user:', user);
      let userData = cloneDeep(token.userProfile);
      delete userData.userID;
      session.twitter = userData;
      return session;
    }
  },  
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    error: '/error', // Error code passed in query string as ?error=
  }  
});
