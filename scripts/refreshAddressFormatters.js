import { writeFileSync } from 'fs';
import { fmt } from '../lowCardinality.js';

const code = [];
const regionMapping = [];
Object.keys(fmt).forEach((format, idx) =>{
    const parts = format
        .split('%n')
        .map(line => '`' + line.replace(/%(N|O|A|D|C|S|Z|X)/g,'${a.$1}') + '`');
    code.push(`function f${idx}(a) { return [${parts.join(',')}]}`);
    regionMapping.push(fmt[format].split('~').map(r => `${r}:f${idx}`).join(','));
});
code.push(`export const addressFormatters = {${regionMapping.join(',')}};`);

writeFileSync(`../addressFormatters.js`, code.join('\n'));
