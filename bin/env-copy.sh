#!/bin/sh

filenames=$(find . -type f -name "*.example")

for filename in $filenames; do
  filename_absulute=$(readlink -f "$filename")
  filename_absulute_new="${filename_absulute%.*}"
  if [ ! -f $filename_absulute_new ]; then
    echo "\e[32mCopying  ${filename_absulute}\e[0m"
    echo "\e[32mTo       ${filename_absulute_new}\e[0m"
    cp $filename_absulute $filename_absulute_new
  fi
done
