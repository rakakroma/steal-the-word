
export const formatDate = (dt) => {
    var y = dt.getFullYear();
    var m = ('00' + (dt.getMonth() + 1)).slice(-2);
    var d = ('00' + dt.getDate()).slice(-2);
    return (y + '-' + m + '-' + d);
}

export const fullDate = (date) => {
    const theDate = new Date(date)
    return theDate.toString()
}

export const sortByDate = (wordList) => wordList.sort((a, b) => (+b.date) - (+a.date))
