
export const shuffle = (array) => {
    const shuffledArray = [...array]
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        let randomNum = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[randomNum]] = [shuffledArray[randomNum], shuffledArray[i]]
    }
    return shuffledArray
}