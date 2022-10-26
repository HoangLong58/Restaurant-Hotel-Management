import { Star, StarBorder, StarHalf } from "@mui/icons-material";
import moment from "moment";
import { TRACE_VND_USA } from "../constants/Var";

// Hiện số sao ứng với total_vote
export const handleShowStar = (voteTotal) => {
    console.log("voteTotal", voteTotal >= 0 && voteTotal < 0.5);
    switch (true) {
        case voteTotal >= 0 && voteTotal < 0.5:
            return (
                <div className="room-per">
                    <StarBorder style={{ color: "yellow" }} />
                    <StarBorder style={{ color: "yellow" }} />
                    <StarBorder style={{ color: "yellow" }} />
                    <StarBorder style={{ color: "yellow" }} />
                    <StarBorder style={{ color: "yellow" }} />
                </div>
            );
        case voteTotal >= 0.5 && voteTotal < 1:
            return (
                <div className="room-per">
                    <StarHalf style={{ color: "yellow" }} />
                    <StarBorder style={{ color: "yellow" }} />
                    <StarBorder style={{ color: "yellow" }} />
                    <StarBorder style={{ color: "yellow" }} />
                    <StarBorder style={{ color: "yellow" }} />
                </div>
            );
        case voteTotal >= 1 && voteTotal < 1.5:
            return (
                <div className="room-per">
                    <Star style={{ color: "yellow" }} />
                    <StarBorder style={{ color: "yellow" }} />
                    <StarBorder style={{ color: "yellow" }} />
                    <StarBorder style={{ color: "yellow" }} />
                    <StarBorder style={{ color: "yellow" }} />
                </div>
            );
        case voteTotal >= 1.5 && voteTotal < 2:
            return (
                <div className="room-per">
                    <Star style={{ color: "yellow" }} />
                    <StarHalf style={{ color: "yellow" }} />
                    <StarBorder style={{ color: "yellow" }} />
                    <StarBorder style={{ color: "yellow" }} />
                    <StarBorder style={{ color: "yellow" }} />
                </div>
            );
        case voteTotal >= 2 && voteTotal < 2.5:
            return (
                <div className="room-per">
                    <Star style={{ color: "yellow" }} />
                    <Star style={{ color: "yellow" }} />
                    <StarBorder style={{ color: "yellow" }} />
                    <StarBorder style={{ color: "yellow" }} />
                    <StarBorder style={{ color: "yellow" }} />
                </div>
            );
        case voteTotal >= 2.5 && voteTotal < 3:
            return (
                <div className="room-per">
                    <Star style={{ color: "yellow" }} />
                    <Star style={{ color: "yellow" }} />
                    <StarHalf style={{ color: "yellow" }} />
                    <StarBorder style={{ color: "yellow" }} />
                    <StarBorder style={{ color: "yellow" }} />
                </div>
            );
        case voteTotal >= 3 && voteTotal < 3.5:
            return (
                <div className="room-per">
                    <Star style={{ color: "yellow" }} />
                    <Star style={{ color: "yellow" }} />
                    <Star style={{ color: "yellow" }} />
                    <StarBorder style={{ color: "yellow" }} />
                    <StarBorder style={{ color: "yellow" }} />
                </div>
            );
        case voteTotal >= 3.5 && voteTotal < 4:
            return (
                <div className="room-per">
                    <Star style={{ color: "yellow" }} />
                    <Star style={{ color: "yellow" }} />
                    <Star style={{ color: "yellow" }} />
                    <StarHalf style={{ color: "yellow" }} />
                    <StarBorder style={{ color: "yellow" }} />
                </div>
            );
        case voteTotal >= 4 && voteTotal < 4.5:
            return (
                <div className="room-per">
                    <Star style={{ color: "yellow" }} />
                    <Star style={{ color: "yellow" }} />
                    <Star style={{ color: "yellow" }} />
                    <Star style={{ color: "yellow" }} />
                    <StarBorder style={{ color: "yellow" }} />
                </div>
            );
        case voteTotal >= 4.5 && voteTotal < 5:
            return (
                <div className="room-per">
                    <Star style={{ color: "yellow" }} />
                    <Star style={{ color: "yellow" }} />
                    <Star style={{ color: "yellow" }} />
                    <Star style={{ color: "yellow" }} />
                    <StarHalf style={{ color: "yellow" }} />
                </div>
            );
        case voteTotal >= 5:
            return (
                <div className="room-per">
                    <Star style={{ color: "yellow" }} />
                    <Star style={{ color: "yellow" }} />
                    <Star style={{ color: "yellow" }} />
                    <Star style={{ color: "yellow" }} />
                    <Star style={{ color: "yellow" }} />
                </div>
            );
        default:
            return (
                <div className="room-per">
                    <StarBorder style={{ color: "yellow" }} />
                    <StarBorder style={{ color: "yellow" }} />
                    <StarBorder style={{ color: "yellow" }} />
                    <StarBorder style={{ color: "yellow" }} />
                    <StarBorder style={{ color: "yellow" }} />
                </div>
            );
    }
};

// Định dạng tiền kiểu: xxx.xxx.xxx
export const format_money = (str) => {
    str = str.toString();
    return str.split('').reverse().reduce((prev, next, index) => {
        return ((index % 3) ? next : (next + '.')) + prev
    });
};

// Tính số ngày - đêm khi đặt phòng
export const getQuantityFromDayToDay = (dayAgo, dayTo) => {
    // Date format DD/MM/YYYY
    var a = moment([moment(dayAgo, 'DD/MM/YYYY').year(), moment(dayAgo, 'DD/MM/YYYY').month(), moment(dayAgo, 'DD/MM/YYYY').date()]);
    var b = moment([moment(dayTo, 'DD/MM/YYYY').year(), moment(dayTo, 'DD/MM/YYYY').month(), moment(dayTo, 'DD/MM/YYYY').date()]);
    const result = b.diff(a, 'days');
    return (result + 1) + " ngày " + (result) + " đêm";
};

// Đổi tiền tệ VNĐ to USA
export const traceCurrency = (moneyVND) => {
    const moneyUSA = moneyVND / TRACE_VND_USA;
    return Math.round(moneyUSA * 100) / 100;
};