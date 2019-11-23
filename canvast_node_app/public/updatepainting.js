function updatePainting(id){
    $.ajax({
        url: '/paintings/' + id,
        type: 'PUT',
        data: $('#update-painting').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};