function filterPaintingsByGallery() {
    //get the id of the selected homeworld from the filter dropdown
    var gallery_id = document.getElementById('gallery_filter').value
    //construct the URL and redirect to it
    window.location = '/paintings/filter/' + parseInt(gallery_id)
}
