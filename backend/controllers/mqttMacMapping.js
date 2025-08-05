const { MqttMacMapping } = require('../models');
const { Op } = require('sequelize');

// Get all MQTT Mac Mappings with pagination and filtering
const getAllMqttMacMappings = async (req, res) => {
    try {
        console.log('Request query:', req.query);
        
        // Get query parameters for filtering and pagination
        const { MacID, SNoutput, category, limit = 100, offset = 0 } = req.query;
        
        // Build where clause based on provided parameters
        const whereClause = {};
        if (MacID) whereClause.MacID = { [Op.like]: `%${MacID}%` };
        if (SNoutput) whereClause.SNoutput = { [Op.like]: `%${SNoutput}%` };
        if (category) whereClause.category = { [Op.like]: `%${category}%` };
        
        console.log('Where clause:', whereClause);
        
        const mappings = await MqttMacMapping.findAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['lastHeartBeatTime', 'DESC']] // Most recent first
        });
        
        // Get total count for pagination
        const totalCount = await MqttMacMapping.count({ where: whereClause });
        
        res.status(200).json({
            success: true,
            data: mappings,
            pagination: {
                total: totalCount,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: (parseInt(offset) + parseInt(limit)) < totalCount
            }
        });
    } catch (err) {
        console.log('Error in getAllMqttMacMappings:', err);
        res.status(500).json({ status: 500, error: err.message });
    }
};

// Get MQTT Mac Mapping by ID
const getMqttMacMappingById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ error: 'Mapping ID is required' });
        }
        
        const mapping = await MqttMacMapping.findByPk(id);
        
        if (!mapping) {
            return res.status(404).json({ error: 'Mapping not found' });
        }
        
        res.status(200).json({
            success: true,
            data: mapping
        });
    } catch (err) {
        console.log('Error in getMqttMacMappingById:', err);
        res.status(500).json({ status: 500, error: err.message });
    }
};

// Create new MQTT Mac Mapping
const createMqttMacMapping = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        
        if (!req.body) {
            return res.status(400).json({ error: 'Request body is missing' });
        }
        
        const { MacID, SNoutput, category, City, client, site } = req.body;
        
        // Validate required fields
        if (!MacID) {
            return res.status(400).json({ error: 'Mac ID is required' });
        }
        
        // Check for duplicate Mac ID
        const existingMapping = await MqttMacMapping.findOne({
            where: { MacID: MacID.trim() }
        });
        
        if (existingMapping) {
            return res.status(409).json({
                error: 'Mac ID already exists',
                existingMapping: {
                    id: existingMapping.id,
                    MacID: existingMapping.MacID,
                    SNoutput: existingMapping.SNoutput
                }
            });
        }
        
        const newMapping = await MqttMacMapping.create({
            MacID: MacID.trim(),
            SNoutput: SNoutput?.trim() || null,
            category: category?.trim() || null,
            City: City?.trim() || null,
            client: client?.trim() || null,
            site: site?.trim() || null,
            lastHeartBeatTime: new Date().toISOString()
        });
        
        res.status(201).json({
            success: true,
            data: newMapping,
            message: 'Mapping created successfully'
        });
    } catch (err) {
        console.log('Error in createMqttMacMapping:', err);
        res.status(500).json({ status: 500, error: err.message });
    }
};

// Update MQTT Mac Mapping
const updateMqttMacMapping = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Request body:', req.body);
        
        if (!id) {
            return res.status(400).json({ error: 'Mapping ID is required' });
        }
        
        if (!req.body) {
            return res.status(400).json({ error: 'Request body is missing' });
        }
        
        const { MacID, SNoutput, category, City, client, site } = req.body;
        
        // Validate required fields
        if (!MacID) {
            return res.status(400).json({ error: 'Mac ID is required' });
        }
        
        // Check if mapping exists
        const existingMapping = await MqttMacMapping.findByPk(id);
        if (!existingMapping) {
            return res.status(404).json({ error: 'Mapping not found' });
        }
        
        // Check for duplicate Mac ID (only if Mac ID is being changed)
        if (existingMapping.MacID !== MacID.trim()) {
            const duplicateMapping = await MqttMacMapping.findOne({
                where: {
                    MacID: MacID.trim(),
                    id: { [Op.ne]: id } // Exclude current mapping from check
                }
            });
            
            if (duplicateMapping) {
                return res.status(409).json({
                    error: 'Mac ID already exists',
                    existingMapping: {
                        id: duplicateMapping.id,
                        MacID: duplicateMapping.MacID,
                        SNoutput: duplicateMapping.SNoutput
                    }
                });
            }
        }
        
        // Update mapping
        await existingMapping.update({
            MacID: MacID.trim(),
            SNoutput: SNoutput?.trim() || null,
            category: category?.trim() || null,
            City: City?.trim() || null,
            client: client?.trim() || null,
            site: site?.trim() || null
        });
        
        res.status(200).json({
            success: true,
            data: existingMapping,
            message: 'Mapping updated successfully'
        });
    } catch (err) {
        console.log('Error in updateMqttMacMapping:', err);
        res.status(500).json({ status: 500, error: err.message });
    }
};

// Delete MQTT Mac Mapping
const deleteMqttMacMapping = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ error: 'Mapping ID is required' });
        }
        
        // Check if mapping exists
        const existingMapping = await MqttMacMapping.findByPk(id);
        if (!existingMapping) {
            return res.status(404).json({ error: 'Mapping not found' });
        }
        
        // Delete mapping
        await existingMapping.destroy();
        
        res.status(200).json({
            success: true,
            message: 'Mapping deleted successfully'
        });
    } catch (err) {
        console.log('Error in deleteMqttMacMapping:', err);
        res.status(500).json({ status: 500, error: err.message });
    }
};

// Bulk delete MQTT Mac Mappings
const bulkDeleteMqttMacMappings = async (req, res) => {
    try {
        const { ids } = req.body;
        
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: 'Array of mapping IDs is required' });
        }
        
        const results = [];
        const errors = [];
        
        for (const mappingId of ids) {
            try {
                const mapping = await MqttMacMapping.findByPk(mappingId);
                
                if (mapping) {
                    await mapping.destroy();
                    results.push(mappingId);
                } else {
                    errors.push({ id: mappingId, error: 'Mapping not found' });
                }
            } catch (err) {
                errors.push({ id: mappingId, error: err.message });
            }
        }
        
        res.status(200).json({
            success: true,
            message: `Successfully deleted ${results.length} mappings`,
            results: {
                deleted: results,
                errors: errors
            }
        });
    } catch (err) {
        console.log('Error in bulkDeleteMqttMacMappings:', err);
        res.status(500).json({ status: 500, error: err.message });
    }
};

module.exports = {
    getAllMqttMacMappings,
    getMqttMacMappingById,
    createMqttMacMapping,
    updateMqttMacMapping,
    deleteMqttMacMapping,
    bulkDeleteMqttMacMappings
}; 