CREATE TABLE Profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    display_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(255),
    theme_color VARCHAR(7),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);