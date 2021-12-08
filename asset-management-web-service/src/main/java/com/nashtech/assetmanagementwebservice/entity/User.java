package com.nashtech.assetmanagementwebservice.entity;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
@Table(name = "user")
public class User {
    @Id
    @Column(name ="id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "username", unique = true, nullable = false)
    private String username;

    @Column(name = "password")
    private String password;

    @Column(name ="first_name", nullable = false)
    private String firstName;

    @Column(name ="last_name", nullable = false)
    private String lastName;

    @Column(name ="dob")
//    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(pattern="yyyy-MM-dd")
    private LocalDate dob;

    @Column(name ="gender")
    private String gender;

    @Column(name ="joined_date")
//    @Temporal(TemporalType.TIMESTAMP)
    @JsonFormat(pattern="yyyy-MM-dd")
    private LocalDate joinedDate;

    @Column(name = "location")
    private String location;

    @Column(name ="status" )
    private String status;

    @Column(name = "staff_code")
    private String staffCode;

    @OneToOne(mappedBy = "user" ,cascade = CascadeType.ALL)
    private Authority authority;


    
    @OneToMany(mappedBy = "user")
    private List<Assignment> assignments;

//    @OneToOne(mappedBy = "user")
//    private Request request;

    @Column(name = "first_login")
    private String firstLogin;


    @Column(name = "default_password")
    private String defaultPassword;


    public User(String username2, String password, Authority authorities) {
        this.username=username2;
        this.password=password;
        this.authority=authorities;
    }
}
