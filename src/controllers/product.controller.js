import mongoose, { isValidObjectId } from "mongoose";
import { Product } from "../models/product.model.js";

async function createOrganisationProduct(req, res) {
    const productData = req.body;
    const organizationId = new mongoose.Types.ObjectId(productData.organizationId)
    const handleBy = new mongoose.Types.ObjectId(productData.handleBy)
    try {
        const newProduct = new Product({
            organizationId: organizationId,
            handleBy: handleBy,
            authRole: productData.roleType,
            name: productData.name,
            description: productData.description,
            expectedOutcome: productData.expectedOutcome,
            label: productData.label,
            startDate: productData.startDate,
            epics: productData.epics,
            stories: productData.stories,
            endDate: productData.endDate,
            sprint: productData.sprint || 1, // Default to 1 if not provided
            sprintDuration: productData.sprintDuration || 2 // Default to 2 weeks
      });
    
      const result = await newProduct.save();
      return res.status(200).json({ success: true, message: 'Product created',data: result });
    } catch (error) {
        console.log('Error while creating product details', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function getOrganisationProducts(req, res) {
    const { organisationId } = req.body;

    if(!isValidObjectId(organisationId)) {
        return res.status(400).json({success: false, error: 'Invalid orgnaizationId'})
    }

    try {
        const products = await Product.find({ organisationId: organisationId })
        .select('-createdAt -updatedAt');
        
        if(products.length == 0)
            return res.status(200).json({ success: false, error: 'Products not created yet' })
    
        return res.status(200).json({ success: true, data: products});
    } catch (error) {
        console.log('Error while fetching org products', error);
        return res.status(500).json({ success: false, error: 'Internal server error' })
    }
}

export  {
    createOrganisationProduct,
    getOrganisationProducts
}