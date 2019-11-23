function deletePainting(id){
    $.ajax({
        url: '/paintings/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};