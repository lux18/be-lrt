const Report = require("../models/laporan");
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");

const createReport = async (req, res) => {
  console.log("Files:", req.file);

  const {
    namaProgram,
    wilayah,
    jumlahPenerima,
    tanggalPenyaluran,
    catatanTambahan,
    email,
    status,
  } = req.body;

  const file = req.file;
  if (!file) {
    return res
      .status(400)
      .json({ message: "File buktiPenyaluran wajib diupload" });
  }

  try {
    const newReport = await Report.create({
      namaProgram,
      wilayah,
      jumlahPenerima,
      tanggalPenyaluran,
      buktiPenyaluran: file.path,
      catatanTambahan,
      email,
      status,
    });
    return res.status(201).json(newReport);
  } catch (error) {
    console.error("Error creating report:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getReports = async (req, res) => {
  const {
    page = 1,
    limit = 5,
    namaProgram,
    wilayah,
    status,
    sortField = "id",
    sortOrder = "asc",
  } = req.query;

  console.log(namaProgram);

  const validPage = Math.max(parseInt(page, 10) || 1, 1);
  const validLimit = Math.max(parseInt(limit, 10) || 10, 1);

  const offset = (validPage - 1) * validLimit;
  const filters = {};
  if (namaProgram) {
    filters.namaProgram = { [Op.like]: `%${namaProgram}%` };
  }
  if (wilayah) {
    const wilayahUtama = wilayah.split(",")[0].trim();
    filters.wilayah = { [Op.like]: `%${wilayahUtama}%` };
  }
  if (status) {
    filters.status = status;
  }

  const validSortOrder = sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC";
  const validSortField = [
    "id",
    "namaProgram",
    "wilayah",
    "status",
    "tanggalPenyaluran",
    "jumlahPenerima",
  ].includes(sortField)
    ? sortField
    : "id";
  try {
    const { count, rows } = await Report.findAndCountAll({
      where: filters,
      offset,
      limit: validLimit,
      order: [[validSortField, validSortOrder]],
    });

    return res.status(200).json({
      data: rows,
      currentPage: validPage,
      totalPages: Math.ceil(count / validLimit),
      totalReports: count,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getChart = async (req, res) => {
  try {
    const data = await Report.findAndCountAll();

    return res.status(200).json({
      data: data,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getReportById = async (req, res) => {
  const { id } = req.params;

  try {
    const report = await Report.findByPk(id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    return res.status(200).json(report);
  } catch (error) {
    console.error("Error fetching report by ID:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const updateReport = async (req, res) => {
  const { id } = req.params;

  const {
    namaProgram,
    wilayah,
    jumlahPenerima,
    tanggalPenyaluran,
    catatanTambahan,
    status,
    keterangan,
    email,
  } = req.body;

  try {
    const report = await Report.findByPk(id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const oldStatus = report.status;

    report.namaProgram = namaProgram || report.namaProgram;
    report.wilayah = wilayah || report.wilayah;
    report.jumlahPenerima = jumlahPenerima || report.jumlahPenerima;
    report.tanggalPenyaluran = tanggalPenyaluran || report.tanggalPenyaluran;
    report.catatanTambahan = catatanTambahan || report.catatanTambahan;
    report.status = status || report.status;
    report.keterangan = keterangan || report.keterangan;
    report.email = email || report.email;

    await report.save();

    if (status && oldStatus !== status) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "iwaldiputra@gmail.com",
          pass: "fttp nbhg nolk wqnm",
        },
      });

      const mailOptions = {
        from: "iwaldiputra@gmail.com",
        to: report.email,
        subject: "Notifikasi Laporan Bantuan Sosial",
        text: `Laporan anda telah ${status}.`,
      };

      await transporter.sendMail(mailOptions);
    }

    return res.status(200).json(report);
  } catch (error) {
    console.error("Error updating report:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const deleteReport = async (req, res) => {
  const { id } = req.params;

  try {
    const report = await Report.findByPk(id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    await report.destroy();
    return res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const updateBuktiPenyaluran = async (req, res) => {
  const { id } = req.params;

  const file = req.file;
  if (!file) {
    return res
      .status(400)
      .json({ message: "File buktiPenyaluran wajib diupload" });
  }

  try {
    const report = await Report.findByPk(id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.buktiPenyaluran = file.path;

    await report.save();

    return res.status(200).json({
      message: "Bukti penyaluran updated successfully",
      report,
    });
  } catch (error) {
    console.error("Error updating bukti penyaluran:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
  updateBuktiPenyaluran,
  getChart,
};
