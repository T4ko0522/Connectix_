CREATE TABLE Analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    link_id INT NOT NULL,
    clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    FOREIGN KEY (link_id) REFERENCES Links(id) ON DELETE CASCADE
);