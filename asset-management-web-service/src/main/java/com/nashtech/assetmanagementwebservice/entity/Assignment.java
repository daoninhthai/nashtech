package com.nashtech.assetmanagementwebservice.entity;

import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import java.time.LocalDate;

import javax.persistence.*;

@Entity
@Table(name = "assignment")
public class Assignment {
	
	@Id
	@Column(name = "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;
	
	@ManyToOne
	@JoinColumn(name = "asset_id")
	private Asset asset;
	
	@Column(name = "assigned_by")
	private String assignedBy;
	
	@Column(name = "assigned_date")
	private LocalDate assignedDate;
	
	@Column(name = "state")
	private int state;
	
	@Column(name = "note")
	private String note;
	
	public Assignment() {
		super();
	}

	public Assignment(int id, User user, Asset asset, LocalDate assignedDate, int state) {
		super();
		this.id = id;
		this.user = user;
		this.asset = asset;
		this.assignedDate = assignedDate;
		this.state = state;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Asset getAsset() {
		return asset;
	}

	public void setAsset(Asset asset) {
		this.asset = asset;
	}
	
	public String getAssignedBy() {
		return assignedBy;
	}

	public void setAssignedBy(String assignedBy) {
		this.assignedBy = assignedBy;
	}

	public LocalDate getAssignedDate() {
		return assignedDate;
	}

	public void setAssignedDate(LocalDate assignedDate) {
		this.assignedDate = assignedDate;
	}

	public int getState() {
		return state;
	}

	public void setState(int state) {
		this.state = state;
	}

	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}

}
