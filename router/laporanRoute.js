const express = require("express");
const router = express.Router();
const {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
  updateBuktiPenyaluran,
  getChart,
} = require("../controller/laporanController");

const upload = require("../middleware/upload");

router.post("/", upload.single("buktiPenyaluran"), createReport);
router.get("/", getReports);
router.get("/chart", getChart);
router.get("/:id", getReportById);
router.put("/:id", updateReport);
router.delete("/:id", deleteReport);
router.put(
  "/:id/bukti-penyaluran",
  upload.single("buktiPenyaluran"),
  updateBuktiPenyaluran,
);

module.exports = router;
