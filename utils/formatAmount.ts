export const formatAmount = (amount: number): string => {
    if (amount % 1 !== 0) {
        return amount.toFixed(2);
    }
    return amount.toString();
}