#!/usr/bin/python3
"""

Contains:
    Misc
    ====
    Script to initialize a flask web app with 1 route to display
    the places of the application

    Functions
    =========
    hbnb - Route function for the '/100-hbnb' url
"""
from flask import Flask, render_template
from models import storage
from models.amenity import Amenity
from models.place import Place
from models.state import State
from uuid import uuid4


app = Flask(__name__)
app.url_map.strict_slashes = False


@app.teardown_appcontext
def renew_session(exc):
    storage.close()


@app.route('/100-hbnb')
def hbnb():
    """Handles requests to /api/v1/100-hbnb"""
    all_amenities = storage.all(Amenity).values()
    all_states = storage.all(State).values()
    all_places = storage.all(Place).values()    
    return (render_template("100-hbnb.html", amenities=all_amenities,
                            all_states=all_states, 
                            all_places=all_places,
                            cache_id=uuid4()))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5000")
