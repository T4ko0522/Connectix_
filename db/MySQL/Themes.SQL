CREATE TABLE Themes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    background_color VARCHAR(7),
    text_color VARCHAR(7),
    font_style VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);