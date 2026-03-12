const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams to access :id from parent
const { authenticate } = require('../middleware/auth');
const { createDPR, getDPRsByProject, deleteDPR } = require('../controllers/dprController');

router.use(authenticate);

router.post('/', createDPR);
router.get('/', getDPRsByProject);
router.delete('/:dprId', deleteDPR);

module.exports = router;
