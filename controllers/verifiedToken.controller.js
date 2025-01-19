export const verifiedToken = async (req, res) => {
    try {
        res.json(true);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};
