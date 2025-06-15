import { OrganisationUser } from "../models/organizationUser.model.js";
import { Organization } from "../models/organization.model.js";
import { User } from "../models/user.model.js";


function testOrg(req, res) {
  res.json({
    message: 'hello org'
  })
}

async function createOrganisation(req, res) {
  const { name, description, email } = req.body;


  if (!name || !email) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: {
        name: 'Name is required',
        email: 'Email is required',
      }
    });
  }

  try {
    if (await Organization.exists({ name: name })) {
      return res.status(409).json({ error: 'Organization name already taken' });
    }
    console.log('0');
    
    const user = await User.findOne({ email:email });

    console.log('1');
    if(!user) {
      return res.status(404).json({ error: 'User not found on TaskMaster platform. Please create user first' });
    }
    console.log('2');

    const organization = new Organization({
      name,
      description,
      plan: 'free',
      planValidity: null
    });

    const organizationUser = new OrganisationUser({
      organizationId: organization._id,
      userId: user._id,
      roleType: 'owner', 
      role: 'owner', 
      enrollment: 'joined',
    });

    await organizationUser.save();
    organization.superAdmin = organizationUser._id;
    console.log('A');
    
    await organization.save();
    user.ownedOrganizations.push(organization._id);
    console.log('B');
    
    await user.save(); // todo: cover all 3 saves in single query or in a transaction
    console.log('C');

    res.status(201).json({ success: true, message: 'Organisation created', data:[] });
  } catch (err) {
    res.status(500).json({ success: false, error: 'User creation failed', reason: err });
  }
}

async function fetchOrganizationDetails(req, res) {
  const { organizationId } = req.body;
  
  try {
    const organization = await Organization.findById(organizationId);
    return res.status(200).json({ success: true, data: organization})
  } catch (error) {
    console.log('Error while finding organization', error);
    return res.status(500).json({ success: false, error: 'Internal server error'})
  }
}


export {
  testOrg,
  createOrganisation,
  fetchOrganizationDetails
}