const { sendResponse, sendError } = require('../../responses/index');
const { db } = require('../../services/index');

exports.handler = async (event) => {
    try {
        const data = await db.scan({
            TableName: 'messages-db',
        });

        const formattedData = data.Items
            .sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt))
            .map(item => ({
                ...item,
                Username: item.Username ? item.Username.charAt(0).toUpperCase() + item.Username.slice(1) : item.Username,
                Message: item.Message ? item.Message.charAt(0).toUpperCase() + item.Message.slice(1) : item.Message,
                lastupdated: item.lastupdated ? item.lastupdated.charAt(0).toUpperCase() + item.lastupdated.slice(1) : item.lastupdated,
            }));

        return sendResponse(200, { success: true, data: formattedData });
        
    } catch (error) {
        return sendError(500, 'Internal Server Error');
    }
};
  