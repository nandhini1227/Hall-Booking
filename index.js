const express = require('express');
const app = express();
const PORT = 3039;
app.use(express.urlencoded({extended:false}));
app.use(express.json());


let rooms = [
  {
    "roomId": "R1",
    "seatsAvailable": 4,
    "amenities": "tv,ac,heater",
    "pricePerHour": 100,
    "maxCapacity": 6,
    "location": "Floor 1, Wing A"
  },
  {
    "roomId": "R2",
    "seatsAvailable": 2,
    "amenities": "projector,whiteboard",
    "pricePerHour": 150,
    "maxCapacity": 4,
    "location": "Floor 2, Wing B"
  },
  {
    "roomId": "R3",
    "seatsAvailable": 8,
    "amenities": "tv,ac",
    "pricePerHour": 80,
    "maxCapacity": 10,
    "location": "Floor 3, Wing C"
  }
];

let bookings = [
  {
    "customerName": "Perumal",
    "bookingDate": "20240312",
    "startTime": "12:00pm",
    "endTime": "02:00pm",
    "bookingId": "B1",
    "roomId": "R1",
    "bookingStatus": "booked",
    "booked_On": "02/03/2024",
    "totalPrice": 200
  },
  {
    "customerName": "Nandhini",
    "bookingDate": "20240307",
    "startTime": "12:00pm",
    "endTime": "05:00pm",
    "bookingId": "B2",
    "roomId": "R2",
    "bookingStatus": "completed",
    "booked_On": "01/03/2024",
    "totalPrice": 750
  },
  {
    "customerName": "John",
    "bookingDate": "20240315",
    "startTime": "09:00am",
    "endTime": "05:00pm",
    "bookingId": "B3",
    "roomId": "R3",
    "bookingStatus": "pending",
    "booked_On": "02/03/2024"
  }
];

function generateBookingId() {
  return bookings.length + 1;
}

app.get('/', (req, res) => {
  res.send('Welcome to the Hall Booking API');
});

app.get('/rooms', (req, res) => {
  res.json(rooms);
});

app.post('/create-room', (req, res) => {
  const { roomId, seatsAvailable, amenities, pricePerHour, maxCapacity = 0, location = "" } = req.body;

  if (!roomId || !seatsAvailable || !pricePerHour) {
    return res.status(400).json({ message: 'Room number, seats Available, pricePer hour are required' });
  }

  const isRoomExist = rooms.some((room) => room.roomId === roomId);

  if (isRoomExist) {
    return res.status(409).json({ message: 'Room number already exists' });
  }

  rooms.push({
    roomId,
    seatsAvailable,
    amenities,
    pricePerHour,
    maxCapacity,
    location,
  });
  res.json({ message: 'Room created successfully' });
});

app.post('/book-room', (req, res) => {
  try {
    const { roomId, customerName, date, startTime, endTime } = req.body;

    if (!roomId || !customerName || !date || !startTime || !endTime) {
      return res.status(400).json({ message: "RoomId, customerName, date, startTime, endTime are required" });
    }

    const room = rooms.find((room) => room.roomId === roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not Found' });
    }

    
    const isRoomAvailable = true;

    if (!isRoomAvailable) {
      return res.status(409).json({ message: 'Room is not available for the specified time' });

    }

    const RoomAvailable = bookings.every(
      (booking) =>
        booking.roomId !== roomId || 
        !( 
          (new Date(booking.startTime) < new Date(endTime) &&
            new Date(booking.endTime) > new Date(startTime)) ||
          (new Date(startTime) < new Date(booking.startTime) &&
            new Date(endTime) > new Date(booking.endTime))
        )
    );

    if (!isRoomAvailable) {
      return res.status(409).json({ message: 'Room is not available for the specified time' });
    }

    const bookingId = generateBookingId();

    bookings.push({
      bookingId,
      roomId,
      customerName,
      date,
      startTime,
      endTime,
      bookingDate: new Date(),
      bookingStatus: 'Confirmed',
      booked_On: new Date(),
    });
    res.json({ message: 'Room booked successfully' });
  } catch (error) {
    console.error("Error in booking-room endpoint:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/rooms-with-bookings', (req, res) => {
  const roomsWithBookings = rooms.map((room) => {
    const roomBookings = bookings.filter((booking) => booking.roomId === room.roomId);
    return {
      roomNumber: room.roomId,
      bookings: roomBookings.map((booking) => ({
        customerName: booking.customerName,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        bookingStatus: booking.bookingStatus,
      })),
    };
  });
  res.json(roomsWithBookings);
});

app.get('/customers-with-bookings', (req, res) => {
  const customersWithBookings = bookings.map((booking) => ({
    customerName: booking.customerName,
    roomId: booking.roomId,
    date: booking.date,
    startTime: booking.startTime,
    endTime: booking.endTime,
    bookingStatus: booking.bookingStatus,
  }));
  res.json(customersWithBookings);
});

app.get('/customer-booking-history/:customerName', (req, res) => {
  const customerName = req.params.customerName;
  const customerBookingHistory = bookings.filter((booking) => booking.customerName === customerName);
  res.json(customerBookingHistory);
});

app.post('/handle-data', (req, res) => {
  const parsedData = req.body;

  console.log(parsedData);

  if (!parsedData.someField || typeof parsedData.someField !== 'string') {
    return res.status(400).json({ error: 'Some field (string) is required' });
  }

  try {
    
    console.log('Data processed successfully!');

    res.json({ message: 'Data received successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Hall Booking Api listening at http://localhost:${PORT}`);
});
