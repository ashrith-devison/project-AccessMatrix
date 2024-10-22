const encode = (str) => {
    const times = process.env.ENCODE_TIMES;
    for(let i = 0; i < times; i++) {
        str = Buffer.from(str).toString('base64');
    }
    return str;
};

const decode = (str) => {
    const times = process.env.ENCODE_TIMES;
    for(let i = 0; i < times; i++) {
        str = Buffer.from(str, 'base64').toString('utf-8');
    }
    return str;
};

export { encode, decode };