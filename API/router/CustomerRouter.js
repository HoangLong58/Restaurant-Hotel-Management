const { createCustomer, getCustomerByCustomerId, getCustomers, updateCustomer, deleteCustomer, login, updateCustomerOtpByEmail, updateCustomerPasswordWhenForgotPassword, updateCustomerPasswordWhenForgotPasswordPhoneNumber, updateCustomerOtpByPhoneNumber } = require("../controller/CustomerController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/", checkToken, getCustomers);
router.get("/:customerId", checkToken, getCustomerByCustomerId);
router.put("/", checkToken, updateCustomer);
router.put("/update-customer-otp-by-email", updateCustomerOtpByEmail);
router.put("/update-customer-otp-by-phone-number", updateCustomerOtpByPhoneNumber);
router.put("/update-customer-password-by-otp-and-email", updateCustomerPasswordWhenForgotPassword);
router.put("/update-customer-password-by-otp-and-phone-number", updateCustomerPasswordWhenForgotPasswordPhoneNumber);
router.delete("/", checkToken, deleteCustomer);

router.post("/register", createCustomer);
router.post("/login", login);

module.exports = router;