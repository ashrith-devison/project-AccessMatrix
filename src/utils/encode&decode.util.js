const encode = (str) => {
    let encodedStr = str;
    const times = parseInt(process.env.ENCODE_TIMES) || 1; 
    for (let i = 0; i < times; i++) {
        encodedStr = Buffer.from(encodedStr).toString('base64');
    }
    return encodedStr;
};

const decode = (str) => {
    let decodedStr = str;
    const times = parseInt(process.env.ENCODE_TIMES) || 1;
    for (let i = 0; i < times; i++) {
        decodedStr = Buffer.from(decodedStr, 'base64').toString('utf-8');
    }
    return decodedStr;
};

export { encode, decode };
