export const numberToString = (value: number): string => {
    return value.toLocaleString('en-US', {maximumFractionDigits:2});
}

export const numberToMoneyString = (value: number): string => {
    const valueString = value.toLocaleString('en-US', {maximumFractionDigits:2});
    return value < 0 ? '-$'.concat(valueString) : '$'.concat(valueString);
}


export const toTitleCase = (str: string) => {
    return str.toLowerCase().split(' ').map((word: string) => {
        return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
}