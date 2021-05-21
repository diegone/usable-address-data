import { readFileSync, writeFileSync } from 'fs';
import { generateJsFromJson } from './util.js';

const getRawData = name => JSON.parse(readFileSync(`../rawData/${name}.json`));

const regions = getRawData('allRegions');
const defaultData = getRawData('ZZ')[`data/ZZ`];
const fmtRegex = /(%(N|O|A|D|C|S|Z|X|n)|[^%]+)/g;
const expandedFormats = {};

for (const region of regions) {
    const regionData = getRawData(region)[`data/${region}`];
    const fmt = regionData.fmt || defaultData.fmt;
    const getFieldName = {
        N: 'name',
        O: 'organization',
        A: 'address-line',
        D: 'address-level3',
        C: 'address-level2',
        S: 'address-level1',
        Z: 'postal-code',
        X: 'address-level4',
        n: 'break'    
    };
    const getLabel = {
        N: 'name',
        O: 'organization',
        A: 'address-line',
        D: regionData.sublocality_name_type || defaultData.sublocality_name_type,
        C: regionData.locality_name_type || defaultData.locality_name_type,
        S: regionData.state_name_type || defaultData.state_name_type,
        Z: regionData.zip_name_type || defaultData.zip_name_type,
        X: 'sorting-code'
    };
    const format = Array.from(fmt.matchAll(fmtRegex))
        .map(m => {
            const field = getFieldName[m[2]];
            const label = m[2] ? getLabel[m[2]] : m[1];
            const required = (regionData.require || defaultData.require).includes(m[2]);
            const upper = (regionData.upper || defaultData.upper).includes(m[2]);
            const format = {};
            field && (format.field = field);
            field === 'postal-code' && regionData.zip && (format.regex = regionData.zip);
            label && (format.label = label);
            required && (format.required = required);
            upper && (format.upper = upper);
            return format;
        });
    const def = { region: regionData.name, format };
    regionData.lang && (def.lang = regionData.lang);
    expandedFormats[region] = def;
}

writeFileSync(`../derivedData/expandedFormats.json`, JSON.stringify(expandedFormats, null, '\t'));
generateJsFromJson('expandedFormats', expandedFormats, [ `export const expandedFormats = { ${regions.join(',')} };` ]);
