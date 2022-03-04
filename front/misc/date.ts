function toIndonesianDate(date: string) {
    let bulans = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
    let newDate = new Date(date)
    let day = newDate.getDate()
    let month = newDate.getMonth()
    let year = newDate.getFullYear()

    return day + " " + bulans[month] + " " + year
}

function toIndonesianDateShort(date: string) {
    let bulans = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
    let newDate = new Date(date)
    let day = newDate.getDate()
    let month = newDate.getMonth()
    let year = newDate.getFullYear()

    return day + " " + bulans[month].substring(0, 3) + " " + year
}
  
export {
    toIndonesianDate,
    toIndonesianDateShort
}