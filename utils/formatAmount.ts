export const formatAmount = (amount: number): number => {
    if (amount % 1 !== 0) {
        return Number(amount.toFixed(2));
    }
    return amount;
}