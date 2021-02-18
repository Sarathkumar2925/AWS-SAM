const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_REGION })
const s3 = new AWS.S3()

exports.handler = async (event) => {
    const { queryStringParameters: { type, key } } = event;

    const s3BannerParams = {
        Bucket: process.env.UploadBucket,
        Key: `uploads/banner/${key}`,
        Expires: 3000,
        ContentType: 'image/*'
    };

    const s3IconParams = {
        Bucket: process.env.UploadBucket,
        Key: `uploads/icon/${key}`,
        Expires: 3000,
        ContentType: 'image/*'
    };

    if (event.rawPath === '/uploads') {
        // Upload image to S3 bucket
        if (type == 'banner') {
            // Upload image to banner folder in S3 bucket
            let bannerUploadUrl = await s3.getSignedUrlPromise('putObject', s3BannerParams);
            return JSON.stringify({
                BannerUploadURL: bannerUploadUrl,
                key: key
            }
            );
        }
        if (type == 'icon') {
            // Upload image to icon folder in S3 bucket
            let iconUploadUrl = await s3.getSignedUrlPromise('putObject', s3IconParams);
            return JSON.stringify({
                IconUploadURL: iconUploadUrl,
                key: key
            });
        }
    }

    if (event.rawPath === '/downloads') {

        //Download image from S3 bucket
        if (type == 'banner') {
            // Download image from banner folder from S3 bucket
            let bannerDownloadUrl = await s3.getSignedUrlPromise('getObject', s3BannerParams);
            return JSON.stringify({
                BannerDownloadUrl: bannerDownloadUrl
            });
        }
        if (type == 'icon') {
            // Download image from icon folder from S3 bucket
            let iconDownloadUrl = await s3.getSignedUrlPromise('getObject', s3IconParams);
            return JSON.stringify({
                iconDownloadUrl: iconDownloadUrl
            });
        }
    }
}
