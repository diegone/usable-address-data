import { writeFileSync } from 'fs';
import { generateJsFromJson } from './util.js';
import { structuredData } from '../structuredData.js';

const adminAreas = {};

const regionsWithAA = Object.entries(structuredData).filter(([regionCode, regionData]) => regionData._);
regionsWithAA.map(([regionCode, regionData]) => {
        const areaInfo = {
            lang: regionData.lang || 'en',
            keys: Object.keys(regionData._)
        };
        if (Object.values(regionData._).map(d => d.name).filter((d, idx) => d && d !== areaInfo.keys[idx]).length > 0) {
            areaInfo.names = Object.values(regionData._).map(d => d.name);
            // lnames: Object.values(regionData._).map(d => d.lname)
        }
        if (Object.values(regionData._).map(d => d.lname).filter(d => d).length > 0) {
            areaInfo.lnames = Object.values(regionData._).map(d => d.lname);
        }
        adminAreas[regionCode] = areaInfo;
    });

writeFileSync(`../derivedData/adminAreas.json`, JSON.stringify(adminAreas, null, '\t'));
generateJsFromJson('adminAreas', adminAreas, [ `export const adminAreas = { ${regionsWithAA.map(([regionCode, regionData]) => regionCode).join(',')} };` ]);
