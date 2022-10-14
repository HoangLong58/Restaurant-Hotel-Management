// Định dạng tiền kiểu: xxx.xxx.xxx
module.exports = {
    format_money: (str) => {
        str = str.toString();
        return str.split('').reverse().reduce((prev, next, index) => {
            return ((index % 3) ? next : (next + '.')) + prev
        });
    },
}


