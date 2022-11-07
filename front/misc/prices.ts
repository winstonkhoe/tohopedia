function FinalPriceDiscount(originalPrice: number, quantity: number, discount: number) {
    return ((originalPrice * (100 - discount))/100) * quantity
}

export {
    FinalPriceDiscount
}