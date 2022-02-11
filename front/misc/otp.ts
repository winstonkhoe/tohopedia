export function OTPGenerator() {
    console.log("OTPGenerator");
    var min = 0;
    var max = 9;
    var otp = "";
    for (let index = 0; index < 6; index++) {
        var rand = min + (Math.random() * (max - min));
        otp += Math.ceil(rand);
    }
    console.log("From OTP Function: " + otp);
    return otp;
}