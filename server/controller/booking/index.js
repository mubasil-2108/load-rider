
const Booking = require('../../models/booking');

const createBooking = async (req, res) => {
    const { userId, itemsNo, furnitureType, vehicleType, clientName, clientPhoneNumber } = req.body;

    try{
        const booking = new Booking({
            userId,
            clientName,
            clientPhoneNumber,
            itemsNo,
            furnitureType,
            vehicleType
        });
        
        await booking.save();

        res.status(200).json({
            success: true,
            message: 'Booking created successfully',
        })

    }catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
        })
    }
}

const getBookings = async (req, res) => {
    const {userId} = req.params;
    try{
        if(userId){
            const booking = await Booking.find({userId}); 
            res.status(200).json({
                success: true,
                data: booking
            })
        }else{
            const bookings = await Booking.find({});
            res.status(200).json({
                success: true,
                data: bookings
            })
        }
    }catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
        })
    }
}

module.exports = { createBooking, getBookings };
