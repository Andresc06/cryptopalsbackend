import Users from '../models/Users';

export const sendUser = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Users.findOne({ email: email });
        res.json({ user });
    } catch (error) {
        console.error(error.message);
    }
};
