
//Set up ajax request for

/*$("#orthoData").on( "submit", function( event ) {
  event.preventDefault();
  var organism = document.getElementById("#dropdownMenu2").text;
  console.log("This form is running " + organism);
  console.log( $( this ).serialize() );
});
*/

function updateOrganism(id){
    $.ajax({
        url: '/organism/' + id,
        type: 'PUT',
        data: $('#update_organism').serialize(),
        success: function(result){
          console.log("This is the " + result)
            window.location.replace("./");
        }
    })
};

function selectPlanet(id){
    $("#planet-selector").val(id);
}