
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

/**This function is responsible for removing a value from the 
 * RNA-seq table.
 */
function deleteEprex(id){
    $.ajax({
        url: '/expression/' + id,
        type: 'DELETE',
        success: function(result){
        	console.log("Delete Success");
            window.location.reload(true);
        }
    })
};

/**Delete a value in the experiment table. */
function deleteExperiment(id){
    $.ajax({
        url: '/Experiments/' + id,
        type: 'DELETE',
        success: function(result){
        	console.log("Delete Success");
            window.location.reload(true);
        }
    })
};


function deleteOrganism(id){
    $.ajax({
        url: '/organism/' + id,
        type: 'DELETE',
        success: function(result){
        	console.log("Delete Success");
            window.location.reload(true);
        }
    })
};

function deletegeneID(id){
    $.ajax({
        url: '/geneID/' + id,
        type: 'DELETE',
        success: function(result){
        	console.log("Delete Success");
            window.location.reload(true);
        }
    })
};