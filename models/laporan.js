const { DataTypes } = require("sequelize");
const db = require("../config/database");

const Laporan = db.define(
  "Laporan",
  {
    namaProgram: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Nama program harus diisi",
        },
      },
    },
    wilayah: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Wilayah harus diisi",
        },
      },
    },
    jumlahPenerima: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: "Jumlah penerima harus berupa angka",
        },
      },
    },
    tanggalPenyaluran: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: {
          msg: "Tanggal penyaluran harus berupa tanggal yang valid",
        },
      },
    },
    buktiPenyaluran: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    catatanTambahan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    keterangan: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM("Pending", "Disetujui", "Ditolak"),
      allowNull: false,
      defaultValue: "Pending",
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  },
);

module.exports = Laporan;
