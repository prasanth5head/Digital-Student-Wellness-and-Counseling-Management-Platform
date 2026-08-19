package com.wellness.dto;

public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private UserDTO user;
    private StudentDTO student;
    private CounselorDTO counselor;

    public AuthResponse() {}

    public AuthResponse(String token, String tokenType, UserDTO user, StudentDTO student, CounselorDTO counselor) {
        this.token = token;
        this.tokenType = tokenType != null ? tokenType : "Bearer";
        this.user = user;
        this.student = student;
        this.counselor = counselor;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String token;
        private String tokenType = "Bearer";
        private UserDTO user;
        private StudentDTO student;
        private CounselorDTO counselor;

        public Builder token(String token) { this.token = token; return this; }
        public Builder tokenType(String tokenType) { this.tokenType = tokenType; return this; }
        public Builder user(UserDTO user) { this.user = user; return this; }
        public Builder student(StudentDTO student) { this.student = student; return this; }
        public Builder counselor(CounselorDTO counselor) { this.counselor = counselor; return this; }

        public AuthResponse build() {
            return new AuthResponse(token, tokenType, user, student, counselor);
        }
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }
    public UserDTO getUser() { return user; }
    public void setUser(UserDTO user) { this.user = user; }
    public StudentDTO getStudent() { return student; }
    public void setStudent(StudentDTO student) { this.student = student; }
    public CounselorDTO getCounselor() { return counselor; }
    public void setCounselor(CounselorDTO counselor) { this.counselor = counselor; }
}
