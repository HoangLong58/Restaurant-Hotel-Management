const { createEmployee, getEmployeeByEmployeeId, getEmployees, updateEmployee, deleteEmployee, login, updateEmployeeOtpByEmail, updateEmployeePasswordWhenForgotPassword, updateEmployeePasswordWhenForgotPasswordPhoneNumber, updateEmployeeOtpByPhoneNumber } = require("../controller/EmployeeController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/", checkToken, getEmployees);
router.get("/:employeeId", checkToken, getEmployeeByEmployeeId);
router.put("/", checkToken, updateEmployee);
router.put("/update-employee-otp-by-email", updateEmployeeOtpByEmail);
router.put("/update-employee-otp-by-phone-number", updateEmployeeOtpByPhoneNumber);
router.put("/update-employee-password-by-otp-and-email", updateEmployeePasswordWhenForgotPassword);
router.put("/update-employee-password-by-otp-and-phone-number", updateEmployeePasswordWhenForgotPasswordPhoneNumber);
router.delete("/", checkToken, deleteEmployee);

router.post("/register", createEmployee);
router.post("/login", login);

module.exports = router;