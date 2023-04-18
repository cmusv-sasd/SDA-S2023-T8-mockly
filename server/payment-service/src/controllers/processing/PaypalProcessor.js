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
    console.log(payer, payee, amount)
    const create_payment_json = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "redirect_urls": {
        "return_url": `http://localhost:3000/api/payment/confirm`,
        "cancel_url": `http://localhost:3000/api/payment/cancel`
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
        "description": `Match ${this.matchId}`
      }]
    };
    
    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        for(let i = 0;i < payment.links.length;i++){
          if(payment.links[i].rel === 'approval_url'){
            return {
              'redirect': true,
              'link': payment.links[i].href
            }
          }
        }
      }
    });
    
  }

  async confirm(payload){
    const {payerId, paymentId, amount} = payload
    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
        "amount": {
          "currency": "USD",
          "total": amount
        }
      }]
    };
  
    // Obtains the transaction details from paypal
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
        console.log(error.response);
        return { success: false, error }
      } else {
        console.log(JSON.stringify(payment));
        return { success: true }
      }
    })
  }
  
  processRequestResult(result) {
    return result
  }

  processConfirmResult(result) {
    return result
  }

} 

export default PaypalProcessor