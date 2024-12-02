import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid",
                    prompt: "consent",
                    access_type: "online",
                },
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, account, profile }) {
            if (account?.provider === "google") {
                token.accessToken = account.access_token;
                token.email = profile?.email;
                token.idToken = account.id_token;
                token.refreshToken = account.refresh_token || token.refreshToken;
                token.accessTokenExpires = Date.now() + 3600 * 1000;
                // console.log("Token expires at: " + new Date(token.accessTokenExpires).toLocaleString());
            }

            if (Date.now() < token.accessTokenExpires) {
                return token;
            }

            console.log("Access token has expired. User needs to re-login.");
            return { ...token, error: "AccessTokenExpired" };
        },
        async session({ session, token }) {
            session.email = token.email;
            session.idToken = token.idToken;
            session.accessToken = token.accessToken;
            
            if (token.error === "AccessTokenExpired") {
                session.error = "AccessTokenExpired";
            }

            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
