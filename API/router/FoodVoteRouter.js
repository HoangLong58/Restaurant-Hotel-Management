
const { createFoodVote, getFoodVoteByFoodIdAndCustomerId, updateFoodVoteCommentByFoodVoteId, deleteFoodVoteCommentByFoodVoteId } = require("../controller/FoodVoteController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.post("/", checkToken, createFoodVote);
router.put("/", checkToken, updateFoodVoteCommentByFoodVoteId);
router.delete("/", checkToken, deleteFoodVoteCommentByFoodVoteId);
router.post("/get-food-vote-list", checkToken, getFoodVoteByFoodIdAndCustomerId);

module.exports = router;