// tasks adlı Room için kullandığımız WebSocket bağlantısını üye yapıyoruz. Bu sayede bu Room için tetiklenen tüm olaylardan socket bağlantımız haberdar edilebilecek

io.socket.get('/task/subscribeToTaskRoom?roomName=tasks', function(msg) {
	console.log(msg);
});

// task modeli oluşturulması durumunda bilgilendirme alıyoruz. Bilgi geldiği zaman sayfamızdaki tabloyu yeniliyoruz
io.socket.on('task', function(event) {
	listTasks();
});

// mevcut task nesnelerindeki değişiklikleri takip ediyoruz. Değişiklik olduğu durumda tablomuzu yeniliyoruz.
io.socket.get('/task', function(event) {
	listTasks();
});

// Yeni bir görev yazılarak enter tuşuna basıldığında tetiklenen olayı düzenliyoruz. Burada e.which == 13 koşulu basılan tuşun Enter tuşu olup olmadığını kontrol ediyor.
// Eğer koşullar sağlanıyorsa socket bağlantımız üzerinden sails.js'nin sağladığı api rotalarını kullanarak yeni bir task nesnesi yaratılmasını sağlıyoruz. Bu yeni görevi tabloya ekliyoruz.
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

// tablodaki nesleri silmek için düğmeye basıldığında yine sails.js api rotalarını kullanarak veritabanından silinmesini sağlıyoruz. Sonra tablodan kaldırıyoruz.
$('.todolist').on('click','.remove-item',function(){
	task = $(this);
    io.socket.get('/task/destroy/'+$(task).parent().attr('task_id'), function (response) {
		$(task).parent().remove();
		countTasks();
	});
});

// listede bulunan görevleri sayıyoruz.
function countTasks(){
    var count = $("#sortable li").length;
    $('.count-todos').html(count);
}

// veritabanında bulunan açık görevleri listelemek için sails.js api rotalarını kullanıyoruz.
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


