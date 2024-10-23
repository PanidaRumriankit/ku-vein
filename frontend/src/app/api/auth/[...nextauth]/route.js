import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid'
                }
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, account, profile }) {
            if (account?.provider === "google") {
                token.accessToken = account.access_token;
                token.email = profile?.email;
                token.idToken = account.id_token;
            }

            return token;
        },
        async session({ session, token }) {
            session.email = token.email;
            session.idToken = token.idToken

            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }