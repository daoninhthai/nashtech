package com.nashtech.assetmanagementwebservice.entity;


import java.time.LocalDate;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "request")
public class Request {

  @Id
  @Column(name = "id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;

  @Column(name = "accepted_by")
  private String acceptedBy;

  @OneToOne
  @JoinColumn(name = "assignment_id", referencedColumnName = "id")
  private Assignment assignment;

  @Column(name = "returned_date")
  private LocalDate returnedDate;

  @Column(name = "request_by")
  private String requestBy;


  @Column(name = "state")
  private int state;

  public String getRequestBy() {
    return requestBy;
  }

  public void setRequestBy(String requestBy) {
    this.requestBy = requestBy;
  }

  public void setReturnedDate(LocalDate returnedDate) {
    this.returnedDate = returnedDate;
  }

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public Assignment getAssignment() {
    return assignment;
  }

  public void setAssignment(Assignment assignment) {
    this.assignment = assignment;
  }

  public String getAcceptedBy() {
    return acceptedBy;
  }

  public void setAcceptedBy(String username) {
    this.acceptedBy = username;
  }

  public LocalDate getReturnedDate() {
    return returnedDate;
  }

  public int getState() {
    return state;
  }

  public void setState(int state) {
    this.state = state;
  }
}
