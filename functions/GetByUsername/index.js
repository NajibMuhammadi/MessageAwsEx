const { sendResponse, sendError } = require('../../responses/index');
const { db } = require('../../services/index');

exports.handler = async (event) => {
    try {
        const { username } = event.pathParameters;

        const result = await db.scan({
            TableName: 'messages-db',
            FilterExpression: 'Username = :username',
            ExpressionAttributeValues: {
                ':username': username.toLowerCase()
            }
        });

        if (!result.Items || result.Items.length === 0) {
            return sendError(404, 'No messages found for this username');
        }

        const formattedItems = result.Items.map(item => ({
            ...item,
            Username: item.Username.charAt(0).toUpperCase() + item.Username.slice(1)
        }));

        return sendResponse(200, { success: true, data: formattedItems });

    } catch (error) {
        console.error('Error getting messages by username: ', error);
        return sendError(500, 'Internal Server Error');
    }
};
  