function toIndonesianDateAndTime(date: string) {
    let bulans = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
    let newDate = new Date(date)
    let day = newDate.getDate()
    let month = newDate.getMonth()
    let year = newDate.getFullYear()
    let hour = newDate.getHours()
    let minute = newDate.getMinutes()

    return day.toString().padStart(2, '0') + " " + bulans[month] + " " + year + ", " + hour.toString().padStart(2, '0') + ":" + minute.toString().padStart(2, '0') + " WIB"
}

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

function toHourMinute(date: string) {
    let newDate = new Date(date)
    let hour = newDate.getHours()
    let minute = newDate.getMinutes()
    return hour.toString().padStart(2, '0') + ":" + minute.toString().padStart(2, '0')
}

const datesAreOnSameDay = (first: Date, second: Date) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();

export {
    toIndonesianDateAndTime,
    toIndonesianDate,
    toIndonesianDateShort,
    toHourMinute,
    datesAreOnSameDay
}