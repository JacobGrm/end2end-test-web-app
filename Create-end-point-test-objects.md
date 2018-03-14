/*

    RUN IT FROM POSTMAN OR CURL

    POST https://bckquq.run.aws-usw02-pr.ice.predix.io/pg/api/admin/data/pm/_bulk_docs

 */

    // BODY

    {
        "docs": [
            {
                "_id": "FishStew",
                "~userid": "jacob_ge_com",
                "channels": ["channel_1_jacob"]

            },
            {
                "_id": "LambStew",
                "~userid": "jacob_ge_com",
                "channels": ["channel_2_jacob"]
            }
        ]
    }

    // HEADERS

        //Content-Type : application/json
        //Authorization: bearer <TOKEN>