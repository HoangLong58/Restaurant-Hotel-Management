const { createCustomer, getCustomerByCustomerId, getCustomers, updateCustomer, deleteCustomer, login } = require("../controller/CustomerController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.post("/", checkToken, createCustomer);
router.get("/", checkToken, getCustomers);
router.get("/:customerId", checkToken, getCustomerByCustomerId);
router.put("/", checkToken, updateCustomer);
router.delete("/", checkToken, deleteCustomer);

router.post("/login", login);

module.exports = router;