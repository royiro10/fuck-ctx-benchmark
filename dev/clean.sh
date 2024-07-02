rm -rf ./do ./go ./stop

find . -type f -name "*.log" -exec rm -f {} +

rm -f ./random_requests.json
