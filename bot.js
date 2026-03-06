const axios = require("axios");
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
global.fetch = require("node-fetch");

const poolData = {
  UserPoolId: "us-east-2_W1NZcFghK",
  ClientId: "1956req5ro9drdtbf5i6kis4la"
};

const pool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

function login(email, password) {
  return new Promise((resolve, reject) => {

    const user = new AmazonCognitoIdentity.CognitoUser({
      Username: email,
      Pool: pool
    });

    const authDetails = new AmazonCognitoIdentity.AuthenticationDetails({
      Username: email,
      Password: password
    });

    user.authenticateUser(authDetails, {
      onSuccess: (result) => {
        const token = result.getIdToken().getJwtToken();
        resolve(token);
      },
      onFailure: (err) => {
        reject(err);
      }
    });

  });
}

async function run() {

  const email = process.env.ELDORADO_EMAIL;
  const password = process.env.ELDORADO_PASSWORD;

  const token = await login(email, password);

  console.log("Login correcto");

  const response = await axios.get(
    "https://www.eldorado.gg/api/boostingOffers/me/boostingSubscriptions",
    {
      headers: {
        cookie: `__Host-EldoradoIdToken=${token}`,
        accept: "application/json"
      }
    }
  );

  const subscriptions = response.data;

  console.log("Subscriptions recibidas");

  subscriptions.forEach(sub => {

    if (sub.server === "NA") {
      console.log("Servidor NA detectado:", sub);
    }

  });

}

run().catch(console.error);
