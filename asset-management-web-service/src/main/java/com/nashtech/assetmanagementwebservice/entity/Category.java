package com.nashtech.assetmanagementwebservice.entity;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "category")
public class Category {
	
	@Id
	@Column(name = "id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(name = "prefix", nullable = false)
	private String prefix;
	
	@Column(name = "name", nullable = false)
	private String name;
	
	@OneToMany(mappedBy = "category")
	private List<Asset> assets;
	
	public Category() {
		super();
	}
	
	//used for testing purpose (JUnit)
	public Category(int id, String name) {
		super();
		this.id = id;
		this.name = name;
	}

	public Category(int id, String prefix, String name) {
		super();
		this.id = id;
		this.prefix = prefix;
		this.name = name;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}
	
	public String getPrefix() {
		return prefix;
	}

	public void setPrefix(String prefix) {
		this.prefix = prefix;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<Asset> getAssets() {
		return assets;
	}

	public void setAssets(List<Asset> assets) {
		this.assets = assets;
	}
	
}
