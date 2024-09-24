const { sendResponse, sendError } = require('../../responses/index');
const { db } = require('../../services/index');

exports.handler = async (event) => {
    try {
        const { id } = event.pathParameters;

        if (!id) {
            return sendError(400, 'Message ID is required');
        }
        const result = await db.get({
            TableName: 'messages-db',
            Key: {
                MessageID: id
            }
        });

        if(!result.Item){
            return sendError(404, 'No id found');
        }

        await db.delete({
            TableName: 'messages-db',
            Key: {
                MessageID: id
            }
        });

        return sendResponse(200, { success: true, data: result.Item });

    } catch (error) {
        return sendError(500, 'Internal Server Error');
    }
};
  