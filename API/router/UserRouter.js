const { createUser, getUserByCustomerId, getUsers, updateUser, deleteUser } = require("../controller/UserController");
const router = require("express").Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:customerId", getUserByCustomerId);
router.put("/", updateUser);
router.delete("/", deleteUser);

module.exports = router;