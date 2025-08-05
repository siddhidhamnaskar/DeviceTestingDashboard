const express = require('express');
const {
    getAllMqttMacMappings,
    getMqttMacMappingById,
    createMqttMacMapping,
    updateMqttMacMapping,
    deleteMqttMacMapping,
    bulkDeleteMqttMacMappings
} = require('../controllers/mqttMacMapping');

const router = express.Router();

// MQTT Mac Mapping endpoints
router.get('/', getAllMqttMacMappings);
router.get('/:id', getMqttMacMappingById);
router.post('/', createMqttMacMapping);
router.put('/:id', updateMqttMacMapping);
router.delete('/:id', deleteMqttMacMapping);
router.delete('/bulk/delete', bulkDeleteMqttMacMappings);

module.exports = router; 