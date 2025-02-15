export function encodeBase64(password: string): string {
    let pass = Buffer.from(password).toString('base64');
    // console.log(pass);
    return pass;
}

export function decodeBase64(endcodePassword: string): string {
    return Buffer.from(endcodePassword, 'base64').toString('utf-8');
}