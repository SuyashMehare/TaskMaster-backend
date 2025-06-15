import { User } from "../models/user.model.js";

function test(req, res) {
    res.json({
        message: 'hello'
    })
}


async function createUser(req, res) {
    const { username, email, timezone = 'UTC' } = req.body;

    if (!username || !email) {
        return res.status(400).json({ error: 'Username and email are required' });
    }
    if (username.length < 3 || username.length > 30) {
        return res.status(400).json({ error: 'Username must be between 3 and 30 characters long' });
    }   
    

    try {
        if (await User.exists({ email: email })) {
          return res.status(409).json({ error: 'Email already exists' });
        }

        const user = await User.create({ username, email, timezone });
        res.status(201).json({
          _id: user._id,
          username: user.username,
          email: user.email,
          timezone: user.timezone
        });
      } catch (err) {        
        res.status(500).json({ error: 'User creation failed', reason:err });
      }
}


export {
    test,
    createUser
}