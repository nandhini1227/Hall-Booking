                                          Hall-Booking
Data Storage:

       It uses two arrays - rooms and bookings - to store information about halls and bookings respectively.
       
API Endpoints:

GET / : Returns a welcome message for the API.
GET /rooms : Returns the list of all halls with details.
POST /create-room : Allows creating a new hall with details like roomId, seats available, amenities, etc. It checks for existing room numbers before creating a new one.
POST /book-room : Processes a booking request. It checks for required details (roomId, customer name, date, timings), room availability during the requested time, and then creates a booking entry.
GET /rooms-with-bookings : Provides a list of halls with their corresponding bookings.
GET /customers-with-bookings : Provides a list of all bookings with customer details.
GET /customer-booking-history/:customerName : Retrieves booking history for a specific customer based on the provided name.
POST /handle-data : This endpoint seems like a generic placeholder for future functionalities. It expects data with a string field named "someField".

Error Handling:

The code uses different status codes for various error scenarios:

400: Bad Request - Missing required data in requests.
404: Not Found - Room not found for booking requests.
409: Conflict - Room already exists during room creation or time conflict during booking.
500: Internal Server Error - Unexpected errors during processing.
