# Configuraciones necesarias para poner bucket público

1. Configurar ACL del bucket
   ```
   {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:GetObject",
                "s3:PutObject"
            ],
            "Resource": [
                "arn:aws:s3:::<Your-Bucket-name>",
                "arn:aws:s3:::<Your-Bucket-name>/*"
            ]
        }
        ]
    }
   ```

2. Configurar CORS
    ```
    [
        {
            "AllowedHeaders": [
                "*"
            ],
            "AllowedMethods": [
                "PUT",
                "POST",
                "GET"
            ],
            "AllowedOrigins": [
                "*"
            ],
            "ExposeHeaders": [
                "ETag"
            ]
        }
    ]

    ```
