# Usable Address Data
This repo captures a snapshot of postal address data published at https://chromium-i18n.appspot.com/ssl-address/data and makes it available in different formats.

The `refreshRawData.js` script maintains an identical mirror in the `rawData` folder. For more information on the meaning of fields, please refer to https://github.com/google/libaddressinput/wiki/AddressValidationMetadata.

The `refreshStructuredData.js` script produces `derivedData/structuredData.json`, which captures the same information in a single file. It has been formatted to reproduce the logical hierarchy of the data and eliminate redundancies.

The `refreshLowCardinality.js` script produces `derivedData/lowCardinality.json`, which summarizes aggregated low-cardinality attributes in a single file.
