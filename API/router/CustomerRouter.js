const { createCustomer, getCustomerByCustomerId, getCustomers, updateCustomer, deleteCustomer, login, updateCustomerOtpByEmail, updateCustomerPasswordWhenForgotPassword, updateCustomerPasswordWhenForgotPasswordPhoneNumber, updateCustomerOtpByPhoneNumber, getAllCustomers, getQuantityCustomers, findCustomerByIdOrName, updateCustomerStateToDisable, updateCustomerStateToAble } = require("../controller/CustomerController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/get-all-customer", checkToken, getAllCustomers);   //
router.get("/quantity", checkToken, getQuantityCustomers);  //
router.get("/search/:search", checkToken, findCustomerByIdOrName);  //
router.get("/:customerId", checkToken, getCustomerByCustomerId);
router.get("/", checkToken, getCustomers);

router.put("/disable-customer", checkToken, updateCustomerStateToDisable);  //
router.put("/undisable-customer", checkToken, updateCustomerStateToAble);  //
router.put("/update-customer-otp-by-email", updateCustomerOtpByEmail);
router.put("/update-customer-otp-by-phone-number", updateCustomerOtpByPhoneNumber);
router.put("/update-customer-password-by-otp-and-email", updateCustomerPasswordWhenForgotPassword);
router.put("/update-customer-password-by-otp-and-phone-number", updateCustomerPasswordWhenForgotPasswordPhoneNumber);
router.put("/", checkToken, updateCustomer);

router.delete("/", checkToken, deleteCustomer);

router.post("/register", createCustomer);
router.post("/login", login);

module.exports = router;