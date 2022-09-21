const router = require("express").Router();
const con = require("../../config/database.config");

router.get("/", (req, res) => {
    res.send("user test is successfull");
});

module.exports = router;