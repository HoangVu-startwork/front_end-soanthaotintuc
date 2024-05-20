#!/bin/sh
host="dicom_aws"
web_dir="/srv/dicom-blog-composer"

npm run build
rm -f build.zip
zip -r build.zip build || powershell Compress-Archive build build.zip
scp build.zip $host:/tmp

ssh $host <<EOF
    sudo su
    cp /tmp/build.zip $web_dir
    cd $web_dir
    mv build build-$(date +"%Y%m%d%T")
    unzip build.zip
    chmod -R 755 build
    chcon -Rt httpd_sys_content_t /srv/dicom-blog-composer/build/
    rm -f build.zip
EOF
echo "done"
