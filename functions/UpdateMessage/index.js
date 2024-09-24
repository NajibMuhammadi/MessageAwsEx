const { sendResponse, sendError } = require('../../responses/index');
const { db } = require('../../services/index');
const {updateSchema } = require('../../models/UpdateModels');

exports.handler = async (event) => {
    try {
        const { id } = event.pathParameters;

        if (!id) {
            return sendError(400, 'Message ID is required');
        }
        const body = JSON.parse(event.body);
        const { username, message } = body;

        const { error } = updateSchema.validate(body);
        if (error) {
            return sendError(400, error.details[0].message);
        }

        const existingUser = await db.scan({
            TableName: 'messages-db',
            FilterExpression: 'Username = :username',
            ExpressionAttributeValues: {
                ':username': username
            }
        });

        if (existingUser.Items.length > 0) {
            return sendError(400, 'Användarnamnet är redan taget');
        }

        const result = await db.update({
            TableName: 'messages-db',
            Key: {
                MessageID: id
            },
            UpdateExpression: 'set Message = :message, lastupdated = :username, updatedAt = :updatedAt',
            ExpressionAttributeValues: {
                ':message': message,
                ':username': username.toLowerCase(),
                ':updatedAt': new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' }),
            },
            ReturnValues: 'ALL_NEW'
        });


        return sendResponse(200, { success: true, data: result.Attributes });

    } catch (error) {
        return sendError(500, 'Internal Server Error');
    }
};
  