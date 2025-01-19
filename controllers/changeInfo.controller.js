import Users from '../models/Users.js';

// Change Info in the database (password)
export const changeInfo = async (req, res) => {
    try {

        const user = await Users.findOne({ email: req.params.userEmail });

        if (!user) return res.status(400).send('Invalid link');

        const bcryptPassword = req.params.bcryptPassword.replace(/slash/g, '/');

        await Users.updateOne({ _id: user._id }, { password: bcryptPassword });

        res.send('password changed successfully');
    } catch (error) {
        res.status(400).send('An error occured');
    }
};
