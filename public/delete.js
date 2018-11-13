
/**Function is responsible for sending AJAX to delete a command
 * 
 */
function deleteInteraction(id){
    $.ajax({
        url: '/' + id,
        type: 'DELETE',
        success: function(result){
        	console.log("Delete Success");
            window.location.reload(true);
        }
    })
};