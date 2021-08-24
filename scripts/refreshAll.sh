#!/bin/sh

echo Fetching raw data from Google...
node refreshRawData.js

echo Generating derived data...
node refreshStructuredData.js
node refreshLowCardinality.js
node refreshAdminAreas.js
node refreshExpandedFormats.js
node refreshAddressFormatters.js
