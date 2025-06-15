import { OrganisationUser } from "../models/organizationUser.model.js";
import { Organization } from "../models/organization.model.js";
import { User } from "../models/user.model.js";
import { Enrollement } from "../models/enrollment.model.js";
import mongoose, { isValidObjectId } from "mongoose";


// login 
async function loginOrganizationOwner(req, res) {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email: email });
        const ownedOrganizations =user.ownedOrganizations || [];

        if (ownedOrganizations.length === 0) {
            return res.status(404).json({ error: 'No organizations found for this user' });
        }

        // Orgaization name and ID
        const organizationDetails = ownedOrganizations.map(orgId => {
            return Organization.findById(orgId).then(org => {
                if (!org) {
                    return null;
                }
                return {
                    id: org._id,
                    name: org.name
                };
            });
        });

        const organizations = await Promise.all(organizationDetails);

        const validOrganizations = organizations.filter(org => org !== null);
        if (validOrganizations.length === 0) {
            return res.status(404).json({ error: 'No valid organizations found for this user' });
        }
        return res.status(200).json({
            message: 'Successfully logged in as organization owner',
            user: {
                id: user._id,
                email: user.email,
                ownedOrganizations: validOrganizations
            }
        });


    } catch (error) {
        console.error('Error logging in organization owner:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function loginOrganizationAdmin(req, res) {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userActiveOrganizations = user.activeOrganizations || [];
        const userClientOrganizations = user.clientOrganizations || [];

        const organizationIds = [...userActiveOrganizations, ...userClientOrganizations];
        if (organizationIds.length === 0) { 
            return res.status(404).json({ error: 'No organizations found for this user' });
        }


        const userActiveOrganizationDetails = await OrganisationUser.find({ userId: user._id, organizationId: { $in: userActiveOrganizations }, roleType: 'admin' }, {})
            .populate('organizationId', 'name')
            .lean();

        const userClientOrganizationDetails = await OrganisationUser.find({ userId: user._id, organizationId: { $in: userClientOrganizations }, roleType: 'admin' }, {roleType: 1, _id:1})
            .populate('organizationId', 'name')
            .lean();

        if (!userActiveOrganizationDetails || userActiveOrganizationDetails.length === 0) {
            return res.status(404).json({ error: 'No valid organizations found for this user' });
        }
        
        OrganisationUser.find({ userId: user._id, organizationId: { $in: organizationIds } })
        return res.status(200).json({
            message: 'Successfully logged in as organization admin',
            user: {
                id: user._id,
                email: user.email,
                activeOrganizations: userActiveOrganizationDetails,
                clientOrganizations: userClientOrganizationDetails
            }
        });

    } catch (error) {
        console.error('Error logging in organization admin:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function loginOrganizationMember(req, res) {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userActiveOrganizations = user.activeOrganizations || [];
        const userClientOrganizations = user.clientOrganizations || [];

        const organizationIds = [...userActiveOrganizations, ...userClientOrganizations];
        if (organizationIds.length === 0) { 
            return res.status(404).json({ error: 'No organizations found for this user' });
        }


        const userActiveOrganizationDetails = await OrganisationUser.find({ userId: user._id, organizationId: { $in: userActiveOrganizations }, roleType: 'member' })
            .populate('organizationId', 'name')
            .lean();

        const userClientOrganizationDetails = await OrganisationUser.find({ userId: user._id, organizationId: { $in: userClientOrganizations }, roleType: 'member' })
            .populate('organizationId', 'name')
            .lean();

        if (!userActiveOrganizationDetails || userActiveOrganizationDetails.length === 0) {
            return res.status(404).json({ error: 'No valid organizations found for this user' });
        }
        
        OrganisationUser.find({ userId: user._id, organizationId: { $in: organizationIds } })
        return res.status(200).json({
            message: 'Successfully logged in as organization admin',
            user: {
                id: user._id,
                email: user.email,
                activeOrganizations: userActiveOrganizationDetails,
                clientOrganizations: userClientOrganizationDetails
            }
        });
    } catch (error) {
        console.error('Error logging in organization member:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function loginUserByLoginOne(req, res) {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ success: false, error: 'Email is required' });
    }

    try {
        const user = await User.findOne({email: email});
    
        if(!user) {
           return res.status(400).json({success: false, error: 'User not exist. Please create the user'})
        }
    
        const result = await _getUserOrganizations(user._id);
        const ownedOrganizations = result.organisations.filter((org) => user.ownedOrganizations.includes(new mongoose.Types.ObjectId(org.organizationId)));
        const clientOrganizations = result.organisations.filter((org) => user.clientOrganizations.includes(new mongoose.Types.ObjectId(org.organizationId)));
        const activeOrganizations = result.organisations.filter((org) => user.activeOrganizations.includes(new mongoose.Types.ObjectId(org.organizationId)));

        if (ownedOrganizations.length == 0 && clientOrganizations.length == 0 && activeOrganizations.length == 0) {            
            return res.status(200).json({success: false, error: 'No organization enrollement found'});
        }

        return res.status(200).json({success: true, data: {
            user: result.user,
            organizations: {
                ownedOrganizations,
                clientOrganizations,
                activeOrganizations
            }
        }})
    } catch (error) {
        console.log('Error while loginUserByLoginOne: ', error);
        return res.status(500).json({success: false, error: 'Internal server error'})
    }
}

async function _getUserOrganizations(id) {
  const userId = isValidObjectId(id) ? id : mongoose.Types.ObjectId(id);

  try {
    const result = await OrganisationUser.aggregate([
      {
        $match: { userId:  userId}
      },
      {
        $lookup: {
          from: 'organizations',
          localField: 'organizationId',
          foreignField: '_id',
          as: 'organization'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$organization'
      },
      {
        $unwind: '$user'
      },
      {
        $group: {
          _id: '$userId',
          user: { $first: '$user' },
          organisations: {
            $push: {
              organizationId: '$organization._id',
              organizationName: '$organization.name',
              orgainzationUserId: '$_id',
              roleType: '$roleType'
            }
          }
        }
      },
      {
        $project: {
          'user._id': 1,
          'user.name': 1,
          'user.email': 1,
          organisations: 1
        }
      }
    ]);

    return result[0] || { user: null, organisations: [] };
  } catch (error) {
    console.error('Error fetching user organizations:', error);
    throw error;
  }
}

// signup or create or register
async function createUserEnrollmentTicket(req, res) {
    let { caller, targetUser } = req.body;

    if (!caller || !targetUser) {
        return res.status(400).json({ error: 'Caller and target user are required' });
    }

    caller.organizationId = new mongoose.Types.ObjectId(caller.stringOrganisationId);

    try {
        const organization = await Organization.findById({ _id: caller.organizationId });
        const user = await User.findOne({ email: targetUser.email });

        if (!organization || !user) {
            return res.status(404).json({ error: 'Organization or usernot found' });
        }

        const doesOrganizationUserExists = await OrganisationUser.exists({ caller: caller.organizationId, user: user._id });

        // User shoudnt be part of org & shouldnt be in waiting list
        if (doesOrganizationUserExists && !organization.waitingList.includes(doesOrganizationUserExists._id)) {
            return res.status(400).json({ error: 'User already exists in the organization' });
        }

        // todo: no checks roletype and role

        // Trigger when `OrganisationUser` is enrolled but in waiting list
        let newOrganisationUser;
        if (!doesOrganizationUserExists) {
            newOrganisationUser = new OrganisationUser({
                organizationId: caller.organizationId,
                userId: user._id,
                roleType: targetUser.roleType,
                role: targetUser.role,
                enrollment: 'joined',
                accessExpiry: targetUser.accessExpiry || null,
            });

            await newOrganisationUser.save();
        } else {
            newOrganisationUser = doesOrganizationUserExists;
        }

        // create enrollment ticket
        const enrollmentId = `ENROLL-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        const enrollment = new Enrollement({
            enrollmentId: enrollmentId,
            organizationId: caller.organizationId,
            userId: newOrganisationUser._id,
            expiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            isAvailed: false
        });

        await enrollment.save();


        // Add user to waiting list if not already
        if (!organization.waitingList.includes(newOrganisationUser._id)) {
            organization.waitingList.push(newOrganisationUser._id);
            await organization.save();
        }

        return res.status(201).json({ message: 'Enrollment ticket created successfully', enrollmentId });
    } catch (error) {
        console.error('Error creating enrollment ticket:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function enrollOrganizationViaEnrollmentTicket(req, res) {
    const { enrollmentId, email } = req.body;

    if (!enrollmentId) {
        return res.status(400).json({ error: 'Enrollment ID is required' });
    }

    try {
        const enrollment = await Enrollement.findOne({ enrollmentId });
        
        if (!enrollment) {
            return res.status(404).json({ error: 'Enrollment not found' });
        }

        // Check if the enrollment is still valid
        if (enrollment.expiresIn < Date.now()) {
            return res.status(400).json({ error: 'Enrollment ticket has expired. Please request a new enrollment ticket.' });
        }

        // Mark the enrollment as availed
        enrollment.isAvailed = true;
        await enrollment.save();

        const organization = await Organization.findById(enrollment.organizationId);
        if (!organization) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        // todo: optimize this
        organization.waitingList = organization.waitingList.filter(userId => userId.toString() !== enrollment.userId.toString());
        // organization.assignees.push(organisationUser._id);
        organization.assignees.push(enrollment.userId);
        await organization.save();


        const user = await User.findOne({email: email});
        user.activeOrganizations.push(enrollment.organizationId);
        await user.save();
        return res.status(200).json({ message: 'Successfully enrolled in organization', enrollment });
    } catch (error) {
        console.error('Error enrolling in organization:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function enrollOrganizationViaInvitation(req, res) {
    // maybe this is not needed, but we can keep it for future use
}



async function getOrganizationUserDetails(req, res) {

}

async function getOrganizationUsers(req, res) {

}

async function getOrganizationUserById(req, res) {

}

async function updateOrganizationUser(req, res) {

}

async function deleteOrganizationUser(req, res) {

}

async function deleteOrganizationUserById(req, res) {

}

async function deleteOrganizationUserByEmail(req, res) {

}


export {
    createUserEnrollmentTicket,
    enrollOrganizationViaEnrollmentTicket,
    loginOrganizationOwner,
    loginOrganizationAdmin,
    loginOrganizationMember,
    loginUserByLoginOne
}