const ClientProfile = require('../../models/riderProfile');


const createClientProfile = async (req, res) => {
    const { userId, fullName, email, phoneNumber, address, city, postalCode } = req.body;
    try {
        const clientProfile = new ClientProfile({
            userId,
            fullName,
            email,
            phoneNumber,
            address,
            city,
            postalCode,
        });

        await clientProfile.save();

        res.status(200).json({
            success: true,
            message: 'Client profile created successfully',
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
        })
    }

}

const getClientProfile = async (req, res) => {
    const { userId } = req.query;
    try {
        const clientProfile = await ClientProfile.findOne({ userId });

        if (!clientProfile) {
            console.log('Client profile not found');
            return res.status(400).json({
                success: false,
                message: 'Client profile not found',
            })
        }

        res.status(200).json({
            success: true,
            message: 'Client profile found',
            clientProfile,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
        })
    }
}

const updateClientProfile = async (req, res) => {
    const { userId, phoneNumber, address, city, postalCode } = req.body;
    try {
        const clientProfile = await ClientProfile.findOne({ userId });
        if (!clientProfile) {
            return res.status(400).json({
                success: false,
                message: 'Client profile not found',
            })
        }

        await ClientProfile.findOneAndUpdate(
            { userId },
            {
                phoneNumber,
                address,
                city,
                postalCode,
            }
        )

        res.status(200).json({
            success: true,
            message: 'Updated successfully',
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
        })
    }
}


module.exports = {
    createClientProfile,
    getClientProfile,
    updateClientProfile
}