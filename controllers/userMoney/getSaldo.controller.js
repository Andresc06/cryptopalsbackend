import Users from '../../models/Users.js';

export const getSaldo = async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.params.userEmail });

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Calculate wallet balance

        // Deposits
        const wallet = user.deposits.reduce((acc, deposit) => {
            acc.USD += Number(deposit.amount);
            return acc;
        }, { USD: 0, ETH: 0, BNB: 0, BUS: 0 });

        // Payments
        user.payments.forEach(payment => {
            if (payment.currency === 'USD') wallet.USD += payment.quantity;
            if (payment.currency === 'ETH') wallet.ETH += payment.quantity;
            if (payment.currency === 'BUS' || payment.currency === 'BUSD') wallet.BUS += payment.quantity;
            if (payment.currency === 'BNB') wallet.BNB += payment.quantity;
        });

        // Update wallet in the database
        await Users.updateOne({ email: user.email }, { wallet });

        res.send({ wallet });
    } catch (error) {
        res.status(400).send('An error occurred');
    }
};
