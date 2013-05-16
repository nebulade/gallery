#/bin/sh

QUICKJS="../quickjs/bin/quickjs"
FILE_NAMES="gallery"

for file in $FILE_NAMES; do
    $QUICKJS $file.jml $file.jml.js -m $file
done
