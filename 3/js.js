function pow(base, exponent) {
    if (exponent === 0) {
        return 1;
    }

    let result = 1;
    for (let i = 0; i < Math.abs(exponent); i++) {
        result *= base;
    }

    if (exponent < 0) {
        result = 1 / result;
    }

    return result;
}


const powArrow = (base, exponent) => exponent === 0 ? 1 : base ** exponent;

/
let x = Number(prompt('Введіть число'));
let n = Number(prompt('Введіть степень'));

alert(`Результат (звичайна функція pow): ${pow(x, n)}`);
alert(`Результат (стрілкова функція powArrow): ${powArrow(x, n)}`);
