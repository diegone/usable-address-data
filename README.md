# Usable Address Data
This repo captures a snapshot of postal address data published at https://chromium-i18n.appspot.com/ssl-address/data and makes it available in different formats. For more information on the meaning of fields, please refer to https://github.com/google/libaddressinput/wiki/AddressValidationMetadata.

The intended consumption mechanism is through direct import of each JS module in the root. There are also JSON equivalents in the `derivedData` folder, in case that's preferred.

`index.js` demonstrates a possible usage to produce formatted text addresses.

```
Sample US formatting:
{Name}
{Organization}
{Address Lines}
{Locality}, {Administrative Area} {Postal Code}

Sample JP formatting:
〒{Postal Code}
{Administrative Area}
{Address Lines}
{Organization}
{Name}

Sample BR formatting:
{Organization}
{Name}
{Address Lines}
{Sublocality}
{Locality}-{Administrative Area}
{Postal Code}

Sample SG formatting:
{Name}
{Organization}
{Address Lines}
SINGAPORE {Postal Code}
```

## Scripts
The `refreshRawData.js` script maintains an identical mirror in the `rawData` folder. That's the only script that makes http calls. All other scripts depend directly or indirectly to these raw files.

The `refreshStructuredData.js` script produces `derivedData/structuredData.json` and its `.js` counterpart, which captures the whole data set in a single file. It has been formatted to reproduce the logical hierarchy of the data and eliminate redundancies.

The `refreshLowCardinality.js` script produces `derivedData/lowCardinality.json` and its `.js` counterpart, which summarizes aggregated low-cardinality attributes in a single file.

The `refreshAdminAreas.js` script produces `derivedData/adminAreas.json` and its `.js` counterpart, which summarizes the top-level administrative areas in those regions that have them and enumerate them.

The `refreshExpandedFormats.js` script produces `derivedData/expandedFormats.json` and its `.js` counterpart, which unrolls formats in each region in a semantic albeit verbose format.

The `refreshAddressFormatters.js` script produces `addressFormatters.js`. That's a compact formatter for all regions that can be used for both text and HTML formats.

The `refreshAll.sh` shell script invokes all the above scripts in sequence.

## Notes
* It's not clear what the guideline should be in storing admin areas, especially in multi-lingual regions. Should it be the key, the lname, the isoid? There doesn't seem to be consistency across regions (e.g. sometimes keys are in the local language and sometimes are in English). You'd think it'd be preferred if immutable keys were used for storage (e.g. using iso id's in a dropdown) and then it'd be a presentation concern to convert them to the desired localized label. But maybe it's overkill and there's no real use case that would benefit from storing keys.
  * See how they did it here: https://github.com/commerceguys/addressing/blob/master/resources/subdivision_update_map.json
* Localized versions of files are not crawled (but also are not aggregated by Google)
* Since the most common use case is not printing postal labels but capturing addresses on apps, probably name and organization is not needed in patterns. Corresponding newline may need to be removed too.
* Hard-coded text is sometimes questionable:
  * Some countries that use their name before the postal code have the country name hard-coded in the pattern. Since country names are implicit, it sounds like there is a big chance of duplication by always appending the country name after the pattern.
  * Despite having a `postprefix` attribute, formats seem to hard-code it as well. If they match, it may make sense to remove it from the pattern. On the other hand, the following regions have a hard-coded prefix in `zip` and `fmt` but they don't factor it out and place it in `postprefix`. Is it customary for people to omit it entering forms (as opposed allegedly in other regions with postprefix populated where they would enter it in the form and thus it needs to be part of the zip validation pattern). An ideal UX would be to display the prefix in the form and not having to enter it.