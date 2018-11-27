
//Set up ajax request for

/*$("#orthoData").on( "submit", function( event ) {
  event.preventDefault();
  var organism = document.getElementById("#dropdownMenu2").text;
  console.log("This form is running " + organism);
  console.log( $( this ).serialize() );
});
*/

function updateOrganism(id){
    var y = $('#org_id').val();
    var x = $('#Organism').val();
    console.log("This x: " + x);
    console.log("This y: " + y);  
    $.ajax({
        url: '/' + id,
        type: 'PUT',
        data: {
          id: y,
          organism: x
        },
        success: function(result){
          //console.log("This is the " + data);
            window.location.replace("./organism");

        }
    })
};

