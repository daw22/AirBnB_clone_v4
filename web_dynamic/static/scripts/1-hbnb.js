$(document).ready(() => {
    const amenityIds = [];
    const amenityNames = [];

    const amenityH4 = $('.filtered_amenities');
    $('input.amenity_checkbox').on('change', (event) => {
        const amenityId = $(event.currentTarget).attr('data-id').substring(1);
        const amenityName = $(event.currentTarget).attr('data-name').substring(1);

        if ($(event.currentTarget).is(':checked')) {
            if (! amenityIds.includes(amenityId)) {
                amenityIds.push(amenityId);
                amenityNames.push(amenityName);

            }
        } else {
            if (amenityIds.includes(amenityId)) {
                amenityIds.splice(amenityIds.indexOf(amenityId), 1);
                amenityNames.splice(amenityNames.indexOf(amenityName), 1);
            }
        }
        let amenityNamesString = amenityNames.join(', ');
        if (amenityNamesString.length > 27) {
            amenityNamesString = amenityNamesString.substring(0, 26) + '...';
        } else if (amenityNamesString.length === 0) {
            amenityNamesString = '&nbsp;';
        }
        amenityH4.html(amenityNamesString);
    });
});
