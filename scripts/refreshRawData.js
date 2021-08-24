import fetch from 'node-fetch';
import { writeFileSync } from 'fs';

function sortedKeysObj(obj) {
    const sortedKeysObj = {};
    Object.keys(obj).sort().forEach(k => sortedKeysObj[k] = obj[k]);
    return sortedKeysObj;
}

(async() => {
    const regions = await fetch('https://chromium-i18n.appspot.com/ssl-address/data')
        .then(r => r.json())
        .then(data => data.countries.split('~'));
    writeFileSync(`../rawData/allRegions.json`, JSON.stringify(regions));
    regions.push('ZZ'); // used to capture defaults
    for (const region of regions) {
        await fetch(`https://chromium-i18n.appspot.com/ssl-aggregate-address/data/${region}`)
            .then(r => r.json())
            .then(data => writeFileSync(`../rawData/${region}.json`, JSON.stringify(sortedKeysObj(data), null, '\t')));
    }
})();
