
//Set up ajax request for

/*$("#orthoData").on( "submit", function( event ) {
  event.preventDefault();
  var organism = document.getElementById("#dropdownMenu2").text;
  console.log("This form is running " + organism);
  console.log( $( this ).serialize() );
});
*/

function updateInt(id){
    $.ajax({
        url: '/' + id,
        type: 'PUT',
        data: $('#update-gene').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};