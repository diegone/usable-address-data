import { readFileSync, writeFileSync } from 'fs';

const getRawData = name => JSON.parse(readFileSync(`../rawData/${name}.json`));
const unnecessaryKeys = [ 'id', 'key', 'sub_keys', 'sub_names', 'sub_zips', 'sub_zipexs', 'sub_isoids', 'sub_lnames', 'sub_lfnames', 'sub_mores', 'sub_xzips', 'sub_xrequires' ];
const regions = getRawData('allRegions');
const structuredData = {};

for (const region of regions) {
    const regionData = getRawData(region);

    function addDataBlock(ancestorAggr, node, key, slug) {
        const dataBlock = regionData[slug];
        node[key] = {};
        Object.entries(dataBlock)
            .filter(([attrName, attrValue]) => !unnecessaryKeys.includes(attrName) && ancestorAggr[attrName] !== attrValue)
            .map(([attrName, attrValue]) => {
                if (attrName === 'languages') {
                    if (attrValue !== dataBlock.lang) {
                        node[key][attrName] = attrValue.split('~');
                    }
                } else {
                    node[key][attrName] = attrValue;
                }
            });
        if (dataBlock.sub_keys) {
            Object.entries(dataBlock).map(([attrName, attrValue]) => ancestorAggr[attrName] = attrValue)
            node[key]._ = {};
            dataBlock.sub_keys.split('~').map(sk => addDataBlock(ancestorAggr, node[key]._, sk, `${slug}/${sk}`));
        }
    }
    addDataBlock({}, structuredData, region, `data/${region}`)
}

writeFileSync(`../derivedData/structuredData.json`, JSON.stringify(structuredData, null, '\t'));
