#PRE: sudo apt-get install imagemagick

find . -name "*.png" -exec echo {} \; -exec convert {} -resize "200x200>" -write {} -thumbnail "200x200>" {} \;
