import axios from "axios";

const API_URL = "https://www.eldorado.gg/api/boostingOffers/me/boostingSubscriptions";

const headers = {
  "user-agent": "Android23-Bot-OdLY2N9LrO"
};

async function checkOffers() {
  try {
    const res = await axios.get(API_URL, { headers });

    console.log("Respuesta recibida:");
    console.log(res.data);

  } catch (err) {
    console.error("Error:", err.message);
  }
}

setInterval(checkOffers, 1000);