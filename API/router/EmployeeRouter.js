const { createEmployee, getEmployeeByEmployeeId, getEmployees, updateEmployee, deleteEmployee, login, updateEmployeeOtpByEmail, updateEmployeePasswordWhenForgotPassword, updateEmployeePasswordWhenForgotPasswordPhoneNumber, updateEmployeeOtpByPhoneNumber, getQuantityEmployee, getAllEmployees, findEmployeeByIdOrName, findEmployeeById, updateEmployeeStateToDisable, updateEmployeeStateToAble, getAllEmployeeByPositionIdAndRoomId } = require("../controller/EmployeeController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/quantity", checkToken, getQuantityEmployee);   //
router.get("/search/:search", checkToken, findEmployeeByIdOrName);  //
router.get("/:employeeId", checkToken, getEmployeeByEmployeeId);
router.get("/", checkToken, getAllEmployees);   //

router.put("/disable-employee", checkToken, updateEmployeeStateToDisable);  //
router.put("/undisable-employee", checkToken, updateEmployeeStateToAble);  //
router.put("/update-employee-otp-by-email", updateEmployeeOtpByEmail);
router.put("/update-employee-otp-by-phone-number", updateEmployeeOtpByPhoneNumber);
router.put("/update-employee-password-by-otp-and-email", updateEmployeePasswordWhenForgotPassword);
router.put("/update-employee-password-by-otp-and-phone-number", updateEmployeePasswordWhenForgotPasswordPhoneNumber);
router.put("/", checkToken, updateEmployee);    //

router.delete("/:employeeId", checkToken, deleteEmployee);  //

router.post("/get-all-employee-by-position-id-and-room-id", checkToken, getAllEmployeeByPositionIdAndRoomId);   //
router.post("/find-employee-by-id", checkToken, findEmployeeById);  //
router.post("/register", createEmployee);
router.post("/login", login);
router.post("/", checkToken, createEmployee);   //

module.exports = router;