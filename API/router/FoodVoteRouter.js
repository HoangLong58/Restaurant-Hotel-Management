
const { createFoodVote, getFoodVoteByFoodIdAndCustomerId, updateFoodVoteCommentByFoodVoteId, deleteFoodVoteCommentByFoodVoteId, getQuantityFoodVote, findFoodVoteByIdOrName, getAllFoodVotes, findFoodVoteById, replyCustomerComment, deleteFoodVoteAdminById } = require("../controller/FoodVoteController");
const router = require("express").Router();

const { checkToken } = require("../auth/TokenValidation");

router.get("/quantity", checkToken, getQuantityFoodVote);   //
router.get("/:search", checkToken, findFoodVoteByIdOrName); //
router.get("/", checkToken, getAllFoodVotes);   //

router.post("/find-food-vote-by-id", checkToken, findFoodVoteById); //
router.post("/get-food-vote-list", checkToken, getFoodVoteByFoodIdAndCustomerId);
router.post("/", checkToken, createFoodVote);

router.put("/reply-comment-food-vote", checkToken, replyCustomerComment);  //
router.put("/", checkToken, updateFoodVoteCommentByFoodVoteId);

router.delete("/delete-comment-food-vote/:foodVoteId", checkToken, deleteFoodVoteAdminById);
router.delete("/", checkToken, deleteFoodVoteCommentByFoodVoteId);

module.exports = router;