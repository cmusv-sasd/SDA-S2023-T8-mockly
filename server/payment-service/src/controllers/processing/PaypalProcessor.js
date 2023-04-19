import paypal from 'paypal-rest-sdk'
import PaymentProcessor from "./PaymentProcessor"
import { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } from "../../utils/constants"

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': PAYPAL_CLIENT_ID,
  'client_secret': PAYPAL_CLIENT_SECRET
});

class PaypalProcessor extends PaymentProcessor {
  async request(payer, payee, amount) {
    const create_payment_json = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "redirect_urls": {
        "return_url": `http://localhost:3001/api/payment/confirm`,
        "cancel_url": `http://localhost:3001/api/payment/cancel`
      },
      "transactions": [{
        "item_list": {
          "items": [{
            "name": `Match ${this.matchId}`,
            "price": amount,
            "currency": "USD",
            "quantity": 1
          }]
        },
        "amount": {
          "currency": "USD",
          "total": amount
        },
        "description": `Match ${this.matchId}`,
        "payee": {
          "email": payee.account
        }
      }]
    };
    
    const linkPromise = new Promise((resolve, reject) => {
      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          reject(error);
        } else {
          for(let i = 0;i < payment.links.length;i++){
            if(payment.links[i].rel === 'approval_url'){
              resolve({ 
                redirect: true,
                link: payment.links[i].href
              })
            }
          }
        }
      })
    })

  return linkPromise
}

  async confirm(payload){
    const {PayerID, paymentId, amount} = payload
    const execute_payment_json = {
      "payer_id": PayerID,
      "transactions": [{
        "amount": {
          "currency": "USD",
          "total": 20
        }
      }]
    };
  
    // Obtains the transaction details from paypal
    const successPromise = new Promise((resolve, reject) => {
      paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
          reject(error)
        } else {
          console.log(JSON.stringify(payment));
          resolve(payment)
        }
      })
    })
    return successPromise
  }
  
  processRequestResult(result) {
    console.log(result)
    return {success: true, redirect: result.redirect, link: result.link}
  }

  processConfirmResult(result) {
    return result
  }

} 

export default PaypalProcessor