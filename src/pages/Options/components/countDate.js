
export const countDate = (dataDate) => {
    const nowDate = new Date()
    const formatedDate = new Date(dataDate)
    const timeCount = nowDate.getTime() - formatedDate.getTime()
    const dayCount = Math.ceil(timeCount / (1000 * 3600 * 24))
    const hourCount = Math.ceil(timeCount / (1000 * 3600))

    if (hourCount < 24) {
        return hourCount === 1 ? "1 hour ago" : `${hourCount} hours ago`
    }

    if (dayCount < 31) {
        return dayCount === 1 ? "Yesterday" : `${dayCount} days ago`
    }

    const yearCount = nowDate.getFullYear() - formatedDate.getFullYear()
    const monthCount = nowDate.getMonth() - formatedDate.getMonth()

    if (yearCount > 1 || (yearCount === 1 && monthCount >= 0)) {
        return yearCount === 1 ? "last year" : `${yearCount} years ago`
    }

    if (monthCount < 0) {
        return 12 - monthCount === 1 ? "last month" : `${12 - monthCount} months ago`
    }
    return monthCount === 1 ? "last month" : `${monthCount} months ago`

}