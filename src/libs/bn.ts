import BN from "bignumber.js";

export const plus = (number: BN.Value, value: BN.Value): number => {
  try {
    return new BN(number).plus(value).toNumber();
  } catch (err) {
    return 0;
  }
};

export const minus = (number: BN.Value, value: BN.Value): number => {
  try {
    return new BN(number).minus(value).toNumber();
  } catch (err) {
    return 0;
  }
};

export const multipliedBy = (number: BN.Value, value: BN.Value): number => {
  try {
    return new BN(number).multipliedBy(new BN(value)).toNumber();
  } catch (err) {
    return 0;
  }
};

export const dividedBy = (number: BN.Value, value: BN.Value): number => {
  try {
    return new BN(number).dividedBy(new BN(value)).toNumber();
  } catch (err) {
    return 0;
  }
};
