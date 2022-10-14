const { getPartyHallDetailByPartyHallIdAndDateAndTimeId } = require("../service/PartyHallDetailService");
const { getPartyHallImagesByPartyHallId } = require("../service/PartyHallImageService");
const { getPartyHallsWithImageTypeFloor, getPartyHallWithTypeFloorByPartyHallId } = require("../service/PartyHallService");

module.exports = {
    getPartyHallsWithImageTypeFloor: async (req, res) => {
        try {
            const result = await getPartyHallsWithImageTypeFloor();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Đã tìm được sảnh phù hợp!",
                data: result
            });
        } catch (err) {
            console.log("Lỗi getPartyHallsWithImageTypeFloor: ", err);
            return res.status(400).json({
                status: "fail",
                message: "Có lỗi khi lấy getPartyHallsWithImageTypeFloor",
                error: err
            });
        }
    },
    findPartyHalls: async (req, res) => {
        const dateBooking = req.body.dateBooking;
        const timeBooking = req.body.timeBooking;
        const typeBooking = req.body.typeBooking;
        const quantityBooking = req.body.quantityBooking;
        const partyHallType = req.body.partyHallType;

        if (!dateBooking) {
            return res.status(400).json({
                status: "fail",
                message: "Bạn chưa chọn Ngày đãi tiệc!"
            });
        }
        if (!timeBooking && timeBooking !== 0) {
            return res.status(400).json({
                status: "fail",
                message: "Bạn chưa chọn Giờ đãi tiệc!"
            });
        }
        if (!typeBooking && typeBooking !== 0) {
            return res.status(400).json({
                status: "fail",
                message: "Bạn chưa chọn Loại tiệc!"
            });
        }
        if (!quantityBooking) {
            return res.status(400).json({
                status: "fail",
                message: "Bạn chưa chọn Số lượng khách mời!"
            });
        }
        if (!partyHallType && partyHallType !== 0) {
            return res.status(400).json({
                status: "fail",
                message: "Bạn chưa chọn Loại sảnh!"
            });
        }

        try {
            const result = await getPartyHallsWithImageTypeFloor();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            let filteredResult = [];
            for (var i = 0; i < result.length; i++) {
                if (
                    result[i].party_hall_type_id === partyHallType
                    && result[i].party_hall_occupancy >= quantityBooking
                ) {
                    try {
                        const partyHallDetailRes = await getPartyHallDetailByPartyHallIdAndDateAndTimeId(result[i].party_hall_id, dateBooking, timeBooking);
                        console.log(partyHallDetailRes)
                        if (!partyHallDetailRes) {
                            return res.status(400).json({
                                status: "fail",
                                message: "Party hall detail not found"
                            });
                        }
                        // Không tìm dc detail nào state = 0 đang còn hoạt động
                        // có ngày book và time id như trên => Có thể cho chọn sảnh này
                        if (partyHallDetailRes.length === 0) {
                            // Check date and time in detail here!
                            filteredResult.push({ ...result[i] });
                        } else {
                            continue;
                        }
                    } catch (err) {
                        console.log(err);
                        return res.status(400).json({
                            status: "fail",
                            message: "Có lỗi khi lấy getPartyHallDetailByPartyHallIdAndDateAndTimeId",
                            error: err
                        });
                    }
                }
            }
            // Sort lại để hiện Sảnh có sức chứa vừa đủ nhất (Những phòng đủ yêu cầu, sort từ bé -> lớn).
            filteredResult = filteredResult.sort((a, b) => a.party_hall_occupancy - b.party_hall_occupancy);
            return res.status(200).json({
                status: "success",
                message: "Đã tìm được sảnh phù hợp!",
                data: filteredResult
            });
        } catch (err) {
            console.log("Lỗi getPartyHallsWithImageTypeFloor: ", err);
            return res.status(400).json({
                status: "fail",
                message: "Có lỗi khi lấy getPartyHallsWithImageTypeFloor",
                error: err
            });
        }
    },
    getPartyHallWithImagesTypeFloor: async (req, res) => {
        const partyHallId = req.body.partyHallId;
        let finalResult = {};
        try {
            const PartyHallRes = await getPartyHallWithTypeFloorByPartyHallId(partyHallId);
            if (!PartyHallRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            try {
                const images = await getPartyHallImagesByPartyHallId(partyHallId);
                if (!images) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Images record not found"
                    });
                }
                finalResult = {
                    ...PartyHallRes,
                    partyHallImages: images
                };
                return res.status(200).json({
                    status: "success",
                    message: "Lấy party hall và images từ party hall id thành công!",
                    data: finalResult
                });
            } catch (err) {
                console.log("Lỗi getPartyHallImagesByPartyHallId: ", err);
                return res.status(400).json({
                    status: "fail",
                    message: "Có lỗi khi lấy getPartyHallImagesByPartyHallId",
                    error: err
                });
            }
        } catch (err) {
            console.log("Lỗi getPartyHallWithTypeFloorByPartyHallId: ", err);
            return res.status(400).json({
                status: "fail",
                message: "Có lỗi khi lấy getPartyHallWithTypeFloorByPartyHallId",
                error: err
            });
        }
    }
};
