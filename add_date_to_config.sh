# add date to config file as its last lint
head -n 3 ./config/development.yaml > ./config/temp_development.yaml
printf "build:\n    date: \"`date`\"\n" >> ./config/temp_development.yaml
mv ./config/temp_development.yaml ./config/development.yaml
