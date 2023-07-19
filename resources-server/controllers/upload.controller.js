const PdfModel = require("../models/Pdf.model");

module.exports.uploadPdf = async (req, res) => {
  try {
    const newPdf = await PdfModel.create({
      url: `${global.process.env.BASE_URL}/pdf/${req.file.filename}`,
      name: req.file.filename,
    });
    if (!newPdf) {
      return res.status(400).json({ success: false });
    }
    return res.status(201).json({ success: true, data: newPdf });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};
