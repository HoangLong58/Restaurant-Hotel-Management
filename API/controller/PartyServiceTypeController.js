const { getPartyServicesByPartyServiceTypeId } = require("../service/PartyServiceService");
const { getPartyServiceTypes, getPartyServiceTypeByPartyServiceTypeId } = require("../service/PartyServiceTypeService");

module.exports = {
    getPartyServiceTypes: async (req, res) => {
        try {
            const result = await getPartyServiceTypes();
            if (!result) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Get all party service types successfully!",
                data: result
            });
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getPartyServiceTypes",
                error: err
            });
        }
    },
    getPartyServiceTypeByPartyServiceTypeId: async (req, res) => {
        const partyServiceTypeId = req.params.partyServiceTypeId;
        try {
            const result = await getPartyServiceTypeByPartyServiceTypeId(partyServiceTypeId);
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
                message: "Lỗi getPartyServiceTypeByPartyServiceTypeId",
                error: err
            });
        }
    },
    getPartyServiceTypesAndPartyServices: async (req, res) => {
        try {
            let finalResultArray = [];
            const partyServiceTypesRes = await getPartyServiceTypes();
            if (!partyServiceTypesRes) {
                return res.status(400).json({
                    status: "fail",
                    message: "Record not found"
                });
            }
            try {
                for (var i = 0; i < partyServiceTypesRes.length; i++) {
                    let typeServiceId = partyServiceTypesRes[i].party_service_type_id;
                    let typeServiceName = partyServiceTypesRes[i].party_service_type_name;
                    const servicesRes = await getPartyServicesByPartyServiceTypeId(typeServiceId);
                    if (!servicesRes) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Record not found"
                        });
                    }
                    finalResultArray.push({
                        partyServiceType: typeServiceName,
                        partyServices: servicesRes
                    });
                }
                return res.status(200).json({
                    status: "success",
                    message: "Get all party services of all party service types successfully!",
                    data: finalResultArray
                });
            } catch (err) {
                return res.status(400).json({
                    status: "fail",
                    message: "Lỗi getPartyServicesByPartyServiceTypeId",
                    error: err
                });
            }
        } catch (err) {
            return res.status(400).json({
                status: "fail",
                message: "Lỗi getPartyServiceTypes",
                error: err
            });
        }
    },
}