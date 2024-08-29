export const numberToString = (value: number): string => {
    return value.toLocaleString('en-US', {maximumFractionDigits:2});
}

export const numberToMoneyString = (value: number): string => {
    const valueString = value.toLocaleString('en-US', {maximumFractionDigits:2});
    return value < 0 ? '-$'.concat(valueString) : '$'.concat(valueString);
}