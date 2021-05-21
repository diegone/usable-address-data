import { writeFileSync } from 'fs';

export function generateJsFromJson(jsFileName, obj, footer)
{
    const moduleSource = [
        `// Generated from https://chromium-i18n.appspot.com/ssl-address/data`
    ];

    Object.entries(obj)
        .map(([name, obj]) => moduleSource.push(`export const ${name} = ${JSON.stringify(obj)};`));
    footer && moduleSource.push(...footer);
    writeFileSync(`../${jsFileName}.js`, moduleSource.join('\n'));
}
