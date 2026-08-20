CREATE DATABASE IF NOT EXISTS paart_academy;
USE paart_academy;

CREATE TABLE IF NOT EXISTS enquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(160) NULL,
  district VARCHAR(120) NULL,
  course_interested VARCHAR(160) NOT NULL,
  message TEXT NULL,
  status ENUM('New', 'Contacted', 'Closed') NOT NULL DEFAULT 'New',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
