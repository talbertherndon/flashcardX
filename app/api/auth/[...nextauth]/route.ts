import axios from "axios";
import NextAuth, { NextAuthOptions } from "next-auth";

import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET as string,
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      console.log("token_jwt", token);
      console.log("tuser_jwt", user);

      const { data } = await axios
        .get(
          `https://xg3n-4mh1-ngd5.n7.xano.io/api:w4ONEGEJ:v2/user_by_email?email=${token.email}`,
        )

        .catch((e) => {
          console.log(e);
          return e;
        });
      console.log(data);
      token.id = data.user;
      token.token = data.authToken;

      return token;
    },
    session: async (res: any) => {
      console.log(res.session);
      // cookie.set("j_ce_u", session.authToken);
      res.session.user = res.token.id;
      res.session.token = res.token.token;

      return res.session;
    },
    signIn: async (res: any) => {
      if (res.account.provider === "google") {
        const data = await axios
          .get(
            "https://xg3n-4mh1-ngd5.n7.xano.io/api:U0aE1wpF:v2/oauth/google/continue",
            {
              params: { tokenn: res.account.access_token },
            },
          )
          .catch((e) => {
            console.log(e);
            return e;
          });

        return data;
      } else {
        return true;
      }
    },
  },
  secret: process.env.NEXT_PUBLIC_SECRET,
  //session: { jwt: true },
  jwt: {
    secret: process.env.NEXT_PUBLIC_SECRET,
  },
  debug: true,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
