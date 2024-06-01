$(document).ready(() => {
    const apiStatus = $('#api_status');
    $.get('http://0.0.0.0:5001/api/v1/status/', (data) => {
        if (data.status === 'OK') {
            apiStatus.addClass('available');
        } else {
            apiStatus.removeClass('available');
        }
    });

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

    const places = $('.places');
    $.ajax({
        url: 'http://127.0.0.1:5001/api/v1/places_search',
        method: 'POST',
        data: '{}',
        headers: {
            'Content-Type': 'application/json'
        },
        success: (data, textStatus) => {
            console.log(data);
            if (textStatus === 'success') {
                for (place of data) {
                    places.append(`<ARTICLE>
                    <DIV class="headline">
                        <DIV class="place_holder"></DIV>
                        <H2>${ place.name }</H2>
                        <DIV class="price_by_night">$${ place.price_by_night }</DIV>
                    </DIV>
                    <DIV class="information">
                        <DIV class="max_guest">
                            <DIV class="guest_icon place_icon"><IMG src='/static/images/icon_group.png'/></DIV>
                            <P>${ place.max_guest } Guests</P>
                        </DIV>
                        <DIV class="number_rooms">
                            <DIV class="bed_icon place_icon"><IMG src='/static/images/icon_bed.png'/></DIV>
                            <P>${ place.number_rooms } Bedroom</P>
                        </DIV>
                        <DIV class="number_bathrooms">
                            <DIV class="bath_icon place_icon"><IMG src='/static/images/icon_bath.png'/></DIV>
                            <P>${ place.number_bathrooms } Bathroom</P>
                        </DIV>
                    </DIV>
                    <DIV class="description">
                        ${ place.description }
                    </DIV>
                </ARTICLE>`)
                }
            }
        }
        
    });
});
