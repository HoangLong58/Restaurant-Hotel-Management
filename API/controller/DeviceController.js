const { getDevicesName } = require("../service/DeviceService");

module.exports = {
    getDevicesName: (req, res) => {
        getDevicesName((err, result) => {
            if (err) {
                console.log("Lỗi getDevicesName: ", err);
                return;
            }
            return res.json({
                status: "success",
                data: result
            });
        });
    }
}