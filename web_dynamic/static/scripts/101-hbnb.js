$(document).ready(() => {

    const fillFilterPreview = (element, dataArray) => {
        let dataString = dataArray.join(', ');
        if (dataString.length > 27) {
            dataString = dataString.substring(0, 26) + '...';
        } else if (dataString.length === 0) {
            dataString = '&nbsp;';
        }
        element.html(dataString);
    }

    const insertPlaces = (data) => {
        data = data.sort((place1, place2) => place1.name.localeCompare(place2.name));
        for (const place of data) {
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
            <DIV class="reviews">
                <DIV class="reviews-headline">
                <H2>Reviews</H2>
                <SPAN data-placeId=:${ place.id } class="review-toggle">show</SPAN>
                </DIV>
            </DIV>
        </ARTICLE>`)
        }
        toggleReview();
    }

    const toggleReview = () => {

        $('SPAN.review-toggle').on('click', (event) => {
            console.log("Why is it not working");
            const reviewPlaceId = $(event.currentTarget).attr('data-placeid').substring(1);
            $(`UL#reviews-${reviewPlaceId}`).remove();

            if ($(event.currentTarget).text() === 'show') {
                $.ajax({
                    url: `http://127.0.0.1:5001/api/v1/places/${reviewPlaceId}/reviews`,
                    success: ((reviews) => {
                        const reviewDiv = $(event.currentTarget).parent().parent();
                        const reviewList = $(`<UL id="reviews-${reviewPlaceId}"></UL>`);

                        for (const review of reviews) {
                            const reviewCreatedAt = review.created_at.split('T')[0];
                            console.log(review);
                            $.ajax({
                                url: `http://127.0.0.1:5001/api/v1/users/${review.user_id}`,
                                success: ((user) => {
                                    reviewList.append(`<LI>
                                        <H3>From ${ user.first_name + ' ' + user.last_name }, on ${ reviewCreatedAt }</H3>
                                        <P class="review-text">${ review.text }</P> 
                                    </LI>`);
                                })
                            })
                        }
                        reviewDiv.append(reviewList);
                        $(event.currentTarget).text('hide');
                    })
                })
            } else {
                $(event.currentTarget).text('show');
            }
        })
    }

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
        fillFilterPreview(amenityH4, amenityNames);
    });

    const stateIds = [];
    const cityIds = []
    const stateAndCityNames = [];

    const statesH4 = $('.filtered_states');
    $('INPUT.state_checkbox').on('change', (event) => {
        const stateId = $(event.currentTarget).attr('data-id').substring(1);
        const stateName = $(event.currentTarget).attr('data-name').substring(1);

        if ($(event.currentTarget).is(':checked')) {
            if (! stateIds.includes(stateId)) {
                stateIds.push(stateId);
                stateAndCityNames.push(stateName);
            }
        } else {
            if (stateIds.includes(stateId)) {
                stateIds.splice(stateIds.indexOf(stateId), 1);
                stateAndCityNames.splice(stateAndCityNames.indexOf(stateName), 1);
            }
        }
        fillFilterPreview(statesH4, stateAndCityNames);
    })

    $('INPUT.city_checkbox').on('change', (event) => {
        const cityId = $(event.currentTarget).attr('data-id').substring(1);
        const cityName = $(event.currentTarget).attr('data-name').substring(1);

        if ($(event.currentTarget).is(':checked')) {
            if (! cityIds.includes(cityId)) {
                cityIds.push(cityId);
                stateAndCityNames.push(cityName);
            }
        } else {
            if (cityIds.includes(cityId)) {
                cityIds.splice(cityIds.indexOf(cityId), 1);
                stateAndCityNames.splice(stateAndCityNames.indexOf(cityName), 1);
            }
        }
        fillFilterPreview(statesH4, stateAndCityNames);
    })

    const places = $('.places');
    $.ajax({
        url: 'http://127.0.0.1:5001/api/v1/places_search',
        method: 'POST',
        data: '{}',
        headers: {
            'Content-Type': 'application/json'
        },
        async: false,
        success: (data, textStatus) => {
            console.log(data);
            if (textStatus === 'success') {
                insertPlaces(data);
            }
        }
        
    });

    $('.filter-search').on('click', () => {
        $('ARTICLE').remove();
        $.ajax({
            url: 'http://127.0.0.1:5001/api/v1/places_search',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({"amenities": amenityIds, "cities": cityIds, "states": stateIds}),
            success: (data, textStatus) => {
                console.log(data);
                if (textStatus === 'success') {
                    insertPlaces(data);
                }
            }
        });
    });
});
