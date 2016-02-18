var express = require('express');
var http = require('http');

// Set your secret key: remember to change this to your live secret key in production
// See your keys here https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")("sk_live_lololololol");

var app = express();
app.use(require('body-parser').urlencoded());

app.get('/pay_:price', (req, res, next) =>
        res.status(200).send(`<!DOCTYPE html>
<html>
<body>
<form class="pay-form" action="/charge" method="POST">
  <script
    src="https://checkout.stripe.com/checkout.js" class="stripe-button"
    data-key="pk_live_hahahahahhah"
    data-amount="${req.params.price}"
    data-locale="auto">
  </script>
  <input name="amount" type="hidden" value="${req.params.price}">
</form>
</body>
</html>`));

function msgPage(msg) {
    return `<!DOCTYPE html><html><body>${msg}</body></html>`;
}

app.post('/charge', (req, res, next) => {
    // Get the token resulting from the form submit
    var stripeToken = req.body.stripeToken;

    console.log('calling stripe...', req.body);

    var charge = stripe.charges.create({
      amount: req.body.amount, // amount in cents, again
      currency: "usd",
      source: stripeToken,
      description: "That store your mother warned you about"
    }, function(err, charge) {
      if (err) {
        // The card has been declined or something else happened
        console.log('processing error:', err);
        res.status(400).send(msgPage('Sorry, your payment could not be processed.'));
      }
      else {
        res.status(200).send(msgPage('Your payment has been processed. Thank you!'));
      }
    });
});

http.createServer(app).listen(3003, '127.0.0.1');
