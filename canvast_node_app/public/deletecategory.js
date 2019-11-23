function deleteCategory(id, cid){
    $.ajax({
        url: '/paintings/' + id + '/category/' + cid,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};