const router = require("express").Router();
const stripe  = require("stripe")(process.env.STRIPE_KEY);

router.post("/payment-stripe", (req, res) => {
    stripe.charges.create(
        {
            source: req.body.tokenId,
            amount: req.body.amount,
            currency: "usd",
        },
        (stripeErr, stripeRes) => {
            if(stripeErr) {
                console.log("Lỗi!", req.body.tokenId, req.body.amount);
                res.status(500).json(stripeErr);
            }else {
                res.status(200).json(stripeRes);
            }
        }
    )
})

module.exports = router;