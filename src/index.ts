import { randomBytes } from 'node:crypto';

const pools = {
    lowercase: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
    uppercase: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    numbers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    symbols: ['!', '@', '^', '*', '_', '+', '-', '.']
};

const notEasyReadSymbols = [
    '0', 'o', 'O',
    '1', 'i', 'I', 'l', 'L', '!',
    '9', 'g',
    '5', 's', 'S',
];

export interface GenerateOptions {
    length: number;
    lowercase: boolean;
    uppercase: boolean;
    numbers: boolean;
    symbols: boolean;
    exclude: string;
    easyRead: boolean;
    customChars: string;
}

function getSecureRandomIndex(max: number): number {
    const randomBuffer = randomBytes(4);
    const randomNumber = randomBuffer.readUInt32BE(0);
    return randomNumber % max;
}

export function passwordGenerator(opts: GenerateOptions): string {
    let strict = true;
    let chars: string[] = opts.customChars.split('');

    if (opts.customChars) {
        strict = false;
    } else {
        let minStrictLength = 0;

        if (opts.lowercase) {
            minStrictLength++;
            chars.push(...pools.lowercase);
        }

        if (opts.uppercase) {
            minStrictLength++;
            chars.push(...pools.uppercase);
        }

        if (opts.numbers) {
            minStrictLength++;
            chars.push(...pools.numbers);
        }

        if (opts.symbols) {
            minStrictLength++;
            chars.push(...pools.symbols);
        }

        if (minStrictLength > opts.length) {
            strict = false;
        }
    }

    if (opts.easyRead) {
        chars = chars.filter(char => !notEasyReadSymbols.includes(char));
    }

    if (opts.exclude.length) {
        chars = chars.filter(char => !opts.exclude.includes(char));
    }

    if (chars.length === 0) {
        throw new Error('No characters available for password generation');
    }

    const result: string[] = [];

    // Strict mode: ensure each character type appears at least once
    if (strict) {
        if (opts.lowercase) {
            result.push(pools.lowercase[getSecureRandomIndex(pools.lowercase.length)]);
        }
        if (opts.uppercase) {
            result.push(pools.uppercase[getSecureRandomIndex(pools.uppercase.length)]);
        }
        if (opts.numbers) {
            result.push(pools.numbers[getSecureRandomIndex(pools.numbers.length)]);
        }
        if (opts.symbols) {
            result.push(pools.symbols[getSecureRandomIndex(pools.symbols.length)]);
        }
    }

    // Generate remaining random characters
    while (result.length < opts.length) {
        const randomChar = chars[getSecureRandomIndex(chars.length)];
        result.push(randomChar);
    }

    // Shuffle the result string using crypto.randomBytes
    return result
        .sort(() => getSecureRandomIndex(2) - 1)
        .join('');
}