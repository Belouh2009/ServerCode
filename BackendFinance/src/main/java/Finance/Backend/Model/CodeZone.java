package Finance.Backend.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "zone")
public class CodeZone {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id_zone;
	
	private String district;
	private String zone0;
	private String zone1;
	
	 @Column(name = "codezone1")  
	private String codeZone1;
	private String zone2;
	
	 @Column(name = "codezone2")  
	private String codeZone2;
	private String zone3;
	
	 @Column(name = "codezone3")  
	private String codeZone3;
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
	public String getZone0() {
		return zone0;
	}
	public void setZone0(String zone0) {
		this.zone0 = zone0;
	}
	public String getZone1() {
		return zone1;
	}
	public void setZone1(String zone1) {
		this.zone1 = zone1;
	}
	public String getCodeZone1() {
		return codeZone1;
	}
	public void setCodeZone1(String codeZone1) {
		this.codeZone1 = codeZone1;
	}
	public String getZone2() {
		return zone2;
	}
	public void setZone2(String zone2) {
		this.zone2 = zone2;
	}
	public String getCodeZone2() {
		return codeZone2;
	}
	public void setCodeZone2(String codeZone2) {
		this.codeZone2 = codeZone2;
	}
	public String getZone3() {
		return zone3;
	}
	public void setZone3(String zone3) {
		this.zone3 = zone3;
	}
	public String getCodeZone3() {
		return codeZone3;
	}
	public void setCodeZone3(String codeZone3) {
		this.codeZone3 = codeZone3;
	}
	public CodeZone(Long id_zone, String district, String zone0, String zone1, String codeZone1, String zone2,
			String codeZone2, String zone3, String codeZone3) {
		super();
		this.id_zone = id_zone;
		this.district = district;
		this.zone0 = zone0;
		this.zone1 = zone1;
		this.codeZone1 = codeZone1;
		this.zone2 = zone2;
		this.codeZone2 = codeZone2;
		this.zone3 = zone3;
		this.codeZone3 = codeZone3;
	}
	public CodeZone() {
		super();
	}
	
	
	
	
}
