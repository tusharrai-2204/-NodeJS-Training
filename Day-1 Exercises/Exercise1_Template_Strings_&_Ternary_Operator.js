/* 1. Build an occasion sign */

const buildSign = (occasion, name) => {
    return `Happy ${occasion} ${name}!`;
}
console.log(buildSign('Birthday', 'Rob'));

/* ******************************************************************************************************* */

/* 2. Build a birthday sign */

function buildBirthdaySign(age) {
    return `Happy Birthday! What a ${age >= 50 ? 'mature' : 'young'} fellow you are.`;
}

console.log(buildBirthdaySign(55));
console.log(buildBirthdaySign(30));

/* ******************************************************************************************************* */

/* 3. Build a graduation sign */
function graduationFor(name, year) {
    const phrase = `Congratulations ${name}!
Class of ${year}`;

    return phrase;
}

console.log(graduationFor('Hannah', 2022));

/* ******************************************************************************************************* */

/* 4. Compute the cost of a sign */

function costOf(sign, currency) {
    const cost = (20 + sign.length*2).toFixed(2);
    return `Your sign costs ${cost} ${currency}.`;
}

console.log(costOf(buildSign('Birthday', 'Rob'), 'dollars'));