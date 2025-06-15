import { Product } from "../models/product.model.js";

async function createOrganisationProduct(req, res) {
    const productData = req.body;
    const organisationId = new mongoose.Types.ObjectId(productData.organisationId)
    const handleBy = new mongoose.Types.ObjectId(productData.handleBy)
    try {
        const newProduct = new Product({
            organisationId: organisationId,
            handleBy: handleBy,
            authRoles: productData.roleType,
            name: productData.name,
            description: productData.description,
            expectedOutcome: productData.expectedOutcome,
            label: productData.label,
            startDate: productData.startDate,
            endDate: productData.endDate,
            sprint: productData.sprint || 1, // Default to 1 if not provided
            sprintDuration: productData.sprintDuration || 2 // Default to 2 weeks
      });
    
      await newProduct.save();
    } catch (error) {
        console.log('Error while creating product details', error);
        return res.status(500).json({ error: 'Internal server error' });
        
    }
}
export  {
    createOrganisationProduct
}