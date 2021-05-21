import { addressFormatters } from './addressFormatters.js';

function sampleTextFormatter(region, address) {
    return (addressFormatters[region] || addressFormatters.ZZ)(address).join('\n');
}

const sampleAddress = {
    N: '{Name}',
    O: '{Organization}',
    A: '{Address Lines}',
    D: '{Sublocality}',
    C: '{Locality}',
    S: '{Administrative Area}',
    Z: '{Postal Code}',
    X: '{Sorting Code}'
};

['US', 'JP', 'BR', 'SG'].map(r => console.log(`Sample ${r} formatting:\n${sampleTextFormatter(r, sampleAddress)}\n`));
