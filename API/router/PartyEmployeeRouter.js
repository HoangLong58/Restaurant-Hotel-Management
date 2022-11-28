const { getAllPartyEmployeeByPartyHallId, deletePartyEmployee, createPartyEmployeeByListEmployeeId } = require("../controller/PartyEmployeeController");
const { checkToken } = require("../auth/TokenValidation");

const router = require("express").Router();

router.get("/get-party-employee-by-party-hall-id/:partyHallId", checkToken, getAllPartyEmployeeByPartyHallId); //
router.delete("/:partyEmployeeId", checkToken, deletePartyEmployee); //

router.post("/create-party-employee-by-list-employee-id", checkToken, createPartyEmployeeByListEmployeeId); //

module.exports = router;