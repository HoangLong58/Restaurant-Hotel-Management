const { getServices } = require("../service/ServiceService");

module.exports = {
    getServices: (req, res) => {
        getServices((err, result) => {
            if (err) {
                console.log("Lỗi getServices: ", err);
                return;
            }
            return res.json({
                status: "success",
                data: result
            });
        });
    }
}