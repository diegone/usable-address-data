# Usable Address Data
This repo captures a snapshot of postal address data published at https://chromium-i18n.appspot.com/ssl-address/data and makes it available in different formats.

The `refreshRawData.js` script maintains an identical mirror in the `rawData` folder. For more information on the meaning of fields, please refer to https://github.com/google/libaddressinput/wiki/AddressValidationMetadata.

The `refreshStructuredData.js` script produces `derivedData/structuredData.json` and its `.js` counterpart, which captures the whole data set in a single file. It has been formatted to reproduce the logical hierarchy of the data and eliminate redundancies.

The `refreshLowCardinality.js` script produces `derivedData/lowCardinality.json` and its `.js` counterpart, which summarizes aggregated low-cardinality attributes in a single file.

The `refreshAdminAreas.js` script produces `derivedData/adminAreas.json` and its `.js` counterpart, which summarizes the top-level administrative areas in those regions that have them and enumerate them.

The `refreshExpandedFormats.js` script produces `derivedData/expandedFormats.json` and its `.js` counterpart, which unrolls formats in each region in a semantic albeit verbose format.

## Notes
* It's not clear what the guideline should be in storing admin areas, especially in multi-lingual regions. Should it be the key, the lname, the isoid? There doesn't seem to be consistency across regions (e.g. sometimes keys are in the local language and sometimes are in English). You'd think it'd be preferred if immutable keys were used for storage (e.g. using iso id's in a dropdown) and then it'd be a presentation concern to convert them to the desired localized label. But maybe it's overkill and there's no real use case that would benefit from storing keys.
* Localized versions of files are not crawled (but also are not aggregated by Google)
* Since the most common use case is not printing postal labels but capturing addresses on apps, probably name and organization is not needed in patterns. Corresponding newline may need to be removed too.
* Hard-coded text is sometimes questionable:
  * Some countries that use their name before the postal code have the country name hard-coded in the pattern. Since country names are implicit, it sounds like there is a big chance of duplication by always appending the country name after the pattern.
  * Despite having a `postprefix` attribute, formats seem to hard-code it as well. If they match, it may make sense to remove it from the pattern.