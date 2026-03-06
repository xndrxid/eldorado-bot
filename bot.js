const axios = require("axios");
const { Amplify } = require("aws-amplify");
const { Auth } = require("aws-amplify/auth");

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-east-2_W1NZcFghK",
      userPoolClientId: "1956req5ro9drdtbf5i6kis4la",
      loginWith: {
        oauth: {
          domain: "login.eldorado.gg",
          redirectSignIn: "https://www.eldorado.gg/account/auth-callback",
          responseType: "code"
        }
      }
    }
  }
});

async function run() {

  const email = process.env.ELDORADO_EMAIL;
  const password = process.env.ELDORADO_PASSWORD;

  try {

    await Auth.signIn({
      username: email,
      password: password
    });

    const session = await Auth.fetchAuthSession();
    const idToken = session.tokens.idToken.toString();

    console.log("Token obtenido");

    const res = await axios.get(
      "https://www.eldorado.gg/api/boostingOffers/me/boostingSubscriptions",
      {
        headers: {
          cookie: `__Host-EldoradoIdToken=${idToken}`,
          accept: "application/json"
        }
      }
    );

    const data = res.data;

    console.log("Respuesta recibida");

    data.forEach(item => {
      if (item.server === "NA") {
        console.log("Servidor NA:", item);
      }
    });

  } catch (err) {
    console.error("Error:", err.message);
  }

}

run();
