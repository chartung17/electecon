function isEmpty(input){
    return input === undefined || input === null || input.length === 0;
}

function split_quote(params){
    return params.split(',').map(x => `'${x}'`).join(',');
}

module.exports = {
    isEmpty: isEmpty,
    split_quote: split_quote
}
