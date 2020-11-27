const fs = require('fs');
const moltin = require('@moltin/sdk');

const Moltin = moltin.gateway({
  client_id: process.env.REACT_APP_CLIENT_ID || 'EdP3Gi1agyUF3yFS7Ngm8iyodLgbSR3wY4ceoJl0d2'
});
async function getCurrencies() {
  try {
    await Moltin.Authenticate();
    const currencies = await Moltin.Currencies.All();

    const result = currencies.data.filter(c => c.enabled);
    fs.writeFileSync("src/currencies.json", JSON.stringify(result), function(err) {
      if(err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    });
  } catch (e) {
    console.log(e);
  }
}
getCurrencies();
