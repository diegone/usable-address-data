import { readFileSync, writeFileSync } from 'fs';

const getRawData = name => JSON.parse(readFileSync(`../rawData/${name}.json`));

const regions = getRawData('allRegions');
const lowCardinality = {};

for (const region of regions) {
    const regionData = getRawData(region)[`data/${region}`];

    Object.entries(regionData)
        .filter(([attrName, attrValue]) => attrName.indexOf('sub_') !== 0 && attrName !== 'posturl')
        .map(([attrName, attrValue]) => {
            if (attrValue) {
            lowCardinality[attrName] = lowCardinality[attrName] || {};
            lowCardinality[attrName][attrValue] = lowCardinality[attrName][attrValue] || [];
            lowCardinality[attrName][attrValue].push(region);    
        }
    });
}

for (const [attrName, data] of Object.entries(lowCardinality)) {
    if (Object.keys(data).length > 99) {
        console.log(`Dropping high-cardinality attribute: ${attrName}`);
        delete lowCardinality[attrName];
    } else {
        for (const [key, values] of Object.entries(data)) {
            data[key] = values.join('~');
        }
    }
}

writeFileSync(`../derivedData/lowCardinality.json`, JSON.stringify(lowCardinality, null, '\t'));

console.log(`${Object.keys(regions).length} regions`);
for (const attrName of Object.keys(lowCardinality)) {
    console.log(`${Object.keys(lowCardinality[attrName]).length} unique ${attrName}`);
}
