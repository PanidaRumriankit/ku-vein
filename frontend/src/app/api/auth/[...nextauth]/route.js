import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid',
                    prompt: 'consent',
                    access_type: 'offline',
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
                token.refreshToken = account.refresh_token || token.refreshToken;
                token.accessTokenExpires = Date.now() + 3600 * 1000;
                console.log("Token expires at: " + new Date(token.accessTokenExpires).toLocaleString())
            }

            if (Date.now() < token.accessTokenExpires) {
                return token;
            }

            console.log("Access token has expired, refreshing...");
            return await refreshAccessToken(token);
        },
        async session({ session, token }) {
            session.email = token.email;
            session.idToken = token.idToken;
            session.accessToken = token.accessToken;

            return session;
        },
    },
};

async function refreshAccessToken(token) {
    try {
        const url = `https://oauth2.googleapis.com/token?client_id=${process.env.GOOGLE_CLIENT_ID}&client_secret=${process.env.GOOGLE_CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${token.refreshToken}`;

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST"
        });

        const refreshedTokens = await response.json();

        if (!response.ok) throw refreshedTokens;

        console.log("Refresh Token expires at: " + new Date(Date.now() + 3600 * 1000).toLocaleString())

        return {
            ...token,
            accessToken: refreshedTokens.access_token,
            accessTokenExpires: Date.now() + 3600 * 1000,
            idToken: refreshedTokens.id_token ?? token.idToken
        };
    } catch (error) {
        console.error("Error refreshing access token:", error);

        return {
            ...token,
            error: "RefreshAccessTokenError"
        };
    }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
