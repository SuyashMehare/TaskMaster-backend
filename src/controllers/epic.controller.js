async function createProductEpic(req, res) {
    const epicData = req.body;

    try {
        const newEpic = new Epic({
            ...epicData,
            organizationId: epicData.organizationId,
            productId: epicData.productId,
            label: epicData.label.trim(),
            name: epicData.name.trim(),
            description: epicData.description?.trim() || ''
        });

        await newEpic.save();
        res.status(201).json({ success: true, data: savedEpic });
    } catch (error) {
        let status = 400;
        let message = 'Failed to create epic';
        if (error.code === 11000) {
            message = 'Epic with this name or label already exists for the product';
        } else if (error.name === 'ValidationError') {
            message = Object.values(error.errors).map(err => err.message).join(', ');
        } else {
            status = 500;
            message = 'Server error';
        }
        res.status(status).json({
            success: false,
            error: message,
            ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        });
    }
}

export {
    createProductEpic
}