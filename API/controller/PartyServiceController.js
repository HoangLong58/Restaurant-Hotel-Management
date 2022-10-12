const { getPartyServices, getPartyServicesByPartyServiceTypeId, getPartyServiceByPartyServiceId } = require("../service/PartyServiceService");

module.exports = {
    getPartyServices: async (req, res) => {
        try {
            const result = await getPartyServices();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Get all party services successfully!",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getPartyServices",
                error: err
            });
        }
    },
    getPartyServiceByPartyServiceId: async (req, res) => {
        const partyServiceId = req.params.partyServiceId;
        try {
            const result = await getPartyServiceByPartyServiceId(partyServiceId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Get all party services by party_service_id successfully!",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getPartyServiceByPartyServiceId",
                error: err
            });
        }
    },
    getPartyServicesByPartyServiceTypeId: async (req, res) => {
        const partyServiceTypeId = req.body.partyServiceTypeId;
        try {
            const result = await getPartyServicesByPartyServiceTypeId(partyServiceTypeId);
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Get all party services by party_service_type_id successfully!",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getPartyServicesByPartyServiceTypeId",
                error: err
            });
        }
    },
}