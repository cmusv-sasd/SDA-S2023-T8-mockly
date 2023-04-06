import PaymentProcessor from "./PaymentProcessor"

class PaypalProcessor extends PaymentProcessor {
  async request(payer, payee, amount) {
    // TODO: get access token of the payer??
    const accessToken = "REPLACE_WITH_YOUR_ACCESS_TOKEN"
    return fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              value: amount,
              currency_code: "USD",
            },
            payee: {
              email_address: payee,
            },
          },
        ],
      }),
    })
    .then((response) => response.json())
    .then((data) => console.log(data));
  }
  
  processResult(result) {
    // TODO: process paypal result
    return result
  }

} 