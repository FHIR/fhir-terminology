env PREFIX='./dist' `npm bin`/grunt build
tar cvzf fhirvs.tar.gz -C dist .
curl -F "app=fhirvs" -F "file=@./fhirvs.tar.gz;filename=file" http://try-fhirplace.hospital-systems.com/api/app
