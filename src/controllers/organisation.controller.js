import { Organization } from "../models/organization.model.js";
import { User } from "../models/user.model.js";


function testOrg(req, res) {
  res.json({
    message: 'hello org'
  })
}

async function createOrganisation(req, res) {
  const { name, description, superAdmin } = req.body;

  if (!name || !superAdmin) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: {
        name: 'Name is required',
        superAdmin: 'Super admin is required',
      }
    });
  }

  
  if (!mongoose.Types.ObjectId.isValid(superAdmin)) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: { superAdmin: 'Invalid user reference' }
    });
  }

  try {
    if (await Organization.exists({ name: name })) {
      return res.status(409).json({ error: 'Organization name already taken' });
    }

    const user = await User.findOne({ email:uperAdmin });

    if(!user) {
      return res.status(404).json({ error: 'User not found on TaskMaster platform. Please create user first' });
    }

    const organization = new Organization({
      name,
      description,
      superAdmin: user._id,
      plan: 'free',
      planValidity: null
    });

    await organization.save();
    user.ownedOrganizations.push(organization._id);
    await user.save(); // todo: cover organization and ownedOrganizations.push in single query or in a transaction

    res.status(201).json({ success: true, message: 'Organisation created' });
  } catch (err) {
    res.status(500).json({ error: 'User creation failed' });
  }
}

export {
  testOrg,
  createOrganisation
}