const { sendResponse, sendError } = require('../../responses/index');
const { db } = require('../../services/index');
const { v4: uuid } = require('uuid')
const { postSchema} = require('../../models/postModels');

exports.handler = async (event) => {
    try {

        const body = JSON.parse(event.body);
        const { username, message } = body;

        const { error } = postSchema.validate(body);
        if (error) {
            return sendError(400, error.details[0].message);
        }

        const toLowerCaseUsername = username.toLowerCase();

        const existingUser = await db.scan({
            TableName: 'messages-db',
            FilterExpression: 'Username = :username', 
            ExpressionAttributeValues: {
                ':username': toLowerCaseUsername
            }
        });

        if (existingUser.Items.length > 0) {
            return sendError(400, 'Username already exists');
        }


        const id = uuid().substring(0, 6);
        const createdAt = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' });

        await db.put({
            TableName: 'messages-db',
            Item: {
                MessageID: id,
                Username: toLowerCaseUsername,
                Message: message,
                CreatedAt: createdAt
            }
        });

        return sendResponse(201, {success : true, data : {MessageID: id, CreatedAt: createdAt}});
    } catch (error) {
        return sendError(500, 'Internal Server Error');
    }
};

    
  