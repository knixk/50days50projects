show databases;

use waiver_form;

show tables;

describe templates;

drop table templates;

select
    *
from
    templates;

CREATE TABLE templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_name VARCHAR(255) NOT NULL,
    template_config JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- CREATE TABLE submissions (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     template_id INT NOT NULL,
--     submission_data JSON NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (template_id) REFERENCES templates(id)
-- );
select
    *
from
    submissions;

-- name contains
SELECT
    *
FROM
    submissions
WHERE
    name LIKE '%John%';

-- mobile numbers contains
SELECT
    *
FROM
    submissions
WHERE
    mobile_number LIKE '%123%';

-- last 7 days
SELECT
    *
FROM
    submissions
WHERE
    submission_date >= CURDATE() - INTERVAL 7 DAY;

drop table submissions;

CREATE TABLE submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_id INT DEFAULT NULL,
    event_id INT DEFAULT NULL,
    submission_data JSON NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) DEFAULT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_name VARCHAR(255),
    device_info JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select
    *
from
    centers;

CREATE TABLE centers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    center_name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    contact_info JSON,
    template_id INT NOT NULL,
    FOREIGN KEY (template_id) REFERENCES templates(id)
);

drop table centers;

CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    event_type VARCHAR(100),
    event_date DATE,
    location VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_name_email_mobile ON submissions (name, email, mobile_number);