import { pool } from '../config/db.js';

function required(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export async function createEnquiry(req, res, next) {
  try {
    const { name, phone, email = '', district = '', courseInterested, message = '' } = req.body;

    if (!required(name) || !required(phone) || !required(courseInterested)) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone and interested course are required.',
      });
    }

    const [result] = await pool.execute(
      `INSERT INTO enquiries
        (name, phone, email, district, course_interested, message)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        phone.trim(),
        email.trim(),
        district.trim(),
        courseInterested.trim(),
        message.trim(),
      ],
    );

    return res.status(201).json({
      success: true,
      message: 'Enquiry saved successfully.',
      enquiryId: result.insertId,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getEnquiries(_req, res, next) {
  try {
    const [rows] = await pool.execute(
      `SELECT
        id,
        name,
        phone,
        email,
        district,
        course_interested AS courseInterested,
        message,
        status,
        created_at AS createdAt
       FROM enquiries
       ORDER BY created_at DESC`,
    );

    return res.json({ success: true, data: rows });
  } catch (error) {
    return next(error);
  }
}
