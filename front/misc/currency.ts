function RupiahFormat(price: any): string {
    try {
        if (price.toString().length < 4)
            return `Rp ${price}`
        
        let reverse = price.toString().split('').reverse().join(''),
        ribuan 	= reverse.match(/\d{1,3}/g);
        ribuan = ribuan.join('.').split('').reverse().join('');
        
        return `Rp ${ribuan}`
        
    } catch (error) {
        
    }
    return `Rp 0`
}

export default RupiahFormat