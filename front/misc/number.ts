function NumberFormat(price: any): string {
    try {
        if (price.toString().length < 4)
            return `${price}`
        
        let reverse = price.toString().split('').reverse().join(''),
        ribuan 	= reverse.match(/\d{1,3}/g);
        ribuan = ribuan.join('.').split('').reverse().join('');
        
        return `${ribuan}`
        
    } catch (error) {
        
    }
    return `0`
}

export default NumberFormat