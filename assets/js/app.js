io.socket.get('/task/subscribeToTaskRoom?roomName=tasks', function(msg) {
	console.log(msg);
});

io.socket.on('task', function(event) {
	listTasks();
});

io.socket.get('/task', function(event) {
	listTasks();
});

//create todo
$('.add-todo').on('keypress',function (e) {
      e.preventDefault
      if (e.which == 13) {
           if($(this).val() != ''){
			   var todo = $(this).val();
			   io.socket.get('/task/create/?body='+todo+'&status=1', function (task) {
					var markup = '<li task_id="'+task.id+'">'+ task.body +'<button class="btn btn-default btn-xs pull-right  remove-item"><span class="glyphicon glyphicon-remove"></span></button></li>';
					$('#sortable').append(markup);
					$('.add-todo').val('');	
					countTasks();				
				});
		}
	}
});

//delete done task from "already done"
$('.todolist').on('click','.remove-item',function(){
	task = $(this);
    io.socket.get('/task/destroy/'+$(task).parent().attr('task_id'), function (response) {
		$(task).parent().remove();
		countTasks();
	});
});

// count tasks
function countTasks(){
    var count = $("#sortable li").length;
    $('.count-todos').html(count);
}

function listTasks() {
	$('#sortable').html('');
	io.socket.get('/task', function (tasks) {
		countTasks();
		$.each(tasks, function(i, task) {
			var markup = '<li task_id="'+task.id+'">'+ task.body +'<button class="btn btn-default btn-xs pull-right  remove-item"><span class="glyphicon glyphicon-remove"></span></button></li>';
			$('#sortable').append(markup);
			$('.add-todo').val('');	
			countTasks();	
		});				
	});
}


