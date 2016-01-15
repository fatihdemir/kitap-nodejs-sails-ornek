/**
 * TaskController
 *
 * @description :: Server-side logic for managing tasks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	subscribeToTask: function (req, res) {
		return res.send(JSON.stringify(sails.sockets.id(req.socket)));
		//if (!req.isSocket) {
			//return res.badRequest("Only a client socket can subscribe to Tasks");
		//}
		
		//Task.subscribe(req.socket);
		
	},
	
	subscribeToTaskRoom: function (req,res) {
		var roomName = req.param('roomName');
		sails.sockets.join(req.socket, roomName);
		res.json({
			message: 'Subscribed to the room: ' + roomName
		});
	}
};

