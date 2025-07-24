package Finance.Backend.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "zone")
public class CodeZone {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id_zone;
	
	private String district;
	
	private Integer code_district;

	private Integer code_localite;

	private String localite;

	private String zone;

	public Long getId_zone() {
		return id_zone;
	}

	public void setId_zone(Long id_zone) {
		this.id_zone = id_zone;
	}

	public String getDistrict() {
		return district;
	}

	public void setDistrict(String district) {
		this.district = district;
	}

	public Integer getCode_district() {
		return code_district;
	}

	public void setCode_district(Integer code_district) {
		this.code_district = code_district;
	}

	public Integer getCode_localite() {
		return code_localite;
	}

	public void setCode_localite(Integer code_localite) {
		this.code_localite = code_localite;
	}

	public String getLocalite() {
		return localite;
	}

	public void setLocalite(String localite) {
		this.localite = localite;
	}

	public String getZone() {
		return zone;
	}

	public void setZone(String zone) {
		this.zone = zone;
	}

	public CodeZone(Long id_zone, String district, Integer code_district, Integer code_localite, String localite,
			String zone) {
		this.id_zone = id_zone;
		this.district = district;
		this.code_district = code_district;
		this.code_localite = code_localite;
		this.localite = localite;
		this.zone = zone;
	}

	public CodeZone() {
	}

	
}
