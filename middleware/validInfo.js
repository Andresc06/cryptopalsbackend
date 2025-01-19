const valid = (schema) => async (req, res, next) => {

    // Obtain the body from the request where the validation will be applied
    const body = req.body;

    try {

        // Validate the body
        await schema.validate(body);

        next();

    } catch (error) {
        return res.status(400).json({ error })
    }
}

export default valid
