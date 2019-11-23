function deleteMedium(id, mid){
    $.ajax({
        url: '/paintings/' + id + '/medium/' + mid,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};