export function GetMerchantType(type: number): string {
    if (type == 0) {
        return "Reguler Merchant"
    } else if (type == 1) {
        return "Power Merchant"
    } else if (type == 2) {
        return "Power Merchant Pro"
    } else if (type == 3) {
        return "Official Store"
    }
    return ""
}