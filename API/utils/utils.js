module.exports = {
    // Định dạng tiền kiểu: xxx.xxx.xxx
    format_money: (str) => {
        str = str.toString();
        return str.split('').reverse().reduce((prev, next, index) => {
            return ((index % 3) ? next : (next + '.')) + prev
        });
    },
    // Random OTP - Quên mật khẩu
    randomIntFromInterval: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}


